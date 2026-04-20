import { Module } from '@nestjs/common';
import { PrismaModule } from '../../prisma/prisma.module';
import { FacultiesController } from './faculties.controller';
import { FacultiesService } from './faculties.service';

@Module({
  imports: [PrismaModule],
  controllers: [FacultiesController],
  providers: [FacultiesService],
  exports: [FacultiesService],
})
export class FacultiesModule {}
