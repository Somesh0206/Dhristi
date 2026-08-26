---
name: disaster-evacuation-router
description: Calculates safest road evacuation corridors and shelter assignments avoiding hazardous red zones.
---

# Disaster Evacuation Router Skill

## Overview
The `disaster-evacuation-router` skill enables autonomous agents to analyze user coordinates, identify nearest safe havens (Schools, Hospitals, Stadiums, and Government Offices), calculate OSRM road routes, and evaluate elevation and slope gradients to ensure citizens and responders navigate around flooded or landslide-compromised roadways.

## Capabilities
1. **Haversine & Elevation Filtering**: Filters candidate safe shelters within a 25 km radius that have remaining available carrying capacity.
2. **OSRM Road Network Computation**: Queries Open Source Routing Machine (`/api/routing/osrm`) to obtain realistic turn-by-turn road maneuvers.
3. **Hazard Bounding Box Check**: Validates that road waypoints do not intersect active Red Zones or high pore-water pressure areas.
4. **Transit Mode Adaptation**: Calculates speed, travel duration, and terrain difficulty for both **On Foot** ($4.5\text{ km/h}$) and **4x4 Transit Vehicles** ($35\text{ km/h}$).

## Input Parameters
- `originCoords`: `[latitude, longitude]`
- `targetShelterCategory`: `'ALL' | 'SCHOOL' | 'HOSPITAL' | 'STADIUM' | 'GOVT_OFFICE'`
- `transitMode`: `'foot' | 'vehicle'`
- `avoidHazardZones`: `boolean`

## Output Format
```json
{
  "assignedShelter": {
    "id": "SH-WYD-01",
    "name": "Meppadi Govt Higher Secondary School",
    "category": "SCHOOL",
    "coordinates": [11.552, 76.128],
    "availableCapacity": 470
  },
  "route": {
    "distanceKm": 3.8,
    "estimatedDurationMins": 14,
    "elevationGainMeters": 68,
    "safetyStatus": "CLEAR_OF_RED_ZONES",
    "maneuvers": [
      "Head northeast on SH59 toward Meppadi Bypass",
      "Turn right at Chembra Valley Junction onto Relief Corridor 2",
      "Arrive at School Evacuation Center Gate A"
    ]
  }
}
```
