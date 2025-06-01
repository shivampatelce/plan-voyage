import { createBrowserRouter } from 'react-router';
import Home from './pages/Home/Home';
import Trips from './pages/Trips/Trips';
import CreateTrips from './pages/CreateTrips/CreateTrips';
import App from './App';
import { ROUTE_PATH } from './const/RoutePath';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: `/${ROUTE_PATH.TRIPS}`,
        element: <Trips />,
      },
      {
        path: `/${ROUTE_PATH.CREATE_TRIPS}`,
        element: <CreateTrips />,
      },
    ],
  },
]);

export default router;
