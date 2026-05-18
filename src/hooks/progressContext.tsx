import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { downloadSnapshot } from '@/lib/import-export/exportSnapshot';
import { mergeSnapshots, parseImportFile } from '@/lib/import-export/importSnapshot';
import {
  buildCumulativeSeries,
  computeStats,
  createEmptySnapshot,
  groupByMonth,
  sortEntriesDesc,
} from '@/lib/progress/aggregate';
import { lastSevenDailyBars, projectFinishDate } from '@/lib/progress/projections';
import { progressRepository } from '@/lib/storage/localStorageRepository';
import type { AppSnapshot, DayEntry, UpsertEntryInput } from '@/lib/storage/types';

export type ProgressContextValue = {
  snapshot: AppSnapshot;
  isLoading: boolean;
  totalSteps: number;
  remaining: number;
  percentComplete: number;
  entriesSorted: DayEntry[];
  monthGroups: ReturnType<typeof groupByMonth>;
  cumulativeSeries: ReturnType<typeof buildCumulativeSeries>;
  dailyBars: ReturnType<typeof lastSevenDailyBars>;
  projection: ReturnType<typeof projectFinishDate>;
  upsert: (input: UpsertEntryInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
  exportData: () => void;
  importFile: (file: File) => Promise<{ ok: boolean; message: string }>;
  clearAll: () => Promise<void>;
  refresh: () => Promise<void>;
};

export const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [snapshot, setSnapshot] = useState<AppSnapshot>(createEmptySnapshot());
  const [isLoading, setIsLoading] = useState(true);

  const refresh = useCallback(async () => {
    setSnapshot(await progressRepository.load());
  }, []);

  useEffect(() => {
    void (async () => {
      setIsLoading(true);
      await refresh();
      setIsLoading(false);
    })();
  }, [refresh]);

  const stats = useMemo(() => computeStats(snapshot), [snapshot]);
  const entriesSorted = useMemo(() => sortEntriesDesc(snapshot.entries), [snapshot.entries]);
  const monthGroups = useMemo(() => groupByMonth(snapshot.entries), [snapshot.entries]);
  const cumulativeSeries = useMemo(
    () => buildCumulativeSeries(snapshot.entries),
    [snapshot.entries],
  );
  const dailyBars = useMemo(() => lastSevenDailyBars(snapshot.entries), [snapshot.entries]);
  const projection = useMemo(
    () => projectFinishDate(snapshot.entries, stats.remaining),
    [snapshot.entries, stats.remaining],
  );

  const upsert = useCallback(
    async (input: UpsertEntryInput) => {
      await progressRepository.upsertEntry(input);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await progressRepository.deleteEntry(id);
      await refresh();
    },
    [refresh],
  );

  const exportData = useCallback(() => {
    downloadSnapshot(snapshot);
  }, [snapshot]);

  const importFile = useCallback(
    async (file: File) => {
      const result = await parseImportFile(file);
      if (!result.ok) {
        return { ok: false, message: result.errors.join('; ') };
      }
      const { snapshot: merged } = mergeSnapshots(snapshot, result.snapshot);
      await progressRepository.save(merged);
      await refresh();
      return {
        ok: true,
        message: `Imported ${result.mergedCount} entries (merged by date).`,
      };
    },
    [snapshot, refresh],
  );

  const clearAll = useCallback(async () => {
    await progressRepository.clear();
    await refresh();
  }, [refresh]);

  const value: ProgressContextValue = {
    snapshot,
    isLoading,
    totalSteps: stats.totalSteps,
    remaining: stats.remaining,
    percentComplete: stats.percentComplete,
    entriesSorted,
    monthGroups,
    cumulativeSeries,
    dailyBars,
    projection,
    upsert,
    remove,
    exportData,
    importFile,
    clearAll,
    refresh,
  };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}
