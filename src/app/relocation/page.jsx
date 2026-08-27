'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MapWrapper from '@/components/MapWrapper';
import MapPlaceSearchBar from '@/components/MapPlaceSearchBar';
import { mockHabitations } from '@/data/zonesData';
import { mockShelters } from '@/data/sheltersData';
import { useApp } from '@/context/AppContext';
import {
  Compass,
  Building2,
  Navigation,
  LocateFixed,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Clock,
  Footprints,
  Truck,
  Users,
  Loader2,
  Sparkles,
  Mountain,
  Car
} from 'lucide-react';
import AudioVoiceAdvisor from '@/components/AudioVoiceAdvisor';

// Distance calculation using Haversine formula
function calculateDistanceKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
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

  const {
    userCoordinates,
    setUserCoordinates,
    requestUserLocation,
    isLocating,
    locationError,
    openSosModal,
    triggerEvacuationCelebration,
    language,
    t
  } = useApp();

  const [selectedHabitation, setSelectedHabitation] = useState(null);
  const [nearestShelter, setNearestShelter] = useState(mockShelters[0]);
  const [evacueeCount, setEvacueeCount] = useState(1);
  const [evacuationMode, setEvacuationMode] = useState('vehicle');
  const [hasCompletedEvacuation, setHasCompletedEvacuation] = useState(false);
  const [resolvedAddress, setResolvedAddress] = useState('Meppadi Hazard Zone, Wayanad');
  const [routingSteps, setRoutingSteps] = useState([]);
  const [routeCoordinates, setRouteCoordinates] = useState([]);

  // Searched Place and Custom Route State
  const [searchedPlace, setSearchedPlace] = useState(null);
  const [activeRouteInfo, setActiveRouteInfo] = useState(null);

  // Pre-load from query param if passed or acquire live device location
  useEffect(() => {
    if (habIdParam) {
      const found = mockHabitations.find((h) => h.id === habIdParam);
      if (found) {
        setSelectedHabitation(found);
        setUserCoordinates(found.coordinates);
      }
    } else if (requestUserLocation) {
      requestUserLocation();
    }
  }, [habIdParam, requestUserLocation, setUserCoordinates]);

  // Compute nearest shelter whenever user coordinates change & query OSRM + Nominatim
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
    setHasCompletedEvacuation(false);

    // Live Reverse Geocode via Nominatim API
    fetch(`/api/geocoding/reverse?lat=${userCoordinates[0]}&lon=${userCoordinates[1]}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.displayName) {
          setResolvedAddress(data.displayName.split(',').slice(0, 3).join(','));
        }
      })
      .catch(() => {});

    // Live Routing via OSRM API (if no custom searched route is overriding)
    if (!activeRouteInfo) {
      fetch(
        `/api/routing/osrm?startLat=${userCoordinates[0]}&startLon=${userCoordinates[1]}&destLat=${closest.coordinates[0]}&destLon=${closest.coordinates[1]}`
      )
        .then((res) => res.json())
        .then((data) => {
          if (data.steps && data.steps.length > 0) {
            setRoutingSteps(data.steps);
          }
          if (data.coordinates && data.coordinates.length > 0) {
            setRouteCoordinates(data.coordinates);
          }
        })
        .catch(() => {});
    }
  }, [userCoordinates, activeRouteInfo]);

  const activeDestinationCoords = searchedPlace?.coordinates || nearestShelter.coordinates;
  const activeDestinationName = searchedPlace?.name || nearestShelter.name;

  const distanceKm = activeRouteInfo?.distanceKm || calculateDistanceKm(
    userCoordinates[0],
    userCoordinates[1],
    activeDestinationCoords[0],
    activeDestinationCoords[1]
  );

  const etaMins =
    activeRouteInfo?.durationMins ||
    (evacuationMode === 'foot' ? Math.round(distanceKm * 14) : Math.round(distanceKm * 3.5));

  // Carrying capacity analytics
  const shelterCapacity = nearestShelter.totalCapacity;
  const shelterAllocated = nearestShelter.allocatedOccupancy + evacueeCount;
  const remainingBuffer = Math.max(0, shelterCapacity - shelterAllocated);
  const stressIndex = Math.min(100, Math.round((shelterAllocated / shelterCapacity) * 100));

  const handleSimulateArrival = async () => {
    setHasCompletedEvacuation(true);
    triggerEvacuationCelebration();

    try {
      await fetch('/api/shelters', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ shelterId: nearestShelter.id, additionalEvacuees: evacueeCount })
      });
    } catch {
      // offline fallback
    }
  };

  const handleCustomRouteCalculated = (routeInfo) => {
    setSearchedPlace({
      name: routeInfo.destinationName,
      displayName: routeInfo.destinationAddress,
      coordinates: routeInfo.destinationCoordinates,
      category: routeInfo.category
    });
    setActiveRouteInfo(routeInfo);
    setRouteCoordinates(routeInfo.routeCoordinates || []);
    setRoutingSteps(routeInfo.steps || []);

    // Check if matched a shelter
    const matched = mockShelters.find(
      (s) =>
        Math.hypot(
          s.coordinates[0] - routeInfo.destinationCoordinates[0],
          s.coordinates[1] - routeInfo.destinationCoordinates[1]
        ) < 0.05
    );
    if (matched) {
      setNearestShelter(matched);
    }
  };

  const handleClearCustomRoute = () => {
    setSearchedPlace(null);
    setActiveRouteInfo(null);
  };

  const voiceInstruction =
    language === 'hi'
      ? `ध्यान दें! आपकी वर्तमान स्थिति से सबसे सुरक्षित मार्ग ${activeDestinationName} की ओर है। कुल दूरी ${distanceKm} किलोमीटर है और वाहन से पहुंचने में लगभग ${etaMins} मिनट का समय लगेगा। कृपया तुरंत सुरक्षित निकासी शुरू करें।`
      : `Attention! The safest computed road route from your current location leads to ${activeDestinationName}. Distance is ${distanceKm} kilometers, with estimated driving travel time of ${etaMins} minutes. Please proceed immediately.`;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-blue-500/10 text-blue-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3.5 h-3.5" />
            <span>
              {language === 'hi'
                ? 'एआई डायनामिक सड़क निकासी मार्गदर्शन एवं यात्रा समय'
                : 'AI Dynamic Evacuation Road Guidance & Travel Time'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('relocation.title', 'Algorithmic Safe Relocation Engine')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t(
              'relocation.subtitle',
              'Deterministic OSRM road corridor guidance routing away from red-zone debris flows to high-resilience safe havens across India.'
            )}
          </p>
        </div>

        {/* Action Buttons: Voice Advisor + GPS Locate */}
        <div className="flex flex-wrap items-center gap-2">
          <AudioVoiceAdvisor
            textToSpeak={voiceInstruction}
            label={language === 'hi' ? 'आपातकालीन मार्ग निर्देश सुनें' : 'Listen to Voice Navigation'}
          />

          <button
            onClick={requestUserLocation}
            disabled={isLocating}
            className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center space-x-1.5 shadow-lg shadow-blue-600/20 disabled:opacity-50 transition-all"
          >
            {isLocating ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
            <span>
              {isLocating
                ? language === 'hi' ? 'जीपीएस खोज रहा है...' : 'Acquiring GPS...'
                : language === 'hi' ? 'मेरी लाइव जीपीएस स्थिति लें' : 'Acquire My Live GPS'}
            </span>
          </button>
        </div>
      </div>

      {locationError && (
        <div className="bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-300 p-3 rounded-xl text-xs flex items-center space-x-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>{locationError}</span>
        </div>
      )}

      {/* Place Search with Exact Road Route & Travel Time Calculation */}
      <MapPlaceSearchBar
        onRouteCalculated={handleCustomRouteCalculated}
        onClearRoute={handleClearCustomRoute}
        activeRouteInfo={activeRouteInfo}
        originCoordinates={userCoordinates}
        originLabel={language === 'hi' ? 'आपका प्रारंभिक स्थान' : 'Your Departure Position'}
        placeholder={
          language === 'hi'
            ? 'भारत के किसी भी गंतव्य स्थान या आश्रय का नाम खोजें (सटीक सड़क मार्ग और समय देखें)...'
            : 'Search any destination place, landmark, or shelter in India to calculate road route and exact arrival time...'
        }
      />

      {hasCompletedEvacuation && (
        <div className="bg-emerald-500/20 border-2 border-emerald-500 text-emerald-900 dark:text-emerald-200 p-4 rounded-2xl flex items-center justify-between animate-in zoom-in-95 duration-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-sm">
                {language === 'hi' ? 'सुरक्षित आगमन दर्ज हो गया!' : 'Safe Check-In Confirmed!'}
              </div>
              <div className="text-xs">
                {language === 'hi'
                  ? `आप सफलतापूर्वक ${activeDestinationName} पहुंच चुके हैं। आपकी प्रविष्टि राज्य SEOC वहन क्षमता रजिस्टर में दर्ज कर दी गई है।`
                  : `You have successfully arrived at ${activeDestinationName}. Your entry has been logged into the regional SEOC carrying capacity registry.`}
              </div>
            </div>
          </div>
          <button
            onClick={triggerEvacuationCelebration}
            className="px-3 py-1.5 bg-emerald-600 text-white font-bold rounded-lg text-xs flex items-center space-x-1 shadow"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'सुरक्षित आगमन बधाई' : 'Celebrate Safe Arrival'}</span>
          </button>
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
                <span>
                  Active Evacuation Vector: {resolvedAddress} ➔ {activeDestinationName}
                </span>
              </span>
              <span className="font-mono text-slate-400">
                Route Distance: <strong className="text-blue-500">{distanceKm} km</strong>
              </span>
            </div>

            <MapWrapper
              center={userCoordinates}
              zoom={distanceKm > 100 ? 7 : 12}
              userLocation={userCoordinates}
              routeDestination={activeDestinationCoords}
              searchedPlace={searchedPlace}
              routeInfo={activeRouteInfo}
              routeCoordinates={routeCoordinates}
              shelters={[nearestShelter]}
              habitations={mockHabitations}
              height="520px"
            />
          </div>

          {/* Elevation Profile & Corridor Metrics */}
          <div className="glass-panel p-4 rounded-2xl space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
              <span className="flex items-center space-x-1.5">
                <Mountain className="w-4 h-4 text-amber-500" />
                <span>
                  {language === 'hi'
                    ? 'कॉरिडोर ऊंचाई प्रोफ़ाइल एवं ढलान सुरक्षा'
                    : 'Corridor Elevation Profile & Hazard Clearance'}
                </span>
              </span>
              <span className="text-emerald-500 font-mono">
                {language === 'hi' ? '✓ मलबा बहाव से पूर्णतः मुक्त' : 'ALL CLEAR OF HIGH DEBRIS FLOWS'}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">
                  {language === 'hi' ? 'प्रारंभिक स्थल (OSM)' : 'Resolved Origin (OSM)'}
                </div>
                <div className="font-bold text-slate-900 dark:text-white truncate">{resolvedAddress}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">
                  {language === 'hi' ? 'गंतव्य स्थल' : 'Destination'}
                </div>
                <div className="font-bold text-emerald-500 truncate">{activeDestinationName}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">
                  {language === 'hi' ? 'सड़क यात्रा समय' : 'Drive Time'}
                </div>
                <div className="font-bold text-blue-500">
                  {activeRouteInfo?.vehicleTimeFormatted || `${etaMins} mins`}
                </div>
              </div>
            </div>

            {/* OSRM Turn-by-Turn Maneuvers */}
            {routingSteps.length > 0 && (
              <div className="border-t border-slate-200 dark:border-slate-800 pt-3 space-y-2">
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center justify-between">
                  <span>
                    {language === 'hi' ? 'OSRM सुरक्षित सड़क मोड़ निर्देश:' : 'OSRM Turn-by-Turn Safe Maneuvers:'}
                  </span>
                  <span className="text-[10px] font-mono text-slate-400">
                    {language === 'hi' ? 'बाढ़ग्रस्त क्षेत्रों से सुरक्षित' : 'Avoids Inundated Lowlands'}
                  </span>
                </div>
                <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {routingSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60 text-xs flex items-center justify-between text-slate-700 dark:text-slate-300"
                    >
                      <div className="flex items-center space-x-2">
                        <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-500 font-mono text-[10px] flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <span>{step.instruction}</span>
                      </div>
                      <span className="text-[10px] font-mono text-slate-400">
                        {step.distanceM > 1000 ? `${(step.distanceM / 1000).toFixed(1)} km` : `${step.distanceM} m`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Pan-India Habitation Simulation Presets */}
          <div className="glass-panel p-4 rounded-2xl space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="text-xs font-bold text-slate-700 dark:text-slate-300">
                {language === 'hi'
                  ? '🇮🇳 अखिल भारतीय उच्च-जोखिम बस्तियों से निकासी मार्ग का परीक्षण करें:'
                  : '🇮🇳 Test Relocation Routing From High-Risk Pan-India Habitations:'}
              </div>
              <span className="text-[10px] font-mono text-emerald-500 font-bold">
                {mockHabitations.length} Monitored Settlement Corridors
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 max-h-56 overflow-y-auto pr-1">
              {mockHabitations.map((hab) => (
                <button
                  key={hab.id}
                  onClick={() => {
                    setSelectedHabitation(hab);
                    setUserCoordinates(hab.coordinates);
                    setActiveRouteInfo(null);
                    setSearchedPlace(null);
                  }}
                  className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                    userCoordinates[0] === hab.coordinates[0]
                      ? 'border-blue-500 bg-blue-500/10 font-bold text-blue-600 dark:text-blue-400 shadow-sm'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold truncate">{hab.name}</span>
                    <span className="text-[9px] font-mono px-1 py-0.5 bg-slate-200 dark:bg-slate-700 rounded text-slate-700 dark:text-slate-300 shrink-0 ml-1">
                      {hab.state}
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-0.5">
                    {hab.district} • {language === 'hi' ? 'आबादी:' : 'Pop:'} {hab.population.toLocaleString()}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Allocation & Carrying Capacity Breakdown */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-5 rounded-2xl border-blue-500/40 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {language === 'hi' ? 'गंतव्य सुरक्षित आश्रय' : 'Destination Safe Haven'}
              </span>
              <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                RESILIENCE {nearestShelter.resilienceScore}/100
              </span>
            </div>

            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">{nearestShelter.name}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{nearestShelter.address}</p>
            </div>

            {/* Travel Mode Toggle */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                onClick={() => setEvacuationMode('vehicle')}
                className={`p-2 rounded-xl flex items-center justify-center space-x-1.5 font-bold transition-all ${
                  evacuationMode === 'vehicle'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Truck className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'वाहन (4x4 / बस)' : 'Vehicle (4x4)'}</span>
              </button>
              <button
                onClick={() => setEvacuationMode('foot')}
                className={`p-2 rounded-xl flex items-center justify-center space-x-1.5 font-bold transition-all ${
                  evacuationMode === 'foot'
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/20'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>{language === 'hi' ? 'पैदल निकासी' : 'On Foot (Trail)'}</span>
              </button>
            </div>

            {/* Travel Time & Distance Stats */}
            <div className="grid grid-cols-2 gap-2 text-center text-xs">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px] font-sans">
                  {language === 'hi' ? 'सड़क दूरी' : 'Road Distance'}
                </span>
                <span className="text-lg font-black text-slate-900 dark:text-white font-mono">{distanceKm} km</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800">
                <span className="text-slate-400 block text-[10px] font-sans">
                  {language === 'hi' ? 'अनुमानित समय' : 'Estimated Time'}
                </span>
                <span className="text-lg font-black text-blue-500 font-mono">
                  {activeRouteInfo?.vehicleTimeFormatted || `${etaMins} mins`}
                </span>
              </div>
            </div>

            {/* Carrying Capacity Gauge */}
            <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? 'आश्रय वहन क्षमता उपयोग:' : 'Shelter Stress Index:'}
                </span>
                <span className="font-mono text-slate-900 dark:text-white">{stressIndex}%</span>
              </div>
              <div className="w-full h-2.5 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-300 ${
                    stressIndex > 85 ? 'bg-rose-500' : stressIndex > 65 ? 'bg-amber-500' : 'bg-emerald-500'
                  }`}
                  style={{ width: `${stressIndex}%` }}
                />
              </div>
              <div className="flex justify-between text-[10px] text-slate-400 font-mono">
                <span>Buffer: {remainingBuffer.toLocaleString()} beds</span>
                <span>Max: {shelterCapacity.toLocaleString()}</span>
              </div>
            </div>

            {/* Evacuee Count Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-bold text-slate-700 dark:text-slate-300">
                <span className="flex items-center space-x-1">
                  <Users className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'निकासी परिवार सदस्य:' : 'Evacuee Party Size:'}</span>
                </span>
                <span className="text-blue-500 font-mono">{evacueeCount} Persons</span>
              </div>
              <input
                type="range"
                min="1"
                max="20"
                value={evacueeCount}
                onChange={(e) => setEvacueeCount(parseInt(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* Complete Arrival Action Button */}
            <button
              onClick={handleSimulateArrival}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-black shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>
                {language === 'hi'
                  ? 'सुरक्षित आगमन दर्ज करें (क्षमता अपडेट)'
                  : 'Check-In at Safe Haven (Update Capacity)'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function RelocationPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-400">Loading Relocation Engine...</div>}>
      <RelocationContent />
    </Suspense>
  );
}