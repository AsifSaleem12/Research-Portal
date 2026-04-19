import { Injectable, NotFoundException } from '@nestjs/common';
import { WORKFLOW_STATUSES } from '../../common/constants/workflow';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { slugify } from '../../common/utils/slug';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateNewsDto } from './dto/create-news.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';

@Injectable()
export class NewsService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(query: QueryNewsDto, includeUnpublished = false) {
    const { skip, take, page, pageSize } = getPagination(query);
    const where = {
      departmentId: query.departmentId,
      category: query.category,
      status: includeUnpublished ? query.status : 'PUBLISHED',
      OR: query.search
        ? [
            { title: { contains: query.search, mode: 'insensitive' as const } },
            { summary: { contains: query.search, mode: 'insensitive' as const } },
            { content: { contains: query.search, mode: 'insensitive' as const } },
          ]
        : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.newsItem.findMany({
        where,
        skip,
        take,
        orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
        include: {
          department: true,
        },
      }),
      this.prisma.newsItem.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  async findOneBySlug(slug: string, includeUnpublished = false) {
    const item = await this.prisma.newsItem.findUnique({
      where: { slug },
      include: {
        department: true,
        eventActivities: true,
        mediaMentions: true,
        externalLinks: true,
      },
    });

    if (!item || (!includeUnpublished && item.status !== 'PUBLISHED')) {
      throw new NotFoundException('News item not found.');
    }

    return item;
  }

  async create(dto: CreateNewsDto) {
    return this.prisma.newsItem.create({
      data: {
        title: dto.title,
        slug: slugify(dto.title),
        summary: dto.summary,
        content: dto.content,
        featuredImage: dto.featuredImage,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        category: dto.category,
        status: dto.status ?? WORKFLOW_STATUSES[0],
        departmentId: dto.departmentId,
      },
      include: {
        department: true,
      },
    });
  }

  async update(id: string, dto: UpdateNewsDto) {
    const item = await this.prisma.newsItem.findUnique({ where: { id } });

    if (!item) {
      throw new NotFoundException('News item not found.');
    }

    return this.prisma.newsItem.update({
      where: { id },
      data: {
        title: dto.title,
        slug: dto.title ? slugify(dto.title) : undefined,
        summary: dto.summary,
        content: dto.content,
        featuredImage: dto.featuredImage,
        publishedAt: dto.publishedAt ? new Date(dto.publishedAt) : undefined,
        category: dto.category,
        status: dto.status,
        departmentId: dto.departmentId,
      },
      include: {
        department: true,
      },
    });
  }

  async remove(id: string) {
    const item = await this.prisma.newsItem.findUnique({
      where: { id },
      select: { id: true },
    });

    if (!item) {
      throw new NotFoundException('News item not found.');
    }

    await this.prisma.newsItem.delete({
      where: { id },
    });

    return { id };
  }
}
