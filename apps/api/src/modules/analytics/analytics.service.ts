import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service';

const JOINT_COUNTRY_COORDINATES: Record<string, { x: number; y: number }> = {
  'United Kingdom': { x: 374, y: 118 },
  Germany: { x: 405, y: 122 },
  'Saudi Arabia': { x: 485, y: 177 },
  China: { x: 655, y: 152 },
  Malaysia: { x: 629, y: 226 },
};

type PublicationMapRecord = Prisma.PublicationGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    abstract: true;
    jointCountry: true;
    publicationType: true;
    year: true;
    publicationDate: true;
  };
}>;

type ProjectMapRecord = Prisma.ProjectGetPayload<{
  select: {
    id: true;
    title: true;
    slug: true;
    abstract: true;
    jointCountry: true;
    lifecycleStatus: true;
    createdAt: true;
  };
}>;

type GroupMapRecord = Prisma.ResearchGroupGetPayload<{
  select: {
    id: true;
    name: true;
    slug: true;
    description: true;
    jointCountry: true;
    createdAt: true;
  };
}>;

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  async getDashboardMetrics() {
    const [
      totalResearchers,
      totalPublications,
      totalProjects,
      totalTheses,
      totalGroups,
      totalDepartments,
      pendingApprovals,
    ] = await Promise.all([
      this.prisma.researcherProfile.count(),
      this.prisma.publication.count(),
      this.prisma.project.count(),
      this.prisma.thesis.count(),
      this.prisma.researchGroup.count(),
      this.prisma.department.count(),
      this.prisma.publication.count({
        where: {
          status: {
            in: [
              'SUBMITTED',
              'UNDER_REVIEW',
              'APPROVED',
            ],
          },
        },
      }),
    ]);

    return {
      totals: {
        researchers: totalResearchers,
        publications: totalPublications,
        projects: totalProjects,
        theses: totalTheses,
        groups: totalGroups,
        departments: totalDepartments,
      },
      pendingApprovals,
    };
  }

  async getPublicationsByYear() {
    const rows = await this.prisma.publication.groupBy({
      by: ['year'],
      _count: { _all: true },
      where: { year: { not: null } },
      orderBy: { year: 'asc' },
    });

    return rows.map((row: { year: number | null; _count: { _all: number } }) => ({
      year: row.year,
      count: row._count._all,
    }));
  }

  async getPublicationsByDepartment() {
    const rows = await this.prisma.department.findMany({
      select: {
        name: true,
        _count: {
          select: {
            publications: true,
          },
        },
      },
      orderBy: { name: 'asc' },
    });

    return rows.map((row: { name: string; _count: { publications: number } }) => ({
      department: row.name,
      count: row._count.publications,
    }));
  }

  async getProjectsByFundingAgency() {
    const projects = await this.prisma.project.findMany({
      select: { fundingAgency: true },
      where: { fundingAgency: { not: null } },
    });

    const grouped = new Map<string, number>();
    for (const project of projects) {
      const key = project.fundingAgency ?? 'Unspecified';
      grouped.set(key, (grouped.get(key) ?? 0) + 1);
    }

    return Array.from(grouped.entries()).map(([agency, count]) => ({
      agency,
      count,
    }));
  }

  async getTopResearchAreas() {
    const rows = await this.prisma.researchArea.findMany({
      select: {
        name: true,
        _count: {
          select: {
            researchers: true,
            publications: true,
            theses: true,
            groups: true,
            datasets: true,
          },
        },
      },
    });

    return rows
      .map((row: { name: string; _count: { researchers: number; publications: number; theses: number; groups: number; datasets: number } }) => ({
        researchArea: row.name,
        score:
          row._count.researchers +
          row._count.publications +
          row._count.theses +
          row._count.groups +
          row._count.datasets,
      }))
      .sort((a: { score: number }, b: { score: number }) => b.score - a.score)
      .slice(0, 10);
  }

  async getThesisSubmissionsByYear() {
    const theses = await this.prisma.thesis.findMany({
      select: { submissionDate: true },
      where: { submissionDate: { not: null } },
    });

    const grouped = new Map<number, number>();
    for (const thesis of theses) {
      if (!thesis.submissionDate) continue;
      const year = thesis.submissionDate.getUTCFullYear();
      grouped.set(year, (grouped.get(year) ?? 0) + 1);
    }

    return Array.from(grouped.entries())
      .sort((a, b) => a[0] - b[0])
      .map(([year, count]) => ({ year, count }));
  }

  async getJointCountryMapPoints() {
    const [publications, projects, groups] = await Promise.all([
      this.prisma.publication.findMany({
        where: { jointCountry: { not: null } },
        select: {
          id: true,
          title: true,
          slug: true,
          abstract: true,
          jointCountry: true,
          publicationType: true,
          year: true,
          publicationDate: true,
        },
        orderBy: [{ publicationDate: 'desc' }, { createdAt: 'desc' }],
      }),
      this.prisma.project.findMany({
        where: { jointCountry: { not: null } },
        select: {
          id: true,
          title: true,
          slug: true,
          abstract: true,
          jointCountry: true,
          lifecycleStatus: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.researchGroup.findMany({
        where: { jointCountry: { not: null } },
        select: {
          id: true,
          name: true,
          slug: true,
          description: true,
          jointCountry: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
    ]);

    return [
      ...publications
        .filter(
          (item: PublicationMapRecord): item is PublicationMapRecord & { jointCountry: string } =>
            Boolean(item.jointCountry && JOINT_COUNTRY_COORDINATES[item.jointCountry]),
        )
        .map((item: PublicationMapRecord & { jointCountry: string }) => ({
          id: `publication-${item.id}`,
          country: item.jointCountry,
          ...JOINT_COUNTRY_COORDINATES[item.jointCountry],
          articleTitle: item.title,
          href: `/publications/${item.slug}`,
          articleType: item.publicationType,
          partnerInstitution: 'International Research Collaboration',
          year:
            item.year?.toString() ??
            item.publicationDate?.getUTCFullYear().toString() ??
            new Date().getUTCFullYear().toString(),
          summary: item.abstract ?? 'Joint publication collaboration record.',
        })),
      ...projects
        .filter(
          (item: ProjectMapRecord): item is ProjectMapRecord & { jointCountry: string } =>
            Boolean(item.jointCountry && JOINT_COUNTRY_COORDINATES[item.jointCountry]),
        )
        .map((item: ProjectMapRecord & { jointCountry: string }) => ({
          id: `project-${item.id}`,
          country: item.jointCountry,
          ...JOINT_COUNTRY_COORDINATES[item.jointCountry],
          articleTitle: item.title,
          href: `/projects/${item.slug}`,
          articleType: item.lifecycleStatus,
          partnerInstitution: 'International Project Collaboration',
          year: item.createdAt.getUTCFullYear().toString(),
          summary: item.abstract ?? 'Joint project collaboration record.',
        })),
      ...groups
        .filter(
          (item: GroupMapRecord): item is GroupMapRecord & { jointCountry: string } =>
            Boolean(item.jointCountry && JOINT_COUNTRY_COORDINATES[item.jointCountry]),
        )
        .map((item: GroupMapRecord & { jointCountry: string }) => ({
          id: `group-${item.id}`,
          country: item.jointCountry,
          ...JOINT_COUNTRY_COORDINATES[item.jointCountry],
          articleTitle: item.name,
          href: `/groups/${item.slug}`,
          articleType: 'Research Group',
          partnerInstitution: 'International Group Collaboration',
          year: item.createdAt.getUTCFullYear().toString(),
          summary: item.description ?? 'Joint research group collaboration record.',
        })),
    ];
  }
}
