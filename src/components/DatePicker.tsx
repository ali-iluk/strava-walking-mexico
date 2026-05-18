import {
  addMonths,
  format,
  isAfter,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
} from 'date-fns';
import { useMemo, useState } from 'react';

type DatePickerProps = {
  value: string;
  max?: string;
  onChange: (value: string) => void;
};

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

function buildMonthDays(month: Date): Date[] {
  const start = startOfWeek(startOfMonth(month), { weekStartsOn: 0 });
  return Array.from({ length: 42 }, (_, i) => {
    const day = new Date(start);
    day.setDate(start.getDate() + i);
    return day;
  });
}

export function DatePicker({ value, max, onChange }: DatePickerProps) {
  const selected = parseISO(value);
  const maxDate = max ? parseISO(max) : new Date();
  const [viewMonth, setViewMonth] = useState(startOfMonth(selected));
  const days = useMemo(() => buildMonthDays(viewMonth), [viewMonth]);

  const pickDay = (day: Date) => {
    if (isAfter(day, maxDate)) return;
    onChange(format(day, 'yyyy-MM-dd'));
  };

  return (
    <div className="date-picker rounded-2xl border border-blush/80 bg-canvas p-3 shadow-soft">
      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          className="date-picker-nav"
          aria-label="Previous month"
        >
          ‹
        </button>
        <p className="font-display text-sm font-semibold text-ink">
          {format(viewMonth, 'MMMM yyyy')}
        </p>
        <button
          type="button"
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="date-picker-nav"
          aria-label="Next month"
          disabled={isAfter(startOfMonth(addMonths(viewMonth, 1)), maxDate)}
        >
          ›
        </button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center">
        {WEEKDAYS.map((label) => (
          <span key={label} className="py-1 text-[10px] font-bold uppercase tracking-wide text-muted">
            {label}
          </span>
        ))}
        {days.map((day) => {
          const inMonth = isSameMonth(day, viewMonth);
          const selectedDay = isSameDay(day, selected);
          const disabled = isAfter(day, maxDate);
          const today = isToday(day);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => pickDay(day)}
              disabled={disabled}
              className={[
                'date-picker-day',
                !inMonth && 'date-picker-day--faded',
                selectedDay && 'date-picker-day--selected',
                today && !selectedDay && 'date-picker-day--today',
                disabled && 'date-picker-day--disabled',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              {format(day, 'd')}
            </button>
          );
        })}
      </div>
    </div>
  );
}
