import { useEffect, useRef, useState } from 'react';
import { useSpring } from 'framer-motion';

export function useAnimatedNumber(target: number, durationMs = 800): number {
  const prefersReducedMotion = useRef(
    typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  const [display, setDisplay] = useState(target);
  const spring = useSpring(target, {
    stiffness: 90,
    damping: 20,
    duration: prefersReducedMotion.current ? 0 : durationMs / 1000,
  });

  useEffect(() => {
    if (prefersReducedMotion.current) {
      setDisplay(target);
      return;
    }
    spring.set(target);
    const unsubscribe = spring.on('change', (value) => {
      setDisplay(Math.round(value));
    });
    return unsubscribe;
  }, [target, spring]);

  return display;
}

export function formatSteps(value: number): string {
  return new Intl.NumberFormat('en-US').format(value);
}
