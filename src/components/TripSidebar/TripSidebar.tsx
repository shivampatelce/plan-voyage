import { List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import type React from 'react';
import './TripSidebar.css';

const TripSidebar: React.FC = () => {
  const tripSidebarList = [
    {
      path: 'description',
      title: 'Description',
    },
    {
      path: 'invite-friends',
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
        {tripSidebarList.map(({ title }) => (
          <ListItem
            key={title}
            disablePadding>
            <ListItemButton>
              <ListItemText primary={title} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );
};

export default TripSidebar;
