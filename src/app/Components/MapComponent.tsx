'use client';
import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { LatLngExpression } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Event } from '../types/events';

type MapProps = {
  events: Event[];
};

const MapComponent: React.FC<MapProps> = ({ events }) => {
  return (
    <div className='h-[295px]'>
      <MapContainer
        center={[51.505, -0.09]} // Default center (can be adjusted)
        zoom={2}
        className='h-full w-full'
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {/* Render markers for events with latitude and longitude */}
        {events.map((event, index) => {
          if (event.latitude && event.longitude) {
            const position: LatLngExpression = [event.latitude, event.longitude];

            const customIcon = new L.Icon({
              iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
              iconSize: [10, 10],
              iconAnchor: [5, 5],
              popupAnchor: [0, -10],
            });

            return (
              <Marker key={index} position={position} icon={customIcon}>
                <Popup>
                  {event.name}
                  <br />
                  De: {event.start} | até: {event.finish}
                </Popup>
              </Marker>
            );
          }
          return null;
        })}
      </MapContainer>
    </div>
  );
};

export default MapComponent;
