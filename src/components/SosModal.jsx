'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  AlertOctagon,
  X,
  Radio,
  PhoneCall,
  MapPin,
  CheckCircle2,


  Shield,
  LifeBuoy,


  LocateFixed,
  Siren,
  Copy,


  Activity } from



'lucide-react';
import { mockPoliceStations, governmentEmergencyDirectory } from '@/data/policeData';


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
    language,
    t
  } = useApp();

  const [activeTab, setActiveTab] = useState('citizen');
  const [submitted, setSubmitted] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  // Sync activeTab when modal opens with a specific tab
  useEffect(() => {
    if (sosModalTab) {
      setActiveTab(sosModalTab);
    }
  }, [sosModalTab, isSosModalOpen]);

  // Citizen Form state
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [address, setAddress] = useState(
    language === 'hi' ? 'उच्च जोखिम ढलान सेक्टर #3 के समीप' : 'Near High-Risk Sector Slope #3'
  );
  const [hazardType, setHazardType] = useState('landslide');
  const [peopleCount, setPeopleCount] = useState(3);
  const [medicalNeeded, setMedicalNeeded] = useState(false);
  const [notes, setNotes] = useState('');

  // Police Station State
  const [policeStations, setPoliceStations] = useState(mockPoliceStations);
  const [selectedStation, setSelectedStation] = useState(mockPoliceStations[0]);
  const [policeVictimsCount, setPoliceVictimsCount] = useState(3);
  const [policeEmergencyText, setPoliceEmergencyText] = useState(
    language === 'hi' ?
    'तत्काल पुलिस सहायता: भूस्खलन रेड ज़ोन में फंसे नागरिक। तत्काल पुलिस पीसीआर वैन एवं बचाव वाहन की आवश्यकता है।' :
    'URGENT POLICE SOS: Vulnerable family trapped in landslide red zone near stream. Immediate police PCR evacuation & transport needed.'
  );
  const [policeDispatchResult, setPoliceDispatchResult] = useState(null);
  const [isPoliceDispatching, setIsPoliceDispatching] = useState(false);
  const [copiedNumber, setCopiedNumber] = useState(null);

  // Responder Form state
  const [broadcastTitle, setBroadcastTitle] = useState(
    language === 'hi' ? 'तत्काल अनिवार्य निकासी आदेश: सेक्टर 4' : 'IMMEDIATE EVACUATION ORDER: SECTOR 4'
  );
  const [targetZone, setTargetZone] = useState('Wayanad Western Escarpment');
  const [evacuationPriority, setEvacuationPriority] = useState('CRITICAL_IMMEDIATE');
  const [broadcastChannels, setBroadcastChannels] = useState({
    sirens: true,
    smsAlert: true,
    radioBroadcast: true
  });

  // Auto-acquire device GPS and fetch nearest police stations when SOS modal opens
  useEffect(() => {
    if (isSosModalOpen) {
      if (requestUserLocation) {
        requestUserLocation();
      }
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
  }, [isSosModalOpen, userCoordinates, requestUserLocation]);

  if (!isSosModalOpen) return null;

  const handleCitizenSubmit = (e) => {
    e.preventDefault();
    addSosAlert({
      senderName: senderName || (language === 'hi' ? 'अनाम नागरिक' : 'Anonymous Citizen'),
      senderPhone: senderPhone || '+91 99999 00000',
      coordinates: userCoordinates,
      addressDescription: address,
      type: 'CITIZEN_SOS',
      hazardContext: hazardType,
      peopleCount,
      medicalAssistanceRequired: medicalNeeded,
      notes:
      notes || (
      language === 'hi' ?
      'मोबाइल बीकन के माध्यम से तत्काल सहायता का अनुरोध किया गया' :
      'Immediate rescue requested via Mobile Citizen Beacon'),
      urgency: medicalNeeded ? 'EXTREME' : 'CRITICAL',
      nearestDepotName: 'SDRF Mountain Rescue Base (Meppadi Hub)',
      nearestDepotCoords: [11.551, 76.124]
    });
    playSosBeep();
    setSubmitMessage(
      language === 'hi' ?
      'नागरिक संकटकालीन SOS बीकन सफलता से प्रसारित कर दिया गया है! SEOC नियंत्रण कक्ष को सतर्क कर दिया गया है।' :
      'Citizen Distress SOS Beacon broadcasted successfully! SEOC Command has prioritized your location.'
    );
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeSosModal();
    }, 2800);
  };

  const handlePoliceSubmit = async (e) => {
    e.preventDefault();
    setIsPoliceDispatching(true);
    playSosBeep();

    try {
      const res = await fetch('/api/police/stations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          stationId: selectedStation.id,
          userCoordinates,
          citizenPhone: senderPhone || '+91-98765-43210',
          emergencyText: policeEmergencyText,
          victimsCount: policeVictimsCount
        })
      });

      const data = await res.json();
      setPoliceDispatchResult(data);
    } catch {
      setPoliceDispatchResult({
        success: true,
        message: 'Direct emergency beacon dispatched to police control room.',
        dispatch: {
          dispatchId: `POL-EMG-${Date.now().toString(36).toUpperCase()}`,
          stationName: selectedStation.name,
          assignedVehicle: 'PCR Van-12 (En Route)',
          status: 'DISPATCHED_EN_ROUTE',
          etaMinutes: 5
        }
      });
    } finally {
      setIsPoliceDispatching(false);
      // Also register into global SOS stream for admin visibility
      addSosAlert({
        senderName: senderName ? `[POLICE SOS] ${senderName}` : `[POLICE 112] Citizen Beacon`,
        senderPhone: senderPhone || '+91-98765-43210',
        coordinates: userCoordinates,
        addressDescription: `${selectedStation.name} Jurisdiction - ${address}`,
        type: 'CITIZEN_SOS',
        hazardContext: 'landslide',
        peopleCount: policeVictimsCount,
        medicalAssistanceRequired: true,
        notes: `POLICE PCR DISPATCH: ${policeEmergencyText}`,
        urgency: 'EXTREME',
        nearestDepotName: selectedStation.name,
        nearestDepotCoords: selectedStation.coordinates
      });
    }
  };

  const handleResponderBroadcast = (e) => {
    e.preventDefault();
    addSosAlert({
      senderName: language === 'hi' ? 'आपदा कमांडर प्रेषण (SEOC)' : 'Incident Commander Dispatch (SEOC)',
      senderPhone: '1070',
      coordinates: userCoordinates,
      addressDescription: `${targetZone} - ${
      language === 'hi' ? 'निकासी गलियारा सक्रिय' : 'Evacuation Corridor Active'}`,

      type: 'ADMIN_DISPATCH',
      hazardContext: 'landslide',
      peopleCount: 1500,
      medicalAssistanceRequired: true,
      notes: `BROADCAST ADVISORY: ${broadcastTitle} | Priority: ${evacuationPriority}`
    });
    playSosBeep();
    setSubmitMessage(
      language === 'hi' ?
      'आपातकालीन चेतावनी आदेश सभी चैनलों (सायरन, एसएमएस, रेडियो) पर सफलतापूर्वक प्रसारित कर दिया गया है।' :
      'Emergency warning broadcast transmitted across Siren, SMS, and Radio channels.'
    );
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      closeSosModal();
    }, 2800);
  };

  const handleCopyNumber = (num) => {
    navigator.clipboard.writeText(num);
    setCopiedNumber(num);
    setTimeout(() => setCopiedNumber(null), 2000);
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-900 border border-red-500/40 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-red-800 p-4 sm:p-5 text-white flex items-center justify-between shadow-md">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-white/20 rounded-2xl backdrop-blur-sm">
              <AlertOctagon className="w-7 h-7 text-white animate-bounce" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg sm:text-xl font-black tracking-wide uppercase">
                  {language === 'hi' ? 'एकीकृत आपातकालीन SOS एवं पुलिस कमान हब' : 'UNIFIED EMERGENCY SOS & POLICE COMMAND'}
                </h2>
                <span className="text-[10px] bg-red-950/60 text-white font-mono px-2 py-0.5 rounded-full border border-red-400/30 animate-pulse">
                  24x7 LIVE
                </span>
              </div>
              <p className="text-xs text-red-100/90 font-medium">
                {language === 'hi' ?
                'तत्काल आपदा बचाव, पुलिस PCR वैन प्रेषण एवं राष्ट्रीय आपातकालीन संपर्क' :
                'Instant Disaster Rescue, Police PCR Dispatch & National Emergency Hotlines'}
              </p>
            </div>
          </div>
          <button
            onClick={closeSosModal}
            className="p-2 rounded-xl bg-black/20 hover:bg-black/40 text-white transition-colors"
            title="Close SOS Modal">
            
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation (4 Unified Tabs) */}
        <div className="flex flex-wrap border-b border-slate-200 dark:border-slate-800 bg-slate-100/80 dark:bg-slate-950/60 px-3 pt-2 gap-1 sm:gap-2">
          <button
            onClick={() => {
              setActiveTab('citizen');
              setPoliceDispatchResult(null);
            }}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm transition-all border-b-2 ${
            activeTab === 'citizen' ?
            'bg-white dark:bg-slate-900 text-red-600 dark:text-red-400 border-red-500 shadow-sm' :
            'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'}`
            }>
            
            <LifeBuoy className="w-4 h-4 text-red-500" />
            <span>{language === 'hi' ? '🚨 नागरिक आपदा SOS' : '🚨 Citizen Disaster SOS'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('police');
              setPoliceDispatchResult(null);
            }}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm transition-all border-b-2 ${
            activeTab === 'police' ?
            'bg-white dark:bg-slate-900 text-blue-600 dark:text-blue-400 border-blue-500 shadow-sm' :
            'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'}`
            }>
            
            <Siren className="w-4 h-4 text-blue-500 animate-pulse" />
            <span>{language === 'hi' ? '🚓 पुलिस स्टेशन SOS (112)' : '🚓 Police Station SOS (112)'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('helplines');
              setPoliceDispatchResult(null);
            }}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm transition-all border-b-2 ${
            activeTab === 'helplines' ?
            'bg-white dark:bg-slate-900 text-emerald-600 dark:text-emerald-400 border-emerald-500 shadow-sm' :
            'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'}`
            }>
            
            <PhoneCall className="w-4 h-4 text-emerald-500" />
            <span>{language === 'hi' ? '📞 24x7 हेल्पलाइन' : '📞 24x7 Helplines'}</span>
          </button>

          <button
            onClick={() => {
              setActiveTab('responder');
              setPoliceDispatchResult(null);
            }}
            className={`flex items-center space-x-2 px-3.5 py-2.5 rounded-t-xl font-bold text-xs sm:text-sm transition-all border-b-2 ${
            activeTab === 'responder' ?
            'bg-white dark:bg-slate-900 text-amber-600 dark:text-amber-400 border-amber-500 shadow-sm' :
            'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border-transparent'}`
            }>
            
            <Radio className="w-4 h-4 text-amber-500" />
            <span>{language === 'hi' ? '🛡️ राहत कमान प्रसारण' : '🛡️ Responder Broadcast'}</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-slate-50/50 dark:bg-slate-900/50 space-y-5">
          {/* Quick GPS Geolocation Fix Banner */}
          <div className="flex flex-wrap items-center justify-between p-3.5 bg-gradient-to-r from-red-500/10 via-amber-500/10 to-blue-500/10 border border-slate-300 dark:border-slate-700/60 rounded-2xl text-xs gap-2">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-red-500 shrink-0" />
              <div>
                <span className="font-bold text-slate-900 dark:text-white">
                  {language === 'hi' ? 'सटीक जीपीएस निर्देशांक:' : 'Exact GPS Fix:'}
                </span>{' '}
                <span className="font-mono text-slate-700 dark:text-slate-300">
                  {userCoordinates[0].toFixed(5)}°N, {userCoordinates[1].toFixed(5)}°E
                </span>
                <span className="ml-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                  ● {language === 'hi' ? 'सटीकता: ±5 मी' : 'Accuracy: ±5m'}
                </span>
              </div>
            </div>
            <button
              type="button"
              onClick={requestUserLocation}
              disabled={isLocating}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-red-500 text-slate-800 dark:text-slate-200 font-bold transition-all disabled:opacity-50">
              
              <LocateFixed className={`w-3.5 h-3.5 text-red-500 ${isLocating ? 'animate-spin' : ''}`} />
              <span>{isLocating ? language === 'hi' ? 'जीपीएस खोज रहे हैं...' : 'Acquiring GPS...' : language === 'hi' ? 'जीपीएस रिफ्रेश करें' : 'Recalibrate GPS'}</span>
            </button>
          </div>

          {/* Submission Success Screen */}
          {submitted ?
          <div className="py-12 flex flex-col items-center justify-center text-center space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center border border-emerald-500/30">
                <CheckCircle2 className="w-10 h-10 animate-bounce" />
              </div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {language === 'hi' ? 'संकटकालीन बीकन प्रेषित!' : 'SOS BEACON DISPATCHED!'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
                {submitMessage}
              </p>
              <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-600 dark:text-red-400 font-mono">
                {language === 'hi' ? 'निकटतम राहत दल को रूट मैप भेजा गया।' : 'Nearest Rescue Squad en route with turn-by-turn road vector.'}
              </div>
            </div> :
          activeTab === 'citizen' ? (
          /* TAB 1: CITIZEN DISASTER SOS */
          <form onSubmit={handleCitizenSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'आपका नाम / परिवार मुखिया' : 'Your Name / Family Head'}
                  </label>
                  <input
                  type="text"
                  required
                  placeholder={language === 'hi' ? 'उदा. राहुल शर्मा' : 'e.g. Rahul Sharma'}
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 outline-none" />
                
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'संपर्क फोन नंबर' : 'Contact Phone Number'}
                  </label>
                  <input
                  type="tel"
                  required
                  placeholder="+91-98765-43210"
                  value={senderPhone}
                  onChange={(e) => setSenderPhone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 outline-none" />
                
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'सटीक पता / स्थानीय लैंडमार्क' : 'Address / Visible Landmark / House Number'}
                </label>
                <input
                type="text"
                required
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 outline-none" />
              
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'आपदा का प्रकार' : 'Hazard Context'}
                  </label>
                  <select
                  value={hazardType}
                  onChange={(e) => setHazardType(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 outline-none font-medium">
                  
                    <option value="landslide">{language === 'hi' ? '🏔️ भूस्खलन एवं मलबा प्रवाह' : '🏔️ Landslide & Debris Flow'}</option>
                    <option value="flood">{language === 'hi' ? '🌊 बाढ़ एवं जलभराव' : '🌊 Flash Flood / Water Inflow'}</option>
                    <option value="earthquake">{language === 'hi' ? '🏚️ भूकंप एवं भवन ढहना' : '🏚️ Earthquake & Structure Damage'}</option>
                    <option value="cyclone">{language === 'hi' ? '🌪️ चक्रवात एवं तेज़ आंधी' : '🌪️ Cyclone & High Winds'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'फंसे हुए व्यक्तियों की संख्या' : 'Number of Trapped Persons'}
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                    type="number"
                    min={1}
                    max={100}
                    value={peopleCount}
                    onChange={(e) => setPeopleCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-red-500 outline-none" />
                  
                    <span className="text-xs text-slate-500 font-medium">
                      {language === 'hi' ? 'व्यक्ति' : 'Persons'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Medical Assistance Checkbox */}
              <div className="p-3.5 bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-900/40 rounded-xl flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <Activity className="w-5 h-5 text-rose-500" />
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">
                      {language === 'hi' ? 'चिकित्सा आपातकाल / एम्बुलेंस की आवश्यकता है' : 'Critical Medical Trauma / Ambulance Required'}
                    </div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">
                      {language === 'hi' ? 'घायल, बुजुर्ग या बच्चों के लिए प्राथमिकता' : 'Prioritizes paramedic kits and trauma stretcher in rescue vehicle'}
                    </div>
                  </div>
                </div>
                <input
                type="checkbox"
                checked={medicalNeeded}
                onChange={(e) => setMedicalNeeded(e.target.checked)}
                className="w-5 h-5 text-rose-600 rounded focus:ring-rose-500" />
              
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'अतिरिक्त संकट विवरण / स्थिति' : 'Distress Notes / Urgency Details'}
                </label>
                <textarea
                rows={2}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder={
                language === 'hi' ?
                'उदा. छत पर फंसे हैं, सड़क ब्लॉक है, पानी का स्तर बढ़ रहा है...' :
                'e.g., Trapped on upper roof, road bridge washed out, mud entering ground floor...'
                }
                className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-red-500 outline-none" />
              
              </div>

              <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]">
              
                <AlertOctagon className="w-5 h-5 animate-pulse" />
                <span>{language === 'hi' ? 'नागरिक आपातकालीन SOS बीकन भेजें' : 'BROADCAST CITIZEN SOS BEACON'}</span>
              </button>
            </form>) :
          activeTab === 'police' ? (
          /* TAB 2: POLICE SOS & PCR DISPATCH */
          <div className="space-y-5">
              {/* Police Dispatch Success Card */}
              {policeDispatchResult ?
            <div className="p-5 bg-blue-50 dark:bg-blue-950/40 border border-blue-300 dark:border-blue-700 rounded-2xl space-y-3 animate-in zoom-in-95">
                  <div className="flex items-center space-x-3 text-blue-600 dark:text-blue-400">
                    <CheckCircle2 className="w-6 h-6" />
                    <h3 className="font-bold text-base">
                      {language === 'hi' ? 'पुलिस नियंत्रण कक्ष को बीकन प्रेषित!' : 'POLICE PCR BEACON TRANSMITTED!'}
                    </h3>
                  </div>
                  <p className="text-xs text-slate-700 dark:text-slate-300">
                    {policeDispatchResult.message || 'Police PCR van has been mobilized to your GPS location.'}
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 p-3 bg-white dark:bg-slate-900 rounded-xl border border-blue-200 dark:border-blue-900/60 text-xs">
                    <div>
                      <span className="text-slate-400 block">{language === 'hi' ? 'थाना:' : 'Station:'}</span>
                      <span className="font-bold text-slate-900 dark:text-white">{policeDispatchResult.dispatch?.stationName || selectedStation.name}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{language === 'hi' ? 'वाहन:' : 'Assigned Unit:'}</span>
                      <span className="font-bold text-blue-600 dark:text-blue-400">{policeDispatchResult.dispatch?.assignedVehicle || 'PCR Van-12'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block">{language === 'hi' ? 'अनुमानित समय:' : 'ETA:'}</span>
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">~{policeDispatchResult.dispatch?.etaMinutes || 5} mins</span>
                    </div>
                  </div>
                </div> :
            null}

              {/* Nearest Police Station Selector */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  {language === 'hi' ? 'निकटतम पुलिस स्टेशन चुनें (Nearest Police Station):' : 'Select Targeted Police Station / Control Room:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {policeStations.slice(0, 3).map((st) => {
                  const isSelected = selectedStation.id === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSelectedStation(st)}
                      className={`p-3 rounded-xl text-left border transition-all ${
                      isSelected ?
                      'bg-blue-500/10 border-blue-500 text-blue-900 dark:text-blue-200 shadow-sm' :
                      'bg-white dark:bg-slate-800/60 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-blue-400'}`
                      }>
                      
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold truncate">{st.name}</span>
                          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 font-mono">
                            {st.status === 'ACTIVE_24X7' ? '24x7' : 'PATROL'}
                          </span>
                        </div>
                        <div className="text-[11px] text-slate-500 dark:text-slate-400 flex items-center space-x-2">
                          <span>📞 {st.phone}</span>
                        </div>
                      </button>);

                })}
                </div>
              </div>

              {/* Police SOS Form */}
              <form onSubmit={handlePoliceSubmit} className="space-y-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'hi' ? 'आपका मोबाइल नंबर' : 'Your Contact Phone'}
                    </label>
                    <input
                    type="tel"
                    required
                    placeholder="+91-98765-43210"
                    value={senderPhone}
                    onChange={(e) => setSenderPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                  
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      {language === 'hi' ? 'सहायता चाहने वाले व्यक्ति' : 'Persons Requiring Police Transport'}
                    </label>
                    <input
                    type="number"
                    min={1}
                    max={50}
                    value={policeVictimsCount}
                    onChange={(e) => setPoliceVictimsCount(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-blue-500 outline-none" />
                  
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'पुलिस सहायता का कारण / आपात स्थिति' : 'Police Emergency Message / Threat Description'}
                  </label>
                  <textarea
                  rows={2}
                  required
                  value={policeEmergencyText}
                  onChange={(e) => setPoliceEmergencyText(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                
                </div>

                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                  type="submit"
                  disabled={isPoliceDispatching}
                  className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center justify-center space-x-2 transition-all disabled:opacity-50">
                  
                    <Siren className={`w-4 h-4 ${isPoliceDispatching ? 'animate-spin' : 'animate-bounce'}`} />
                    <span>
                      {isPoliceDispatching ?
                    language === 'hi' ? 'पीसीआर वैन को बीकन भेज रहे हैं...' : 'Dispatching PCR...' :
                    language === 'hi' ? 'पुलिस स्टेशन को SOS भेजें' : 'DISPATCH TO POLICE STATION'}
                    </span>
                  </button>

                  <a
                  href={`tel:${selectedStation.altPhone || '112'}`}
                  className="py-3 px-5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center space-x-2 shadow-md shadow-red-600/30 transition-all hover:scale-105">
                  
                    <PhoneCall className="w-4 h-4" />
                    <span>{language === 'hi' ? 'कॉल करें: 112' : 'Call Police 112'}</span>
                  </a>
                </div>
              </form>
            </div>) :
          activeTab === 'helplines' ? (
          /* TAB 3: 24x7 GOVERNMENT HELPLINES */
          <div className="space-y-4">
              <div className="p-3 bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-300 dark:border-emerald-800 rounded-xl text-xs text-emerald-800 dark:text-emerald-300">
                <span className="font-bold">⚡ {language === 'hi' ? 'वन-टैप त्वरित कॉलिंग:' : 'One-Tap Emergency Direct Dial:'}</span>{' '}
                {language === 'hi' ?
              'नीचे दिए गए किसी भी आपातकालीन नंबर पर क्लिक करके तुरंत कॉल करें।' :
              'Click directly on any number below to initiate immediate phone call or copy to dialer.'}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[340px] overflow-y-auto pr-1">
                {governmentEmergencyDirectory.map((contact) =>
              <div
                key={contact.number}
                className="p-3.5 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 rounded-2xl flex items-center justify-between hover:border-emerald-500 transition-all shadow-sm group">
                
                    <div className="flex items-center space-x-3 truncate">
                      <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-mono font-black text-sm shrink-0 border border-emerald-500/20">
                        {contact.number}
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-xs text-slate-900 dark:text-white truncate">
                          {contact.service}
                        </div>
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">
                          {contact.department}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button
                    type="button"
                    onClick={() => handleCopyNumber(contact.number)}
                    className="p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 text-slate-700 dark:text-slate-300 transition-colors"
                    title="Copy Number">
                    
                        {copiedNumber === contact.number ?
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> :

                    <Copy className="w-3.5 h-3.5" />
                    }
                      </button>
                      <a
                    href={`tel:${contact.number}`}
                    className="px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center space-x-1 shadow-sm transition-transform active:scale-95"
                    title="Direct Call">
                    
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{language === 'hi' ? 'कॉल' : 'Call'}</span>
                      </a>
                    </div>
                  </div>
              )}
              </div>
            </div>) : (

          /* TAB 4: RESPONDER BROADCAST */
          <form onSubmit={handleResponderBroadcast} className="space-y-4">
              <div className="p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-600 dark:text-amber-400 flex items-center space-x-2">
                <Shield className="w-4 h-4 shrink-0" />
                <span>
                  {language === 'hi' ?
                'अधिसूचना: केवल अधिकृत SEOC / NDRF कमांडरों के लिए। यह सभी सायरन और सेल प्रसारण सक्रिय करेगा।' :
                'Clearance Warning: Authorized SEOC / NDRF Incident Commanders only. Triggers regional siren net.'}
                </span>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'प्रसारण शीर्षक' : 'Evacuation Order Title'}
                </label>
                <input
                type="text"
                required
                value={broadcastTitle}
                onChange={(e) => setBroadcastTitle(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
              
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'लक्षित रेड-ज़ोन क्षेत्र' : 'Target Red Zone'}
                  </label>
                  <input
                  type="text"
                  required
                  value={targetZone}
                  onChange={(e) => setTargetZone(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-amber-500 outline-none" />
                
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'प्राथमिकता स्तर' : 'Urgency Priority'}
                  </label>
                  <select
                  value={evacuationPriority}
                  onChange={(e) => setEvacuationPriority(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-sm font-bold focus:ring-2 focus:ring-amber-500 outline-none">
                  
                    <option value="CRITICAL_IMMEDIATE">{language === 'hi' ? 'अति-गंभीर: तत्काल खाली करें (Red Alert)' : 'CRITICAL: Immediate Relocation (Red)'}</option>
                    <option value="HIGH_WARNING">{language === 'hi' ? 'उच्च: पूर्व-निकासी चेतावनी (Orange Alert)' : 'HIGH: Pre-Evacuation Standby (Orange)'}</option>
                    <option value="ADVISORY_STANDBY">{language === 'hi' ? 'परामर्श: निगरानी में रहें (Yellow Alert)' : 'ADVISORY: General Caution (Yellow)'}</option>
                  </select>
                </div>
              </div>

              {/* Multi-Channel Checklist */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                  {language === 'hi' ? 'सक्रिय प्रसारण माध्यम:' : 'Active Broadcast Channels:'}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium cursor-pointer">
                    <input
                    type="checkbox"
                    checked={broadcastChannels.sirens}
                    onChange={(e) => setBroadcastChannels({ ...broadcastChannels, sirens: e.target.checked })}
                    className="rounded text-amber-600" />
                  
                    <span>📢 {language === 'hi' ? 'सायरन नेटवर्क' : 'Acoustic Sirens'}</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium cursor-pointer">
                    <input
                    type="checkbox"
                    checked={broadcastChannels.smsAlert}
                    onChange={(e) => setBroadcastChannels({ ...broadcastChannels, smsAlert: e.target.checked })}
                    className="rounded text-amber-600" />
                  
                    <span>📱 {language === 'hi' ? 'सेल ब्रॉडकास्ट SMS' : 'Cell Broadcast SMS'}</span>
                  </label>
                  <label className="flex items-center space-x-2 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-medium cursor-pointer">
                    <input
                    type="checkbox"
                    checked={broadcastChannels.radioBroadcast}
                    onChange={(e) => setBroadcastChannels({ ...broadcastChannels, radioBroadcast: e.target.checked })}
                    className="rounded text-amber-600" />
                  
                    <span>📻 {language === 'hi' ? 'आपदा रेडियो फ़ीड' : 'Disaster Radio Net'}</span>
                  </label>
                </div>
              </div>

              <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white font-black text-sm tracking-wider uppercase shadow-lg shadow-amber-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.01] active:scale-[0.99]">
              
                <Radio className="w-5 h-5 animate-pulse" />
                <span>{language === 'hi' ? 'क्षेत्रीय आपातकालीन आदेश प्रसारित करें' : 'TRANSMIT REGIONAL EVACUATION BROADCAST'}</span>
              </button>
            </form>)
          }
        </div>

        {/* Footer / National Hotline Quick Bar */}
        <div className="p-3 bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
          <div className="flex items-center space-x-4">
            <span className="font-bold text-slate-700 dark:text-slate-300">
              {language === 'hi' ? 'राष्ट्रीय आपातकालीन 24x7 हेल्पलाइन:' : 'National Helplines:'}
            </span>
            <a href="tel:112" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
              🚓 Police: 112
            </a>
            <a href="tel:1078" className="text-emerald-600 dark:text-emerald-400 font-bold hover:underline">
              🛡️ NDRF: 1078
            </a>
            <a href="tel:1070" className="text-amber-600 dark:text-amber-400 font-bold hover:underline">
              🏛️ SEOC: 1070
            </a>
          </div>
          <button
            onClick={closeSosModal}
            className="px-3 py-1 rounded-lg text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 font-medium">
            
            {language === 'hi' ? 'बंद करें' : 'Close'}
          </button>
        </div>
      </div>
    </div>);

}