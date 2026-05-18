import { useContext } from 'react';
import { ProgressContext, type ProgressContextValue } from '@/hooks/progressContext';

export function useProgress(): ProgressContextValue {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error('useProgress must be used within ProgressProvider');
  }
  return ctx;
}
