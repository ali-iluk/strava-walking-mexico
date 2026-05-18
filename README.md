# 6M Steps — Walking Mexico

A minimal pastel tracker for manually logging daily steps toward **6,000,000**. Data lives in your browser (`localStorage`) with JSON export/import for backups and future database migration.

## Live site (continuous deploy)

Every push to `main` deploys automatically via GitHub Actions to **GitHub Pages**:

**https://ali-iluk.github.io/strava-walking-mexico/**

No local dev server required. Edit → commit → push → site updates in ~1–2 minutes.

### One-time setup (if the repo is new)

1. Create the GitHub repo and push (see [Git](#git) below).
2. In the repo on GitHub: **Settings → Pages → Build and deployment → Source** → choose **GitHub Actions**.
3. Push to `main`; the workflow in [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) builds and publishes.

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

**Note:** Data is per-browser. Use **Data → Export JSON** before switching devices or clearing site data.

## Future: Strava & database

Strava OAuth can be added later for activity distance, but the **Strava API does not expose step counts**. This app is designed for manual logging first.

To add a minimal backend, implement `ProgressRepository` (see `src/lib/storage/repository.ts`) with HTTP calls; keep the same `AppSnapshot` JSON shape.

## Stack

Vite, React 18, TypeScript, Tailwind CSS, Framer Motion, Recharts, Zod, React Router.
