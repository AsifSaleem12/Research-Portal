import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { SearchQueryDto } from './dto/search-query.dto';

type SearchDocument = {
  id: string;
  type: string;
  title: string;
  slug: string;
  href: string;
  description: string;
  meta: string;
};

@Injectable()
export class SearchService {
  constructor(private readonly prisma: PrismaService) {}

  async globalSearch(query: SearchQueryDto) {
    const q = query.q?.trim() ?? '';
    const scope = query.scope ?? 'all';

    const results = await Promise.all([
      scope === 'all' || scope === 'researchers'
        ? this.searchResearchers(q, query.department)
        : Promise.resolve([]),
      scope === 'all' || scope === 'publications'
        ? this.searchPublications(q, query.department, query.type)
        : Promise.resolve([]),
      scope === 'all' || scope === 'projects'
        ? this.searchProjects(q, query.department)
        : Promise.resolve([]),
      scope === 'all' || scope === 'groups'
        ? this.searchGroups(q, query.department)
        : Promise.resolve([]),
      scope === 'all' || scope === 'theses'
        ? this.searchTheses(q, query.department)
        : Promise.resolve([]),
      scope === 'all' || scope === 'departments'
        ? this.searchDepartments(q)
        : Promise.resolve([]),
      scope === 'all' || scope === 'news'
        ? this.searchNews(q, query.department)
        : Promise.resolve([]),
    ]);

    const documents = results.flat();
    const page = query.page ?? 1;
    const pageSize = query.pageSize ?? 10;
    const start = (page - 1) * pageSize;
    const end = start + pageSize;

    return {
      data: documents.slice(start, end),
      meta: {
        total: documents.length,
        page,
        pageSize,
        pageCount: Math.ceil(documents.length / pageSize) || 1,
        engine: 'database-fallback-with-meilisearch-ready-contract',
      },
    };
  }

  async autocomplete(term: string) {
    const q = term.trim();
    if (!q) {
      return [];
    }

    const [researchers, publications, projects] = await Promise.all([
      this.prisma.researcherProfile.findMany({
        where: {
          OR: [
            { firstName: { contains: q, mode: 'insensitive' as const } },
            { lastName: { contains: q, mode: 'insensitive' as const } },
          ],
        },
        select: { slug: true, firstName: true, lastName: true },
        take: 4,
      }),
      this.prisma.publication.findMany({
        where: {
          status: 'PUBLISHED',
          title: { contains: q, mode: 'insensitive' },
        },
        select: { slug: true, title: true },
        take: 4,
      }),
      this.prisma.project.findMany({
        where: {
          status: 'PUBLISHED',
          title: { contains: q, mode: 'insensitive' },
        },
        select: { slug: true, title: true },
        take: 4,
      }),
    ]);

    return [
      ...researchers.map((item: { slug: string; firstName: string; lastName: string }) => ({
        label: `${item.firstName} ${item.lastName}`,
        href: `/researchers/${item.slug}`,
        type: 'researcher',
      })),
      ...publications.map((item: { slug: string; title: string }) => ({
        label: item.title,
        href: `/publications/${item.slug}`,
        type: 'publication',
      })),
      ...projects.map((item: { slug: string; title: string }) => ({
        label: item.title,
        href: `/projects/${item.slug}`,
        type: 'project',
      })),
    ];
  }

  async indexingSummary() {
    const [researchers, publications, projects, groups, theses, departments, news] =
      await Promise.all([
        this.prisma.researcherProfile.count(),
        this.prisma.publication.count(),
        this.prisma.project.count(),
        this.prisma.researchGroup.count(),
        this.prisma.thesis.count(),
        this.prisma.department.count(),
        this.prisma.newsItem.count(),
      ]);

    return {
      indexes: [
        { index: 'researchers', records: researchers },
        { index: 'publications', records: publications },
        { index: 'projects', records: projects },
        { index: 'groups', records: groups },
        { index: 'theses', records: theses },
        { index: 'departments', records: departments },
        { index: 'news', records: news },
      ],
    };
  }

  private async searchResearchers(q: string, department?: string): Promise<SearchDocument[]> {
    const where = {
      department: department
        ? { slug: department }
        : undefined,
      OR: q
        ? [
            { firstName: { contains: q, mode: 'insensitive' as const } },
            { lastName: { contains: q, mode: 'insensitive' as const } },
            { expertiseSummary: { contains: q, mode: 'insensitive' as const } },
          ]
        : undefined,
    };

    const items = await this.prisma.researcherProfile.findMany({
      where,
      include: { department: true },
      take: 20,
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    });

    return items.map((item) => ({
      id: item.id,
      type: 'researcher',
      title: `${item.firstName} ${item.lastName}`,
      slug: item.slug,
      href: `/researchers/${item.slug}`,
      description: item.expertiseSummary ?? item.biography ?? 'Researcher profile',
      meta: item.designation ?? 'Researcher',
    }));
  }

