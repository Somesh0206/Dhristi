
import { mockHabitations, mockHazardZones } from '@/data/zonesData';
import { mockShelters } from '@/data/sheltersData';

// In-Memory Data Store (Simulated database for full-stack Next.js API layer)
class BackendStore {


  zones = [...mockHazardZones];
  habitations = [...mockHabitations];
  shelters = [...mockShelters];
  sosAlerts = [
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
    notes: 'Elderly person with restricted mobility. Mud entry into ground floor.'
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
    notes: 'Structural crack widened to 4 inches; door jammed.'
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
    notes: 'Evacuated by SDRF Motorboat team #2 to Shelter SH-004.'
  }];


  incidentReports = [
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
    upvotes: 14
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
    upvotes: 8
  }];


  broadcastLogs = [
    {
      id: 'BRD-901',
      timestamp: '45 mins ago',
      targetZone: 'Wayanad Western Escarpment',
      title: 'RED ZONE MANDATORY EVACUATION',
      message: 'Debris flow trigger exceeded 45mm/hr. Evacuate immediately to Kalpetta Shelter.',
      channels: ['Cell Broadcast SMS', 'Sirens', 'HAM 145.500MHz'],
      priority: 'CRITICAL'
    }
  ];

  // Usage Telemetry Logs (Database of User Functions and Web App Activity)
  usageLogs = [
    {
      id: 'LOG-7091',
      timestamp: new Date(Date.now() - 3 * 60 * 1000).toISOString(),
      userId: 'IN-8891',
      userName: 'Dr. Rajesh Kumar',
      userRole: 'ADMIN',
      functionName: 'SafeHavenRegistration',
      action: 'REGISTER_RELOCATION_HUB',
      route: '/shelters',
      metadata: {
        facilityName: 'Meppadi High Ground Central Relief Depot',
        facilityType: 'RELOCATION_HUB',
        capacity: 4500,
        coordinates: [11.5540, 76.1280]
      }
    },
    {
      id: 'LOG-7090',
      timestamp: new Date(Date.now() - 7 * 60 * 1000).toISOString(),
      userId: 'IN-4421',
      userName: 'Capt. Ananya Iyer',
      userRole: 'STAFF',
      functionName: 'RescueDispatchCommand',
      action: 'DISPATCH_RESCUE_SQUAD',
      route: '/admin',
      metadata: {
        sosId: 'SOS-2026-001',
        squadUnit: 'NDRF 04 Bn Rapid Deployment Squad',
        recipient: 'Vipin Chandran & Family',
        urgency: 'HIGH'
      }
    },
    {
      id: 'LOG-7089',
      timestamp: new Date(Date.now() - 14 * 60 * 1000).toISOString(),
      userId: 'CITIZEN-KL-9921',
      userName: 'Vipin Chandran',
      userRole: 'CITIZEN',
      functionName: 'EmergencyDistressBeacon',
      action: 'TRIGGER_SOS_BEACON',
      route: '/relocation',
      metadata: {
        coordinates: [11.5492, 76.1265],
        peopleCount: 4,
        hazardContext: 'landslide',
        medicalAssistanceRequired: true
      }
    },
    {
      id: 'LOG-7088',
      timestamp: new Date(Date.now() - 22 * 60 * 1000).toISOString(),
      userId: 'CITIZEN-WB-1102',
      userName: 'Amitava Banerjee',
      userRole: 'CITIZEN',
      functionName: 'AlgorithmicRoadNavigation',
      action: 'CALCULATE_EVACUATION_ROUTE',
      route: '/relocation',
      metadata: {
        destination: 'St. Joseph Higher Secondary School Haven',
        distanceKm: 8.4,
        durationMins: 16,
        travelMode: 'vehicle'
      }
    },
    {
      id: 'LOG-7087',
      timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      userId: 'IN-4421',
      userName: 'Capt. Ananya Iyer',
      userRole: 'STAFF',
      functionName: 'EncryptedResponderChat',
      action: 'SEND_TACTICAL_MESSAGE',
      route: '/chat',
      metadata: {
        channel: 'NDRF Quick Reaction Team 4',
        messageType: 'ENCRYPTED_AES256',
        payloadLength: 142
      }
    },
    {
      id: 'LOG-7086',
      timestamp: new Date(Date.now() - 48 * 60 * 1000).toISOString(),
      userId: 'GUEST-OBSERVER-33',
      userName: 'Rahul Sharma',
      userRole: 'CITIZEN',
      functionName: 'VaaniVoiceAssistant',
      action: 'VOICE_ASSISTANT_QUERY',
      route: '/',
      metadata: {
        query: 'Nearest safe haven with flood resilience',
        language: 'hi',
        matchedIntent: 'FIND_NEAREST_SHELTER'
      }
    },
    {
      id: 'LOG-7085',
      timestamp: new Date(Date.now() - 65 * 60 * 1000).toISOString(),
      userId: 'IN-8891',
      userName: 'Dr. Rajesh Kumar',
      userRole: 'ADMIN',
      functionName: 'GeofencedEmergencyBroadcast',
      action: 'TRANSMIT_ALERT_BULLETIN',
      route: '/admin',
      metadata: {
        targetZone: 'ALL_RED_ZONES',
        channels: ['SMS', 'Sirens', 'HAM'],
        priority: 'CRITICAL'
      }
    },
    {
      id: 'LOG-7084',
      timestamp: new Date(Date.now() - 80 * 60 * 1000).toISOString(),
      userId: 'STAFF-UK-771',
      userName: 'Sub-Inspector Rawat',
      userRole: 'STAFF',
      functionName: 'PoliceEmergency112Dispatch',
      action: 'INITIATE_PCR_CALL',
      route: '/resources',
      metadata: {
        stationName: 'Joshimath Kotwali Emergency Post',
        contactPhone: '112 / +91-1389-222100'
      }
    },
    {
      id: 'LOG-7083',
      timestamp: new Date(Date.now() - 110 * 60 * 1000).toISOString(),
      userId: 'CITIZEN-KL-409',
      userName: 'Priya Nair',
      userRole: 'CITIZEN',
      functionName: 'GeotechnicalTelemetryInquiry',
      action: 'INSPECT_HAZARD_ZONE',
      route: '/red-zones',
      metadata: {
        zoneId: 'ZONE-01',
        zoneName: 'Meppadi Escarpment',
        riskLevel: 'RED',
        triggerValue: '54 mm/hr rainfall'
      }
    }
  ];

  // Export Reports Database (Persistent Records of Generated Operational & Usage Reports)
  exportReports = [
    {
      id: 'DISHA-REP-2026-001',
      generatedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      generatedBy: 'Dr. Rajesh Kumar (SEOC Director)',
      generatedByRole: 'ADMIN',
      title: 'DISHA National Operations & User Function Telemetry Report',
      format: 'PDF + JSON + CSV',
      summary: 'Comprehensive official PDF audit of 9 active response functions across 650+ citizen sessions and 14 emergency dispatches.',
      stats: {
        totalEventsTracked: 9,
        uniqueUsers: 6,
        sosBeaconsTriggered: 1,
        rescuesDispatched: 1,
        sheltersRegistered: 1,
        routeCalculations: 1,
        voiceSessions: 1
      },
      status: 'ARCHIVED'
    }
  ];

  constructor() {}

  logUsage(entry) {
    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}${Math.floor(Math.random() * 90 + 10)}`,
      timestamp: new Date().toISOString(),
      userId: entry.userId || 'ANON-SESSION',
      userName: entry.userName || 'Citizen Guest',
      userRole: entry.userRole || 'CITIZEN',
      functionName: entry.functionName || 'PlatformExploration',
      action: entry.action || 'PAGE_VIEW',
      route: entry.route || '/',
      metadata: entry.metadata || {}
    };
    this.usageLogs.unshift(newLog);
    if (this.usageLogs.length > 500) {
      this.usageLogs.pop();
    }
    return newLog;
  }

  createExportReport(reportData) {
    const reportRecord = {
      id: `DISHA-REP-2026-${String(this.exportReports.length + 1).padStart(3, '0')}`,
      generatedAt: new Date().toISOString(),
      generatedBy: reportData.generatedBy || 'Authorized Operator',
      generatedByRole: reportData.generatedByRole || 'ADMIN',
      title: reportData.title || 'DISHA User Activity & Operational Functions Audit Report',
      format: reportData.format || 'JSON + CSV + MD',
      summary: reportData.summary || `Audit of ${this.usageLogs.length} logged user actions and critical humanitarian dispatches.`,
      stats: reportData.stats || {
        totalEventsTracked: this.usageLogs.length,
        uniqueUsers: new Set(this.usageLogs.map((l) => l.userId)).size,
        uniqueFunctions: new Set(this.usageLogs.map((l) => l.functionName)).size
      },
      status: 'COMPLETED'
    };
    this.exportReports.unshift(reportRecord);
    return reportRecord;
  }

  static getInstance() {
    if (!BackendStore.instance) {
      BackendStore.instance = new BackendStore();
    }
    return BackendStore.instance;
  }
}

export const backendStore = BackendStore.getInstance();