import { IsOptional, IsString } from 'class-validator';
import {
  ProjectLifecycleStatusValue,
  WorkflowStatusValue,
} from '../../../common/constants/workflow';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryProjectsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsOptional()
  @IsString()
  fundingAgency?: string;

  @IsOptional()
  status?: WorkflowStatusValue;

  @IsOptional()
  lifecycleStatus?: ProjectLifecycleStatusValue;
}
