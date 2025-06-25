import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Plus, Users } from 'lucide-react';
import { useNavigate, useParams } from 'react-router';
import { ROUTE_PATH } from '@/consts/RoutePath';
import type { TripUsers } from '@/types/Trip';

const UsersList: React.FC<{ users: TripUsers[] }> = ({ users }) => {
  const navigate = useNavigate();
  const { tripId } = useParams<{ tripId: string }>();

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <div className="flex items-center justify-center gap-3 mb-2">
          <Users className="w-8 h-8" />
          <h2 className="text-3xl font-bold text-gray-900">Trip Members</h2>
        </div>
        <p className="text-gray-600">Manage who's joining your adventure</p>
      </div>

      {/* Stats Bar */}
      <div className="bg-gradient-to-r bg-gray-200 rounded-lg p-4 mb-6 border border-gray-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-gray-700">
              Total Members:
            </span>
            <Badge
              variant="secondary"
              className="bg-gray-100 text-gray-800 font-semibold">
              {users.length}
            </Badge>
          </div>
          <Button
            size="sm"
            onClick={() => navigate(`/${ROUTE_PATH.INVITE}/${tripId}`)}>
            <Plus className="w-4 h-4 mr-2" />
            Invite Users
          </Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        {users.length === 1 && (
          <div className="text-center pt-8 px-8">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No other members yet
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Start building your trip crew by inviting friends and family to
              join your adventure.
            </p>
            <Button
              className="px-6 py-2"
              onClick={() => navigate(`/${ROUTE_PATH.INVITE}/${tripId}`)}>
              <Plus className="w-4 h-4 mr-2" />
              Invite Your First Member
            </Button>
          </div>
        )}
        <div className="p-6">
          <div className="flex justify-center">
            {users.map((user, index) => {
              return (
                <div
                  key={index}
                  className={`m-2 group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md hover:border-black-300 transition-all duration-200 hover:-translate-y-1`}>
                  <div className="flex items-center space-x-1">
                    <div
                      className={`w-10 h-10 ${
                        user?.color || 'bg-gray-700'
                      } rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                      {user.firstName[0]}
                      {user.lastName[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-900 truncate">
                        {user.firstName} {user.lastName}
                      </p>
                      <p className="text-xs text-gray-500">
                        Member #{index + 1}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="flex justify-center">
              <Button
                variant="outline"
                className="border-dashed border-2 px-8 py-3"
                onClick={() => navigate(`/${ROUTE_PATH.INVITE}/${tripId}`)}>
                <Plus className="w-4 h-4 mr-2" />
                Invite More Members
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersList;
