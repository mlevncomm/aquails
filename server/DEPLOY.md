# Supabase + Vercel Deployment

Aquails uses **Supabase** for managed PostgreSQL and **Vercel** for hosting.

- **Database:** Supabase Postgres (Prisma ORM)
- **Auth:** Custom JWT in `server/` (FAZ 3) — not Supabase Auth
- **Frontend:** Vite + React → Vercel (repo root)
- **API:** Express → Vercel (Root Directory: `server`)

---

## 1. Supabase project

1. Create a project at [supabase.com/dashboard](https://supabase.com/dashboard)
2. Open **Project Settings → Database**
3. Copy two connection strings (URI mode):

| Variable | Supabase setting | Port | Use |
|----------|------------------|------|-----|
| `DATABASE_URL` | **Transaction pooler** | 6543 | App runtime (add `?pgbouncer=true`) |
| `DIRECT_URL` | **Session pooler** or **Direct** | 5432 | Migrations & seed only |

Example shape (replace placeholders):

```env
DATABASE_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true
DIRECT_URL=postgresql://postgres.[project-ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres
```

For local PostgreSQL without pooler, set both to the same URL.

---

## 2. Local `server/.env`

```bash
cd server
copy .env.example .env
```

Fill in Supabase URLs, a random `JWT_SECRET` (min 32 chars), and seed password for development.

```bash
npm run db:migrate:deploy
npm run db:seed
npm run dev
```

Verify: `GET http://localhost:4000/api/health` → `"database": "connected"`.

---

## 3. Vercel — two projects

Deploy frontend and API as **separate Vercel projects** from the same GitHub repo.

### Frontend (repo root)

| Setting | Value |
|---------|-------|
| Root Directory | `.` (repo root) |
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |

Uses root [`vercel.json`](../vercel.json).

### API (`server/`)

| Setting | Value |
|---------|-------|
| Root Directory | `server` |
| Build Command | `npm run build` |
| Install Command | `npm install` |

Uses [`server/vercel.json`](vercel.json) and [`server/api/index.ts`](api/index.ts) (serverless Express entry).

**Environment variables** (Vercel → Project → Settings → Environment Variables):

| Variable | Notes |
|----------|-------|
| `NODE_ENV` | `production` |
| `DATABASE_URL` | Supabase pooler URL (6543) |
| `DIRECT_URL` | Supabase direct URL (5432) — needed for build if migrate runs |
| `JWT_SECRET` | Min 32 chars, unique per environment |
| `JWT_EXPIRES_IN` | `7d` |
| `CORS_ORIGINS` | Frontend Vercel URL, e.g. `https://aquails.vercel.app` |

Do **not** set `SEED_ADMIN_PASSWORD` in production Vercel env.

---

## 4. Migrations on Supabase

Run once before first deploy (from your machine with `server/.env`):

```bash
cd server
npm run db:migrate:deploy
```

Optional staging seed (never in production pipeline):

```bash
npm run db:seed
```

---

## 5. Post-deploy checks

1. `GET https://<api-project>.vercel.app/api/health` → `database: connected`
2. Auth E2E against production API URL
3. Frontend `CORS_ORIGINS` includes production frontend domain

---

## Notes

- Supabase **RLS** applies to PostgREST/API access. Prisma uses the database role directly; enable RLS on tables if you expose Supabase Data API later.
- Keep `server/.env` and Vercel secrets out of git (see root `.gitignore`).
- `npm run db:reset` is development-only — never on Supabase production.
