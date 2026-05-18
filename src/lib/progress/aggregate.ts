import { compareDesc, format, parseISO } from 'date-fns';
import type { AppSnapshot, DayEntry } from '@/lib/storage/types';
import { GOAL_STEPS } from '@/lib/storage/types';

export type ProgressStats = {
  totalSteps: number;
  goalSteps: number;
  remaining: number;
  percentComplete: number;
};

export type CumulativePoint = {
  date: string;
  dailySteps: number;
  cumulative: number;
};

export type MonthGroup = {
  key: string;
  label: string;
  entries: DayEntry[];
};

export function computeStats(snapshot: AppSnapshot): ProgressStats {
  const totalSteps = snapshot.entries.reduce((sum, e) => sum + e.steps, 0);
  const goalSteps = snapshot.goalSteps;
  const remaining = Math.max(0, goalSteps - totalSteps);
  const percentComplete = Math.min(100, (totalSteps / goalSteps) * 100);

  return { totalSteps, goalSteps, remaining, percentComplete };
}

export function sortEntriesDesc(entries: DayEntry[]): DayEntry[] {
  return [...entries].sort((a, b) => compareDesc(parseISO(a.date), parseISO(b.date)));
}

export function sortEntriesAsc(entries: DayEntry[]): DayEntry[] {
  return [...entries].sort((a, b) => parseISO(a.date).getTime() - parseISO(b.date).getTime());
}

export function buildCumulativeSeries(entries: DayEntry[]): CumulativePoint[] {
  const sorted = sortEntriesAsc(entries);
  let cumulative = 0;

  return sorted.map((entry) => {
    cumulative += entry.steps;
    return {
      date: entry.date,
      dailySteps: entry.steps,
      cumulative,
    };
  });
}

export function groupByMonth(entries: DayEntry[]): MonthGroup[] {
  const sorted = sortEntriesDesc(entries);
  const groups = new Map<string, DayEntry[]>();

  for (const entry of sorted) {
    const key = format(parseISO(entry.date), 'yyyy-MM');
    const list = groups.get(key) ?? [];
    list.push(entry);
    groups.set(key, list);
  }

  return Array.from(groups.entries()).map(([key, monthEntries]) => ({
    key,
    label: format(parseISO(`${key}-01`), 'MMMM yyyy'),
    entries: monthEntries,
  }));
}

export function runningTotalAtDate(entries: DayEntry[], targetDate: string): number {
  return sortEntriesAsc(entries)
    .filter((e) => e.date <= targetDate)
    .reduce((sum, e) => sum + e.steps, 0);
}

export function createEmptySnapshot(): AppSnapshot {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    goalSteps: GOAL_STEPS,
    createdAt: now,
    updatedAt: now,
    entries: [],
  };
}
