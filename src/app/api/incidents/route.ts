import { NextResponse } from 'next/server';
import { backendStore } from '@/lib/backendStore';
import { IncidentReport } from '@/types';

export async function GET() {
  return NextResponse.json({
    success: true,
    count: backendStore.incidentReports.length,
    reports: backendStore.incidentReports,
    timestamp: new Date().toISOString(),
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    if (body.action === 'UPVOTE') {
      const report = backendStore.incidentReports.find((r) => r.id === body.reportId);
      if (!report) {
        return NextResponse.json({ success: false, error: 'Report not found' }, { status: 404 });
      }
      report.upvotes += 1;
      return NextResponse.json({ success: true, updatedReport: report });
    }

    const { reporterName, contact, coordinates, hazardType, severity, description } = body;

    const newReport: IncidentReport = {
      id: `INC-${Math.floor(1000 + Math.random() * 9000)}`,
      reporterName: reporterName || 'Anonymous Citizen',
      contact: contact || '',
      coordinates: coordinates || [11.545, 76.135],
      hazardType: hazardType || 'landslide',
      severity: severity || 'MODERATE',
      description: description || 'Visual hazard sighting logged.',
      timestamp: 'Just now',
      status: 'UNDER_REVIEW',
      upvotes: 1,
    };

    backendStore.incidentReports.unshift(newReport);

    return NextResponse.json({
      success: true,
      message: 'Crowdsourced hazard report logged for ground verification.',
      report: newReport,
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}
