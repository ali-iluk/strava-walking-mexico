import { Navigate } from 'react-router-dom';
import { useEditAuth } from '@/hooks/editAuthContext';
import type { ReactNode } from 'react';

export function EditModeRoute({ children }: { children: ReactNode }) {
  const { isUnlocked } = useEditAuth();
  if (!isUnlocked) {
    return <Navigate to="/" replace />;
  }
  return children;
}
