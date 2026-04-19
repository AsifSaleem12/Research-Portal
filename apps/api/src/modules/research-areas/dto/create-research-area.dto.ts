import { IsOptional, IsString, MaxLength } from 'class-validator';

export class CreateResearchAreaDto {
  @IsString()
  @MaxLength(160)
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;
}
