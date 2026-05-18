import { useRef, useState } from 'react';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { useProgress } from '@/hooks/useProgress';
import { SCHEMA_VERSION, STORAGE_KEY } from '@/lib/storage/types';

export function DataPage() {
  const { exportData, importFile, clearAll, snapshot } = useProgress();
  const fileRef = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);
  const [confirmClear, setConfirmClear] = useState('');

  const handleImport = async (file: File | undefined) => {
    if (!file) return;
    const result = await importFile(file);
    setMessage({ type: result.ok ? 'ok' : 'err', text: result.message });
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleClear = async () => {
    if (confirmClear !== 'DELETE') return;
    await clearAll();
    setConfirmClear('');
    setMessage({ type: 'ok', text: 'All data cleared.' });
  };

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <h2 className="font-display text-lg font-semibold text-ink">Export & import</h2>
        <p className="mt-2 text-sm text-muted">
          Your progress lives in the browser ({STORAGE_KEY}). Export a JSON backup anytime, or
          import to merge entries by date (import wins on conflicts).
        </p>
        <div className="mt-4 flex flex-wrap gap-3">
          <Button onClick={exportData}>Export JSON</Button>
          <Button variant="secondary" onClick={() => fileRef.current?.click()}>
            Import JSON
          </Button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="hidden"
            onChange={(e) => void handleImport(e.target.files?.[0])}
          />
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
        <h3 className="font-display text-sm font-semibold text-ink">Snapshot format</h3>
        <ul className="mt-2 list-inside list-disc text-sm text-muted">
          <li>Schema version: {SCHEMA_VERSION}</li>
          <li>Goal: {snapshot.goalSteps.toLocaleString()} steps</li>
          <li>Entries: {snapshot.entries.length}</li>
          <li>Last updated: {new Date(snapshot.updatedAt).toLocaleString()}</li>
        </ul>
        <p className="mt-3 text-xs text-muted">
          Future: swap <code className="rounded bg-blush px-1">LocalStorageRepository</code> for an
          HTTP-backed repository — the UI and JSON shape stay the same.
        </p>
      </Card>

      <Card className="border-terracotta/30">
        <h2 className="font-display text-lg font-semibold text-terracotta">Danger zone</h2>
        <p className="mt-2 text-sm text-muted">
          Type <strong>DELETE</strong> to remove all local data. Export first if you need a backup.
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
