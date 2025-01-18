'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import { Event } from '../types/events';

// Carrega dinamicamente o MapComponent para evitar o SSR
const DynamicMap = dynamic(() => import('./MapComponent'), { ssr: false });

type MapProps = {
  events: Event[];
};

const SafeMap: React.FC<MapProps> = ({ events }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true); // Garante que o componente sabe que está no cliente
  }, []);

  if (!isClient) return null; // Evita renderizar no servidor

  return <DynamicMap events={events} />;
};

export default SafeMap;
