'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, ImageOverlay } from 'react-leaflet';
import L, { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';

type TooltipMapComponentProps = {
  latitude: number;
  longitude: number;
  mapLink: any;
};

const TooltipMapComponent: React.FC<TooltipMapComponentProps> = ({ latitude, longitude, mapLink }) => {
  const position: LatLngExpression = [latitude, longitude];

  const customIcon = new L.Icon({
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    iconSize: [25, 25],
    iconAnchor: [12, 25],
    popupAnchor: [0, -25],
  });

  // Define bounds for the overlay image
  const bounds: [[number, number], [number, number]] = [
    [22.5, 15.3], // Southwest corner (latitude, longitude)
    [50, 50], // Northeast corner (latitude, longitude)
  ];

  return (
    <div className="h-[350px] w-[350px] rounded-md">
      <MapContainer
        center={position} // Use the passed latitude and longitude as the center
        zoom={5} // Adjusted zoom level for better visibility
        className="h-full w-full rounded-md"
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Overlay the custom map image */}
        <ImageOverlay
          url={mapLink} // Replace with the correct path to your image
          bounds={bounds}
          opacity={1} 
        />

        <Marker position={position} icon={customIcon}>
          <Popup>
            Lat: {latitude}, Long: {longitude}
          </Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default TooltipMapComponent;
