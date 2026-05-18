import { format } from 'date-fns';
import { useState, type FormEvent } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useProgress } from '@/hooks/useProgress';
import { MAX_DAILY_STEPS } from '@/lib/storage/types';

export function QuickLogForm() {
  const { upsert } = useProgress();
  const today = format(new Date(), 'yyyy-MM-dd');
  const [date, setDate] = useState(today);
  const [steps, setSteps] = useState('');
  const [note, setNote] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

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
      setDate(today);
    } catch {
      setError('Could not save. Try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <h2 className="mb-4 font-display text-lg font-semibold text-ink">Log today</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-muted">Date</span>
            <input
              type="date"
              value={date}
              max={today}
              onChange={(e) => setDate(e.target.value)}
              className="rounded-xl border border-blush bg-canvas px-3 py-2 text-ink outline-none focus:border-sage"
              required
            />
          </label>
          <label className="flex flex-col gap-1 text-sm">
            <span className="font-semibold text-muted">Steps</span>
            <input
              type="number"
              min={0}
              max={MAX_DAILY_STEPS}
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              placeholder="e.g. 12000"
              className="rounded-xl border border-blush bg-canvas px-3 py-2 text-ink outline-none focus:border-sage"
              required
            />
          </label>
        </div>
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-semibold text-muted">Note (optional)</span>
          <input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Morning walk in CDMX…"
            maxLength={500}
            className="rounded-xl border border-blush bg-canvas px-3 py-2 text-ink outline-none focus:border-sage"
          />
        </label>
        {error && <p className="text-sm text-terracotta">{error}</p>}
        <Button type="submit" disabled={saving} className="self-start">
          {saving ? 'Saving…' : 'Save day'}
        </Button>
      </form>
    </Card>
  );
}
