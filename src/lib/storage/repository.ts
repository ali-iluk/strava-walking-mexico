import type { AppSnapshot, DayEntry, UpsertEntryInput } from '@/lib/storage/types';

export interface ProgressRepository {
  load(): Promise<AppSnapshot>;
  save(snapshot: AppSnapshot): Promise<void>;
  upsertEntry(input: UpsertEntryInput): Promise<DayEntry>;
  deleteEntry(id: string): Promise<void>;
  clear(): Promise<void>;
}
