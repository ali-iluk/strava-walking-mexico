#!/usr/bin/env node
/**
 * Link to the strava-walking-mexico Supabase project and push migrations.
 * Requires: supabase CLI logged in (`npx supabase login`) or SUPABASE_ACCESS_TOKEN.
 * Optional: SUPABASE_DB_PASSWORD for non-interactive link.
 */

import { execSync } from 'node:child_process';

const PROJECT_REF = 'eosnrudeqjoddcpfiiey';
const PROJECT_NAME = 'strava-walking-mexico';
const SUPABASE_URL = `https://${PROJECT_REF}.supabase.co`;

function run(command, description) {
  console.log(`\n→ ${description}`);
  console.log(`  $ ${command}\n`);
  try {
    execSync(command, { stdio: 'inherit', env: process.env });
    console.log(`✅ ${description}`);
    return true;
  } catch {
    console.error(`❌ ${description} failed`);
    return false;
  }
}

function main() {
  console.log('='.repeat(60));
  console.log(`  Database migrations → ${PROJECT_NAME}`);
  console.log(`  Project ref: ${PROJECT_REF}`);
  console.log(`  URL: ${SUPABASE_URL}`);
  console.log('='.repeat(60));

  const password = process.env.SUPABASE_DB_PASSWORD;
  const linkCmd = password
    ? `npx supabase link --project-ref ${PROJECT_REF} --password "${password}"`
    : `npx supabase link --project-ref ${PROJECT_REF}`;

  if (!run(linkCmd, `Link to ${PROJECT_NAME}`)) {
    process.exit(1);
  }

  if (!run('npx supabase db push --yes', 'Push migrations')) {
    process.exit(1);
  }

  console.log('\n' + '='.repeat(60));
  console.log('  Migrations applied successfully.');
  console.log('='.repeat(60) + '\n');
}

main();
