import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { APP_ROLES } from '../../common/constants/roles';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { successResponse } from '../../common/utils/api-response';
import { CreateGroupDto } from './dto/create-group.dto';
import { UpdateGroupDto } from './dto/update-group.dto';
import { GroupsService } from './groups.service';

@Controller('groups')
export class GroupsController {
  constructor(private readonly groupsService: GroupsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return successResponse(await this.groupsService.findAll(query));
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return successResponse(await this.groupsService.findOneBySlug(slug));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async create(@Body() dto: CreateGroupDto) {
    return successResponse(await this.groupsService.create(dto), 'Group created.');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateGroupDto) {
    return successResponse(await this.groupsService.update(id, dto), 'Group updated.');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return successResponse(await this.groupsService.remove(id), 'Group deleted.');
  }
}
