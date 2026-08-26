'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { SosAlert, IncidentReport, HazardType, RiskLevel } from '@/types';

interface AppContextType {
  // Theme
  isDarkMode: boolean;
  toggleTheme: () => void;

  // SOS Modal
  isSosModalOpen: boolean;
  sosModalTab: 'citizen' | 'responder';
  openSosModal: (tab?: 'citizen' | 'responder') => void;
  closeSosModal: () => void;

  // SOS Alerts
  sosAlerts: SosAlert[];
  addSosAlert: (alert: Omit<SosAlert, 'id' | 'timestamp' | 'status'>) => void;
  updateSosStatus: (id: string, status: 'PENDING' | 'DISPATCHED' | 'RESCUED') => void;

  // Incident Reports
  incidentReports: IncidentReport[];
  addIncidentReport: (report: Omit<IncidentReport, 'id' | 'timestamp' | 'status' | 'upvotes'>) => void;
  upvoteIncident: (id: string) => void;

  // User Location
  userCoordinates: [number, number];
  setUserCoordinates: (coords: [number, number]) => void;
  isLocating: boolean;
  requestUserLocation: () => Promise<void>;
  locationError: string | null;

  // Emergency Siren Audio
  isSirenPlaying: boolean;
  toggleEmergencySiren: () => void;
  playSosBeep: () => void;

  // Filters
  selectedHazard: HazardType | 'all';
  setSelectedHazard: (hazard: HazardType | 'all') => void;
  selectedRisk: RiskLevel | 'all';
  setSelectedRisk: (risk: RiskLevel | 'all') => void;

  // System Live Status
  activeAlertCount: number;
}

const initialSosAlerts: SosAlert[] = [
  {
    id: 'SOS-2026-001',
    timestamp: '10 mins ago',
    senderName: 'Vipin Chandran & Family',
    senderPhone: '+91 94471 99201',
    coordinates: [11.5492, 76.1265],
    addressDescription: 'House #42, Near Meppadi Church Hill, Wayanad',
    type: 'CITIZEN_SOS',
    hazardContext: 'landslide',
    status: 'DISPATCHED',
    peopleCount: 4,
    medicalAssistanceRequired: true,
    notes: 'Elderly person with restricted mobility. Mud entry into ground floor.',
  },
  {
    id: 'SOS-2026-002',
    timestamp: '18 mins ago',
    senderName: 'Manohar Semwal',
    senderPhone: '+91 98371 12345',
    coordinates: [30.5564, 79.5663],
    addressDescription: 'Upper Market Block B, Sunil Ward, Joshimath',
    type: 'CITIZEN_SOS',
    hazardContext: 'earthquake',
    status: 'PENDING',
    peopleCount: 6,
    medicalAssistanceRequired: false,
    notes: 'Structural crack widened to 4 inches; door jammed.',
  },
  {
    id: 'SOS-2026-003',
    timestamp: '35 mins ago',
    senderName: 'Rameshwar Mahato',
    senderPhone: '+91 94311 88762',
    coordinates: [26.1261, 86.6053],
    addressDescription: 'Kosi Bandh Tola 3, Supaul, Bihar',
    type: 'CITIZEN_SOS',
    hazardContext: 'flood',
    status: 'RESCUED',
    peopleCount: 5,
    medicalAssistanceRequired: false,
    notes: 'Evacuated by SDRF Motorboat team #2 to Shelter SH-004.',
  },
];

const initialIncidents: IncidentReport[] = [
  {
    id: 'INC-8891',
    reporterName: 'Arjun K.',
    contact: '+91 98471 00291',
    coordinates: [11.545, 76.135],
    hazardType: 'landslide',
    severity: 'SEVERE',
    description: 'Fresh slope cracks observed behind Tea Factory. Brown stream water discharge accelerating.',
    timestamp: '25 mins ago',
    status: 'VERIFIED',
    upvotes: 14,
  },
  {
    id: 'INC-8892',
    reporterName: 'Sunita Devi',
    contact: '+91 94310 99128',
    coordinates: [26.128, 86.612],
    hazardType: 'flood',
    severity: 'MODERATE',
    description: 'Minor culvert seepage near eastern spur #5. Local sandbagging team on site.',
    timestamp: '1 hour ago',
    status: 'VERIFIED',
    upvotes: 8,
  },
];

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isSosModalOpen, setIsSosModalOpen] = useState<boolean>(false);
  const [sosModalTab, setSosModalTab] = useState<'citizen' | 'responder'>('citizen');
  const [sosAlerts, setSosAlerts] = useState<SosAlert[]>(initialSosAlerts);
  const [incidentReports, setIncidentReports] = useState<IncidentReport[]>(initialIncidents);
  const [userCoordinates, setUserCoordinates] = useState<[number, number]>([11.5510, 76.1305]); // Default near Wayanad hotspot
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isSirenPlaying, setIsSirenPlaying] = useState<boolean>(false);

  const [selectedHazard, setSelectedHazard] = useState<HazardType | 'all'>('all');
  const [selectedRisk, setSelectedRisk] = useState<RiskLevel | 'all'>('all');

  // Handle Dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode(prev => !prev);

  const openSosModal = (tab: 'citizen' | 'responder' = 'citizen') => {
    setSosModalTab(tab);
    setIsSosModalOpen(true);
  };

  const closeSosModal = () => setIsSosModalOpen(false);

  const addSosAlert = (alert: Omit<SosAlert, 'id' | 'timestamp' | 'status'>) => {
    const newAlert: SosAlert = {
      ...alert,
      id: `SOS-2026-${String(sosAlerts.length + 1).padStart(3, '0')}`,
      timestamp: 'Just now',
      status: 'PENDING',
    };
    setSosAlerts(prev => [newAlert, ...prev]);
    playSosBeep();
  };

  const updateSosStatus = (id: string, status: 'PENDING' | 'DISPATCHED' | 'RESCUED') => {
    setSosAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  };

  const addIncidentReport = (report: Omit<IncidentReport, 'id' | 'timestamp' | 'status' | 'upvotes'>) => {
    const newIncident: IncidentReport = {
      ...report,
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      status: 'UNDER_REVIEW',
      upvotes: 1,
    };
    setIncidentReports(prev => [newIncident, ...prev]);
  };

  const upvoteIncident = (id: string) => {
    setIncidentReports(prev => prev.map(inc => inc.id === id ? { ...inc, upvotes: inc.upvotes + 1 } : inc));
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
        console.warn('Geolocation failed, keeping default coordinates:', err.message);
        setLocationError(`Could not access GPS (${err.message}). Using regional simulation coordinates.`);
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Synthesized Web Audio API sound
  const playSosBeep = () => {
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
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
      // Audio context might be restricted before user gesture
    }
  };

  const toggleEmergencySiren = () => {
    setIsSirenPlaying(prev => !prev);
    if (!isSirenPlaying) {
      playSosBeep();
    }
  };

  const activeAlertCount = sosAlerts.filter(a => a.status === 'PENDING').length;

  return (
    <AppContext.Provider
      value={{
        isDarkMode,
        toggleTheme,
        isSosModalOpen,
        sosModalTab,
        openSosModal,
        closeSosModal,
        sosAlerts,
        addSosAlert,
        updateSosStatus,
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
