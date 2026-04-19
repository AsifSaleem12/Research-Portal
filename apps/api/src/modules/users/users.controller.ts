import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { APP_ROLES } from '../../common/constants/roles';
import { UserStatusValue } from '../../common/constants/workflow';
import type { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { successResponse } from '../../common/utils/api-response';
import { UsersService } from './users.service';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async getMe(@CurrentUser() user: AuthenticatedUser) {
    const data = await this.usersService.findById(user.userId);
    return successResponse(data);
  }

  @Get()
  @Roles(APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async findAll(
    @Query() query: PaginationQueryDto,
    @Query('status') status?: UserStatusValue,
  ) {
    const data = await this.usersService.list({
      ...query,
      status,
    });

    return successResponse(data);
  }
}
