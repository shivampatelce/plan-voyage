import {
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Box,
  Typography,
  IconButton,
  Avatar,
} from '@mui/material';
import type React from 'react';
import './TripSidebar.css';
import { NavLink, useLocation } from 'react-router';
import { ROUTE_PATH } from '../../const/RoutePath';
import CloseIcon from '@mui/icons-material/Close';
import {
  Flight,
  Info,
  PersonAdd,
  CalendarMonth,
  Inventory,
  ChecklistRtl,
  AccountBalanceWallet,
  Chat,
  Description,
} from '@mui/icons-material';

const TripSidebar: React.FC<{
  onCloseSidebar: any;
}> = ({ onCloseSidebar }) => {
  const location = useLocation();

  const tripSidebarList = [
    {
      path: ROUTE_PATH.TRIP_INFO,
      title: 'Trip Info',
      icon: Info,
    },
    {
      path: ROUTE_PATH.INVITE,
      title: 'Invite Friends',
      icon: PersonAdd,
    },
    {
      path: 'itinerary',
      title: 'Itinerary',
      icon: CalendarMonth,
    },
    {
      path: 'packaging-list',
      title: 'Packing List',
      icon: Inventory,
    },
    {
      path: 'to-do-list',
      title: 'To Do List',
      icon: ChecklistRtl,
    },
    {
      path: 'budget',
      title: 'Budget',
      icon: AccountBalanceWallet,
    },
    {
      path: 'chat',
      title: 'Chat',
      icon: Chat,
    },
    {
      path: 'documents',
      title: 'Documents',
      icon: Description,
    },
  ];

  return (
    <Box className='trip-sidebar-container'>
      <List className='trip-sidebar-list'>
        <ListItem className='trip-sidebar-header'>
          <Box className='trip-sidebar-logo-section'>
            <Avatar className='trip-sidebar-avatar'>
              <Flight />
            </Avatar>
            <Box className='trip-sidebar-logo-text'>
              <Typography
                variant='h6'
                className='trip-sidebar-title'>
                Plan Voyage
              </Typography>
              <Typography
                variant='caption'
                className='trip-sidebar-subtitle'>
                Your travel companion
              </Typography>
            </Box>
          </Box>

          <IconButton
            onClick={onCloseSidebar}
            className='trip-sidebar-close-btn'>
            <CloseIcon />
          </IconButton>
        </ListItem>

        <Box className='trip-sidebar-nav-container'>
          {tripSidebarList.map(({ title, path, icon: IconComponent }) => {
            const isActive = location.pathname === `/${path}`;

            return (
              <NavLink
                key={title}
                to={`/${path}`}
                className='trip-sidebar-link'>
                <ListItem
                  className={`trip-sidebar-nav-item ${
                    isActive ? 'active' : ''
                  }`}>
                  <ListItemButton className='trip-sidebar-nav-button'>
                    <IconComponent
                      className={`trip-sidebar-nav-icon ${
                        isActive ? 'active' : ''
                      }`}
                    />
                    <ListItemText
                      primary={title}
                      className={`trip-sidebar-nav-text ${
                        isActive ? 'active' : ''
                      }`}
                    />
                  </ListItemButton>
                </ListItem>
              </NavLink>
            );
          })}
        </Box>

        <Box className='trip-sidebar-bottom-accent' />
      </List>
    </Box>
  );
};

export default TripSidebar;
