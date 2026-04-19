import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsNumber,
  IsOptional,
  IsString,
  IsIn,
  ValidateNested,
} from 'class-validator';
import {
  PROJECT_LIFECYCLE_STATUSES,
  ProjectLifecycleStatusValue,
  WORKFLOW_STATUSES,
  WorkflowStatusValue,
} from '../../../common/constants/workflow';

class ProjectMemberInputDto {
  @IsString()
  researcherId!: string;

  @IsString()
  role!: string;

  @IsOptional()
  isCoPi?: boolean;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  abstract?: string;

  @IsOptional()
  @IsIn(WORKFLOW_STATUSES)
  status?: WorkflowStatusValue;

  @IsOptional()
  @IsIn(PROJECT_LIFECYCLE_STATUSES)
  lifecycleStatus?: ProjectLifecycleStatusValue;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  fundingAgency?: string;

  @IsOptional()
  @IsString()
  jointCountry?: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  facultyId?: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsOptional()
  @IsString()
  principalInvestigatorId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ProjectMemberInputDto)
  members?: ProjectMemberInputDto[];
}
