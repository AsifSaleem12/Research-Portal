import { Injectable, NotFoundException } from '@nestjs/common';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { slugify } from '../../common/utils/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { WORKFLOW_STATUSES } from '../../common/constants/workflow';
import { CreateThesisDto } from './dto/create-thesis.dto';
import { QueryThesesDto } from './dto/query-theses.dto';
import { UpdateThesisDto } from './dto/update-thesis.dto';

@Injectable()
export class ThesesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryThesesDto, includeUnpublished = false) {
    const { skip, take, page, pageSize } = getPagination(query);

    const where = {
      departmentId: query.departmentId,
      degreeLevel: query.degreeLevel,
      status: includeUnpublished ? query.status : 'PUBLISHED',
      submissionDate: query.year
        ? {
            gte: new Date(`${query.year}-01-01T00:00:00.000Z`),
            lte: new Date(`${query.year}-12-31T23:59:59.999Z`),
          }
        : undefined,
      OR: query.search
        ? [
            { title: { contains: query.search, mode: 'insensitive' as const } },
            { studentName: { contains: query.search, mode: 'insensitive' as const } },
            { abstract: { contains: query.search, mode: 'insensitive' as const } },
          ]
        : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.thesis.findMany({
        where,
        skip,
        take,
        orderBy: { submissionDate: 'desc' },
        include: {
          department: true,
          faculty: true,
          supervisor: true,
          coSupervisor: true,
          researchArea: true,
        },
      }),
      this.prisma.thesis.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  async findOneBySlug(slug: string, includeUnpublished = false) {
    const thesis = await this.prisma.thesis.findUnique({
      where: { slug },
      include: {
        department: true,
        faculty: true,
        student: true,
        supervisor: true,
        coSupervisor: true,
        researchArea: true,
        externalLinks: true,
      },
    });

    if (!thesis || (!includeUnpublished && thesis.status !== 'PUBLISHED')) {
      throw new NotFoundException('Thesis not found.');
    }

    return thesis;
  }

  async create(dto: CreateThesisDto) {
    return this.prisma.thesis.create({
      data: {
        title: dto.title,
        slug: slugify(dto.title),
        abstract: dto.abstract,
        degreeLevel: dto.degreeLevel,
        studentName: dto.studentName,
        studentId: dto.studentId,
        supervisorId: dto.supervisorId,
        coSupervisorId: dto.coSupervisorId,
        departmentId: dto.departmentId,
        facultyId: dto.facultyId,
        researchAreaId: dto.researchAreaId,
        submissionDate: dto.submissionDate ? new Date(dto.submissionDate) : undefined,
        fileUrl: dto.fileUrl,
        status: dto.status ?? WORKFLOW_STATUSES[0],
      },
      include: {
        supervisor: true,
        coSupervisor: true,
        department: true,
      },
    });
  }

  async update(id: string, dto: UpdateThesisDto) {
    const existing = await this.prisma.thesis.findUnique({ where: { id } });
    if (!existing) {
      throw new NotFoundException('Thesis not found.');
    }

    return this.prisma.thesis.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.title ? slugify(dto.title) : undefined,
        abstract: dto.abstract,
        degreeLevel: dto.degreeLevel,
        studentName: dto.studentName,
        studentId: dto.studentId,
        supervisorId: dto.supervisorId,
        coSupervisorId: dto.coSupervisorId,
        departmentId: dto.departmentId,
        facultyId: dto.facultyId,
        researchAreaId: dto.researchAreaId,
        submissionDate: dto.submissionDate ? new Date(dto.submissionDate) : undefined,
        fileUrl: dto.fileUrl,
        status: dto.status,
      },
      include: {
        supervisor: true,
        coSupervisor: true,
        department: true,
      },
    });
  }

  async remove(id: string) {
    const thesis = await this.prisma.thesis.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!thesis) {
      throw new NotFoundException('Thesis not found.');
    }

    await this.prisma.thesis.delete({
      where: { id },
    });

    return { id };
  }
}
