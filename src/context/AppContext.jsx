'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

import confetti from 'canvas-confetti';

import { initialCitizenSosBeacons } from '@/data/sosData';

import { getTranslation } from '@/i18n/translations';




































































































const AppContext = createContext(undefined);

export function AppProvider({ children }) {
  const [language, setLanguageState] = useState('en');
  const [isDarkMode, setIsDarkMode] = useState(true);

  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Police Emergency Hotlines State
  const [isPoliceModalOpen, setIsPoliceModalOpen] = useState(false);

  // Voice Assistant State
  const [isVoiceAssistantOpen, setIsVoiceAssistantOpen] = useState(false);

  // Map Tile Provider State
  const [mapTileProvider, setMapTileProvider] = useState('google_hybrid');

  const [isSosModalOpen, setIsSosModalOpen] = useState(false);
  const [sosModalTab, setSosModalTab] = useState('citizen');
  const [sosAlerts, setSosAlerts] = useState(initialCitizenSosBeacons);
  const [selectedSosForRoute, setSelectedSosForRoute] = useState(initialCitizenSosBeacons[0]);
  const [incidentReports, setIncidentReports] = useState([]);
  const [userCoordinates, setUserCoordinates] = useState([11.551, 76.1305]);
  const [isLocating, setIsLocating] = useState(false);
  const [locationError, setLocationError] = useState(null);
  const [isSirenPlaying, setIsSirenPlaying] = useState(false);

  // Live Sensor Fluctuation state
  const [isLiveTelemetrySimulation, setIsLiveTelemetrySimulation] = useState(true);
  const [simulatedTelemetry, setSimulatedTelemetry] = useState({
    rainfallMmHr: 52.4,
    poreWaterKPa: 142.1,
    slopeDisplacementMm: 22.8,
    seismicMagnitude: 1.8,
    soilSaturationPct: 98,
    lastUpdated: 'Live Stream Active'
  });

  const [selectedHazard, setSelectedHazard] = useState('all');
  const [selectedRisk, setSelectedRisk] = useState('all');

  const setLanguage = useCallback((lang) => {
    setLanguageState(lang);
    try {
      localStorage.setItem('dhristi_lang', lang);
    } catch {}
  }, []);

  const t = useCallback(
    (key, fallback) => {
      return getTranslation(key, language) || fallback || key;
    },
    [language]
  );

  // Load language preference from localStorage
  useEffect(() => {
    try {
      const savedLang = localStorage.getItem('dhristi_lang');
      if (savedLang === 'en' || savedLang === 'hi') {
        setLanguageState(savedLang);
      }
    } catch {}
  }, []);

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

  const loginAs = (role, name, email, department) => {
    const userObj = {
      name: name || (role === 'ADMIN' ? 'Dr. Rajesh Kumar (SEOC Director)' : role === 'STAFF' ? 'Capt. Ananya Iyer (NDRF Ops)' : 'Citizen Observer'),
      role,
      email: email || (role === 'ADMIN' ? 'admin.seoc@dhristi.gov.in' : role === 'STAFF' ? 'staff.ndrf@dhristi.gov.in' : 'citizen@dhristi.in'),
      department: department || (role === 'ADMIN' ? 'State Emergency Operations Centre (SEOC)' : role === 'STAFF' ? 'NDRF 10th Battalion Relief Command' : 'General Public'),
      badgeNumber: role !== 'CITIZEN' ? `IN-${Math.floor(1000 + Math.random() * 9000)}` : undefined
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

  // Fetch initial SOS alerts and Incidents from backend API
  const fetchBackendData = useCallback(async () => {
    try {
      const [sosRes, incRes] = await Promise.all([
      fetch('/api/sos').then((r) => r.json()),
      fetch('/api/incidents').then((r) => r.json())]
      );

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
          lastUpdated: 'Live Feed (' + new Date().toLocaleTimeString() + ')'
        };
      });
    }, 3000);
    return () => clearInterval(interval);
  }, [isLiveTelemetrySimulation]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);
  const toggleTelemetrySimulation = () => setIsLiveTelemetrySimulation((prev) => !prev);

  const openPoliceModal = () => {
    setSosModalTab('police');
    setIsSosModalOpen(true);
    setIsPoliceModalOpen(true);
  };
  const closePoliceModal = () => {
    setIsPoliceModalOpen(false);
  };

  const openVoiceAssistant = () => setIsVoiceAssistantOpen(true);
  const closeVoiceAssistant = () => setIsVoiceAssistantOpen(false);

  const openSosModal = (tab = 'citizen') => {
    setSosModalTab(tab);
    setIsSosModalOpen(true);
    if (tab === 'police') {
      setIsPoliceModalOpen(true);
    }
  };

  const closeSosModal = () => {
    setIsSosModalOpen(false);
    setIsPoliceModalOpen(false);
  };

  const addSosAlert = async (alert) => {
    try {
      const res = await fetch('/api/sos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alert)
      });
      const data = await res.json();
      if (data.success && data.alert) {
        setSosAlerts((prev) => [data.alert, ...prev]);
      }
    } catch {
      const fallback = {
        ...alert,
        id: `SOS-2026-${String(sosAlerts.length + 1).padStart(3, '0')}`,
        timestamp: 'Just now',
        status: 'PENDING'
      };
      setSosAlerts((prev) => [fallback, ...prev]);
    }
    playSosBeep();
  };

  const updateSosStatus = async (id, status) => {
    try {
      await fetch('/api/sos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId: id, status })
      });
    } catch {

      // offline fallback
    }setSosAlerts((prev) => prev.map((a) => a.id === id ? { ...a, status } : a));
  };

  const dispatchRescueTeam = async (sosId, unitName, responderNotes) => {
    const now = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const arrivalMins = Math.floor(6 + Math.random() * 8);

    setSosAlerts((prev) =>
    prev.map((alert) => {
      if (alert.id === sosId) {
        const updated = {
          ...alert,
          status: 'DISPATCHED',
          assignedUnit: unitName,
          assignedResponder: currentUser?.name || 'SEOC Rescue Officer',
          dispatchedAt: `Just now (${now})`,
          estimatedArrivalMins: arrivalMins,
          responderNotes: responderNotes || `${unitName} activated under rapid deployment protocol. ETA ${arrivalMins} minutes.`
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
          responderNotes
        })
      });
    } catch {

      // offline fallback
    }};

  const addIncidentReport = async (report) => {
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(report)
      });
      const data = await res.json();
      if (data.success && data.report) {
        setIncidentReports((prev) => [data.report, ...prev]);
      }
    } catch {
      const fallback = {
        ...report,
        id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
        timestamp: 'Just now',
        status: 'UNDER_REVIEW',
        upvotes: 1
      };
      setIncidentReports((prev) => [fallback, ...prev]);
    }
  };

  const upvoteIncident = async (id) => {
    try {
      await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'UPVOTE', reportId: id })
      });
    } catch {

      // offline fallback
    }setIncidentReports((prev) =>
    prev.map((inc) => inc.id === id ? { ...inc, upvotes: inc.upvotes + 1 } : inc)
    );
  };

  const requestUserLocation = useCallback(() => {
    return new Promise((resolve) => {
      setIsLocating(true);
      setLocationError(null);
      if (typeof window === 'undefined' || !navigator.geolocation) {
        setLocationError('Geolocation is not supported by your browser.');
        setIsLocating(false);
        resolve(userCoordinates);
        return;
      }

      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords = [pos.coords.latitude, pos.coords.longitude];
          setUserCoordinates(coords);
          setIsLocating(false);
          resolve(coords);
        },
        (err) => {
          console.warn('Geolocation notice:', err.message);
          setLocationError(`Could not acquire device GPS (${err.message}). Using regional coordinates.`);
          setIsLocating(false);
          resolve(userCoordinates);
        },
        { enableHighAccuracy: true, timeout: 7000, maximumAge: 60000 }
      );
    });
  }, [userCoordinates]);

  // Auto-acquire device location on client mount
  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setUserCoordinates([pos.coords.latitude, pos.coords.longitude]);
        },
        () => {},
        { enableHighAccuracy: true, timeout: 6000, maximumAge: 120000 }
      );
    }
  }, []);

  const playSosBeep = () => {
    try {
      const AudioCtx =
      window.AudioContext || window.webkitAudioContext;
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
    }};

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
      colors: ['#10B981', '#3B82F6', '#F59E0B', '#EF4444']
    });
  };

  const activeAlertCount = sosAlerts.filter((a) => a.status === 'PENDING').length;

  return (
    <AppContext.Provider
      value={{
        language,
        setLanguage,
        t,
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
        isVoiceAssistantOpen,
        setIsVoiceAssistantOpen,
        openVoiceAssistant,
        closeVoiceAssistant,
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
        activeAlertCount
      }}>
      
      {children}
    </AppContext.Provider>);

}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}