import fs from 'fs';
import path from 'path';

export interface ChatContact {
  id: string;
  name: string;
  role: 'ADMIN' | 'STAFF';
  title: string;
  unit: string;
  avatar: string;
  status: 'ONLINE' | 'STANDBY' | 'ON_DISPATCH';
  location: string;
  phone: string;
  publicKeyFingerprint: string;
}

export interface EncryptedChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'CITIZEN' | 'STAFF' | 'ADMIN';
  recipientId: string;
  recipientName: string;
  recipientRole: 'CITIZEN' | 'STAFF' | 'ADMIN';
  ciphertext: string;
  iv: string;
  algorithm: string;
  decryptedPreview?: string; // Stored for display when client decrypts
  timestamp: number;
  timeFormatted: string;
  status: 'SENT' | 'DELIVERED' | 'READ';
  verificationHash: string;
}

export const VERIFIED_CONTACTS: ChatContact[] = [
  {
    id: 'staff-admin-1',
    name: 'Dr. Rajesh Kumar',
    role: 'ADMIN',
    title: 'SEOC State Incident Commander',
    unit: 'State Disaster Management Authority (SEOC)',
    avatar: '🛡️',
    status: 'ONLINE',
    location: 'State EOC Control Room, Secretariat',
    phone: '+91 94470 11070',
    publicKeyFingerprint: 'SHA256:7B8F..E42A (SEOC-ROOT)',
  },
  {
    id: 'staff-ndrf-2',
    name: 'Capt. Ananya Iyer',
    role: 'STAFF',
    title: 'NDRF 04 Battalion Rescue Squad Lead',
    unit: 'National Disaster Response Force (NDRF)',
    avatar: '🦺',
    status: 'ONLINE',
    location: 'Wayanad Sector 4 Mountain Base',
    phone: '+91 94470 10780',
    publicKeyFingerprint: 'SHA256:3C1D..99AB (NDRF-DEPLOYED)',
  },
  {
    id: 'staff-police-3',
    name: 'Inspector K. Raghavan',
    role: 'STAFF',
    title: 'Police PCR 112 Rapid Dispatch In-Charge',
    unit: 'District Police Special Mobile Force',
    avatar: '🚓',
    status: 'ONLINE',
    location: 'Meppadi Hill Post PCR Depot',
    phone: '+91 94470 11200',
    publicKeyFingerprint: 'SHA256:A82F..44C1 (POLICE-112)',
  },
  {
    id: 'staff-shelter-4',
    name: 'Duty Officer Maya Sen',
    role: 'STAFF',
    title: 'Relief Havens & Food Logistics Officer',
    unit: 'Revenue & Relief Shelter Operations',
    avatar: '🏛️',
    status: 'ONLINE',
    location: 'Meppadi High School Relief Hub',
    phone: '+91 94470 10704',
    publicKeyFingerprint: 'SHA256:55E2..880F (SHELTER-CARRIER)',
  },
  {
    id: 'staff-medic-5',
    name: 'Dr. Arjun Nair',
    role: 'STAFF',
    title: 'Emergency Medical Trauma Specialist',
    unit: 'Disaster Mobile Medical Unit',
    avatar: '🚑',
    status: 'ONLINE',
    location: 'St. Joseph Field Trauma Triage',
    phone: '+91 94470 10800',
    publicKeyFingerprint: 'SHA256:91BB..023E (MED-TRIAGE)',
  },
];

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'secure_chats.json');

// In-memory fallback
let secureMessagesStore: EncryptedChatMessage[] = [
  {
    id: 'sec-seed-1',
    conversationId: 'conv-citizen-staff-admin-1',
    senderId: 'staff-admin-1',
    senderName: 'Dr. Rajesh Kumar',
    senderRole: 'ADMIN',
    recipientId: 'citizen-current',
    recipientName: 'Citizen',
    recipientRole: 'CITIZEN',
    ciphertext: 'U2FsdGVkX19q7Z8fE...enc(All relief corridors active. Please report your GPS coords and stranded head count.)',
    iv: 'a3f9104b28de9c1',
    algorithm: 'AES-GCM-256',
    decryptedPreview: 'SEOC Command is live on this encrypted channel. Please report your current coordinates and stranded head count if you require immediate airlift or ground PCR assistance.',
    timestamp: Date.now() - 1800000,
    timeFormatted: '11:45 PM',
    status: 'READ',
    verificationHash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
  },
];

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // serverless filesystem fallback
  }
}

export function getSecureMessages(conversationId?: string): EncryptedChatMessage[] {
  try {
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        secureMessagesStore = parsed;
      }
    }
  } catch (err) {
    console.warn('Using memory store for secure chats:', err);
  }

  if (conversationId) {
    return secureMessagesStore.filter((m) => m.conversationId === conversationId);
  }
  return secureMessagesStore;
}

export function saveSecureMessage(
  msg: Omit<EncryptedChatMessage, 'id' | 'timestamp' | 'timeFormatted' | 'verificationHash'>
): EncryptedChatMessage {
  const timestamp = Date.now();
  const timeFormatted = new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
  const verificationHash = `sha256-${Math.random().toString(36).substr(2, 12)}${Date.now()}`;

  const newMsg: EncryptedChatMessage = {
    ...msg,
    id: `sec-${timestamp}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp,
    timeFormatted,
    verificationHash,
  };

  secureMessagesStore.push(newMsg);

  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(secureMessagesStore, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not write secure message to file, kept in memory store:', err);
  }

  return newMsg;
}

export function getVerifiedContacts(): ChatContact[] {
  return VERIFIED_CONTACTS;
}
