import { Controller, Get, UseGuards } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { APP_ROLES } from '../../common/constants/roles';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { successResponse } from '../../common/utils/api-response';
import { AnalyticsService } from './analytics.service';

@Controller('analytics')
export class AnalyticsController {
  constructor(private readonly analyticsService: AnalyticsService) {}

  @Public()
  @Get('overview')
  async overview() {
    return successResponse(await this.analyticsService.getDashboardMetrics());
  }

  @Public()
  @Get('joint-country-map')
  async jointCountryMap() {
    return successResponse(await this.analyticsService.getJointCountryMapPoints());
  }

  @Get('publications-by-year')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async publicationsByYear() {
    return successResponse(await this.analyticsService.getPublicationsByYear());
  }

  @Get('publications-by-department')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async publicationsByDepartment() {
    return successResponse(await this.analyticsService.getPublicationsByDepartment());
  }

  @Get('projects-by-funding')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async projectsByFunding() {
    return successResponse(await this.analyticsService.getProjectsByFundingAgency());
  }

  @Get('top-research-areas')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async topResearchAreas() {
    return successResponse(await this.analyticsService.getTopResearchAreas());
  }

  @Get('theses-by-year')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async thesesByYear() {
    return successResponse(await this.analyticsService.getThesisSubmissionsByYear());
  }
}
