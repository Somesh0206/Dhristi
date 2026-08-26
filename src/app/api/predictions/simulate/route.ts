import { NextResponse } from 'next/server';
import { calculateSimulatedRisk } from '@/data/predictionsData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const rainfall = parseFloat(body.rainfall) || 0;
    const seismic = parseFloat(body.seismic) || 0;
    const soilSaturation = parseFloat(body.soilSaturation) || 0;
    const slopeAngle = parseFloat(body.slopeAngle) || 0;

    const result = calculateSimulatedRisk(rainfall, seismic, soilSaturation, slopeAngle);

    return NextResponse.json({
      success: true,
      inputs: {
        rainfallMmHr: rainfall,
        seismicRichter: seismic,
        soilSaturationPct: soilSaturation,
        slopeAngleDeg: slopeAngle,
      },
      analysis: result,
      timestamp: new Date().toISOString(),
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Simulation computation failed' }, { status: 500 });
  }
}
