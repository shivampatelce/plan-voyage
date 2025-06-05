import type React from 'react';
import './Trip.css';
import { Grid } from '@mui/material';
import TripSidebar from '../../components/TripSidebar/TripSidebar';

const Trip: React.FC = () => {
  return (
    <>
      <Grid
        container
        spacing={1}
        sx={{
          background: 'white',
        }}>
        <Grid
          size={3}
          sx={{
            position: 'sticky',
            marginTop: '80px',
            height: 'fit-content',
            top: 0,
            background:
              'linear-gradient(135deg, #0f172a 0%, #581c87 50%, #0f172a 100%)',
          }}>
          <TripSidebar />
        </Grid>
        <Grid
          size={9}
          sx={{
            height: 'fit-content',
            overflowY: 'auto',
          }}>
          <section className='trip'>
            <div className='container-max text-center'>
              <h1>Trip page</h1>
            </div>
          </section>
        </Grid>
      </Grid>
    </>
  );
};

export default Trip;
