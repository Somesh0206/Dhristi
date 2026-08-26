'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import {
  AlertOctagon,
  X,
  Radio,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Send,
  Users,
  Shield,
  LifeBuoy,
  Volume2,
  AlertTriangle,
  LocateFixed,
} from 'lucide-react';
import { emergencyHelplines } from '@/data/resourcesData';
import { HazardType } from '@/types';

export default function SosModal() {
  const {
    isSosModalOpen,
    closeSosModal,
    sosModalTab,
    addSosAlert,
    userCoordinates,
    requestUserLocation,
    isLocating,
    playSosBeep,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'citizen' | 'responder'>(sosModalTab || 'citizen');
  const [submitted, setSubmitted] = useState(false);

  // Citizen Form state
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [address, setAddress] = useState('Near High-Risk Sector Slope #3');
  const [hazardType, setHazardType] = useState<HazardType>('landslide');
  const [peopleCount, setPeopleCount] = useState<number>(3);
  const [medicalNeeded, setMedicalNeeded] = useState<boolean>(false);
  const [notes, setNotes] = useState('');

  // Responder Form state
  const [broadcastTitle, setBroadcastTitle] = useState('IMMEDIATE EVACUATION ORDER: SECTOR 4');
  const [targetZone, setTargetZone] = useState('Wayanad Western Escarpment');
  const [evacuationPriority, setEvacuationPriority] = useState('CRITICAL_IMMEDIATE');
  const [broadcastChannels, setBroadcastChannels] = useState({
    sirens: true,
    smsAlert: true,
    radioBroadcast: true,
  });

  if (!isSosModalOpen) return null;

  const handleCitizenSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addSosAlert({
      senderName: senderName || 'Anonymous Citizen',
      senderPhone: senderPhone || '+91 99999 00000',
      coordinates: userCoordinates,
      addressDescription: address,
      type: 'CITIZEN_SOS',
      hazardContext: hazardType,
      peopleCount,
      medicalAssistanceRequired: medicalNeeded,
      notes: notes || 'Immediate rescue requested via Mobile Citizen Beacon',
      urgency: medicalNeeded ? 'EXTREME' : 'CRITICAL',
      nearestDepotName: 'SDRF Mountain Rescue Base (Meppadi Hub)',
      nearestDepotCoords: [11.5510, 76.1240],
    });
    playSosBeep();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeSosModal();
    }, 2800);
  };

  const handleResponderBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    addSosAlert({
      senderName: 'Incident Commander Dispatch (SEOC)',
      senderPhone: '1070',
      coordinates: userCoordinates,
      addressDescription: `${targetZone} - Evacuation Corridor Active`,
      type: 'ADMIN_DISPATCH',
      hazardContext: 'landslide',
      peopleCount: 1500,
      medicalAssistanceRequired: true,
      notes: `BROADCAST ADVISORY: ${broadcastTitle} | Priority: ${evacuationPriority}`,
    });
    playSosBeep();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeSosModal();
    }, 2800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-red-500/40 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 to-rose-700 p-5 text-white flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/20 rounded-xl">
              <AlertOctagon className="w-7 h-7 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-black tracking-wide">
                EMERGENCY SOS & DISPATCH HUB
              </h2>
              <p className="text-xs text-red-100">
                Direct satellite uplink to NDRF, SDRF & District Disaster Control
              </p>
            </div>
          </div>
          <button
            onClick={closeSosModal}
            className="p-2 rounded-lg bg-black/20 hover:bg-black/40 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/50 p-2 gap-2">
          <button
            onClick={() => {
              setActiveTab('citizen');
              setSubmitted(false);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'citizen'
                ? 'bg-red-600 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <LifeBuoy className="w-4 h-4" />
            <span>Citizen SOS (I Need Help)</span>
          </button>
          <button
            onClick={() => {
              setActiveTab('responder');
              setSubmitted(false);
            }}
            className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold flex items-center justify-center space-x-2 transition-all ${
              activeTab === 'responder'
                ? 'bg-slate-800 dark:bg-slate-700 text-white shadow-md'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Responder Incident Dispatch</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 max-h-[75vh] overflow-y-auto">
          {submitted ? (
            <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {activeTab === 'citizen' ? 'Distress Signal Transmitted!' : 'Emergency Broadcast Activated!'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
                {activeTab === 'citizen'
                  ? 'Your exact GPS coordinates and distress details have been dispatched to the nearest NDRF/SDRF rescue boat and local shelter team.'
                  : 'Mass sirens and multi-channel cellular alerts have been triggered for the designated vulnerable sector.'}
              </p>
              <div className="text-xs font-mono bg-slate-100 dark:bg-slate-800 px-3 py-1.5 rounded-lg text-slate-600 dark:text-slate-400">
                GPS FIX: {userCoordinates[0].toFixed(5)}, {userCoordinates[1].toFixed(5)} | LATENCY: 240ms
              </div>
            </div>
          ) : activeTab === 'citizen' ? (
            /* Citizen SOS Flow */
            <form onSubmit={handleCitizenSubmit} className="space-y-4">
              {/* GPS Broadcast Strip */}
              <div className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xl p-3.5 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <MapPin className="w-5 h-5 text-red-600 shrink-0 animate-bounce" />
                  <div>
                    <div className="text-xs font-bold text-red-900 dark:text-red-300">
                      Live Geolocation Captured
                    </div>
                    <div className="text-[11px] font-mono text-red-700 dark:text-red-400">
                      Lat: {userCoordinates[0].toFixed(5)}°N, Lng: {userCoordinates[1].toFixed(5)}°E
                    </div>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={requestUserLocation}
                  disabled={isLocating}
                  className="px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-xs font-semibold flex items-center space-x-1 transition-colors"
                >
                  <LocateFixed className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
                  <span>{isLocating ? 'Acquiring...' : 'Refresh GPS'}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name / Representative
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder="e.g. Ramesh Kumar"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Contact Mobile Number
                  </label>
                  <input
                    type="tel"
                    required
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Threat / Hazard Encountered
                  </label>
                  <select
                    value={hazardType}
                    onChange={(e) => setHazardType(e.target.value as HazardType)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="landslide">Landslide / Slope Collapse</option>
                    <option value="flood">Flash Flood / Rising Waters</option>
                    <option value="earthquake">Earthquake / Severe Building Cracks</option>
                    <option value="cyclone">Cyclone / Tidal Inundation</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Number of Trapped Persons
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Landmark / Detailed Location
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="e.g. Near Panchayat Office, 2nd curve, Red Zone Area"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                />
              </div>

              <div className="flex items-center space-x-2 bg-slate-100 dark:bg-slate-800/60 p-3 rounded-xl">
                <input
                  type="checkbox"
                  id="medicalReq"
                  checked={medicalNeeded}
                  onChange={(e) => setMedicalNeeded(e.target.checked)}
                  className="w-4 h-4 text-red-600 rounded focus:ring-red-500"
                />
                <label htmlFor="medicalReq" className="text-xs font-medium text-slate-700 dark:text-slate-200">
                  Critical medical assistance / stretcher / oxygen needed immediately
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Urgent Notes / Constraints (Optional)
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Water reached 1st floor; 1 infant and 1 senior citizen present."
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-black text-sm tracking-wider uppercase shadow-xl shadow-red-600/30 flex items-center justify-center space-x-2"
              >
                <Radio className="w-5 h-5 animate-pulse" />
                <span>BROADCAST 1-CLICK DISTRESS BEACON</span>
              </button>

              {/* Direct Speed-Dial Strip */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  Immediate Emergency Hotlines:
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                  {emergencyHelplines.slice(0, 4).map((h) => (
                    <a
                      key={h.number}
                      href={`tel:${h.number.split('/')[0].trim()}`}
                      className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-red-500 hover:text-white dark:hover:bg-red-600 transition-colors border border-slate-200 dark:border-slate-700 font-semibold flex flex-col items-center"
                    >
                      <span className="text-[10px] text-slate-400 truncate w-full">{h.name.split(' ')[0]}</span>
                      <span className="font-bold">{h.number.split('/')[0]}</span>
                    </a>
                  ))}
                </div>
              </div>
            </form>
          ) : (
            /* Responder Incident Dispatch Flow */
            <form onSubmit={handleResponderBroadcast} className="space-y-4">
              <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/60 rounded-xl p-3 text-xs text-amber-900 dark:text-amber-200 flex items-start space-x-2">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Responder Clearance Authorization:</span> Triggering mass evacuation
                  activates synchronized cell broadcasts, automated sirens, and routes citizens to designated safe
                  carrying-capacity shelters.
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Target Hazard Zone / Sector
                </label>
                <select
                  value={targetZone}
                  onChange={(e) => setTargetZone(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500"
                >
                  <option value="Wayanad Western Escarpment">ZONE-RED-01: Wayanad Western Escarpment</option>
                  <option value="Joshimath Main Fault Belt">ZONE-RED-02: Joshimath Main Fault Belt</option>
                  <option value="Idukki Upper Catchment">ZONE-ORG-01: Idukki Upper Catchment</option>
                  <option value="Kosi Embankment Spill Channel">ZONE-ORG-02: Kosi Embankment Spill Channel</option>
                  <option value="Puri Coastal Belt">ZONE-ORG-03: Puri Coastal Inundation Belt</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Broadcast Alert Directive
                </label>
                <input
                  type="text"
                  required
                  value={broadcastTitle}
                  onChange={(e) => setBroadcastTitle(e.target.value)}
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-slate-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Evacuation Order Priority
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CRITICAL_IMMEDIATE', label: 'Critical (0-45m)', color: 'border-red-500 bg-red-500/10 text-red-500' },
                    { id: 'HIGH_STAGED', label: 'High (2-4 hrs)', color: 'border-amber-500 bg-amber-500/10 text-amber-500' },
                    { id: 'ADVISORY_STANDBY', label: 'Advisory Standby', color: 'border-blue-500 bg-blue-500/10 text-blue-500' },
                  ].map((p) => (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setEvacuationPriority(p.id)}
                      className={`py-2 px-3 rounded-lg border text-xs font-bold transition-all ${
                        evacuationPriority === p.id ? `${p.color} ring-2 ring-current` : 'border-slate-300 dark:border-slate-700 text-slate-500'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-2 pt-2">
                <div className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                  Broadcast Channel Selection:
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center space-x-2 text-xs bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={broadcastChannels.sirens}
                      onChange={(e) => setBroadcastChannels({ ...broadcastChannels, sirens: e.target.checked })}
                      className="rounded text-red-600"
                    />
                    <span>Regional Sirens</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={broadcastChannels.smsAlert}
                      onChange={(e) => setBroadcastChannels({ ...broadcastChannels, smsAlert: e.target.checked })}
                      className="rounded text-red-600"
                    />
                    <span>Cell Broadcast SMS</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={broadcastChannels.radioBroadcast}
                      onChange={(e) => setBroadcastChannels({ ...broadcastChannels, radioBroadcast: e.target.checked })}
                      className="rounded text-red-600"
                    />
                    <span>HAM / Radio Relay</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white dark:bg-red-700 dark:hover:bg-red-800 rounded-xl font-bold text-sm tracking-wider uppercase shadow-xl flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>EXECUTE REGIONAL EVACUATION DISPATCH</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
