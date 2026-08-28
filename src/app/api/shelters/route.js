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

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      address,
      district,
      state,
      totalCapacity,
      currentOccupancy,
      coordinates,
      contactPerson,
      phone,
      type,
      facilities,
      addedByRole,
      addedByName
    } = body;

    if (!name || !coordinates || !Array.isArray(coordinates) || coordinates.length !== 2) {
      return NextResponse.json(
        { success: false, error: 'Name and valid [lat, lon] coordinates are required' },
        { status: 400 }
      );
    }

    const stateCode = (state || 'IN').substring(0, 2).toUpperCase();
    const typePrefix = type === 'RELOCATION_HUB' ? 'HUB' : 'SH';
    const newId = `${typePrefix}-${stateCode}-${Date.now().toString().slice(-4)}`;

    const cap = parseInt(totalCapacity, 10) || 500;
    const occ = parseInt(currentOccupancy, 10) || 0;

    const newShelter = {
      id: newId,
      name: name.trim(),
      address: (address || `${name}, ${district || ''}, ${state || ''}`).trim(),
      district: (district || 'Operational Sector').trim(),
      state: (state || 'Kerala').trim(),
      totalCapacity: cap,
      allocatedOccupancy: occ,
      currentOccupancy: occ,
      coordinates: [parseFloat(coordinates[0]), parseFloat(coordinates[1])],
      contactPerson: (contactPerson || 'SEOC Designated Duty Officer').trim(),
      phone: (phone || '+91 112').trim(),
      type: type || 'RELOCATION_HUB',
      status: occ / cap > 0.85 ? 'CRITICAL' : occ / cap > 0.6 ? 'MODERATE' : 'OPTIMAL',
      resilienceScore: 90,
      historicalWithstand: {
        floodLevelM: 4.0,
        earthquakeRichter: 7.0,
        cycloneWindKmph: 160,
        landslideBufferM: 600,
        pastIncidentsSurvived: 5
      },
      supplies: {
        waterLiters: cap * 10,
        waterDays: 7,
        foodRationDays: 7,
        medicalKits: Math.max(10, Math.round(cap / 30)),
        dieselGenHours: 72,
        sanitationUnits: Math.max(8, Math.round(cap / 50)),
        blankets: cap
      },
      facilities:
        facilities && Array.isArray(facilities) && facilities.length > 0
          ? facilities
          : [
              '24x7 Emergency Power & Solar Backup Grid',
              'Safe Drinking Water Purification Point',
              'Community Kitchen & Food Ration Depot',
              'First-Aid & Trauma Triage Station',
              'Rapid Relocation & Evacuation Transit Hub'
            ],
      addedByRole: addedByRole || 'STAFF',
      addedByName: addedByName || 'Authorized Officer',
      createdAt: new Date().toISOString()
    };

    backendStore.shelters.unshift(newShelter);

    return NextResponse.json(
      {
        success: true,
        shelter: newShelter,
        message: `${type === 'RELOCATION_HUB' ? 'Relocation Hub' : 'Safe Shelter'} registered successfully`
      },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json(
      { success: false, error: err.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
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

export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Shelter ID is required' }, { status: 400 });
    }

    const initialLength = backendStore.shelters.length;
    backendStore.shelters = backendStore.shelters.filter((s) => s.id !== id);

    if (backendStore.shelters.length === initialLength) {
      return NextResponse.json({ success: false, error: 'Shelter not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: 'Shelter removed successfully',
      remainingCount: backendStore.shelters.length
    });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message || 'Internal Server Error' }, { status: 500 });
  }
}