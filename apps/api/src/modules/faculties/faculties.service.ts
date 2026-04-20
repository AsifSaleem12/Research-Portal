import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FacultiesService {
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
      this.prisma.faculty.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
        include: {
          _count: {
            select: {
              departments: true,
              researchers: true,
              projects: true,
            },
          },
        },
      }),
      this.prisma.faculty.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  async findOneBySlug(slug: string) {
    const faculty = await this.prisma.faculty.findUnique({
      where: { slug },
      include: {
        departments: {
          orderBy: { name: 'asc' },
        },
        researchers: {
          take: 10,
          orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
        },
        projects: {
          take: 10,
          orderBy: { createdAt: 'desc' },
        },
      },
    });

    if (!faculty) {
      throw new NotFoundException('Faculty not found.');
    }

    return faculty;
  }
}
