import { format } from 'date-fns';
import type { AppSnapshot } from '@/lib/storage/types';

export function downloadSnapshot(snapshot: AppSnapshot): void {
  const dateLabel = format(new Date(), 'yyyy-MM-dd');
  const filename = `walking-mexico-progress-${dateLabel}.json`;
  const blob = new Blob([JSON.stringify(snapshot, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}
