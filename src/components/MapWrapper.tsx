'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Habitation, HazardZone, Shelter, SosAlert } from '@/types';
import { MapPin, Loader2 } from 'lucide-react';

interface MapWrapperProps {
  center: [number, number];
  zoom?: number;
  zones?: HazardZone[];
  habitations?: Habitation[];
  shelters?: Shelter[];
  userLocation?: [number, number];
  routeDestination?: [number, number];
  routeCoordinates?: [number, number][];
  sosBeacons?: SosAlert[];
  activeRescueSos?: SosAlert | null;
  selectedHabitationId?: string | null;
  onSelectHabitation?: (hab: Habitation) => void;
  onSelectShelter?: (shelter: Shelter) => void;
  height?: string;
}

const DynamicMap = dynamic(() => import('./MapComponent'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-[500px] bg-slate-100 dark:bg-slate-900/60 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center space-y-3 animate-pulse">
      <div className="w-12 h-12 rounded-2xl bg-red-500/20 flex items-center justify-center text-red-500">
        <MapPin className="w-6 h-6 animate-bounce" />
      </div>
      <div className="flex items-center space-x-2 text-sm font-semibold text-slate-600 dark:text-slate-300">
        <Loader2 className="w-4 h-4 animate-spin text-red-500" />
        <span>Initializing GIS Geospatial Vector Layers...</span>
      </div>
      <p className="text-xs text-slate-400 font-mono">Loading satellite tiles & hazard polygons</p>
    </div>
  ),
});

export default function MapWrapper(props: MapWrapperProps) {
  return <DynamicMap {...props} />;
}
