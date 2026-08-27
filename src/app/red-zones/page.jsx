'use client';

import React, { useState } from 'react';
import MapWrapper from '@/components/MapWrapper';
import MapPlaceSearchBar from '@/components/MapPlaceSearchBar';
import { mockHabitations, mockHazardZones } from '@/data/zonesData';
import { useApp } from '@/context/AppContext';
import {
  MapPin,
  Filter,
  Activity,
  Layers,
  CloudRain,
  Mountain,
  Compass,
  ArrowRight,
  Navigation,
  ShieldCheck,
  Loader2
} from 'lucide-react';
import Link from 'next/link';

export default function RedZonesPage() {
  const { language, userCoordinates, requestUserLocation, t } = useApp();
  const [selectedHazard, setSelectedHazard] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');
  const [selectedHabitation, setSelectedHabitation] = useState(mockHabitations[0]);
  const [mapCenter, setMapCenter] = useState([11.545, 76.135]); // Wayanad focus
  const [zoomLevel, setZoomLevel] = useState(11);

  // Place Search and Road Route State
  const [searchedPlace, setSearchedPlace] = useState(null);
  const [activeRouteInfo, setActiveRouteInfo] = useState(null);
  const [isCalculatingRoute, setIsCalculatingRoute] = useState(false);

  const handleShowRoadRouteToHabitation = async (hab) => {
    if (!hab) return;
    setIsCalculatingRoute(true);
    try {
      let originCoords = userCoordinates;
      if (requestUserLocation) {
        const freshCoords = await requestUserLocation();
        if (freshCoords && Array.isArray(freshCoords) && freshCoords.length === 2) {
          originCoords = freshCoords;
        }
      }

      const res = await fetch(
        `/api/routing/osrm?startLat=${originCoords[0]}&startLon=${originCoords[1]}&destLat=${hab.coordinates[0]}&destLon=${hab.coordinates[1]}`
      );
      const data = await res.json();

      const routeInfo = {
        destinationName: hab.name,
        destinationAddress: `${hab.name}, ${hab.district}, ${hab.state}`,
        destinationCoordinates: hab.coordinates,
        category: 'HABITATION',
        state: hab.state,
        distanceKm: data.distanceKm || 0,
        durationMins: data.durationMins || 0,
        walkingDurationMins: data.walkingDurationMins || 0,
        vehicleTimeFormatted: data.vehicleTimeFormatted || `${data.durationMins || 0}m`,
        walkingTimeFormatted: data.walkingTimeFormatted || `${data.walkingDurationMins || 0}m`,
        routeCoordinates: data.coordinates || [originCoords, hab.coordinates],
        steps: data.steps || [],
        originCoordinates: originCoords,
        originLabel: language === 'hi' ? 'आपका वर्तमान जीपीएस स्थान' : 'Your Present GPS Location'
      };

      setSearchedPlace({
        name: hab.name,
        displayName: `${hab.name}, ${hab.district}, ${hab.state}`,
        coordinates: hab.coordinates,
        category: 'HABITATION'
      });
      setActiveRouteInfo(routeInfo);
      setMapCenter(hab.coordinates);
      setZoomLevel(11);
    } catch (err) {
      console.error('Failed to calculate road route to habitation:', err);
    } finally {
      setIsCalculatingRoute(false);
    }
  };

  // Filter logic
  const filteredZones = mockHazardZones.filter((zone) => {
    const matchesHazard = selectedHazard === 'all' || zone.hazard === selectedHazard;
    const matchesRisk = selectedRisk === 'all' || zone.riskLevel === selectedRisk;
    return matchesHazard && matchesRisk;
  });

  const filteredHabitations = mockHabitations.filter((hab) => {
    const matchesHazard = selectedHazard === 'all' || hab.hazardType === selectedHazard;
    const matchesRisk = selectedRisk === 'all' || hab.riskLevel === selectedRisk;
    return matchesHazard && matchesRisk;
  });

  const handleHabitationSelect = (hab) => {
    setSelectedHabitation(hab);
    setMapCenter(hab.coordinates);
    setZoomLevel(13);
  };

  const handleRouteCalculated = (routeInfo) => {
    setSearchedPlace({
      name: routeInfo.destinationName,
      displayName: routeInfo.destinationAddress,
      coordinates: routeInfo.destinationCoordinates,
      category: routeInfo.category
    });
    setActiveRouteInfo(routeInfo);
    setMapCenter(routeInfo.destinationCoordinates);
    setZoomLevel(11);
  };

  const handleClearRoute = () => {
    setSearchedPlace(null);
    setActiveRouteInfo(null);
  };

  const hazardLabels = {
    all: language === 'hi' ? 'सभी' : 'all',
    landslide: language === 'hi' ? 'भूस्खलन' : 'landslide',
    flood: language === 'hi' ? 'बाढ़' : 'flood',
    earthquake: language === 'hi' ? 'भूकंप' : 'earthquake',
    cyclone: language === 'hi' ? 'चक्रवात' : 'cyclone'
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'जीआईएस बहु-आपदा स्थानिक विश्लेषण' : 'GIS Multi-Hazard Spatial Engine'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {language === 'hi' ? 'आपदा रेड-ज़ोन पहचान एवं निगरानी' : 'Hazard Red-Zone Identification'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'hi'
              ? 'वास्तविक समय भू-स्थानिक वर्गीकरण: रेड (अति-संवेदनशील), ऑरेंज (मध्यम), और ग्रीन (सुरक्षित आश्रय) ज़ोन।'
              : 'Real-time geospatial classification: Red (Critical Risk), Orange (Moderate), and Green (Safe Haven) zones.'}
          </p>
        </div>

        {/* Quick Legend */}
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <span className="flex items-center space-x-1.5 text-red-500">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-ping-slow"></span>
            <span>{language === 'hi' ? 'रेड (>75% उच्च जोखिम)' : 'Red (>75% High Risk)'}</span>
          </span>
          <span className="flex items-center space-x-1.5 text-amber-500">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span>{language === 'hi' ? 'ऑरेंज (40-75% मध्यम)' : 'Orange (40-75% Mod)'}</span>
          </span>
          <span className="flex items-center space-x-1.5 text-emerald-500">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span>{language === 'hi' ? 'ग्रीन (<40% सुरक्षित)' : 'Green (<40% Safe)'}</span>
          </span>
        </div>
      </div>

      {/* Place Search & Road Route ETA Bar */}
      <MapPlaceSearchBar
        onRouteCalculated={handleRouteCalculated}
        onClearRoute={handleClearRoute}
        activeRouteInfo={activeRouteInfo}
        originCoordinates={userCoordinates}
        originLabel={language === 'hi' ? 'आपका जीपीएस स्थान' : 'Your GPS Location'}
        placeholder={
          language === 'hi'
            ? 'मानचित्र पर किसी भी स्थान का नाम खोजें (सड़क मार्ग और सटीक यात्रा समय देखें)...'
            : 'Search any place in India to show the safe road route and exact time required to reach...'
        }
      />

      {/* Hazard Type & Risk Level Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Hazard Type Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0 text-xs">
          <span className="font-bold text-slate-400 shrink-0">
            <Filter className="w-3.5 h-3.5 inline mr-1" />
            {language === 'hi' ? 'आपदा प्रकार:' : 'Hazard:'}
          </span>
          {['all', 'landslide', 'flood', 'earthquake', 'cyclone'].map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHazard(h)}
              className={`px-3 py-1.5 rounded-xl font-bold capitalize shrink-0 transition-all ${
                selectedHazard === h
                  ? 'bg-red-600 text-white shadow-md shadow-red-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {hazardLabels[h]}
            </button>
          ))}
        </div>

        {/* Risk Level Filters */}
        <div className="flex items-center space-x-1.5 text-xs">
          <span className="font-bold text-slate-400 shrink-0">{language === 'hi' ? 'जोखिम स्तर:' : 'Risk Level:'}</span>
          {['all', 'RED', 'ORANGE', 'GREEN'].map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRisk(r)}
              className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
                selectedRisk === r
                  ? r === 'RED'
                    ? 'bg-red-600 text-white shadow-md shadow-red-600/30'
                    : r === 'ORANGE'
                    ? 'bg-amber-600 text-white shadow-md shadow-amber-600/30'
                    : r === 'GREEN'
                    ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
                    : 'bg-slate-900 text-white dark:bg-white dark:text-slate-900'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {r === 'all'
                ? language === 'hi' ? 'सभी' : 'all'
                : r === 'RED'
                ? language === 'hi' ? 'रेड (गंभीर)' : 'RED'
                : r === 'ORANGE'
                ? language === 'hi' ? 'ऑरेंज (मध्यम)' : 'ORANGE'
                : language === 'hi' ? 'ग्रीन (सुरक्षित)' : 'GREEN'}
            </button>
          ))}
        </div>
      </div>

      {/* Main Map & Telemetry Split Screen */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: GIS Map Viewport */}
        <div className="lg:col-span-8 space-y-4">
          <div className="relative">
            <MapWrapper
              center={mapCenter}
              zoom={zoomLevel}
              zones={filteredZones}
              habitations={filteredHabitations}
              selectedHabitationId={selectedHabitation?.id}
              onSelectHabitation={handleHabitationSelect}
              userLocation={userCoordinates}
              searchedPlace={searchedPlace}
              routeInfo={activeRouteInfo}
              routeCoordinates={activeRouteInfo?.routeCoordinates}
              height="600px"
            />
          </div>

          {/* Quick Zone Focus Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
            <span className="font-bold text-slate-400 shrink-0">
              {language === 'hi' ? '🇮🇳 त्वरित राज्य हॉटस्पॉट:' : '🇮🇳 Jump To State Hotspot:'}
            </span>
            <button
              onClick={() => {
                setMapCenter([22.5937, 78.9629]);
                setZoomLevel(5);
              }}
              className="px-2.5 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition-colors shrink-0 font-bold shadow-sm"
            >
              {language === 'hi' ? '🇮🇳 संपूर्ण भारत' : '🇮🇳 All India View'}
            </button>
            <button
              onClick={() => {
                setMapCenter([11.545, 76.135]);
                setZoomLevel(12);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              {language === 'hi' ? 'वायनाड (केरल)' : 'Wayanad (Kerala)'}
            </button>
            <button
              onClick={() => {
                setMapCenter([30.556, 79.566]);
                setZoomLevel(13);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              {language === 'hi' ? 'जोशीमठ (उत्तराखंड)' : 'Joshimath (Uttarakhand)'}
            </button>
            <button
              onClick={() => {
                setMapCenter([32.225, 76.33]);
                setZoomLevel(12);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              {language === 'hi' ? 'धर्मशाला (हिमाचल)' : 'Dharamshala (HP)'}
            </button>
            <button
              onClick={() => {
                setMapCenter([26.587, 93.361]);
                setZoomLevel(11);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              {language === 'hi' ? 'काजीरंगा / ब्रह्मपुत्र (असम)' : 'Kaziranga (Assam)'}
            </button>
            <button
              onClick={() => {
                setMapCenter([26.126, 86.605]);
                setZoomLevel(11);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              {language === 'hi' ? 'कोसी नदी (बिहार)' : 'Kosi Basin (Bihar)'}
            </button>
            <button
              onClick={() => {
                setMapCenter([19.813, 85.831]);
                setZoomLevel(11);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              {language === 'hi' ? 'पुरी तट (ओडिशा)' : 'Puri Coast (Odisha)'}
            </button>
            <button
              onClick={() => {
                setMapCenter([18.083, 73.416]);
                setZoomLevel(12);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              {language === 'hi' ? 'महाड (महाराष्ट्र)' : 'Mahad (Maharashtra)'}
            </button>
            <button
              onClick={() => {
                setMapCenter([23.35, 69.8]);
                setZoomLevel(10);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              {language === 'hi' ? 'भुज कच्छ (गुजरात)' : 'Bhuj Kutch (Gujarat)'}
            </button>
            <button
              onClick={() => {
                setMapCenter([34.07, 74.81]);
                setZoomLevel(12);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              {language === 'hi' ? 'श्रीनगर (जम्मू-कश्मीर)' : 'Srinagar (J&K)'}
            </button>
          </div>
        </div>

        {/* Right: Selected Habitation / Zone Telemetry Drawer */}
        <div className="lg:col-span-4 space-y-4">
          {selectedHabitation ? (
            <div className="glass-panel p-5 rounded-2xl border-red-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] font-mono bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded font-bold">
                      {selectedHabitation.id}
                    </span>
                    <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                      {selectedHabitation.state}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {selectedHabitation.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedHabitation.district}, {selectedHabitation.state}
                  </div>
                </div>

                <div className="text-right">
                  <span
                    className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                      selectedHabitation.riskLevel === 'RED'
                        ? 'bg-red-500 text-white animate-pulse'
                        : selectedHabitation.riskLevel === 'ORANGE'
                        ? 'bg-amber-500 text-white'
                        : 'bg-emerald-500 text-white'
                    }`}
                  >
                    {selectedHabitation.riskLevel} ALERT
                  </span>
                  <div className="text-xs font-mono font-bold mt-1 text-slate-500">
                    Score: {selectedHabitation.vulnerabilityScore}/100
                  </div>
                </div>
              </div>

              {/* Sensor Telemetry Stream */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
                  <span>{language === 'hi' ? 'भू-तकनीकी सेंसर टेलीमेट्री:' : 'Geotechnical Telemetry:'}</span>
                  <span className="text-[10px] text-emerald-500 font-mono font-normal">
                    ● {selectedHabitation.telemetry.lastUpdated}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">
                      {language === 'hi' ? 'वर्षा दर' : 'Rainfall Rate'}
                    </span>
                    <span className="font-mono font-black text-blue-500">
                      {selectedHabitation.telemetry.rainfallMmHr} mm/hr
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">
                      {language === 'hi' ? 'मिट्टी संतृप्ति' : 'Soil Saturation'}
                    </span>
                    <span className="font-mono font-black text-rose-500">
                      {selectedHabitation.telemetry.soilSaturationPct}%
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">
                      {language === 'hi' ? 'छिद्र जल दबाव' : 'Pore-Water Press'}
                    </span>
                    <span className="font-mono font-bold text-purple-500">
                      {selectedHabitation.telemetry.poreWaterKPa} kPa
                    </span>
                  </div>
                  <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80">
                    <span className="text-slate-400 block text-[10px]">
                      {language === 'hi' ? 'ढलान विस्थापन' : 'Displacement'}
                    </span>
                    <span className="font-mono font-bold text-amber-500">
                      {selectedHabitation.telemetry.slopeDisplacementMm} mm
                    </span>
                  </div>
                </div>
              </div>

              {/* Recommended Immediate Actions */}
              <div className="space-y-1.5">
                <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  {language === 'hi' ? 'त्वरित निर्देश:' : 'Recommended Protocol:'}
                </div>
                <ul className="text-xs space-y-1 text-slate-600 dark:text-slate-300">
                  {selectedHabitation.recommendedActions.map((act, i) => (
                    <li key={i} className="flex items-start space-x-1.5">
                      <span className="text-red-500 font-bold shrink-0">▸</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Navigation Action Buttons */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex gap-2">
                <button
                  onClick={() => handleShowRoadRouteToHabitation(selectedHabitation)}
                  disabled={isCalculatingRoute}
                  className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1.5 shadow-md shadow-blue-600/20 transition-all"
                >
                  {isCalculatingRoute ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Navigation className="w-3.5 h-3.5" />
                  )}
                  <span>
                    {isCalculatingRoute
                      ? language === 'hi' ? 'मार्ग खोज रहा है...' : 'Calculating Route...'
                      : language === 'hi' ? 'सड़क मार्ग देखें' : 'Show Road Route'}
                  </span>
                </button>

                <Link
                  href={`/relocation?habId=${selectedHabitation.id}`}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold text-center flex items-center justify-center space-x-1 shadow-md shadow-red-600/20"
                >
                  <span>{language === 'hi' ? 'पूर्ण निकासी' : 'Evacuate Now'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="glass-panel p-6 rounded-2xl text-center text-slate-400 text-xs">
              {language === 'hi' ? 'सेंसर विवरण देखने के लिए मानचित्र पर किसी बस्ती पर क्लिक करें।' : 'Click any habitation marker on the map to view sensor telemetry.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}