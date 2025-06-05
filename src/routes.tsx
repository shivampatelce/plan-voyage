import { createBrowserRouter } from 'react-router';
import Home from './pages/Home/Home';
import Trips from './pages/Trips/Trips';
import App from './App';
import { ROUTE_PATH } from './const/RoutePath';
import { checkAuthentication } from './util/auth';
import CreateTrip from './pages/CreateTrip/CreateTrip';
import Trip from './pages/Trip/Trip';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      {
        path: `/${ROUTE_PATH.TRIPS}`,
        element: <Trips />,
        loader: checkAuthentication,
      },
      {
        path: `/${ROUTE_PATH.CREATE_TRIP}`,
        element: <CreateTrip />,
        loader: checkAuthentication,
      },
      {
        path: `/${ROUTE_PATH.TRIP}`,
        element: <Trip />,
      },
    ],
  },
]);

export default router;
