import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateResearchAreaDto {
  @IsOptional()
  @IsString()
  @MaxLength(160)
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
