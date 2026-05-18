import { motion } from 'framer-motion';
import { formatSteps, useAnimatedNumber } from '@/hooks/useAnimatedNumber';
import { useProgress } from '@/hooks/useProgress';
import { GOAL_STEPS } from '@/lib/storage/types';

export function HeroCounter() {
  const { totalSteps, remaining, percentComplete, projection, isLoading } = useProgress();
  const animatedTotal = useAnimatedNumber(totalSteps);

  if (isLoading) {
    return (
      <section className="text-center">
        <p className="text-muted">Loading your progress…</p>
      </section>
    );
  }

  return (
    <section className="text-center">
      <p className="mb-2 font-display text-sm font-semibold uppercase tracking-widest text-muted">
        Steps toward 6M
      </p>
      <motion.p
        key={animatedTotal}
        className="font-display text-5xl font-bold tabular-nums text-ink sm:text-7xl"
        initial={{ opacity: 0.6, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
      >
        {formatSteps(animatedTotal)}
      </motion.p>
      <p className="mt-2 text-sm text-muted">
        of {formatSteps(GOAL_STEPS)} · {percentComplete.toFixed(1)}% complete
      </p>
      <p className="mt-1 text-sm text-ink">
        <span className="font-semibold text-terracotta">{formatSteps(remaining)}</span> steps to go
      </p>
      {projection.projectedFinishDate && (
        <p className="mt-2 text-xs text-muted">
          At ~{formatSteps(projection.avgDailySteps)}/day (last {projection.windowDays} logs): finish
          around {projection.projectedFinishDate}
        </p>
      )}
      <motion.div
        className="mx-auto mt-5 h-2 max-w-md overflow-hidden rounded-full bg-blush"
        role="progressbar"
        aria-valuenow={percentComplete}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-sage via-sky to-terracotta"
          initial={{ width: 0 }}
          animate={{ width: `${percentComplete}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
        />
      </motion.div>
    </section>
  );
}
