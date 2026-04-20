import { Controller, Get, Param, Query } from '@nestjs/common';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Public } from '../../common/decorators/public.decorator';
import { successResponse } from '../../common/utils/api-response';
import { FacultiesService } from './faculties.service';

@Controller('faculties')
export class FacultiesController {
  constructor(private readonly facultiesService: FacultiesService) {}

  @Public()
  @Get()
  async findAll(@Query() query: PaginationQueryDto) {
    return successResponse(await this.facultiesService.findAll(query));
  }

  @Public()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    return successResponse(await this.facultiesService.findOneBySlug(slug));
  }
}
