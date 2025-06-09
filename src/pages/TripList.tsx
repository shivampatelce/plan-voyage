import React from 'react';

import type { Trip } from '@/types/Trip';
import TripCard from '@/components/TripList/TripCard';

const TripList: React.FC = () => {
  // Mock data for trips
  const currentTrips: Trip[] = [
    {
      id: 1,
      title: 'Summer in Santorini',
      destination: 'Santorini, Greece',
      startDate: '2025-07-15',
      endDate: '2025-07-22',
      image:
        'https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=250&fit=crop',
      status: 'upcoming',
    },
    {
      id: 2,
      title: 'Tokyo Adventure',
      destination: 'Tokyo, Japan',
      startDate: '2025-09-10',
      endDate: '2025-09-18',
      image:
        'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=250&fit=crop',
      status: 'upcoming',
    },
  ];

  const previousTrips: Trip[] = [
    {
      id: 3,
      title: 'NYC Weekend',
      destination: 'New York, USA',
      startDate: '2025-01-20',
      endDate: '2025-01-23',
      image:
        'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=400&h=250&fit=crop',
      status: 'completed',
    },
  ];

  return (
    <div className='max-w-6xl mx-auto'>
      {currentTrips.length > 0 && (
        <div className='mb-12'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
            Current Trips
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {currentTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
              />
            ))}
          </div>
        </div>
      )}

      {previousTrips.length > 0 && (
        <div>
          <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
            Previous Trips
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {previousTrips.map((trip) => (
              <TripCard
                key={trip.id}
                trip={trip}
                isPreviousTrip={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripList;
