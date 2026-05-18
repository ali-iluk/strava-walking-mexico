import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import path from 'node:path';

const repoName = 'strava-walking-mexico';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

export default defineConfig({
  base: isGitHubPages ? `/${repoName}/` : '/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
