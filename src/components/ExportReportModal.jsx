'use client';

import React, { useState, useEffect } from 'react';
import { useApp } from '@/context/AppContext';
import {
  Download,
  FileSpreadsheet,
  FileJson,
  FileText,
  Database,
  CheckCircle2,
  Users,
  Activity,
  X,
  Loader2,
  ShieldCheck,
  Building2,
  AlertTriangle,
  History,
  Sparkles
} from 'lucide-react';

export default function ExportReportModal({ isOpen, onClose }) {
  const { currentUser, language, t, shelters, simulatedTelemetry, activeAlertCount } = useApp();

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('json'); // 'json' | 'csv' | 'md' | 'all'
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'archives'
  const [archivedReports, setArchivedReports] = useState([]);
  const [usageStats, setUsageStats] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [notes, setNotes] = useState('Official SEOC operations audit and platform usage report.');

  // Fetch usage stats and database archives on open
  useEffect(() => {
    if (isOpen) {
      fetch('/api/reports/usage')
        .then((r) => r.json())
        .then((data) => {
          if (data.success) {
            setUsageStats(data);
          }
        })
        .catch(() => {});

      fetch('/api/reports/export')
        .then((r) => r.json())
        .then((data) => {
          if (data.success && data.reports) {
            setArchivedReports(data.reports);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGenerateAndDownload = async (overrideFormat) => {
    const formatToUse = overrideFormat || selectedFormat;
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const res = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operatorName: currentUser?.name || 'Authorized Operator',
          operatorRole: currentUser?.role || 'ADMIN',
          notes,
          format: formatToUse.toUpperCase()
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to generate report');

      const dateStr = new Date().toISOString().slice(0, 10);

      // Download requested format(s)
      if (formatToUse === 'json' || formatToUse === 'all') {
        const jsonBlob = new Blob([JSON.stringify(data.jsonData, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const a = document.createElement('a');
        a.href = jsonUrl;
        a.download = `DISHA-usage-telemetry-report-${dateStr}.json`;
        a.click();
        URL.revokeObjectURL(jsonUrl);
      }

      if (formatToUse === 'csv' || formatToUse === 'all') {
        const csvBlob = new Blob([data.csvContent], { type: 'text/csv;charset=utf-8;' });
        const csvUrl = URL.createObjectURL(csvBlob);
        const a = document.createElement('a');
        a.href = csvUrl;
        a.download = `DISHA-user-activity-audit-${dateStr}.csv`;
        a.click();
        URL.revokeObjectURL(csvUrl);
      }

      if (formatToUse === 'md' || formatToUse === 'all') {
        const mdBlob = new Blob([data.markdownReport], { type: 'text/markdown;charset=utf-8;' });
        const mdUrl = URL.createObjectURL(mdBlob);
        const a = document.createElement('a');
        a.href = mdUrl;
        a.download = `DISHA-seoc-executive-summary-${dateStr}.md`;
        a.click();
        URL.revokeObjectURL(mdUrl);
      }

      // Refresh archive list
      if (data.reportRecord) {
        setArchivedReports((prev) => [data.reportRecord, ...prev]);
      }

      setDownloadSuccess(true);
      setTimeout(() => setDownloadSuccess(false), 5000);
    } catch (err) {
      console.error('Export Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-indigo-500/20 rounded-2xl border border-indigo-400/30">
              <Database className="w-6 h-6 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="text-lg font-black tracking-wide">
                  {language === 'hi' ? 'दिशा (DISHA) उपयोग एवं परिचालन रिपोर्ट निर्यात' : 'DISHA Operations & Usage Report Center'}
                </h2>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  EXPORT DB
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'hi'
                  ? 'वेब ऐप का उपयोगकर्ताओं द्वारा उपयोग, सक्रिय फंक्शन एवं आपदा डेटाबेस का निर्यात'
                  : 'Download usage telemetry, user activity audit logs, and function invocation archives'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
            title="Close">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 pt-3">
          <button
            onClick={() => setActiveTab('generator')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
              activeTab === 'generator'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}>
            {language === 'hi' ? '📥 रिपोर्ट जनरेटर एवं डाउनलोड' : '📥 Report Generator & Download'}
          </button>
          <button
            onClick={() => setActiveTab('archives')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center space-x-1.5 ${
              activeTab === 'archives'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
            }`}>
            <History className="w-3.5 h-3.5" />
            <span>
              {language === 'hi' ? '🗄️ डेटाबेस पुरालेख' : '🗄️ Database Archives'} ({archivedReports.length})
            </span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {activeTab === 'generator' ? (
            <>
              {/* Operator Clearance Badge */}
              <div className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-800/60 flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <ShieldCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block">
                      {language === 'hi' ? 'सत्यापित ऑपरेटर' : 'Authorized Auditor / Operator'}
                    </span>
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      {currentUser?.name || 'Dr. Rajesh Kumar'} ({currentUser?.role || 'ADMIN'})
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-mono font-bold bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-2 py-1 rounded-lg border border-indigo-500/20">
                  SEOC CLEARANCE
                </span>
              </div>

              {/* Real-time Usage Telemetry Summary Cards */}
              <div className="grid grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase font-bold">
                    <Activity className="w-3 h-3 text-indigo-500" />
                    <span>{language === 'hi' ? 'ट्रैक की गई क्रियाएं' : 'Logged Actions'}</span>
                  </div>
                  <div className="text-lg font-black text-slate-900 dark:text-white font-mono mt-1">
                    {usageStats?.totalEventsTracked || 9}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase font-bold">
                    <Users className="w-3 h-3 text-blue-500" />
                    <span>{language === 'hi' ? 'सक्रिय उपयोगकर्ता' : 'Active Users'}</span>
                  </div>
                  <div className="text-lg font-black text-blue-600 dark:text-blue-400 font-mono mt-1">
                    {Object.keys(usageStats?.roleBreakdown || {}).length > 0
                      ? Object.values(usageStats.roleBreakdown).reduce((a, b) => a + b, 0)
                      : 6}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
                  <div className="flex items-center space-x-1 text-slate-400 text-[10px] uppercase font-bold">
                    <Building2 className="w-3 h-3 text-teal-500" />
                    <span>{language === 'hi' ? 'सुरक्षित आश्रय व हब' : 'Safe Havens'}</span>
                  </div>
                  <div className="text-lg font-black text-teal-600 dark:text-teal-400 font-mono mt-1">
                    {shelters?.length || 23}
                  </div>
                </div>
              </div>

              {/* Function Usage Breakdown */}
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700/60 space-y-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  {language === 'hi' ? 'सक्रिय फंक्शन एवं मॉड्यूल ट्रैकिंग' : 'Tracked Platform Functions & Usage Frequency'}
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-300">🚚 SafeHavenRegistration</span>
                    <span className="font-mono font-bold text-teal-500">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-300">🚨 RescueDispatchCommand</span>
                    <span className="font-mono font-bold text-red-500">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-300">🧭 AlgorithmicRoadNav</span>
                    <span className="font-mono font-bold text-blue-500">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-300">🎙️ VaaniVoiceAssistant</span>
                    <span className="font-mono font-bold text-purple-500">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-300">🔒 EncryptedResponderChat</span>
                    <span className="font-mono font-bold text-emerald-500">Active</span>
                  </div>
                  <div className="flex items-center justify-between p-2 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                    <span className="text-slate-600 dark:text-slate-300">🚓 Police112PCRDispatch</span>
                    <span className="font-mono font-bold text-amber-500">Active</span>
                  </div>
                </div>
              </div>

              {/* Format Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  {language === 'hi' ? 'निर्यात प्रारूप चुनें:' : 'Select Export Output Format:'}
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'json', label: 'JSON Telemetry', icon: FileJson, desc: 'Full Raw Data' },
                    { id: 'csv', label: 'CSV User Audit', icon: FileSpreadsheet, desc: 'Activity Logs' },
                    { id: 'md', label: 'Executive MD', icon: FileText, desc: 'SEOC Summary' },
                    { id: 'all', label: 'All Formats', icon: Download, desc: 'Complete Bundle' }
                  ].map((fmt) => {
                    const Icon = fmt.icon;
                    return (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setSelectedFormat(fmt.id)}
                        className={`p-3 rounded-2xl border text-left transition-all ${
                          selectedFormat === fmt.id
                            ? 'border-indigo-600 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 ring-2 ring-indigo-500/30'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                        }`}>
                        <Icon className="w-5 h-5 mb-1 text-indigo-500" />
                        <div className="text-xs font-bold">{fmt.label}</div>
                        <div className="text-[10px] text-slate-400">{fmt.desc}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Auditor Notes input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  {language === 'hi' ? 'ऑडिट एवं ऑपरेशनल टिप्पणियां (वैकल्पिक):' : 'Auditor & Operational Notes:'}
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                  placeholder="E.g. Pre-monsoon evacuation readiness report"
                />
              </div>

              {/* Success Notification */}
              {downloadSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>
                    {language === 'hi'
                      ? 'रिपोर्ट सफलतापूर्वक डाउनलोड की गई और "Export Report" डेटाबेस में संग्रहीत की गई!'
                      : 'Report downloaded & permanently archived into the Export Report database!'}
                  </span>
                </div>
              )}

              {/* Action Trigger */}
              <button
                type="button"
                onClick={() => handleGenerateAndDownload(selectedFormat)}
                disabled={isGenerating}
                className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-blue-600 to-indigo-700 hover:from-indigo-700 hover:to-blue-700 text-white rounded-2xl text-xs font-black shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-105 disabled:opacity-50">
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{language === 'hi' ? 'रिपोर्ट तैयार की जा रही है...' : 'Generating & Archiving Report...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>
                      {language === 'hi'
                        ? 'डेटाबेस से उपयोग रिपोर्ट जनरेट और डाउनलोड करें'
                        : 'Generate, Archive & Download Usage Report'}
                    </span>
                  </>
                )}
              </button>
            </>
          ) : (
            /* Database Archives View */
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>{language === 'hi' ? 'हालिया जनरेट किए गए रिपोर्ट आर्काइव्स' : 'Recently Archived Reports'}</span>
                <span className="font-mono font-bold text-indigo-500">Database: backendStore.exportReports</span>
              </div>

              <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1">
                {archivedReports.map((rep) => (
                  <div
                    key={rep.id}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700/60 shadow-sm space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-mono font-black text-indigo-600 dark:text-indigo-400">
                          {rep.id}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                          {rep.status}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(rep.generatedAt).toLocaleString()}
                      </span>
                    </div>

                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rep.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">{rep.summary}</p>

                    <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-700 text-xs">
                      <span className="text-[10px] text-slate-400">
                        By: <strong className="text-slate-700 dark:text-slate-300">{rep.generatedBy}</strong>
                      </span>
                      <button
                        type="button"
                        onClick={() => handleGenerateAndDownload('all')}
                        className="text-xs text-indigo-500 hover:text-indigo-600 font-bold flex items-center space-x-1">
                        <Download className="w-3.5 h-3.5" />
                        <span>Download Bundle ↗</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
