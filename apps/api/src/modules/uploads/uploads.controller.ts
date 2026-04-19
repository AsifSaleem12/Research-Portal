import {
  BadRequestException,
  Controller,
  Get,
  Post,
  Query,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';
import { APP_ROLES } from '../../common/constants/roles';
import { FileAssetKindValue } from '../../common/constants/workflow';
import type { AuthenticatedUser } from '../../common/interfaces/authenticated-user.interface';
import { successResponse } from '../../common/utils/api-response';
import { AuditLogsService } from '../audit-logs/audit-logs.service';
import { ListUploadsDto } from './dto/list-uploads.dto';
import { UploadsService } from './uploads.service';

@Controller('uploads')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UploadsController {
  constructor(
    private readonly uploadsService: UploadsService,
    private readonly auditLogsService: AuditLogsService,
  ) {}

  @Post()
  @Roles(
    APP_ROLES.RESEARCHER,
    APP_ROLES.DEPARTMENT_COORDINATOR,
    APP_ROLES.ORIC_STAFF,
    APP_ROLES.PORTAL_ADMIN,
    APP_ROLES.SUPER_ADMIN,
  )
  @UseInterceptors(
    FileInterceptor('file', {
      storage: memoryStorage(),
      limits: { fileSize: 10 * 1024 * 1024 },
    }),
  )
  async upload(
    @UploadedFile() file?: Express.Multer.File,
    @Query('kind') kind?: FileAssetKindValue,
    @CurrentUser() actor?: AuthenticatedUser,
  ) {
    if (!file) {
      throw new BadRequestException('A file is required.');
    }

    const allowedMimeTypes = new Set([
      'application/pdf',
      'image/jpeg',
      'image/png',
      'image/webp',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ]);

    if (!allowedMimeTypes.has(file.mimetype)) {
      throw new BadRequestException('Unsupported file type.');
    }

    const data = await this.uploadsService.createAsset({ file, kind });
    await this.auditLogsService.create({
      actorId: actor?.userId,
      action: 'upload.create',
      entityType: 'FileAsset',
      entityId: data.id,
      metadata: {
        originalName: data.originalName,
        kind: data.kind,
      },
    });
    return successResponse(data, 'File uploaded successfully.');
  }

  @Get()
  @Roles(APP_ROLES.ORIC_STAFF, APP_ROLES.PORTAL_ADMIN, APP_ROLES.SUPER_ADMIN)
  async list(@Query() query: ListUploadsDto) {
    return successResponse(await this.uploadsService.listAssets(query));
  }
}
