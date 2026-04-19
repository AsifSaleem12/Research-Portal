import { IsOptional, IsString } from 'class-validator';
import {
  PublicationTypeValue,
  WorkflowStatusValue,
} from '../../../common/constants/workflow';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';

export class QueryPublicationsDto extends PaginationQueryDto {
  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  researchAreaId?: string;

  @IsOptional()
  @IsString()
  authorId?: string;

  @IsOptional()
  publicationType?: PublicationTypeValue;

  @IsOptional()
  status?: WorkflowStatusValue;

  @IsOptional()
  year?: number;
}
