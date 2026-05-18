import { appSnapshotSchema } from '@/lib/import-export/schema';
import type { ProgressRepository } from '@/lib/storage/repository';
import { STORAGE_KEY } from '@/lib/storage/types';

const MIGRATED_FLAG = 'walking-mexico:supabase-migrated';

function readLegacySnapshot() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return appSnapshotSchema.parse(JSON.parse(raw));
  } catch {
    return null;
  }
}

export async function migrateLocalStorageIfNeeded(repository: ProgressRepository): Promise<void> {
  if (localStorage.getItem(MIGRATED_FLAG) === '1') return;

  const legacy = readLegacySnapshot();
  if (!legacy || legacy.entries.length === 0) {
    localStorage.setItem(MIGRATED_FLAG, '1');
    return;
  }

  const current = await repository.load();
  if (current.entries.length > 0) {
    localStorage.setItem(MIGRATED_FLAG, '1');
    return;
  }

  await repository.save(legacy);
  localStorage.setItem(MIGRATED_FLAG, '1');
}
