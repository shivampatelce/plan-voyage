import React, { useEffect, useState } from 'react';
import type { Trip } from '@/types/Trip';
import TripCard from '@/components/TripList/TripCard';
import { apiRequest } from '@/util/apiRequest';
import { API_PATH } from '@/consts/ApiPath';
import EmptyTripScreen from '@/components/TripList/EmptyTripScreen';
import SkeletonCard from '@/components/ui/custom/SkeletonCard';

const TripList: React.FC = () => {
  const [currentTrips, setCurrentTrips] = useState<Trip[]>([]);
  const [previousTrips, setPreviousTrips] = useState<Trip[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchTrips();
  }, []);

  const fetchTrips = async () => {
    setIsLoading(true);
    try {
      const { data } = (await apiRequest<{ userId: string }, { data: Trip[] }>(
        API_PATH.TRIPS_LIST,
        {
          method: 'POST',
          body: {
            // TODO: remove mock user id and pass proper user id
            userId: 'ea05325b-b9da-4113-8a63-0e875103a48c',
          },
        }
      )) as { data: Trip[] };

      const now = new Date();
      const current: Trip[] = [];
      const previous: Trip[] = [];

      data.forEach((trip) => {
        const endDate = new Date(trip.endDate);
        if (endDate >= now) {
          current.push({ ...trip, status: 'upcoming' });
        } else {
          previous.push({ ...trip, status: 'completed' });
        }
      });

      setCurrentTrips(current);
      setPreviousTrips(previous);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching trips:', error);
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <>
        <div className='flex justify-between space-y-6'>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className='flex justify-between space-y-6'>
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      </>
    );
  }

  if (!currentTrips.length && !previousTrips.length) {
    return <EmptyTripScreen />;
  }

  return (
    <div className='max-w-6xl mx-auto'>
      {currentTrips.length > 0 && (
        <div className='mb-12'>
          <h2 className='text-2xl font-semibold text-gray-900 mb-6'>
            Upcoming Trips
          </h2>
          <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
            {currentTrips.map((trip) => (
              <TripCard
                key={trip.tripId}
                trip={trip}
                tripDeleted={() => {
                  fetchTrips();
                }}
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
                key={trip.tripId}
                trip={trip}
                isPreviousTrip={true}
                tripDeleted={() => {
                  fetchTrips();
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TripList;
