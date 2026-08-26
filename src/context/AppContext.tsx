'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { SosAlert, IncidentReport, HazardType, RiskLevel, SensorTelemetry } from '@/types';
import confetti from 'canvas-confetti';

import { initialCitizenSosBeacons } from '@/data/sosData';

export type UserRole = 'ADMIN' | 'STAFF' | 'CITIZEN';

export interface UserSession {
  name: string;
  role: UserRole;
  email?: string;
  department?: string;
  badgeNumber?: string;
}

export type MapTileProvider =
  | 'google_hybrid'
  | 'google_terrain'
  | 'google_roadmap'
  | 'esri_satellite'
  | 'osm';

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // Authentication & Role
  currentUser: UserSession | null;
  loginAs: (role: UserRole, name?: string, email?: string, department?: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;

  // Police Emergency & Hotlines Modal
  isPoliceModalOpen: boolean;
  setIsPoliceModalOpen: (open: boolean) => void;
  openPoliceModal: () => void;
  closePoliceModal: () => void;

  // Map Tile Provider (Google Maps / Apple Maps Esri / OSM)
  mapTileProvider: MapTileProvider;
  setMapTileProvider: (provider: MapTileProvider) => void;

  // SOS Modal
  isSosModalOpen: boolean;
  sosModalTab: 'citizen' | 'responder';
  openSosModal: (tab?: 'citizen' | 'responder') => void;
  closeSosModal: () => void;

  // SOS Alerts & Rescue Response
  sosAlerts: SosAlert[];
  addSosAlert: (alert: Omit<SosAlert, 'id' | 'timestamp' | 'status'>) => Promise<void>;
  updateSosStatus: (id: string, status: 'PENDING' | 'DISPATCHED' | 'RESCUED') => Promise<void>;
  dispatchRescueTeam: (sosId: string, unitName: string, responderNotes?: string) => Promise<void>;
  selectedSosForRoute: SosAlert | null;
  setSelectedSosForRoute: (sos: SosAlert | null) => void;

  // Incident Reports (Synced with Backend /api/incidents)
  incidentReports: IncidentReport[];
  addIncidentReport: (report: Omit<IncidentReport, 'id' | 'timestamp' | 'status' | 'upvotes'>) => Promise<void>;
  upvoteIncident: (id: string) => Promise<void>;

  // User Location
  userCoordinates: [number, number];
  setUserCoordinates: (coords: [number, number]) => void;
  isLocating: boolean;
  requestUserLocation: () => Promise<void>;
  locationError: string | null;

  // Emergency Siren Audio & Speech
  isSirenPlaying: boolean;
  toggleEmergencySiren: () => void;
  playSosBeep: () => void;

  // Live Telemetry Fluctuation & Simulation
  isLiveTelemetrySimulation: boolean;
  toggleTelemetrySimulation: () => void;
  simulatedTelemetry: SensorTelemetry;

  // Celebration Fireworks / Confetti
  triggerEvacuationCelebration: () => void;

  // Filters
  selectedHazard: HazardType | 'all';
  setSelectedHazard: (hazard: HazardType | 'all') => void;
  selectedRisk: RiskLevel | 'all';
  setSelectedRisk: (risk: RiskLevel | 'all') => void;

  // System Live Status
  activeAlertCount: number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState<UserSession | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  // Police Emergency Hotlines State
  const [isPoliceModalOpen, setIsPoliceModalOpen] = useState<boolean>(false);

  // Map Tile Provider State
  const [mapTileProvider, setMapTileProvider] = useState<MapTileProvider>('google_hybrid');

  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [sosModalTab, setSosModalTab] = useState<'citizen' | 'responder'>('citizen');
  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>(initialCitizenSosBeacons);
  const [selectedSosForRoute, setSelectedSosForRoute] = useState<SosAlert | null>(initialCitizenSosBeacons[0]);
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>([]);
  const [userCoordinates, setUserCoordinates] = useState<[number, number]>([11.551, 76.1305]);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);

  // Live Sensor Fluctuation state
  const [isLiveTelemetrySimulation, setIsLiveTelemetrySimulation] = useState<boolean>(true);
  const [simulatedTelemetry, setSimulatedTelemetry] = useState<SensorTelemetry>({
    rainfallMmHr: 52.4,
    poreWaterKPa: 142.1,
    slopeDisplacementMm: 22.8,
    seismicMagnitude: 1.8,
    soilSaturationPct: 98,
    lastUpdated: 'Live Stream Active',
  });

  const [selectedHazard, setSelectedHazard] = useState<HazardType | 'all'>('all');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all');

  // Trigger login modal on initial site entry if not already logged in
  useEffect(() => {
    const savedUser = sessionStorage.getItem('dhristi_user');
    if (savedUser) {
      try {
        setCurrentUser(JSON.parse(savedUser));
      } catch {
        setIsAuthModalOpen(true);
      }
    } else {
      // First visit: pop up the Admin/Staff login modal
      setIsAuthModalOpen(true);
    }
  }, []);

  const loginAs = (role: UserRole, name?: string, email?: string, department?: string) => {
    const userObj: UserSession = {
      name: name || (role === 'ADMIN' ? 'Dr. Rajesh Kumar (SEOC Director)' : role === 'STAFF' ? 'Capt. Ananya Iyer (NDRF Ops)' : 'Citizen Observer'),
      role,
      email: email || (role === 'ADMIN' ? 'admin.seoc@dhristi.gov.in' : role === 'STAFF' ? 'staff.ndrf@dhristi.gov.in' : 'citizen@dhristi.in'),
      department: department || (role === 'ADMIN' ? 'State Emergency Operations Centre (SEOC)' : role === 'STAFF' ? 'NDRF 10th Battalion Relief Command' : 'General Public'),
      badgeNumber: role !== 'CITIZEN' ? `IN-${Math.floor(1000 + Math.random() * 9000)}` : undefined,
    };
    setCurrentUser(userObj);
    sessionStorage.setItem('dhristi_user', JSON.stringify(userObj));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setCurrentUser(null);
    sessionStorage.removeItem('dhristi_user');
    setIsAuthModalOpen(true);
  };

  const openPoliceModal = () => setIsPoliceModalOpen(true);
  const closePoliceModal = () => setIsPoliceModalOpen(false);

  // Fetch initial SOS alerts and Incidents from backend API
  const fetchBackendData = useCallback(async () => {
    try {
      const [sosRes, incRes] = await Promise.all([
        fetch('/api/sos').then((r) => r.json()),
        fetch('/api/incidents').then((r) => r.json()),
      ]);

      if (sosRes.success) setSosAlerts(sosRes.alerts);
      if (incRes.success) setIncidentReports(incRes.reports);
    } catch {
      console.warn('Backend API initial fetch fallback to local store');
    }
  }, []);

  useEffect(() => {
    fetchBackendData();
  }, [fetchBackendData]);

  // Handle Dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Dynamic Telemetry Pulse Simulation
  useEffect(() => {
    if (!isLiveTelemetrySimulation) return;
    const interval = setInterval(() => {
      setSimulatedTelemetry((prev) => {
        const deltaRain = (Math.random() * 2.4 - 1.1).toFixed(1);
        const deltaPore = (Math.random() * 1.6 - 0.7).toFixed(1);
        const deltaSeismic = (Math.random() * 0.2 - 0.1).toFixed(1);

        const newRain = Math.max(10, Math.min(95, parseFloat((prev.rainfallMmHr + parseFloat(deltaRain)).toFixed(1))));
        const newPore = Math.max(50, Math.min(180, parseFloat((prev.poreWaterKPa + parseFloat(deltaPore)).toFixed(1))));
        const newSeismic = Math.max(0.5, Math.min(4.5, parseFloat((prev.seismicMagnitude + parseFloat(deltaSeismic)).toFixed(1))));

        return {
          ...prev,
          rainfallMmHr: newRain,
          poreWaterKPa: newPore,
          seismicMagnitude: newSeismic,
          lastUpdated: 'Live Feed (' + new Date().toLocaleTimeString() + ')',
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isLiveTelemetrySimulation]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const toggleTelemetrySimulation = () => setIsLiveTelemetrySimulation((prev) => !prev);

  const openSosModal = (tab: 'citizen' | 'responder' = 'citizen') => {
    setSosModalTab(tab);
    setIsSosModalOpen(true);
  };

  const closeSosModal = () => setIsSosModalOpen(false);

  const addSosAlert = async (alert: Omit<SosAlert, 'id' | 'timestamp' | 'status'>) => {
    try {
      const res = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert),
      });
      const data = await res.json();
      if (data.success && data.alert) {
        setSosAlerts((prev) => [data.alert, ...prev]);
      }
    } catch {
      const fallback: SosAlert = {
        ...alert,
        id: `SOS-2026-${String(sosAlerts.length + 1).padStart(3, '0')}`,
        timestamp: 'Just now',
        status: 'PENDING',
      };
      setSosAlerts((prev) => [fallback, ...prev]);
    }
    playSosBeep();
  };

  const updateSosStatus = async (id: string, status: 'PENDING' | 'DISPATCHED' | 'RESCUED') => {
    try {
      await fetch('/api/sos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId: id, status }),
      });
    } catch {
      // offline fallback
    }
    setSosAlerts((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)));
  };

  const dispatchRescueTeam = async (sosId: string, unitName: string, responderNotes?: string) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const arrivalMins = Math.floor(6 + Math.random() * 8);

    setSosAlerts((prev) =>
      prev.map((alert) => {
        if (alert.id === sosId) {
          const updated: SosAlert = {
            ...alert,
            status: 'DISPATCHED',
            assignedUnit: unitName,
            assignedResponder: currentUser?.name || 'SEOC Rescue Officer',
            dispatchedAt: `Just now (${now})`,
            estimatedArrivalMins: arrivalMins,
            responderNotes: responderNotes || `${unitName} activated under rapid deployment protocol. ETA ${arrivalMins} minutes.`,
          };
          // Also set as active route
          setSelectedSosForRoute(updated);
          return updated;
        }
        return alert;
      })
    );

    try {
      await fetch('/api/sos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          alertId: sosId,
          status: 'DISPATCHED',
          assignedUnit: unitName,
          responderNotes,
        }),
      });
    } catch {
      // offline fallback
    }
  };

  const addIncidentReport = async (report: Omit<IncidentReport, 'id' | 'timestamp' | 'status' | 'upvotes'>) => {
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report),
      });
      const data = await res.json();
      if (data.success && data.report) {
        setIncidentReports((prev) => [data.report, ...prev]);
      }
    } catch {
      const fallback: IncidentReport = {
        ...report,
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Just now',
        status: 'UNDER_REVIEW',
        upvotes: 1,
      };
      setIncidentReports((prev) => [fallback, ...prev]);
    }
  };

  const upvoteIncident = async (id: string) => {
    try {
      await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPVOTE', reportId: id }),
      });
    } catch {
      // offline fallback
    }
    setIncidentReports((prev) =>
      prev.map((inc) => (inc.id === id ? { ...inc, upvotes: inc.upvotes + 1 } : inc))
    );
  };

  const requestUserLocation = async () => {
    setIsLocating(true);
    setLocationError(null);
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by your browser.');
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserCoordinates([pos.coords.latitude, pos.coords.longitude]);
        setIsLocating(false);
      },
      (err) => {
        console.warn('Geolocation error:', err.message);
        setLocationError(`Could not access GPS (${err.message}). Using Wayanad regional coordinates.`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  const playSosBeep = () => {
    try {
      const AudioCtx =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(440, ctx.currentTime + 0.4);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.4);
    } catch {
      // User gesture restrictions
    }
  };

  const toggleEmergencySiren = () => {
    setIsSirenPlaying((prev) => !prev);
    if (!isSirenPlaying) {
      playSosBeep();
    }
  };

  const triggerEvacuationCelebration = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444'],
    });
  };

  const activeAlertCount = sosAlerts.filter((a) => a.status === 'PENDING').length;

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        currentUser,
        loginAs,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen,
        isPoliceModalOpen,
        setIsPoliceModalOpen,
        openPoliceModal,
        closePoliceModal,
        mapTileProvider,
        setMapTileProvider,
        isSosModalOpen,
        sosModalTab,
        openSosModal,
        closeSosModal,
        sosAlerts,
        addSosAlert,
        updateSosStatus,
        dispatchRescueTeam,
        selectedSosForRoute,
        setSelectedSosForRoute,
        incidentReports,
        addIncidentReport,
        upvoteIncident,
        userCoordinates,
        setUserCoordinates,
        isLocating,
        requestUserLocation,
        locationError,
        isSirenPlaying,
        toggleEmergencySiren,
        playSosBeep,
        isLiveTelemetrySimulation,
        toggleTelemetrySimulation,
        simulatedTelemetry,
        triggerEvacuationCelebration,
        selectedHazard,
        setSelectedHazard,
        selectedRisk,
        setSelectedRisk,
        activeAlertCount,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
