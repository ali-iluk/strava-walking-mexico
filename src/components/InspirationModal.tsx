import { RouteMapModal, type RouteMapView } from '@/components/RouteMapModal';
import { useProgress } from '@/hooks/useProgress';
import { formatSteps } from '@/hooks/useAnimatedNumber';

type InspirationModalProps = {
  open: boolean;
  onClose: () => void;
};

export function InspirationModal({ open, onClose }: InspirationModalProps) {
  const { totalSteps } = useProgress();

  const view: RouteMapView = {
    totalSteps,
    title: 'Where you are on the walk',
    subtitle: `Today — ${formatSteps(totalSteps)} steps total on the Cancún → Tijuana route.`,
  };

  return <RouteMapModal open={open} onClose={onClose} view={open ? view : null} />;
}
