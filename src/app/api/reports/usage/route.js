import { NextResponse } from 'next/server';
import { backendStore } from '@/lib/backendStore';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const role = searchParams.get('role');
    const limit = parseInt(searchParams.get('limit') || '100', 10);

    let logs = [...backendStore.usageLogs];

    if (role) {
      logs = logs.filter((l) => l.userRole.toLowerCase() === role.toLowerCase());
    }

    logs = logs.slice(0, limit);

    // Compute function usage breakdown
    const functionBreakdown = {};
    const roleBreakdown = { ADMIN: 0, STAFF: 0, CITIZEN: 0 };

    backendStore.usageLogs.forEach((l) => {
      functionBreakdown[l.functionName] = (functionBreakdown[l.functionName] || 0) + 1;
      if (roleBreakdown[l.userRole] !== undefined) {
        roleBreakdown[l.userRole]++;
      }
    });

    return NextResponse.json({
      success: true,
      count: logs.length,
      totalEventsTracked: backendStore.usageLogs.length,
      functionBreakdown,
      roleBreakdown,
      logs
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve usage telemetry logs' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const createdLog = backendStore.logUsage(body);
    return NextResponse.json({
      success: true,
      message: 'Usage telemetry logged successfully',
      log: createdLog
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to record usage telemetry' },
      { status: 400 }
    );
  }
}
