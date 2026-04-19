import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { APP_ROLES } from '../../common/constants/roles';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { successResponse } from '../../common/utils/api-response';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentsService } from './departments.service';

@Controller('departments')
export class DepartmentsController {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return successResponse(await this.departmentsService.findAll(query));
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return successResponse(await this.departmentsService.findOneBySlug(slug));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async create(@Body() dto: CreateDepartmentDto) {
    return successResponse(await this.departmentsService.create(dto), 'Department created.');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateDepartmentDto) {
    return successResponse(await this.departmentsService.update(id, dto), 'Department updated.');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return successResponse(await this.departmentsService.remove(id), 'Department deleted.');
  }
}
