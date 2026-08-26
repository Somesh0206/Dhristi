'use client';

import React, { useState } from 'react';
import { mockEmergencyGuides, emergencyHelplines } from '@/data/resourcesData';
import { useApp } from '@/context/AppContext';
import {
  BookOpen,
  ShieldCheck,
  CheckSquare,
  Square,
  Download,
  Share2,
  Phone,
  ThumbsUp,
  Send,
  Camera,
  MapPin,
  AlertTriangle,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { HazardType } from '@/types';

export default function ResourcesPage() {
  const { incidentReports, addIncidentReport, upvoteIncident, userCoordinates } = useApp();

  const [activeGuideTab, setActiveGuideTab] = useState<'landslide' | 'flood' | 'earthquake' | 'cyclone'>('landslide');

  // Go-Bag Checklist Interactive State
  const [checklist, setChecklist] = useState([
    { id: 'item-1', label: 'Waterproof pouch with IDs, land deeds & medical insurance', checked: true },
    { id: 'item-2', label: '72-hour supply of essential prescription medicines', checked: true },
    { id: 'item-3', label: 'High-power LED flashlight with extra lithium batteries', checked: false },
    { id: 'item-4', label: 'Emergency whistle & high-visibility fluorescent cloth', checked: true },
    { id: 'item-5', label: 'Water purification chlorination tablets (50 pack)', checked: false },
    { id: 'item-6', label: 'Dry high-calorie energy bars & canned nutrition', checked: false },
    { id: 'item-7', label: 'Power bank (20,000mAh) & heavy-duty charging cables', checked: false },
    { id: 'item-8', label: 'First-aid kit with tourniquets, sterile gauze & antiseptic', checked: true },
  ]);

  // Crowdsource Form State
  const [reporterName, setReporterName] = useState('');
  const [reporterContact, setReporterContact] = useState('');
  const [reportHazard, setReportHazard] = useState<HazardType>('landslide');
  const [reportSeverity, setReportSeverity] = useState<'MILD' | 'MODERATE' | 'SEVERE' | 'CATASTROPHIC'>('MODERATE');
  const [reportDesc, setReportDesc] = useState('');
  const [reportSubmitted, setReportSubmitted] = useState(false);

  const toggleChecklistItem = (id: string) => {
    setChecklist((prev) => prev.map((item) => (item.id === id ? { ...item, checked: !item.checked } : item)));
  };

  const completedCount = checklist.filter((i) => i.checked).length;
  const preparednessPct = Math.round((completedCount / checklist.length) * 100);

  const handleIncidentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addIncidentReport({
      reporterName: reporterName || 'Anonymous Citizen',
      contact: reporterContact || '+91 90000 00000',
      coordinates: userCoordinates,
      hazardType: reportHazard,
      severity: reportSeverity,
      description: reportDesc,
    });
    setReportSubmitted(true);
    setTimeout(() => {
      setReportSubmitted(false);
      setReportDesc('');
    }, 3000);
  };

  const handlePrintCard = () => {
    window.print();
  };

  const currentGuide = mockEmergencyGuides.find((g) => g.hazard === activeGuideTab) || mockEmergencyGuides[0];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-1 rounded-md bg-rose-500/10 text-rose-500 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Community Disaster Readiness & Citizen Reporting</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
            Disaster SOPs & Community Awareness
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Actionable hazard survival manuals, emergency Go-Bag builder, and crowdsourced hazard reporting portal.
          </p>
        </div>

        <button
          onClick={handlePrintCard}
          className="px-4 py-2 bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white rounded-xl text-xs font-bold flex items-center space-x-2 border border-slate-700 shadow"
        >
          <Download className="w-4 h-4 text-amber-400" />
          <span>Print / Save Pocket Emergency Card</span>
        </button>
      </div>

      {/* Section 1: Interactive SOP Manual */}
      <div className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
          <div>
            <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-red-500" />
              <span>Standard Operating Procedures (SOPs)</span>
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              NDMA protocol checklists for pre-impact preparedness, immediate survival, and post-disaster recovery
            </p>
          </div>

          {/* Hazard Tabs */}
          <div className="flex items-center space-x-1.5 overflow-x-auto bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-bold">
            {(['landslide', 'flood', 'earthquake', 'cyclone'] as const).map((h) => (
              <button
                key={h}
                onClick={() => setActiveGuideTab(h)}
                className={`px-3 py-1.5 rounded-lg capitalize transition-all shrink-0 ${
                  activeGuideTab === h
                    ? 'bg-red-600 text-white shadow'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                {h}
              </button>
            ))}
          </div>
        </div>

        {/* Selected SOP Content */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-slate-900 dark:text-white">{currentGuide.title}</h3>
            <span className="text-[11px] font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full border border-red-500/30">
              Helpline: {currentGuide.criticalHelpline}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            {/* Phase 1: Before */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/70 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                <span>Phase 1: Before Impact</span>
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                {currentGuide.phases.before.map((point, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-amber-500 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phase 2: During */}
            <div className="p-4 rounded-xl bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/40 space-y-2.5">
              <div className="font-bold text-red-600 dark:text-red-400 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
                <span>Phase 2: During Event</span>
              </div>
              <ul className="space-y-2 text-slate-700 dark:text-slate-200 font-medium">
                {currentGuide.phases.during.map((point, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-red-500 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Phase 3: After */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/70 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <div className="font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider text-[11px] flex items-center space-x-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                <span>Phase 3: After Event</span>
              </div>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                {currentGuide.phases.after.map((point, i) => (
                  <li key={i} className="flex items-start space-x-2">
                    <span className="text-emerald-500 font-bold">•</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Section 2: Interactive Emergency Go-Bag Checklist & Pocket Card */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left 7 Cols: Go-Bag Checklist */}
        <div className="lg:col-span-7 glass-panel p-6 rounded-2xl space-y-5">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckSquare className="w-5 h-5 text-emerald-500" />
                <span>Family 72-Hour Evacuation Go-Bag Builder</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Keep these items assembled in a lightweight, waterproof backpack near your primary exit.
              </p>
            </div>
            <div className="text-right">
              <span className="font-mono font-black text-lg text-emerald-500">{preparednessPct}%</span>
              <span className="block text-[10px] text-slate-400">Readiness Score</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${preparednessPct}%` }}
            ></div>
          </div>

          <div className="space-y-2">
            {checklist.map((item) => (
              <div
                key={item.id}
                onClick={() => toggleChecklistItem(item.id)}
                className={`p-3 rounded-xl border text-xs cursor-pointer flex items-center space-x-3 transition-colors ${
                  item.checked
                    ? 'bg-emerald-500/10 border-emerald-500/30 text-slate-800 dark:text-slate-100 font-semibold'
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400'
                }`}
              >
                {item.checked ? (
                  <CheckSquare className="w-4 h-4 text-emerald-500 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-400 shrink-0" />
                )}
                <span className={item.checked ? '' : 'line-through opacity-70'}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right 5 Cols: Printable Emergency Pocket Card */}
        <div className="lg:col-span-5 glass-panel p-6 rounded-2xl border-amber-500/40 space-y-4 print:border-2 print:border-black">
          <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-amber-500" />
              <h3 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Dhristi Emergency Pocket Card
              </h3>
            </div>
            <span className="text-[10px] font-mono bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded font-bold">
              OFFLINE PASS
            </span>
          </div>

          <div className="space-y-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">My Assigned Shelter:</div>
              <div className="font-bold text-slate-900 dark:text-white">Kalpetta Multi-Hazard Evacuation Shelter</div>
              <div className="text-[11px] text-slate-500">Contact: +91 94471 23098 (Capt. Rajesh)</div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Immediate Disaster Hotlines:</div>
              <div className="grid grid-cols-2 gap-1 text-[11px] font-mono">
                <div>National: <strong>112</strong></div>
                <div>NDRF HQ: <strong>1078</strong></div>
                <div>State EOC: <strong>1070</strong></div>
                <div>Ambulance: <strong>108</strong></div>
              </div>
            </div>

            <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/80 space-y-1">
              <div className="text-[10px] text-slate-400 font-bold uppercase">Distress Flashlight Signal Code:</div>
              <div className="text-[11px] font-mono text-slate-700 dark:text-slate-300">
                3 Short Flashes • 3 Long Flashes • 3 Short Flashes (S.O.S)
              </div>
            </div>
          </div>

          <button
            onClick={handlePrintCard}
            className="w-full py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center space-x-2 shadow transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Download / Print Offline Card</span>
          </button>
        </div>
      </div>

      {/* Section 3: Crowdsourced Hazard Incident Reporting */}
      <div id="crowdsource" className="glass-panel p-6 rounded-2xl space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800 pb-4">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Camera className="w-5 h-5 text-rose-500" />
            <span>Crowdsourced Citizen Hazard Incident Reporting</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Report localized slope fractures, culvert blocks, rising stream waters, and fallen infrastructure to
            accelerate ground verification.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Submission Form (Left 5 Cols) */}
          <div className="lg:col-span-5">
            {reportSubmitted ? (
              <div className="p-6 bg-emerald-500/10 border border-emerald-500/40 text-emerald-300 rounded-2xl text-center space-y-3">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <h4 className="font-bold text-base text-slate-900 dark:text-white">Incident Report Logged!</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Your geotagged report has been added to the community verification feed and forwarded to the local
                  Panchayat control desk.
                </p>
              </div>
            ) : (
              <form onSubmit={handleIncidentSubmit} className="space-y-3.5 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Your Name (Optional / Anonymous)
                  </label>
                  <input
                    type="text"
                    value={reporterName}
                    onChange={(e) => setReporterName(e.target.value)}
                    placeholder="e.g. Anand Menon"
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Hazard Category
                    </label>
                    <select
                      value={reportHazard}
                      onChange={(e) => setReportHazard(e.target.value as HazardType)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="landslide">Landslide / Crack</option>
                      <option value="flood">Water Inundation</option>
                      <option value="earthquake">Structural Subsidence</option>
                      <option value="cyclone">Tree / Pole Fall</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Visual Severity
                    </label>
                    <select
                      value={reportSeverity}
                      onChange={(e) => setReportSeverity(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                    >
                      <option value="MILD">Mild (Minor seepage)</option>
                      <option value="MODERATE">Moderate (Road crack)</option>
                      <option value="SEVERE">Severe (Debris moving)</option>
                      <option value="CATASTROPHIC">Catastrophic</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Describe Situation & Visual Evidence
                  </label>
                  <textarea
                    required
                    rows={3}
                    value={reportDesc}
                    onChange={(e) => setReportDesc(e.target.value)}
                    placeholder="Describe specific landmarks, width of fissures, direction of water flow..."
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  ></textarea>
                </div>

                <div className="p-2.5 bg-slate-100 dark:bg-slate-800/80 rounded-xl flex items-center justify-between text-[11px] font-mono text-slate-500 dark:text-slate-400">
                  <span>GPS Auto-Tag:</span>
                  <span className="font-bold text-rose-500">
                    {userCoordinates[0].toFixed(4)}, {userCoordinates[1].toFixed(4)}
                  </span>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-bold uppercase tracking-wider shadow flex items-center justify-center space-x-2 transition-all"
                >
                  <Send className="w-4 h-4" />
                  <span>Submit Community Report</span>
                </button>
              </form>
            )}
          </div>

          {/* Live Incident Reports Feed (Right 7 Cols) */}
          <div className="lg:col-span-7 space-y-3">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Recent Verified Community Sightings ({incidentReports.length})
            </h3>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {incidentReports.map((inc) => (
                <div
                  key={inc.id}
                  className="p-4 rounded-xl bg-slate-50 dark:bg-slate-850/80 border border-slate-200 dark:border-slate-800 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-800 px-1.5 py-0.5 rounded font-bold">
                        {inc.id}
                      </span>
                      <span className="font-bold text-slate-900 dark:text-white">{inc.reporterName}</span>
                      <span className="text-[10px] text-slate-400 capitalize">({inc.hazardType})</span>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-[9px] font-black px-2 py-0.5 rounded ${
                          inc.severity === 'SEVERE'
                            ? 'bg-red-500/20 text-red-500'
                            : 'bg-amber-500/20 text-amber-500'
                        }`}
                      >
                        {inc.severity}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">{inc.timestamp}</span>
                    </div>
                  </div>

                  <p className="text-slate-700 dark:text-slate-300">{inc.description}</p>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-[11px]">
                    <span className="text-slate-400 font-mono">
                      GPS: {inc.coordinates[0].toFixed(3)}, {inc.coordinates[1].toFixed(3)}
                    </span>
                    <button
                      onClick={() => upvoteIncident(inc.id)}
                      className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-200 dark:bg-slate-800 hover:bg-rose-500 hover:text-white transition-colors font-semibold"
                    >
                      <ThumbsUp className="w-3 h-3" />
                      <span>Confirm Sighting ({inc.upvotes})</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
