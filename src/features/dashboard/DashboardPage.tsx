import { useState } from 'react';
import { RouteMapModal, type RouteMapView } from '@/components/RouteMapModal';
import { HeroCounter } from '@/features/dashboard/HeroCounter';
import { ProgressCharts } from '@/features/dashboard/ProgressCharts';
import { QuickLogForm } from '@/features/dashboard/QuickLogForm';
import { TimelineSection } from '@/features/timeline/TimelineSection';
import { useEditAuth } from '@/hooks/editAuthContext';

export function DashboardPage() {
  const { isUnlocked } = useEditAuth();
  const [mapView, setMapView] = useState<RouteMapView | null>(null);

  return (
    <div className="flex flex-col gap-8">
      <HeroCounter />
      {isUnlocked && <QuickLogForm />}
      <ProgressCharts />
      <TimelineSection onOpenMap={setMapView} />
      <RouteMapModal
        open={mapView !== null}
        onClose={() => setMapView(null)}
        view={mapView}
      />
    </div>
  );
}
