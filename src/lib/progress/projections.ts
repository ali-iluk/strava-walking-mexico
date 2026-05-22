import { addDays, format } from 'date-fns';
import type { DayEntry } from '@/lib/storage/types';
import { sumStepsByDateDesc } from '@/lib/progress/aggregate';

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
  const recentDays = sumStepsByDateDesc(entries).slice(0, windowDays);

  if (recentDays.length === 0 || remaining <= 0) {
    return {
      avgDailySteps: 0,
      windowDays: recentDays.length,
      projectedFinishDate: null,
      daysRemaining: null,
    };
  }

  const avgDailySteps = Math.round(
    recentDays.reduce((sum, d) => sum + d.steps, 0) / recentDays.length,
  );

  if (avgDailySteps <= 0) {
    return {
      avgDailySteps: 0,
      windowDays: recentDays.length,
      projectedFinishDate: null,
      daysRemaining: null,
    };
  }

  const daysRemaining = Math.ceil(remaining / avgDailySteps);
  const projectedFinishDate = format(addDays(new Date(), daysRemaining), 'MMM d, yyyy');

  return {
    avgDailySteps,
    windowDays: recentDays.length,
    projectedFinishDate,
    daysRemaining,
  };
}

export function lastSevenDailyBars(entries: DayEntry[]): { date: string; steps: number }[] {
  const recent = sumStepsByDateDesc(entries).slice(0, 7);
  return [...recent].reverse();
}
