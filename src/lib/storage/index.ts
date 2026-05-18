import { migrateLocalStorageIfNeeded } from '@/lib/storage/migrateLocalStorage';
import { supabaseRepository } from '@/lib/storage/supabaseRepository';

export const progressRepository = supabaseRepository;

export async function initProgressStorage(): Promise<void> {
  await migrateLocalStorageIfNeeded(progressRepository);
}
