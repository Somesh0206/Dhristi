// Dhristi Geo-Intelligence Platform: Pan-India Habitations and Hazard Monitoring Zones

export const mockHabitations = [
  // 1. KERALA (Western Ghats Landslide & Flood)
  {
    id: 'HAB-001',
    name: 'Meppadi Slope Settlement',
    district: 'Wayanad',
    state: 'Kerala',
    population: 1420,
    households: 310,
    vulnerabilityScore: 92,
    hazardType: 'landslide',
    riskLevel: 'RED',
    elevationM: 890,
    slopeAngleDeg: 42,
    assignedShelterId: 'SH-KL-001',
    coordinates: [11.5492, 76.1265],
    telemetry: {
      rainfallMmHr: 48.6,
      poreWaterKPa: 124.5,
      slopeDisplacementMm: 18.2,
      seismicMagnitude: 1.4,
      soilSaturationPct: 96,
      lastUpdated: '2 mins ago'
    },
    immediateRelocationNeeded: true,
    relocationPriority: 'CRITICAL',
    recommendedActions: [
      'Immediate evacuation within 45 mins',
      'Deploy SDRF rescue boats & high-mobility 4x4s',
      'Cut off local low-tension power grid to prevent electrocution'
    ]
  },
  {
    id: 'HAB-002',
    name: 'Chooralmala Riverbank Colony',
    district: 'Wayanad',
    state: 'Kerala',
    population: 2180,
    households: 490,
    vulnerabilityScore: 96,
    hazardType: 'flood',
    riskLevel: 'RED',
    elevationM: 670,
    slopeAngleDeg: 28,
    assignedShelterId: 'SH-KL-001',
    coordinates: [11.5368, 76.1482],
    telemetry: {
      rainfallMmHr: 52.4,
      poreWaterKPa: 142.1,
      slopeDisplacementMm: 22.8,
      seismicMagnitude: 1.8,
      soilSaturationPct: 98,
      lastUpdated: 'Just now'
    },
    immediateRelocationNeeded: true,
    relocationPriority: 'CRITICAL',
    recommendedActions: [
      'Sound regional warning siren #04',
      'Relocate elderly and infants to higher elevation shelter SH-KL-001',
      'Close bridge at Chaliyar tributary'
    ]
  },
  {
    id: 'HAB-004',
    name: 'Munnar Tea Valley Habitation',
    district: 'Idukki',
    state: 'Kerala',
    population: 1650,
    households: 340,
    vulnerabilityScore: 68,
    hazardType: 'landslide',
    riskLevel: 'ORANGE',
    elevationM: 1520,
    slopeAngleDeg: 34,
    assignedShelterId: 'SH-KL-004',
    coordinates: [10.0889, 77.0595],
    telemetry: {
      rainfallMmHr: 28.5,
      poreWaterKPa: 72.0,
      slopeDisplacementMm: 6.4,
      seismicMagnitude: 0.8,
      soilSaturationPct: 81,
      lastUpdated: '12 mins ago'
    },
    immediateRelocationNeeded: false,
    relocationPriority: 'HIGH',
    recommendedActions: [
      'Pre-evacuation alert staged for tea estate quarters',
      'Monitor rain gauge thresholds (>35mm/hr trigger)',
      'Prepare buses at Munnar depot for standby transit'
    ]
  },

  // 2. UTTARAKHAND (Himalayan Tectonic Subsidence & Flash Flood)
  {
    id: 'HAB-003',
    name: 'Joshimath Sunil & Manohar Ward',
    district: 'Chamoli',
    state: 'Uttarakhand',
    population: 1890,
    households: 380,
    vulnerabilityScore: 88,
    hazardType: 'earthquake',
    riskLevel: 'RED',
    elevationM: 1890,
    slopeAngleDeg: 38,
    assignedShelterId: 'SH-UK-001',
    coordinates: [30.5564, 79.5663],
    telemetry: {
      rainfallMmHr: 12.2,
      poreWaterKPa: 85.0,
      slopeDisplacementMm: 34.1,
      seismicMagnitude: 3.2,
      soilSaturationPct: 74,
      lastUpdated: '5 mins ago'
    },
    immediateRelocationNeeded: true,
    relocationPriority: 'CRITICAL',
    recommendedActions: [
      'Structural crack monitoring alarm active',
      'Evacuate 38 cracked commercial/residential buildings to Joshimath High-Ground Hub (SH-UK-001)',
      'Redirect bypass transport away from subsidence fracture zone'
    ]
  },
  {
    id: 'HAB-007',
    name: 'Dehradun Highland Ridge',
    district: 'Dehradun',
    state: 'Uttarakhand',
    population: 4100,
    households: 850,
    vulnerabilityScore: 24,
    hazardType: 'earthquake',
    riskLevel: 'GREEN',
    elevationM: 920,
    slopeAngleDeg: 12,
    assignedShelterId: 'SH-UK-003',
    coordinates: [30.3165, 78.0322],
    telemetry: {
      rainfallMmHr: 4.2,
      poreWaterKPa: 22.0,
      slopeDisplacementMm: 0.2,
      seismicMagnitude: 1.1,
      soilSaturationPct: 38,
      lastUpdated: '20 mins ago'
    },
    immediateRelocationNeeded: false,
    relocationPriority: 'LOW',
    recommendedActions: [
      'Stable geological bedrock',
      'Functioning as staging zone for Chamoli regional aid',
      'Routine telemetry monitoring'
    ]
  },

  // 3. HIMACHAL PRADESH (Mountain Slopes & Seismic Faults)
  {
    id: 'HAB-009',
    name: 'Dharamshala McLeodganj Slope Enclave',
    district: 'Kangra',
    state: 'Himachal Pradesh',
    population: 2300,
    households: 480,
    vulnerabilityScore: 76,
    hazardType: 'landslide',
    riskLevel: 'ORANGE',
    elevationM: 2082,
    slopeAngleDeg: 36,
    assignedShelterId: 'SH-HP-001',
    coordinates: [32.2426, 76.3213],
    telemetry: {
      rainfallMmHr: 31.5,
      poreWaterKPa: 78.2,
      slopeDisplacementMm: 9.8,
      seismicMagnitude: 2.1,
      soilSaturationPct: 83,
      lastUpdated: '8 mins ago'
    },
    immediateRelocationNeeded: false,
    relocationPriority: 'HIGH',
    recommendedActions: [
      'Slope seepage monitoring on Bhagsu road',
      'Staging evacuation fleet towards Dharamshala HPCA Complex (SH-HP-001)'
    ]
  },

  // 4. BIHAR (Kosi & Ganga Inundation Plains)
  {
    id: 'HAB-005',
    name: 'Kosi Lowland Habitation Cluster',
    district: 'Supaul',
    state: 'Bihar',
    population: 3400,
    households: 720,
    vulnerabilityScore: 84,
    hazardType: 'flood',
    riskLevel: 'RED',
    elevationM: 58,
    slopeAngleDeg: 3,
    assignedShelterId: 'SH-BR-001',
    coordinates: [26.1261, 86.6053],
    telemetry: {
      rainfallMmHr: 39.0,
      poreWaterKPa: 60.2,
      slopeDisplacementMm: 0.5,
      seismicMagnitude: 0.2,
      soilSaturationPct: 94,
      lastUpdated: '8 mins ago'
    },
    immediateRelocationNeeded: true,
    relocationPriority: 'CRITICAL',
    recommendedActions: [
      'Embankment breach warning level RED triggered',
      'Move all families to Supaul Kosi Embankment Citadel (SH-BR-001)',
      'Deploy motorized rescue boats along channel spur #7'
    ]
  },

  // 5. ODISHA (Bay of Bengal Cyclone & Coastal Storm Surge)
  {
    id: 'HAB-006',
    name: 'Puri Coastal Fishermen Colony',
    district: 'Puri',
    state: 'Odisha',
    population: 2900,
    households: 610,
    vulnerabilityScore: 79,
    hazardType: 'cyclone',
    riskLevel: 'ORANGE',
    elevationM: 12,
    slopeAngleDeg: 2,
    assignedShelterId: 'SH-OD-001',
    coordinates: [19.8135, 85.8312],
    telemetry: {
      rainfallMmHr: 42.0,
      poreWaterKPa: 45.0,
      slopeDisplacementMm: 0.1,
      seismicMagnitude: 0.1,
      soilSaturationPct: 88,
      lastUpdated: '15 mins ago'
    },
    immediateRelocationNeeded: false,
    relocationPriority: 'HIGH',
    recommendedActions: [
      'Coastal storm surge warning: 3.2m tidal wave projected',
      'Mandatory boat mooring and fishing ban',
      'Open Puri Multi-Purpose Safe Haven (SH-OD-001)'
    ]
  },

  // 6. ASSAM (Brahmaputra Valley Riverine Inundation)
  {
    id: 'HAB-010',
    name: 'Kaziranga Buffer River Settlement',
    district: 'Golaghat',
    state: 'Assam',
    population: 3100,
    households: 640,
    vulnerabilityScore: 82,
    hazardType: 'flood',
    riskLevel: 'RED',
    elevationM: 65,
    slopeAngleDeg: 2,
    assignedShelterId: 'SH-AS-002',
    coordinates: [26.5780, 93.3510],
    telemetry: {
      rainfallMmHr: 44.0,
      poreWaterKPa: 68.0,
      slopeDisplacementMm: 0.2,
      seismicMagnitude: 0.5,
      soilSaturationPct: 95,
      lastUpdated: '4 mins ago'
    },
    immediateRelocationNeeded: true,
    relocationPriority: 'CRITICAL',
    recommendedActions: [
      'Brahmaputra overspill at Dhansiri confluence',
      'Elevate livestock to highlands and relocate families to SH-AS-002'
    ]
  },

  // 7. MAHARASHTRA (Western Ghats Mahad & Raigad Basin)
  {
    id: 'HAB-011',
    name: 'Mahad Savitri Valley Habitation',
    district: 'Raigad',
    state: 'Maharashtra',
    population: 2600,
    households: 530,
    vulnerabilityScore: 77,
    hazardType: 'flood',
    riskLevel: 'ORANGE',
    elevationM: 32,
    slopeAngleDeg: 22,
    assignedShelterId: 'SH-MH-001',
    coordinates: [18.0780, 73.4210],
    telemetry: {
      rainfallMmHr: 36.2,
      poreWaterKPa: 82.0,
      slopeDisplacementMm: 11.4,
      seismicMagnitude: 0.4,
      soilSaturationPct: 89,
      lastUpdated: '10 mins ago'
    },
    immediateRelocationNeeded: false,
    relocationPriority: 'HIGH',
    recommendedActions: [
      'Savitri river crossing high flood level amber mark',
      'Stage NDRF 5th Battalion for rapid evacuation to SH-MH-001'
    ]
  },

  // 8. GUJARAT (Kutch Fault Line & Desert Zone)
  {
    id: 'HAB-012',
    name: 'Bhuj Khavda Seismic Cluster',
    district: 'Kutch',
    state: 'Gujarat',
    population: 2400,
    households: 470,
    vulnerabilityScore: 71,
    hazardType: 'earthquake',
    riskLevel: 'ORANGE',
    elevationM: 110,
    slopeAngleDeg: 6,
    assignedShelterId: 'SH-GJ-001',
    coordinates: [23.8320, 69.7210],
    telemetry: {
      rainfallMmHr: 2.0,
      poreWaterKPa: 15.0,
      slopeDisplacementMm: 8.5,
      seismicMagnitude: 3.8,
      soilSaturationPct: 25,
      lastUpdated: '7 mins ago'
    },
    immediateRelocationNeeded: false,
    relocationPriority: 'HIGH',
    recommendedActions: [
      'Foreshock tremor detected (M3.8). Enforce open-ground assembly protocols',
      'Designate Bhuj Earthquake Haven (SH-GJ-001) as primary command'
    ]
  },

  // 9. TAMIL NADU (Nilgiris Mountain Slopes)
  {
    id: 'HAB-013',
    name: 'Coonoor Hill Settlement',
    district: 'The Nilgiris',
    state: 'Tamil Nadu',
    population: 2100,
    households: 420,
    vulnerabilityScore: 73,
    hazardType: 'landslide',
    riskLevel: 'ORANGE',
    elevationM: 1850,
    slopeAngleDeg: 35,
    assignedShelterId: 'SH-TN-002',
    coordinates: [11.3530, 76.7959],
    telemetry: {
      rainfallMmHr: 33.0,
      poreWaterKPa: 74.0,
      slopeDisplacementMm: 12.0,
      seismicMagnitude: 0.2,
      soilSaturationPct: 86,
      lastUpdated: '11 mins ago'
    },
    immediateRelocationNeeded: false,
    relocationPriority: 'HIGH',
    recommendedActions: [
      'Ghat road landslide debris cleared; pre-evacuation alert active for low-lying tea labor line'
    ]
  },

  // 10. JAMMU & KASHMIR (Jhelum Basin)
  {
    id: 'HAB-014',
    name: 'Srinagar Rajbagh Lowland Sector',
    district: 'Srinagar',
    state: 'Jammu & Kashmir',
    population: 3800,
    households: 790,
    vulnerabilityScore: 65,
    hazardType: 'flood',
    riskLevel: 'ORANGE',
    elevationM: 1585,
    slopeAngleDeg: 2,
    assignedShelterId: 'SH-JK-001',
    coordinates: [34.0620, 74.8210],
    telemetry: {
      rainfallMmHr: 22.0,
      poreWaterKPa: 40.0,
      slopeDisplacementMm: 0.1,
      seismicMagnitude: 1.2,
      soilSaturationPct: 78,
      lastUpdated: '14 mins ago'
    },
    immediateRelocationNeeded: false,
    relocationPriority: 'MODERATE',
    recommendedActions: [
      'Ram Munshi Bagh gauge within amber limit. Dewatering pumps staged for Jhelum overspill'
    ]
  }
];

