import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { APP_ROLES } from '../../common/constants/roles';
import { Public } from '../../common/decorators/public.decorator';
import { Roles } from '../../common/decorators/roles.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { successResponse } from '../../common/utils/api-response';
import { CreateNewsDto } from './dto/create-news.dto';
import { QueryNewsDto } from './dto/query-news.dto';
import { UpdateNewsDto } from './dto/update-news.dto';
import { NewsService } from './news.service';

@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Public()
  @Get()
  async findAll(@Query() query: QueryNewsDto) {
    return successResponse(await this.newsService.findAll(query));
  }

  @Get('admin/all')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async findAllForAdmin(@Query() query: QueryNewsDto) {
    return successResponse(await this.newsService.findAll(query, true));
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return successResponse(await this.newsService.findOneBySlug(slug));
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async create(@Body() dto: CreateNewsDto) {
    return successResponse(await this.newsService.create(dto), 'News item created.');
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() dto: UpdateNewsDto) {
    return successResponse(await this.newsService.update(id, dto), 'News item updated.');
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async remove(@Param('id') id: string) {
    return successResponse(await this.newsService.remove(id), 'News item deleted.');
  }
}
