import type { Metadata, Viewport } from 'next';
import './globals.css';
import { AppProvider } from '@/context/AppContext';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import SosModal from '@/components/SosModal';
import EntryAuthModal from '@/components/EntryAuthModal';
import PoliceEmergencyModal from '@/components/PoliceEmergencyModal';
import VoiceAssistant from '@/components/VoiceAssistant';

export const metadata: Metadata = {
  title: 'Dhristi - Smart Geo-Intelligence for Vulnerable Habitations',
  description:
    'Dhristi - Mapping Risk, Protecting Lives: Intelligent Identification of Hazard-Based Red Zones, Carrying Capacity Assessment, and Immediate Relocation Needs for Vulnerable Habitations.',
  keywords: [
    'Dhristi',
    'Disaster Management',
    'Hazard Red Zones',
    'Carrying Capacity',
    'Immediate Relocation',
    'GIS Map',
    'Wayanad Landslides',
    'Flood Early Warning',
    'SOS Emergency',
    'Voice Assistant',
  ],
  authors: [{ name: 'Dhristi Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-50 text-slate-900 dark:bg-[#080d1a] dark:text-slate-100 font-sans min-h-screen flex flex-col selection:bg-red-500 selection:text-white">
        <AppProvider>
          <Navbar />
          <main className="flex-1 w-full">{children}</main>
          <Footer />
          <SosModal />
          <PoliceEmergencyModal />
          <VoiceAssistant />
          <EntryAuthModal />
        </AppProvider>
      </body>
    </html>
  );
}
