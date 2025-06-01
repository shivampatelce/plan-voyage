import { createBrowserRouter } from 'react-router';
import Home from './pages/Home/Home';
import Trips from './pages/Trips/Trips';
import App from './App';
import { ROUTE_PATH } from './const/RoutePath';
import { checkAuthentication } from './util/auth';

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
    ],
  },
]);

export default router;
