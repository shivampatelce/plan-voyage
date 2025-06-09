import { MapPin, Plus } from 'lucide-react';
import type React from 'react';
import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router';
import { ROUTE_PATH } from '@/consts/RoutePath';

const EmptyTripScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleCreateTrip = () => {
    navigate(`/${ROUTE_PATH.CREATE_TRIP}`);
  };

  return (
    <Card className='border-dashed border-2 border-gray-300'>
      <CardContent className='flex flex-col items-center justify-center py-16 px-6 text-center'>
        <div className='w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4'>
          <MapPin className='w-8 h-8 text-gray-400' />
        </div>

        <h2 className='text-xl font-semibold text-gray-900 mb-2'>
          No adventures yet
        </h2>

        <p className='text-gray-600 mb-6 max-w-md'>
          Start planning your next journey! Create your first trip and begin
          exploring amazing destinations.
        </p>

        <Button
          onClick={handleCreateTrip}
          className='flex items-center gap-2'>
          <Plus className='w-4 h-4' />
          Create Your First Trip
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyTripScreen;
