import { createBrowserRouter } from 'react-router-dom';
import { Layout } from '@/components/Layout';
import { DashboardPage } from '@/features/dashboard/DashboardPage';
import { DataPage } from '@/features/data/DataPage';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Layout />,
      children: [
        { index: true, element: <DashboardPage /> },
        { path: 'data', element: <DataPage /> },
      ],
    },
  ],
  { basename: import.meta.env.BASE_URL },
);
