import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { formatSteps } from '@/hooks/useAnimatedNumber';
import { useProgress } from '@/hooks/useProgress';
import { runningTotalAfterEntry, runningTotalAtDate } from '@/lib/progress/aggregate';
import type { DayEntry } from '@/lib/storage/types';
import { EditAccessDeniedError } from '@/lib/auth/editGate';
import { MAX_DAILY_STEPS } from '@/lib/storage/types';
import { TimelineDayCardEdit } from '@/features/timeline/TimelineDayCardEdit';

type TimelineDayCardProps = {
  entry: DayEntry;
  walkIndex: number;
  walkCountForDay: number;
  showDateHeader: boolean;
  dateLabel: string;
  dailySteps: number;
  onOpenDayMap: () => void;
  onOpenWalkMap: (steps: number, label: string) => void;
};

export function TimelineDayCard({
  entry,
  walkIndex,
  walkCountForDay,
  showDateHeader,
  dateLabel,
  dailySteps,
  onOpenDayMap,
  onOpenWalkMap,
}: TimelineDayCardProps) {
  const { snapshot, upsert, remove } = useProgress();
  const [editing, setEditing] = useState(false);
  const [steps, setSteps] = useState(String(entry.steps));
  const [note, setNote] = useState(entry.note ?? '');
  const [busy, setBusy] = useState(false);

  const runningTotal = runningTotalAtDate(snapshot.entries, entry.date);
  const stepsAfterWalk = runningTotalAfterEntry(snapshot.entries, entry.id);
  const timeLabel = format(parseISO(entry.updatedAt), 'h:mm a');
  const walkLabel =
    walkCountForDay > 1 ? `Walk ${walkIndex + 1} · ${timeLabel}` : timeLabel;

  const saveEdit = async () => {
    const parsed = Number.parseInt(steps, 10);
    if (Number.isNaN(parsed) || parsed < 0 || parsed > MAX_DAILY_STEPS) return;
    setBusy(true);
    try {
      await upsert({
        id: entry.id,
        date: entry.date,
        steps: parsed,
        note: note.trim() || undefined,
      });
      setEditing(false);
    } catch (err) {
      if (err instanceof EditAccessDeniedError) return;
      throw err;
    } finally {
      setBusy(false);
    }
  };

  const cancelEdit = () => {
    setEditing(false);
    setSteps(String(entry.steps));
    setNote(entry.note ?? '');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this walk log?')) return;
    setBusy(true);
    try {
      await remove(entry.id);
    } catch (err) {
      if (err instanceof EditAccessDeniedError) return;
    } finally {
      setBusy(false);
    }
  };

  return (
    <article
      className={`flex gap-3 rounded-xl border border-blush/80 bg-canvas/80 p-3 transition ${
        !showDateHeader ? 'ml-4 border-l-2 border-l-sage/40' : ''
      }`}
    >
      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sage" aria-hidden />
      <div className="min-w-0 flex-1">
        {showDateHeader && (
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 border-b border-blush/50 pb-2">
            <button
              type="button"
              onClick={onOpenDayMap}
              className="group text-left"
              title="See where you were on the map at end of this day"
            >
              <p className="font-display text-sm font-semibold text-ink group-hover:text-terracotta">
                {dateLabel}
              </p>
              <p className="text-xs font-semibold text-sage group-hover:underline">
                {formatSteps(dailySteps)} steps · On map →
              </p>
            </button>
          </div>
        )}
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted">{walkLabel}</p>
            {!editing ? (
              <p className="text-lg font-bold text-terracotta">{formatSteps(entry.steps)} steps</p>
            ) : (
              <TimelineDayCardEdit
                steps={steps}
                note={note}
                busy={busy}
                onStepsChange={setSteps}
                onNoteChange={setNote}
                onSave={() => void saveEdit()}
                onCancel={cancelEdit}
              />
            )}
          </div>
          {!editing && (
            <div className="flex flex-wrap gap-1">
              <Button
                variant="ghost"
                className="!px-2 !py-1 text-xs text-sky"
                onClick={() => onOpenWalkMap(stepsAfterWalk, `${dateLabel} · ${walkLabel}`)}
              >
                Map
              </Button>
              <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={() => setEditing(true)}>
                Edit
              </Button>
              <Button
                variant="ghost"
                className="!px-2 !py-1 text-xs text-terracotta"
                onClick={() => void handleDelete()}
                disabled={busy}
              >
                Delete
              </Button>
            </div>
          )}
        </div>
        {entry.note && !editing && (
          <p className="mt-1 line-clamp-2 text-sm text-muted">{entry.note}</p>
        )}
        {showDateHeader && (
          <p className="mt-1 text-xs text-muted">Running total: {formatSteps(runningTotal)}</p>
        )}
      </div>
    </article>
  );
}
