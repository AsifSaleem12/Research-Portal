import { Module } from '@nestjs/common';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';
import { ResearchersController } from './researchers.controller';
import { ResearchersService } from './researchers.service';

@Module({
  imports: [AuditLogsModule],
  controllers: [ResearchersController],
  providers: [ResearchersService],
  exports: [ResearchersService],
})
export class ResearchersModule {}
