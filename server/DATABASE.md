# Database & Prisma Notes

## Local setup

1. Copy environment file:
   ```bash
   cp .env.example .env
   ```
2. Set `DATABASE_URL` to your local PostgreSQL instance:
   ```
   DATABASE_URL=postgresql://postgres:postgres@localhost:5432/aquails?schema=public
   ```
3. Run migrations and seed (development only):
   ```bash
   npm run db:migrate -- --name init
   npm run db:seed
   ```

## Scripts

| Command | Purpose |
|---------|---------|
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Create/apply migrations (dev) |
| `npm run db:migrate:deploy` | Apply migrations (production/staging) |
| `npm run db:seed` | Seed development data |
| `npm run db:studio` | Open Prisma Studio |
| `npm run db:reset` | **Development only** — drops DB and re-applies migrations |

## Production rules

- Always use `npm run db:migrate:deploy` during deploy.
- **Never** use `prisma db push` in production.
- **Never** use `npm run db:reset` in production.
- **Never** run `npm run db:seed` in production (dev/staging only).

## Product lifecycle

Products are not hard-deleted. Use `isActive = false` to hide from catalog.
`OrderItem.productId` uses `onDelete: Restrict` to preserve order history.

## Badge enum mapping

Frontend mock badges: `discount`, `premium`, `new` (lowercase).
Database enum: `DISCOUNT`, `PREMIUM`, `NEW` (uppercase).
Mapping happens in API/seed layer (see `prisma/seed/mappers/productMapper.ts`).
