

export const mock50YearDisasters = [
{
  id: 'HIST-2024-WYD',
  year: 2024,
  eventName: 'Wayanad Chooralmala-Meppadi Mega Debris Flow',
  type: 'landslide',
  region: 'Wayanad, Kerala',
  casualties: 420,
  displacedPeople: 12500,
  economicDamageMillionUSD: 145,
  rainfallRecordMm: 572,
  keyLearning: 'Pore-water pressure sensors and steep-slope early relocation protocols save 80% more lives than visual alarms.'
},
{
  id: 'HIST-2023-JSH',
  year: 2023,
  eventName: 'Joshimath Land Subsidence & Aquifer Burst',
  type: 'earthquake',
  region: 'Chamoli, Uttarakhand',
  casualties: 0,
  displacedPeople: 4500,
  economicDamageMillionUSD: 85,
  magnitudeRichter: 3.4,
  keyLearning: 'Carrying capacity limits on geotechnical faultlines must be enforced to prevent structural overloading.'
},
{
  id: 'HIST-2018-KRL',
  year: 2018,
  eventName: 'Great Kerala Monsoonal Inundation & Dam Overspill',
  type: 'flood',
  region: 'Statewide Kerala',
  casualties: 483,
  displacedPeople: 1450000,
  economicDamageMillionUSD: 4200,
  rainfallRecordMm: 758,
  keyLearning: 'Multi-reservoir cascade rule curves combined with real-time evacuation routing are essential.'
},
{
  id: 'HIST-2019-FAN',
  year: 2019,
  eventName: 'Super Cyclone Fani Coastal Impact',
  type: 'cyclone',
  region: 'Puri & Khordha, Odisha',
  casualties: 89,
  displacedPeople: 1200000,
  economicDamageMillionUSD: 1800,
  keyLearning: 'Pre-emptive evacuation to resilient cyclone shelters reduced fatalities by over 95% compared to 1999.'
},
{
  id: 'HIST-2013-UKD',
  year: 2013,
  eventName: 'Kedarnath Flash Flood & Glacial Lake Outburst',
  type: 'flood',
  region: 'Rudraprayag, Uttarakhand',
  casualties: 5700,
  displacedPeople: 110000,
  economicDamageMillionUSD: 1100,
  rainfallRecordMm: 375,
  keyLearning: 'Valley choke points must maintain strict permanent exclusion zones for habitations.'
},
{
  id: 'HIST-2008-KOS',
  year: 2008,
  eventName: 'Kosi River Avulsion & Embankment Breach',
  type: 'flood',
  region: 'Kusaha & North Bihar',
  casualties: 527,
  displacedPeople: 3200000,
  economicDamageMillionUSD: 850,
  keyLearning: 'Dynamic riverbed carrying capacity analysis prevents catastrophic sudden channel shifts.'
},
{
  id: 'HIST-2001-BHJ',
  year: 2001,
  eventName: 'Bhuj Great Earthquake',
  type: 'earthquake',
  region: 'Kutch, Gujarat',
  casualties: 20085,
  displacedPeople: 400000,
  economicDamageMillionUSD: 5500,
  magnitudeRichter: 7.7,
  keyLearning: 'Seismic zoning compliance and decentralized community shelter grids are critical for immediate survival.'
},
{
  id: 'HIST-1999-ODI',
  year: 1999,
  eventName: 'Odisha Super Cyclone 05B',
  type: 'cyclone',
  region: 'Jagatsinghpur, Odisha',
  casualties: 9887,
  displacedPeople: 1670000,
  economicDamageMillionUSD: 4500,
  keyLearning: 'Highlighted the urgent mandate for multi-purpose cyclone shelters equipped with independent power and water.'
},
{
  id: 'HIST-1991-UTK',
  year: 1991,
  eventName: 'Uttarkashi Earthquake',
  type: 'earthquake',
  region: 'Garhwal, Uttarakhand',
  casualties: 768,
  displacedPeople: 42000,
  economicDamageMillionUSD: 360,
  magnitudeRichter: 6.8,
  keyLearning: 'Mountain slope stability weakens dramatically after moderate seismic shocks, priming future landslides.'
},
{
  id: 'HIST-1979-MOR',
  year: 1979,
  eventName: 'Machchu Dam Failure Inundation',
  type: 'flood',
  region: 'Morbi, Gujarat',
  casualties: 2000,
  displacedPeople: 85000,
  economicDamageMillionUSD: 120,
  keyLearning: 'Downstream habitations require real-time hydrologic breach warnings with under 15-minute escape vectors.'
}];


