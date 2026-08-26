'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MapWrapper from '@/components/MapWrapper';
import { mockHabitations } from '@/data/zonesData';
import { mockShelters } from '@/data/sheltersData';
import { useApp } from '@/context/AppContext';
import { Habitation, Shelter } from '@/types';
import {
  Compass,
  MapPin,
  Building2,
  Navigation,
  LocateFixed,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Clock,
  Footprints,
  Truck,
  Activity,
  Users,
  Loader2,
} from 'lucide-react';

// Distance calculation using Haversine formula
function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

function RelocationContent() {
  const searchParams = useSearchParams();
  const habIdParam = searchParams.get('habId');

  const { userCoordinates, setUserCoordinates, requestUserLocation, isLocating, locationError, openSosModal } = useApp();

  const [selectedHabitation, setSelectedHabitation] = useState<Habitation | null>(null);
  const [nearestShelter, setNearestShelter] = useState<Shelter>(mockShelters[0]);
  const [evacueeCount, setEvacueeCount] = useState<number>(1);
  const [evacuationMode, setEvacuationMode] = useState<'foot' | 'vehicle'>('vehicle');

  // Pre-load from query param if passed
  useEffect(() => {
    if (habIdParam) {
      const found = mockHabitations.find((h) => h.id === habIdParam);
      if (found) {
        setSelectedHabitation(found);
        setUserCoordinates(found.coordinates);
      }
    }
  }, [habIdParam, setUserCoordinates]);

  // Compute nearest shelter whenever user coordinates change
  useEffect(() => {
    let closest = mockShelters[0];
    let minDistance = Infinity;

    mockShelters.forEach((shelter) => {
      const dist = calculateDistanceKm(
        userCoordinates[0],
        userCoordinates[1],
        shelter.coordinates[0],
        shelter.coordinates[1]
      );
      if (dist < minDistance) {
        minDistance = dist;
        closest = shelter;
      }
    });

    setNearestShelter(closest);
  }, [userCoordinates]);

  const distanceKm = calculateDistanceKm(
    userCoordinates[0],
    userCoordinates[1],
    nearestShelter.coordinates[0],
    nearestShelter.coordinates[1]
  );

  const etaMins = evacuationMode === 'foot' ? Math.round(distanceKm * 15) : Math.round(distanceKm * 3.5);

  // Carrying capacity analytics
  const shelterCapacity = nearestShelter.totalCapacity;
  const shelterAllocated = nearestShelter.allocatedOccupancy + evacueeCount;
  const remainingBuffer = Math.max(0, shelterCapacity - shelterAllocated);
  const stressIndex = Math.min(100, Math.round((shelterAllocated / shelterCapacity) * 100));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>Real-Time Relocation & Allocation Hub</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Live Safe Route & Carrying Capacity Matrix
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Automatic geolocation lock, shortest hazard-free evacuation pathway, and dynamic shelter capacity stress.
          </p>
        </div>

        {/* Location Action */}
        <div className="flex items-center space-x-2">
          <button
            onClick={requestUserLocation}
            disabled={isLocating}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow transition-all hover:scale-105"
          >
            <LocateFixed className={`w-4 h-4 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Acquiring GPS...' : 'Acquire My Live GPS'}</span>
          </button>
        </div>
      </div>

      {locationError && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 p-3 rounded-xl text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Map with Route Line */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-4 rounded-2xl">
            <div className="flex items-center justify-between mb-3 text-xs">
              <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-1.5">
                <Navigation className="w-4 h-4 text-blue-500" />
                <span>Active Evacuation Vector: Current Position ➔ Assigned Safe Haven</span>
              </span>
              <span className="font-mono text-slate-400">
                Route Distance: <strong className="text-blue-500">{distanceKm} km</strong>
              </span>
            </div>

            <MapWrapper
              center={userCoordinates}
              zoom={12}
              userLocation={userCoordinates}
              routeDestination={nearestShelter.coordinates}
              shelters={[nearestShelter]}
              habitations={mockHabitations}
              height="520px"
            />
          </div>

          {/* Quick Simulation Presets */}
          <div className="glass-panel p-4 rounded-2xl">
            <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Test Relocation Routing From High-Risk Habitations:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {mockHabitations.slice(0, 3).map((hab) => (
                <button
                  key={hab.id}
                  onClick={() => {
                    setSelectedHabitation(hab);
                    setUserCoordinates(hab.coordinates);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    userCoordinates[0] === hab.coordinates[0]
                      ? 'border-blue-500 bg-blue-500/10 font-bold text-blue-600 dark:text-blue-400'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="font-bold truncate">{hab.name}</div>
                  <div className="text-[10px] text-slate-400">
                    {hab.district} • Pop: {hab.population}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Allocation & Carrying Capacity Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          {/* Assigned Evacuation Shelter Card */}
          <div className="glass-panel p-5 rounded-2xl border-blue-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div>
                <span className="text-[10px] font-mono bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold">
                  ASSIGNED SAFE HAVEN
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                  {nearestShelter.name}
                </h3>
              </div>
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
                <Building2 className="w-5 h-5" />
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400">
              {nearestShelter.address}
            </div>

            {/* Travel Time & Transit Selector */}
            <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-500 dark:text-slate-400">Transit Mode:</span>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => setEvacuationMode('foot')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                      evacuationMode === 'foot'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Footprints className="w-3.5 h-3.5" />
                    <span>On Foot</span>
                  </button>
                  <button
                    onClick={() => setEvacuationMode('vehicle')}
                    className={`p-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1 ${
                      evacuationMode === 'vehicle'
                        ? 'bg-blue-600 text-white shadow'
                        : 'text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    <Truck className="w-3.5 h-3.5" />
                    <span>4x4 Transit</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-1">
                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Navigation className="w-3 h-3 text-blue-500" />
                    <span>Distance</span>
                  </div>
                  <div className="text-sm font-black font-mono text-slate-900 dark:text-white mt-0.5">
                    {distanceKm} km
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                    <Clock className="w-3 h-3 text-emerald-500" />
                    <span>Estimated ETA</span>
                  </div>
                  <div className="text-sm font-black font-mono text-emerald-500 mt-0.5">
                    ~{etaMins} mins
                  </div>
                </div>
              </div>
            </div>

            {/* Carrying Capacity Gauge */}
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-700 dark:text-slate-200 flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5 text-purple-500" />
                  <span>Shelter Carrying Capacity Stress</span>
                </span>
                <span
                  className={`font-mono font-black ${
                    stressIndex >= 90
                      ? 'text-red-500'
                      : stressIndex >= 70
                      ? 'text-amber-500'
                      : 'text-emerald-500'
                  }`}
                >
                  {stressIndex}% Stress
                </span>
              </div>

              <div className="w-full bg-slate-200 dark:bg-slate-700 h-3 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    stressIndex >= 90
                      ? 'bg-red-500'
                      : stressIndex >= 70
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{ width: `${stressIndex}%` }}
                ></div>
              </div>

              <div className="grid grid-cols-3 gap-1 text-[10px] text-center font-mono bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                <div>
                  <div className="text-slate-400">Total Cap</div>
                  <div className="font-bold text-slate-700 dark:text-slate-200">
                    {shelterCapacity.toLocaleString()}
                  </div>
                </div>
                <div>
                  <div className="text-slate-400">Allocated</div>
                  <div className="font-bold text-blue-500">{shelterAllocated.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-slate-400">Remaining</div>
                  <div className="font-bold text-emerald-500">{remainingBuffer.toLocaleString()}</div>
                </div>
              </div>
            </div>

            {/* Emergency Supplies Status Preview */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2 text-xs">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Shelter Resilience & Reserves:
              </div>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Potable Water: {nearestShelter.supplies.waterDays} Days</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Rations: {nearestShelter.supplies.foodRationDays} Days</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  <span>Genset: {nearestShelter.supplies.dieselGenHours}h Diesel</span>
                </div>
                <div className="flex items-center space-x-1.5 text-slate-600 dark:text-slate-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  <span>50-Yr Score: {nearestShelter.resilienceScore}/100</span>
                </div>
              </div>
            </div>

            {/* Trigger SOS from here */}
            <button
              onClick={() => openSosModal('citizen')}
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-red-600/20"
            >
              <AlertTriangle className="w-4 h-4 animate-pulse" />
              <span>Broadcast Evacuation SOS If Trapped</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RelocationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col items-center justify-center space-y-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <div className="text-sm font-semibold text-slate-600 dark:text-slate-300">
            Initializing Relocation Hub & Geolocation Engine...
          </div>
        </div>
      }
    >
      <RelocationContent />
    </Suspense>
  );
}
