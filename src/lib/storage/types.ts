export const GOAL_STEPS = 6_000_000;
export const STORAGE_KEY = 'walking-mexico:v1';
export const SCHEMA_VERSION = 1 as const;
export const MAX_DAILY_STEPS = 100_000;

export type DayEntry = {
  id: string;
  date: string;
  steps: number;
  note?: string;
  updatedAt: string;
};

export type AppSnapshot = {
  schemaVersion: typeof SCHEMA_VERSION;
  goalSteps: number;
  createdAt: string;
  updatedAt: string;
  entries: DayEntry[];
};

export type UpsertEntryInput = {
  id?: string;
  date: string;
  steps: number;
  note?: string;
};
