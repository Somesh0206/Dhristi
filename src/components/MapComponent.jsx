'use client';

import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polygon, Polyline, Circle, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import { useApp } from '@/context/AppContext';
import { Layers, ExternalLink } from 'lucide-react';

function createCustomIcon(color, label, pulse = false) {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center">
        ${
    pulse ?
    `<span class="animate-ping absolute inline-flex h-8 w-8 rounded-full opacity-75" style="background-color: ${color}"></span>` :
    ''}
        <div class="relative w-8 h-8 rounded-full flex items-center justify-center text-white font-extrabold text-[10px] shadow-xl border-2 border-white/90" style="background-color: ${
    color};">
          ${label}
        </div>
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });
}

const redZoneIcon = createCustomIcon('#EF4444', 'RED', true);
const orangeZoneIcon = createCustomIcon('#F97316', 'ORG');
const greenZoneIcon = createCustomIcon('#10B981', 'GRN');
const userLocationIcon = createCustomIcon('#8B5CF6', 'YOU', true);
const sosBeaconIcon = createCustomIcon('#DC2626', 'SOS', true);
const rescueDepotIcon = createCustomIcon('#0284C7', 'DEP', false);

// Specific icons for safe shelter categories
const schoolShelterIcon = createCustomIcon('#4F46E5', 'SCH');
const hospitalShelterIcon = createCustomIcon('#059669', 'HSP');
const stadiumShelterIcon = createCustomIcon('#D97706', 'STD');
const govtShelterIcon = createCustomIcon('#2563EB', 'GOV');
const relocationHubIcon = createCustomIcon('#0D9488', 'HUB', true);
const defaultShelterIcon = createCustomIcon('#3B82F6', 'SHL');
const searchedDestinationIcon = createCustomIcon('#2563EB', 'DST', true);

function getShelterIcon(type) {
  if (type === 'SCHOOL') return schoolShelterIcon;
  if (type === 'HOSPITAL') return hospitalShelterIcon;
  if (type === 'STADIUM') return stadiumShelterIcon;
  if (type === 'GOVERNMENT_OFFICE' || type === 'GOVT_OFFICE') return govtShelterIcon;
  if (type === 'RELOCATION_HUB') return relocationHubIcon;
  return defaultShelterIcon;
}

function MapController({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center && Array.isArray(center) && center.length === 2 && typeof center[0] === 'number' && !isNaN(center[0])) {
      map.setView(center, zoom || 11, { animate: true });
    }
  }, [center, zoom, map]);
  return null;
}

const tileProviders = {
  google_hybrid: {
    name: 'Google Maps (Satellite Hybrid)',
    url: 'https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Imagery'
  },
  google_terrain: {
    name: 'Google Maps (3D Terrain)',
    url: 'https://mt1.google.com/vt/lyrs=p&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Terrain'
  },
  google_roadmap: {
    name: 'Google Maps (Roadmap)',
    url: 'https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',
    attribution: '&copy; Google Maps Roadmap'
  },
  esri_satellite: {
    name: 'Apple / Esri World Satellite',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: '&copy; Esri & Apple Maps GIS Community'
  },
  osm: {
    name: 'OpenStreetMap Carto',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap & CARTO'
  }
};

// Generate realistic mountain highway road curvature if raw vectors aren't available
function generateRealisticRoadPoints(start, end) {
  if (!start || !end || !Array.isArray(start) || !Array.isArray(end) || start.length < 2 || end.length < 2) {
    return null;
  }
  const s0 = typeof start[0] === 'number' ? start[0] : parseFloat(start[0]);
  const s1 = typeof start[1] === 'number' ? start[1] : parseFloat(start[1]);
  const e0 = typeof end[0] === 'number' ? end[0] : parseFloat(end[0]);
  const e1 = typeof end[1] === 'number' ? end[1] : parseFloat(end[1]);
  if (isNaN(s0) || isNaN(s1) || isNaN(e0) || isNaN(e1)) return null;

  const points = [];
  const steps = 18;
  const dLat = e0 - s0;
  const dLng = e1 - s1;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    // Harmonic curve representing switchbacks avoiding steep ravines
    const curveOffset = Math.sin(t * Math.PI) * 0.007 + Math.sin(t * Math.PI * 2.5) * 0.0035;
    const lat = s0 + dLat * t + curveOffset * 0.5;
    const lng = s1 + dLng * t - curveOffset;
    points.push([lat, lng]);
  }
  return points;
}

