import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { apiRequest } from '@/util/apiRequest';
import type { RelatedTrip, Trip } from '@/types/Trip';
import { API_PATH } from '@/consts/ApiPath';
import { useParams } from 'react-router';
import CustomSkeleton from '../ui/custom/CustomSkeleton';
import UsersList from '../UsersList/UsersList';
import { appBadgeBackgroundColors } from '@/util/appColors';
import RelatedItinerary from '../RelatedItinerary/RelatedItinerary';

const PlanOverview: React.FC = () => {
  const [trip, setTrip] = useState<Trip>();
  const [isLoading, setIsLoading] = useState(false);
  const [relatedTrip, setRelatedTrip] = useState<RelatedTrip[]>([]);
  const [isLoadingRelatedTrip, setIsLoadingRelatedTrip] = useState(false);
  const [destination, setDestination] = useState<string>('');

  const { tripId } = useParams<{ tripId: string }>();

  useEffect(() => {
    const fetchTripOverview = async () => {
      setIsLoading(true);
      try {
        const { data } = (await apiRequest<{ userId: string }, { data: Trip }>(
          API_PATH.TRIP_OVERVIEW + `/${tripId}`,
          {
            method: 'GET',
          }
        )) as { data: Trip };

        data.tripUsers = data.tripUsers.map((user, index) => ({
          ...user,
          color: `bg-${
            appBadgeBackgroundColors[index % appBadgeBackgroundColors.length]
          }-500`,
        }));

        setTrip(data);
        setDestination(data.destination);
        setIsLoading(false);
      } catch (error) {
        console.error('Error while fetching trip overview:', error);
        setIsLoading(false);
      }
    };
    fetchTripOverview();
  }, [tripId]);

  useEffect(() => {
    if (!destination) return;
    const fetchRelatedTrip = async () => {
      setIsLoadingRelatedTrip(true);
      try {
        const { data } = (await apiRequest<void, { data: RelatedTrip[] }>(
          API_PATH.RELATED_TRIPS + `/${destination}/${tripId}`,
          {
            method: 'POST',
          }
        )) as { data: RelatedTrip[] };
        setRelatedTrip(data);
      } catch (error) {
        console.error('Error while fetching related trips:', error);
      } finally {
        setIsLoadingRelatedTrip(false);
      }
    };
    fetchRelatedTrip();
  }, [destination, tripId]);

  if (isLoading) {
    return <CustomSkeleton />;
  }

  return (
    <>
      <div className="relative w-full">
        <div className="relative w-full h-96 overflow-hidden rounded-lg">
          <img
            src={trip?.destinationImageUrl}
            alt={trip?.destination}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>

        <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-full max-w-md px-4">
          <Card className="bg-white/95 backdrop-blur-sm shadow-2xl border-0">
            <CardContent className="p-8 text-center">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                Plan To {trip?.destination}
              </h1>
              <p className="text-gray-600 text-lg">
                Discover the incredible journey that awaits you
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="h-20" />
      </div>

      <div className="mt-30 px-4">
        <RelatedItinerary
          relatedTrip={relatedTrip}
          isLoadingRelatedTrip={isLoadingRelatedTrip}
          tripId={tripId}
        />
      </div>

      <div className="p-4 flex items-center justify-center overflow-auto">
        <UsersList users={trip?.tripUsers || []} />
      </div>
    </>
  );
};

export default PlanOverview;
