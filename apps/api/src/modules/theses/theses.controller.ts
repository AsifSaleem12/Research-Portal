import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { APP_ROLES } from '../../common/constants/roles';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { successResponse } from '../../common/utils/api-response';
import { CreateThesisDto } from './dto/create-thesis.dto';
import { QueryThesesDto } from './dto/query-theses.dto';
import { UpdateThesisDto } from './dto/update-thesis.dto';
import { ThesesService } from './theses.service';

@Controller('theses')
export class ThesesController {
  constructor(private readonly thesesService: ThesesService) {}

  @Public()
  @Get()
  async findAll(@Query() query: QueryThesesDto) {
    return successResponse(await this.thesesService.findAll(query));
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    APP_ROLES.DEPARTMENT_COORDINATOR,
    APP_ROLES.ORIC_STAFF,
    APP_ROLES.PORTAL_ADMIN,
    APP_ROLES.SUPER_ADMIN,
  )
  async findAllForAdmin(@Query() query: QueryThesesDto) {
    return successResponse(await this.thesesService.findAll(query, true));
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return successResponse(await this.thesesService.findOneBySlug(slug));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    APP_ROLES.RESEARCHER,
    APP_ROLES.STUDENT_RESEARCH_ASSISTANT,
    APP_ROLES.DEPARTMENT_COORDINATOR,
    APP_ROLES.ORIC_STAFF,
    APP_ROLES.PORTAL_ADMIN,
    APP_ROLES.SUPER_ADMIN,
  )
  async create(@Body() dto: CreateThesisDto) {
    return successResponse(await this.thesesService.create(dto), 'Thesis created.');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    APP_ROLES.RESEARCHER,
    APP_ROLES.STUDENT_RESEARCH_ASSISTANT,
    APP_ROLES.DEPARTMENT_COORDINATOR,
    APP_ROLES.ORIC_STAFF,
    APP_ROLES.PORTAL_ADMIN,
    APP_ROLES.SUPER_ADMIN,
  )
  async update(@Param('id') id: string, @Body() dto: UpdateThesisDto) {
    return successResponse(await this.thesesService.update(id, dto), 'Thesis updated.');
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
    return successResponse(await this.thesesService.remove(id), 'Thesis deleted.');
  }
}
