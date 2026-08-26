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
    language,
    t,
  } = useApp();

  const [activeTab, setActiveTab] = useState<'citizen' | 'responder'>(sosModalTab || 'citizen');
  const [submitted, setSubmitted] = useState(false);

  // Citizen Form state
  const [senderName, setSenderName] = useState('');
  const [senderPhone, setSenderPhone] = useState('');
  const [address, setAddress] = useState(language === 'hi' ? 'उच्च जोखिम ढलान सेक्टर #3 के समीप' : 'Near High-Risk Sector Slope #3');
  const [hazardType, setHazardType] = useState<HazardType>('landslide');
  const [peopleCount, setPeopleCount] = useState<number>(3);
  const [medicalNeeded, setMedicalNeeded] = useState<boolean>(false);
  const [notes, setNotes] = useState('');

  // Responder Form state
  const [broadcastTitle, setBroadcastTitle] = useState(
    language === 'hi' ? 'तत्काल अनिवार्य निकासी आदेश: सेक्टर 4' : 'IMMEDIATE EVACUATION ORDER: SECTOR 4'
  );
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
      senderName: senderName || (language === 'hi' ? 'अनाम नागरिक' : 'Anonymous Citizen'),
      senderPhone: senderPhone || '+91 99999 00000',
      coordinates: userCoordinates,
      addressDescription: address,
      type: 'CITIZEN_SOS',
      hazardContext: hazardType,
      peopleCount,
      medicalAssistanceRequired: medicalNeeded,
      notes: notes || (language === 'hi' ? 'मोबाइल बीकन के माध्यम से तत्काल सहायता का अनुरोध किया गया' : 'Immediate rescue requested via Mobile Citizen Beacon'),
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
      senderName: language === 'hi' ? 'आपदा कमांडर प्रेषण (SEOC)' : 'Incident Commander Dispatch (SEOC)',
      senderPhone: '1070',
      coordinates: userCoordinates,
      addressDescription: `${targetZone} - ${language === 'hi' ? 'निकासी गलियारा सक्रिय' : 'Evacuation Corridor Active'}`,
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
                {language === 'hi' ? 'आपातकालीन एसओएस (SOS) एवं प्रेषण हब' : 'EMERGENCY SOS & DISPATCH HUB'}
              </h2>
              <p className="text-xs text-red-100">
                {language === 'hi'
                  ? 'एनडीआरएफ, एसडीआरएफ एवं जिला आपदा नियंत्रण कक्ष से सीधा उपग्रह संपर्क'
                  : 'Direct satellite uplink to NDRF, SDRF & District Disaster Control'}
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
            <span>{language === 'hi' ? 'नागरिक एसओएस (मुझे मदद चाहिए)' : 'Citizen SOS (I Need Help)'}</span>
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
            <span>{language === 'hi' ? 'प्रशासक/राहत दल आपातकालीन प्रसारण' : 'Responder Incident Dispatch'}</span>
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
                {activeTab === 'citizen'
                  ? language === 'hi' ? 'संकट सिग्नल सफलतापूर्वक भेजा गया!' : 'Distress Signal Transmitted!'
                  : language === 'hi' ? 'आपातकालीन प्रसारण सक्रिय किया गया!' : 'Emergency Broadcast Activated!'}
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md">
                {activeTab === 'citizen'
                  ? language === 'hi'
                    ? 'आपके सटीक जीपीएस निर्देशांक एवं विवरण निकटतम एनडीआरएफ/एसडीआरएफ बचाव दल एवं आश्रय केंद्र को भेज दिए गए हैं।'
                    : 'Your exact GPS coordinates and distress details have been dispatched to the nearest NDRF/SDRF rescue boat and local shelter team.'
                  : language === 'hi'
                    ? 'नामित संवेदनशील क्षेत्र के लिए सामूहिक सायरन और सेलुलर चेतावनी अलर्ट सक्रिय कर दिए गए हैं।'
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
                      {language === 'hi' ? 'लाइव जियोलोकेशन कैप्चर किया गया' : 'Live Geolocation Captured'}
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
                  <span>
                    {isLocating
                      ? language === 'hi' ? 'खोज रहे हैं...' : 'Acquiring...'
                      : language === 'hi' ? 'जीपीएस रीफ्रेश' : 'Refresh GPS'}
                  </span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'आपका नाम / प्रतिनिधि' : 'Your Name / Representative'}
                  </label>
                  <input
                    type="text"
                    required
                    value={senderName}
                    onChange={(e) => setSenderName(e.target.value)}
                    placeholder={language === 'hi' ? 'उदा. रमेश कुमार' : 'e.g. Ramesh Kumar'}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'संपर्क मोबाइल नंबर' : 'Contact Mobile Number'}
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
                    {language === 'hi' ? 'सामना किया गया खतरा / आपदा' : 'Threat / Hazard Encountered'}
                  </label>
                  <select
                    value={hazardType}
                    onChange={(e) => setHazardType(e.target.value as HazardType)}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                  >
                    <option value="landslide">{language === 'hi' ? 'भूस्खलन / ढलान टूटना' : 'Landslide / Slope Collapse'}</option>
                    <option value="flood">{language === 'hi' ? 'अचानक बाढ़ / बढ़ता जलस्तर' : 'Flash Flood / Rising Waters'}</option>
                    <option value="earthquake">{language === 'hi' ? 'भूकंप / गंभीर दरारें' : 'Earthquake / Severe Building Cracks'}</option>
                    <option value="cyclone">{language === 'hi' ? 'चक्रवात / समुद्री जलभराव' : 'Cyclone / Tidal Inundation'}</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    {language === 'hi' ? 'फंसे लोगों की संख्या' : 'Number of Trapped Persons'}
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
                  {language === 'hi' ? 'प्रमुख स्थल / विस्तृत पता' : 'Landmark / Detailed Location'}
                </label>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder={language === 'hi' ? 'उदा. पंचायत कार्यालय के पास, दूसरा मोड़' : 'e.g. Near Panchayat Office, 2nd curve, Red Zone Area'}
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
                  {language === 'hi'
                    ? 'तत्काल चिकित्सा सहायता / स्ट्रेचर / ऑक्सीजन की आवश्यकता है'
                    : 'Critical medical assistance / stretcher / oxygen needed immediately'}
                </label>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'महत्वपूर्ण विवरण / स्थिति (वैकल्पिक)' : 'Urgent Notes / Constraints (Optional)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    language === 'hi'
                      ? 'उदा. पानी पहली मंजिल तक पहुंच गया है; 1 शिशु और 1 वरिष्ठ नागरिक मौजूद हैं।'
                      : 'e.g. Water reached 1st floor; 1 infant and 1 senior citizen present.'
                  }
                  className="w-full px-3 py-2 text-sm rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white rounded-xl font-black text-sm tracking-wider uppercase shadow-xl shadow-red-600/30 flex items-center justify-center space-x-2"
              >
                <Radio className="w-5 h-5 animate-pulse" />
                <span>{language === 'hi' ? '1-क्लिक एसओएस (SOS) संकट बीकन प्रसारित करें' : 'BROADCAST 1-CLICK DISTRESS BEACON'}</span>
              </button>

              {/* Direct Speed-Dial Strip */}
              <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
                <div className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                  {language === 'hi' ? 'तत्काल आपातकालीन हॉटलाइन:' : 'Immediate Emergency Hotlines:'}
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
                  <span className="font-bold">
                    {language === 'hi' ? 'राहत दल निकासी प्राधिकार:' : 'Responder Clearance Authorization:'}
                  </span>{' '}
                  {language === 'hi'
                    ? 'सामूहिक निकासी सक्रिय करने से सभी चैनलों पर प्रसारण, सायरन सक्रिय होते हैं और नागरिकों को सुरक्षित आश्रय स्थलों पर निर्देशित किया जाता है।'
                    : 'Triggering mass evacuation activates synchronized cell broadcasts, automated sirens, and routes citizens to designated safe carrying-capacity shelters.'}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'लक्षित आपदा क्षेत्र / सेक्टर' : 'Target Hazard Zone / Sector'}
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
                  {language === 'hi' ? 'प्रसारण चेतावनी निर्देश' : 'Broadcast Alert Directive'}
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
                  {language === 'hi' ? 'निकासी आदेश प्राथमिकता' : 'Evacuation Order Priority'}
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'CRITICAL_IMMEDIATE', label: language === 'hi' ? 'अति-गंभीर (0-45 मि)' : 'Critical (0-45m)', color: 'border-red-500 bg-red-500/10 text-red-500' },
                    { id: 'HIGH_STAGED', label: language === 'hi' ? 'उच्च (2-4 घंटे)' : 'High (2-4 hrs)', color: 'border-amber-500 bg-amber-500/10 text-amber-500' },
                    { id: 'ADVISORY_STANDBY', label: language === 'hi' ? 'परामर्श स्टैंडबाय' : 'Advisory Standby', color: 'border-blue-500 bg-blue-500/10 text-blue-500' },
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
                  {language === 'hi' ? 'प्रसारण चैनल चयन:' : 'Broadcast Channel Selection:'}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <label className="flex items-center space-x-2 text-xs bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={broadcastChannels.sirens}
                      onChange={(e) => setBroadcastChannels({ ...broadcastChannels, sirens: e.target.checked })}
                      className="rounded text-red-600"
                    />
                    <span>{language === 'hi' ? 'क्षेत्रीय सायरन' : 'Regional Sirens'}</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={broadcastChannels.smsAlert}
                      onChange={(e) => setBroadcastChannels({ ...broadcastChannels, smsAlert: e.target.checked })}
                      className="rounded text-red-600"
                    />
                    <span>{language === 'hi' ? 'सेल ब्रॉडकास्ट एसएमएस' : 'Cell Broadcast SMS'}</span>
                  </label>
                  <label className="flex items-center space-x-2 text-xs bg-slate-100 dark:bg-slate-800 p-2.5 rounded-lg cursor-pointer">
                    <input
                      type="checkbox"
                      checked={broadcastChannels.radioBroadcast}
                      onChange={(e) => setBroadcastChannels({ ...broadcastChannels, radioBroadcast: e.target.checked })}
                      className="rounded text-red-600"
                    />
                    <span>{language === 'hi' ? 'हैम / रेडियो रिले' : 'HAM / Radio Relay'}</span>
                  </label>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-slate-900 hover:bg-black text-white dark:bg-red-700 dark:hover:bg-red-800 rounded-xl font-bold text-sm tracking-wider uppercase shadow-xl flex items-center justify-center space-x-2"
              >
                <Send className="w-5 h-5" />
                <span>{language === 'hi' ? 'क्षेत्रीय आपातकालीन निकासी प्रसारण निष्पादित करें' : 'EXECUTE REGIONAL EVACUATION DISPATCH'}</span>
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
