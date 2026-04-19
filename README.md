# LGU Research Portal

Production-oriented monorepo powering the Lahore Garrison University (LGU) Research Portal.

## Stack

- Frontend: Next.js App Router + TypeScript + Tailwind CSS + shadcn/ui
- Backend: NestJS + REST
- Database: PostgreSQL + Prisma
- Auth: JWT + RBAC
- Search: Meilisearch
- Charts: Recharts
- Forms: React Hook Form + Zod
- Data Fetching: TanStack Query

## Monorepo Layout

```text
.
|-- apps
|   |-- api
|   |   |-- prisma
|   |   |   `-- schema.prisma
|   |   `-- src
|   |       |-- common
|   |       |-- config
|   |       |-- modules
|   |       |   |-- analytics
|   |       |   |-- audit-logs
|   |       |   |-- auth
|   |       |   |-- departments
|   |       |   |-- faculties
|   |       |   |-- groups
|   |       |   |-- news
|   |       |   |-- projects
|   |       |   |-- publications
|   |       |   |-- research-areas
|   |       |   |-- researchers
|   |       |   |-- roles
|   |       |   |-- search
|   |       |   |-- theses
|   |       |   |-- uploads
|   |       |   `-- users
|   |       |-- prisma
|   |       `-- storage
|   `-- web
|       `-- src
|           |-- app
|           |   |-- (admin)
|           |   |-- (public)
|           |   `-- api
|           |-- components
|           |-- features
|           |-- hooks
|           |-- lib
|           |-- providers
|           |-- styles
|           `-- types
|-- docs
|   `-- phase-1-architecture.md
|-- packages
|   |-- config
|   `-- ui
|-- package.json
|-- pnpm-workspace.yaml
`-- turbo.json
```

## Local Run

1. Install dependencies

```bash
corepack pnpm install
```

2. Copy the environment file

```bash
copy .env.example .env
```

3. Start Postgres and Meilisearch

```bash
docker compose up -d
```

4. Prepare the database

```bash
corepack pnpm db:generate
corepack pnpm db:push
corepack pnpm db:seed
```

5. Start the backend and frontend

```bash
corepack pnpm --filter api dev
corepack pnpm --filter web dev
```

Or run both with:

```bash
corepack pnpm dev
```

## Vercel Deployment

- Deploy the frontend from the `apps/web` root directory.
- Do not use `turbo run build` as a Vercel build override for this project.
- The Vercel project should build using the config in `apps/web/vercel.json`.

## Backend Deployment

- Deploy `apps/api` as a separate Node service.
- The API now reads `PORT` from the host environment, so platforms like Render and Railway can bind it correctly.
- A ready-to-use Render config is included in `render.yaml`.
- The Render build now runs `prisma migrate deploy` automatically so a fresh hosted database gets the required tables before the API starts.
- After the API is deployed, set `NEXT_PUBLIC_API_BASE_URL` in the Vercel frontend project to:
  `https://your-api-domain/api`
- Then redeploy the frontend on Vercel.

## Test URLs

- Frontend: `http://localhost:3000`
- API: `http://localhost:3001/api`
- Meilisearch: `http://localhost:7700`

## Demo Credentials

- `areeba.ahmed@lgu.edu.pk` / `Password123!`

## Notes

- Public and admin frontend pages now build successfully.
- Backend compiles successfully and includes auth, RBAC, search, uploads, analytics, and audit logs.
- Seed data creates LGU roles, faculties, departments, researchers, projects, publications, theses, news, and audit activity.
- Initial Prisma SQL migration is included under [apps/api/prisma/migrations/0001_init/migration.sql](</f:/Resesarch Portal/apps/api/prisma/migrations/0001_init/migration.sql>).

See [docs/phase-1-architecture.md](/f:/Resesarch%20Portal/docs/phase-1-architecture.md) for the architecture package.
