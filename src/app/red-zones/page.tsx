'use client';

import React, { useState } from 'react';
import MapWrapper from '@/components/MapWrapper';
import { mockHabitations, mockHazardZones } from '@/data/zonesData';
import { Habitation, HazardType, HazardZone, RiskLevel } from '@/types';
import {
  MapPin,
  Filter,
  ShieldAlert,
  AlertTriangle,
  Activity,
  Layers,
  CloudRain,
  Mountain,
  Compass,
  ArrowRight,
  Info,
} from 'lucide-react';
import Link from 'next/link';

export default function RedZonesPage() {
  const [selectedHazard, setSelectedHazard] = useState<HazardType | 'all'>('all');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all');
  const [selectedHabitation, setSelectedHabitation] = useState<Habitation | null>(mockHabitations[0]);
  const [mapCenter, setMapCenter] = useState<[number, number]>([11.545, 76.135]); // Wayanad focus
  const [zoomLevel, setZoomLevel] = useState<number>(11);

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

  const handleHabitationSelect = (hab: Habitation) => {
    setSelectedHabitation(hab);
    setMapCenter(hab.coordinates);
    setZoomLevel(13);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-red-500/10 text-red-500 text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>GIS Multi-Hazard Spatial Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Hazard Red-Zone Identification
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time geospatial classification: Red (Critical Risk), Orange (Moderate), and Green (Safe Haven) zones.
          </p>
        </div>

        {/* Quick Legend */}
        <div className="flex items-center space-x-3 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold">
          <span className="flex items-center space-x-1.5 text-red-500">
            <span className="w-3 h-3 rounded-full bg-red-500 inline-block animate-ping-slow"></span>
            <span>Red (&gt;75% High Risk)</span>
          </span>
          <span className="flex items-center space-x-1.5 text-amber-500">
            <span className="w-3 h-3 rounded-full bg-amber-500 inline-block"></span>
            <span>Orange (40-75% Mod)</span>
          </span>
          <span className="flex items-center space-x-1.5 text-emerald-500">
            <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block"></span>
            <span>Green (&lt;40% Safe)</span>
          </span>
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4">
        {/* Hazard Filter */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 flex items-center space-x-1 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Hazard:</span>
          </span>
          {(['all', 'landslide', 'flood', 'earthquake', 'cyclone'] as const).map((h) => (
            <button
              key={h}
              onClick={() => setSelectedHazard(h)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase transition-all shrink-0 ${
                selectedHazard === h
                  ? 'bg-red-600 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {h}
            </button>
          ))}
        </div>

        {/* Risk Level Filter */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">Risk Tier:</span>
          {(['all', 'RED', 'ORANGE', 'GREEN'] as const).map((r) => (
            <button
              key={r}
              onClick={() => setSelectedRisk(r)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                selectedRisk === r
                  ? r === 'RED'
                    ? 'bg-red-600 text-white'
                    : r === 'ORANGE'
                    ? 'bg-amber-600 text-white'
                    : r === 'GREEN'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-800 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {r}
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
              height="600px"
            />
          </div>

          {/* Quick Zone Focus Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 text-xs">
            <span className="font-bold text-slate-400 shrink-0">Jump To Hotspot:</span>
            <button
              onClick={() => {
                setMapCenter([11.545, 76.135]);
                setZoomLevel(12);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              Wayanad Escarpment (Kerala)
            </button>
            <button
              onClick={() => {
                setMapCenter([30.556, 79.566]);
                setZoomLevel(13);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              Joshimath Fault Belt (Uttarakhand)
            </button>
            <button
              onClick={() => {
                setMapCenter([26.126, 86.605]);
                setZoomLevel(11);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              Kosi River Lowlands (Bihar)
            </button>
            <button
              onClick={() => {
                setMapCenter([19.813, 85.831]);
                setZoomLevel(11);
              }}
              className="px-2.5 py-1 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white transition-colors shrink-0 font-medium"
            >
              Puri Cyclone Coast (Odisha)
            </button>
          </div>
        </div>

        {/* Right: Selected Habitation / Zone Telemetry Drawer */}
        <div className="lg:col-span-4 space-y-4">
          {selectedHabitation ? (
            <div className="glass-panel p-5 rounded-2xl border-red-500/40 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                <div>
                  <span className="text-[10px] font-mono bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 px-1.5 py-0.5 rounded font-bold">
                    {selectedHabitation.id}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                    {selectedHabitation.name}
                  </h3>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    {selectedHabitation.district}, {selectedHabitation.state}
                  </div>
                </div>
                <span
                  className={`text-xs font-black px-2.5 py-1 rounded-full ${
                    selectedHabitation.riskLevel === 'RED'
                      ? 'bg-red-600 text-white animate-pulse'
                      : selectedHabitation.riskLevel === 'ORANGE'
                      ? 'bg-amber-600 text-white'
                      : 'bg-emerald-600 text-white'
                  }`}
                >
                  {selectedHabitation.riskLevel}
                </span>
              </div>

              {/* Core Vulnerability Gauge */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-semibold text-slate-600 dark:text-slate-300">
                    Composite Vulnerability Index
                  </span>
                  <span className="font-mono font-black text-red-500">
                    {selectedHabitation.vulnerabilityScore} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${
                      selectedHabitation.vulnerabilityScore > 80
                        ? 'bg-red-500'
                        : selectedHabitation.vulnerabilityScore > 50
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                    style={{ width: `${selectedHabitation.vulnerabilityScore}%` }}
                  ></div>
                </div>
                <div className="flex justify-between text-[10px] text-slate-400">
                  <span>Pop: {selectedHabitation.population.toLocaleString()}</span>
                  <span>Elevation: {selectedHabitation.elevationM}m</span>
                  <span>Slope: {selectedHabitation.slopeAngleDeg}°</span>
                </div>
              </div>

              {/* Live Telemetry Sensor Mesh */}
              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2 flex items-center justify-between">
                  <span className="flex items-center space-x-1.5">
                    <Activity className="w-3.5 h-3.5 text-red-500 animate-pulse" />
                    <span>Real-Time Sensor Telemetry</span>
                  </span>
                  <span className="text-[10px] text-slate-400 font-mono">
                    {selectedHabitation.telemetry.lastUpdated}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80">
                    <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <CloudRain className="w-3 h-3 text-blue-400" />
                      <span>Rainfall (mm/h)</span>
                    </div>
                    <div className="font-mono font-bold text-sm text-blue-500 mt-1">
                      {selectedHabitation.telemetry.rainfallMmHr}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80">
                    <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Activity className="w-3 h-3 text-amber-400" />
                      <span>Pore Pressure (kPa)</span>
                    </div>
                    <div className="font-mono font-bold text-sm text-amber-500 mt-1">
                      {selectedHabitation.telemetry.poreWaterKPa}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80">
                    <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Mountain className="w-3 h-3 text-purple-400" />
                      <span>Slope Shift (mm/24h)</span>
                    </div>
                    <div className="font-mono font-bold text-sm text-purple-400 mt-1">
                      {selectedHabitation.telemetry.slopeDisplacementMm}
                    </div>
                  </div>

                  <div className="p-2.5 rounded-lg bg-slate-100 dark:bg-slate-800/80">
                    <div className="text-[10px] text-slate-400 flex items-center space-x-1">
                      <Layers className="w-3 h-3 text-emerald-400" />
                      <span>Soil Saturation</span>
                    </div>
                    <div className="font-mono font-bold text-sm text-emerald-500 mt-1">
                      {selectedHabitation.telemetry.soilSaturationPct}%
                    </div>
                  </div>
                </div>
              </div>

              {/* Recommended Actions */}
              <div>
                <div className="text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  Emergency Action Directives:
                </div>
                <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-300">
                  {selectedHabitation.recommendedActions.map((action, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></span>
                      <span>{action}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Link to Relocation Hub */}
              <Link
                href={`/relocation?habId=${selectedHabitation.id}`}
                className="w-full py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center justify-center space-x-2 shadow transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Compute Safe Evacuation Route</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="glass-panel p-8 rounded-2xl text-center text-slate-400 text-xs">
              Click on any marker on the map to inspect live habitation sensors.
            </div>
          )}

          {/* Habitation Selector List */}
          <div className="glass-panel p-4 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              All Monitored Habitations ({filteredHabitations.length})
            </h4>
            <div className="space-y-1.5 max-h-60 overflow-y-auto pr-1">
              {filteredHabitations.map((h) => (
                <button
                  key={h.id}
                  onClick={() => handleHabitationSelect(h)}
                  className={`w-full p-2 rounded-xl text-left text-xs transition-all flex items-center justify-between ${
                    selectedHabitation?.id === h.id
                      ? 'bg-red-500/10 border border-red-500/40 text-red-600 dark:text-red-400 font-bold'
                      : 'bg-slate-50 dark:bg-slate-800/40 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="truncate">
                    <span className="block font-semibold truncate">{h.name}</span>
                    <span className="text-[10px] text-slate-400">
                      {h.district} • {h.population} residents
                    </span>
                  </div>
                  <span
                    className={`text-[9px] font-black px-1.5 py-0.5 rounded ${
                      h.riskLevel === 'RED'
                        ? 'bg-red-600 text-white'
                        : h.riskLevel === 'ORANGE'
                        ? 'bg-amber-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {h.riskLevel}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
