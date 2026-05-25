import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react';
import { Button } from '@/components/Button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  EditAccessDeniedError,
  clearEditSession,
  grantEditSession,
  hasEditSession,
  verifyCredential,
} from '@/lib/auth/editGate';

type EditAuthContextValue = {
  isUnlocked: boolean;
  openLogin: () => void;
  lock: () => void;
  ensureEditAccess: () => Promise<void>;
};

const EditAuthContext = createContext<EditAuthContextValue | null>(null);

export function EditAuthProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(false);

  useEffect(() => {
    setUnlocked(hasEditSession());
  }, []);

  const lock = useCallback(() => {
    clearEditSession();
    setUnlocked(false);
    setOpen(false);
    setPassword('');
    setError(null);
  }, []);

  const openLogin = useCallback(() => {
    setPassword('');
    setError(null);
    setOpen(true);
  }, []);

  const ensureEditAccess = useCallback(async () => {
    if (hasEditSession()) {
      setUnlocked(true);
      return;
    }
    throw new EditAccessDeniedError();
  }, []);

  const submit = () => {
    if (verifyCredential(password.trim())) {
      grantEditSession();
      setUnlocked(true);
      setOpen(false);
      setPassword('');
      setError(null);
      return;
    }
    setError('Incorrect password.');
  };

  const cancel = () => {
    setOpen(false);
    setPassword('');
    setError(null);
  };

  return (
    <EditAuthContext.Provider value={{ isUnlocked: unlocked, openLogin, lock, ensureEditAccess }}>
      {children}
      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[60] flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-auth-title"
          >
            <button
              type="button"
              className="absolute inset-0 bg-ink/50 backdrop-blur-sm"
              onClick={cancel}
              aria-label="Cancel"
            />
            <motion.div
              className="relative z-10 w-full max-w-sm rounded-2xl border border-blush bg-surface p-5 shadow-soft"
              initial={{ scale: 0.96, y: 8 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 8 }}
            >
              <h2 id="edit-auth-title" className="font-display text-lg font-bold text-ink">
                Unlock edits
              </h2>
              <label className="mt-4 flex flex-col gap-1 text-sm">
                <span className="font-semibold text-muted">Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && submit()}
                  className="field-input"
                  autoFocus
                  autoComplete="off"
                />
              </label>
              {error && <p className="mt-2 text-sm text-terracotta">{error}</p>}
              <div className="mt-4 flex justify-end gap-2">
                {unlocked && (
                  <Button variant="ghost" onClick={lock}>
                    Lock
                  </Button>
                )}
                <Button variant="ghost" onClick={cancel}>
                  Cancel
                </Button>
                <Button onClick={submit}>Unlock</Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EditAuthContext.Provider>
  );
}

export function useEditAuth(): EditAuthContextValue {
  const ctx = useContext(EditAuthContext);
  if (!ctx) {
    throw new Error('useEditAuth must be used within EditAuthProvider');
  }
  return ctx;
}
