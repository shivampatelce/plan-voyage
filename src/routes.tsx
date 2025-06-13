import { createBrowserRouter } from 'react-router';
import Home from './pages/Home';
import AppLayout from './components/AppLayout/AppLayout';
import { ROUTE_PATH } from './consts/RoutePath';
import TripList from './pages/TripList';
import CreateTrip from './pages/CreateTrip';
import PlanTrip from './pages/PlanTrip';
import RouteProtection from './util/RouteProtection';
import PlanOverview from './components/PlanTrip/PlanOverview';
import Invite from './components/Invite/Invite';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: `/${ROUTE_PATH.TRIPS}`,
        element: (
          <>
            <RouteProtection>
              <TripList />
            </RouteProtection>
          </>
        ),
      },
      {
        path: `/${ROUTE_PATH.CREATE_TRIP}`,
        element: (
          <>
            <RouteProtection>
              <CreateTrip />
            </RouteProtection>
          </>
        ),
      },
      {
        path: `/${ROUTE_PATH.PLAN_TRIP}`,
        element: (
          <>
            <RouteProtection>
              <PlanTrip />
            </RouteProtection>
          </>
        ),
        children: [
          {
            path: `/${ROUTE_PATH.OVERVIEW}/:tripId`,
            element: <PlanOverview />,
          },
          {
            path: `/${ROUTE_PATH.INVITE}/:tripId`,
            element: <Invite />,
          },
        ],
      },
    ],
  },
]);

export default router;
