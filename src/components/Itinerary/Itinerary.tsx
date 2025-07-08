import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Calendar,
  MapPin,
  Plus,
  X,
  Clock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { useParams } from 'react-router';
import { API_PATH } from '@/consts/ApiPath';
import { apiRequest } from '@/util/apiRequest';
import type { Trip } from '@/types/Trip';
import type { AddItinerary, Itinerary } from '@/types/Itinerary';
import CustomSkeleton from '../ui/custom/CustomSkeleton';
import { toast } from 'sonner';

const PLACE_CATEGORIES = [
  'Restaurant',
  'Museum',
  'Park',
  'Shopping',
  'Attraction',
  'Hotel',
  'Transport',
  'Other',
];

const Itinerary: React.FC = () => {
  const [itinerary, setItinerary] = useState<Itinerary[]>([]);
  const [trip, setTrip] = useState<Trip>();
  const [selectedPlace, setSelectedPlace] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedTime, setSelectedTime] = useState<string>('');

  const [isLoading, setIsLoading] = useState(false);
  const { tripId } = useParams<{ tripId: string }>();
  const [expandedDays, setExpandedDays] = useState(new Set([0]));

  const generateDateRange = (
    startDate: Date | string,
    endDate: Date | string
  ) => {
    const dates = [];
    const start = new Date(startDate);
    const end = new Date(endDate);

    const currentDate = new Date(start);
    while (currentDate <= end) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  };

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

        setTrip(data);
        fetchItinerary(data);
      } catch (error) {
        console.error('Error while fetching trip overview:', error);
        setIsLoading(false);
      }
    };
    fetchTripOverview();
  }, [tripId]);

  const fetchItinerary = async (trip: Trip) => {
    try {
      const { data } = (await apiRequest<unknown, { data: Itinerary }>(
        API_PATH.GET_ITINERARY + `/${tripId}`,
        {
          method: 'GET',
        }
      )) as { data: Itinerary[] };

      initializeItinerary(data, trip);
      setIsLoading(false);
    } catch (error) {
      console.error('Error while fetching itinerary:', error);
      setIsLoading(false);
    }
  };

  const initializeItinerary = (itinerary: Itinerary[], trip: Trip) => {
    const allDates = generateDateRange(trip.startDate, trip.endDate);

    const fullItinerary = allDates.map((date) => {
      const existingDay = itinerary.find(
        (day) => formatDate(day.date) === formatDate(date)
      );
      return (
        existingDay || {
          date,
          itineraryPlaces: [],
        }
      );
    });

    setItinerary(fullItinerary);
  };

  const addPlace = async (date: string | Date, itineraryId?: string) => {
    if (!selectedPlace || !selectedCategory) return;

    const addItinerary: AddItinerary = {
      date,
      place: selectedPlace,
      category: selectedCategory,
      time: selectedTime || undefined,
      tripId: tripId!,
    };

    addItinerary.itineraryId = itineraryId;

    try {
      (await apiRequest<AddItinerary, { data: Itinerary }>(
        API_PATH.ADD_ITINERARY,
        {
          method: 'POST',
          body: addItinerary,
        }
      )) as { data: Itinerary };

      if (trip) fetchItinerary(trip);

      // Reset form
      setSelectedPlace('');
      setSelectedCategory('');
      setSelectedTime('');
    } catch (error) {
      console.error('Error while adding itinerary:', error);
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Restaurant: 'bg-orange-100 text-orange-800',
      Museum: 'bg-purple-100 text-purple-800',
      Park: 'bg-green-100 text-green-800',
      Shopping: 'bg-pink-100 text-pink-800',
      Attraction: 'bg-blue-100 text-blue-800',
      Hotel: 'bg-indigo-100 text-indigo-800',
      Transport: 'bg-gray-100 text-gray-800',
      Other: 'bg-yellow-100 text-yellow-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const toggleDay = (dayIndex: number) => {
    const newExpandedDays = new Set(expandedDays);
    if (newExpandedDays.has(dayIndex)) {
      newExpandedDays.delete(dayIndex);
    } else {
      newExpandedDays.add(dayIndex);
    }
    setExpandedDays(newExpandedDays);
  };

  const getTripDuration = (): number | null => {
    if (trip && trip.startDate && trip.endDate) {
      const start = new Date(trip.startDate);
      const end = new Date(trip.endDate);

      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        return null;
      }

      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
      return diffDays;
    }
    return null;
  };

  const handleRemovePlace = async (placeId?: string) => {
    try {
      await apiRequest<void, void>(API_PATH.REMOVE_PLACE + `/${placeId}`, {
        method: 'DELETE',
      });

      if (trip) fetchItinerary(trip);
      toast.success('Place has been removed.');
    } catch (error) {
      console.error('Error while deleting place: ', error);
    }
  };

  const getPlaceNumber = (dayIndex: number, placeIndex: number): number => {
    let totalPlaces = 0;
    for (let i = 0; i < dayIndex; i++) {
      totalPlaces += itinerary[i]?.itineraryPlaces?.length || 0;
    }
    return totalPlaces + placeIndex + 1;
  };

  if (isLoading) {
    return <CustomSkeleton />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              <MapPin className="h-10 w-10" />
              Trip To {trip?.destination}
            </h1>
            <div className="text-right">
              <p className="text-sm text-gray-500">Trip Duration</p>
              <p className="text-2xl font-semibold text-gray-900">
                {getTripDuration()} Days
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-gray-600 mb-6">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>
                {formatDate(trip?.startDate || new Date())} -{' '}
                {formatDate(trip?.endDate || new Date())}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            {itinerary.map((day, dayIndex) => (
              <Card
                key={dayIndex}
                className="shadow-lg">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <button
                      onClick={() => toggleDay(dayIndex)}
                      className="flex items-center gap-3 text-left">
                      {expandedDays.has(dayIndex) ? (
                        <ChevronDown className="h-5 w-5" />
                      ) : (
                        <ChevronRight className="h-5 w-5" />
                      )}
                      <CardTitle className="text-xl font-semibold text-gray-800">
                        Day {dayIndex + 1} - {formatDate(day.date)}
                      </CardTitle>
                      <Badge
                        variant="outline"
                        className="ml-2">
                        {day?.itineraryPlaces?.length || 0} places
                      </Badge>
                    </button>
                  </div>
                </CardHeader>
                {expandedDays.has(dayIndex) && (
                  <CardContent className="space-y-4">
                    {/* Places list */}
                    {!day?.itineraryPlaces?.length ? (
                      <div className="text-center py-8 text-gray-500">
                        No places added yet. Add your first destination below!
                      </div>
                    ) : (
                      <div>
                        {day?.itineraryPlaces?.map((place, placeIndex) => (
                          <div
                            key={place.id}
                            className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow mb-3">
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-full text-sm font-bold">
                                {getPlaceNumber(dayIndex, placeIndex)}
                              </div>
                              <MapPin className="h-4 w-4 text-gray-500" />
                              <div>
                                <span className="font-medium text-gray-900">
                                  {place.place}
                                </span>
                                {place.time && (
                                  <div className="flex items-center gap-1 text-sm text-gray-500">
                                    <Clock className="h-3 w-3" />
                                    {place.time}
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge
                                className={getCategoryColor(place.category)}>
                                {place.category}
                              </Badge>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemovePlace(place.id)}
                                className="text-red-500 hover:text-red-700">
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Add place form */}
                    <div className="border-t pt-4 mt-4">
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                        <div>
                          <Label
                            htmlFor={`place-${dayIndex}`}
                            className="text-sm font-medium">
                            Place
                          </Label>
                          <Input
                            id={`place-${dayIndex}`}
                            type="text"
                            placeholder="Enter place name"
                            value={selectedPlace}
                            onChange={(e) => setSelectedPlace(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div>
                          <Label className="text-sm font-medium">
                            Category
                          </Label>
                          <Select
                            value={selectedCategory}
                            onValueChange={setSelectedCategory}>
                            <SelectTrigger>
                              <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                              {PLACE_CATEGORIES.map((category) => (
                                <SelectItem
                                  key={category}
                                  value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label
                            htmlFor={`time-${dayIndex}`}
                            className="text-sm font-medium">
                            Time (Optional)
                          </Label>
                          <Input
                            id={`time-${dayIndex}`}
                            type="time"
                            value={selectedTime}
                            onChange={(e) => setSelectedTime(e.target.value)}
                            className="w-full"
                          />
                        </div>

                        <div className="flex items-end">
                          <Button
                            onClick={() => addPlace(day.date, day.itineraryId)}
                            disabled={!selectedPlace || !selectedCategory}
                            className="w-full">
                            <Plus className="h-4 w-4 mr-2" />
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>

          <div className="lg:col-span-1">
            <Card className="sticky top-6 h-[600px] shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
                  <MapPin className="h-5 w-5" />
                  Map View
                </CardTitle>
              </CardHeader>
              <CardContent className="h-full">
                <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
                  <div className="text-center">
                    <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500 font-medium">Map</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Itinerary;
