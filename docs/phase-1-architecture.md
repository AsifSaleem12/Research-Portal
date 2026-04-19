# Phase 1 Architecture

## 1. Recommended Monorepo Folder Structure

```text
lgu-research-portal/
|-- apps/
|   |-- api/
|   |   |-- prisma/
|   |   |   `-- schema.prisma
|   |   |-- src/
|   |   |   |-- app.module.ts
|   |   |   |-- main.ts
|   |   |   |-- common/
|   |   |   |   |-- constants/
|   |   |   |   |-- decorators/
|   |   |   |   |-- dto/
|   |   |   |   |-- filters/
|   |   |   |   |-- guards/
|   |   |   |   |-- interceptors/
|   |   |   |   `-- utils/
|   |   |   |-- config/
|   |   |   |   |-- app.config.ts
|   |   |   |   |-- auth.config.ts
|   |   |   |   |-- database.config.ts
|   |   |   |   |-- search.config.ts
|   |   |   |   `-- storage.config.ts
|   |   |   |-- modules/
|   |   |   |   |-- analytics/
|   |   |   |   |-- audit-logs/
|   |   |   |   |-- auth/
|   |   |   |   |-- departments/
|   |   |   |   |-- faculties/
|   |   |   |   |-- groups/
|   |   |   |   |-- news/
|   |   |   |   |-- projects/
|   |   |   |   |-- publications/
|   |   |   |   |-- research-areas/
|   |   |   |   |-- researchers/
|   |   |   |   |-- roles/
|   |   |   |   |-- search/
|   |   |   |   |-- theses/
|   |   |   |   |-- uploads/
|   |   |   |   `-- users/
|   |   |   |-- prisma/
|   |   |   |   `-- prisma.module.ts
|   |   |   `-- storage/
|   |   |       `-- storage.module.ts
|   |   `-- test/
|   `-- web/
|       |-- src/
|       |   |-- app/
|       |   |   |-- (public)/
|       |   |   |   |-- page.tsx
|       |   |   |   |-- researchers/
|       |   |   |   |-- publications/
|       |   |   |   |-- projects/
|       |   |   |   |-- groups/
|       |   |   |   |-- departments/
|       |   |   |   |-- theses/
|       |   |   |   |-- research-areas/
|       |   |   |   |-- news/
|       |   |   |   `-- search/
|       |   |   `-- (admin)/
|       |   |       |-- admin/
|       |   |       |   |-- page.tsx
|       |   |       |   |-- researchers/
|       |   |       |   |-- publications/
|       |   |       |   |-- projects/
|       |   |       |   |-- groups/
|       |   |       |   |-- theses/
|       |   |       |   |-- news/
|       |   |       |   |-- departments/
|       |   |       |   |-- research-areas/
|       |   |       |   |-- users/
|       |   |       |   `-- settings/
|       |   |-- components/
|       |   |   |-- admin/
|       |   |   |-- charts/
|       |   |   |-- layout/
|       |   |   |-- search/
|       |   |   `-- shared/
|       |   |-- features/
|       |   |   |-- analytics/
|       |   |   |-- auth/
|       |   |   |-- departments/
|       |   |   |-- groups/
|       |   |   |-- news/
|       |   |   |-- projects/
|       |   |   |-- publications/
|       |   |   |-- research-areas/
|       |   |   |-- researchers/
|       |   |   |-- search/
|       |   |   `-- theses/
|       |   |-- lib/
|       |   |-- providers/
|       |   `-- styles/
|       `-- public/
|-- packages/
|   |-- config/
|   `-- ui/
`-- docs/
```

## 2. System Architecture

### Core Principles

- Modular backend aligned to academic domain boundaries
- Search-first frontend optimized for discovery
- Workflow-aware content lifecycle using shared statuses
- API-first contracts between Next.js and NestJS
- Storage and search adapters designed for future infrastructure upgrades

### Runtime Architecture

- `apps/web`: public portal and admin portal built with Next.js App Router
- `apps/api`: NestJS REST API providing auth, CRUD, workflow, analytics, search, and uploads
- `PostgreSQL`: system of record for structured content and relationships
- `Meilisearch`: denormalized discovery index for fast global search and autocomplete
- `Local Storage Adapter`: current file persistence for PDFs and media with an interface for MinIO/S3 later

### Request Flow

