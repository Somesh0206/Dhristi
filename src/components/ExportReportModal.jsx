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
  ShieldAlert,
  Lock,
  Building2,
  AlertTriangle,
  History,
  FileType,
  Radio,
  Sparkles
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

export default function ExportReportModal({ isOpen, onClose }) {
  const {
    currentUser,
    setIsAuthModalOpen,
    language,
    t,
    shelters,
    simulatedTelemetry,
    activeAlertCount,
    logUserActivity
  } = useApp();

  const isAuthorized = currentUser?.role === 'ADMIN' || currentUser?.role === 'STAFF';

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('pdf'); // 'pdf' | 'json' | 'csv' | 'md' | 'all'
  const [activeTab, setActiveTab] = useState('generator'); // 'generator' | 'archives'
  const [archivedReports, setArchivedReports] = useState([]);
  const [usageStats, setUsageStats] = useState(null);
  const [downloadSuccess, setDownloadSuccess] = useState(false);
  const [downloadMessage, setDownloadMessage] = useState('');
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

  // Generate Professional PDF using jsPDF + autoTable
  const generatePdf = (exportPayload) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const primaryColor = [15, 23, 42]; // Slate-900
    const accentRed = [220, 38, 38]; // Red-600
    const textDark = [30, 41, 59];
    const textMuted = [100, 116, 139];

    // --- Header Background Ribbon ---
    doc.setFillColor(...primaryColor);
    doc.rect(0, 0, 210, 36, 'F');

    // Decorative Accent Strip
    doc.setFillColor(...accentRed);
    doc.rect(0, 36, 210, 2, 'F');

    // Header Titles
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(255, 255, 255);
    doc.text('DISHA GEO-INTELLIGENCE PLATFORM', 14, 15);

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(203, 213, 225);
    doc.text('National Disaster Operations & User Telemetry Audit Report (PDF)', 14, 22);

    // Official Security Badge
    doc.setFillColor(220, 38, 38, 0.9);
    doc.roundedRect(140, 9, 56, 16, 2, 2, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(255, 255, 255);
    doc.text('SEOC CLASSIFIED / AUDIT', 143, 16);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Authorized Personnel Only', 143, 21);

    // --- Metadata Information Bar ---
    let yPos = 46;
    doc.setFillColor(248, 250, 252);
    doc.rect(14, yPos, 182, 24, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.rect(14, yPos, 182, 24, 'S');

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    doc.text('REPORT ID:', 18, yPos + 6);
    doc.text('DATE / TIME:', 75, yPos + 6);
    doc.text('AUDITOR / OPERATOR:', 130, yPos + 6);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...textMuted);
    doc.text(exportPayload.reportRecord?.id || 'DISHA-REP-2026-LIVE', 18, yPos + 12);
    doc.text(new Date().toUTCString(), 75, yPos + 12);
    doc.text(`${currentUser?.name || 'Dr. Rajesh Kumar'} (${currentUser?.role || 'ADMIN'})`, 130, yPos + 12);

    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...textDark);
    doc.text('SECURITY CLEARANCE:', 18, yPos + 18);
    doc.text('DATABASE STORE:', 75, yPos + 18);
    doc.text('SCOPE:', 130, yPos + 18);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...accentRed);
    doc.text('LEVEL 3 - SEOC / NDRF COMMAND', 18, yPos + 23);
    doc.setTextColor(...textMuted);
    doc.text('backendStore.exportReports', 75, yPos + 23);
    doc.text('Pan-India Habitations & GIS', 130, yPos + 23);

    // --- Executive KPI Summary Cards ---
    yPos = 76;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.text('1. EXECUTIVE OPERATIONS & TELEMETRY SUMMARY', 14, yPos);

    yPos += 4;
    const kpis = exportPayload.jsonData?.kpis || {};
    const kpiCards = [
      { label: 'Logged Operations', val: `${exportPayload.jsonData?.logs?.length || 9} Events` },
      { label: 'Active Users Tracked', val: `${exportPayload.jsonData?.users?.length || 6} Users` },
      { label: 'Safe Haven Capacity', val: `${(kpis.currentOccupancy || 5470).toLocaleString()} / ${(kpis.totalSafeCapacity || 14750).toLocaleString()}` },
      { label: 'Active SOS Beacons', val: `${kpis.sosAlertsCount || 3} Beacons` }
    ];

    kpiCards.forEach((card, idx) => {
      const x = 14 + idx * 46;
      doc.setFillColor(241, 245, 249);
      doc.roundedRect(x, yPos, 44, 18, 1.5, 1.5, 'F');
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...textMuted);
      doc.text(card.label, x + 3, yPos + 6);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(...primaryColor);
      doc.text(card.val, x + 3, yPos + 13);
    });

    // --- Table 1: Platform Function Usage Breakdown ---
    yPos += 26;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.text('2. PLATFORM FUNCTION INVOCATION FREQUENCY', 14, yPos);

    const fnBreakdown = exportPayload.jsonData?.functionBreakdown || {};
    const functionRows = Object.entries(fnBreakdown).map(([name, count]) => [
      name,
      String(count),
      'Admin / Staff / Citizen',
      'Active Ingestion & Response'
    ]);

    autoTable(doc, {
      startY: yPos + 3,
      head: [['Function Name', 'Invocations', 'Authorized Clearance', 'Operational Status']],
      body: functionRows.length > 0 ? functionRows : [
        ['SafeHavenRegistration', '4', 'ADMIN / STAFF', 'Active'],
        ['RescueDispatchCommand', '6', 'ADMIN / STAFF', 'Active'],
        ['EmergencyDistressBeacon', '12', 'CITIZEN', 'Active'],
        ['AlgorithmicRoadNavigation', '28', 'ALL ROLES', 'Active'],
        ['VaaniVoiceAssistant', '19', 'ALL ROLES', 'Active'],
        ['EncryptedResponderChat', '15', 'STAFF / ADMIN', 'Active'],
        ['PoliceEmergency112Dispatch', '7', 'STAFF / ADMIN', 'Active']
      ],
      headStyles: { fillColor: primaryColor, fontSize: 8, fontStyle: 'bold' },
      bodyStyles: { fontSize: 7.5, textColor: textDark },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 }
    });

    // --- Table 2: Chronological User Activity & Action Telemetry ---
    const lastTableY = doc.lastAutoTable?.finalY || yPos + 50;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(...textDark);
    doc.text('3. USER ACTIVITY & FUNCTION ACCESS AUDIT LOG', 14, lastTableY + 8);

    const rawLogs = exportPayload.jsonData?.logs || [];
    const logRows = rawLogs.map((l) => [
      l.id,
      new Date(l.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      l.userId,
      l.userName,
      l.userRole,
      l.functionName,
      l.action,
      l.route
    ]);

    autoTable(doc, {
      startY: lastTableY + 11,
      head: [['Log ID', 'Time', 'User ID', 'User Name', 'Role', 'Function', 'Action', 'Route']],
      body: logRows,
      headStyles: { fillColor: [30, 41, 59], fontSize: 7.5, fontStyle: 'bold' },
      bodyStyles: { fontSize: 6.5, textColor: textDark },
      alternateRowStyles: { fillColor: [248, 250, 252] },
      margin: { left: 14, right: 14 }
    });

    // --- Footer with Official Stamp and Page Numbers ---
    const pageCount = doc.internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7);
      doc.setTextColor(...textMuted);
      doc.text(
        `DISHA National Geo-Intelligence System • Stored in Database: exportReports • Official Audit Report • Page ${i} of ${pageCount}`,
        14,
        290
      );
    }

    const dateStr = new Date().toISOString().slice(0, 10);
    doc.save(`DISHA-National-Operations-Usage-Report-${dateStr}.pdf`);
  };

  const handleGenerateAndDownload = async (overrideFormat) => {
    if (!isAuthorized) return;

    const formatToUse = overrideFormat || selectedFormat;
    setIsGenerating(true);
    setDownloadSuccess(false);

    try {
      const res = await fetch('/api/reports/export', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          operatorName: currentUser?.name || 'Dr. Rajesh Kumar (SEOC Director)',
          operatorRole: currentUser?.role || 'ADMIN',
          notes,
          format: formatToUse.toUpperCase()
        })
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.error || 'Failed to generate report');

      const dateStr = new Date().toISOString().slice(0, 10);

      // 1. PDF Download
      if (formatToUse === 'pdf' || formatToUse === 'all') {
        generatePdf(data);
      }

      // 2. JSON Download
      if (formatToUse === 'json' || formatToUse === 'all') {
        const jsonBlob = new Blob([JSON.stringify(data.jsonData, null, 2)], { type: 'application/json' });
        const jsonUrl = URL.createObjectURL(jsonBlob);
        const a = document.createElement('a');
        a.href = jsonUrl;
        a.download = `DISHA-usage-telemetry-report-${dateStr}.json`;
        a.click();
        URL.revokeObjectURL(jsonUrl);
      }

      // 3. CSV Download
      if (formatToUse === 'csv' || formatToUse === 'all') {
        const csvBlob = new Blob([data.csvContent], { type: 'text/csv;charset=utf-8;' });
        const csvUrl = URL.createObjectURL(csvBlob);
        const a = document.createElement('a');
        a.href = csvUrl;
        a.download = `DISHA-user-activity-audit-${dateStr}.csv`;
        a.click();
        URL.revokeObjectURL(csvUrl);
      }

      // 4. Markdown Download
      if (formatToUse === 'md' || formatToUse === 'all') {
        const mdBlob = new Blob([data.markdownReport], { type: 'text/markdown;charset=utf-8;' });
        const mdUrl = URL.createObjectURL(mdBlob);
        const a = document.createElement('a');
        a.href = mdUrl;
        a.download = `DISHA-seoc-executive-summary-${dateStr}.md`;
        a.click();
        URL.revokeObjectURL(mdUrl);
      }

      // Refresh archive list with newly generated record
      if (data.reportRecord) {
        setArchivedReports((prev) => [data.reportRecord, ...prev]);
      }

      setDownloadSuccess(true);
      setDownloadMessage(
        formatToUse === 'pdf'
          ? 'Official PDF Usage Report downloaded and archived to database!'
          : `Report downloaded in ${formatToUse.toUpperCase()} and archived to database!`
      );
      setTimeout(() => setDownloadSuccess(false), 6000);

      if (logUserActivity) {
        logUserActivity('EXPORT_REPORT_DOWNLOADED', 'UsageReportExporter', {
          format: formatToUse,
          reportId: data.reportRecord?.id
        });
      }
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
                  {language === 'hi' ? 'दिशा (DISHA) उपयोग एवं परिचालन रिपोर्ट केंद्र' : 'DISHA Operations & Usage Report Center'}
                </h2>
                <span className="text-[10px] font-mono font-bold bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full border border-indigo-400/30">
                  EXPORT DB
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                {language === 'hi'
                  ? 'केवल प्रशासक और स्टाफ हेतु: उपयोगकर्ताओं की गतिविधि, फंक्शन उपयोग एवं पीडीएफ रिपोर्ट निर्यात'
                  : 'Admin & Staff Portal: Download user usage telemetry, function audit logs, and official PDF'}
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

        {/* Access Restriction Guard for Citizens / Non-Authorized Users */}
        {!isAuthorized ? (
          <div className="p-8 text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border-2 border-amber-500/30 text-amber-500 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
              <Lock className="w-8 h-8 animate-pulse" />
            </div>

            <div className="max-w-md mx-auto space-y-2">
              <h3 className="text-xl font-black text-slate-900 dark:text-white">
                {language === 'hi'
                  ? 'सुरक्षा अनुमति आवश्यक: केवल प्रशासक या स्टाफ'
                  : 'Restricted Access: SEOC Clearance Required'}
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                {language === 'hi'
                  ? 'वेब ऐप का विभिन्न उपयोगकर्ताओं द्वारा उपयोग, फंक्शन ऑडिट एवं परिचालन रिपोर्ट डाउनलोड करने की अनुमति केवल SEOC प्रशासकों और NDRF स्टाफ को है।'
                  : 'Usage telemetry, user activity audits, and official PDF reports contain operational responder logs. Only SEOC Administrators and Disaster Relief Staff are authorized to export.'}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-500 dark:text-slate-400 flex items-center justify-between max-w-md mx-auto">
              <span>Current Clearance Role:</span>
              <span className="font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {currentUser?.role || 'CITIZEN'}
              </span>
            </div>

            <div className="flex items-center justify-center space-x-3 pt-2">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  setIsAuthModalOpen(true);
                }}
                className="px-6 py-3 bg-gradient-to-r from-red-600 to-amber-600 hover:from-red-700 hover:to-amber-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-red-600/30 flex items-center space-x-2 transition-all hover:scale-105">
                <ShieldCheck className="w-4 h-4" />
                <span>
                  {language === 'hi'
                    ? 'प्रशासक / स्टाफ के रूप में लॉगिन करें'
                    : 'Authenticate as Admin / Staff'}
                </span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-5 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800">
                {language === 'hi' ? 'रद्द करें' : 'Dismiss'}
              </button>
            </div>
          </div>
        ) : (
          <>
            {/* Tab switcher */}
            <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 px-6 pt-3">
              <button
                onClick={() => setActiveTab('generator')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all ${
                  activeTab === 'generator'
                    ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                    : 'border-transparent text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}>
                {language === 'hi' ? '📥 पीडीएफ एवं रिपोर्ट जनरेटर' : '📥 PDF & Report Generator'}
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
                          {language === 'hi' ? 'अधिकृत ऑपरेटर (प्रशासक / स्टाफ)' : 'Authorized Auditor Clearance'}
                        </span>
                        <span className="text-xs font-bold text-slate-900 dark:text-white">
                          {currentUser?.name || 'Dr. Rajesh Kumar'} ({currentUser?.role || 'ADMIN'})
                        </span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono font-bold bg-indigo-600/10 text-indigo-600 dark:text-indigo-400 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      LEVEL 3 SEOC CLEARANCE
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

                  {/* Format Selection (PDF is Featured / Primary) */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                        {language === 'hi' ? 'निर्यात प्रारूप चुनें:' : 'Select Export Output Format:'}
                      </label>
                      <span className="text-[10px] font-bold text-red-500 font-mono">
                        ⭐ PDF Official Recommended
                      </span>
                    </div>

                    <div className="grid grid-cols-4 gap-2">
                      {[
                        { id: 'pdf', label: 'PDF Official', icon: FileType, desc: 'SEOC Formatted' },
                        { id: 'json', label: 'JSON Telemetry', icon: FileJson, desc: 'Raw Database' },
                        { id: 'csv', label: 'CSV User Audit', icon: FileSpreadsheet, desc: 'Activity Logs' },
                        { id: 'all', label: 'All Formats', icon: Download, desc: 'Complete Bundle' }
                      ].map((fmt) => {
                        const Icon = fmt.icon;
                        const isSelected = selectedFormat === fmt.id;
                        return (
                          <button
                            key={fmt.id}
                            type="button"
                            onClick={() => setSelectedFormat(fmt.id)}
                            className={`p-3 rounded-2xl border text-left transition-all ${
                              isSelected
                                ? 'border-red-600 bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 ring-2 ring-red-500/30 font-bold'
                                : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}>
                            <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-red-500' : 'text-slate-400'}`} />
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
                      placeholder="E.g. Pre-monsoon disaster evacuation readiness report"
                    />
                  </div>

                  {/* Success Notification */}
                  {downloadSuccess && (
                    <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2 animate-in fade-in">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                      <span>{downloadMessage}</span>
                    </div>
                  )}

                  {/* Action Trigger */}
                  <button
                    type="button"
                    onClick={() => handleGenerateAndDownload(selectedFormat)}
                    disabled={isGenerating}
                    className="w-full py-3.5 bg-gradient-to-r from-red-600 via-rose-600 to-indigo-700 hover:from-red-700 hover:to-indigo-800 text-white rounded-2xl text-xs font-black shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-105 disabled:opacity-50">
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>{language === 'hi' ? 'पीडीएफ तैयार एवं संग्रहीत किया जा रहा है...' : 'Generating PDF & Archiving Report...'}</span>
                      </>
                    ) : (
                      <>
                        <Download className="w-4 h-4" />
                        <span>
                          {selectedFormat === 'pdf'
                            ? (language === 'hi' ? 'आधिकारिक पीडीएफ रिपोर्ट डाउनलोड करें (डेटाबेस में संग्रहीत)' : 'Download Official PDF Report (Archived to Database)')
                            : (language === 'hi' ? 'डेटाबेस से उपयोग रिपोर्ट जनरेट और डाउनलोड करें' : 'Generate, Archive & Download Usage Report')}
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
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 font-mono">
                              {rep.format || 'PDF'}
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
                            By: <strong className="text-slate-700 dark:text-slate-300">{rep.generatedBy}</strong> ({rep.generatedByRole})
                          </span>
                          <button
                            type="button"
                            onClick={() => handleGenerateAndDownload('pdf')}
                            className="text-xs text-red-500 hover:text-red-600 font-bold flex items-center space-x-1">
                            <Download className="w-3.5 h-3.5" />
                            <span>Download PDF ↗</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
