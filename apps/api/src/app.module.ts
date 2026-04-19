import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { RolesModule } from './modules/roles/roles.module';
import { ResearchersModule } from './modules/researchers/researchers.module';
import { DepartmentsModule } from './modules/departments/departments.module';
import { FacultiesModule } from './modules/faculties/faculties.module';
import { GroupsModule } from './modules/groups/groups.module';
import { ProjectsModule } from './modules/projects/projects.module';
import { PublicationsModule } from './modules/publications/publications.module';
import { ThesesModule } from './modules/theses/theses.module';
import { ResearchAreasModule } from './modules/research-areas/research-areas.module';
import { NewsModule } from './modules/news/news.module';
import { AnalyticsModule } from './modules/analytics/analytics.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { SearchModule } from './modules/search/search.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    RolesModule,
    ResearchersModule,
    DepartmentsModule,
    FacultiesModule,
    GroupsModule,
    ProjectsModule,
    PublicationsModule,
    ThesesModule,
    ResearchAreasModule,
    NewsModule,
    AnalyticsModule,
    UploadsModule,
    SearchModule,
    AuditLogsModule,
  ],
})
export class AppModule {}

