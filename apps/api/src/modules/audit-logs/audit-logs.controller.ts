import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuditLogsService } from './audit-logs.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { APP_ROLES } from '../../common/constants/roles';
import { successResponse } from '../../common/utils/api-response';
import { QueryAuditLogsDto } from './dto/query-audit-logs.dto';

@Controller('audit-logs')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AuditLogsController {
  constructor(private readonly auditLogsService: AuditLogsService) {}

  @Get()
  @Roles(APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN, APP_ROLES.ORIC_STAFF)
  async findLatest(@Query() query: QueryAuditLogsDto) {
    const data = await this.auditLogsService.findLatest(query);
    return successResponse(data);
  }
}
