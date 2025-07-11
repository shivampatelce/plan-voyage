import type React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { MapPin } from 'lucide-react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';
import type { Coordinates } from '@/types/Itinerary';
import { useEffect, useState } from 'react';
import L from 'leaflet';

const createNumberedIcon = (number: number) => {
  return L.divIcon({
    html: `
        <div style="
          width: 36px;
          height: 36px;
          background-color: black;
          border: 3px solid white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          color: white;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.3);
          position: relative;
        ">
          ${number}
        </div>
        <div style="
          position: absolute;
          top: 32px;
          left: 50%;
          transform: translateX(-50%);
          width: 0;
          height: 0;
          border-left: 6px solid transparent;
          border-right: 6px solid transparent;
          border-top: 8px solid black;
        "></div>
      `,
    className: 'custom-numbered-marker',
    iconSize: [36, 44],
    iconAnchor: [18, 44],
    popupAnchor: [0, -44],
  });
};

const MapView: React.FC<{ coordinates: Coordinates[] }> = ({ coordinates }) => {
  return (
    <Card className="sticky top-6 shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-semibold text-gray-800 flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Map View
        </CardTitle>
      </CardHeader>
      <CardContent className="h-full">
        <div className="h-full bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
          {coordinates.length ? (
            <MapContainer
              center={[coordinates[0]?.latitude, coordinates[0]?.longitude]}
              zoom={5}
              style={{ height: '600px', width: '100%' }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              {coordinates.map((pos, idx) => (
                <Marker
                  key={idx}
                  position={[pos.latitude, pos.longitude]}
                  icon={createNumberedIcon(pos.placeNumber || 1)}>
                  <Popup>
                    <div className="text-center">
                      <div className="font-semibold text-lg mb-1">
                        {pos.placeNumber}. {pos.place}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
              <Polyline
                positions={coordinates.map((p) => [p.latitude, p.longitude])}
                color="black"
              />
            </MapContainer>
          ) : (
            <div className="text-center p-20">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 font-medium">
                Add places to your itinerary and view them on the map here.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MapView;
