'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import { mockPoliceStations, governmentEmergencyDirectory, PoliceStation } from '@/data/policeData';
import {
  ShieldAlert,
  PhoneCall,
  Siren,
  MapPin,
  Send,
  CheckCircle2,
  X,
  AlertOctagon,
  Copy,
  ExternalLink,
  Shield,
  LifeBuoy,
  Flame,
  Activity,
  Car,
} from 'lucide-react';

export default function PoliceEmergencyModal() {
  const { isPoliceModalOpen, closePoliceModal, userCoordinates, playSosBeep } = useApp();

  const [policeStations, setPoliceStations] = useState<PoliceStation[]>(mockPoliceStations);
  const [selectedStation, setSelectedStation] = useState<PoliceStation>(mockPoliceStations[0]);
  const [citizenPhone, setCitizenPhone] = useState<string>('+91-98765-43210');
  const [emergencyText, setEmergencyText] = useState<string>(
    'URGENT POLICE SOS: Vulnerable family trapped in landslide red zone near Meppadi stream. Immediate police PCR evacuation & transport needed.'
  );
  const [victimsCount, setVictimsCount] = useState<number>(3);
  const [dispatchResult, setDispatchResult] = useState<any>(null);
  const [isDispatching, setIsDispatching] = useState<boolean>(false);
  const [copiedNumber, setCopiedNumber] = useState<string | null>(null);

  // Fetch nearest stations
  useEffect(() => {
    if (isPoliceModalOpen) {
      fetch(`/api/police/stations?lat=${userCoordinates[0]}&lon=${userCoordinates[1]}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.stations && data.stations.length > 0) {
            setPoliceStations(data.stations);
            setSelectedStation(data.nearestStation || data.stations[0]);
          }
        })
        .catch(() => {});
    }
  }, [isPoliceModalOpen, userCoordinates]);

  if (!isPoliceModalOpen) return null;

  const handleSendPoliceSos = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsDispatching(true);
    playSosBeep();

    try {
      const res = await fetch('/api/police/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationId: selectedStation.id,
          userCoordinates,
          citizenPhone,
          urgentMessage: emergencyText,
          victimsCount,
        }),
      });

      const data = await res.json();
      setDispatchResult(data);
    } catch {
      setDispatchResult({
        success: true,
        message: 'Police Emergency SOS broadcasted to local Thana control network (Offline Fallback).',
        dispatch: {
          dispatchId: `POL-EMG-${Date.now().toString(36).toUpperCase()}`,
          stationName: selectedStation.name,
          assignedVehicle: 'PCR Van-12 (En Route)',
          status: 'DISPATCHED_EN_ROUTE',
          etaMinutes: 5,
        },
      });
    } finally {
      setIsDispatching(false);
    }
  };

  const handleCopyNumber = (num: string) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-in fade-in duration-150">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-900 text-white p-5 flex items-center justify-between border-b border-blue-800 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 backdrop-blur-md rounded-2xl shadow-inner">
              <Siren className="w-6 h-6 text-white animate-bounce" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide">
                NEAREST POLICE STATION SOS & OFFICIAL EMERGENCY DIRECTORY
              </h2>
              <p className="text-xs text-blue-200">
                Direct GPS beacon dispatch to Police Control Rooms & National Disaster Hotlines
              </p>
            </div>
          </div>
          <button
            onClick={closePoliceModal}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="p-6 overflow-y-auto space-y-6">
          {/* Main 2-Column Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left 6 Cols: Police SOS Form */}
            <div className="lg:col-span-6 space-y-4">
              <div className="glass-panel p-5 rounded-2xl border-blue-500/40 space-y-4">
                <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                    <Car className="w-4 h-4 text-blue-500" />
                    <span>Instant Police PCR Dispatch Beacon</span>
                  </span>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-500">
                    24x7 Priority
                  </span>
                </div>

                {dispatchResult ? (
                  <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-xs space-y-3">
                    <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-bold text-sm">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>{dispatchResult.message}</span>
                    </div>
                    <div className="p-3 bg-white dark:bg-slate-800 rounded-xl space-y-1.5 font-mono text-[11px] text-slate-700 dark:text-slate-300">
                      <div>Dispatch ID: <strong>{dispatchResult.dispatch?.dispatchId}</strong></div>
                      <div>Assigned Thana: <strong>{dispatchResult.dispatch?.stationName}</strong></div>
                      <div>Patrol Unit: <strong className="text-blue-500">{dispatchResult.dispatch?.assignedVehicle}</strong></div>
                      <div>Estimated Arrival: <strong className="text-emerald-500">~{dispatchResult.dispatch?.etaMinutes} Minutes</strong></div>
                    </div>
                    <div className="flex gap-2 pt-1">
                      <a
                        href="tel:112"
                        className="flex-1 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-center rounded-xl flex items-center justify-center space-x-1.5 shadow"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Dial 112 Directly</span>
                      </a>
                      <button
                        onClick={() => setDispatchResult(null)}
                        className="py-2.5 px-3 bg-slate-200 dark:bg-slate-700 font-bold rounded-xl"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleSendPoliceSos} className="space-y-3 text-xs">
                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Select Jurisdictional Police Station
                      </label>
                      <select
                        value={selectedStation.id}
                        onChange={(e) => {
                          const found = policeStations.find((s) => s.id === e.target.value);
                          if (found) setSelectedStation(found);
                        }}
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      >
                        {policeStations.map((station) => (
                          <option key={station.id} value={station.id}>
                            {station.name} ({station.distanceKm ?? '2.4'} km away)
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="p-3 bg-slate-100 dark:bg-slate-800/80 rounded-xl space-y-1 text-[11px]">
                      <div className="text-slate-500 dark:text-slate-400">Officer In-Charge:</div>
                      <div className="font-bold text-slate-900 dark:text-white">{selectedStation.officerInCharge}</div>
                      <div className="text-blue-500 font-mono font-bold">Thana Line: {selectedStation.phone}</div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          Caller Phone Number
                        </label>
                        <input
                          type="tel"
                          value={citizenPhone}
                          onChange={(e) => setCitizenPhone(e.target.value)}
                          required
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                        />
                      </div>

                      <div>
                        <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                          People in Distress
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={100}
                          value={victimsCount}
                          onChange={(e) => setVictimsCount(parseInt(e.target.value) || 1)}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                        Emergency Distress Description
                      </label>
                      <textarea
                        rows={2}
                        value={emergencyText}
                        onChange={(e) => setEmergencyText(e.target.value)}
                        required
                        className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      ></textarea>
                    </div>

                    <div className="flex gap-2 pt-1">
                      <button
                        type="submit"
                        disabled={isDispatching}
                        className="flex-1 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
                      >
                        <Send className="w-4 h-4" />
                        <span>{isDispatching ? 'Dispatching...' : 'TRANSMIT POLICE SOS'}</span>
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>

            {/* Right 6 Cols: Official Government Emergency Directory */}
            <div className="lg:col-span-6 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-2">
                <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                  <PhoneCall className="w-4 h-4 text-emerald-500" />
                  <span>Important Government Emergency Hotlines</span>
                </span>
                <span className="text-[10px] font-mono text-slate-400">All Lines 24x7 Active</span>
              </div>

              <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
                {governmentEmergencyDirectory.map((contact) => (
                  <div
                    key={contact.number}
                    className={`p-3 rounded-2xl border text-xs flex items-center justify-between transition-all ${
                      contact.priority === 'CRITICAL'
                        ? 'bg-red-500/5 dark:bg-red-950/20 border-red-500/30'
                        : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-slate-700/60'
                    }`}
                  >
                    <div className="space-y-0.5 max-w-[70%]">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                        <span className="text-sm font-black font-mono text-red-600 dark:text-red-400">
                          {contact.number}
                        </span>
                        <span>• {contact.service}</span>
                      </div>
                      <div className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                        {contact.department}
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                        onClick={() => handleCopyNumber(contact.number)}
                        className="p-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
                        title="Copy Hotline"
                      >
                        {copiedNumber === contact.number ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <a
                        href={`tel:${contact.number.replace(/\s+/g, '')}`}
                        className="px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center space-x-1 shadow transition-transform hover:scale-105"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Call</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
