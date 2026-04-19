import { IsOptional, IsString } from 'class-validator';
import { NewsCategoryValue, WorkflowStatusValue } from '../../../common/constants/workflow';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryNewsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  category?: NewsCategoryValue;

  @IsOptional()
  status?: WorkflowStatusValue;
}
