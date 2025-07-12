import { Star } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/card';
import type React from 'react';
import type { TripRating } from '@/types/Itinerary';

const ItineraryRatingList: React.FC<{
  ratingList: TripRating[];
  isSharedItinerary: boolean;
}> = ({ ratingList, isSharedItinerary }) => {
  const getUserInitials = (commenterFullName: string) => {
    const commenterName = commenterFullName.split(' ');
    return `${commenterName[0][0] || ''}${commenterName[1][0] || ''}`;
  };

  return (
    <div className="mt-12 mb-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-3">
            <Star className="h-6 w-6" />
            Ratings
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            {ratingList.length ? (
              ratingList.map(
                ({ rating, comment, commenterFullName }, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gray-50 rounded-lg border">
                    <div className="flex items-center space-x-1 mb-2">
                      <div
                        className={`w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                        {getUserInitials(commenterFullName)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-900 truncate">
                          {commenterFullName}
                        </p>
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`h-4 w-4 ${
                                i < rating
                                  ? 'text-gray-800 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-sm font-medium text-gray-700">
                          {rating}/5 stars
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 leading-relaxed">
                        {comment}
                      </p>
                    </div>
                  </div>
                )
              )
            ) : (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No ratings yet
                </h3>
                {isSharedItinerary && (
                  <p className="text-gray-600 max-w-md">
                    Be the first to share your thoughts! Your feedback helps
                    others make informed decisions.
                  </p>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ItineraryRatingList;
