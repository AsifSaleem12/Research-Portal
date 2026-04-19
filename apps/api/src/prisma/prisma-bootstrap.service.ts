import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { seedDemoData } from './demo-seed';

@Injectable()
export class PrismaBootstrapService implements OnApplicationBootstrap {
  private readonly logger = new Logger(PrismaBootstrapService.name);

  constructor(private readonly prisma: PrismaService) {}

  async onApplicationBootstrap() {
    try {
      const [roleCount, userCount] = await Promise.all([
        this.prisma.role.count(),
        this.prisma.user.count(),
      ]);

      if (roleCount > 0 || userCount > 0) {
        return;
      }

      this.logger.log('Empty database detected. Seeding demo data.');
      await seedDemoData(this.prisma);
      this.logger.log('Demo data seed completed.');
    } catch (error) {
      const message = error instanceof Error ? error.stack ?? error.message : String(error);
      this.logger.error(`Demo data seed skipped due to startup error: ${message}`);
    }
  }
}
