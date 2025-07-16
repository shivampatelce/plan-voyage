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
import ManageExpenses from './components/ManageExpenses/ManageExpenses';
import Itinerary from './components/Itinerary/Itinerary';
import Document from './components/Document/Document';
import GroupCall from './components/GroupCall/GroupCall';
import LocationSharing from './components/LocationSharing/LocationSharing';

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
        path: `/${ROUTE_PATH.SHARED_ITINERARY}/:tripId`,
        element: <Itinerary />,
      },
      {
        path: `/${ROUTE_PATH.PLAN_TRIP}`,
        element: (
          <>
            <PlanTrip />
          </>
        ),
        children: [
          {
            path: `/${ROUTE_PATH.OVERVIEW}/:tripId`,
            element: (
              <RouteProtection>
                <PlanOverview />
              </RouteProtection>
            ),
          },
          {
            path: `/${ROUTE_PATH.INVITE}/:tripId`,
            element: (
              <RouteProtection>
                <Invite />
              </RouteProtection>
            ),
          },
          {
            path: `/${ROUTE_PATH.SETTINGS}/:tripId`,
            element: (
              <RouteProtection>
                <TripSettings />
              </RouteProtection>
            ),
          },
          {
            path: `/${ROUTE_PATH.TRIP_LIST}/:tripId`,
            element: (
              <RouteProtection>
                <SharedTripList />
              </RouteProtection>
            ),
          },
          {
            path: `/${ROUTE_PATH.TO_DO_LIST}/:tripId`,
            element: (
              <RouteProtection>
                <ToDoList />
              </RouteProtection>
            ),
          },
          {
            path: `/${ROUTE_PATH.CHAT}/:tripId`,
            element: (
              <RouteProtection>
                <Chat />
              </RouteProtection>
            ),
          },
          {
            path: `/${ROUTE_PATH.MANAGE_EXPENSES}/:tripId`,
            element: (
              <RouteProtection>
                <ManageExpenses />
              </RouteProtection>
            ),
          },
          {
            path: `/${ROUTE_PATH.ITINERARY}/:tripId`,
            element: (
              <RouteProtection>
                <Itinerary />
              </RouteProtection>
            ),
          },
          {
            path: `/${ROUTE_PATH.DOCUMENTS}/:tripId`,
            element: (
              <RouteProtection>
                <Document />
              </RouteProtection>
            ),
          },
          {
            path: `/${ROUTE_PATH.GROUP_CALL}/:tripId`,
            element: (
              <RouteProtection>
                <GroupCall />
              </RouteProtection>
            ),
          },
          {
            path: `/${ROUTE_PATH.LOCATION_SHARING}/:tripId`,
            element: (
              <RouteProtection>
                <LocationSharing />
              </RouteProtection>
            ),
          },
        ],
      },
    ],
  },
]);

export default router;
