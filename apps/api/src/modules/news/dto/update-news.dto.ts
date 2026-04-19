import { IsDateString, IsIn, IsOptional, IsString, MaxLength } from 'class-validator';
import { NEWS_CATEGORIES, NewsCategoryValue, WORKFLOW_STATUSES, WorkflowStatusValue } from '../../../common/constants/workflow';

export class UpdateNewsDto {
  @IsOptional()
  @IsString()
  @MaxLength(180)
  title?: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsDateString()
  publishedAt?: string;

  @IsOptional()
  @IsIn(NEWS_CATEGORIES)
  category?: NewsCategoryValue;

  @IsOptional()
  @IsIn(WORKFLOW_STATUSES)
  status?: WorkflowStatusValue;

  @IsOptional()
  @IsString()
  departmentId?: string;
}
