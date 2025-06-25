import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, X, List } from 'lucide-react';
import { apiRequest } from '@/util/apiRequest';
import type { AddItemReq, AddListReq } from '@/types/SharedTripList';
import { API_PATH } from '@/consts/ApiPath';
import { toast } from 'sonner';
import { useParams } from 'react-router';
import { appBadgeBackgroundColors } from '@/util/appColors';
import type { Trip } from '@/types/Trip';
import keycloak from '@/keycloak-config';
import CustomSkeleton from '../ui/custom/CustomSkeleton';

interface TripItem {
  id: string;
  item: string;
  addedBy: string;
  bgColor?: string;
  textColor?: string;
}

interface TripList {
  tripListId: string;
  title: string;
  userId: string;
  items: TripItem[];
  bgColor?: string;
  textColor?: string;
}

const SharedTripList: React.FC = () => {
  const [tripLists, setTripLists] = useState<TripList[]>([]);
  const [trip, setTrip] = useState<Trip>();
  const [isLoading, setIsLoading] = useState(true);

  const [newListTitle, setNewListTitle] = useState('');
  const [newItemInputs, setNewItemInputs] = useState<{
    [listId: string]: string;
  }>({});
  const { tripId } = useParams<{ tripId: string }>();

  useEffect(() => {
    if (tripId) {
      fetchTripDetails(tripId);
    }
  }, [tripId]);

  useEffect(() => {
    if (trip && tripId) {
      fetchList(tripId, trip);
    }
  }, [trip]);

  const fetchTripDetails = async (tripId: string) => {
    setIsLoading(true);
    try {
      const { data } = (await apiRequest<{ userId: string }, { data: Trip }>(
        API_PATH.TRIP_OVERVIEW + `/${tripId}`,
        {
          method: 'GET',
        }
      )) as { data: Trip };

      const trip: Trip = {
        ...data,
        tripUsers: data.tripUsers.map((user, index) => {
          const color =
            appBadgeBackgroundColors[index % appBadgeBackgroundColors.length];
          return {
            ...user,
            color: color,
            badgeBgColor: `bg-${color}-500`,
          };
        }),
      };

      setTrip(trip);
    } catch (error) {
      console.error('Error while fetching trip details:', error);
    }
  };

  const fetchList = async (tripId: string, trip: Trip) => {
    setIsLoading(true);
    try {
      const { data } = (await apiRequest<unknown, unknown>(
        `${API_PATH.GET_TRIP_LIST}/${tripId}`,
        {
          method: 'GET',
        }
      )) as { data: TripList[] };

      const tripLists = data.map((list) => {
        const user = trip.tripUsers.find((u) => u.userId === list.userId);
        const items = list.items.map((item) => {
          const user = trip.tripUsers.find((u) => u.userId === item.addedBy);
          return {
            ...item,
            bgColor: `bg-${user?.color}-100`,
            textColor: `text-${user?.color}-800`,
          };
        });
        return {
          ...list,
          items,
          bgColor: `bg-${user?.color}-100`,
          textColor: `text-${user?.color}-800`,
        };
      });

      setTripLists(tripLists);
      setIsLoading(false);
    } catch (error) {
      console.error('Error while adding to-do task:', error);
      setIsLoading(false);
    }
  };

  const addNewList = async () => {
    if (newListTitle.trim() && tripId) {
      try {
        const list: AddListReq = {
          tripId,
          listTitle: newListTitle,
          userId: keycloak.subject || '',
        };

        await apiRequest<AddListReq, unknown>(API_PATH.CREATE_LIST, {
          method: 'POST',
          body: list,
        });

        if (trip) fetchList(tripId, trip);
        toast.success('A new list has been created.');
      } catch (error) {
        console.error('Error while adding to-do task:', error);
      }

      setNewListTitle('');
    }
  };

  const deleteList = async (listId: string) => {
    try {
      await apiRequest<unknown, unknown>(`${API_PATH.REMOVE_LIST}/${listId}`, {
        method: 'DELETE',
      });

      if (tripId && trip) fetchList(tripId, trip);
      toast.success('A list has been removed.');
    } catch (error) {
      console.error('Error while adding to-do task:', error);
    }
  };

  const addItemToList = async (listId: string) => {
    const itemName = newItemInputs[listId];
    if (itemName && itemName.trim() && tripId && trip) {
      try {
        const item: AddItemReq = {
          listId,
          listItem: itemName.trim(),
          addedBy: keycloak.subject!,
        };

        await apiRequest<AddItemReq, unknown>(API_PATH.ADD_LIST_ITEM, {
          method: 'POST',
          body: item,
        });

        fetchList(tripId, trip);
        toast.success('A new item has been added to list.');
      } catch (error) {
        console.error('Error while adding to-do task:', error);
      }

      setNewItemInputs({ ...newItemInputs, [listId]: '' });
    }
  };

  const removeItemFromList = async (itemId: string) => {
    try {
      await apiRequest<unknown, unknown>(
        `${API_PATH.REMOVE_LIST_ITEM}/${itemId}`,
        {
          method: 'DELETE',
        }
      );

      if (tripId && trip) fetchList(tripId, trip);
      toast.success('An item has been removed from the list.');
    } catch (error) {
      console.error('Error while adding to-do task:', error);
    }
  };

  const updateNewItemInput = (listId: string, value: string) => {
    setNewItemInputs({ ...newItemInputs, [listId]: value });
  };

  return (
    <div className="min-h-screen">
      {isLoading ? (
        <CustomSkeleton />
      ) : (
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              Trip Lists
            </h1>
            <p className="text-lg text-gray-600">
              Organize Your Lists For This Trip
            </p>
          </div>

          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Plus className="w-5 h-5" />
                Create New List
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex gap-3">
                <Input
                  placeholder="Enter list title..."
                  value={newListTitle}
                  onChange={(e) => setNewListTitle(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addNewList()}
                  className="flex-1"
                />
                <Button onClick={addNewList}>Add List</Button>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {tripLists.map((list) => (
              <Card
                key={list.tripListId}
                className={`shadow-lg backdrop-blur-sm hover:shadow-xl transition-all duration-300`}>
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <CardTitle
                      className={`text-xl font-semibold ${list.textColor}`}>
                      {list.title}
                    </CardTitle>
                    {keycloak.subject === list.userId && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteList(list.tripListId)}>
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {list.items.length ? (
                    <div className="space-y-3 max-h-80 overflow-y-auto">
                      {list.items.map(
                        ({ id, item, textColor, bgColor, addedBy }) => (
                          <div
                            key={id}
                            className={`group p-3 rounded-lg ${bgColor} border border-gray-100 hover:shadow-md transition-all duration-200`}>
                            <div className="flex items-start justify-between">
                              <h4 className={`font-medium ${textColor}`}>
                                {item}
                              </h4>
                              {keycloak.subject === addedBy && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItemFromList(id)}>
                                  <X className="w-3 h-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                        )
                      )}
                    </div>
                  ) : (
                    <h3 className="text-xl font-medium text-gray-600 mb-2">
                      The list is empty.
                    </h3>
                  )}

                  <div className="flex gap-2 pt-3 border-t border-gray-200">
                    <Input
                      placeholder="Add new item..."
                      value={newItemInputs[list.tripListId] || ''}
                      onChange={(e) =>
                        updateNewItemInput(list.tripListId, e.target.value)
                      }
                      onKeyPress={(e) =>
                        e.key === 'Enter' && addItemToList(list.tripListId)
                      }
                      className="flex-1 text-sm"
                    />
                    <Button
                      size="sm"
                      onClick={() => addItemToList(list.tripListId)}
                      className="px-3">
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {tripLists.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <List className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-medium text-gray-600 mb-2">
                No trip lists yet
              </h3>
              <p className="text-gray-500">
                Create your first list to start organizing your adventures!
              </p>
            </div>
          )}

          <div className="flex justify-center mt-10 border-t">
            {trip?.tripUsers.map((user, index) => (
              <div
                key={index}
                className="my-8 mx-2 group relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg p-4 border border-gray-200 hover:shadow-md hover:border-black-300 transition-all duration-200 hover:-translate-y-1">
                <div className="flex items-center space-x-1">
                  <div
                    className={`w-10 h-10 ${user.badgeBgColor} rounded-full flex items-center justify-center text-white font-semibold text-sm`}>
                    {user.firstName[0]}
                    {user.lastName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">
                      {user.firstName} {user.lastName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SharedTripList;
