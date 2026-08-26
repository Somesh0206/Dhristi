'use client';

import React, { useState } from 'react';
import { Database, Play, CheckCircle2, Loader2, Code2 } from 'lucide-react';

export default function PostgisQueryTester() {
  const [queryType, setQueryType] = useState<'ST_DWithin' | 'ST_Intersects'>('ST_DWithin');
  const [radiusMeters, setRadiusMeters] = useState<number>(15000);
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);

  const handleRunSpatialQuery = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/spatial/postgis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          queryType,
          centerLat: 11.551,
          centerLon: 76.1305,
          radiusMeters,
        }),
      });
      const data = await res.json();
      setResults(data);
    } catch {
      //
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel p-6 rounded-2xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <Database className="w-5 h-5 text-emerald-500" />
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Supabase / PostGIS Spatial SQL Query Engine
            </h3>
            <p className="text-xs text-slate-400">
              Run live spatial calculations: ST_DWithin (Buffer allocation) & ST_Intersects (Zone overlays)
            </p>
          </div>
        </div>
        <button
          onClick={handleRunSpatialQuery}
          disabled={loading}
          className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center space-x-1.5 shadow transition-all"
        >
          {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
          <span>Execute Spatial SQL</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
            PostGIS Function
          </label>
          <select
            value={queryType}
            onChange={(e) => setQueryType(e.target.value as any)}
            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
          >
            <option value="ST_DWithin">ST_DWithin (Find Shelters in Radius Range)</option>
            <option value="ST_Intersects">ST_Intersects (Red-Zone Boundary Collision)</option>
          </select>
        </div>

        {queryType === 'ST_DWithin' && (
          <div>
            <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Geofence Radius (Meters)
            </label>
            <input
              type="number"
              value={radiusMeters}
              onChange={(e) => setRadiusMeters(parseInt(e.target.value) || 5000)}
              className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
            />
          </div>
        )}
      </div>

      {results && (
        <div className="space-y-2 pt-2 text-xs">
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-[11px] text-emerald-400 overflow-x-auto">
            <div className="text-slate-500 mb-1">-- Executed PostGIS Query:</div>
            {results.queryExecuted}
          </div>

          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
            <span>Matches Found: <strong className="text-white">{results.totalFound ?? results.results?.length}</strong></span>
            <span>Execution Speed: <strong className="text-emerald-400">{results.executionTimeMs}ms</strong></span>
          </div>
        </div>
      )}
    </div>
  );
}
