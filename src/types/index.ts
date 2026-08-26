export type HazardType = 'landslide' | 'flood' | 'earthquake' | 'cyclone';

export type RiskLevel = 'RED' | 'ORANGE' | 'GREEN';

export interface SensorTelemetry {
  rainfallMmHr: number;
  poreWaterKPa: number;
  slopeDisplacementMm: number;
  seismicMagnitude: number;
  soilSaturationPct: number;
  lastUpdated: string;
}

export interface Habitation {
  id: string;
  name: string;
  district: string;
  state: string;
  population: number;
  households: number;
  vulnerabilityScore: number; // 0 - 100
  hazardType: HazardType;
  riskLevel: RiskLevel;
  elevationM: number;
  slopeAngleDeg: number;
  assignedShelterId: string;
  coordinates: [number, number]; // [lat, lng]
  telemetry: SensorTelemetry;
  immediateRelocationNeeded: boolean;
  relocationPriority: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'LOW';
  recommendedActions: string[];
}

export interface HazardZone {
  id: string;
  name: string;
  hazard: HazardType;
  riskLevel: RiskLevel;
  description: string;
  riskScore: number; // 0 - 100
  areaSqKm: number;
  boundary: [number, number][]; // Polygon coordinates
  center: [number, number];
  affectedHabitationIds: string[];
  triggerCondition: string;
}

export interface ShelterSupplies {
  waterLiters: number;
  waterDays: number;
  foodRationDays: number;
  medicalKits: number;
  dieselGenHours: number;
  sanitationUnits: number;
  blankets: number;
}

export interface Shelter {
  id: string;
  name: string;
  address: string;
  district: string;
  totalCapacity: number;
  allocatedOccupancy: number;
  currentOccupancy: number;
  coordinates: [number, number];
  contactPerson: string;
  phone: string;
  type: 'SCHOOL' | 'HOSPITAL' | 'STADIUM' | 'GOVERNMENT_OFFICE' | 'COMMUNITY_HALL' | 'CYCLONE_SHELTER';
  supplies: ShelterSupplies;
  resilienceScore: number; // 0 - 100 (50-year disaster withstand)
  historicalWithstand: {
    floodLevelM: number;
    earthquakeRichter: number;
    cycloneWindKmph: number;
    landslideBufferM: number;
    pastIncidentsSurvived: number;
  };
  facilities: string[];
  status: 'OPTIMAL' | 'NEAR_CAPACITY' | 'CRITICAL_OVERFLOW';
}

export interface HistoricalDisaster {
  id: string;
  year: number;
  eventName: string;
  type: HazardType;
  region: string;
  casualties: number;
  displacedPeople: number;
  economicDamageMillionUSD: number;
  rainfallRecordMm?: number;
  magnitudeRichter?: number;
  keyLearning: string;
}

export interface PredictionModelPoint {
  day: string;
  landslideRiskPct: number;
  floodRiskPct: number;
  earthquakeRiskPct: number;
  rainfallMm: number;
  soilMoisturePct: number;
  compositeThreatIndex: number;
}

export interface SosAlert {
  id: string;
  timestamp: string;
  senderName: string;
  senderPhone: string;
  coordinates: [number, number];
  addressDescription: string;
  type: 'CITIZEN_SOS' | 'ADMIN_DISPATCH';
  hazardContext: HazardType;
  status: 'PENDING' | 'DISPATCHED' | 'RESCUED';
  peopleCount: number;
  medicalAssistanceRequired: boolean;
  notes?: string;
  urgency?: 'EXTREME' | 'CRITICAL' | 'HIGH' | 'MODERATE';
  assignedUnit?: string;
  assignedResponder?: string;
  estimatedArrivalMins?: number;
  responderNotes?: string;
  dispatchedAt?: string;
  nearestDepotName?: string;
  nearestDepotCoords?: [number, number];
  routeGeometry?: [number, number][];
}

export interface IncidentReport {
  id: string;
  reporterName: string;
  contact: string;
  coordinates: [number, number];
  hazardType: HazardType;
  severity: 'MILD' | 'MODERATE' | 'SEVERE' | 'CATASTROPHIC';
  description: string;
  timestamp: string;
  status: 'VERIFIED' | 'UNDER_REVIEW' | 'FALSE_ALARM';
  upvotes: number;
}
