import { Button } from '@/components/Button';
import { MAX_DAILY_STEPS } from '@/lib/storage/types';

type TimelineDayCardEditProps = {
  steps: string;
  note: string;
  busy: boolean;
  onStepsChange: (value: string) => void;
  onNoteChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
};

export function TimelineDayCardEdit({
  steps,
  note,
  busy,
  onStepsChange,
  onNoteChange,
  onSave,
  onCancel,
}: TimelineDayCardEditProps) {
  const parsed = Number.parseInt(steps, 10);
  const valid =
    !Number.isNaN(parsed) && parsed >= 0 && parsed <= MAX_DAILY_STEPS;

  return (
    <div className="mt-2 flex flex-col gap-2">
      <input
        type="number"
        value={steps}
        onChange={(e) => onStepsChange(e.target.value)}
        className="w-32 rounded-lg border border-blush px-2 py-1 text-sm"
      />
      <input
        type="text"
        value={note}
        onChange={(e) => onNoteChange(e.target.value)}
        placeholder="Note"
        className="rounded-lg border border-blush px-2 py-1 text-sm"
      />
      <div className="flex gap-2">
        <Button className="!px-2 !py-1 text-xs" onClick={onSave} disabled={busy || !valid}>
          Save
        </Button>
        <Button variant="ghost" className="!px-2 !py-1 text-xs" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </div>
  );
}
