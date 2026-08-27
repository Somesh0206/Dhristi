'use client';

import React, { useState } from 'react';
import MapWrapper from '@/components/MapWrapper';
import { mockShelters } from '@/data/sheltersData';
import { useApp } from '@/context/AppContext';
import {
  Building2,
  Search,
  Droplet,
  Utensils,
  Zap,
  HeartPulse,
  Phone,
  MapPin,
  ShieldCheck,
  Filter
} from 'lucide-react';

export default function SheltersPage() {
  const { language, t } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [selectedState, setSelectedState] = useState('ALL');
  const [selectedShelter, setSelectedShelter] = useState(mockShelters[0]);

  // Extract unique states
  const availableStates = ['ALL', ...Array.from(new Set(mockShelters.map((s) => s.state || 'Other')))];

  const filteredShelters = mockShelters.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.district && s.district.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (s.state && s.state.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesType = filterType === 'ALL' || s.type === filterType;
    const matchesState = selectedState === 'ALL' || s.state === selectedState;

    return matchesSearch && matchesType && matchesState;
  });

  const totalNationalCapacity = mockShelters.reduce((acc, s) => acc + s.totalCapacity, 0);
  const totalOccupancy = mockShelters.reduce((acc, s) => acc + s.currentOccupancy, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-500 text-xs font-bold uppercase tracking-wider mb-2">
            <Building2 className="w-3.5 h-3.5" />
            <span>
              {language === 'hi'
                ? 'अखिल भारतीय सुरक्षित आश्रय अवसंरचना एवं वहन क्षमता'
                : 'Pan-India Safe Evacuation Infrastructure & Resilience Index'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            {t('shelters.title', 'Safe Shelters & Relief Camps')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            {t(
              'shelters.subtitle',
              'Carrying capacity tracking, real-time occupancy, and 50-year structural resilience across verified safe havens in all Indian states.'
            )}
          </p>
        </div>

        {/* National Stats Badges */}
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-right">
            <div className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">
              {language === 'hi' ? 'अखिल भारतीय क्षमता' : 'National Capacity'}
            </div>
            <div className="text-lg font-black text-emerald-600 dark:text-emerald-400 font-mono">
              {totalNationalCapacity.toLocaleString()}
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-right">
            <div className="text-[10px] uppercase font-bold text-blue-600 dark:text-blue-400">
              {language === 'hi' ? 'सक्रिय आश्रय स्थल' : 'Verified Safe Havens'}
            </div>
            <div className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono">
              {mockShelters.length} {language === 'hi' ? 'केंद्र' : 'Hubs'}
            </div>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full lg:w-72">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder={
              language === 'hi'
                ? 'आश्रय स्थल, राज्य, ज़िला या पता खोजें...'
                : 'Search by shelter, state, district, or address...'
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* State Selector */}
        <div className="flex items-center space-x-2 w-full lg:w-auto">
          <MapPin className="w-4 h-4 text-emerald-500 shrink-0" />
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 shrink-0">
            {language === 'hi' ? 'राज्य चुनें:' : 'State:'}
          </span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="text-xs font-bold px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 cursor-pointer w-full lg:w-auto"
          >
            <option value="ALL">{language === 'hi' ? '🇮🇳 संपूर्ण भारत (सभी राज्य)' : '🇮🇳 All India (All States)'}</option>
            {availableStates
              .filter((st) => st !== 'ALL')
              .map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
          </select>
        </div>

        {/* Shelter Type Filter */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0 text-xs">
          <span className="font-bold text-slate-400 shrink-0">{language === 'hi' ? 'श्रेणी:' : 'Category:'}</span>
          {[
            { id: 'ALL', label: t('shelters.filterAll', 'All Types') },
            { id: 'SCHOOL', label: t('shelters.filterSchool', '🏫 Schools') },
            { id: 'HOSPITAL', label: t('shelters.filterHospital', '🏥 Hospitals') },
            { id: 'STADIUM', label: t('shelters.filterStadium', '🏟️ Stadiums') },
            { id: 'GOVERNMENT_OFFICE', label: t('shelters.filterGovt', '🏛️ Govt Offices') }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setFilterType(cat.id)}
              className={`px-3 py-1.5 rounded-xl font-bold shrink-0 transition-all ${
                filterType === cat.id
                  ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Map + Selected Shelter Showcase */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Map View */}
        <div className="lg:col-span-7 space-y-4">
          <MapWrapper
            center={selectedShelter.coordinates}
            zoom={selectedState === 'ALL' ? 5 : 10}
            shelters={filteredShelters}
            onSelectShelter={(shelter) => setSelectedShelter(shelter)}
            height="500px"
          />

          <div className="text-xs text-slate-400 text-center font-mono flex items-center justify-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-500 inline" />
            <span>
              Showing {filteredShelters.length} certified multi-hazard safe shelters across India
            </span>
          </div>
        </div>

        {/* Right 5 Cols: Selected Shelter Detail Card */}
        <div className="lg:col-span-5 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border-emerald-500/40 space-y-5">
            {/* Header with Resilience Badge */}
            <div className="flex items-start justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
              <div>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-[10px] font-mono font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded">
                    {selectedShelter.type.replace('_', ' ')}
                  </span>
                  <span className="text-[10px] font-mono font-bold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded">
                    📍 {selectedShelter.state}
                  </span>
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mt-1">
                  {selectedShelter.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  {selectedShelter.address}
                </p>
              </div>
              <div className="text-right shrink-0">
                <div className="text-2xl font-black text-emerald-500 font-mono">
                  {selectedShelter.resilienceScore}
                  <span className="text-xs text-slate-400">/100</span>
                </div>
                <span className="text-[10px] text-emerald-500 font-bold uppercase tracking-wider">
                  {language === 'hi' ? 'सहनशीलता' : 'Resilience'}
                </span>
              </div>
            </div>

            {/* Carrying Capacity Gauge */}
            <div>
              <div className="flex justify-between text-xs font-bold mb-1.5">
                <span className="text-slate-500 dark:text-slate-400">
                  {language === 'hi' ? 'वहन क्षमता अधिभोग:' : 'Carrying Capacity Occupancy:'}
                </span>
                <span className="font-mono text-slate-900 dark:text-white">
                  {selectedShelter.currentOccupancy.toLocaleString()} / {selectedShelter.totalCapacity.toLocaleString()} (
                  {Math.round((selectedShelter.currentOccupancy / selectedShelter.totalCapacity) * 100)}%)
                </span>
              </div>
              <div className="w-full h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    selectedShelter.currentOccupancy / selectedShelter.totalCapacity > 0.85
                      ? 'bg-rose-500'
                      : selectedShelter.currentOccupancy / selectedShelter.totalCapacity > 0.65
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                  style={{
                    width: `${Math.min(
                      100,
                      Math.round((selectedShelter.currentOccupancy / selectedShelter.totalCapacity) * 100)
                    )}%`
                  }}
                />
              </div>
            </div>

            {/* Vital Supplies Grid */}
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2.5">
                {language === 'hi' ? 'आपातकालीन आपूर्ति भंडार:' : 'Emergency Life Support Reserves:'}
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center space-x-2.5">
                  <Droplet className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">
                      {language === 'hi' ? 'पेयजल भंडार' : 'Potable Water'}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {selectedShelter.supplies.waterLiters.toLocaleString()} L ({selectedShelter.supplies.waterDays}{' '}
                      {language === 'hi' ? 'दिन' : 'days'})
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center space-x-2.5">
                  <Utensils className="w-4 h-4 text-emerald-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">
                      {language === 'hi' ? 'खाद्य राशन' : 'Dry Food Rations'}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {selectedShelter.supplies.foodRationDays} {language === 'hi' ? 'दिनों का भंडार' : 'Days Reserve'}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center space-x-2.5">
                  <Zap className="w-4 h-4 text-yellow-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">
                      {language === 'hi' ? 'डीजल जनरेटर बैकअप' : 'Aux Genset Power'}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {selectedShelter.supplies.dieselGenHours} {language === 'hi' ? 'घंटे ईंधन' : 'hrs Fuel'}
                    </div>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 flex items-center space-x-2.5">
                  <HeartPulse className="w-4 h-4 text-rose-500 shrink-0" />
                  <div>
                    <div className="text-[10px] text-slate-400">
                      {language === 'hi' ? 'चिकित्सा किट' : 'Medical Trauma Kits'}
                    </div>
                    <div className="font-bold text-slate-900 dark:text-white">
                      {selectedShelter.supplies.medicalKits} {language === 'hi' ? 'सील किट' : 'Sealed Kits'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 50-Year Historical Disaster Withstand Specs */}
            <div className="border-t border-slate-200 dark:border-slate-800 pt-3">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-2">
                {language === 'hi' ? '50-वर्षीय आपदा सहनशीलता ऑडिट:' : '50-Year Disaster Withstand Audit:'}
              </h4>
              <div className="grid grid-cols-2 gap-1.5 text-[11px] bg-slate-50 dark:bg-slate-800/40 p-2.5 rounded-xl text-slate-600 dark:text-slate-300">
                <div>
                  {language === 'hi' ? 'बाढ़ सहनशीलता:' : 'Flood Tolerance:'}{' '}
                  <strong className="text-blue-500">{selectedShelter.historicalWithstand.floodLevelM}m</strong>
                </div>
                <div>
                  {language === 'hi' ? 'भूकंप सहनशीलता:' : 'Seismic Tolerance:'}{' '}
                  <strong className="text-purple-500">{selectedShelter.historicalWithstand.earthquakeRichter} M</strong>
                </div>
                <div>
                  {language === 'hi' ? 'हवा की गति सहन:' : 'Wind Speed:'}{' '}
                  <strong className="text-amber-500">{selectedShelter.historicalWithstand.cycloneWindKmph} km/h</strong>
                </div>
                <div>
                  {language === 'hi' ? 'पूर्व आपदाएं झेलीं:' : 'Past Incidents:'}{' '}
                  <strong className="text-emerald-500">{selectedShelter.historicalWithstand.pastIncidentsSurvived}</strong>
                </div>
              </div>
            </div>

            {/* Facilities List */}
            <div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mb-1.5">
                {language === 'hi' ? 'विशिष्ट सुविधाएं:' : 'Specialized Amenities:'}
              </div>
              <div className="flex flex-wrap gap-1.5">
                {selectedShelter.facilities.map((fac, i) => (
                  <span
                    key={i}
                    className="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-2 py-1 rounded-md"
                  >
                    ✓ {fac}
                  </span>
                ))}
              </div>
            </div>

            {/* Contact Officer Strip */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-xs">
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4 text-emerald-500" />
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{selectedShelter.contactPerson}</div>
                  <div className="text-[10px] text-slate-400">{selectedShelter.phone}</div>
                </div>
              </div>
              <a
                href={`tel:${selectedShelter.phone.replace(/[^0-9+]/g, '')}`}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
              >
                {language === 'hi' ? 'कॉल डेस्क' : 'Call Desk'}
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'hi' ? 'अखिल भारतीय सुरक्षित आश्रय निर्देशिका' : 'Pan-India Safe Shelter Directory'} (
            {filteredShelters.length})
          </h3>
          <span className="text-xs text-slate-400 font-mono">
            {selectedState === 'ALL' ? 'All Indian States & UTs' : `State: ${selectedState}`}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredShelters.map((shelter) => (
            <div
              key={shelter.id}
              onClick={() => setSelectedShelter(shelter)}
              className={`p-5 rounded-2xl cursor-pointer transition-all ${
                selectedShelter.id === shelter.id
                  ? 'glass-panel border-2 border-emerald-500 shadow-lg'
                  : 'glass-panel-hover'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center space-x-1.5">
                  <span className="text-[10px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded flex items-center space-x-1">
                    <span>
                      {shelter.type === 'SCHOOL'
                        ? language === 'hi' ? '🏫 स्कूल' : '🏫 School'
                        : shelter.type === 'HOSPITAL'
                        ? language === 'hi' ? '🏥 अस्पताल' : '🏥 Hospital'
                        : shelter.type === 'STADIUM'
                        ? language === 'hi' ? '🏟️ स्टेडियम' : '🏟️ Stadium'
                        : shelter.type === 'GOVERNMENT_OFFICE'
                        ? language === 'hi' ? '🏛️ सरकारी कार्यालय' : '🏛️ Govt Office'
                        : '🏢 Safe Haven'}
                    </span>
                  </span>
                  <span className="text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 px-1.5 py-0.5 rounded">
                    {shelter.state}
                  </span>
                </div>
                <span className="text-xs font-mono font-black text-emerald-500">
                  {language === 'hi' ? 'सुरक्षा:' : 'Resilience:'} {shelter.resilienceScore}/100
                </span>
              </div>
              <h4 className="text-base font-bold text-slate-900 dark:text-white">{shelter.name}</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{shelter.address}</p>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {language === 'hi' ? 'कुल क्षमता' : 'Capacity'}
                  </span>
                  <span className="font-bold">{shelter.totalCapacity.toLocaleString()}</span>
                </div>
                <div>
                  <span className="text-slate-400 block text-[10px]">
                    {language === 'hi' ? 'अधिभोग' : 'Occupancy'}
                  </span>
                  <span className="font-bold text-blue-500">
                    {shelter.currentOccupancy.toLocaleString()} ({Math.round((shelter.currentOccupancy / shelter.totalCapacity) * 100)}%)
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}