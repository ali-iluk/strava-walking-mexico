# 6M Steps — Walking Mexico

A minimal pastel tracker for manually logging daily steps toward **6,000,000**. Data lives in your browser (`localStorage`) with JSON export/import for backups and future database migration.

## Live site (continuous deploy)

Every push to `main` deploys automatically via GitHub Actions to **GitHub Pages**:

**https://ali-iluk.github.io/strava-walking-mexico/**

Data is stored in **Supabase** (source of truth). Export JSON is still available for backups.

### One-time Supabase setup

Run [`supabase/schema.sql`](supabase/schema.sql) in the [Supabase SQL Editor](https://supabase.com/dashboard/project/eosnrudeqjoddcpfiiey/sql/new). See [`supabase/README.md`](supabase/README.md).

### GitHub Pages

**Settings → Pages → Source** → **GitHub Actions**. Secrets `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` must be set on the repo.

### Alternative: Vercel (custom domain, no `/repo-name/` path)

1. Push this repo to GitHub.
2. [Import the repo in Vercel](https://vercel.com/new) (install the GitHub app when prompted).
3. Use defaults: build `npm run build`, output `dist`. [`vercel.json`](vercel.json) handles SPA routing.
4. Every push to `main` redeploys automatically.

## Git

```bash
git init
git add .
git commit -m "feat: 6M steps tracker with GitHub Pages deploy"
gh repo create strava-walking-mexico --public --source=. --remote=origin --push
```

Then enable Pages → **GitHub Actions** in repo settings (once).

## Scripts (optional local)

| Command | Description |
|---------|-------------|
| `npm run dev` | Local dev server |
| `npm run build` | Production build to `dist/` |
| `npm run lint` | ESLint |
| `npm run format` | Prettier write |

## Features

- **Animated hero counter** on the dashboard with progress bar and pace projection
- **Quick log** — date, steps, optional note (one entry per calendar day)
- **Scrollable timeline** grouped by month with edit/delete
- **Charts** — cumulative progress and last 7 days
- **Data page** — export/import JSON, clear all (typed `DELETE` confirm)

## Data format

Stored under `walking-mexico:v1` in `localStorage`:

```json
{
  "schemaVersion": 1,
  "goalSteps": 6000000,
  "createdAt": "2026-05-18T12:00:00.000Z",
  "updatedAt": "2026-05-18T12:00:00.000Z",
  "entries": [
    {
      "id": "uuid",
      "date": "2026-05-18",
      "steps": 12000,
      "note": "Morning walk",
      "updatedAt": "2026-05-18T12:00:00.000Z"
    }
  ]
}
```

Import merges by `date` (incoming entry wins on conflict).

**Note:** Data syncs via Supabase. Use **Data → Export JSON** for offline backups.

## Future: Strava

Strava OAuth can be added later for activity distance, but the **Strava API does not expose step counts**. Manual logging remains the source of step totals.

## Stack

Vite, React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Zod, React Router.
