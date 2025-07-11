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
  FileText,
  Edit3,
} from 'lucide-react';
import { useLocation, useParams } from 'react-router';
import { API_PATH } from '@/consts/ApiPath';
import { apiRequest } from '@/util/apiRequest';
import type { Trip } from '@/types/Trip';
import type { AddItinerary, Coordinates, Itinerary } from '@/types/Itinerary';
import CustomSkeleton from '../ui/custom/CustomSkeleton';
import { toast } from 'sonner';
import 'leaflet/dist/leaflet.css';
import { ROUTE_PATH } from '@/consts/RoutePath';
import ShareItineraryLinkDialog from './ShareItineraryLinkDialog';
import { Textarea } from '../ui/textarea';
import MapView from './MapView';

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
  const [coordinates, setCoordinates] = useState<Coordinates[]>([]);
  const [isSharedItinerary, setIsSharedItinerary] = useState(false);
  const [isShareItineraryLinkDialogOpen, setIsShareItineraryLinkDialogOpen] =
    useState(false);

  const [editingNotes, setEditingNotes] = useState<string | null>(null);
  const [noteText, setNoteText] = useState<string>('');
  const location = useLocation();

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
    const isSharedItinerary = location.pathname.startsWith(
      `/${ROUTE_PATH.SHARED_ITINERARY}`
    );
    setIsSharedItinerary(isSharedItinerary);
    fetchTripOverview(isSharedItinerary);
  }, [location.pathname]);

  const fetchTripOverview = async (isSharedItinerary: boolean) => {
    setIsLoading(true);
    try {
      const url =
        (isSharedItinerary
          ? API_PATH.SHARED_TRIP_OVERVIEW
          : API_PATH.TRIP_OVERVIEW) + `/${tripId}`;
      const { data } = (await apiRequest<{ userId: string }, { data: Trip }>(
        url,
        {
          method: 'GET',
        }
      )) as { data: Trip };

      setTrip(data);
      fetchItinerary(data, isSharedItinerary);
    } catch (error) {
      console.error('Error while fetching trip overview:', error);
      setIsLoading(false);
    }
  };

  const fetchItinerary = async (trip: Trip, isSharedItinerary: boolean) => {
    try {
      const { data } = (await apiRequest<unknown, { data: Itinerary }>(
        (isSharedItinerary
          ? API_PATH.SHARED_ITINERARY
          : API_PATH.GET_ITINERARY) + `/${tripId}`,
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

    const coordinates: Coordinates[] = [];

    fullItinerary.forEach((itinerary, itineraryIndex) => {
      itinerary.itineraryPlaces?.forEach((place, placeIndex) => {
        if (
          place.coordinates &&
          place.coordinates.latitude &&
          place.coordinates.longitude
        )
          coordinates.push({
            ...place.coordinates,
            place: place.place,
            placeNumber: getPlaceNumber(
              itineraryIndex,
              placeIndex,
              fullItinerary
            ),
          });
      });
    });

    setCoordinates(coordinates);
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

      if (trip) fetchItinerary(trip, isSharedItinerary);

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

      if (trip) fetchItinerary(trip, isSharedItinerary);
      toast.success('Place has been removed.');
    } catch (error) {
      console.error('Error while deleting place: ', error);
    }
  };

  const getPlaceNumber = (
    dayIndex: number,
    placeIndex: number,
    itinerary: Itinerary[]
  ): number => {
    let totalPlaces = 0;
    for (let i = 0; i < dayIndex; i++) {
      totalPlaces += itinerary[i]?.itineraryPlaces?.length || 0;
    }
    return totalPlaces + placeIndex + 1;
  };

  const handleUpdateNotes = async (placeId: string, notes: string) => {
    try {
      await apiRequest<{ notes: string; itineraryPlaceId: string }, void>(
        API_PATH.UPDATE_PLACE_NOTES,
        {
          method: 'PUT',
          body: { notes, itineraryPlaceId: placeId },
        }
      );

      if (trip) fetchItinerary(trip, isSharedItinerary);
      toast.success('Notes updated successfully.');
      setEditingNotes(null);
      setNoteText('');
    } catch (error) {
      console.error('Error while updating notes: ', error);
      toast.error('Failed to update notes.');
    }
  };

  const startEditingNotes = (placeId: string, currentNotes: string) => {
    setEditingNotes(placeId);
    setNoteText(currentNotes || '');
  };

  const cancelEditingNotes = () => {
    setEditingNotes(null);
    setNoteText('');
  };

  if (isLoading) {
    return <CustomSkeleton />;
  }

  return (
    <>
      {isSharedItinerary && (
        <div className="relative w-full">
          <div className="relative w-full h-96 overflow-hidden rounded-lg">
            <img
              src={trip?.destinationImageUrl}
              alt={trip?.destination}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
          </div>

          <div className="h-20" />
        </div>
      )}

      <div className="min-h-screen">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                <MapPin className="h-10 w-10" />
                Trip To {trip?.destination}
                {!isSharedItinerary && (
                  <Button
                    className="mt-2"
                    onClick={() => setIsShareItineraryLinkDialogOpen(true)}>
                    Share Itinerary
                  </Button>
                )}
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
                            <div key={place.id}>
                              <div className="p-3 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow mb-3">
                                <div className="flex items-center justify-between mb-3">
                                  <div className="flex items-center gap-3">
                                    <div className="flex items-center justify-center w-8 h-8 bg-black text-white rounded-full text-sm font-bold">
                                      {getPlaceNumber(
                                        dayIndex,
                                        placeIndex,
                                        itinerary
                                      )}
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
                                      className={getCategoryColor(
                                        place.category
                                      )}>
                                      {place.category}
                                    </Badge>
                                    {!isSharedItinerary && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                          handleRemovePlace(place.id)
                                        }
                                        className="text-red-500 hover:text-red-700">
                                        <X className="h-3 w-3" />
                                      </Button>
                                    )}
                                  </div>
                                </div>

                                {/* Notes Section */}
                                <div className="mt-2">
                                  {editingNotes === place.id ? (
                                    <div className="space-y-2">
                                      <Textarea
                                        value={noteText}
                                        onChange={(e) =>
                                          setNoteText(e.target.value)
                                        }
                                        placeholder="Add notes about this place..."
                                        className="w-full"
                                        rows={2}
                                      />
                                      <div className="flex items-center gap-2">
                                        <Button
                                          size="sm"
                                          onClick={() =>
                                            handleUpdateNotes(
                                              place.id!,
                                              noteText
                                            )
                                          }
                                          className="h-8">
                                          Add
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={cancelEditingNotes}
                                          className="h-8">
                                          Cancel
                                        </Button>
                                      </div>
                                    </div>
                                  ) : (
                                    <div className="flex items-start gap-2">
                                      {place.notes ? (
                                        <div className="flex items-start gap-1 text-sm text-gray-600 flex-1">
                                          <FileText className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                          <span className="text-gray-700 text-lg mx-2">
                                            {place.notes}
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="flex items-center gap-1 text-sm text-gray-400 flex-1">
                                          <FileText className="h-5 w-5" />
                                          <span className="mx-2">
                                            No notes added
                                          </span>
                                        </div>
                                      )}
                                      {!isSharedItinerary && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() =>
                                            startEditingNotes(
                                              place.id!,
                                              place.notes || ''
                                            )
                                          }
                                          className="h-6 px-2 text-gray-500 hover:text-gray-700">
                                          <Edit3 className="h-3 w-3" />
                                        </Button>
                                      )}
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add place form */}
                      {!isSharedItinerary && (
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
                                onChange={(e) =>
                                  setSelectedPlace(e.target.value)
                                }
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
                                onChange={(e) =>
                                  setSelectedTime(e.target.value)
                                }
                                className="w-full"
                              />
                            </div>

                            <div className="flex items-end">
                              <Button
                                onClick={() =>
                                  addPlace(day.date, day.itineraryId)
                                }
                                disabled={!selectedPlace || !selectedCategory}
                                className="w-full">
                                <Plus className="h-4 w-4 mr-2" />
                                Add
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>

            <div className="lg:col-span-1">
              <MapView coordinates={coordinates} />
            </div>
          </div>
        </div>

        <ShareItineraryLinkDialog
          isOpen={isShareItineraryLinkDialogOpen}
          itineraryTitle={trip?.destination || ''}
          tripId={tripId || ''}
          setIsOpen={() => {
            setIsShareItineraryLinkDialogOpen(!isShareItineraryLinkDialogOpen);
          }}
        />
      </div>
    </>
  );
};

export default Itinerary;
