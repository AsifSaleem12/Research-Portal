import { Injectable } from '@nestjs/common';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { PrismaService } from '../../prisma/prisma.service';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';

interface CreateAuditLogInput {
  actorId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  metadata?: Record<string, unknown>;
  ipAddress?: string;
  userAgent?: string;
}

@Injectable()
export class AuditLogsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(input: CreateAuditLogInput) {
    return this.prisma.auditLog.create({
      data: {
        actorId: input.actorId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata as Record<string, unknown> | undefined as never,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
  }

  async findLatest(query: QueryAuditLogsDto) {
    const { skip, take, page, pageSize } = getPagination(query);
    const where = {
      actorId: query.actorId,
      entityType: query.entityType,
      action: query.action
        ? { contains: query.action, mode: 'insensitive' as const }
        : undefined,
      OR: query.search
        ? [
            { action: { contains: query.search, mode: 'insensitive' as const } },
            { entityType: { contains: query.search, mode: 'insensitive' as const } },
            { entityId: { contains: query.search, mode: 'insensitive' as const } },
          ]
        : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.auditLog.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          actor: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }
}
