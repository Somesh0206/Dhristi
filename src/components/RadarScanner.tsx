'use client';

import React from 'react';
import { Radio, ShieldAlert } from 'lucide-react';

export default function RadarScanner() {
  return (
    <div className="relative w-48 h-48 sm:w-56 sm:h-56 mx-auto rounded-full bg-slate-950 border-2 border-red-500/40 overflow-hidden shadow-2xl flex items-center justify-center">
      {/* Concentric Range Rings */}
      <div className="absolute w-3/4 h-3/4 rounded-full border border-red-500/20"></div>
      <div className="absolute w-1/2 h-1/2 rounded-full border border-red-500/30"></div>
      <div className="absolute w-1/4 h-1/4 rounded-full border border-red-500/40"></div>

      {/* Crosshairs */}
      <div className="absolute w-full h-[1px] bg-red-500/30"></div>
      <div className="absolute h-full w-[1px] bg-red-500/30"></div>

      {/* Rotating Radar Sweep Cone */}
      <div
        className="absolute inset-0 origin-center animate-radar-spin"
        style={{
          background: 'conic-gradient(from 0deg, rgba(239, 68, 68, 0.4) 0deg, rgba(239, 68, 68, 0.1) 45deg, transparent 90deg, transparent 360deg)',
        }}
      ></div>

      {/* Blinking Hazard Target Pings */}
      <div className="absolute top-10 right-12 w-2.5 h-2.5 rounded-full bg-red-500 animate-ping"></div>
      <div className="absolute top-10 right-12 w-2.5 h-2.5 rounded-full bg-red-500 shadow-lg shadow-red-500"></div>

      <div className="absolute bottom-12 left-10 w-2 h-2 rounded-full bg-amber-400 animate-ping"></div>
      <div className="absolute bottom-12 left-10 w-2 h-2 rounded-full bg-amber-400 shadow-lg shadow-amber-400"></div>

      <div className="absolute top-14 left-14 w-2 h-2 rounded-full bg-emerald-400"></div>

      {/* Center Reticle */}
      <div className="relative z-10 w-6 h-6 rounded-full bg-red-600/80 border border-white flex items-center justify-center text-white shadow-lg">
        <Radio className="w-3.5 h-3.5 animate-pulse" />
      </div>

      {/* Legend overlay */}
      <div className="absolute bottom-2 text-[9px] font-mono text-red-400 font-bold bg-slate-900/80 px-2 py-0.5 rounded border border-red-500/30">
        SCAN: 3 HAZARDS TRACKED
      </div>
    </div>
  );
}
