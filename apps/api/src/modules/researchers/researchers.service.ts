import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { APP_ROLES } from '../../common/constants/roles';
import type { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { slugify } from '../../common/utils/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { CreateResearcherDto } from './dto/create-researcher.dto';
import { QueryResearchersDto } from './dto/query-researchers.dto';
import { UpdateResearcherDto } from './dto/update-researcher.dto';

@Injectable()
export class ResearchersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

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

  async create(dto: CreateResearcherDto, actor: AuthenticatedUser) {
    const userId = dto.userId ?? (await this.createLinkedResearcherUser(dto));

    const researcher = await this.prisma.researcherProfile.create({
      data: {
        userId,
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

    await this.auditLogsService.create({
      actorId: actor.userId,
      action: 'researcher.create',
      entityType: 'ResearcherProfile',
      entityId: researcher.id,
      metadata: {
        researcherName: `${researcher.firstName} ${researcher.lastName}`,
        linkedUserId: researcher.userId,
      },
    });

    return researcher;
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

  private async createLinkedResearcherUser(dto: CreateResearcherDto) {
    const researcherRole = await this.prisma.role.findUnique({
      where: { name: APP_ROLES.RESEARCHER },
    });

    if (!researcherRole) {
      throw new BadRequestException('Researcher role is not configured.');
    }

    const email = await this.generateUniqueResearcherEmail(dto.firstName, dto.lastName);
    const passwordHash = await bcrypt.hash(`${email}-${Date.now()}`, 10);

    const user = await this.prisma.user.create({
      data: {
        name: `${dto.firstName} ${dto.lastName}`.trim(),
        email,
        passwordHash,
        roleId: researcherRole.id,
        status: 'ACTIVE',
      },
    });

    return user.id;
  }

  private async generateUniqueResearcherEmail(firstName: string, lastName: string) {
    const baseSlug = slugify(`${firstName} ${lastName}`) || `researcher-${Date.now()}`;
    let suffix = 0;

    while (true) {
      const candidate = `${baseSlug}${suffix ? `-${suffix}` : ''}@researcher.local`;
      const existingUser = await this.prisma.user.findUnique({
        where: { email: candidate },
        select: { id: true },
      });

      if (!existingUser) {
        return candidate;
      }

      suffix += 1;
    }
  }
}
