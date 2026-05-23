import { useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useProgress } from '@/hooks/useProgress';
import { EditAccessDeniedError } from '@/lib/auth/editGate';
import { SCHEMA_VERSION } from '@/lib/storage/types';

export function DataPage() {
  const { exportData, clearAll, snapshot } = useProgress();
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [confirmClear, setConfirmClear] = useState('');

  const handleClear = async () => {
    if (confirmClear !== 'DELETE') return;
    try {
      await clearAll();
      setConfirmClear('');
      setMessage({ type: 'ok', text: 'All entries removed from the database.' });
    } catch (err) {
      if (err instanceof EditAccessDeniedError) return;
      setMessage({ type: 'err', text: 'Could not clear data. Try again.' });
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="font-display text-lg font-semibold text-ink">Export backup</h2>
        <p className="mt-2 text-sm text-muted">
          Your steps are stored in Supabase (source of truth). Export a JSON snapshot anytime for
          your own backup — import is no longer needed.
        </p>
        <div className="mt-4">
          <Button onClick={exportData}>Export JSON</Button>
        </div>
        {message && (
          <p
            className={`mt-3 text-sm ${message.type === 'ok' ? 'text-sage' : 'text-terracotta'}`}
            role="status"
          >
            {message.text}
          </p>
        )}
      </Card>

      <Card>
        <h3 className="font-display text-sm font-semibold text-ink">Database snapshot</h3>
        <ul className="mt-2 list-inside list-disc text-sm text-muted">
          <li>Schema version: {SCHEMA_VERSION}</li>
          <li>Goal: {snapshot.goalSteps.toLocaleString()} steps</li>
          <li>Entries: {snapshot.entries.length}</li>
          <li>Last updated: {new Date(snapshot.updatedAt).toLocaleString()}</li>
        </ul>
        <p className="mt-3 text-xs text-muted">
          Backed by Supabase table <code className="rounded bg-blush px-1">day_entries</code>.
        </p>
      </Card>

      <Card className="border-terracotta/30">
        <h2 className="font-display text-lg font-semibold text-terracotta">Danger zone</h2>
        <p className="mt-2 text-sm text-muted">
          Type <strong>DELETE</strong> to remove all entries from the database. Export first if you
          need a backup.
        </p>
        <input
          type="text"
          value={confirmClear}
          onChange={(e) => setConfirmClear(e.target.value)}
          placeholder="DELETE"
          className="mt-3 w-full max-w-xs rounded-xl border border-blush bg-canvas px-3 py-2 text-sm"
        />
        <Button
          variant="danger"
          className="mt-3"
          disabled={confirmClear !== 'DELETE'}
          onClick={() => void handleClear()}
        >
          Clear all data
        </Button>
      </Card>
    </div>
  );
}
