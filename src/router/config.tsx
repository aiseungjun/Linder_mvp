
import { RouteObject } from 'react-router-dom';
import HomePage from '../pages/home/page';
import AppPage from '../pages/app/page';
import NotFound from '../pages/NotFound';

const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/app',
    element: <AppPage />,
  },
  {
    path: '*',
    element: <NotFound />,
  },
];

export default routes;
