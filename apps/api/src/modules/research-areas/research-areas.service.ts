import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { slugify } from '../../common/utils/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateResearchAreaDto } from './dto/create-research-area.dto';
import { UpdateResearchAreaDto } from './dto/update-research-area.dto';

@Injectable()
export class ResearchAreasService {
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
      this.prisma.researchArea.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
      }),
      this.prisma.researchArea.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  async findOneBySlug(slug: string) {
    const area = await this.prisma.researchArea.findUnique({
      where: { slug },
      include: {
        publications: true,
        theses: true,
        groups: true,
      },
    });

    if (!area) {
      throw new NotFoundException('Research area not found.');
    }

    return area;
  }

  async create(dto: CreateResearchAreaDto) {
    return this.prisma.researchArea.create({
      data: {
        name: dto.name,
        slug: slugify(dto.name),
        description: dto.description,
      },
    });
  }

  async update(id: string, dto: UpdateResearchAreaDto) {
    const area = await this.prisma.researchArea.findUnique({ where: { id } });

    if (!area) {
      throw new NotFoundException('Research area not found.');
    }

    return this.prisma.researchArea.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.name ? slugify(dto.name) : undefined,
        description: dto.description,
      },
    });
  }

  async remove(id: string) {
    const area = await this.prisma.researchArea.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!area) {
      throw new NotFoundException('Research area not found.');
    }

    await this.prisma.researchArea.delete({
      where: { id },
    });

    return { id };
  }
}
