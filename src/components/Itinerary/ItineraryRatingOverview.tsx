import type { TripRating } from '@/types/Itinerary';
import { Star } from 'lucide-react';
import type React from 'react';
import { Card, CardContent } from '../ui/card';

const ItineraryRatingOverview: React.FC<{ ratingList: TripRating[] }> = ({
  ratingList,
}) => {
  const calculateOverallRating = (): { average: number; total: number } => {
    if (ratingList.length === 0) return { average: 0, total: 0 };

    const sum = ratingList.reduce((acc, rating) => acc + rating.rating, 0);
    const average = sum / ratingList.length;

    return {
      average: Math.round(average * 10) / 10,
      total: ratingList.length,
    };
  };

  return (
    ratingList.length > 0 && (
      <div className="mb-8">
        <Card className="border-1">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="text-center">
                  <div className="text-3xl font-bold text-gray-900 mb-1">
                    {calculateOverallRating().average}
                  </div>
                  <div className="flex items-center justify-center mb-2">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`h-5 w-5 ${
                          i < Math.round(calculateOverallRating().average)
                            ? 'text-gray-700 fill-current'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">Overall Rating</div>
                </div>
                <div className="h-12 w-px bg-gray-300 mx-2" />
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900 mb-1">
                    {calculateOverallRating().total}
                  </div>
                  <div className="text-sm text-gray-600">
                    {calculateOverallRating().total === 1
                      ? 'Review'
                      : 'Reviews'}
                  </div>
                </div>
              </div>

              {/* Rating breakdown */}
              <div className="flex flex-col gap-1">
                {[5, 4, 3, 2, 1].map((starCount) => {
                  const count = ratingList.filter(
                    (r) => r.rating === starCount
                  ).length;
                  const percentage =
                    ratingList.length > 0
                      ? (count / ratingList.length) * 100
                      : 0;

                  return (
                    <div
                      key={starCount}
                      className="flex items-center gap-2 text-sm">
                      <span className="w-3 text-gray-700">{starCount}</span>
                      <Star className="h-3 w-3 text-gray-700 fill-current" />
                      <div className="w-20 h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gray-700 transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                      <span className="w-6 text-gray-600 text-xs">{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  );
};

export default ItineraryRatingOverview;
