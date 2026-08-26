import { NextResponse } from 'next/server';
import { mockPoliceStations, governmentEmergencyDirectory } from '@/data/policeData';

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const userLat = parseFloat(searchParams.get('lat') || '11.5510');
  const userLon = parseFloat(searchParams.get('lon') || '76.1305');

  const stationsWithDistance = mockPoliceStations
    .map((st) => ({
      ...st,
      distanceKm: haversineKm(userLat, userLon, st.coordinates[0], st.coordinates[1]),
    }))
    .sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0));

  return NextResponse.json({
    success: true,
    nearestStation: stationsWithDistance[0],
    stations: stationsWithDistance,
    governmentDirectory: governmentEmergencyDirectory,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { stationId, userCoordinates, citizenPhone, urgentMessage, victimsCount } = body;

    const targetStation =
      mockPoliceStations.find((s) => s.id === stationId) || mockPoliceStations[0];

    const dispatchRecord = {
      dispatchId: `POL-DISPATCH-${Date.now().toString(36).toUpperCase()}`,
      stationName: targetStation.name,
      stationPhone: targetStation.phone,
      officerInCharge: targetStation.officerInCharge,
      assignedVehicle: `PCR-${Math.floor(Math.random() * 80 + 10)} (Emergency Beacon Active)`,
      citizenPhone: citizenPhone || '+91-98765-43210',
      victimsCount: victimsCount || 1,
      userCoordinates: userCoordinates || [11.551, 76.1305],
      urgentMessage: urgentMessage || 'IMMEDIATE POLICE RESCUE NEEDED: Trapped in landslide flash flood zone.',
      status: 'DISPATCHED_EN_ROUTE',
      etaMinutes: 6,
      dispatchedAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      message: `Emergency SOS successfully transmitted to ${targetStation.name}. Police PCR patrol vehicle dispatched.`,
      dispatch: dispatchRecord,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Police SOS dispatch failed' }, { status: 500 });
  }
}
