import { createEmptySnapshot } from '@/lib/progress/aggregate';
import type { ProgressRepository } from '@/lib/storage/repository';
import type { AppSnapshot, DayEntry, UpsertEntryInput } from '@/lib/storage/types';
import { STORAGE_KEY } from '@/lib/storage/types';
import { appSnapshotSchema } from '@/lib/import-export/schema';

function readRaw(): AppSnapshot | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = appSnapshotSchema.parse(JSON.parse(raw));
    return parsed;
  } catch {
    return null;
  }
}

function write(snapshot: AppSnapshot): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(snapshot));
}

export class LocalStorageRepository implements ProgressRepository {
  async load(): Promise<AppSnapshot> {
    return readRaw() ?? createEmptySnapshot();
  }

  async save(snapshot: AppSnapshot): Promise<void> {
    const validated = appSnapshotSchema.parse({
      ...snapshot,
      updatedAt: new Date().toISOString(),
    });
    write(validated);
  }

  async upsertEntry(input: UpsertEntryInput): Promise<DayEntry> {
    const snapshot = await this.load();
    const now = new Date().toISOString();
    const existingIndex = snapshot.entries.findIndex((e) => e.date === input.date);

    const entry: DayEntry = {
      id: input.id ?? snapshot.entries[existingIndex]?.id ?? crypto.randomUUID(),
      date: input.date,
      steps: input.steps,
      note: input.note?.trim() || undefined,
      updatedAt: now,
    };

    if (existingIndex >= 0) {
      snapshot.entries[existingIndex] = entry;
    } else {
      snapshot.entries.push(entry);
    }

    await this.save(snapshot);
    return entry;
  }

  async deleteEntry(id: string): Promise<void> {
    const snapshot = await this.load();
    snapshot.entries = snapshot.entries.filter((e) => e.id !== id);
    await this.save(snapshot);
  }

  async clear(): Promise<void> {
    localStorage.removeItem(STORAGE_KEY);
  }
}

export const progressRepository = new LocalStorageRepository();
