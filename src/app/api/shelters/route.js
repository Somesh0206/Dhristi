import { NextResponse } from 'next/server';
import { backendStore } from '@/lib/backendStore';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const search = searchParams.get('search');

  let shelters = backendStore.shelters;

  if (type && type !== 'ALL') {
    shelters = shelters.filter((s) => s.type === type);
  }

  if (search) {
    const q = search.toLowerCase();
    shelters = shelters.filter(
      (s) =>
      s.name.toLowerCase().includes(q) ||
      s.district.toLowerCase().includes(q) ||
      s.address.toLowerCase().includes(q)
    );
  }

  const totalCapacity = shelters.reduce((acc, curr) => acc + curr.totalCapacity, 0);
  const totalOccupancy = shelters.reduce((acc, curr) => acc + curr.currentOccupancy, 0);

  return NextResponse.json({
    success: true,
    count: shelters.length,
    totalCapacity,
    totalOccupancy,
    remainingBuffer: totalCapacity - totalOccupancy,
    shelters,
    timestamp: new Date().toISOString()
  });
}

export async function PATCH(request) {
  try {
    const body = await request.json();
    const { shelterId, additionalEvacuees } = body;

    const shelter = backendStore.shelters.find((s) => s.id === shelterId);
    if (!shelter) {
      return NextResponse.json({ success: false, error: 'Shelter not found' }, { status: 404 });
    }

    shelter.allocatedOccupancy += additionalEvacuees || 1;
    shelter.currentOccupancy += additionalEvacuees || 1;

    return NextResponse.json({
      success: true,
      updatedShelter: shelter,
      stressPct: Math.round(shelter.currentOccupancy / shelter.totalCapacity * 100)
    });
  } catch {
    return NextResponse.json({ success: false, error: 'Internal Server Error' }, { status: 500 });
  }
}