import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { APP_ROLES } from '../../common/constants/roles';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { successResponse } from '../../common/utils/api-response';
import { CreateProjectDto } from './dto/create-project.dto';
import { QueryProjectsDto } from './dto/query-projects.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectsService } from './projects.service';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: QueryProjectsDto) {
    return successResponse(await this.projectsService.findAll(query));
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    APP_ROLES.DEPARTMENT_COORDINATOR,
    APP_ROLES.ORIC_STAFF,
    APP_ROLES.PORTAL_ADMIN,
    APP_ROLES.SUPER_ADMIN,
  )
  async findAllForAdmin(@Query() query: QueryProjectsDto) {
    return successResponse(await this.projectsService.findAll(query, true));
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return successResponse(await this.projectsService.findOneBySlug(slug));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    APP_ROLES.RESEARCHER,
    APP_ROLES.DEPARTMENT_COORDINATOR,
    APP_ROLES.ORIC_STAFF,
    APP_ROLES.PORTAL_ADMIN,
    APP_ROLES.SUPER_ADMIN,
  )
  async create(@Body() dto: CreateProjectDto) {
    return successResponse(await this.projectsService.create(dto), 'Project created.');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    APP_ROLES.RESEARCHER,
    APP_ROLES.DEPARTMENT_COORDINATOR,
    APP_ROLES.ORIC_STAFF,
    APP_ROLES.PORTAL_ADMIN,
    APP_ROLES.SUPER_ADMIN,
  )
  async update(@Param('id') id: string, @Body() dto: UpdateProjectDto) {
    return successResponse(await this.projectsService.update(id, dto), 'Project updated.');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    APP_ROLES.DEPARTMENT_COORDINATOR,
    APP_ROLES.ORIC_STAFF,
    APP_ROLES.PORTAL_ADMIN,
    APP_ROLES.SUPER_ADMIN,
  )
  async remove(@Param('id') id: string) {
    return successResponse(await this.projectsService.remove(id), 'Project deleted.');
  }
}
