
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


  broadcastLogs =







  [
  {
    id: 'BRD-901',
    timestamp: '45 mins ago',
    targetZone: 'Wayanad Western Escarpment',
    title: 'RED ZONE MANDATORY EVACUATION',
    message: 'Debris flow trigger exceeded 45mm/hr. Evacuate immediately to Kalpetta Shelter.',
    channels: ['Cell Broadcast SMS', 'Sirens', 'HAM 145.500MHz'],
    priority: 'CRITICAL'
  }];


  constructor() {}

  static getInstance() {
    if (!BackendStore.instance) {
      BackendStore.instance = new BackendStore();
    }
    return BackendStore.instance;
  }
}

export const backendStore = BackendStore.getInstance();