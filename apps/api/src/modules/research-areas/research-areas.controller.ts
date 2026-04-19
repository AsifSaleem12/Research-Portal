import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { APP_ROLES } from '../../common/constants/roles';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { successResponse } from '../../common/utils/api-response';
import { CreateResearchAreaDto } from './dto/create-research-area.dto';
import { UpdateResearchAreaDto } from './dto/update-research-area.dto';
import { ResearchAreasService } from './research-areas.service';

@Controller('research-areas')
export class ResearchAreasController {
  constructor(private readonly researchAreasService: ResearchAreasService) {}

  @Public()
  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return successResponse(await this.researchAreasService.findAll(query));
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return successResponse(await this.researchAreasService.findOneBySlug(slug));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async create(@Body() dto: CreateResearchAreaDto) {
    return successResponse(await this.researchAreasService.create(dto), 'Research area created.');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateResearchAreaDto) {
    return successResponse(await this.researchAreasService.update(id, dto), 'Research area updated.');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return successResponse(await this.researchAreasService.remove(id), 'Research area deleted.');
  }
}
