import { Controller, Get, Query } from '@nestjs/common';
import { Public } from '../../common/decorators/public.decorator';
import { successResponse } from '../../common/utils/api-response';
import { SearchQueryDto } from './dto/search-query.dto';
import { SearchService } from './search.service';

@Controller('search')
export class SearchController {
  constructor(private readonly searchService: SearchService) {}

  @Public()
  @Get()
  async search(@Query() query: SearchQueryDto) {
    return successResponse(await this.searchService.globalSearch(query));
  }

  @Public()
  @Get('autocomplete')
  async autocomplete(@Query('q') q?: string) {
    return successResponse(await this.searchService.autocomplete(q ?? ''));
  }

  @Get('indexes')
  async indexes() {
    return successResponse(await this.searchService.indexingSummary());
  }
}

