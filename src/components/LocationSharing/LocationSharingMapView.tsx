import type React from 'react';
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from 'react-leaflet';
import L from 'leaflet';
import type LocationInformation from '@/types/LocationSharing';
import type { TripUsers } from '@/types/Trip';

const createCustomIcon = (name: string) => {
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
          ${name}
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

const LocationSharingMapView: React.FC<{
  locationsInfo: LocationInformation[];
}> = ({ locationsInfo }) => {
  const getUserInitials = (user: TripUsers) => {
    return `${user.firstName[0]}${user.lastName[0]}`;
  };

  return (
    <MapContainer
      center={[
        locationsInfo[0]?.position.latitude,
        locationsInfo[0]?.position.longitude,
      ]}
      zoom={5}
      style={{ height: '600px', width: '100%' }}>
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      {locationsInfo.map(({ position, userInfo }, idx) => (
        <Marker
          key={idx}
          position={[position.latitude, position.longitude]}
          icon={createCustomIcon(userInfo ? getUserInitials(userInfo) : 'AU')}>
          <Popup>
            <div className="text-center">
              <div className="font-semibold text-lg mb-1">
                {userInfo
                  ? `${userInfo.firstName} ${userInfo.lastName}`
                  : 'Anonymous User'}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
      <Polyline
        positions={locationsInfo.map(({ position }) => [
          position.latitude,
          position.longitude,
        ])}
        color="black"
      />
    </MapContainer>
  );
};

export default LocationSharingMapView;
