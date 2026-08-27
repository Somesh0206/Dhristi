












export const mockRescueDepots = [
{
  id: 'DEPOT-01',
  name: 'NDRF 04 Bn Rapid Deployment Hub',
  type: 'NDRF_BASE',
  coordinates: [11.6140, 76.0850], // Kalpetta
  address: 'NH-766 Bypass, Kalpetta North, Wayanad',
  commander: 'Deputy Commandant R. S. Rathore',
  phone: '+91 94471 22334',
  vehiclesAvailable: 8
},
{
  id: 'DEPOT-02',
  name: 'SDRF Mountain Search & Rescue Base',
  type: 'SDRF_STATION',
  coordinates: [11.5580, 76.1210], // Meppadi
  address: 'Meppadi Town Junction, Wayanad',
  commander: 'Inspector V. Vijayan',
  phone: '+91 94470 99881',
  vehiclesAvailable: 5
},
{
  id: 'DEPOT-03',
  name: 'Kerala Fire & Rescue Station (Specialized Ops)',
  type: 'FIRE_RESCUE',
  coordinates: [11.5510, 76.0430], // Vythiri
  address: 'Old Highway Road, Vythiri, Wayanad',
  commander: 'Station Officer K. Pradeep',
  phone: '+91 94473 11223',
  vehiclesAvailable: 6
}];


export const initialCitizenSosBeacons = [
{
  id: 'SOS-2026-081',
  timestamp: 'Just now (3 mins ago)',
  senderName: 'Suresh Kumar & Family',
  senderPhone: '+91 98471 20491',
  coordinates: [11.5360, 76.1420], // Near Chooralmala / Mundakkai
  addressDescription: 'House near Mundakkai stream bend, Chooralmala road cut off by mudflow',
  type: 'CITIZEN_SOS',
  hazardContext: 'landslide',
  status: 'PENDING',
  peopleCount: 4,
  medicalAssistanceRequired: true,
  urgency: 'CRITICAL',
  notes: 'Elderly person with diabetic emergency, water entering lower floor. Need immediate 4x4 or rope rescue.',
  nearestDepotName: 'SDRF Mountain Search & Rescue Base, Meppadi',
  nearestDepotCoords: [11.5580, 76.1210]
},
{
  id: 'SOS-2026-082',
  timestamp: '12 mins ago',
  senderName: 'Radhamani K. (Tea Estate Colony)',
  senderPhone: '+91 94460 33182',
  coordinates: [11.5420, 76.1550], // Attamala Ridge
  addressDescription: 'Attamala Upper Division Line Rooms, Sector 4',
  type: 'CITIZEN_SOS',
  hazardContext: 'landslide',
  status: 'DISPATCHED',
  peopleCount: 7,
  medicalAssistanceRequired: false,
  urgency: 'HIGH',
  notes: 'Access culvert cracked. 2 infants and 5 adults waiting at high ground clearing.',
  assignedUnit: 'NDRF Bravo Quick Response Team',
  assignedResponder: 'Sub-Inspector Anoop Thomas',
  estimatedArrivalMins: 9,
  dispatchedAt: '8 mins ago',
  responderNotes: 'NDRF All-Terrain vehicle en route via SH-59 elevated bypass. Visual contact ETA 9 mins.',
  nearestDepotName: 'NDRF 04 Bn Rapid Deployment Hub, Kalpetta',
  nearestDepotCoords: [11.6140, 76.0850]
},
{
  id: 'SOS-2026-083',
  timestamp: '25 mins ago',
  senderName: 'Vipin Das (Local Shop Owner)',
  senderPhone: '+91 97451 88402',
  coordinates: [11.5520, 76.1290], // Meppadi outskirts
  addressDescription: 'Kalladi riverside hamlet, near suspension footbridge',
  type: 'CITIZEN_SOS',
  hazardContext: 'flood',
  status: 'PENDING',
  peopleCount: 3,
  medicalAssistanceRequired: false,
  urgency: 'HIGH',
  notes: 'River level rose 2 meters in 30 minutes. Trapped on rooftop with 2 elderly neighbors.',
  nearestDepotName: 'SDRF Mountain Search & Rescue Base, Meppadi',
  nearestDepotCoords: [11.5580, 76.1210]
},
{
  id: 'SOS-2026-084',
  timestamp: '48 mins ago',
  senderName: 'Praveen Nair (Forest Range Post)',
  senderPhone: '+91 94477 12093',
  coordinates: [11.5120, 76.1150], // Chembra lower slope
  addressDescription: 'Chembra Trekking Checkpost Hamlet',
  type: 'CITIZEN_SOS',
  hazardContext: 'landslide',
  status: 'RESCUED',
  peopleCount: 5,
  medicalAssistanceRequired: true,
  urgency: 'MODERATE',
  notes: 'Tree fall blocked primary escape trail.',
  assignedUnit: 'Kerala Fire & Rescue Team Vythiri',
  assignedResponder: 'Station Officer K. Pradeep',
  estimatedArrivalMins: 0,
  dispatchedAt: '40 mins ago',
  responderNotes: 'Safely evacuated all 5 individuals to Meppadi Govt Higher Secondary School Safe Shelter.',
  nearestDepotName: 'Kerala Fire & Rescue Station, Vythiri',
  nearestDepotCoords: [11.5510, 76.0430]
}];