  private async searchPublications(
    q: string,
    department?: string,
    type?: string,
  ): Promise<SearchDocument[]> {
    const items = await this.prisma.publication.findMany({
      where: {
        status: 'PUBLISHED',
        department: department ? { slug: department } : undefined,
        publicationType: type ? (type as never) : undefined,
        OR: q
          ? [
              { title: { contains: q, mode: 'insensitive' } },
              { abstract: { contains: q, mode: 'insensitive' as const } },
              { doi: { contains: q, mode: 'insensitive' as const } },
            ]
          : undefined,
      },
      include: { department: true },
      take: 20,
      orderBy: [{ publicationDate: 'desc' }, { createdAt: 'desc' }],
    });

    return items.map((item) => ({
      id: item.id,
      type: 'publication',
      title: item.title,
      slug: item.slug,
      href: `/publications/${item.slug}`,
      description: item.abstract ?? 'Publication record',
      meta: item.journalName ?? item.conferenceName ?? 'Publication',
    }));
  }

  private async searchProjects(q: string, department?: string): Promise<SearchDocument[]> {
    const items = await this.prisma.project.findMany({
      where: {
        status: 'PUBLISHED',
        department: department ? { slug: department } : undefined,
        OR: q
          ? [
              { title: { contains: q, mode: 'insensitive' as const } },
              { abstract: { contains: q, mode: 'insensitive' as const } },
              { fundingAgency: { contains: q, mode: 'insensitive' as const } },
            ]
          : undefined,
      },
      include: { department: true },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      type: 'project',
      title: item.title,
      slug: item.slug,
      href: `/projects/${item.slug}`,
      description: item.abstract ?? 'Project record',
      meta: item.fundingAgency ?? 'Project',
    }));
  }

  private async searchGroups(q: string, department?: string): Promise<SearchDocument[]> {
    const items = await this.prisma.researchGroup.findMany({
      where: {
        department: department ? { slug: department } : undefined,
        OR: q
          ? [
              { name: { contains: q, mode: 'insensitive' as const } },
              { description: { contains: q, mode: 'insensitive' as const } },
            ]
          : undefined,
      },
      include: { department: true },
      take: 20,
      orderBy: { name: 'asc' },
    });

    return items.map((item) => ({
      id: item.id,
      type: 'group',
      title: item.name,
      slug: item.slug,
      href: `/groups/${item.slug}`,
      description: item.description ?? 'Research group',
      meta: 'Research Group',
    }));
  }

  private async searchTheses(q: string, department?: string): Promise<SearchDocument[]> {
    const items = await this.prisma.thesis.findMany({
      where: {
        status: 'PUBLISHED',
        department: department ? { slug: department } : undefined,
        OR: q
          ? [
              { title: { contains: q, mode: 'insensitive' as const } },
              { abstract: { contains: q, mode: 'insensitive' as const } },
              { studentName: { contains: q, mode: 'insensitive' as const } },
            ]
          : undefined,
      },
      include: { department: true },
      take: 20,
      orderBy: { submissionDate: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      type: 'thesis',
      title: item.title,
      slug: item.slug,
      href: `/theses/${item.slug}`,
      description: item.abstract ?? 'Thesis record',
      meta: `${item.degreeLevel} | ${item.department?.name ?? 'Thesis'}`,
    }));
  }

  private async searchDepartments(q: string): Promise<SearchDocument[]> {
    const items = await this.prisma.department.findMany({
      where: {
        OR: q
          ? [
              { name: { contains: q, mode: 'insensitive' as const } },
              { description: { contains: q, mode: 'insensitive' as const } },
            ]
          : undefined,
      },
      take: 20,
      orderBy: { name: 'asc' },
    });

    return items.map((item) => ({
      id: item.id,
      type: 'department',
      title: item.name,
      slug: item.slug,
      href: `/departments/${item.slug}`,
      description: item.description ?? 'Department',
      meta: 'Academic department',
    }));
  }

  private async searchNews(q: string, department?: string): Promise<SearchDocument[]> {
    const items = await this.prisma.newsItem.findMany({
      where: {
        status: 'PUBLISHED',
        department: department ? { slug: department } : undefined,
        OR: q
          ? [
              { title: { contains: q, mode: 'insensitive' as const } },
              { summary: { contains: q, mode: 'insensitive' as const } },
              { content: { contains: q, mode: 'insensitive' as const } },
            ]
          : undefined,
      },
      take: 20,
      orderBy: { publishedAt: 'desc' },
    });

    return items.map((item) => ({
      id: item.id,
      type: 'news',
      title: item.title,
      slug: item.slug,
      href: `/news`,
      description: item.summary ?? item.content,
      meta: item.category,
    }));
  }
}