1. Public and admin clients call the NestJS API through versioned REST endpoints.
2. NestJS validates DTOs, authorizes access with JWT + RBAC guards, and persists data via Prisma.
3. Domain events or service hooks prepare records for Meilisearch indexing.
4. Published entities are exposed to the public portal; draft and review states stay admin-only.
5. Audit log entries capture admin and workflow actions.

## 3. Database Design Summary

### Identity and Access

- `User`
- `Role`
- `AuditLog`

### Academic Structure

- `Faculty`
- `Department`
- `ResearchArea`
- `KeywordTag`

### People and Membership

- `ResearcherProfile`
- `StudentProfile`
- `ResearcherResearchArea`
- `GroupMember`
- `ProjectMember`

### Research Outputs and Activity

- `ResearchGroup`
- `Project`
- `Publication`
- `PublicationAuthor`
- `Journal`
- `Conference`
- `Thesis`
- `NewsItem`
- `EventActivity`
- `MediaMention`
- `AwardPrize`
- `Dataset`
- `FacilityEquipment`

### Supporting Assets

- `FileAsset`
- `ExternalLink`

## 4. Status Model

Shared content status enum used where relevant:

- `DRAFT`
- `SUBMITTED`
- `UNDER_REVIEW`
- `APPROVED`
- `REJECTED`
- `PUBLISHED`
- `ARCHIVED`

## 5. Backend NestJS Module Plan

### Platform Modules

- `auth`: login, refresh, logout, JWT strategy, password hashing, guards
- `users`: user CRUD, profile ownership mapping, lifecycle status
- `roles`: role definitions and RBAC helpers
- `uploads`: file validation, storage abstraction, signed access planning
- `search`: Meilisearch indexing contracts and search endpoints
- `analytics`: dashboard metrics and chart aggregations
- `audit-logs`: actor-based system audit trail

### Domain Modules

- `researchers`: researcher profiles, public detail pages, admin management
- `departments`: departments, faculty mapping, public listings
- `faculties`: faculty taxonomy and grouping
- `groups`: labs/research groups, memberships, linked projects/publications
- `projects`: project lifecycle, members, funding, outcomes
- `publications`: publication records, authors, metadata, approvals
- `theses`: thesis repository, supervisors, student linkage
- `research-areas`: taxonomy management and related-content discovery
- `news`: news items, activities, events

### Cross-Cutting Backend Conventions

- Each module should eventually contain `controller`, `service`, `dto`, `entities`, and `repository/query` concerns
- Shared pagination, filtering, and response envelopes live in `src/common`
- Prisma access stays centralized through `PrismaModule`
- Uploads and search are adapters, not hard-coded infrastructure dependencies

## 6. Frontend Next.js Route and Component Plan

### Public Routes

- `/`
- `/researchers`
- `/researchers/[slug]`
- `/publications`
- `/publications/[slug]`
- `/projects`
- `/projects/[slug]`
- `/groups`
- `/groups/[slug]`
- `/departments`
- `/departments/[slug]`
- `/theses`
- `/theses/[slug]`
- `/research-areas`
- `/news`
- `/search?q=`
- `/about`
- `/help`

### Admin Routes

- `/admin`
- `/admin/researchers`
- `/admin/publications`
- `/admin/projects`
- `/admin/groups`
- `/admin/theses`
- `/admin/news`
- `/admin/departments`
- `/admin/research-areas`
- `/admin/users`
- `/admin/settings`
- `/admin/audit-logs`
- `/admin/files`

### Frontend Feature Slices

- `features/researchers`
- `features/publications`
- `features/projects`
- `features/groups`
- `features/departments`
- `features/theses`
- `features/research-areas`
- `features/news`
- `features/search`
- `features/auth`
- `features/analytics`

### Shared UI Strategy

- `components/layout`: app shell, navigation, footer, admin chrome
- `components/shared`: cards, badges, metadata rows, section headers
- `components/search`: hero search, filter panels, autocomplete
- `components/charts`: analytics visualizations with Recharts
- `components/admin`: tables, workflow badges, bulk actions, dashboard widgets

## 7. Implementation Boundary for Phase 1

Implemented now:

- Monorepo workspace files
- Architectural documentation
- Prisma schema
- Minimal NestJS module shell classes and app wiring

Deferred to later phases:

- Full DTOs, controllers, services, guards, and tests
- Next.js pages and UI components
- Prisma migrations and seed data
- Meilisearch sync implementation
- File upload execution path

