import React, { useEffect, useState, type FormEvent } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { apiRequest } from '@/util/apiRequest';
import type { Trip } from '@/types/Trip';
import { API_PATH } from '@/consts/ApiPath';
import { useNavigate, useParams } from 'react-router';
import CustomSkeleton from '../ui/custom/CustomSkeleton';
import { Label } from '../ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Button } from '../ui/button';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import RemoveTripConfirmationDialog from '../TripList/RemoveTripConfirmationDialog';
import { ROUTE_PATH } from '@/consts/RoutePath';
import { toast } from 'sonner';

const TripSettings: React.FC = () => {
  const [trip, setTrip] = useState<Trip>();
  const [isLoading, setIsLoading] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const { tripId } = useParams<{ tripId: string }>();
  const [errors, setErrors] = useState<{
    startDate?: string;
    endDate?: string;
  }>({});
  const [isRemoveConfirmationDialogOpen, setIsRemoveConfirmationDialogOpen] =
    useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (tripId) fetchTripOverview(tripId);
  }, [tripId]);

  const fetchTripOverview = async (tripId: string) => {
    setIsLoading(true);
    try {
      const { data } = (await apiRequest<{ userId: string }, { data: Trip }>(
        API_PATH.TRIP_OVERVIEW + `/${tripId}`,
        {
          method: 'GET',
        }
      )) as { data: Trip };

      setTrip(data);

      const { startDate, endDate } = data;
      setStartDate(new Date(startDate));
      setEndDate(new Date(endDate));
      setIsLoading(false);
    } catch (error) {
      console.error('Error while fetching trip overview:', error);
      setIsLoading(false);
    }
  };

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
    if (!startDate) newErrors.startDate = 'Please enter start date.';
    if (!endDate) newErrors.endDate = 'Please enter end date.';
    else if (startDate && endDate < startDate)
      newErrors.endDate = 'End date cannot be before start date.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;
  };

  const removeTrip = async () => {
    try {
      await apiRequest<unknown, unknown>(
        API_PATH.DELETE_TRIP + '/' + trip?.tripId,
        {
          method: 'DELETE',
        }
      );
      toast.success('Trip has been deleted successfully.');
      navigate(`/${ROUTE_PATH.TRIPS}`);
    } catch (error) {
      toast.success('Error while deleting trip, please try again.');
      console.error('Error deleting trip:', error);
    }
  };

  const updateDates = async () => {
    try {
      await apiRequest<
        { tripId: string; startDate: Date; endDate: Date },
        Trip
      >(API_PATH.UPDATE_TRIP_DATES, {
        method: 'PUT',
        body: {
          tripId: tripId!,
          startDate: startDate!,
          endDate: endDate!,
        },
      });
      toast.success('Trip dates has been updated successfully.');
      fetchTripOverview(tripId!);
    } catch (error) {
      toast.success('Error while updating trip dates, please try again.');
      console.error('Error deleting trip:', error);
    }
  };

  if (isLoading) {
    return <CustomSkeleton />;
  }

  return (
    <>
      <RemoveTripConfirmationDialog
        title={trip?.destination || ''}
        showDeleteDialog={isRemoveConfirmationDialogOpen}
        setShowDeleteDialog={() => {
          setIsRemoveConfirmationDialogOpen(!isRemoveConfirmationDialogOpen);
        }}
        deleteTrip={removeTrip}
      />
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

      <div className="mt-30 p-4 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-center">
              Change Dates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              className="space-y-6"
              onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="start-date"
                    className="text-sm text-gray-600">
                    From
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="start-date"
                        variant="outline"
                        className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {startDate
                          ? formatDate(startDate)
                          : 'Select start date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start">
                      <Calendar
                        mode="single"
                        selected={startDate}
                        onSelect={setStartDate}
                        disabled={(date) =>
                          date < new Date() || (endDate && date > endDate)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.startDate && (
                    <p className="text-sm text-red-600">{errors.startDate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="end-date"
                    className="text-sm text-gray-600">
                    To
                  </Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        id="end-date"
                        variant="outline"
                        className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {endDate ? formatDate(endDate) : 'Select end date'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto p-0"
                      align="start">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={setEndDate}
                        disabled={(date) =>
                          date < new Date() || (startDate && date < startDate)
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.endDate && (
                    <p className="text-sm text-red-600">{errors.endDate}</p>
                  )}
                </div>
              </div>

              <Button
                type="submit"
                className="w-full"
                onClick={updateDates}>
                Update Dates
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      <div className="mt-10 p-4 flex items-center justify-center">
        <div className="w-full">
          <div className="text-center py-12 text-red-500 rounded-xl shadow-sm border-dashed border-2 border-red-400 mt-8 max-w-2xl mx-auto">
            <p className="mx-4 mb-8">
              {trip?.tripUsers.length === 1
                ? 'This action cannot be undone and will permanently remove all trip data including itinerary, chat, and notes.'
                : 'Deletion is not allowed because there are users associated with this trip. If you still want to delete it, please remove all users from the trip first.'}
            </p>
            <Button
              variant="destructive"
              disabled={trip?.tripUsers.length !== 1}
              onClick={() => setIsRemoveConfirmationDialogOpen(true)}>
              Delete Trip
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default TripSettings;
