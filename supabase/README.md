# Supabase setup (one-time)

1. Open [SQL Editor](https://supabase.com/dashboard/project/eosnrudeqjoddcpfiiey/sql/new) for your project.
2. Paste the contents of [`schema.sql`](./schema.sql) and click **Run**.
3. Confirm the `day_entries` table appears under **Table Editor**.

The app reads and writes all step logs to this table. RLS policies allow the anon key (personal tracker). Tighten policies before sharing the app publicly.

## Local env

Copy `.env.example` to `.env` and set:

```
VITE_SUPABASE_URL=https://eosnrudeqjoddcpfiiey.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

## Production (GitHub Pages)

Repository secrets (already configured via `gh secret set`):

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

Rotate the anon key in Supabase when needed, then update GitHub secrets and `.env`.