export const mockHazardZones = [
  // 1. KERALA
  {
    id: 'ZONE-RED-01',
    name: 'Wayanad Western Escarpment (Critical Red Zone)',
    state: 'Kerala',
    hazard: 'landslide',
    riskLevel: 'RED',
    description: 'High debris-flow probability triggered by >250mm cumulative 48h rainfall and steep 40°+ overburden slope.',
    riskScore: 95,
    areaSqKm: 42.8,
    center: [11.545, 76.135],
    affectedHabitationIds: ['HAB-001', 'HAB-002'],
    triggerCondition: 'Rainfall > 45mm/hr + Slope Displacement > 15mm/24h',
    boundary: [
      [11.58, 76.08],
      [11.59, 76.17],
      [11.51, 76.18],
      [11.49, 76.11],
      [11.53, 76.07]
    ]
  },
  {
    id: 'ZONE-ORG-01',
    name: 'Idukki Upper Catchment & Reservoir Buffer',
    state: 'Kerala',
    hazard: 'landslide',
    riskLevel: 'ORANGE',
    description: 'Saturated soil mantle on granitic slopes; moderate risk of localized mudslides.',
    riskScore: 68,
    areaSqKm: 65.2,
    center: [10.088, 77.059],
    affectedHabitationIds: ['HAB-004'],
    triggerCondition: 'Rainfall > 30mm/hr sustained for 6 hours',
    boundary: [
      [10.13, 77.01],
      [10.14, 77.11],
      [10.04, 77.10],
      [10.03, 77.02]
    ]
  },

  // 2. UTTARAKHAND
  {
    id: 'ZONE-RED-02',
    name: 'Joshimath Main Central Thrust Fault Belt',
    state: 'Uttarakhand',
    hazard: 'earthquake',
    riskLevel: 'RED',
    description: 'Active tectonic displacement with severe subterranean aquifer erosion causing progressive structural subsidence.',
    riskScore: 89,
    areaSqKm: 18.4,
    center: [30.556, 79.566],
    affectedHabitationIds: ['HAB-003'],
    triggerCondition: 'Seismic Tremors > 3.0 Richter + Subsidence Rate > 20mm/day',
    boundary: [
      [30.58, 79.54],
      [30.58, 79.59],
      [30.53, 79.59],
      [30.53, 79.54]
    ]
  },
  {
    id: 'ZONE-GRN-01',
    name: 'Dehradun Plateau Safe Haven Corridor',
    state: 'Uttarakhand',
    hazard: 'earthquake',
    riskLevel: 'GREEN',
    description: 'Consolidated sedimentary terrace with deep groundwater table; ideal safe transit hub.',
    riskScore: 18,
    areaSqKm: 140.0,
    center: [30.316, 78.032],
    affectedHabitationIds: ['HAB-007'],
    triggerCondition: 'Optimal geotechnical stability score > 88/100',
    boundary: [
      [30.38, 77.95],
      [30.40, 78.10],
      [30.25, 78.12],
      [30.24, 77.96]
    ]
  },

  // 3. BIHAR
  {
    id: 'ZONE-RED-03',
    name: 'Kosi Embankment Breach Vulnerability Zone',
    state: 'Bihar',
    hazard: 'flood',
    riskLevel: 'RED',
    description: 'Dynamic avulsion corridor with heavy siltation; high breach probability during sudden upstream torrential flows.',
    riskScore: 91,
    areaSqKm: 110.5,
    center: [26.126, 86.605],
    affectedHabitationIds: ['HAB-005'],
    triggerCondition: 'River Gauge Level > Danger Mark + 1.2m',
    boundary: [
      [26.20, 86.52],
      [26.22, 86.68],
      [26.05, 86.70],
      [26.04, 86.55]
    ]
  },

  // 4. ODISHA
  {
    id: 'ZONE-ORG-03',
    name: 'Bay of Bengal Coastal Storm Surge Belt',
    state: 'Odisha',
    hazard: 'cyclone',
    riskLevel: 'ORANGE',
    description: 'Low-lying coastal strip vulnerable to 3-meter astronomical storm surge and gale winds.',
    riskScore: 79,
    areaSqKm: 85.0,
    center: [19.813, 85.831],
    affectedHabitationIds: ['HAB-006'],
    triggerCondition: 'Wind speed sustained > 90 km/h with high tide concurrence',
    boundary: [
      [19.88, 85.75],
      [19.89, 85.90],
      [19.74, 85.92],
      [19.73, 85.78]
    ]
  },

  // 5. ASSAM
  {
    id: 'ZONE-RED-04',
    name: 'Brahmaputra Flood Plain & Kaziranga Basin',
    state: 'Assam',
    hazard: 'flood',
    riskLevel: 'RED',
    description: 'Major trans-boundary river overflow inundating riparian wetlands and settlements.',
    riskScore: 88,
    areaSqKm: 145.0,
    center: [26.587, 93.361],
    affectedHabitationIds: ['HAB-010'],
    triggerCondition: 'Brahmaputra water level > Danger Level by 1.5m',
    boundary: [
      [26.65, 93.25],
      [26.66, 93.45],
      [26.52, 93.46],
      [26.51, 93.26]
    ]
  },

  // 6. MAHARASHTRA
  {
    id: 'ZONE-ORG-04',
    name: 'Savitri River Basin & Mahad Slopes',
    state: 'Maharashtra',
    hazard: 'flood',
    riskLevel: 'ORANGE',
    description: 'Flash flooding and tributary surge during active Arabian Sea monsoon depressions.',
    riskScore: 76,
    areaSqKm: 75.0,
    center: [18.083, 73.416],
    affectedHabitationIds: ['HAB-011'],
    triggerCondition: 'Mahad gauge discharge > 35,000 cusecs',
    boundary: [
      [18.13, 73.35],
      [18.14, 73.48],
      [18.02, 73.49],
      [18.01, 73.36]
    ]
  },

  // 7. GUJARAT
  {
    id: 'ZONE-ORG-05',
    name: 'Kutch Mainland Fault Seismic Zone',
    state: 'Gujarat',
    hazard: 'earthquake',
    riskLevel: 'ORANGE',
    description: 'Intraplate active seismic thrust faultline with history of major earthquakes (Zone V).',
    riskScore: 74,
    areaSqKm: 190.0,
    center: [23.350, 69.800],
    affectedHabitationIds: ['HAB-012'],
    triggerCondition: 'Seismic activity cluster > M3.5 within 24h',
    boundary: [
      [23.50, 69.60],
      [23.52, 70.00],
      [23.20, 70.02],
      [23.18, 69.62]
    ]
  },

  // 8. HIMACHAL PRADESH
  {
    id: 'ZONE-ORG-06',
    name: 'Kangra-Dharamshala Seismic & Slope Belt',
    state: 'Himachal Pradesh',
    hazard: 'landslide',
    riskLevel: 'ORANGE',
    description: 'Steep Dhauladhar foothills with loose sedimentary overburden prone to monsoon slides.',
    riskScore: 78,
    areaSqKm: 62.0,
    center: [32.225, 76.330],
    affectedHabitationIds: ['HAB-009'],
    triggerCondition: 'Rainfall > 35mm/hr + slope strain > 10mm',
    boundary: [
      [32.28, 76.28],
      [32.29, 76.38],
      [32.18, 76.39],
      [32.17, 76.29]
    ]
  }
];