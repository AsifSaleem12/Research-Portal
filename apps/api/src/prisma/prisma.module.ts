import { Global, Module } from '@nestjs/common';
import { PrismaBootstrapService } from './prisma-bootstrap.service';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService, PrismaBootstrapService],
  exports: [PrismaService],
})
export class PrismaModule {}
