import fs from 'fs';
import path from 'path';

export interface VaaniChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  timestamp: number;
  language: 'en' | 'hi';
  actionRoute?: string;
  actionModal?: 'citizen' | 'police' | 'helplines' | 'responder';
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'vaani_chats.json');

// In-memory fallback / cache
let memoryStore: VaaniChatMessage[] = [
  {
    id: 'vaani-seed-1',
    sender: 'assistant',
    text: 'Namaste! I am Dhristi AI Voice Assistant (Vaani). I can help you find safe shelters, check hazard red-zones, guide evacuation routes, check weather, or trigger emergency SOS.',
    time: '12:00 AM',
    timestamp: Date.now() - 3600000,
    language: 'en',
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

export function getVaaniChats(): VaaniChatMessage[] {
  try {
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      const data = fs.readFileSync(DB_FILE, 'utf8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        memoryStore = parsed;
        return memoryStore;
      }
    }
  } catch (err) {
    console.warn('Using memory store for Vaani chats:', err);
  }
  return memoryStore;
}

export function saveVaaniChat(msg: Omit<VaaniChatMessage, 'id' | 'timestamp'>): VaaniChatMessage {
  const newMsg: VaaniChatMessage = {
    ...msg,
    id: `vaani-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
    timestamp: Date.now(),
  };

  memoryStore.push(newMsg);

  try {
    ensureDataDir();
    fs.writeFileSync(DB_FILE, JSON.stringify(memoryStore, null, 2), 'utf8');
  } catch (err) {
    console.warn('Could not write to file, kept in memory store:', err);
  }

  return newMsg;
}

export function clearVaaniChats(): void {
  memoryStore = [];
  try {
    ensureDataDir();
    if (fs.existsSync(DB_FILE)) {
      fs.writeFileSync(DB_FILE, JSON.stringify([], null, 2), 'utf8');
    }
  } catch (err) {
    console.warn('Could not clear file, cleared memory store:', err);
  }
}
