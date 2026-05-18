import type { AppSnapshot } from '@/lib/storage/types';
import { parseSnapshotJson } from '@/lib/import-export/schema';

export type ImportResult =
  | { ok: true; snapshot: AppSnapshot; mergedCount: number }
  | { ok: false; errors: string[] };

export function mergeSnapshots(
  local: AppSnapshot,
  incoming: AppSnapshot,
): { snapshot: AppSnapshot; mergedCount: number } {
  const byDate = new Map(local.entries.map((e) => [e.date, e]));

  for (const entry of incoming.entries) {
    byDate.set(entry.date, entry);
  }

  const entries = Array.from(byDate.values());
  const now = new Date().toISOString();

  return {
    snapshot: {
      schemaVersion: 1,
      goalSteps: incoming.goalSteps ?? local.goalSteps,
      createdAt: local.createdAt,
      updatedAt: now,
      entries,
    },
    mergedCount: incoming.entries.length,
  };
}

export async function parseImportFile(file: File): Promise<ImportResult> {
  try {
    const text = await file.text();
    const raw = JSON.parse(text) as unknown;
    const parsed = parseSnapshotJson(raw);
    return { ok: true, snapshot: parsed, mergedCount: parsed.entries.length };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Invalid JSON file';
    return { ok: false, errors: [message] };
  }
}
