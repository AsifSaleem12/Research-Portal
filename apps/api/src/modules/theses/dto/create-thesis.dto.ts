import { IsDateString, IsIn, IsOptional, IsString } from 'class-validator';
import {
  THESIS_DEGREE_LEVELS,
  ThesisDegreeLevelValue,
  WORKFLOW_STATUSES,
  WorkflowStatusValue,
} from '../../../common/constants/workflow';

export class CreateThesisDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  abstract?: string;

  @IsIn(THESIS_DEGREE_LEVELS)
  degreeLevel!: ThesisDegreeLevelValue;

  @IsString()
  studentName!: string;

  @IsOptional()
  @IsString()
  studentId?: string;

  @IsOptional()
  @IsString()
  supervisorId?: string;

  @IsOptional()
  @IsString()
  coSupervisorId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  facultyId?: string;

  @IsOptional()
  @IsString()
  researchAreaId?: string;

  @IsOptional()
  @IsDateString()
  submissionDate?: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsIn(WORKFLOW_STATUSES)
  status?: WorkflowStatusValue;
}
