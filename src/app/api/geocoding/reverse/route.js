import { NextResponse } from 'next/server';
import { mockHabitations } from '@/data/zonesData';

function findNearestHabitation(lat, lon) {
  let nearest = mockHabitations[0];
  let minDiff = Infinity;

  mockHabitations.forEach((hab) => {
    const diff = Math.hypot(hab.coordinates[0] - lat, hab.coordinates[1] - lon);
    if (diff < minDiff) {
      minDiff = diff;
      nearest = hab;
    }
  });

  return nearest;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const lat = parseFloat(searchParams.get('lat') || '11.5510');
  const lon = parseFloat(searchParams.get('lon') || '76.1305');

  try {
    const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Dhristi-Disaster-Management-Platform/1.0' }
    });

    if (!res.ok) {
      throw new Error(`Nominatim geocoding status: ${res.status}`);
    }

    const data = await res.json();

    return NextResponse.json({
      success: true,
      service: 'OpenStreetMap Nominatim Geocoding API',
      displayName: data.display_name,
      address: {
        village: data.address?.village || data.address?.hamlet || data.address?.suburb || data.address?.city || 'Local Sector',
        district: data.address?.state_district || data.address?.county || data.address?.city || 'District',
        state: data.address?.state || 'India',
        postcode: data.address?.postcode || '',
        country: data.address?.country || 'India'
      },
      coordinates: [lat, lon],
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    const nearest = findNearestHabitation(lat, lon);
    return NextResponse.json({
      success: true,
      service: 'Dhristi Spatial Fallback Resolver',
      displayName: `${nearest.name}, ${nearest.district}, ${nearest.state}, India`,
      address: {
        village: nearest.name,
        district: nearest.district,
        state: nearest.state,
        country: 'India'
      },
      coordinates: [lat, lon],
      timestamp: new Date().toISOString()
    });
  }
}