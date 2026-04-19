import { IsOptional, IsString } from 'class-validator';
import {
  ThesisDegreeLevelValue,
  WorkflowStatusValue,
} from '../../../common/constants/workflow';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryThesesDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  degreeLevel?: ThesisDegreeLevelValue;

  @IsOptional()
  status?: WorkflowStatusValue;

  @IsOptional()
  year?: number;
}
