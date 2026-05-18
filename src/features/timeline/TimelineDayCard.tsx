import { format, parseISO } from 'date-fns';
import { useState } from 'react';
import { Button } from '@/components/Button';
import { formatSteps } from '@/hooks/useAnimatedNumber';
import { useProgress } from '@/hooks/useProgress';
import { runningTotalAtDate } from '@/lib/progress/aggregate';
import type { DayEntry } from '@/lib/storage/types';
import { MAX_DAILY_STEPS } from '@/lib/storage/types';
import { TimelineDayCardEdit } from '@/features/timeline/TimelineDayCardEdit';

type TimelineDayCardProps = {
  entry: DayEntry;
};

export function TimelineDayCard({ entry }: TimelineDayCardProps) {
  const { snapshot, upsert, remove } = useProgress();
  const [editing, setEditing] = useState(false);
  const [steps, setSteps] = useState(String(entry.steps));
  const [note, setNote] = useState(entry.note ?? '');
  const [busy, setBusy] = useState(false);

  const runningTotal = runningTotalAtDate(snapshot.entries, entry.date);
  const dateLabel = format(parseISO(entry.date), 'EEEE, MMM d');

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
    if (!window.confirm(`Delete log for ${dateLabel}?`)) return;
    setBusy(true);
    try {
      await remove(entry.id);
    } finally {
      setBusy(false);
    }
  };

  return (
    <article className="flex gap-3 rounded-xl border border-blush/80 bg-canvas/80 p-3">
      <div className="mt-1 h-2 w-2 shrink-0 rounded-full bg-sage" aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <div>
            <p className="font-display text-sm font-semibold text-ink">{dateLabel}</p>
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
            <div className="flex gap-1">
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
        <p className="mt-1 text-xs text-muted">Running total: {formatSteps(runningTotal)}</p>
      </div>
    </article>
  );
}
