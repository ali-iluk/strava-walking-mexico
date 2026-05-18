import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/routes';
import { ProgressProvider } from '@/hooks/progressContext';

export function App() {
  return (
    <ProgressProvider>
      <RouterProvider router={router} />
    </ProgressProvider>
  );
}
