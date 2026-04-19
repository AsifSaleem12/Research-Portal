import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { extname, join } from 'path';
import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import { PrismaService } from '../../prisma/prisma.service';
import { getPagination, toPaginatedResult } from '../../common/utils/pagination';
import { FileAssetKindValue } from '../../common/constants/workflow';
import { ListUploadsDto } from './dto/list-uploads.dto';

type UploadInput = {
  file: Express.Multer.File;
  kind?: FileAssetKindValue;
};

@Injectable()
export class UploadsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async createAsset(input: UploadInput) {
    const uploadRoot = this.resolveUploadRoot();
    await fs.mkdir(uploadRoot, { recursive: true });

    const extension = extname(input.file.originalname);
    const storedName = `${randomUUID()}${extension}`;
    const fullPath = join(uploadRoot, storedName);

    await fs.writeFile(fullPath, input.file.buffer);

    return this.prisma.fileAsset.create({
      data: {
        originalName: input.file.originalname,
        storedName,
        mimeType: input.file.mimetype,
        extension,
        sizeBytes: input.file.size,
        path: fullPath,
        url: `/uploads/${storedName}`,
        kind: input.kind ?? 'DOCUMENT',
        storageDriver: 'LOCAL',
      },
    });
  }

  async listAssets(query: ListUploadsDto) {
    const { skip, take, page, pageSize } = getPagination(query);
    const where = {
      kind: query.kind as never,
      OR: query.search
        ? [
            { originalName: { contains: query.search, mode: 'insensitive' as const } },
            { mimeType: { contains: query.search, mode: 'insensitive' as const } },
          ]
        : undefined,
    };

    const [items, total] = await this.prisma.$transaction([
      this.prisma.fileAsset.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.fileAsset.count({ where }),
    ]);

    return toPaginatedResult(items, total, page, pageSize);
  }

  private resolveUploadRoot() {
    const configuredRoot =
      this.configService.get<string>('FILE_STORAGE_LOCAL_ROOT') ?? './uploads';
    return join(process.cwd(), configuredRoot);
  }
}
