import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import type React from 'react';
import './TripSidebar.css';
import { NavLink, useLocation } from 'react-router';
import { ROUTE_PATH } from '../../const/RoutePath';
import CloseIcon from '@mui/icons-material/Close';
import { Flight } from '@mui/icons-material';

const TripSidebar: React.FC<{
  onCloseSidebar: any;
}> = ({ onCloseSidebar }) => {
  const location = useLocation();

  const tripSidebarList = [
    {
      path: ROUTE_PATH.TRIP_INFO,
      title: 'Trip Info',
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
        <ListItem>
          <ListItemButton>
            <Flight
              sx={{
                marginRight: '6px',
              }}
              className='logo-icon'
            />
            <ListItemText
              className='logo-text gradient-text'
              primary='Plan Voyage'
              sx={{
                color: 'white',
              }}
            />
          </ListItemButton>

          <ListItemButton
            sx={{
              marginLeft: 'auto',
              width: 'fit-content',
            }}
            onClick={onCloseSidebar}>
            <CloseIcon
              sx={{
                marginLeft: 'auto',
                width: 'fit-content',
              }}
            />
          </ListItemButton>
        </ListItem>

        {tripSidebarList.map(({ title, path }) => (
          <NavLink
            key={title}
            to={`/${path}`}
            className='trip-sidebar-link'>
            <ListItem>
              <ListItemButton>
                <ListItemText
                  sx={{
                    color:
                      location.pathname == `/${path}` ? '#60a5fa' : 'white',
                  }}
                  primary={title}
                />
              </ListItemButton>
              {location.pathname == `/${path}` && (
                <Flight
                  sx={{
                    marginRight: '6px',
                  }}
                  className='logo-icon'
                />
              )}
            </ListItem>
          </NavLink>
        ))}
      </List>
    </>
  );
};

export default TripSidebar;
