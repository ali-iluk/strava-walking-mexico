import { addDays, format } from 'date-fns';
import type { DayEntry } from '@/lib/storage/types';
import { sortEntriesDesc } from '@/lib/progress/aggregate';

export type PaceProjection = {
  avgDailySteps: number;
  windowDays: number;
  projectedFinishDate: string | null;
  daysRemaining: number | null;
};

export function projectFinishDate(
  entries: DayEntry[],
  remaining: number,
  windowDays = 7,
): PaceProjection {
  const recent = sortEntriesDesc(entries).slice(0, windowDays);

  if (recent.length === 0 || remaining <= 0) {
    return {
      avgDailySteps: 0,
      windowDays: recent.length,
      projectedFinishDate: null,
      daysRemaining: null,
    };
  }

  const avgDailySteps = Math.round(
    recent.reduce((sum, e) => sum + e.steps, 0) / recent.length,
  );

  if (avgDailySteps <= 0) {
    return {
      avgDailySteps: 0,
      windowDays: recent.length,
      projectedFinishDate: null,
      daysRemaining: null,
    };
  }

  const daysRemaining = Math.ceil(remaining / avgDailySteps);
  const projectedFinishDate = format(addDays(new Date(), daysRemaining), 'MMM d, yyyy');

  return {
    avgDailySteps,
    windowDays: recent.length,
    projectedFinishDate,
    daysRemaining,
  };
}

export function lastSevenDailyBars(entries: DayEntry[]): { date: string; steps: number }[] {
  return sortEntriesDesc(entries)
    .slice(0, 7)
    .reverse()
    .map((e) => ({ date: e.date, steps: e.steps }));
}
