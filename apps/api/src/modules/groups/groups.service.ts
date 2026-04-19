import { Injectable, NotFoundException } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { slugify } from '../../common/utils/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';

@Injectable()
export class GroupsService {
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
      this.prisma.researchGroup.findMany({
        where,
        skip,
        take,
        orderBy: { name: 'asc' },
        include: {
          department: true,
          faculty: true,
          leadResearcher: true,
          _count: {
            select: {
              members: true,
              projects: true,
              publications: true,
            },
          },
        },
      }),
      this.prisma.researchGroup.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  async findOneBySlug(slug: string) {
    const group = await this.prisma.researchGroup.findUnique({
      where: { slug },
      include: {
        department: true,
        faculty: true,
        leadResearcher: true,
        members: {
          include: {
            researcher: true,
          },
        },
        projects: true,
        publications: true,
      },
    });

    if (!group) {
      throw new NotFoundException('Group not found.');
    }

    return group;
  }

  async create(dto: CreateGroupDto) {
    return this.prisma.researchGroup.create({
      data: {
        name: dto.name,
        slug: slugify(dto.name),
        description: dto.description,
        jointCountry: dto.jointCountry,
        departmentId: dto.departmentId,
        facultyId: dto.facultyId,
        leadResearcherId: dto.leadResearcherId,
      },
      include: {
        department: true,
        faculty: true,
        leadResearcher: true,
      },
    });
  }

  async update(id: string, dto: UpdateGroupDto) {
    const group = await this.prisma.researchGroup.findUnique({ where: { id } });

    if (!group) {
      throw new NotFoundException('Group not found.');
    }

    return this.prisma.researchGroup.update({
      where: { id },
      data: {
        name: dto.name,
        slug: dto.name ? slugify(dto.name) : undefined,
        description: dto.description,
        jointCountry: dto.jointCountry,
        departmentId: dto.departmentId,
        facultyId: dto.facultyId,
        leadResearcherId: dto.leadResearcherId,
      },
      include: {
        department: true,
        faculty: true,
        leadResearcher: true,
      },
    });
  }

  async remove(id: string) {
    const group = await this.prisma.researchGroup.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!group) {
      throw new NotFoundException('Group not found.');
    }

    await this.prisma.researchGroup.delete({
      where: { id },
    });

    return { id };
  }
}
