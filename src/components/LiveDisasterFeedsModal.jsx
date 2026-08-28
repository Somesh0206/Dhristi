'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  X,

  Globe2,

  Flame,

  AlertTriangle,
  RefreshCw } from
'lucide-react';






export default function LiveDisasterFeedsModal({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('usgs');
  const [usgsData, setUsgsData] = useState([]);
  const [nasaData, setNasaData] = useState([]);
  const [gdacsData, setGdacsData] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLiveFeeds = async () => {
    setLoading(true);
    try {
      const [uRes, nRes, gRes] = await Promise.all([
      fetch('/api/disasters/usgs').then((r) => r.json()),
      fetch('/api/disasters/nasa-eonet').then((r) => r.json()),
      fetch('/api/disasters/gdacs').then((r) => r.json())]
      );

      if (uRes.success) setUsgsData(uRes.earthquakes || []);
      if (nRes.success) setNasaData(nRes.events || []);
      if (gRes.success) setGdacsData(gRes.alerts || []);
    } catch (e) {
      console.warn('Failed to fetch disaster feeds:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchLiveFeeds();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-red-500/20 text-red-400 rounded-xl">
              <Globe2 className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <h2 className="text-lg font-black tracking-wide">
                GLOBAL DISASTER & SATELLITE FEEDS (LIVE APIS)
              </h2>
              <p className="text-xs text-slate-400">
                Direct streams from USGS (FDSN), NASA EONET v3 & GDACS Early Warning
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={fetchLiveFeeds}
              disabled={loading}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
              title="Refresh Feeds">
              
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors">
              
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 p-2 gap-2 text-xs font-bold">
          <button
            onClick={() => setActiveTab('usgs')}
            className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'usgs' ?
            'bg-purple-600 text-white shadow' :
            'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`
            }>
            
            <Activity className="w-3.5 h-3.5" />
            <span>USGS Seismic Feed ({usgsData.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('nasa')}
            className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'nasa' ?
            'bg-blue-600 text-white shadow' :
            'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`
            }>
            
            <Flame className="w-3.5 h-3.5" />
            <span>NASA EONET Events ({nasaData.length})</span>
          </button>
          <button
            onClick={() => setActiveTab('gdacs')}
            className={`flex-1 py-2.5 px-3 rounded-xl flex items-center justify-center space-x-1.5 transition-all ${
            activeTab === 'gdacs' ?
            'bg-red-600 text-white shadow' :
            'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'}`
            }>
            
            <AlertTriangle className="w-3.5 h-3.5" />
            <span>GDACS Alert Engine ({gdacsData.length})</span>
          </button>
        </div>

        {/* Body List */}
        <div className="p-5 max-h-[60vh] overflow-y-auto space-y-3">
          {loading ?
          <div className="py-12 text-center text-xs text-slate-400 animate-pulse">
              Querying NASA & USGS FDSN live endpoints...
            </div> :
          activeTab === 'usgs' ?
          usgsData.map((quake) =>
          <div
            key={quake.id}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
            
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span className="font-mono bg-purple-500/20 text-purple-600 dark:text-purple-300 px-1.5 py-0.5 rounded font-black text-[11px]">
                      M {quake.magnitude}
                    </span>
                    <span>{quake.place}</span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-mono">
                    Depth: {quake.depthKm} km • Time: {quake.timeFormatted}
                  </div>
                </div>
                <div className="text-right font-mono text-[10px] text-slate-400">
                  <span>GPS: {quake.coordinates[0].toFixed(2)}, {quake.coordinates[1].toFixed(2)}</span>
                </div>
              </div>
          ) :
          activeTab === 'nasa' ?
          nasaData.map((ev) =>
          <div
            key={ev.id}
            className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/80 flex items-center justify-between text-xs">
            
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span className="font-mono bg-blue-500/20 text-blue-600 dark:text-blue-300 px-1.5 py-0.5 rounded font-bold text-[10px]">
                      {ev.category}
                    </span>
                    <span>{ev.title}</span>
                  </div>
                  <div className="text-[11px] text-slate-400 font-mono">{ev.id} • Date: {new Date(ev.date).toLocaleDateString()}</div>
                </div>
                {ev.coordinates &&
            <div className="text-right font-mono text-[10px] text-slate-400">
                    {ev.coordinates[0].toFixed(2)}, {ev.coordinates[1].toFixed(2)}
                  </div>
            }
              </div>
          ) :

          gdacsData.map((alert) =>
          <div
            key={alert.id}
            className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-between text-xs">
            
                <div className="space-y-0.5">
                  <div className="font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                    <span className="bg-red-600 text-white px-2 py-0.5 rounded font-black text-[10px]">
                      {alert.alertLevel} ALERT
                    </span>
                    <span>{alert.eventName}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    Source: {alert.source} • Population Exposed: {alert.populationExposed.toLocaleString()}
                  </div>
                </div>
                <div className="text-right font-mono text-[11px] font-bold text-red-500">
                  Severity: {alert.severityScore} / 3.0
                </div>
              </div>
          )
          }
        </div>
      </div>
    </div>);

}