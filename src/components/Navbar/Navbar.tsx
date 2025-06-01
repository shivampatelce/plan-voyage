import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  IconButton,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import keycloakConfig from '../../keycloak-config';
import { MENU_ITEMS, type MENU_ITEM_VALUES } from '../../const/MenuItem';

const Navbar = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const menuItems: MENU_ITEM_VALUES[] = [
    MENU_ITEMS.HOME,
    MENU_ITEMS.TRIPS,
    MENU_ITEMS.CREATE_TRIP,
    MENU_ITEMS.LOGOUT,
  ];

  const toggleDrawer = (open: boolean) => () => {
    setDrawerOpen(open);
  };

  const handleMenuClick = (item: MENU_ITEM_VALUES) => {
    if (item === MENU_ITEMS.LOGOUT) {
      keycloakConfig.logout();
    }
  };

  const drawerList = (
    <Box
      sx={{ width: 250 }}
      onClick={toggleDrawer(false)}>
      <List>
        {menuItems.map((text) => (
          <ListItem
            button={true}
            key={text}
            onClick={() => handleMenuClick(text)}>
            <ListItemText primary={text} />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position='static'
        sx={{ backgroundColor: '#ff5722' }}>
        <Toolbar>
          <IconButton
            edge='start'
            color='inherit'
            aria-label='menu'
            onClick={toggleDrawer(true)}
            sx={{ mr: 2, display: { xs: 'block', md: 'none' } }}>
            <MenuIcon />
          </IconButton>

          <Typography
            variant='h6'
            sx={{ flexGrow: 1 }}>
            Plan Voyage
          </Typography>

          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
            {menuItems.map((item) => (
              <Button
                key={item}
                color='inherit'
                onClick={() => handleMenuClick(item)}>
                {item}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor='left'
        open={drawerOpen}
        onClose={toggleDrawer(false)}>
        {drawerList}
      </Drawer>
    </>
  );
};

export default Navbar;
