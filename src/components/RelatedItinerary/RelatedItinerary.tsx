import type React from 'react';
import { Activity, Calendar, MapPin, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router';

import { ROUTE_PATH } from '@/consts/RoutePath';
import CardSkeleton from '../ui/custom/CardSkeleton';
import { Card, CardContent } from '../ui/card';
import type { RelatedTrip } from '@/types/Trip';

const RelatedItinerary: React.FC<{
  relatedTrip: RelatedTrip[];
  isLoadingRelatedTrip: boolean;
  tripId?: string;
}> = ({ relatedTrip, isLoadingRelatedTrip, tripId }) => {
  const navigate = useNavigate();

  const formatDate = (dateString: Date) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Calendar className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-gray-900">
            Related Itinerary
          </h2>
        </div>
        <p className="text-gray-600">
          Explore related itineraries to make planning your trip easier
        </p>
      </div>

      {isLoadingRelatedTrip ? (
        <CardSkeleton />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedTrip.map((trip) => (
            <Card
              key={trip.tripId}
              className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer border-1 shadow-md">
              <div className="relative">
                <div className="h-48 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  {trip.destinationImageUrl ? (
                    <img
                      src={trip.destinationImageUrl}
                      alt={trip.destination}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Activity className="w-16 h-16 text-white/80" />
                  )}
                </div>
              </div>

              <CardContent className="px-4">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="font-semibold text-lg">
                    Trip Creator: {trip.creatorName}
                  </h3>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar className="w-4 h-4 mr-2" />
                    {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
                  </div>

                  <div className="flex items-center text-sm text-gray-500">
                    <MapPin className="w-4 h-4 mr-2" />
                    {trip.destination}
                  </div>

                  {trip.rating && (
                    <div className="flex items-center text-sm text-gray-500 align-baseline">
                      <div className="flex items-center justify-center align-baseline">
                        {Array.from({ length: 5 }, (_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < Math.round(trip.rating || 0)
                                ? 'text-gray-700 fill-current'
                                : 'text-gray-300'
                            }`}
                          />
                        ))}
                      </div>{' '}
                      <div className="ml-2">({trip.rating} / 5)</div>
                    </div>
                  )}

                  <Button
                    onClick={() =>
                      navigate(`/${ROUTE_PATH.SHARED_ITINERARY}/${trip.tripId}`)
                    }>
                    Check Itinerary
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoadingRelatedTrip && relatedTrip.length === 0 && (
        <Card className="p-12 text-center border-1 border-gray-200">
          <Activity className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No Related Itineraries Yet
          </h3>
          <p className="text-gray-600 mb-4">
            Start planning your trip by adding some activities and experiences.
          </p>
          <Button
            className="px-6 py-2 rounded-lg"
            onClick={() => navigate(`/${ROUTE_PATH.ITINERARY}/${tripId}`)}>
            Manage Itinerary
          </Button>
        </Card>
      )}
    </div>
  );
};

export default RelatedItinerary;
