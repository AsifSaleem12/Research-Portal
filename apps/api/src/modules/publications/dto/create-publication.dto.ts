import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  IsIn,
  ValidateNested,
} from 'class-validator';
import {
  PUBLICATION_TYPES,
  PublicationTypeValue,
  WORKFLOW_STATUSES,
  WorkflowStatusValue,
} from '../../../common/constants/workflow';

class PublicationAuthorInputDto {
  @IsOptional()
  @IsString()
  researcherId?: string;

  @IsOptional()
  @IsString()
  externalAuthorName?: string;

  @IsInt()
  authorOrder!: number;

  @IsOptional()
  @IsBoolean()
  correspondingAuthor?: boolean;
}

export class CreatePublicationDto {
  @IsString()
  title!: string;

  @IsOptional()
  @IsString()
  abstract?: string;

  @IsIn(PUBLICATION_TYPES)
  publicationType!: PublicationTypeValue;

  @IsOptional()
  @IsString()
  journalName?: string;

  @IsOptional()
  @IsString()
  conferenceName?: string;

  @IsOptional()
  @IsString()
  publisher?: string;

  @IsOptional()
  @IsString()
  jointCountry?: string;

  @IsOptional()
  @IsString()
  doi?: string;

  @IsOptional()
  @IsDateString()
  publicationDate?: string;

  @IsOptional()
  @IsString()
  volume?: string;

  @IsOptional()
  @IsString()
  issue?: string;

  @IsOptional()
  @IsString()
  pages?: string;

  @IsOptional()
  @IsBoolean()
  openAccess?: boolean;

  @IsOptional()
  @IsString()
  fileUrl?: string;

  @IsOptional()
  @IsIn(WORKFLOW_STATUSES)
  status?: WorkflowStatusValue;

  @IsOptional()
  @IsString()
  journalId?: string;

  @IsOptional()
  @IsString()
  conferenceId?: string;

  @IsOptional()
  @IsString()
  groupId?: string;

  @IsOptional()
  @IsString()
  projectId?: string;

  @IsOptional()
  @IsString()
  departmentId?: string;

  @IsOptional()
  @IsString()
  researchAreaId?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PublicationAuthorInputDto)
  authors?: PublicationAuthorInputDto[];

  @IsOptional()
  keywordIds?: string[];
}
