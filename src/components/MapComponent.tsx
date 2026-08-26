'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { Habitation, HazardZone, Shelter } from '@/types';

// Custom Map Marker Icons using HTML SVGs
function createCustomIcon(color: string, label: string, isPulsing = false) {
  const pulseHtml = isPulsing
    ? `<div class="absolute -inset-1 rounded-full bg-red-500 animate-ping opacity-75"></div>`
    : '';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center">
        ${pulseHtml}
        <div style="background-color: ${color};" class="w-8 h-8 rounded-full border-2 border-white dark:border-slate-900 flex items-center justify-center text-white shadow-xl transform hover:scale-125 transition-transform">
          <span style="font-size: 10px; font-weight: 800;">${label}</span>
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
}

const redZoneIcon = createCustomIcon('#EF4444', 'RED', true);
const orangeZoneIcon = createCustomIcon('#F97316', 'ORG');
const greenZoneIcon = createCustomIcon('#10B981', 'GRN');
const shelterIcon = createCustomIcon('#3B82F6', 'SHL');
const userLocationIcon = createCustomIcon('#8B5CF6', 'YOU', true);

function MapController({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom, { animate: true });
  }, [center, zoom, map]);
  return null;
}

interface MapComponentProps {
  center: [number, number];
  zoom?: number;
  zones?: HazardZone[];
  habitations?: Habitation[];
  shelters?: Shelter[];
  userLocation?: [number, number];
  routeDestination?: [number, number];
  selectedHabitationId?: string | null;
  onSelectHabitation?: (hab: Habitation) => void;
  onSelectShelter?: (shelter: Shelter) => void;
  height?: string;
}

export default function MapComponent({
  center,
  zoom = 11,
  zones = [],
  habitations = [],
  shelters = [],
  userLocation,
  routeDestination,
  selectedHabitationId,
  onSelectHabitation,
  onSelectShelter,
  height = '500px',
}: MapComponentProps) {
  return (
    <div style={{ height, width: '100%' }} className="relative rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800">
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
      >
        <MapController center={center} zoom={zoom} />

        {/* Base Map Tiles (OpenStreetMap Carto Voyager style / standard) */}
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />

        {/* Hazard Zone Polygons */}
        {zones.map((zone) => {
          const color =
            zone.riskLevel === 'RED'
              ? '#EF4444'
              : zone.riskLevel === 'ORANGE'
              ? '#F97316'
              : '#10B981';

          return (
            <Polygon
              key={zone.id}
              positions={zone.boundary}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: zone.riskLevel === 'RED' ? 0.35 : 0.2,
                weight: zone.riskLevel === 'RED' ? 3 : 2,
                dashArray: zone.riskLevel === 'RED' ? undefined : '5, 5',
              }}
            >
              <Popup>
                <div className="p-1 space-y-1 text-slate-100">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs">{zone.name}</span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                        zone.riskLevel === 'RED'
                          ? 'bg-red-600 text-white'
                          : zone.riskLevel === 'ORANGE'
                          ? 'bg-amber-600 text-white'
                          : 'bg-emerald-600 text-white'
                      }`}
                    >
                      {zone.riskLevel} ZONE
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300">{zone.description}</p>
                  <div className="text-[10px] text-slate-400 font-mono">
                    Area: {zone.areaSqKm} sq km | Score: {zone.riskScore}/100
                  </div>
                  <div className="text-[10px] text-amber-300 font-medium">
                    Trigger: {zone.triggerCondition}
                  </div>
                </div>
              </Popup>
            </Polygon>
          );
        })}

        {/* Habitations Markers */}
        {habitations.map((hab) => {
          const icon =
            hab.riskLevel === 'RED'
              ? redZoneIcon
              : hab.riskLevel === 'ORANGE'
              ? orangeZoneIcon
              : greenZoneIcon;

          const isSelected = selectedHabitationId === hab.id;

          return (
            <React.Fragment key={hab.id}>
              {isSelected && (
                <Circle
                  center={hab.coordinates}
                  radius={1200}
                  pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.15 }}
                />
              )}
              <Marker
                position={hab.coordinates}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectHabitation && onSelectHabitation(hab),
                }}
              >
                <Popup>
                  <div className="p-2 space-y-2 text-slate-100 min-w-[220px]">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-xs">{hab.name}</span>
                      <span className="text-[9px] font-mono bg-slate-800 px-1 py-0.5 rounded border border-slate-700">
                        {hab.id}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-300">
                      {hab.district}, {hab.state}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] bg-slate-800/80 p-1.5 rounded">
                      <div>
                        Population: <span className="font-bold">{hab.population}</span>
                      </div>
                      <div>
                        Vulnerability: <span className="font-bold text-red-400">{hab.vulnerabilityScore}%</span>
                      </div>
                      <div>
                        Rainfall: <span className="font-bold text-blue-400">{hab.telemetry.rainfallMmHr} mm/h</span>
                      </div>
                      <div>
                        Pore Water: <span className="font-bold text-amber-400">{hab.telemetry.poreWaterKPa} kPa</span>
                      </div>
                    </div>
                    {hab.immediateRelocationNeeded && (
                      <div className="bg-red-500/20 text-red-300 text-[10px] font-bold p-1 rounded border border-red-500/40 text-center uppercase tracking-wide animate-pulse">
                        ⚠️ Immediate Relocation Mandated
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* Shelter Markers */}
        {shelters.map((shelter) => {
          const isOverflow = shelter.currentOccupancy >= shelter.totalCapacity;
          return (
            <Marker
              key={shelter.id}
              position={shelter.coordinates}
              icon={shelterIcon}
              eventHandlers={{
                click: () => onSelectShelter && onSelectShelter(shelter),
              }}
            >
              <Popup>
                <div className="p-2 space-y-1.5 text-slate-100 min-w-[240px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-400">{shelter.name}</span>
                  </div>
                  <div className="text-[11px] text-slate-300">{shelter.address}</div>
                  <div className="bg-slate-800 p-1.5 rounded text-[10px] space-y-1">
                    <div className="flex justify-between">
                      <span>Total Capacity:</span>
                      <span className="font-bold">{shelter.totalCapacity}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Live Occupancy:</span>
                      <span className={`font-bold ${isOverflow ? 'text-red-400' : 'text-emerald-400'}`}>
                        {shelter.currentOccupancy} ({Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100)}%)
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>50-Yr Resilience:</span>
                      <span className="font-bold text-emerald-400">{shelter.resilienceScore}/100</span>
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Contact: {shelter.contactPerson} ({shelter.phone})
                  </div>
                </div>
              </Popup>
            </Marker>
          );
        })}

        {/* User Current Location Marker */}
        {userLocation && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
              <div className="p-1.5 text-slate-100 text-xs font-semibold">
                📍 You Are Here
                <div className="text-[10px] text-slate-300 font-mono">
                  {userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Evacuation Route Line */}
        {userLocation && routeDestination && (
          <Polyline
            positions={[userLocation, routeDestination]}
            pathOptions={{
              color: '#3B82F6',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.9,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
}
