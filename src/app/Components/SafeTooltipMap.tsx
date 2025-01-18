'use client';
import React, { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

const DynamicMap = dynamic(() => import('./TooltipMapComponent'), { ssr: false });

type SafeTooltipMapProps = {
  latitude: number;
  longitude: number;
  mapLink: any;
};

const SafeTooltipMap: React.FC<SafeTooltipMapProps> = ({ mapLink, latitude, longitude }) => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return <DynamicMap mapLink={mapLink} latitude={latitude} longitude={longitude} />;
};

export default SafeTooltipMap;
