import type React from 'react';
import './Trip.css';
import { Fab, Grid } from '@mui/material';
import TripSidebar from '../../components/TripSidebar/TripSidebar';
import { Outlet } from 'react-router';
import { useState } from 'react';
import MenuIcon from '@mui/icons-material/Menu';

const Trip: React.FC = () => {
  const [isSidebarOpened, setIsSidebarOpened] = useState(false);
  const MIN_PAGE_HEIGHT = '90vh';

  return (
    <>
      <Grid
        container
        spacing={1}
        sx={{
          background: 'white',
        }}>
        {!isSidebarOpened && (
          <Fab
            sx={{
              marginTop: '80px',
              marginLeft: '10px',
              background: 'linear-gradient(135deg, #3b82f6, #8b5cf6)',
            }}
            color='primary'
            aria-label='add'
            onClick={() => {
              setIsSidebarOpened(true);
            }}>
            <MenuIcon />
          </Fab>
        )}

        <Grid
          size={isSidebarOpened ? 3 : 0}
          sx={{
            display: isSidebarOpened ? 'block' : 'none',
            position: 'sticky',
            height: 'fit-content',
            top: 0,
            zIndex: 60,
            minHeight: MIN_PAGE_HEIGHT,
            background:
              'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
          }}>
          <TripSidebar
            onCloseSidebar={() => {
              setIsSidebarOpened(false);
            }}
          />
        </Grid>
        <Grid
          size={isSidebarOpened ? 9 : 12}
          sx={{
            height: 'fit-content',
            overflowY: 'auto',
            minHeight: MIN_PAGE_HEIGHT,
          }}>
          <section className='trip'>
            <div className='container-max text-center'>
              <Outlet />
            </div>
          </section>
        </Grid>
      </Grid>
    </>
  );
};

export default Trip;
