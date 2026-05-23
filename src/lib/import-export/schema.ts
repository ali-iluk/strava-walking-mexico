import { z } from 'zod';
import { GOAL_STEPS, MAX_DAILY_STEPS, SCHEMA_VERSION } from '@/lib/storage/types';

export const dayEntrySchema = z.object({
  id: z.string().uuid(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  steps: z.number().int().min(0).max(MAX_DAILY_STEPS),
  note: z.string().max(500).optional(),
  walkAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const appSnapshotSchema = z.object({
  schemaVersion: z.literal(SCHEMA_VERSION),
  goalSteps: z.number().int().positive().default(GOAL_STEPS),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  entries: z.array(dayEntrySchema),
});

export type ParsedSnapshot = z.infer<typeof appSnapshotSchema>;

export function parseSnapshotJson(raw: unknown): ParsedSnapshot {
  return appSnapshotSchema.parse(raw);
}
