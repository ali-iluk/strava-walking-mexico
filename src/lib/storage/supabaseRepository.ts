import { createEmptySnapshot } from '@/lib/progress/aggregate';
import { supabase } from '@/lib/supabase/client';
import type { ProgressRepository } from '@/lib/storage/repository';
import type { AppSnapshot, DayEntry, UpsertEntryInput } from '@/lib/storage/types';
import { GOAL_STEPS, SCHEMA_VERSION } from '@/lib/storage/types';

type DayEntryRow = {
  id: string;
  date: string;
  steps: number;
  note: string | null;
  updated_at: string;
};

function rowToEntry(row: DayEntryRow): DayEntry {
  return {
    id: row.id,
    date: row.date,
    steps: row.steps,
    note: row.note ?? undefined,
    updatedAt: row.updated_at,
  };
}

function buildSnapshot(entries: DayEntry[]): AppSnapshot {
  const timestamps = entries.map((e) => e.updatedAt).sort();
  const updatedAt = timestamps.at(-1) ?? new Date().toISOString();
  const createdAt = timestamps.at(0) ?? updatedAt;

  return {
    schemaVersion: SCHEMA_VERSION,
    goalSteps: GOAL_STEPS,
    createdAt,
    updatedAt,
    entries,
  };
}

export class SupabaseRepository implements ProgressRepository {
  async load(): Promise<AppSnapshot> {
    const { data, error } = await supabase
      .from('day_entries')
      .select('id, date, steps, note, updated_at')
      .order('date', { ascending: true });

    if (error) {
      throw new Error(`Failed to load entries: ${error.message}`);
    }

    const entries = (data ?? []).map(rowToEntry);
    return entries.length > 0 ? buildSnapshot(entries) : createEmptySnapshot();
  }

  async save(snapshot: AppSnapshot): Promise<void> {
    const rows = snapshot.entries.map((entry) => ({
      id: entry.id,
      date: entry.date,
      steps: entry.steps,
      note: entry.note ?? null,
      updated_at: entry.updatedAt,
    }));

    if (rows.length === 0) return;

    const { error } = await supabase.from('day_entries').upsert(rows, { onConflict: 'date' });

    if (error) {
      throw new Error(`Failed to save entries: ${error.message}`);
    }
  }

  async upsertEntry(input: UpsertEntryInput): Promise<DayEntry> {
    const payload = {
      ...(input.id ? { id: input.id } : {}),
      date: input.date,
      steps: input.steps,
      note: input.note?.trim() || null,
    };

    const { data, error } = await supabase
      .from('day_entries')
      .upsert(payload, { onConflict: 'date' })
      .select('id, date, steps, note, updated_at')
      .single();

    if (error || !data) {
      throw new Error(`Failed to save day: ${error?.message ?? 'No data returned'}`);
    }

    return rowToEntry(data);
  }

  async deleteEntry(id: string): Promise<void> {
    const { error } = await supabase.from('day_entries').delete().eq('id', id);

    if (error) {
      throw new Error(`Failed to delete entry: ${error.message}`);
    }
  }

  async clear(): Promise<void> {
    const { error } = await supabase
      .from('day_entries')
      .delete()
      .gte('date', '1970-01-01');

    if (error) {
      throw new Error(`Failed to clear entries: ${error.message}`);
    }
  }
}

export const supabaseRepository = new SupabaseRepository();
