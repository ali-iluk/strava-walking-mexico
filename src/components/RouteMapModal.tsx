import { AnimatePresence, motion } from 'framer-motion';
import { Button } from '@/components/Button';
import { RouteMap } from '@/components/RouteMap';

export type RouteMapView = {
  totalSteps: number;
  title: string;
  subtitle: string;
};

type RouteMapModalProps = {
  open: boolean;
  onClose: () => void;
  view: RouteMapView | null;
};

export function RouteMapModal({ open, onClose, view }: RouteMapModalProps) {
  if (!view) return null;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="route-map-title"
        >
          <button
            type="button"
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={onClose}
            aria-label="Close"
          />
          <motion.div
            className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-blush bg-surface shadow-soft"
            initial={{ scale: 0.95, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 12 }}
          >
            <div className="border-b border-blush/60 bg-gradient-to-r from-sky/20 via-sage/20 to-terracotta/20 px-5 py-4">
              <h2 id="route-map-title" className="font-display text-lg font-bold text-ink">
                {view.title}
              </h2>
              <p className="mt-1 text-sm text-muted">{view.subtitle}</p>
            </div>
            <RouteMap totalSteps={view.totalSteps} focusOnProgress />
            <div className="flex justify-end gap-2 border-t border-blush/60 px-5 py-4">
              <Button variant="secondary" onClick={onClose}>
                Close
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
