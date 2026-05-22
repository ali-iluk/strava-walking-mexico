import { format } from 'date-fns';
import { useRef } from 'react';
import { Card } from '@/components/Card';
import { useProgress } from '@/hooks/useProgress';
import { TimelineDayCard } from '@/features/timeline/TimelineDayCard';

export function TimelineSection() {
  const { monthGroups, entriesSorted, walkCount, dayCount } = useProgress();
  const todayRef = useRef<HTMLDivElement>(null);
  const today = format(new Date(), 'yyyy-MM-dd');

  const scrollToToday = () => {
    todayRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  if (entriesSorted.length === 0) {
    return (
      <Card className="text-center">
        <p className="text-4xl" aria-hidden>
          🥾
        </p>
        <h2 className="mt-3 font-display text-lg font-semibold text-ink">No walks logged yet</h2>
        <p className="mt-2 text-sm text-muted">
          Log your first walk above — add morning and evening separately on the same day.
        </p>
      </Card>
    );
  }

  const hasToday = entriesSorted.some((e) => e.date === today);

  return (
    <section>
      <div className="sticky top-0 z-10 mb-3 flex items-center justify-between rounded-xl bg-canvas/90 py-2 backdrop-blur-sm">
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">History</h2>
          <p className="text-xs text-muted">
            {walkCount} walks · {dayCount} days
          </p>
        </div>
        {hasToday && (
          <button
            type="button"
            onClick={scrollToToday}
            className="text-xs font-semibold text-sage hover:underline"
          >
            Jump to today
          </button>
        )}
      </div>
      <div
        className="max-h-[min(60vh,520px)] overflow-y-auto rounded-2xl border border-blush/60 bg-surface/50 p-3 pr-2"
        role="feed"
        aria-label="Walk history"
      >
        <div className="flex flex-col gap-6">
          {monthGroups.map((group) => (
            <div key={group.key}>
              <h3 className="sticky top-0 z-[1] mb-2 bg-surface/95 py-1 font-display text-xs font-bold uppercase tracking-wider text-muted">
                {group.label}
              </h3>
              <div className="flex flex-col gap-3">
                {group.dateGroups.map((dateGroup) => (
                  <div
                    key={dateGroup.date}
                    ref={dateGroup.date === today ? todayRef : undefined}
                    className="flex flex-col gap-2"
                  >
                    {dateGroup.entries.map((entry, index) => (
                      <TimelineDayCard
                        key={entry.id}
                        entry={entry}
                        walkIndex={index}
                        walkCountForDay={dateGroup.entries.length}
                        showDateHeader={index === 0}
                        dateLabel={dateGroup.dateLabel}
                        dailySteps={dateGroup.dailySteps}
                      />
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
