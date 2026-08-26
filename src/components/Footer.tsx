'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldAlert, Phone, ExternalLink, Heart, AlertTriangle, Radio, Activity } from 'lucide-react';
import { emergencyHelplines } from '@/data/resourcesData';

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-600 dark:text-slate-400 transition-colors">
      {/* Emergency Helpline Bar */}
      <div className="bg-red-50 dark:bg-red-950/30 border-b border-red-100 dark:border-red-900/50 py-4 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2 text-red-600 dark:text-red-400 font-bold text-sm">
            <Phone className="w-4 h-4 animate-bounce" />
            <span>24x7 National Emergency Disaster Response Lines:</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-3 text-xs font-semibold">
            {emergencyHelplines.slice(0, 4).map((h) => (
              <a
                key={h.number}
                href={`tel:${h.number.split('/')[0].trim()}`}
                className="bg-white dark:bg-slate-900 px-3 py-1.5 rounded-lg border border-red-200 dark:border-red-800/80 text-red-700 dark:text-red-300 hover:bg-red-600 hover:text-white dark:hover:bg-red-600 transition-colors shadow-sm"
              >
                {h.name.split(' ')[0]}: <span className="font-mono font-black">{h.number.split('/')[0]}</span>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center text-white shadow-md">
                <ShieldAlert className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                DHRISTI
              </span>
            </div>
            <p className="text-sm text-slate-600 dark:text-slate-300 max-w-md leading-relaxed font-medium">
              Mapping Risk, Protecting Lives: Smart Geo-Intelligence for Vulnerable Habitations.
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md">
              Automated spatial hazard zone identification, multi-parameter slope & flood telemetry, carrying capacity
              stress index, and rapid algorithmic relocation routing for at-risk communities.
            </p>
            <div className="flex items-center space-x-2 text-xs font-mono text-emerald-600 dark:text-emerald-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span>EARTH OBSERVATION & SENSOR STREAMS ACTIVE (99.98% SLA)</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Core Modules
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/red-zones" className="hover:text-red-500 transition-colors">
                  Hazard Red-Zone GIS Map
                </Link>
              </li>
              <li>
                <Link href="/relocation" className="hover:text-red-500 transition-colors">
                  Live Relocation & Allocation Hub
                </Link>
              </li>
              <li>
                <Link href="/shelters" className="hover:text-red-500 transition-colors">
                  Safe Shelters & Capacity Matrix
                </Link>
              </li>
              <li>
                <Link href="/predictions" className="hover:text-red-500 transition-colors">
                  50-Yr Historical & ML Predictions
                </Link>
              </li>
              <li>
                <Link href="/admin" className="hover:text-red-500 transition-colors">
                  Responder Command Operations
                </Link>
              </li>
            </ul>
          </div>

          {/* Preparedness & Agency */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white mb-3">
              Guidelines & Data
            </h4>
            <ul className="space-y-2 text-xs font-medium">
              <li>
                <Link href="/resources" className="hover:text-red-500 transition-colors">
                  Community SOPs & Go-Bag Checklists
                </Link>
              </li>
              <li>
                <Link href="/resources#crowdsource" className="hover:text-red-500 transition-colors">
                  Crowdsourced Hazard Incident Reporting
                </Link>
              </li>
              <li>
                <Link href="/predictions#simulation" className="hover:text-red-500 transition-colors">
                  Disaster Simulation Sandbox
                </Link>
              </li>
              <li className="text-slate-400 dark:text-slate-500 pt-2 text-[11px]">
                Powered by OpenStreetMap, IMD, USGS, and NDMA Protocol Standards.
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="mt-8 pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-2">
          <div>© {new Date().getFullYear()} Dhristi Geo-Intelligence Platform. Built for Humanitarian Disaster Resilience.</div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center space-x-1">
              <Activity className="w-3.5 h-3.5 text-emerald-500" />
              <span>Real-Time Sensor Mesh</span>
            </span>
            <span className="inline-flex items-center space-x-1">
              <Radio className="w-3.5 h-3.5 text-red-500" />
              <span>Global SOS Node</span>
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