export const mockPrediction7Days = [
{ day: 'Day 1 (Today)', landslideRiskPct: 92, floodRiskPct: 88, earthquakeRiskPct: 24, rainfallMm: 68.4, soilMoisturePct: 96, compositeThreatIndex: 91 },
{ day: 'Day 2', landslideRiskPct: 95, floodRiskPct: 91, earthquakeRiskPct: 26, rainfallMm: 84.0, soilMoisturePct: 99, compositeThreatIndex: 94 },
{ day: 'Day 3', landslideRiskPct: 86, floodRiskPct: 84, earthquakeRiskPct: 22, rainfallMm: 52.0, soilMoisturePct: 94, compositeThreatIndex: 85 },
{ day: 'Day 4', landslideRiskPct: 74, floodRiskPct: 71, earthquakeRiskPct: 20, rainfallMm: 38.5, soilMoisturePct: 87, compositeThreatIndex: 72 },
{ day: 'Day 5', landslideRiskPct: 58, floodRiskPct: 55, earthquakeRiskPct: 18, rainfallMm: 22.0, soilMoisturePct: 76, compositeThreatIndex: 56 },
{ day: 'Day 6', landslideRiskPct: 42, floodRiskPct: 40, earthquakeRiskPct: 15, rainfallMm: 12.0, soilMoisturePct: 65, compositeThreatIndex: 41 },
{ day: 'Day 7', landslideRiskPct: 28, floodRiskPct: 25, earthquakeRiskPct: 12, rainfallMm: 5.0, soilMoisturePct: 54, compositeThreatIndex: 27 }];


export const mockPrediction30Days = [
{ day: 'Week 1', landslideRiskPct: 88, floodRiskPct: 84, earthquakeRiskPct: 23, rainfallMm: 242.0, soilMoisturePct: 94, compositeThreatIndex: 88 },
{ day: 'Week 2', landslideRiskPct: 62, floodRiskPct: 58, earthquakeRiskPct: 19, rainfallMm: 110.0, soilMoisturePct: 78, compositeThreatIndex: 61 },
{ day: 'Week 3', landslideRiskPct: 45, floodRiskPct: 38, earthquakeRiskPct: 28, rainfallMm: 65.0, soilMoisturePct: 62, compositeThreatIndex: 44 },
{ day: 'Week 4', landslideRiskPct: 22, floodRiskPct: 18, earthquakeRiskPct: 14, rainfallMm: 18.0, soilMoisturePct: 48, compositeThreatIndex: 21 }];


export function calculateSimulatedRisk(rainfall, seismic, soilSaturation, slopeDeg) {
  // Machine Learning heuristic surrogate for slope stability factor of safety (FS)
  const rainfallFactor = Math.min(100, rainfall / 80 * 45);
  const seismicFactor = Math.min(100, seismic / 6.0 * 35);
  const soilFactor = Math.min(100, soilSaturation / 100 * 20);
  const slopeMultiplier = slopeDeg > 35 ? 1.3 : slopeDeg > 25 ? 1.1 : 0.8;

  const rawScore = (rainfallFactor + seismicFactor + soilFactor) * slopeMultiplier;
  const clampedScore = Math.min(99, Math.max(5, Math.round(rawScore)));

  const riskTier = clampedScore >= 75 ? 'RED' : clampedScore >= 45 ? 'ORANGE' : 'GREEN';
  const factorOfSafety = Math.max(0.6, 1.8 - clampedScore / 100 * 1.2).toFixed(2);

  return {
    riskScore: clampedScore,
    riskTier,
    factorOfSafety: parseFloat(factorOfSafety),
    landslideProbPct: Math.min(98, Math.round(clampedScore * 1.05)),
    floodProbPct: Math.min(96, Math.round(rainfall / 100 * 85 + soilSaturation / 100 * 15)),
    recommendedImmediateEvacuation: clampedScore >= 75
  };
}