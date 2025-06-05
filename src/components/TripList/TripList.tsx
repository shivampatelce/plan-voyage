import { useState, useEffect } from 'react';
import './TripList.css';
import GlassmorphicCard from '../ui/GlassmorphicCard/GlassmorphicCard';
import { Box, Typography } from '@mui/material';
import { FlightTakeoff } from '@mui/icons-material';
import { useNavigate } from 'react-router';
import { ROUTE_PATH } from '../../const/RoutePath';

interface Trip {
  id: number;
  title: string;
  image: string;
  date: string;
}

const TripList: React.FC = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    setTrips([
      {
        id: 1,
        title: 'Magical Santorini Escape',
        image:
          'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=250&fit=crop',
        date: 'March 15-20, 2025',
      },
      {
        id: 2,
        title: 'Tokyo Cultural Adventure',
        image:
          'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop',
        date: 'April 5-12, 2025',
      },
      {
        id: 3,
        title: 'Swiss Alps Adventure',
        image:
          'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=250&fit=crop',
        date: 'February 18-26, 2025',
      },
      {
        id: 4,
        title: 'Bali Tropical Paradise',
        image:
          'https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=250&fit=crop',
        date: 'May 10-16, 2025',
      },
    ]);
  }, []);

  return (
    <GlassmorphicCard>
      <div className='trip-list-wrapper'>
        <Box
          sx={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 80,
            height: 80,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            mb: 3,
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
          }}>
          <FlightTakeoff sx={{ fontSize: 40, color: 'white' }} />
        </Box>

        <Typography
          variant='h3'
          sx={{
            fontWeight: 800,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 2,
            fontSize: { xs: '2rem', md: '3rem' },
          }}>
          Your Trips
        </Typography>

        <div className='trip-grid'>
          {trips.map((trip) => (
            <div
              key={trip.id}
              className='trip-card'>
              <div className='trip-image-container'>
                <img
                  src={trip.image}
                  alt={trip.title}
                  className='trip-image'
                />
                <div className='trip-image-overlay' />

                <div className='trip-date-badge'>
                  <span className='trip-date-text'>📅 {trip.date}</span>
                </div>
              </div>

              <div className='trip-content'>
                <h3 className='trip-title'>{trip.title}</h3>

                <div className='trip-footer'>
                  <div className='trip-status'>
                    <div className='status-dot' />
                    <span className='status-text'>Upcoming</span>
                  </div>

                  <button
                    className='trip-button'
                    onClick={() => {
                      navigate(`/${ROUTE_PATH.TRIP_INFO}`);
                    }}
                    style={{
                      zIndex: 10,
                    }}>
                    Manage Trip
                  </button>
                </div>
              </div>

              <div className='trip-gradient-overlay' />

              <div className='trip-animated-border'>
                <div className='trip-border-gradient' />
              </div>
            </div>
          ))}
        </div>

        <div className='add-trip-container'>
          <button
            className='add-trip-button'
            onClick={() => {
              navigate(`/${ROUTE_PATH.CREATE_TRIP}`);
            }}>
            <div className='add-trip-icon'>
              <span className='plus-icon'>+</span>
            </div>
            <span>Plan New Adventure</span>
          </button>
        </div>
      </div>
    </GlassmorphicCard>
  );
};

export default TripList;
