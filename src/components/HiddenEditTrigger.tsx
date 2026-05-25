import { useRef } from 'react';
import { useEditAuth } from '@/hooks/editAuthContext';

const TAP_WINDOW_MS = 700;
const TAP_COUNT = 3;

export function HiddenEditTrigger() {
  const { isUnlocked, openLogin, lock } = useEditAuth();
  const tapCountRef = useRef(0);
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleTap = () => {
    tapCountRef.current += 1;
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      tapCountRef.current = 0;
    }, TAP_WINDOW_MS);

    if (tapCountRef.current < TAP_COUNT) return;
    tapCountRef.current = 0;
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);

    if (isUnlocked) {
      lock();
    } else {
      openLogin();
    }
  };

  return (
    <footer className="mt-10 flex justify-center pb-2">
      <button
        type="button"
        onClick={handleTap}
        className="h-6 min-w-[4rem] rounded-full text-[10px] font-medium tracking-widest text-muted/25 transition hover:text-muted/40"
        aria-label="Walking Mexico"
      >
        ···
      </button>
    </footer>
  );
}
