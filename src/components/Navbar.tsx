'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import LiveDisasterFeedsModal from './LiveDisasterFeedsModal';
import {
  ShieldAlert,
  MapPin,
  Compass,
  Building2,
  TrendingUp,
  SlidersHorizontal,
  BookOpen,
  Sun,
  Moon,
  AlertTriangle,
  Menu,
  X,
  Volume2,
  VolumeX,
  Globe2,
  Siren,
  User,
  ShieldCheck,
  UserCheck,
  Eye,
  LogOut,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const {
    isDarkMode,
    toggleTheme,
    openSosModal,
    isSirenPlaying,
    toggleEmergencySiren,
    activeAlertCount,
    openPoliceModal,
    currentUser,
    setIsAuthModalOpen,
    logout,
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [isDisasterModalOpen, setIsDisasterModalOpen] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          hour12: false,
        }) + ' UTC+5:30'
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/', label: 'Overview', icon: ShieldAlert },
    { href: '/red-zones', label: 'Red-Zones GIS', icon: MapPin },
    { href: '/relocation', label: 'Relocation Hub', icon: Compass },
    { href: '/shelters', label: 'Safe Shelters', icon: Building2 },
    { href: '/predictions', label: 'AI Analytics', icon: TrendingUp },
    { href: '/admin', label: 'Command Center', icon: SlidersHorizontal },
    { href: '/resources', label: 'Awareness & SOPs', icon: BookOpen },
  ];

  const roleLabel =
    currentUser?.role === 'ADMIN'
      ? 'SEOC Admin'
      : currentUser?.role === 'STAFF'
      ? 'NDRF Staff'
      : 'Citizen Guest';

  const roleBadgeColor =
    currentUser?.role === 'ADMIN'
      ? 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
      : currentUser?.role === 'STAFF'
      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30'
      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 dark:border-slate-800/80 bg-white/90 dark:bg-slate-950/90 backdrop-blur-md transition-colors">
      {/* Real-time Ticker / Status Bar */}
      <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-700 text-white text-xs py-1 px-4 font-medium flex items-center justify-between shadow-inner">
        <div className="flex items-center space-x-2 truncate">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
          </span>
          <span className="font-bold tracking-wider uppercase text-[10px] bg-red-950/50 px-1.5 py-0.5 rounded">
            Live Warning
          </span>
          <span className="truncate">
            Wayanad Escarpment: Extreme Debris Flow Warning | 38 Habitations on Pre-Evacuation Alert | Kosi River: Amber Alert Level
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-4 shrink-0 text-slate-100 text-[11px] font-mono">
          <span>SYS CLOCK: {currentTime || 'SYNCING...'}</span>
          <span className="bg-emerald-500/20 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-400/30">
            SATELLITE & SENSORS ONLINE
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand Logo */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-amber-600 flex items-center justify-center text-white shadow-lg shadow-red-500/20 group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-6 h-6 animate-pulse" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-red-600 via-amber-500 to-orange-600 bg-clip-text text-transparent">
                  DHRISTI
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800/60">
                  Geo-Intel
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-tight hidden sm:block">
                Mapping Risk, Protecting Lives
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center space-x-1.5 px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-red-500' : 'text-slate-400'}`} />
                  <span>{link.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Actions: Police SOS, Auth Badge, Theme Toggle, Siren, SOS Trigger */}
          <div className="flex items-center space-x-2 sm:space-x-2.5">
            {/* Police SOS Button */}
            <button
              onClick={openPoliceModal}
              className="flex items-center space-x-1.5 px-2.5 py-2 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-600/20 transition-all hover:scale-105"
              title="Dispatch SOS to Nearest Police Station & Government Numbers"
            >
              <Siren className="w-3.5 h-3.5 animate-bounce" />
              <span className="hidden sm:inline">Police SOS</span>
            </button>

            {/* Auth / Role Indicator */}
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className={`hidden md:flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold border ${roleBadgeColor} hover:opacity-80 transition-all`}
              title="Switch Clearance Role (Admin / Staff / Citizen)"
            >
              {currentUser?.role === 'ADMIN' ? (
                <ShieldCheck className="w-3.5 h-3.5 text-red-500" />
              ) : currentUser?.role === 'STAFF' ? (
                <UserCheck className="w-3.5 h-3.5 text-blue-500" />
              ) : (
                <Eye className="w-3.5 h-3.5 text-emerald-500" />
              )}
              <span>{roleLabel}</span>
            </button>

            {/* Siren audio simulation toggle */}
            <button
              onClick={toggleEmergencySiren}
              title={isSirenPlaying ? 'Mute Alert Siren' : 'Test Emergency Siren'}
              className={`p-2 rounded-lg text-xs font-medium border transition-colors ${
                isSirenPlaying
                  ? 'bg-amber-500/20 text-amber-500 border-amber-500/40 animate-pulse'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700'
              }`}
            >
              {isSirenPlaying ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* Red Floating Emergency Button */}
            <button
              onClick={() => openSosModal('citizen')}
              className="relative group flex items-center space-x-2 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-red-600/30 transition-all hover:scale-105 active:scale-95"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <span className="tracking-wide">SOS</span>
              {activeAlertCount > 0 && (
                <span className="bg-red-950 text-white text-[10px] px-1.5 py-0.5 rounded-full font-bold">
                  {activeAlertCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 pt-3 pb-6 space-y-2">
          {/* Mobile Auth Role & Police Action */}
          <div className="grid grid-cols-2 gap-2 pb-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className={`py-2 px-3 rounded-xl border ${roleBadgeColor} font-bold text-xs flex items-center justify-center space-x-1`}
            >
              <User className="w-3.5 h-3.5" />
              <span>Role: {roleLabel}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openPoliceModal();
              }}
              className="py-2 px-3 rounded-xl bg-blue-600 text-white font-bold text-xs flex items-center justify-center space-x-1"
            >
              <Siren className="w-3.5 h-3.5" />
              <span>Police SOS</span>
            </button>
          </div>
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-red-500/10 text-red-600 dark:text-red-400 font-semibold'
                    : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5 text-red-500" />
                <span>{link.label}</span>
              </Link>
            );
          })}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSosModal('citizen');
              }}
              className="flex-1 py-2.5 text-center bg-red-600 text-white rounded-xl text-sm font-bold shadow"
            >
              Broadcast Citizen SOS
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSosModal('responder');
              }}
              className="flex-1 py-2.5 text-center bg-slate-800 text-white rounded-xl text-sm font-semibold border border-slate-700"
            >
              Incident Dispatch
            </button>
          </div>
        </div>
      )}

      {/* Live Disaster Feeds Modal */}
      <LiveDisasterFeedsModal
        isOpen={isDisasterModalOpen}
        onClose={() => setIsDisasterModalOpen(false)}
      />
    </header>
  );
}

