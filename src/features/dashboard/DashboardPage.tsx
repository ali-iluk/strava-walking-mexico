import { HeroCounter } from '@/features/dashboard/HeroCounter';
import { ProgressCharts } from '@/features/dashboard/ProgressCharts';
import { QuickLogForm } from '@/features/dashboard/QuickLogForm';
import { TimelineSection } from '@/features/timeline/TimelineSection';

export function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <HeroCounter />
      <QuickLogForm />
      <ProgressCharts />
      <TimelineSection />
    </div>
  );
}
