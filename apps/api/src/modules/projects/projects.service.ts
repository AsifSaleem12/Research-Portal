import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { slugify } from '../../common/utils/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { WORKFLOW_STATUSES } from '../../common/constants/workflow';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryProjectsDto, includeUnpublished = false) {
    const { skip, take, page, pageSize } = getPagination(query);

    const where = {
      departmentId: query.departmentId,
      groupId: query.groupId,
      fundingAgency: query.fundingAgency,
      lifecycleStatus: query.lifecycleStatus,
      status: includeUnpublished ? query.status : 'PUBLISHED',
      OR: query.search
        ? [
            { title: { contains: query.search, mode: 'insensitive' as const } },
            { abstract: { contains: query.search, mode: 'insensitive' as const } },
          ]
        : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.project.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          department: true,
          faculty: true,
          group: true,
          principalInvestigator: true,
          members: {
            include: {
              researcher: true,
            },
          },
        },
      }),
      this.prisma.project.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  async findOneBySlug(slug: string, includeUnpublished = false) {
    const project = await this.prisma.project.findUnique({
      where: { slug },
      include: {
        department: true,
        faculty: true,
        group: true,
        principalInvestigator: true,
        members: {
          include: { researcher: true },
        },
        publications: true,
        externalLinks: true,
      },
    });

    if (!project || (!includeUnpublished && project.status !== 'PUBLISHED')) {
      throw new NotFoundException('Project not found.');
    }

    return project;
  }

  async create(dto: CreateProjectDto) {
    return this.prisma.project.create({
      data: {
        title: dto.title,
        slug: slugify(dto.title),
        abstract: dto.abstract,
        jointCountry: dto.jointCountry,
        status: dto.status ?? WORKFLOW_STATUSES[0],
        lifecycleStatus: dto.lifecycleStatus,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        fundingAgency: dto.fundingAgency,
        budget: dto.budget,
        departmentId: dto.departmentId,
        facultyId: dto.facultyId,
        groupId: dto.groupId,
        principalInvestigatorId: dto.principalInvestigatorId,
        members: dto.members?.length
          ? {
              create: dto.members.map((member) => ({
                researcherId: member.researcherId,
                role: member.role,
                isCoPi: Boolean(member.isCoPi),
              })),
            }
          : undefined,
      },
      include: {
        principalInvestigator: true,
        members: { include: { researcher: true } },
      },
    });
  }

  async update(id: string, dto: UpdateProjectDto) {
    const existing = await this.prisma.project.findUnique({ where: { id } });

    if (!existing) {
      throw new NotFoundException('Project not found.');
    }

    if (dto.members) {
      await this.prisma.projectMember.deleteMany({
        where: { projectId: id },
      });
    }

    return this.prisma.project.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.title ? slugify(dto.title) : undefined,
        abstract: dto.abstract,
        jointCountry: dto.jointCountry,
        status: dto.status,
        lifecycleStatus: dto.lifecycleStatus,
        startDate: dto.startDate ? new Date(dto.startDate) : undefined,
        endDate: dto.endDate ? new Date(dto.endDate) : undefined,
        fundingAgency: dto.fundingAgency,
        budget: dto.budget,
        departmentId: dto.departmentId,
        facultyId: dto.facultyId,
        groupId: dto.groupId,
        principalInvestigatorId: dto.principalInvestigatorId,
        members: dto.members?.length
          ? {
              create: dto.members.map((member) => ({
                researcherId: member.researcherId,
                role: member.role,
                isCoPi: Boolean(member.isCoPi),
              })),
            }
          : undefined,
      },
      include: {
        principalInvestigator: true,
        members: { include: { researcher: true } },
      },
    });
  }

  async remove(id: string) {
    const project = await this.prisma.project.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!project) {
      throw new NotFoundException('Project not found.');
    }

    await this.prisma.project.delete({
      where: { id },
    });

    return { id };
  }
}
