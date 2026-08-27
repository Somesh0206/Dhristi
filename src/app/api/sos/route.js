import { NextResponse } from 'next/server';
import { backendStore } from '@/lib/backendStore';


export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');

  let alerts = backendStore.sosAlerts;
  if (status) {
    alerts = alerts.filter((a) => a.status === status);
  }

  return NextResponse.json({
    success: true,
    total: alerts.length,
    pending: alerts.filter((a) => a.status === 'PENDING').length,
    dispatched: alerts.filter((a) => a.status === 'DISPATCHED').length,
    rescued: alerts.filter((a) => a.status === 'RESCUED').length,
    alerts,
    timestamp: new Date().toISOString()
  });
}

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      senderName,
      senderPhone,
      coordinates,
      addressDescription,
      type,
      hazardContext,
      peopleCount,
      medicalAssistanceRequired,
      notes
    } = body;

    if (!coordinates || !senderPhone) {
      return NextResponse.json(
        { success: false, error: 'Coordinates and sender phone are required' },
        { status: 400 }
      );
    }

    const newAlert = {
      id: `SOS-2026-${String(backendStore.sosAlerts.length + 1).padStart(3, '0')}`,
      timestamp: 'Just now',
      senderName: senderName || 'Anonymous Citizen',
      senderPhone,
      coordinates,
      addressDescription: addressDescription || 'Hazard Zone coordinates captured',
      type: type || 'CITIZEN_SOS',
      hazardContext: hazardContext || 'landslide',
      status: 'PENDING',
      peopleCount: peopleCount || 1,
      medicalAssistanceRequired: !!medicalAssistanceRequired,
      notes: notes || ''
    };

    backendStore.sosAlerts.unshift(newAlert);

    return NextResponse.json({
      success: true,
      message: 'SOS Alert dispatched to SEOC and rescue nodes successfully.',
      alert: newAlert
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { alertId, status } = body;

    const alert = backendStore.sosAlerts.find((a) => a.id === alertId);
    if (!alert) {
      return NextResponse.json({ success: false, error: 'Alert not found' }, { status: 404 });
    }

    alert.status = status;
    return NextResponse.json({
      success: true,
      updatedAlert: alert
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}