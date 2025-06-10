import React, { useState, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { useNavigate } from 'react-router';
import { ROUTE_PATH } from '@/consts/RoutePath';
import { apiRequest } from '@/util/apiRequest';
import { API_PATH } from '@/consts/ApiPath';
import type { CreateTripRequest } from '@/types/Trip';

const CreateTrip: React.FC = () => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const navigate = useNavigate();

  const [errors, setErrors] = useState<{
    destination?: string;
    startDate?: string;
    endDate?: string;
  }>({});

  const formatDate = (date: Date | null): string => {
    if (!date) return '';
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    if (!destination.trim())
      newErrors.destination = 'Please enter destination.';
    if (!startDate) newErrors.startDate = 'Please enter start date.';
    if (!endDate) newErrors.endDate = 'Please enter end date.';
    else if (startDate && endDate < startDate)
      newErrors.endDate = 'End date cannot be before start date.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const createNewTrip = async () => {
    try {
      const createTripReq: CreateTripRequest = {
        destination,
        startDate,
        endDate,
        // TODO: remove mock user id and pass proper user id
        userId: 'ea05325b-b9da-4113-8a63-0e875103a48c',
      };
      await apiRequest<CreateTripRequest, unknown>(API_PATH.CREATE_TRIP, {
        method: 'POST',
        body: createTripReq,
      });

      resetForm();
      navigate(`/${ROUTE_PATH.OVERVIEW}`);
    } catch (error) {
      console.error('Error fetching trips:', error);
    }
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    createNewTrip();
  };

  const resetForm = () => {
    setDestination('');
    setStartDate(null);
    setEndDate(null);
    setErrors({});
  };

  return (
    <div className='min-h-screen p-4 flex items-center justify-center'>
      <Card className='w-full max-w-md'>
        <CardHeader>
          <CardTitle className='text-2xl font-bold text-center'>
            Create Trip
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={handleSubmit}
            className='space-y-6'>
            <div className='space-y-2'>
              <Label htmlFor='destination'>Where You Are Planning To Go?</Label>
              <Input
                id='destination'
                type='text'
                placeholder='Enter destination (Ex. India, Paris)'
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
              />
              {errors.destination && (
                <p className='text-sm text-red-600'>{errors.destination}</p>
              )}
            </div>

            <div className='space-y-4'>
              <Label>Travel Dates</Label>

              <div className='space-y-2'>
                <Label
                  htmlFor='start-date'
                  className='text-sm text-gray-600'>
                  From
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id='start-date'
                      variant='outline'
                      className='w-full justify-start text-left font-normal'>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {startDate ? formatDate(startDate) : 'Select start date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0'
                    align='start'>
                    <Calendar
                      mode='single'
                      selected={startDate}
                      onSelect={setStartDate}
                      disabled={(date) => date < new Date()}
                    />
                  </PopoverContent>
                </Popover>
                {errors.startDate && (
                  <p className='text-sm text-red-600'>{errors.startDate}</p>
                )}
              </div>

              <div className='space-y-2'>
                <Label
                  htmlFor='end-date'
                  className='text-sm text-gray-600'>
                  To
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      id='end-date'
                      variant='outline'
                      className='w-full justify-start text-left font-normal'>
                      <CalendarIcon className='mr-2 h-4 w-4' />
                      {endDate ? formatDate(endDate) : 'Select end date'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent
                    className='w-auto p-0'
                    align='start'>
                    <Calendar
                      mode='single'
                      selected={endDate}
                      onSelect={setEndDate}
                      disabled={(date) =>
                        date < new Date() || (startDate && date < startDate)
                      }
                    />
                  </PopoverContent>
                </Popover>
                {errors.endDate && (
                  <p className='text-sm text-red-600'>{errors.endDate}</p>
                )}
              </div>
            </div>

            <Button
              type='submit'
              className='w-full'>
              Create Trip
            </Button>
          </form>
          <Button
            onClick={() => {
              navigate(`/${ROUTE_PATH.TRIPS}`);
            }}
            className='w-full mt-2'>
            Your Trips
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateTrip;
