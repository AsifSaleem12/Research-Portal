import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateResearcherDto {
  @IsString()
  userId!: string;

  @IsOptional()
  @IsString()
  employeeId?: string;

  @IsString()
  @MaxLength(80)
  firstName!: string;

  @IsString()
  @MaxLength(80)
  lastName!: string;

  @IsOptional()
  @IsString()
  designation?: string;

  @IsOptional()
  @IsString()
  biography?: string;

  @IsOptional()
  @IsString()
  qualifications?: string;

  @IsOptional()
  @IsString()
  expertiseSummary?: string;

  @IsOptional()
  @IsString()
  orcid?: string;

  @IsOptional()
  @IsString()
  googleScholar?: string;

  @IsOptional()
  @IsString()
  scopusId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  facultyId?: string;

  @IsOptional()
  researchAreaIds?: string[];
}

