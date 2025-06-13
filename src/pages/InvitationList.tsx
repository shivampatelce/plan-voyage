import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { API_PATH } from '@/consts/ApiPath';
import { ROUTE_PATH } from '@/consts/RoutePath';
import keycloak from '@/keycloak-config';
import type { Invitations } from '@/types/Invitations';
import { apiRequest } from '@/util/apiRequest';
import formatDateRange from '@/util/formateDate';
import { MapPin, Calendar } from 'lucide-react';
import React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router';

const InvitationList: React.FC = () => {
  const [invitations, setInvitations] = useState<Invitations[]>([]);
  const navigate = useNavigate();

  const fetchInvitations = async () => {
    const email = keycloak.tokenParsed?.email;

    const { data } = (await apiRequest<unknown, { data: Invitations[] }>(
      `${API_PATH.INVITATION_LIST}`,
      {
        method: 'POST',
        body: {
          email,
        },
      }
    )) as { data: Invitations[] };

    setInvitations(data);
  };

  useEffect(() => {
    fetchInvitations();
  }, []);

  return (
    <div className='max-w-5xl mx-auto space-y-8'>
      <div className='text-center space-y-2'>
        <h2 className='text-3xl font-bold text-gray-900'>Pending Invites</h2>
      </div>
      {invitations.map(({ invitationId, trip }) => (
        <Card
          key={invitationId}
          className='overflow-hidden max-w-4xl mx-auto hover:shadow-lg transition-shadow cursor-pointer'>
          <img
            src={trip.destinationImageUrl}
            alt={trip.destination}
            className='w-full h-48 object-cover'
          />

          <CardContent className='py-1'>
            <h3 className='font-semibold text-lg text-gray-900 mb-2'>
              Trip To {trip.destination}
            </h3>
            <div className='flex items-center text-gray-600 mb-2'>
              <MapPin className='w-4 h-4 mr-1' />
              <span className='text-sm'>{trip.destination}</span>
            </div>
            <div className='flex items-center text-gray-600'>
              <Calendar className='w-4 h-4 mr-1' />
              <span className='text-sm'>
                {formatDateRange(trip.startDate, trip.endDate)}
              </span>
            </div>
            <Button
              className='mt-4 mr-4'
              onClick={() => {
                navigate(`/${ROUTE_PATH.TRIP_INVITATION}/${invitationId}`);
              }}>
              More Details
            </Button>
            <Button className='mt-4 mr-4'>Join</Button>
            <Button className='mt-4 bg-red-600 hover:bg-red-500'>Reject</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default InvitationList;
