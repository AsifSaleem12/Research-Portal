import { IsIn, IsOptional, IsString } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class SearchQueryDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  q?: string;

  @IsOptional()
  @IsIn([
    'all',
    'researchers',
    'publications',
    'projects',
    'groups',
    'theses',
    'departments',
    'news',
  ])
  scope?: string = 'all';

  @IsOptional()
  @IsString()
  department?: string;

  @IsOptional()
  @IsString()
  type?: string;
}

