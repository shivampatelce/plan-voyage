import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import type React from 'react';
import './TripSidebar.css';
import { NavLink } from 'react-router';
import { ROUTE_PATH } from '../../const/RoutePath';

const TripSidebar: React.FC = () => {
  const tripSidebarList = [
    {
      path: ROUTE_PATH.TRIP_DESCRIPTION,
      title: 'Description',
    },
    {
      path: ROUTE_PATH.INVITE,
      title: 'Invite Friends',
    },
    {
      path: 'itinerary',
      title: 'Itinerary',
    },
    {
      path: 'packaging-list',
      title: 'Packaging List',
    },
    {
      path: 'to-do-list',
      title: 'To Do List',
    },
    {
      path: 'budget',
      title: 'Budget',
    },
    {
      path: 'chat',
      title: 'Chat',
    },
    {
      path: 'documents',
      title: 'Documents',
    },
  ];

  return (
    <>
      <List>
        {tripSidebarList.map(({ title, path }) => (
          <NavLink
            key={title}
            to={`/${path}`}
            className='trip-sidebar-link'>
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText
                  primary={title}
                  sx={{
                    color: 'white',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </NavLink>
        ))}
      </List>
    </>
  );
};

export default TripSidebar;
