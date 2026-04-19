import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { slugify } from '../../common/utils/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { PublicationTypeValue, WORKFLOW_STATUSES } from '../../common/constants/workflow';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { QueryPublicationsDto } from './dto/query-publications.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';

@Injectable()
export class PublicationsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryPublicationsDto, includeUnpublished = false) {
    const { skip, take, page, pageSize } = getPagination(query);

    const where = {
      departmentId: query.departmentId,
      researchAreaId: query.researchAreaId,
      publicationType: query.publicationType as PublicationTypeValue | undefined,
      year: query.year,
      status: includeUnpublished ? query.status : 'PUBLISHED',
      authors: query.authorId
        ? {
            some: {
              researcherId: query.authorId,
            },
          }
        : undefined,
      OR: query.search
        ? [
            { title: { contains: query.search, mode: 'insensitive' as const } },
            { abstract: { contains: query.search, mode: 'insensitive' as const } },
            { doi: { contains: query.search, mode: 'insensitive' as const } },
          ]
        : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.publication.findMany({
        where,
        skip,
        take,
        orderBy: [{ publicationDate: 'desc' }, { createdAt: 'desc' }],
        include: {
          journal: true,
          conference: true,
          department: true,
          researchArea: true,
          authors: {
            orderBy: { authorOrder: 'asc' },
            include: { researcher: true },
          },
          keywords: true,
        },
      }),
      this.prisma.publication.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  async findOneBySlug(slug: string, includeUnpublished = false) {
    const publication = await this.prisma.publication.findUnique({
      where: { slug },
      include: {
        journal: true,
        conference: true,
        group: true,
        project: true,
        department: true,
        researchArea: true,
        authors: {
          orderBy: { authorOrder: 'asc' },
          include: { researcher: true },
        },
        keywords: true,
        datasets: true,
        externalLinks: true,
      },
    });

    if (!publication || (!includeUnpublished && publication.status !== 'PUBLISHED')) {
      throw new NotFoundException('Publication not found.');
    }

    return publication;
  }

  async create(dto: CreatePublicationDto) {
    await this.ensurePublicationNotDuplicate(dto);

    const publicationDate = dto.publicationDate ? new Date(dto.publicationDate) : undefined;

    return this.prisma.publication.create({
      data: {
        title: dto.title,
        slug: slugify(dto.title),
        abstract: dto.abstract,
        jointCountry: dto.jointCountry,
        publicationType: dto.publicationType,
        journalName: dto.journalName,
        conferenceName: dto.conferenceName,
        publisher: dto.publisher,
        doi: dto.doi,
        publicationDate,
        year: publicationDate?.getUTCFullYear(),
        volume: dto.volume,
        issue: dto.issue,
        pages: dto.pages,
        openAccess: dto.openAccess ?? false,
        fileUrl: dto.fileUrl,
        status: dto.status ?? WORKFLOW_STATUSES[0],
        journalId: dto.journalId,
        conferenceId: dto.conferenceId,
        groupId: dto.groupId,
        projectId: dto.projectId,
        departmentId: dto.departmentId,
        researchAreaId: dto.researchAreaId,
        authors: dto.authors?.length
          ? {
              create: dto.authors.map((author) => ({
                researcherId: author.researcherId,
                externalAuthorName: author.externalAuthorName,
                authorOrder: author.authorOrder,
                correspondingAuthor: Boolean(author.correspondingAuthor),
              })),
            }
          : undefined,
        keywords: dto.keywordIds?.length
          ? {
              connect: dto.keywordIds.map((id) => ({ id })),
            }
          : undefined,
      },
      include: {
        authors: { include: { researcher: true } },
        keywords: true,
      },
    });
  }

  async update(id: string, dto: UpdatePublicationDto) {
    const existing = await this.prisma.publication.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Publication not found.');
    }

    if (dto.doi && dto.doi !== existing.doi) {
      const duplicateDoi = await this.prisma.publication.findUnique({
        where: { doi: dto.doi },
      });
      if (duplicateDoi) {
        throw new BadRequestException('A publication with this DOI already exists.');
      }
    }

    if (dto.authors) {
      await this.prisma.publicationAuthor.deleteMany({
        where: { publicationId: id },
      });
    }

    const publicationDate = dto.publicationDate ? new Date(dto.publicationDate) : undefined;

    return this.prisma.publication.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.title ? slugify(dto.title) : undefined,
        abstract: dto.abstract,
        jointCountry: dto.jointCountry,
        publicationType: dto.publicationType,
        journalName: dto.journalName,
        conferenceName: dto.conferenceName,
        publisher: dto.publisher,
        doi: dto.doi,
        publicationDate,
        year: publicationDate?.getUTCFullYear(),
        volume: dto.volume,
        issue: dto.issue,
        pages: dto.pages,
        openAccess: dto.openAccess,
        fileUrl: dto.fileUrl,
        status: dto.status,
        journalId: dto.journalId,
        conferenceId: dto.conferenceId,
        groupId: dto.groupId,
        projectId: dto.projectId,
        departmentId: dto.departmentId,
        researchAreaId: dto.researchAreaId,
        authors: dto.authors?.length
          ? {
              create: dto.authors.map((author) => ({
                researcherId: author.researcherId,
                externalAuthorName: author.externalAuthorName,
                authorOrder: author.authorOrder,
                correspondingAuthor: Boolean(author.correspondingAuthor),
              })),
            }
          : undefined,
        keywords: dto.keywordIds
          ? {
              set: dto.keywordIds.map((keywordId) => ({ id: keywordId })),
            }
          : undefined,
      },
      include: {
        authors: {
          orderBy: { authorOrder: 'asc' },
          include: { researcher: true },
        },
        keywords: true,
      },
    });
  }

  async remove(id: string) {
    const publication = await this.prisma.publication.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!publication) {
      throw new NotFoundException('Publication not found.');
    }

    await this.prisma.publication.delete({
      where: { id },
    });

    return { id };
  }

  private async ensurePublicationNotDuplicate(dto: CreatePublicationDto) {
    if (dto.doi) {
      const existingByDoi = await this.prisma.publication.findUnique({
        where: { doi: dto.doi },
      });

      if (existingByDoi) {
        throw new BadRequestException('A publication with this DOI already exists.');
      }
    }

    const publicationDate = dto.publicationDate ? new Date(dto.publicationDate) : undefined;
    const possibleDuplicate = await this.prisma.publication.findFirst({
      where: {
        title: { equals: dto.title, mode: 'insensitive' as const },
        year: publicationDate?.getUTCFullYear(),
      },
    });

    if (possibleDuplicate) {
      throw new BadRequestException(
        'A similar publication title already exists for the selected year.',
      );
    }
  }
}
