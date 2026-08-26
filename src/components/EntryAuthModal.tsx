'use client';

import React, { useState } from 'react';
import { useApp, UserRole } from '@/context/AppContext';
import {
  ShieldAlert,
  ShieldCheck,
  UserCheck,
  Eye,
  Lock,
  ArrowRight,
  Sparkles,
  KeyRound,
  X,
  BadgeCheck,
} from 'lucide-react';

export default function EntryAuthModal() {
  const { isAuthModalOpen, setIsAuthModalOpen, loginAs, currentUser } = useApp();

  const [selectedRole, setSelectedRole] = useState<UserRole>('ADMIN');
  const [nameInput, setNameInput] = useState<string>('Dr. Rajesh Kumar');
  const [emailInput, setEmailInput] = useState<string>('admin.seoc@dhristi.gov.in');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');
  const [departmentInput, setDepartmentInput] = useState<string>(
    'State Emergency Operations Centre (SEOC)'
  );

  if (!isAuthModalOpen) return null;

  const handleRoleSelect = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'ADMIN') {
      setNameInput('Dr. Rajesh Kumar (SEOC Director)');
      setEmailInput('admin.seoc@dhristi.gov.in');
      setDepartmentInput('State Emergency Operations Centre (SEOC)');
    } else if (role === 'STAFF') {
      setNameInput('Capt. Ananya Iyer (NDRF Ops)');
      setEmailInput('staff.ndrf@dhristi.gov.in');
      setDepartmentInput('NDRF 10th Battalion Relief Command');
    } else {
      setNameInput('Citizen Guest Observer');
      setEmailInput('citizen@dhristi.in');
      setDepartmentInput('General Public & Community Shelter Access');
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginAs(selectedRole, nameInput, emailInput, departmentInput);
  };

  const handleQuickGuest = () => {
    loginAs('CITIZEN', 'Citizen Guest Observer', 'citizen@dhristi.in', 'General Public');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header Ribbon */}
        <div className="bg-gradient-to-r from-red-600 via-amber-600 to-red-700 p-6 text-white text-center relative">
          <button
            onClick={() => setIsAuthModalOpen(false)}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-black/20 hover:bg-black/40 text-white transition-colors"
            title="Close / Continue"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-md mx-auto flex items-center justify-center mb-2 shadow-inner">
            <ShieldAlert className="w-7 h-7 text-white animate-pulse" />
          </div>
          <h2 className="text-xl font-black tracking-wide">DHRISTI GEO-INTELLIGENCE</h2>
          <p className="text-xs text-red-100 mt-1">
            National Disaster Red-Zone & Relief Command Gateway
          </p>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-5">
          <div className="text-center space-y-1">
            <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
              Select Operational Clearance Role
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300">
              Sign in with your emergency credentials or preview the live portal.
            </p>
          </div>

          {/* Role Choice Cards */}
          <div className="grid grid-cols-3 gap-2 text-center">
            <button
              type="button"
              onClick={() => handleRoleSelect('ADMIN')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center space-y-1.5 ${
                selectedRole === 'ADMIN'
                  ? 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400 shadow-md ring-2 ring-red-500/30'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <ShieldCheck className="w-5 h-5 text-red-500" />
              <span>Admin (SEOC)</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('STAFF')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center space-y-1.5 ${
                selectedRole === 'STAFF'
                  ? 'border-blue-500 bg-blue-500/10 text-blue-600 dark:text-blue-400 shadow-md ring-2 ring-blue-500/30'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <UserCheck className="w-5 h-5 text-blue-500" />
              <span>Staff / NDRF</span>
            </button>

            <button
              type="button"
              onClick={() => handleRoleSelect('CITIZEN')}
              className={`p-3 rounded-2xl border text-xs font-bold transition-all flex flex-col items-center space-y-1.5 ${
                selectedRole === 'CITIZEN'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shadow-md ring-2 ring-emerald-500/30'
                  : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
              }`}
            >
              <Eye className="w-5 h-5 text-emerald-500" />
              <span>Citizen Guest</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-3.5 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Name / Officer Call-Sign
              </label>
              <input
                type="text"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Official Government Email
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Security Passcode / Token
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={passwordInput}
                  onChange={(e) => setPasswordInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-3" />
              </div>
            </div>

            {/* Quick Fill Demo Credentials */}
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 dark:text-slate-400 flex items-center space-x-1">
                <BadgeCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>One-Click Pre-Authenticated Demo Profile</span>
              </span>
              <button
                type="button"
                onClick={() => handleRoleSelect(selectedRole)}
                className="text-blue-500 font-bold hover:underline"
              >
                Auto-Fill
              </button>
            </div>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={handleQuickGuest}
                className="flex-1 py-3 px-4 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                Guest View
              </button>
              <button
                type="submit"
                className="flex-[2] py-3 px-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white font-bold shadow-lg shadow-red-600/30 flex items-center justify-center space-x-2 transition-all hover:scale-[1.02]"
              >
                <span>Enter as {selectedRole}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
