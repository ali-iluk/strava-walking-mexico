# Supabase (strava-walking-mexico)

| | |
|---|---|
| **Project** | AliVillegas's Project |
| **Ref** | `eosnrudeqjoddcpfiiey` |
| **URL** | https://eosnrudeqjoddcpfiiey.supabase.co |

## Run migrations (CLI)

```bash
# One-time: log in if needed
npx supabase login

# Link + push all migrations in supabase/migrations/
npm run db:migrate
```

Non-interactive link (CI / scripts):

```bash
export SUPABASE_DB_PASSWORD='your-database-password'
npm run db:migrate
```

Or use a personal access token: `export SUPABASE_ACCESS_TOKEN=...` then `npm run db:migrate`.

## New migration

```bash
npx supabase migration new your_migration_name
# edit supabase/migrations/<timestamp>_your_migration_name.sql
npm run db:migrate
```

## Local env

`.env` (gitignored):

```
VITE_SUPABASE_URL=https://eosnrudeqjoddcpfiiey.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Production (GitHub Pages)

Repo secrets: `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
