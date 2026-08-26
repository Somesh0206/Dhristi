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
  Mic,
  MessageSquare,
  Lock,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const {
    isDarkMode,
    toggleTheme,
    openSosModal,
    activeAlertCount,
    openVoiceAssistant,
    currentUser,
    setIsAuthModalOpen,
    language,
    setLanguage,
    t,
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
          hour12: true,
        })
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const navLinks = [
    { href: '/', label: language === 'hi' ? 'अवलोकन' : 'Overview', icon: Compass },
    { href: '/red-zones', label: language === 'hi' ? 'रेड ज़ोन' : 'Red Zones', icon: MapPin },
    { href: '/shelters', label: language === 'hi' ? 'सुरक्षित आश्रय' : 'Safe Havens', icon: Building2 },
    { href: '/relocation', label: language === 'hi' ? 'पुनर्वास मार्ग' : 'Relocation Guide', icon: TrendingUp },
    { href: '/predictions', label: language === 'hi' ? 'एआई पूर्वानुमान' : 'AI Predictions', icon: SlidersHorizontal },
    { href: '/chat', label: language === 'hi' ? 'सुरक्षित चैट' : 'Secure Chat', icon: Lock },
    { href: '/resources', label: language === 'hi' ? 'आपदा गाइड' : 'SOP & Resources', icon: BookOpen },
    { href: '/admin', label: language === 'hi' ? 'नियंत्रण केंद्र' : 'SEOC Console', icon: ShieldAlert },
  ];

  const roleLabel =
    currentUser?.role === 'ADMIN'
      ? language === 'hi'
        ? 'प्रशासक'
        : 'SEOC Admin'
      : currentUser?.role === 'STAFF'
      ? language === 'hi'
        ? 'राहत दल'
        : 'Field Staff'
      : language === 'hi'
      ? 'नागरिक दर्शक'
      : 'Citizen View';

  const roleBadgeColor =
    currentUser?.role === 'ADMIN'
      ? 'bg-red-500/20 text-red-600 dark:text-red-400 border-red-500/30'
      : currentUser?.role === 'STAFF'
      ? 'bg-blue-500/20 text-blue-600 dark:text-blue-400 border-blue-500/30'
      : 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30';

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'hi' : 'en');
  };

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
            {language === 'hi' ? 'लाइव चेतावनी' : 'Live Warning'}
          </span>
          <span className="truncate">
            {language === 'hi'
              ? 'वायनाड ढलान: भारी मलबा बहाव चेतावनी | 38 बस्तियां उच्च सतर्कता पर | कोसी बेसिन: एम्बर अलर्ट'
              : 'Wayanad Escarpment: Extreme Debris Flow Warning | 38 Habitations on Pre-Evacuation Alert | Kosi River: Amber Alert Level'}
          </span>
        </div>
        <div className="hidden md:flex items-center space-x-4 shrink-0 text-slate-100 text-[11px] font-mono">
          <span>SYS CLOCK: {currentTime || 'SYNCING...'}</span>
          <span className="bg-emerald-500/20 text-emerald-200 px-1.5 py-0.5 rounded border border-emerald-400/30">
            SAT-FEED: ACTIVE
          </span>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 via-rose-600 to-amber-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-red-600/30 group-hover:scale-105 transition-transform">
                D
              </div>
              <span className="absolute -bottom-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 border-2 border-white dark:border-slate-950"></span>
              </span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center space-x-1.5">
                <span className="font-black text-lg tracking-tight text-slate-900 dark:text-white group-hover:text-red-500 transition-colors">
                  {language === 'hi' ? 'दृष्टि (DHRISTI)' : 'DHRISTI'}
                </span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-500/10 text-red-500 border border-red-500/20 uppercase tracking-wider">
                  Geo-Intel
                </span>
              </div>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 tracking-tight hidden sm:block">
                {language === 'hi' ? 'आपदा जोखिम पहचान, जीवन रक्षा' : 'Mapping Risk, Protecting Lives'}
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

          {/* Actions: Language Toggle, Voice Assistant (Vaani), Auth Badge, Theme Toggle, and ONE Combined SOS Button */}
          <div className="flex items-center space-x-1.5 sm:space-x-2">
            {/* Language Switcher Button (EN / हिन्दी) */}
            <button
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 transition-all hover:scale-105"
              title="Change Language (English / हिन्दी)"
            >
              <span className="text-sm">🌐</span>
              <span className="font-bold">{language === 'en' ? 'हिन्दी' : 'English'}</span>
            </button>

            {/* Voice Assistant Trigger Button (VAANI AI) */}
            <button
              onClick={openVoiceAssistant}
              className="flex items-center space-x-1.5 px-2.5 py-1.5 rounded-xl text-xs font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white shadow-md shadow-pink-600/20 transition-all hover:scale-105"
              title="Open Dhristi AI Voice Assistant (Vaani - Female Voice)"
            >
              <Mic className="w-3.5 h-3.5 animate-pulse" />
              <span className="hidden sm:inline">{language === 'hi' ? 'वाणी AI' : 'Vaani AI'}</span>
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

            {/* Dark / Light Toggle */}
            <button
              onClick={toggleTheme}
              title="Toggle Theme"
              className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {/* ONE Combined Universal Emergency SOS Button (Citizen, Police 112, Helplines) */}
            <button
              onClick={() => openSosModal('citizen')}
              className="relative group flex items-center space-x-2 bg-gradient-to-r from-red-600 via-rose-600 to-red-700 hover:from-red-700 hover:to-rose-700 text-white px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-black shadow-lg shadow-red-600/40 border border-red-400/30 transition-all hover:scale-105 active:scale-95"
              title="Universal Emergency SOS (Police 112, Citizen Beacon & NDRF Rescue)"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white"></span>
              </span>
              <Siren className="w-4 h-4 animate-bounce" />
              <span className="tracking-wide">{language === 'hi' ? 'आपातकालीन SOS' : 'EMERGENCY SOS'}</span>
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
          {/* Mobile Auth Role, Voice Assistant & Secure Chat */}
          <div className="grid grid-cols-3 gap-2 pb-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setIsAuthModalOpen(true);
              }}
              className={`py-2 px-2 rounded-xl border ${roleBadgeColor} font-bold text-xs flex items-center justify-center space-x-1 truncate`}
            >
              <User className="w-3.5 h-3.5" />
              <span className="truncate">{roleLabel}</span>
            </button>
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openVoiceAssistant();
              }}
              className="py-2 px-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-xs flex items-center justify-center space-x-1"
            >
              <Mic className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'वाणी AI' : 'Vaani AI'}</span>
            </button>
            <Link
              href="/chat"
              onClick={() => setMobileMenuOpen(false)}
              className="py-2 px-2 rounded-xl bg-emerald-600 text-white font-bold text-xs flex items-center justify-center space-x-1"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>{language === 'hi' ? 'सुरक्षित चैट' : 'Chat'}</span>
            </Link>
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

          {/* Unified SOS Trigger inside Mobile Drawer */}
          <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openSosModal('citizen');
              }}
              className="flex-1 py-2.5 text-center bg-gradient-to-r from-red-600 to-rose-600 text-white rounded-xl text-sm font-bold shadow flex items-center justify-center space-x-1.5"
            >
              <Siren className="w-4 h-4" />
              <span>{language === 'hi' ? '🚨 एकीकृत आपातकालीन SOS (पुलिस व आपदा)' : '🚨 Universal Emergency SOS (Police & Citizen)'}</span>
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
