'use client';

import React, { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { mockHabitations, mockHazardZones } from '@/data/zonesData';



import MapWrapper from '@/components/MapWrapper';
import PostgisQueryTester from '@/components/PostgisQueryTester';
import {
  SlidersHorizontal,
  Radio,
  Send,
  AlertOctagon,



  CheckCircle2,


  MapPin,

  Truck,

  Navigation,
  Siren,
  Ambulance,

  Check } from

'lucide-react';

export default function AdminPage() {
  const {
    sosAlerts,
    updateSosStatus,
    dispatchRescueTeam,
    selectedSosForRoute,
    setSelectedSosForRoute,
    openSosModal,
    playSosBeep,
    triggerEvacuationCelebration,
    language,
    t
  } = useApp();

  const [habitations, setHabitations] = useState(mockHabitations);
  const [selectedZoneId, setSelectedZoneId] = useState(mockHazardZones[0].id);

  // Dispatch Dialog State
  const [activeDispatchSos, setActiveDispatchSos] = useState(null);
  const [selectedUnit, setSelectedUnit] = useState('NDRF 04 Bn Rapid Deployment Squad');
  const [responderNotes, setResponderNotes] = useState('Dispatching 4x4 off-road rescue vehicle with flood rescue kit and medical oxygen.');

  // Broadcast Alert Form State
  const [broadcastTarget, setBroadcastTarget] = useState('ALL_RED_ZONES');
  const [broadcastMessage, setBroadcastMessage] = useState(
    'MANDATORY EVACUATION NOTICE: Extreme debris flow trigger reached in Wayanad sector. Proceed immediately to Safe Shelter.'
  );
  const [broadcastSuccess, setBroadcastSuccess] = useState(false);

  // Threshold adjustments
  const handleCapacityChange = (habId, delta) => {
    setHabitations((prev) =>
    prev.map((h) => h.id === habId ? { ...h, population: Math.max(100, h.population + delta) } : h)
    );
  };

  const handleSendBroadcast = (e) => {
    e.preventDefault();
    playSosBeep();
    setBroadcastSuccess(true);
    setTimeout(() => setBroadcastSuccess(false), 3000);
  };

  const handleConfirmDispatch = async (e) => {
    e.preventDefault();
    if (!activeDispatchSos) return;
    await dispatchRescueTeam(activeDispatchSos.id, selectedUnit, responderNotes);
    setActiveDispatchSos(null);
  };

  const handleMarkRescued = async (sosId) => {
    await updateSosStatus(sosId, 'RESCUED');
    triggerEvacuationCelebration();
  };

  const activeSos = selectedSosForRoute || sosAlerts[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-purple-500/10 text-purple-500 text-xs font-bold uppercase tracking-wider mb-2">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>{language === 'hi' ? 'आपदा नियंत्रण कक्ष एवं बचाव दल परिचालन' : 'Incident Command & Responder Operations'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {language === 'hi' ? 'राज्य आपातकालीन संचालन केंद्र (SEOC)' : 'State Emergency Operations Console (SEOC)'}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {language === 'hi' ?
            'नागरिक एसओएस (SOS) लाइव ट्राइएज, त्वरित बचाव दल प्रेषण और सड़क मार्ग नेविगेशन प्रणाली।' :
            'Real-time citizen SOS triage, rapid rescue team dispatch, and turn-by-turn road route guidance.'}
          </p>
        </div>

        <button
          onClick={() => openSosModal('responder')}
          className="px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center space-x-2 shadow transition-all hover:scale-105">
          
          <Radio className="w-4 h-4 animate-pulse" />
          <span>{language === 'hi' ? 'क्षेत्रीय आपदा प्रसारण शुरू करें' : 'Launch Regional Incident Dispatch'}</span>
        </button>
      </div>

      {/* Real-time Citizen SOS Triage & Rescue Road Routing */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="flex h-3 w-3 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
            </span>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'नागरिक एसओएस (SOS) संकट बीकन एवं लाइव बचाव प्रेषण' : 'Citizen SOS Distress Beacons & Live Rescue Dispatch'} ({sosAlerts.length})
            </h2>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {language === 'hi' ? 'लाइव जीपीएस स्ट्रीम' : 'Real-Time Operational GPS Stream'}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left 7 Cols: Citizen SOS Distress Queue */}
          <div className="lg:col-span-7 space-y-3">
            {sosAlerts.map((alert) => {
              const isSelected = activeSos?.id === alert.id;
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-2xl border transition-all ${
                  isSelected ?
                  'border-2 border-red-500 bg-red-500/10 shadow-lg' :
                  alert.status === 'PENDING' ?
                  'bg-white dark:bg-slate-900/90 border-red-500/30' :
                  alert.status === 'DISPATCHED' ?
                  'bg-white dark:bg-slate-900/90 border-amber-500/30' :
                  'bg-white dark:bg-slate-900/90 border-emerald-500/30'}`
                  }>
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {alert.id}
                      </span>
                      <span className="font-bold text-sm text-slate-900 dark:text-white">{alert.senderName}</span>
                      <span className="text-xs text-slate-400 font-mono">({alert.senderPhone})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[10px] font-black px-2.5 py-0.5 rounded-full uppercase ${
                        alert.status === 'PENDING' ?
                        'bg-red-600 text-white animate-pulse' :
                        alert.status === 'DISPATCHED' ?
                        'bg-amber-500 text-slate-950 font-bold' :
                        'bg-emerald-600 text-white'}`
                        }>
                        
                        {alert.status === 'PENDING' ?
                        language === 'hi' ? '🚨 संकट लंबित' : '🚨 Distress Pending' :
                        alert.status === 'DISPATCHED' ?
                        language === 'hi' ? '⚡ दल रवाना' : '⚡ Unit En Route' :
                        language === 'hi' ? '✓ सुरक्षित बचाया गया' : '✓ Rescued'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono">{alert.timestamp}</span>
                    </div>
                  </div>

                  <div className="mt-2 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                    <div className="flex items-center space-x-1.5 font-medium">
                      <MapPin className="w-3.5 h-3.5 text-red-500 shrink-0" />
                      <span>{alert.addressDescription}</span>
                    </div>
                    {alert.notes &&
                    <div className="text-[11px] text-slate-500 dark:text-slate-400 italic bg-slate-50 dark:bg-slate-800/60 p-2 rounded-lg">
                        “{alert.notes}”
                      </div>
                    }
                  </div>

                  {/* Dispatch Unit Info if assigned */}
                  {alert.assignedUnit &&
                  <div className="mt-2 text-xs bg-blue-500/10 border border-blue-500/30 text-blue-800 dark:text-blue-200 p-2 rounded-xl flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Truck className="w-4 h-4 text-blue-500 shrink-0" />
                        <div>
                          <strong>{alert.assignedUnit}</strong>
                          <span className="text-[10px] text-slate-400 block">{alert.responderNotes}</span>
                        </div>
                      </div>
                      <span className="text-xs font-mono font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded">
                        {language === 'hi' ? 'आगमन समय:' : 'ETA:'} ~{alert.estimatedArrivalMins || 8} {language === 'hi' ? 'मिनट' : 'mins'}
                      </span>
                    </div>
                  }

                  {/* Operational Metrics & Action Bar */}
                  <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <div className="flex items-center space-x-3 text-[11px] font-mono">
                      <span>{language === 'hi' ? 'फंसे लोग:' : 'People:'} <strong className="text-slate-900 dark:text-white">{alert.peopleCount}</strong></span>
                      {alert.medicalAssistanceRequired &&
                      <span className="text-red-500 font-bold flex items-center space-x-1">
                          <Ambulance className="w-3 h-3" />
                          <span>{language === 'hi' ? 'चिकित्सा आपातकाल' : 'Medical Triage Req.'}</span>
                        </span>
                      }
                    </div>

                    <div className="flex items-center space-x-1.5">
                      {/* View Road Route Button */}
                      <button
                        onClick={() => setSelectedSosForRoute(alert)}
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center space-x-1 transition-all ${
                        isSelected ?
                        'bg-blue-600 text-white shadow' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`
                        }>
                        
                        <Navigation className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'रास्ता देखें' : 'View Rescue Route'}</span>
                      </button>

                      {/* Dispatch Rescue Team Button */}
                      {alert.status !== 'RESCUED' &&
                      <button
                        onClick={() => {
                          setActiveDispatchSos(alert);
                          setSelectedSosForRoute(alert);
                        }}
                        className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg text-xs shadow flex items-center space-x-1 transition-all hover:scale-105">
                        
                          <Siren className="w-3.5 h-3.5" />
                          <span>
                            {alert.status === 'DISPATCHED' ?
                          language === 'hi' ? 'यूनिट बदलें' : 'Re-assign Unit' :
                          language === 'hi' ? 'राहत दल भेजें' : 'Respond & Dispatch'}
                          </span>
                        </button>
                      }

                      {/* Mark Rescued Button */}
                      {alert.status !== 'RESCUED' &&
                      <button
                        onClick={() => handleMarkRescued(alert.id)}
                        className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-xs shadow flex items-center space-x-1">
                        
                          <Check className="w-3.5 h-3.5" />
                          <span>{language === 'hi' ? 'सुरक्षित बचाया' : 'Rescued'}</span>
                        </button>
                      }
                    </div>
                  </div>
                </div>);

            })}
          </div>

          {/* Right 5 Cols: Interactive Rescue Road Routing Map */}
          <div className="lg:col-span-5 space-y-4">
            <div className="glass-panel p-4 rounded-2xl space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-900 dark:text-white flex items-center space-x-1.5">
                  <Navigation className="w-4 h-4 text-blue-500" />
                  <span>
                    {language === 'hi' ? 'बचाव सड़क मार्ग:' : 'Rescue Road Vector:'} {activeSos?.nearestDepotName?.split(',')[0] || (language === 'hi' ? 'एनडीआरएफ बेस' : 'NDRF Base')} ➔ {activeSos?.senderName}
                  </span>
                </span>
              </div>

              {/* GIS Map with Road Route from Depot to Citizen */}
              {activeSos &&
              <MapWrapper
                center={activeSos.coordinates}
                zoom={12}
                activeRescueSos={activeSos}
                sosBeacons={sosAlerts}
                height="420px" />

              }

              {/* Route Summary Card */}
              {activeSos &&
              <div className="bg-slate-50 dark:bg-slate-800/80 p-3 rounded-xl space-y-2 text-xs">
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-700 dark:text-slate-300">
                      {language === 'hi' ? 'प्रस्थान डिपो:' : 'Origin Depot:'}
                    </span>
                    <span className="text-blue-500">{activeSos.nearestDepotName || 'NDRF 04 Bn Deployment Hub'}</span>
                  </div>
                  <div className="flex items-center justify-between font-bold">
                    <span className="text-slate-700 dark:text-slate-300">
                      {language === 'hi' ? 'गंतव्य स्थल:' : 'Destination:'}
                    </span>
                    <span className="text-red-500 truncate max-w-[200px]">{activeSos.addressDescription}</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-700 pt-2 text-[11px] font-mono">
                    <span>
                      {language === 'hi' ? 'अनुमानित दूरी:' : 'Est. Distance:'}{' '}
                      <strong>7.4 km ({language === 'hi' ? 'हाईवे एवं रिज रोड' : 'Highway & Ridge Road'})</strong>
                    </span>
                    <span className="text-emerald-500 font-bold">
                      {language === 'hi' ? 'सड़क अवरोध मुक्त' : 'Clear of Blockages'}
                    </span>
                  </div>
                </div>
              }
            </div>
          </div>
        </div>
      </div>

      {/* Dispatch Modal Dialog */}
      {activeDispatchSos &&
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="glass-panel max-w-lg w-full p-6 rounded-2xl shadow-2xl space-y-4 border-2 border-amber-500">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
              <div className="flex items-center space-x-2">
                <Siren className="w-5 h-5 text-amber-500 animate-bounce" />
                <h3 className="text-base font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ?
                `${activeDispatchSos.senderName} के लिए बचाव दल प्रेषण` :
                `Dispatch Rescue Squad to ${activeDispatchSos.senderName}`}
                </h3>
              </div>
              <button
              onClick={() => setActiveDispatchSos(null)}
              className="text-slate-400 hover:text-white font-bold text-sm">
              
                ✕
              </button>
            </div>

            <div className="text-xs bg-red-500/10 border border-red-500/30 p-2.5 rounded-xl space-y-1">
              <div>
                <strong>{language === 'hi' ? 'संकट स्थल:' : 'Distress Location:'}</strong> {activeDispatchSos.addressDescription}
              </div>
              <div>
                <strong>{language === 'hi' ? 'फंसे व्यक्ति:' : 'Trapped Persons:'}</strong> {activeDispatchSos.peopleCount} {language === 'hi' ? 'नागरिक' : 'individuals'}
              </div>
              {activeDispatchSos.notes &&
            <div>
                  <strong>{language === 'hi' ? 'नागरिक संदेश:' : 'Citizen Note:'}</strong> “{activeDispatchSos.notes}”
                </div>
            }
            </div>

            <form onSubmit={handleConfirmDispatch} className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'hi' ? 'बचाव दल / यूनिट चुनें:' : 'Select Rescue Squad / Unit:'}
                </label>
                <select
                value={selectedUnit}
                onChange={(e) => setSelectedUnit(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-semibold text-slate-900 dark:text-white">
                
                  <option value="NDRF 04 Bn Rapid Deployment Squad">🛡️ NDRF 04 Bn Rapid Deployment Squad (Kalpetta)</option>
                  <option value="SDRF Mountain Search & Rescue Base">⛰️ SDRF Mountain Search & Rescue Base (Meppadi)</option>
                  <option value="Kerala Fire & Rescue Specialized Ops">🚒 Kerala Fire & Rescue Specialized Ops (Vythiri)</option>
                  <option value="District Trauma Ambulance Corps">🚑 District Trauma Ambulance & Paramedic Corps</option>
                  <option value="Police Quick Reaction Team (PCR 112)">🚓 Police Quick Reaction Team (PCR Patrol)</option>
                </select>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">
                  {language === 'hi' ? 'परिचालन निर्देश एवं रूट प्रोटोकॉल:' : 'Responder Instructions & Route Protocol:'}
                </label>
                <textarea
                rows={3}
                value={responderNotes}
                onChange={(e) => setResponderNotes(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white" />
              
              </div>

              <div className="flex gap-2 pt-2">
                <button
                type="button"
                onClick={() => setActiveDispatchSos(null)}
                className="flex-1 py-2.5 bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-xl font-bold">
                
                  {language === 'hi' ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                type="submit"
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl font-bold shadow flex items-center justify-center space-x-1.5">
                
                  <Send className="w-3.5 h-3.5" />
                  <span>{language === 'hi' ? 'बचाव दल रवाना करें' : 'Authorize & Dispatch Team'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      }

      {/* Grid: Habitation Capacity Overrides + PostGIS Console + Broadcast Dispatch */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Capacity Stress Overrides */}
        <div className="lg:col-span-7 space-y-4">
          <div className="glass-panel p-6 rounded-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              {language === 'hi' ? 'बस्ती जनसंख्या एवं वहन क्षमता तनाव संशोधन' : 'Habitation Population & Capacity Stress Override'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase">
                    <th className="pb-2">{language === 'hi' ? 'क्षेत्र' : 'Sector'}</th>
                    <th className="pb-2">{language === 'hi' ? 'संवेदनशीलता' : 'Vulnerability'}</th>
                    <th className="pb-2">{language === 'hi' ? 'निगरानी आबादी' : 'Monitored Pop'}</th>
                    <th className="pb-2">{language === 'hi' ? 'पुनर्वास आदेश' : 'Relocation Mandate'}</th>
                    <th className="pb-2 text-right">{language === 'hi' ? 'क्षमता समायोजन' : 'Capacity Overrides'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {habitations.slice(0, 4).map((hab) =>
                  <tr key={hab.id}>
                      <td className="py-2.5 font-bold text-slate-900 dark:text-white">
                        {hab.name}
                        <span className="block text-[10px] text-slate-400 font-mono">{hab.id}</span>
                      </td>
                      <td className="py-2.5">
                        <span className="font-bold text-red-500">{hab.vulnerabilityScore}%</span>
                      </td>
                      <td className="py-2.5 font-mono">{hab.population}</td>
                      <td className="py-2.5">
                        <span
                        className={`text-[10px] px-2 py-0.5 rounded font-bold ${
                        hab.immediateRelocationNeeded ?
                        'bg-red-500/20 text-red-500' :
                        'bg-slate-100 dark:bg-slate-800 text-slate-400'}`
                        }>
                        
                          {hab.immediateRelocationNeeded ?
                        language === 'hi' ? 'अनिवार्य निकासी' : 'CRITICAL MANDATE' :
                        language === 'hi' ? 'सामान्य निगरानी' : 'MONITORING'}
                        </span>
                      </td>
                      <td className="py-2.5 text-right">
                        <div className="inline-flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
                          <button
                          onClick={() => handleCapacityChange(hab.id, -50)}
                          className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-red-500 hover:text-white font-bold">
                          
                            -50
                          </button>
                          <button
                          onClick={() => handleCapacityChange(hab.id, 50)}
                          className="px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 hover:bg-emerald-500 hover:text-white font-bold">
                          
                            +50
                          </button>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* PostGIS Spatial SQL Query Console */}
          <PostgisQueryTester />
        </div>

        {/* Right 5 Cols: Regional Broadcast Console */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-2xl space-y-4 border-red-500/40">
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800 pb-3">
              <AlertOctagon className="w-5 h-5 text-red-500" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {language === 'hi' ? 'बहु-चैनल आपातकालीन चेतावनी प्रसारण' : 'Multi-Channel Emergency Warning Broadcast'}
              </h3>
            </div>

            {broadcastSuccess &&
            <div className="p-3 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {language === 'hi' ?
                'एसएमएस, वॉयस आईवीआर एवं सायरन नेटवर्क पर आपात प्रसारण प्रसारित!' :
                'Broadcast Queued across SMS, Voice Gateways, & Siren Networks!'}
                </span>
              </div>
            }

            <form onSubmit={handleSendBroadcast} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  {language === 'hi' ? 'लक्षित जियोफेंस्ड क्षेत्र:' : 'Target Geofenced Zone:'}
                </label>
                <select
                  value={broadcastTarget}
                  onChange={(e) => setBroadcastTarget(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-mono">
                  
                  <option value="ALL_RED_ZONES">
                    {language === 'hi' ? 'सभी रेड-ज़ोन (वायनाड सेक्टर)' : 'All Critical Hazard Red-Zones (Wayanad Sector)'}
                  </option>
                  <option value="ZONE-01">Zone 1: Meppadi Escarpment</option>
                  <option value="ZONE-02">Zone 2: Chooralmala Floodplain</option>
                  <option value="ALL_CITIZENS">
                    {language === 'hi' ? 'क्षेत्रीय प्रसारण (सभी पंजीकृत बस्तियां)' : 'Regional Broadcast (All Registered Habitations)'}
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 font-semibold mb-1">
                  {language === 'hi' ? 'प्रसारण संदेश का मुख्य भाग:' : 'Broadcast Message Body:'}
                </label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white font-sans focus:ring-2 focus:ring-red-500" />
                
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 space-y-2">
                <span className="text-[10px] text-slate-400 font-bold block uppercase">
                  {language === 'hi' ? 'सक्रिय प्रसारण चैनल:' : 'Active Broadcast Channels:'}
                </span>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <span className="text-emerald-500">✓ Twilio SMS Gateway</span>
                  <span className="text-emerald-500">✓ Automated Voice IVR</span>
                  <span className="text-emerald-500">✓ Radio Frequency (HAM)</span>
                  <span className="text-emerald-500">✓ Public Alert Sirens</span>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold flex items-center justify-center space-x-2 shadow-lg shadow-red-600/30 transition-all hover:scale-105">
                
                <Send className="w-4 h-4" />
                <span>{language === 'hi' ? 'आपातकालीन चेतावनी प्रसारित करें' : 'Transmit Geofenced Emergency Warning'}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>);

}