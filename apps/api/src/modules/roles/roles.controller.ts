import { Controller, Get, UseGuards } from '@nestjs/common';
import { RolesService } from './roles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { APP_ROLES } from '../../common/constants/roles';
import { successResponse } from '../../common/utils/api-response';

@Controller('roles')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Roles(APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async findAll() {
    return successResponse(await this.rolesService.findAll());
  }
}

