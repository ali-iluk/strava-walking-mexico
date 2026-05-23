import { format } from 'date-fns';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { DatePicker } from '@/components/DatePicker';
import { InspirationModal } from '@/components/InspirationModal';
import { useProgress } from '@/hooks/useProgress';
import { EditAccessDeniedError } from '@/lib/auth/editGate';
import { MAX_DAILY_STEPS } from '@/lib/storage/types';

export function QuickLogForm() {
  const { upsert } = useProgress();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [date, setDate] = useState(today);
  const [steps, setSteps] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [showInspo, setShowInspo] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    const parsed = Number.parseInt(steps, 10);
    if (Number.isNaN(parsed) || parsed < 0) {
      setError('Enter a valid step count.');
      return;
    }
    if (parsed > MAX_DAILY_STEPS) {
      setError(`Max ${MAX_DAILY_STEPS.toLocaleString()} steps per day.`);
      return;
    }

    setSaving(true);
    try {
      await upsert({ date, steps: parsed, note: note.trim() || undefined });
      setSteps('');
      setNote('');
    } catch (err) {
      if (err instanceof EditAccessDeniedError) return;
      const message = err instanceof Error ? err.message : 'Could not save. Try again.';
      setError(message.includes('Failed') ? message : 'Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Card>
        <h2 className="mb-1 font-display text-lg font-semibold text-ink">Add a walk</h2>
      <p className="mb-4 text-sm text-muted">
        Log each walk separately — morning and evening on the same day are summed in your stats.
      </p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="flex flex-col gap-2">
              <span className="text-sm font-semibold text-muted">Date</span>
              <DatePicker value={date} max={today} onChange={setDate} />
            </div>
            <div className="flex flex-col gap-3">
              <label className="flex flex-col gap-1 text-sm">
                <span className="flex items-center justify-between gap-2">
                  <span className="font-semibold text-muted">Steps</span>
                  <button
                    type="button"
                    onClick={() => setShowInspo(true)}
                    className="rounded-lg bg-sky/30 px-2 py-0.5 text-xs font-semibold text-ink transition hover:bg-sky/50"
                  >
                    Route inspo
                  </button>
                </span>
                <input
                  type="number"
                  min={0}
                  max={MAX_DAILY_STEPS}
                  value={steps}
                  onChange={(e) => setSteps(e.target.value)}
                  placeholder="e.g. 12000"
                  className="field-input"
                  required
                />
              </label>
              <label className="flex flex-col gap-1 text-sm">
                <span className="font-semibold text-muted">Note (optional)</span>
                <input
                  type="text"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Morning walk in CDMX…"
                  maxLength={500}
                  className="field-input"
                />
              </label>
            </div>
          </div>
          {error && <p className="text-sm text-terracotta">{error}</p>}
        <Button type="submit" disabled={saving} className="self-start">
          {saving ? 'Saving…' : 'Add walk'}
        </Button>
        </form>
      </Card>
      <InspirationModal open={showInspo} onClose={() => setShowInspo(false)} />
    </>
  );
}
