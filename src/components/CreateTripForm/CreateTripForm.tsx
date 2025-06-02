import { useState } from 'react';
import {
  InputAdornment,
  InputLabel,
  FilledInput,
  Button,
  Box,
  Typography,
} from '@mui/material';
import { LocationOn, DateRange, FlightTakeoff } from '@mui/icons-material';
import GlassmorphicCard from '../ui/GlassmorphicCard/GlassmorphicCard';
import FilledFormControl from '../ui/FilledFormControl/FilledFormControl';
import './CreateTripForm.css';

const CreateTripForm = () => {
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');

  return (
    <GlassmorphicCard
      size='medium'
      sx={{ maxWidth: '800px', margin: '0 auto' }}>
      <Box sx={{ textAlign: 'center', mb: 6 }}>
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
          Plan Your Adventure
        </Typography>
        <Typography
          variant='h6'
          sx={{
            color: 'rgba(255, 255, 255, 0.8)',
            fontWeight: 400,
            maxWidth: '500px',
            margin: '0 auto',
          }}>
          Tell us where you want to go and we'll help you create the perfect
          itinerary
        </Typography>
      </Box>

      <FilledFormControl>
        <InputLabel
          htmlFor='location'
          sx={{ fontSize: 20 }}>
          Where do you want to go?
        </InputLabel>
        <FilledInput
          id='location'
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          sx={{ p: 1 }}
          startAdornment={
            <InputAdornment position='start'>
              <LocationOn sx={{ color: '#667eea', fontSize: 24 }} />
            </InputAdornment>
          }
          placeholder='Enter your dream destination...'
        />
      </FilledFormControl>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <FilledFormControl>
          <InputLabel
            htmlFor='dates'
            sx={{ fontSize: 20 }}>
            When?
          </InputLabel>
          <FilledInput
            id='dates'
            value={dates}
            sx={{ p: 1 }}
            onChange={(e) => setDates(e.target.value)}
            startAdornment={
              <InputAdornment position='start'>
                <DateRange sx={{ color: '#667eea', fontSize: 20 }} />
              </InputAdornment>
            }
            placeholder='Select dates'
          />
        </FilledFormControl>
      </Box>

      <Box sx={{ mt: 6, textAlign: 'center' }}>
        <Button
          variant='contained'
          size='large'
          sx={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '50px',
            padding: '8px 40px',
            fontSize: '1.1rem',
            fontWeight: 700,
            textTransform: 'none',
            boxShadow: '0 10px 30px rgba(102, 126, 234, 0.4)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-3px)',
              boxShadow: '0 15px 40px rgba(102, 126, 234, 0.5)',
              background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
            },
          }}>
          Create My Trip
        </Button>
      </Box>
    </GlassmorphicCard>
  );
};

export default CreateTripForm;
