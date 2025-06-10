import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Calendar, MapPin, MoreVertical, Settings, Trash2 } from 'lucide-react';
import type { Trip } from '@/types/Trip';
import { useNavigate } from 'react-router';
import { ROUTE_PATH } from '@/consts/RoutePath';
import { apiRequest } from '@/util/apiRequest';
import { API_PATH } from '@/consts/ApiPath';
import { useState } from 'react';
import RemoveTripConfirmationDialog from './RemoveTripConfirmationDialog';

const TripCard = ({
  trip,
  isPreviousTrip,
  tripDeleted,
}: {
  trip: Trip;
  isPreviousTrip?: boolean;
  tripDeleted: () => void;
}) => {
  const [isRemoveConfirmationDialogOpen, setIsRemoveConfirmationDialogOpen] =
    useState(false);
  const navigate = useNavigate();
  const formatDateRange = (start: Date | string, end: Date | string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);

    const startFormatted = startDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
    const endFormatted = endDate.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });

    return `${startFormatted} - ${endFormatted}`;
  };

  const removeTrip = async () => {
    try {
      await apiRequest<unknown, unknown>(
        API_PATH.DELETE_TRIP + '/' + trip.tripId,
        {
          method: 'DELETE',
        }
      );
      tripDeleted();
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  };

  return (
    <>
      <RemoveTripConfirmationDialog
        title={trip.destination}
        showDeleteDialog={isRemoveConfirmationDialogOpen}
        setShowDeleteDialog={() => {
          setIsRemoveConfirmationDialogOpen(!isRemoveConfirmationDialogOpen);
        }}
        deleteTrip={removeTrip}
      />
      <Card className='overflow-hidden hover:shadow-lg transition-shadow cursor-pointer'>
        <div className='relative'>
          <img
            src={trip.destinationImageUrl}
            alt={trip.destination}
            className='w-full h-48 object-cover'
          />
          <div className='absolute top-3 left-3'>
            <Badge
              variant={trip.status === 'upcoming' ? 'default' : 'secondary'}>
              {trip.status === 'upcoming' ? 'Upcoming' : 'Completed'}
            </Badge>
          </div>

          <div className='absolute top-3 right-3'>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='secondary'
                  size='sm'
                  className='h-8 w-8 p-0 bg-white/80 hover:bg-white/90 backdrop-blur-sm'
                  onClick={(e) => e.stopPropagation()}>
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='start'>
                <DropdownMenuItem
                  className='cursor-pointer'
                  onClick={() => {
                    navigate(`/${ROUTE_PATH.OVERVIEW}`);
                  }}>
                  <Settings className='mr-2 h-4 w-4' />
                  Plan Your Trip
                </DropdownMenuItem>

                <DropdownMenuItem
                  className='cursor-pointer text-red-600 focus:text-red-600'
                  onClick={() => setIsRemoveConfirmationDialogOpen(true)}>
                  <Trash2 className='mr-2 h-4 w-4' />
                  Delete Trip
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
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
            onClick={() => {
              navigate(`/${ROUTE_PATH.OVERVIEW}`);
            }}
            className='mt-4'>
            {!isPreviousTrip ? 'Plan Your Trip' : 'Check Your Trip'}
          </Button>
        </CardContent>
      </Card>
    </>
  );
};

export default TripCard;
