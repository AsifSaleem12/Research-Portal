import { Module } from '@nestjs/common';
import { ResearchAreasController } from './research-areas.controller';
import { ResearchAreasService } from './research-areas.service';

@Module({
  controllers: [ResearchAreasController],
  providers: [ResearchAreasService],
})
export class ResearchAreasModule {}
