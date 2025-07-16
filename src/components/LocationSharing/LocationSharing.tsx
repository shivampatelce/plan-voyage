import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Users, Share2, Navigation, AlertCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { io, type Socket } from 'socket.io-client';
import { useParams } from 'react-router';
import keycloak from '@/keycloak-config';
import type LocationInformation from '@/types/LocationSharing';
import LocationSharingMapView from './LocationSharingMapView';

const CHAT_APP_URL = import.meta.env.VITE_CHAT_APP_URL;

const LocationSharing: React.FC = () => {
  const [isSharing, setIsSharing] = useState(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [locations, setLocations] = useState<LocationInformation[]>();
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const { tripId } = useParams<{ tripId: string }>();

  useEffect(() => {
    const socket = io(CHAT_APP_URL);
    setSocket(socket);
    getInitialTripUsersLocation(socket);

    socket.emit('locationSharing', { tripId, userId: keycloak.subject });

    return () => {
      socket?.emit('stopSharingLocation');
      if (intervalRef.current) clearInterval(intervalRef.current);
      socket.disconnect();
    };
  }, []);

  const getInitialTripUsersLocation = (socket: Socket) => {
    socket?.on('initialLocations', (locations) => {
      setLocations(locations);
    });
    socket?.on('updatedLocations', (locations) => {
      setLocations(locations);
    });
  };

  const handleLocationShare = () => {
    if (!isSharing) {
      sendLocation();
      intervalRef.current = setInterval(sendLocation, 5000);
    } else {
      socket?.emit('stopLocationSharing');
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }
    setIsSharing((prev) => !prev);
  };

  const sendLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position: GeolocationPosition) => {
        const { coords } = position;
        socket?.emit('updateLocation', {
          position: {
            longitude: coords.longitude,
            latitude: coords.latitude,
          },
        });
      }
    );
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          Location Sharing
        </h1>
        <p className="text-lg text-gray-600">
          You can share your location with other trip members and request other
          users to share their locations. This feature can be useful when you're
          traveling in different vehicles and need to track each other's
          locations.
        </p>
      </div>

      <div className="mb-8">
        {/* Location Sharing Controls */}
        <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Navigation
                className="text-gray-600"
                size={20}
              />
              <span className="font-medium text-gray-800">
                Share Your Location
              </span>
            </div>
          </div>

          <Button
            onClick={handleLocationShare}
            className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
              isSharing ? 'bg-red-600 hover:bg-red-700 text-white' : ''
            }`}>
            <Share2 size={20} />
            {isSharing ? 'Stop Sharing Location' : 'Start Sharing Location'}
          </Button>
        </div>

        {/* Trip Members Status */}
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Users size={18} />
            Trip Members Location Status
          </h3>
          <div className="space-y-2">
            <div className="flex items-center justify-between py-2 px-3 bg-white rounded border">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <span className="text-green-600 font-medium text-sm">SP</span>
                </div>
                <span className="font-medium text-gray-700">Shivam Patel</span>
              </div>
              <span className="text-green-600 text-sm flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Sharing location
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Map Display Area */}
      <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg h-96 flex items-center justify-center relative overflow-hidden">
        {/* Map placeholder with grid pattern */}
        {!locations ? (
          <>
            <div className="absolute inset-0 opacity-10">
              <div className="grid grid-cols-8 h-full">
                {Array.from({ length: 32 }, (_, i) => (
                  <div
                    key={i}
                    className="border border-gray-400"></div>
                ))}
              </div>
            </div>

            {/* Map content */}
            <div className="text-center z-10">
              <MapPin
                className="text-gray-400 mx-auto mb-4"
                size={48}
              />
              <h3 className="text-xl font-semibold text-gray-600 mb-2">Map</h3>
            </div>
          </>
        ) : (
          <LocationSharingMapView locationsInfo={locations} />
        )}
      </div>

      {/* Privacy Notice */}
      <div className="mt-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <AlertCircle
            className="text-yellow-600 mt-0.5 flex-shrink-0"
            size={18}
          />
          <div>
            <h4 className="font-medium text-yellow-800 mb-1">Privacy Notice</h4>
            <p className="text-yellow-700 text-sm">
              Your location will only be shared with members of this trip. You
              can stop sharing at any time. Location data is not stored
              permanently and is only used for real-time tracking during the
              trip.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSharing;
