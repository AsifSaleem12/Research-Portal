import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { APP_ROLES } from '../../common/constants/roles';
import type { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { slugify } from '../../common/utils/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateResearcherDto } from './dto/create-researcher.dto';
import { QueryResearchersDto } from './dto/query-researchers.dto';
import { UpdateResearcherDto } from './dto/update-researcher.dto';

@Injectable()
export class ResearchersService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryResearchersDto) {
    const { skip, take, page, pageSize } = getPagination(query);

    const where = {
      departmentId: query.departmentId,
      facultyId: query.facultyId,
      researchAreas: query.researchAreaId
        ? {
            some: { researchAreaId: query.researchAreaId },
          }
        : undefined,
      OR: query.search
        ? [
            { firstName: { contains: query.search, mode: 'insensitive' as const } },
            { lastName: { contains: query.search, mode: 'insensitive' as const } },
            { expertiseSummary: { contains: query.search, mode: 'insensitive' as const } },
          ]
        : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.researcherProfile.findMany({
        where,
        skip,
        take,
        orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        include: {
          department: true,
          faculty: true,
          researchAreas: {
            include: { researchArea: true },
          },
          _count: {
            select: {
              publicationAuthorships: true,
              principalProjects: true,
              groupMemberships: true,
            },
          },
        },
      }),
      this.prisma.researcherProfile.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  async findOneBySlug(slug: string) {
    const researcher = await this.prisma.researcherProfile.findUnique({
      where: { slug },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            status: true,
          },
        },
        department: true,
        faculty: true,
        leadGroups: true,
        groupMemberships: {
          include: {
            group: true,
          },
        },
        principalProjects: {
          take: 6,
          orderBy: { createdAt: 'desc' },
        },
        publicationAuthorships: {
          take: 10,
          orderBy: { authorOrder: 'asc' },
          include: {
            publication: true,
          },
        },
        supervisedTheses: {
          take: 6,
          orderBy: { submissionDate: 'desc' },
        },
        researchAreas: {
          include: {
            researchArea: true,
          },
        },
        awards: true,
        externalLinks: true,
      },
    });

    if (!researcher) {
      throw new NotFoundException('Researcher not found.');
    }

    return researcher;
  }

  async create(dto: CreateResearcherDto) {
    return this.prisma.researcherProfile.create({
      data: {
        userId: dto.userId,
        employeeId: dto.employeeId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        slug: slugify(`${dto.firstName} ${dto.lastName}`),
        designation: dto.designation,
        biography: dto.biography,
        qualifications: dto.qualifications,
        expertiseSummary: dto.expertiseSummary,
        orcid: dto.orcid,
        googleScholar: dto.googleScholar,
        scopusId: dto.scopusId,
        departmentId: dto.departmentId,
        facultyId: dto.facultyId,
        researchAreas: dto.researchAreaIds?.length
          ? {
              createMany: {
                data: dto.researchAreaIds.map((researchAreaId) => ({
                  researchAreaId,
                })),
              },
            }
          : undefined,
      },
      include: {
        department: true,
        faculty: true,
      },
    });
  }

  async update(id: string, dto: UpdateResearcherDto, actor: AuthenticatedUser) {
    const existing = await this.prisma.researcherProfile.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!existing) {
      throw new NotFoundException('Researcher not found.');
    }

    const isOwner = existing.userId === actor.userId;
    const isAdmin =
      actor.role === APP_ROLES.PORTAL_ADMIN ||
      actor.role === APP_ROLES.SUPER_ADMIN ||
      actor.role === APP_ROLES.ORIC_STAFF;

    if (!isOwner && !isAdmin) {
      throw new ForbiddenException('You can only edit your own researcher profile.');
    }

    await this.prisma.researcherResearchArea.deleteMany({
      where: { researcherId: id },
    });

    return this.prisma.researcherProfile.update({
      where: { id },
      data: {
        employeeId: dto.employeeId,
        firstName: dto.firstName,
        lastName: dto.lastName,
        slug:
          dto.firstName || dto.lastName
            ? slugify(`${dto.firstName ?? existing.firstName} ${dto.lastName ?? existing.lastName}`)
            : undefined,
        designation: dto.designation,
        biography: dto.biography,
        qualifications: dto.qualifications,
        expertiseSummary: dto.expertiseSummary,
        orcid: dto.orcid,
        googleScholar: dto.googleScholar,
        scopusId: dto.scopusId,
        departmentId: dto.departmentId,
        facultyId: dto.facultyId,
        researchAreas: dto.researchAreaIds?.length
          ? {
              createMany: {
                data: dto.researchAreaIds.map((researchAreaId) => ({
                  researchAreaId,
                })),
              },
            }
          : undefined,
      },
      include: {
        department: true,
        faculty: true,
        researchAreas: { include: { researchArea: true } },
      },
    });
  }

  async remove(id: string) {
    const researcher = await this.prisma.researcherProfile.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!researcher) {
      throw new NotFoundException('Researcher not found.');
    }

    await this.prisma.researcherProfile.delete({
      where: { id },
    });

    return { id };
  }
}
