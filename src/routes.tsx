import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import AppLayout from './components/AppLayout/AppLayout';
import { ROUTE_PATH } from './consts/RoutePath';
import TripList from './pages/TripList';
import CreateTrip from './pages/CreateTrip';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: `/${ROUTE_PATH.TRIPS}`,
        element: <TripList />,
      },
      {
        path: `/${ROUTE_PATH.CREATE_TRIP}`,
        element: <CreateTrip />,
      },
    ],
  },
]);

export default router;
