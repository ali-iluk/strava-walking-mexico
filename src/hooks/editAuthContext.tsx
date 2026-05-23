import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { Button } from '@/components/Button';
import { AnimatePresence, motion } from 'framer-motion';
import {
  EditAccessDeniedError,
  grantEditSession,
  hasEditSession,
  verifyCredential,
} from '@/lib/auth/editGate';

type EditAuthContextValue = {
  ensureEditAccess: () => Promise<void>;
  isUnlocked: boolean;
};

const EditAuthContext = createContext<EditAuthContextValue | null>(null);

export function EditAuthProvider({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [unlocked, setUnlocked] = useState(hasEditSession());
  const resolverRef = useRef<((ok: boolean) => void) | null>(null);

  const promptPassword = useCallback((): Promise<boolean> => {
    return new Promise((resolve) => {
      setPassword('');
      setError(null);
      resolverRef.current = resolve;
      setOpen(true);
    });
  }, []);

  const ensureEditAccess = useCallback(async () => {
    if (hasEditSession()) {
      setUnlocked(true);
      return;
    }
    const ok = await promptPassword();
    if (!ok) throw new EditAccessDeniedError();
    grantEditSession();
    setUnlocked(true);
  }, [promptPassword]);

  const submit = () => {
    if (verifyCredential(password)) {
      resolverRef.current?.(true);
      resolverRef.current = null;
      setOpen(false);
      setPassword('');
      setError(null);
      return;
    }
    setError('Incorrect password.');
  };

  const cancel = () => {
    resolverRef.current?.(false);
    resolverRef.current = null;
    setOpen(false);
    setPassword('');
    setError(null);
  };

  return (
    <EditAuthContext.Provider value={{ ensureEditAccess, isUnlocked: unlocked }}>
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
                Edit password
              </h2>
              <p className="mt-1 text-sm text-muted">
                Adding, editing, or deleting walks requires a password.
              </p>
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
