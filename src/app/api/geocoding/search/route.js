import { NextResponse } from 'next/server';
import { backendStore } from '@/lib/backendStore';
import { mockHabitations, mockHazardZones } from '@/data/zonesData';
import { mockPoliceStations } from '@/data/policeData';

// Comprehensive index of prominent Indian cities, mountain towns, and disaster-prone districts
const INDIAN_MAJOR_PLACES = [
  { name: 'Joshimath', district: 'Chamoli', state: 'Uttarakhand', coordinates: [30.5564, 79.5663], type: 'TOWN' },
  { name: 'Wayanad (Kalpetta)', district: 'Wayanad', state: 'Kerala', coordinates: [11.6103, 76.0828], type: 'DISTRICT_HQ' },
  { name: 'Meppadi', district: 'Wayanad', state: 'Kerala', coordinates: [11.5540, 76.1265], type: 'SETTLEMENT' },
  { name: 'Rishikesh', district: 'Dehradun', state: 'Uttarakhand', coordinates: [30.0869, 78.2676], type: 'CITY' },
  { name: 'Dehradun', district: 'Dehradun', state: 'Uttarakhand', coordinates: [30.3165, 78.0322], type: 'STATE_CAPITAL' },
  { name: 'Dharamshala', district: 'Kangra', state: 'Himachal Pradesh', coordinates: [32.2190, 76.3234], type: 'CITY' },
  { name: 'Shimla', district: 'Shimla', state: 'Himachal Pradesh', coordinates: [31.1048, 77.1734], type: 'STATE_CAPITAL' },
  { name: 'Manali', district: 'Kullu', state: 'Himachal Pradesh', coordinates: [32.2432, 77.1892], type: 'TOWN' },
  { name: 'Guwahati', district: 'Kamrup Metropolitan', state: 'Assam', coordinates: [26.1445, 91.7362], type: 'CITY' },
  { name: 'Kaziranga', district: 'Golaghat', state: 'Assam', coordinates: [26.5870, 93.3610], type: 'REGION' },
  { name: 'Silchar', district: 'Cachar', state: 'Assam', coordinates: [24.8333, 92.7789], type: 'CITY' },
  { name: 'Supaul', district: 'Supaul', state: 'Bihar', coordinates: [26.1261, 86.6053], type: 'DISTRICT_HQ' },
  { name: 'Patna', district: 'Patna', state: 'Bihar', coordinates: [25.5941, 85.1376], type: 'STATE_CAPITAL' },
  { name: 'Puri', district: 'Puri', state: 'Odisha', coordinates: [19.8135, 85.8312], type: 'COASTAL_CITY' },
  { name: 'Bhubaneswar', district: 'Khordha', state: 'Odisha', coordinates: [20.2961, 85.8245], type: 'STATE_CAPITAL' },
  { name: 'Mahad', district: 'Raigad', state: 'Maharashtra', coordinates: [18.0833, 73.4167], type: 'TOWN' },
  { name: 'Pune', district: 'Pune', state: 'Maharashtra', coordinates: [18.5204, 73.8567], type: 'CITY' },
  { name: 'Mumbai', district: 'Mumbai', state: 'Maharashtra', coordinates: [19.0760, 72.8777], type: 'METRO' },
  { name: 'Bhuj', district: 'Kutch', state: 'Gujarat', coordinates: [23.2420, 69.6669], type: 'CITY' },
  { name: 'Surat', district: 'Surat', state: 'Gujarat', coordinates: [21.1702, 72.8311], type: 'CITY' },
  { name: 'Chennai', district: 'Chennai', state: 'Tamil Nadu', coordinates: [13.0827, 80.2707], type: 'METRO' },
  { name: 'Ooty (Udhagamandalam)', district: 'The Nilgiris', state: 'Tamil Nadu', coordinates: [11.4102, 76.6950], type: 'HILL_STATION' },
  { name: 'Srinagar', district: 'Srinagar', state: 'Jammu & Kashmir', coordinates: [34.0837, 74.7973], type: 'CAPITAL' },
  { name: 'Gangtok', district: 'East Sikkim', state: 'Sikkim', coordinates: [27.3314, 88.6138], type: 'STATE_CAPITAL' },
  { name: 'Kedarnath', district: 'Rudraprayag', state: 'Uttarakhand', coordinates: [30.7352, 79.0669], type: 'PILGRIMAGE_VALLEY' },
  { name: 'Badrinath', district: 'Chamoli', state: 'Uttarakhand', coordinates: [30.7433, 79.4938], type: 'PILGRIMAGE_VALLEY' },
  { name: 'Munnar', district: 'Idukki', state: 'Kerala', coordinates: [10.0889, 77.0595], type: 'HILL_STATION' },
  { name: 'New Delhi', district: 'Central Delhi', state: 'Delhi', coordinates: [28.6139, 77.2090], type: 'NATIONAL_CAPITAL' }
];

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = (searchParams.get('q') || '').trim();

  if (!query || query.length < 2) {
    return NextResponse.json({ success: true, results: [] });
  }

  const qLower = query.toLowerCase();
  const matchedResults = [];

  // 1. Search in local Shelters & Relocation Hubs
  (backendStore.shelters || []).forEach((shelter) => {
    if (
      shelter.name.toLowerCase().includes(qLower) ||
      shelter.address.toLowerCase().includes(qLower) ||
      (shelter.district && shelter.district.toLowerCase().includes(qLower)) ||
      (shelter.state && shelter.state.toLowerCase().includes(qLower))
    ) {
      matchedResults.push({
        id: shelter.id,
        name: shelter.name,
        displayName: `${shelter.name}, ${shelter.district || ''}, ${shelter.state || ''}`,
        coordinates: shelter.coordinates,
        category: 'SHELTER',
        type: shelter.type,
        state: shelter.state,
        details: `Capacity: ${shelter.totalCapacity.toLocaleString()} | Resilience: ${shelter.resilienceScore}/100`
      });
    }
  });

  // 2. Search in Habitations & Zones
  mockHabitations.forEach((hab) => {
    if (
      hab.name.toLowerCase().includes(qLower) ||
      (hab.district && hab.district.toLowerCase().includes(qLower)) ||
      (hab.state && hab.state.toLowerCase().includes(qLower))
    ) {
      matchedResults.push({
        id: hab.id,
        name: hab.name,
        displayName: `${hab.name}, ${hab.district}, ${hab.state}`,
        coordinates: hab.coordinates,
        category: 'HABITATION',
        type: hab.hazardType,
        state: hab.state,
        details: `Risk: ${hab.riskLevel} | Pop: ${hab.population.toLocaleString()}`
      });
    }
  });

  // 3. Search in Major Indian Places
  INDIAN_MAJOR_PLACES.forEach((place) => {
    if (
      place.name.toLowerCase().includes(qLower) ||
      place.district.toLowerCase().includes(qLower) ||
      place.state.toLowerCase().includes(qLower)
    ) {
      // Avoid duplicate names if already included
      if (!matchedResults.some((r) => r.name.toLowerCase() === place.name.toLowerCase())) {
        matchedResults.push({
          id: `PLACE-${place.name.replace(/\s+/g, '-').toUpperCase()}`,
          name: place.name,
          displayName: `${place.name}, ${place.district}, ${place.state}, India`,
          coordinates: place.coordinates,
          category: 'LANDMARK',
          type: place.type,
          state: place.state,
          details: `Geocoded City/Location in ${place.state}`
        });
      }
    }
  });

  // 4. Fallback/Complement with OpenStreetMap Nominatim forward search
  try {
    const osmUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&countrycodes=in&limit=6`;
    const res = await fetch(osmUrl, {
      next: { revalidate: 3600 },
      headers: { 'User-Agent': 'Dhristi-Disaster-Management-Platform/1.0' }
    });

    if (res.ok) {
      const osmData = await res.json();
      osmData.forEach((item) => {
        const lat = parseFloat(item.lat);
        const lon = parseFloat(item.lon);
        // Only include if not within 1km of existing matches
        const alreadyExists = matchedResults.some(
          (m) => Math.hypot(m.coordinates[0] - lat, m.coordinates[1] - lon) < 0.01
        );

        if (!alreadyExists) {
          matchedResults.push({
            id: `OSM-${item.place_id}`,
            name: item.display_name.split(',')[0],
            displayName: item.display_name,
            coordinates: [lat, lon],
            category: 'OSM_GEOCODED',
            type: item.type || 'place',
            state: 'India',
            details: 'OpenStreetMap Live Geocoded Location'
          });
        }
      });
    }
  } catch (err) {
    // Network or rate limit: local results provide reliable fallback
  }

  return NextResponse.json({
    success: true,
    query,
    count: matchedResults.length,
    results: matchedResults.slice(0, 10)
  });
}
