import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { UserStatusValue } from '../../common/constants/workflow';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        role: true,
        researcherProfile: true,
        studentProfile: true,
      },
    });
  }

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        role: true,
        researcherProfile: true,
        studentProfile: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found.');
    }

    return user;
  }

  async findRoleByName(name: string) {
    return this.prisma.role.findUnique({
      where: { name },
    });
  }

  async createUser(data: {
    name: string;
    email: string;
    passwordHash: string;
    roleId: string;
    status?: UserStatusValue;
  }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        passwordHash: data.passwordHash,
        roleId: data.roleId,
        status: data.status ?? 'ACTIVE',
      },
      include: {
        role: true,
      },
    });
  }

  async list(query: PaginationQueryDto & { status?: UserStatusValue }) {
    const { skip, take, page, pageSize } = getPagination(query);

    const where = {
      status: query.status,
      OR: query.search
        ? [
            { name: { contains: query.search, mode: 'insensitive' as const } },
            { email: { contains: query.search, mode: 'insensitive' as const } },
          ]
        : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          role: true,
        },
      }),
      this.prisma.user.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  async updateRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    return this.prisma.user.update({
      where: { id: userId },
      data: { refreshTokenHash },
    });
  }

  async updatePassword(userId: string, passwordHash: string) {
    return this.prisma.user.update({
      where: { id: userId },
      data: {
        passwordHash,
        refreshTokenHash: null,
      },
      include: {
        role: true,
      },
    });
  }
}
