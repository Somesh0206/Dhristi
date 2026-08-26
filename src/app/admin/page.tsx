'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { mockHabitations, mockHazardZones } from '@/data/zonesData';
import { mockShelters } from '@/data/sheltersData';
import {
  SlidersHorizontal,
  Radio,
  Send,
  AlertOctagon,
  Shield,
  LifeBuoy,
  Users,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  Flame,
  Truck,
  Plus,
} from 'lucide-react';

export default function AdminPage() {
  const { sosAlerts, updateSosStatus, openSosModal, playSosBeep } = useApp();

  const [habitations, setHabitations] = useState(mockHabitations);
  const [selectedZoneId, setSelectedZoneId] = useState(mockHazardZones[0].id);

  // Broadcast Alert Form State
  const [broadcastTarget, setBroadcastTarget] = useState('ALL_RED_ZONES');
  const [broadcastMessage, setBroadcastMessage] = useState(
    'MANDATORY EVACUATION NOTICE: Extreme debris flow trigger reached in Wayanad sector. Proceed immediately to Shelter SH-001.'
  );
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Threshold adjustments
  const handleCapacityChange = (habId: string, delta: number) => {
    setHabitations((prev) =>
      prev.map((h) => (h.id === habId ? { ...h, population: Math.max(100, h.population + delta) } : h))
    );
  };

  const handleSendBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    playSosBeep();
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-500 text-xs font-bold uppercase tracking-wider mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Incident Command & Responder Operations</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            State Emergency Operations Console (SEOC)
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Real-time citizen SOS triage, capacity threshold overrides, and multi-channel warning dispatch.
          </p>
        </div>

        <button
          onClick={() => openSosModal('responder')}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow transition-all hover:scale-105"
        >
          <Radio className="w-4 h-4 animate-pulse" />
          <span>Launch Regional Incident Dispatch</span>
        </button>
      </div>

      {/* Real-time Incident Triage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 8 Cols: Live Citizen SOS Feed */}
        <div className="lg:col-span-8 space-y-4">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <span className="flex h-2.5 w-2.5 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
                </span>
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  Live Citizen SOS Stream ({sosAlerts.length})
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">Auto-Refreshing Stream</span>
            </div>

            <div className="space-y-3">
              {sosAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className={`p-4 rounded-xl border transition-all ${
                    alert.status === 'PENDING'
                      ? 'bg-red-500/10 border-red-500/40 text-red-900 dark:text-red-100'
                      : alert.status === 'DISPATCHED'
                      ? 'bg-amber-500/10 border-amber-500/40 text-amber-900 dark:text-amber-100'
                      : 'bg-emerald-500/10 border-emerald-500/40 text-emerald-900 dark:text-emerald-100'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-1.5 py-0.5 rounded bg-black/20">
                        {alert.id}
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{alert.senderName}</span>
                      <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                        ({alert.senderPhone})
                      </span>
                    </div>

                    {/* Status Pill */}
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-full uppercase ${
                          alert.status === 'PENDING'
                            ? 'bg-red-600 text-white animate-pulse'
                            : alert.status === 'DISPATCHED'
                            ? 'bg-amber-500 text-slate-950 font-bold'
                            : 'bg-emerald-600 text-white'
                        }`}
                      >
                        {alert.status}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{alert.timestamp}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-700 dark:text-slate-300">
                    <div className="flex items-center space-x-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{alert.addressDescription}</span>
                    </div>
                    {alert.notes && <div className="mt-1 text-slate-500 dark:text-slate-400 italic">“{alert.notes}”</div>}
                  </div>

                  <div className="mt-3 pt-2 border-t border-black/10 dark:border-white/10 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-3 text-[11px] font-mono">
                      <span>Trapped: <strong>{alert.peopleCount}</strong></span>
                      {alert.medicalAssistanceRequired && (
                        <span className="text-red-500 font-bold">🚑 Medical Triage Req.</span>
                      )}
                      <span>GPS: {alert.coordinates[0].toFixed(4)}, {alert.coordinates[1].toFixed(4)}</span>
                    </div>

                    {/* Triage Actions */}
                    <div className="flex items-center space-x-1.5">
                      {alert.status !== 'DISPATCHED' && (
                        <button
                          onClick={() => updateSosStatus(alert.id, 'DISPATCHED')}
                          className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded text-[11px] shadow transition-colors"
                        >
                          Dispatch SDRF Team
                        </button>
                      )}
                      {alert.status !== 'RESCUED' && (
                        <button
                          onClick={() => updateSosStatus(alert.id, 'RESCUED')}
                          className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded text-[11px] shadow transition-colors"
                        >
                          Mark Rescued
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Habitation Capacity Threshold Override Console */}
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Habitation Population & Capacity Stress Override
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="pb-2">Sector</th>
                    <th className="pb-2">Vulnerability</th>
                    <th className="pb-2">Monitored Pop</th>
                    <th className="pb-2">Relocation Mandate</th>
                    <th className="pb-2 text-right">Capacity Overrides</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {habitations.slice(0, 4).map((hab) => (
                    <tr key={hab.id}>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                        {hab.name}
                        <span className="block text-[10px] text-slate-400 font-mono">{hab.id}</span>
                      </td>
                      <td className="py-2.5">
                        <span className="font-mono font-bold text-red-500">{hab.vulnerabilityScore}%</span>
                      </td>
                      <td className="py-2.5 font-mono font-bold">{hab.population.toLocaleString()}</td>
                      <td className="py-2.5">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            hab.immediateRelocationNeeded
                              ? 'bg-red-500/20 text-red-500'
                              : 'bg-emerald-500/20 text-emerald-500'
                          }`}
                        >
                          {hab.immediateRelocationNeeded ? 'Mandatory' : 'Advisory'}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="inline-flex items-center space-x-1">
                          <button
                            onClick={() => handleCapacityChange(hab.id, -50)}
                            className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold"
                          >
                            -
                          </button>
                          <button
                            onClick={() => handleCapacityChange(hab.id, 50)}
                            className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right 4 Cols: Emergency Alert Broadcast Station */}
        <div className="lg:col-span-4 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border-purple-500/40 space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <Radio className="w-5 h-5 text-purple-500 animate-pulse" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Emergency Alert Broadcast Station
              </h3>
            </div>

            {broadcastSuccess ? (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500 text-emerald-300 rounded-xl text-center text-xs space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-400 mx-auto" />
                <div className="font-bold text-sm">Emergency Alert Broadcasted!</div>
                <p>Cellular SMS, siren relays, and HAM frequency channels activated for selected sector.</p>
              </div>
            ) : (
              <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Geofenced Zone
                  </label>
                  <select
                    value={broadcastTarget}
                    onChange={(e) => setBroadcastTarget(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  >
                    <option value="ALL_RED_ZONES">All Active Red Zones (Wayanad & Chamoli)</option>
                    <option value="ZONE-RED-01">ZONE-RED-01: Wayanad Western Escarpment</option>
                    <option value="ZONE-RED-02">ZONE-RED-02: Joshimath Main Fault Belt</option>
                    <option value="ZONE-ORG-02">ZONE-ORG-02: Kosi Embankment Spill Channel</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Broadcast Advisory Message
                  </label>
                  <textarea
                    rows={4}
                    value={broadcastMessage}
                    onChange={(e) => setBroadcastMessage(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                  ></textarea>
                </div>

                <div className="p-3 bg-slate-100 dark:bg-slate-800 rounded-xl space-y-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                  <div className="font-bold text-slate-900 dark:text-white">Active Channels:</div>
                  <div>• Cell Broadcast Service (CBS Channel 4370)</div>
                  <div>• 145.500 MHz HAM Emergency Net</div>
                  <div>• Electronic Warning Sirens (3km Acoustic Radius)</div>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>TRANSMIT MASS ALERT</span>
                </button>
              </form>
            )}
          </div>

          {/* Quick Rescue Logistics Status */}
          <div className="glass-panel p-5 rounded-2xl space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Deployed Relief Assets
            </h4>
            <div className="grid grid-cols-2 gap-2 font-mono">
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">NDRF Teams Active</div>
                <div className="text-base font-bold text-slate-900 dark:text-white">12 Platoons</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Motorized Boats</div>
                <div className="text-base font-bold text-blue-500">28 Inflatable</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Helicopters (Mi-17)</div>
                <div className="text-base font-bold text-amber-500">4 Air-Ready</div>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800">
                <div className="text-[10px] text-slate-400 font-sans">Field Ambulances</div>
                <div className="text-base font-bold text-emerald-500">34 Units</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
