import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { APP_ROLES } from '../../common/constants/roles';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import type { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { successResponse } from '../../common/utils/api-response';
import { CreateResearcherDto } from './dto/create-researcher.dto';
import { QueryResearchersDto } from './dto/query-researchers.dto';
import { UpdateResearcherDto } from './dto/update-researcher.dto';
import { ResearchersService } from './researchers.service';

@Controller('researchers')
export class ResearchersController {
  constructor(private readonly researchersService: ResearchersService) {}

  @Public()
  @Get()
  async findAll(@Query() query: QueryResearchersDto) {
    return successResponse(await this.researchersService.findAll(query));
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return successResponse(await this.researchersService.findOneBySlug(slug));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async create(@Body() dto: CreateResearcherDto) {
    return successResponse(await this.researchersService.create(dto), 'Researcher created.');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(
    APP_ROLES.RESEARCHER,
    APP_ROLES.ORIC_STAFF,
    APP_ROLES.PORTAL_ADMIN,
    APP_ROLES.SUPER_ADMIN,
  )
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateResearcherDto,
    @CurrentUser() actor: AuthenticatedUser,
  ) {
    return successResponse(
      await this.researchersService.update(id, dto, actor),
      'Researcher updated.',
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return successResponse(await this.researchersService.remove(id), 'Researcher deleted.');
  }
}
