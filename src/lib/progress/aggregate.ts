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

export type DateWalkGroup = {
  date: string;
  dateLabel: string;
  dailySteps: number;
  entries: DayEntry[];
};

export type MonthGroup = {
  key: string;
  label: string;
  dateGroups: DateWalkGroup[];
};

export function computeStats(snapshot: AppSnapshot): ProgressStats {
  const totalSteps = snapshot.entries.reduce((sum, e) => sum + e.steps, 0);
  const goalSteps = snapshot.goalSteps;
  const remaining = Math.max(0, goalSteps - totalSteps);
  const percentComplete = Math.min(100, (totalSteps / goalSteps) * 100);

  return { totalSteps, goalSteps, remaining, percentComplete };
}

export function sortEntriesDesc(entries: DayEntry[]): DayEntry[] {
  return [...entries].sort((a, b) => {
    const byDate = compareDesc(parseISO(a.date), parseISO(b.date));
    if (byDate !== 0) return byDate;
    return compareDesc(parseISO(a.updatedAt), parseISO(b.updatedAt));
  });
}

export function sortEntriesAsc(entries: DayEntry[]): DayEntry[] {
  return [...entries].sort((a, b) => {
    const byDate = parseISO(a.date).getTime() - parseISO(b.date).getTime();
    if (byDate !== 0) return byDate;
    return parseISO(a.updatedAt).getTime() - parseISO(b.updatedAt).getTime();
  });
}

export function sumStepsByDateAsc(entries: DayEntry[]): { date: string; steps: number }[] {
  const totals = new Map<string, number>();
  for (const entry of entries) {
    totals.set(entry.date, (totals.get(entry.date) ?? 0) + entry.steps);
  }
  return [...totals.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([date, steps]) => ({ date, steps }));
}

export function sumStepsByDateDesc(entries: DayEntry[]): { date: string; steps: number }[] {
  return sumStepsByDateAsc(entries).reverse();
}

export function countDistinctDays(entries: DayEntry[]): number {
  return new Set(entries.map((e) => e.date)).size;
}

export function groupEntriesByDateDesc(entries: DayEntry[]): DateWalkGroup[] {
  const sorted = sortEntriesDesc(entries);
  const groups: DateWalkGroup[] = [];

  for (const entry of sorted) {
    const last = groups.at(-1);
    if (!last || last.date !== entry.date) {
      groups.push({
        date: entry.date,
        dateLabel: format(parseISO(entry.date), 'EEEE, MMM d'),
        dailySteps: entry.steps,
        entries: [entry],
      });
    } else {
      last.entries.push(entry);
      last.dailySteps += entry.steps;
    }
  }

  return groups;
}

export function buildCumulativeSeries(entries: DayEntry[]): CumulativePoint[] {
  let cumulative = 0;
  return sumStepsByDateAsc(entries).map(({ date, steps }) => {
    cumulative += steps;
    return { date, dailySteps: steps, cumulative };
  });
}

export function groupByMonth(entries: DayEntry[]): MonthGroup[] {
  const dateGroups = groupEntriesByDateDesc(entries);
  const months = new Map<string, DateWalkGroup[]>();

  for (const group of dateGroups) {
    const key = format(parseISO(group.date), 'yyyy-MM');
    const list = months.get(key) ?? [];
    list.push(group);
    months.set(key, list);
  }

  return Array.from(months.entries()).map(([key, groups]) => ({
    key,
    label: format(parseISO(`${key}-01`), 'MMMM yyyy'),
    dateGroups: groups,
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
