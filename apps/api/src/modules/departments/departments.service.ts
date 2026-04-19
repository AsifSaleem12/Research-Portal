import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { slugify } from '../../common/utils/slug';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';

@Injectable()
export class DepartmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: PaginationQueryDto) {
    const { skip, take, page, pageSize } = getPagination(query);

    const where = query.search
      ? {
          OR: [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { description: { contains: query.search, mode: 'insensitive' as const } },
          ],
        }
      : {};

    const [items, total] = await this.prisma.$transaction([
      this.prisma.department.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
        include: {
          faculty: true,
          _count: {
            select: {
              researchers: true,
              projects: true,
              publications: true,
              theses: true,
            },
          },
        },
      }),
      this.prisma.department.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  async findOneBySlug(slug: string) {
    const department = await this.prisma.department.findUnique({
      where: { slug },
      include: {
        faculty: true,
        researchers: {
          include: {
            user: { select: { email: true, status: true } },
          },
          take: 8,
          orderBy: { lastName: 'asc' },
        },
        groups: {
          take: 6,
          orderBy: { name: 'asc' },
        },
        projects: {
          take: 6,
          orderBy: { createdAt: 'desc' },
        },
        publications: {
          where: { status: 'PUBLISHED' },
          take: 6,
          orderBy: { publicationDate: 'desc' },
        },
      },
    });

    if (!department) {
      throw new NotFoundException('Department not found.');
    }

    return department;
  }

  async create(dto: CreateDepartmentDto) {
    return this.prisma.department.create({
      data: {
        name: dto.name,
        slug: slugify(dto.name),
        description: dto.description,
        facultyId: dto.facultyId,
      },
    });
  }

  async update(id: string, dto: UpdateDepartmentDto) {
    const department = await this.prisma.department.findUnique({ where: { id } });
    if (!department) {
      throw new NotFoundException('Department not found.');
    }

    return this.prisma.department.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.name ? slugify(dto.name) : undefined,
        description: dto.description,
        facultyId: dto.facultyId,
      },
    });
  }

  async remove(id: string) {
    const department = await this.prisma.department.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!department) {
      throw new NotFoundException('Department not found.');
    }

    await this.prisma.department.delete({
      where: { id },
    });

    return { id };
  }
}
