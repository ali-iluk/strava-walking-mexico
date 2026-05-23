import { RouterProvider } from 'react-router-dom';
import { router } from '@/app/routes';
import { EditAuthProvider } from '@/hooks/editAuthContext';
import { ProgressProvider } from '@/hooks/progressContext';

export function App() {
  return (
    <EditAuthProvider>
      <ProgressProvider>
        <RouterProvider router={router} />
      </ProgressProvider>
    </EditAuthProvider>
  );
}
