import { NextResponse } from 'next/server';
import { backendStore } from '@/lib/backendStore';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: backendStore.broadcastLogs.length,
    logs: backendStore.broadcastLogs,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { targetZone, title, message, channels, priority } = body;

    const logEntry = {
      id: `BRD-${Math.floor(100 + Math.random() * 900)}`,
      timestamp: 'Just now',
      targetZone: targetZone || 'All Red Zones',
      title: title || 'REGIONAL DISASTER DIRECTIVE',
      message: message || 'Mandatory safety protocol activated.',
      channels: channels || ['Cell SMS (CBS)', 'Sirens'],
      priority: priority || 'HIGH',
    };

    backendStore.broadcastLogs.unshift(logEntry);

    return NextResponse.json({
      success: true,
      message: 'Emergency Broadcast successfully transmitted across designated channels.',
      broadcast: logEntry,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
