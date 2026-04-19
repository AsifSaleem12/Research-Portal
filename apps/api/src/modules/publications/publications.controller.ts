import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { APP_ROLES } from '../../common/constants/roles';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { successResponse } from '../../common/utils/api-response';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { QueryPublicationsDto } from './dto/query-publications.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { PublicationsService } from './publications.service';

@Controller('publications')
export class PublicationsController {
  constructor(private readonly publicationsService: PublicationsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: QueryPublicationsDto) {
    return successResponse(await this.publicationsService.findAll(query));
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    APP_ROLES.DEPARTMENT_COORDINATOR,
    APP_ROLES.ORIC_STAFF,
    APP_ROLES.PORTAL_ADMIN,
    APP_ROLES.SUPER_ADMIN,
  )
  async findAllForAdmin(@Query() query: QueryPublicationsDto) {
    return successResponse(await this.publicationsService.findAll(query, true));
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return successResponse(await this.publicationsService.findOneBySlug(slug));
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
  async create(@Body() dto: CreatePublicationDto) {
    return successResponse(
      await this.publicationsService.create(dto),
      'Publication created.',
    );
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
  async update(@Param('id') id: string, @Body() dto: UpdatePublicationDto) {
    return successResponse(
      await this.publicationsService.update(id, dto),
      'Publication updated.',
    );
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
    return successResponse(await this.publicationsService.remove(id), 'Publication deleted.');
  }
}
