import { NextResponse } from 'next/server';
import { backendStore } from '@/lib/backendStore';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const hazard = searchParams.get('hazard');
  const risk = searchParams.get('risk');

  let zones = backendStore.zones;
  let habitations = backendStore.habitations;

  if (hazard && hazard !== 'all') {
    zones = zones.filter((z) => z.hazard === hazard);
    habitations = habitations.filter((h) => h.hazardType === hazard);
  }

  if (risk && risk !== 'all') {
    zones = zones.filter((z) => z.riskLevel === risk);
    habitations = habitations.filter((h) => h.riskLevel === risk);
  }

  return NextResponse.json({
    success: true,
    totalZones: zones.length,
    totalHabitations: habitations.length,
    zones,
    habitations,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.type === 'UPDATE_HABITATION_POPULATION') {
      const { habId, population } = body;
      const hab = backendStore.habitations.find((h) => h.id === habId);
      if (hab) {
        hab.population = population;
        return NextResponse.json({ success: true, updatedHabitation: hab });
      }
      return NextResponse.json({ success: false, error: 'Habitation not found' }, { status: 404 });
    }

    return NextResponse.json({ success: false, error: 'Invalid action type' }, { status: 400 });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
