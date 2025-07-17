import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { API_PATH } from '@/consts/ApiPath';
import { ROUTE_PATH } from '@/consts/RoutePath';
import keycloak from '@/keycloak-config';
import type { JoinTrip } from '@/types/JoinTrip';
import type { Trip } from '@/types/Trip';
import { apiRequest, type ErrorResponse } from '@/util/apiRequest';
import formatDateRange from '@/util/formateDate';
import { AlertTriangle, Calendar } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router';

const TripInvitation: React.FC = () => {
  const { invitationId } = useParams<{ invitationId: string }>();
  const [trip, setTrip] = useState<Trip>();
  const [invalidInvitation, setInvalidInvitation] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const fetchInvitation = async (invitationId: string) => {
    const email = keycloak.tokenParsed?.email;
    try {
      const { data } = (await apiRequest<
        { email: string; invitationId: string },
        { data: Trip }
      >(API_PATH.INVITATION, {
        method: 'POST',
        body: {
          email,
          invitationId,
        },
      })) as { data: Trip };

      setTrip(data);
    } catch (error) {
      console.error(`Error while fetching invitation:`, error);
      const errorResponse = error as ErrorResponse;
      setInvalidInvitation(true);
      setErrorMessage(errorResponse.message);
    }
  };

  useEffect(() => {
    if (invitationId) {
      fetchInvitation(invitationId);
    }
  }, [invitationId]);

  const handleTripJoin = async () => {
    if (!invitationId || !trip) return;
    try {
      await apiRequest<JoinTrip, void>(API_PATH.JOIN_TRIP, {
        method: 'POST',
        body: {
          tripId: trip.tripId,
          invitationId,
          userId: keycloak.subject || '',
        },
      });

      navigate(`/${ROUTE_PATH.OVERVIEW}/${trip.tripId}`);
    } catch (error) {
      console.error(`Error join trip req:`, error);
    }
  };

  if (invalidInvitation) {
    return (
      <div className="h-80 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Alert
            variant="destructive"
            className="border-dashed">
            <div className="w-100 flex justify-center">
              <AlertTriangle className="h-[40px] w-[40px]" />
            </div>
            <br />
            <AlertDescription className="text-4xl text-center font-medium">
              {errorMessage}
            </AlertDescription>
          </Alert>
        </div>
      </div>
    );
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

      <div className="flex items-center justify-center text-gray-600 mt-20">
        <Calendar className="w-4 h-4 mr-1" />
        <span className="text-xl">
          {!!trip?.startDate &&
            !!trip.endDate &&
            formatDateRange(trip.startDate, trip.endDate)}
        </span>
      </div>

      {/* TODO: Make this name dynamic */}
      <div className="mt-10 flex items-center justify-center">
        <p className="text-xl text-gray-600">
          You’ve been invited by {'Shivam Patel'} to help plan a trip to{' '}
          {trip?.destination}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-center">
        <Button
          className="mt-4 mr-4"
          onClick={handleTripJoin}>
          Join
        </Button>
        <Button className="mt-4 bg-red-600 hover:bg-red-500">Reject</Button>
      </div>
    </>
  );
};

export default TripInvitation;