const checkpointIcon = L.divIcon({
  className: 'custom-leaflet-marker',
  html: `
    <div class="flex items-center justify-center">
      <div class="w-5 h-5 rounded-full bg-cyan-500 border-2 border-white shadow-lg flex items-center justify-center text-slate-950 font-black text-[9px]">
        CP
      </div>
    </div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10]
});

export default function MapComponent({
  center = [11.5510, 76.1305],
  zoom = 11,
  zones = [],
  habitations = [],
  shelters = [],
  userLocation,
  routeDestination,
  routeCoordinates,
  searchedPlace,
  routeInfo,
  sosBeacons = [],
  activeRescueSos,
  selectedHabitationId,
  onSelectHabitation,
  onSelectShelter,
  height = '500px'
}) {
  const { mapTileProvider, setMapTileProvider } = useApp();
  const currentTile = tileProviders[mapTileProvider] || tileProviders.google_roadmap;

  // Determine active route endpoints (either searched destination, rescue route, or evacuation route)
  const routeOrigin =
    routeInfo?.originCoordinates ||
    (activeRescueSos ? activeRescueSos.nearestDepotCoords || [11.614, 76.085] : userLocation);
  const routeDest =
    searchedPlace?.coordinates ||
    (activeRescueSos ? activeRescueSos.coordinates : routeDestination);

  // Compute active road polyline safely
  const rawPoints =
    routeCoordinates && Array.isArray(routeCoordinates) && routeCoordinates.length >= 2
      ? routeCoordinates
      : routeInfo?.routeCoordinates && Array.isArray(routeInfo.routeCoordinates) && routeInfo.routeCoordinates.length >= 2
      ? routeInfo.routeCoordinates
      : routeOrigin && routeDest
      ? generateRealisticRoadPoints(routeOrigin, routeDest)
      : null;

  const activeRoadPoints = Array.isArray(rawPoints) && rawPoints.length >= 2 ? rawPoints : null;

  // Intermediate Checkpoint Waypoints
  const checkpointA =
    activeRoadPoints && activeRoadPoints.length > 6
      ? activeRoadPoints[Math.floor(activeRoadPoints.length * 0.35)]
      : null;
  const checkpointB =
    activeRoadPoints && activeRoadPoints.length > 10
      ? activeRoadPoints[Math.floor(activeRoadPoints.length * 0.72)]
      : null;

  return (
    <div
      style={{ height, width: '100%' }}
      className="relative isolate rounded-2xl overflow-hidden shadow-xl border border-slate-200 dark:border-slate-800 group z-0"
    >
      {/* Map Tile Provider Selector (Isolated z-20 within map context) */}
      <div className="absolute top-3 right-3 z-20 bg-slate-900/95 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-slate-700/80 shadow-lg flex items-center space-x-1.5 text-xs transition-all pointer-events-auto max-w-[190px] sm:max-w-xs">
        <Layers className="w-3.5 h-3.5 text-blue-400 shrink-0" />
        <select
          value={mapTileProvider}
          onChange={(e) => setMapTileProvider(e.target.value)}
          className="bg-transparent text-slate-100 font-bold text-[11px] focus:outline-none cursor-pointer pr-1 truncate"
          aria-label="Map Tile Provider Layer"
        >
          <option value="google_roadmap" className="bg-slate-900 text-white">🗺️ Google Maps (Roadmap)</option>
          <option value="google_hybrid" className="bg-slate-900 text-white">🛰️ Google Maps (Satellite)</option>
          <option value="google_terrain" className="bg-slate-900 text-white">⛰️ Google Maps (Terrain)</option>
          <option value="esri_satellite" className="bg-slate-900 text-white">🍏 Esri Satellite</option>
          <option value="osm" className="bg-slate-900 text-white">🌐 OpenStreetMap</option>
        </select>
      </div>

      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}>
        
        <MapController center={center} zoom={zoom} />

        {/* Dynamic Multi-Provider Tile Layer */}
        <TileLayer
          key={mapTileProvider}
          attribution={currentTile.attribution}
          url={currentTile.url}
          maxZoom={19} />
        

        {/* Hazard Zone Polygons */}
        {zones.map((zone) => {
          const color =
          zone.riskLevel === 'RED' ?
          '#EF4444' :
          zone.riskLevel === 'ORANGE' ?
          '#F97316' :
          '#10B981';

          return (
            <Polygon
              key={zone.id}
              positions={zone.boundary}
              pathOptions={{
                color: color,
                fillColor: color,
                fillOpacity: zone.riskLevel === 'RED' ? 0.35 : 0.2,
                weight: zone.riskLevel === 'RED' ? 3 : 2,
                dashArray: zone.riskLevel === 'RED' ? undefined : '5, 5'
              }}>
              
              <Popup>
                <div className="p-1 space-y-1.5 text-slate-100 min-w-[200px]">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold text-xs">{zone.name}</span>
                    <span
                      className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      zone.riskLevel === 'RED' ?
                      'bg-red-600 text-white' :
                      zone.riskLevel === 'ORANGE' ?
                      'bg-amber-600 text-white' :
                      'bg-emerald-600 text-white'}`
                      }>
                      
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

                  {/* Deep link to Google & Apple Maps */}
                  <div className="border-t border-slate-700/80 pt-1.5 flex gap-1 text-[10px]">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${zone.center[0]},${zone.center[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1 px-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-center font-bold flex items-center justify-center space-x-1">
                      
                      <span>Google Maps</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <a
                      href={`https://maps.apple.com/?q=${zone.name}&ll=${zone.center[0]},${zone.center[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1 px-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-center font-bold flex items-center justify-center space-x-1">
                      
                      <span>Apple Maps</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </Popup>
            </Polygon>);

        })}

        {/* Habitations Markers */}
        {habitations.map((hab) => {
          const icon =
          hab.riskLevel === 'RED' ?
          redZoneIcon :
          hab.riskLevel === 'ORANGE' ?
          orangeZoneIcon :
          greenZoneIcon;

          const isSelected = selectedHabitationId === hab.id;

          return (
            <React.Fragment key={hab.id}>
              {isSelected &&
              <Circle
                center={hab.coordinates}
                radius={1200}
                pathOptions={{ color: '#EF4444', fillColor: '#EF4444', fillOpacity: 0.15 }} />

              }
              <Marker
                position={hab.coordinates}
                icon={icon}
                eventHandlers={{
                  click: () => onSelectHabitation && onSelectHabitation(hab)
                }}>
                
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
                    {hab.immediateRelocationNeeded &&
                    <div className="bg-red-500/20 text-red-300 text-[10px] font-bold p-1 rounded border border-red-500/40 text-center uppercase tracking-wide animate-pulse">
                        ⚠️ Immediate Relocation Mandated
                      </div>
                    }

                    {/* External Navigation Links */}
                    <div className="border-t border-slate-700/80 pt-1.5 flex gap-1 text-[10px]">
                      <a
                        href={`https://www.google.com/maps/dir/?api=1&destination=${hab.coordinates[0]},${hab.coordinates[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1 px-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-center font-bold flex items-center justify-center space-x-1">
                        
                        <span>Google Nav</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                      <a
                        href={`https://maps.apple.com/?daddr=${hab.coordinates[0]},${hab.coordinates[1]}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 py-1 px-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-center font-bold flex items-center justify-center space-x-1">
                        
                        <span>Apple Nav</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    </div>
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>);

        })}

        {/* Shelter Markers with Category-Specific Icons (School, Hospital, Stadium, Govt Office) */}
        {shelters.map((shelter) => {
          const isOverflow = shelter.currentOccupancy >= shelter.totalCapacity;
          return (
            <Marker
              key={shelter.id}
              position={shelter.coordinates}
              icon={getShelterIcon(shelter.type)}
              eventHandlers={{
                click: () => onSelectShelter && onSelectShelter(shelter)
              }}>
              
              <Popup>
                <div className="p-2 space-y-1.5 text-slate-100 min-w-[240px]">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs text-blue-400">{shelter.name}</span>
                    <span className="text-[9px] font-mono uppercase px-1.5 py-0.5 rounded bg-blue-900/60 text-blue-200">
                      {shelter.type.replace('_', ' ')}
                    </span>
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
                        {shelter.currentOccupancy} ({Math.round(shelter.currentOccupancy / shelter.totalCapacity * 100)}%)
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

                  {/* External Navigation Links */}
                  <div className="border-t border-slate-700/80 pt-1.5 flex gap-1 text-[10px]">
                    <a
                      href={`https://www.google.com/maps/dir/?api=1&destination=${shelter.coordinates[0]},${shelter.coordinates[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1 px-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-center font-bold flex items-center justify-center space-x-1">
                      
                      <span>Google Nav</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                    <a
                      href={`https://maps.apple.com/?daddr=${shelter.coordinates[0]},${shelter.coordinates[1]}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 py-1 px-1.5 bg-slate-700 hover:bg-slate-600 text-white rounded text-center font-bold flex items-center justify-center space-x-1">
                      
                      <span>Apple Nav</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>);

        })}

        {/* Citizen SOS Distress Beacons */}
        {sosBeacons.map((beacon) =>
        <Marker key={beacon.id} position={beacon.coordinates} icon={sosBeaconIcon}>
            <Popup>
              <div className="p-2 space-y-1 text-slate-100 min-w-[220px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-red-400">🚨 Citizen SOS Beacon</span>
                  <span className="text-[9px] bg-red-950 text-red-300 font-bold px-1 rounded">
                    {beacon.urgency || 'HIGH'}
                  </span>
                </div>
                <div className="font-bold text-xs">{beacon.senderName}</div>
                <div className="text-[10px] text-slate-300">{beacon.addressDescription}</div>
                <div className="text-[10px] bg-slate-800 p-1 rounded font-mono">
                  People: <strong className="text-amber-400">{beacon.peopleCount}</strong> | Medical:{' '}
                  <strong className={beacon.medicalAssistanceRequired ? 'text-red-400' : 'text-slate-400'}>
                    {beacon.medicalAssistanceRequired ? 'REQUIRED' : 'NO'}
                  </strong>
                </div>
                {beacon.assignedUnit &&
              <div className="text-[10px] text-blue-300 bg-blue-950/60 p-1 rounded">
                    Dispatched: <strong>{beacon.assignedUnit}</strong> (ETA: {beacon.estimatedArrivalMins}m)
                  </div>
              }
              </div>
            </Popup>
          </Marker>
        )}

        {/* Rescue Responder Depot Marker (When active rescue route is displayed) */}
        {activeRescueSos && activeRescueSos.nearestDepotCoords &&
        <Marker position={activeRescueSos.nearestDepotCoords} icon={rescueDepotIcon}>
            <Popup>
              <div className="p-2 space-y-1 text-slate-100 min-w-[200px]">
                <div className="font-bold text-xs text-blue-400">🛡️ Rescue Dispatch Depot</div>
                <div className="text-xs">{activeRescueSos.nearestDepotName || 'NDRF Rapid Response Base'}</div>
                <div className="text-[10px] text-slate-300">
                  Active Units En Route to {activeRescueSos.senderName}
                </div>
              </div>
            </Popup>
          </Marker>
        }

        {/* User Current Location Marker */}
        {userLocation && Array.isArray(userLocation) && userLocation.length === 2 && !isNaN(userLocation[0]) && !isNaN(userLocation[1]) && (
          <Marker position={userLocation} icon={userLocationIcon}>
            <Popup>
              <div className="p-1.5 text-slate-100 text-xs font-semibold">
                📍 You Are Here
                <div className="text-[10px] text-slate-300 font-mono">
                  {Number(userLocation[0]).toFixed(5)}, {Number(userLocation[1]).toFixed(5)}
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Searched Place / Destination Marker */}
        {searchedPlace && searchedPlace.coordinates && Array.isArray(searchedPlace.coordinates) && searchedPlace.coordinates.length === 2 && !isNaN(searchedPlace.coordinates[0]) && !isNaN(searchedPlace.coordinates[1]) && (
          <Marker position={searchedPlace.coordinates} icon={searchedDestinationIcon}>
            <Popup>
              <div className="p-2 space-y-1.5 text-slate-100 min-w-[210px]">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-blue-400">🎯 Destination Place</span>
                  <span className="text-[9px] bg-blue-950 text-blue-300 font-bold px-1.5 py-0.5 rounded">
                    {searchedPlace.category || 'SEARCHED'}
                  </span>
                </div>
                <div className="font-bold text-xs text-white">{searchedPlace.name}</div>
                <div className="text-[10px] text-slate-300 line-clamp-2">
                  {searchedPlace.displayName || searchedPlace.name}
                </div>
                {routeInfo && (
                  <div className="pt-1.5 border-t border-slate-700/80 grid grid-cols-2 gap-1 text-[10px] font-mono">
                    <div className="bg-slate-800 p-1 rounded">
                      <span className="text-slate-400 block text-[9px]">Drive Time:</span>
                      <strong className="text-blue-400">
                        {routeInfo.vehicleTimeFormatted || `${routeInfo.durationMins || 0}m`}
                      </strong>
                    </div>
                    <div className="bg-slate-800 p-1 rounded">
                      <span className="text-slate-400 block text-[9px]">Distance:</span>
                      <strong className="text-emerald-400">{routeInfo.distanceKm || 0} km</strong>
                    </div>
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}

        {/* Realistic Highway / Evacuation Road Route Corridor */}
        {activeRoadPoints && activeRoadPoints.length >= 2 && (
          <>
            {/* Layer 1: Outer Safety Buffer Glow */}
            <Polyline
              positions={activeRoadPoints}
              pathOptions={{
                color: '#06B6D4',
                weight: 10,
                opacity: 0.35,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />

            {/* Layer 2: Main Solid Asphalt Road Vector */}
            <Polyline
              positions={activeRoadPoints}
              pathOptions={{
                color: '#2563EB',
                weight: 5,
                opacity: 0.95,
                lineCap: 'round',
                lineJoin: 'round'
              }}
            />

            {/* Layer 3: Dashed Road Markings & Direction Flow */}
            <Polyline
              positions={activeRoadPoints}
              pathOptions={{
                color: '#FFFFFF',
                weight: 2,
                dashArray: '6, 8',
                opacity: 0.9
              }}
            />

            {/* Checkpoint Alpha Marker */}
            {checkpointA && Array.isArray(checkpointA) && checkpointA.length === 2 && (
              <Marker position={checkpointA} icon={checkpointIcon}>
                <Popup>
                  <div className="p-1.5 text-xs font-semibold text-slate-100">
                    <div className="text-cyan-400 font-bold">🛣️ Checkpoint Alpha</div>
                    <div className="text-[10px] text-slate-300">Elevated Ridge Bypass Route</div>
                  </div>
                </Popup>
              </Marker>
            )}

            {/* Checkpoint Bravo Marker */}
            {checkpointB && Array.isArray(checkpointB) && checkpointB.length === 2 && (
              <Marker position={checkpointB} icon={checkpointIcon}>
                <Popup>
                  <div className="p-1.5 text-xs font-semibold text-slate-100">
                    <div className="text-cyan-400 font-bold">🚨 Checkpoint Bravo</div>
                    <div className="text-[10px] text-slate-300">Emergency Aid & Transit Station</div>
                  </div>
                </Popup>
              </Marker>
            )}
          </>
        )}
      </MapContainer>
    </div>);

}