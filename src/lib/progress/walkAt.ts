import { format, parseISO } from 'date-fns';
import type { DayEntry } from '@/lib/storage/types';

/** Local calendar date + HH:mm → ISO instant for storage. */
export function combineDateAndTime(date: string, time: string): string {
  const [year, month, day] = date.split('-').map(Number);
  const [hours, minutes] = time.split(':').map(Number);
  const dt = new Date(year, month - 1, day, hours, minutes, 0, 0);
  return dt.toISOString();
}

export function formatWalkTime(walkAt: string): string {
  return format(parseISO(walkAt), 'h:mm a');
}

export function walkTimeInputValue(walkAt: string): string {
  return format(parseISO(walkAt), 'HH:mm');
}

export function compareWalkAt(a: DayEntry, b: DayEntry): number {
  return parseISO(a.walkAt).getTime() - parseISO(b.walkAt).getTime();
}

export function defaultWalkAtForDate(date: string): string {
  const now = new Date();
  const today = format(now, 'yyyy-MM-dd');
  if (date === today) {
    return now.toISOString();
  }
  return combineDateAndTime(date, '12:00');
}
