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
import InvitationList from './pages/InvitationList';
import TripInvitation from './pages/TripInvitation';
import TripSettings from './components/TripSettings/TripSettings';
import ToDoList from './components/ToDoList/ToDoList';
import SharedTripList from './components/SharedTripList/SharedTripList';
import Chat from './components/Chat/Chat';

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
        path: `/${ROUTE_PATH.INVITATIONS}`,
        element: (
          <>
            <RouteProtection>
              <InvitationList />
            </RouteProtection>
          </>
        ),
      },
      {
        path: `/${ROUTE_PATH.TRIP_INVITATION}/:invitationId`,
        element: (
          <>
            <RouteProtection>
              <TripInvitation />
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
          {
            path: `/${ROUTE_PATH.SETTINGS}/:tripId`,
            element: <TripSettings />,
          },
          {
            path: `/${ROUTE_PATH.TRIP_LIST}/:tripId`,
            element: <SharedTripList />,
          },
          {
            path: `/${ROUTE_PATH.TO_DO_LIST}/:tripId`,
            element: <ToDoList />,
          },
          {
            path: `/${ROUTE_PATH.CHAT}/:tripId`,
            element: <Chat />,
          },
        ],
      },
    ],
  },
]);

export default router;
