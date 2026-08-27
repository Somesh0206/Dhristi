























export const mockPoliceStations = [
{
  id: 'POL_WYD_01',
  name: 'Meppadi Police Station (Jurisdiction Central)',
  district: 'Wayanad',
  state: 'Kerala',
  phone: '+91-4936-282222',
  altPhone: '112',
  officerInCharge: 'Inspector K. S. Rajesh, IPS',
  coordinates: [11.5521, 76.1288],
  availableVehicles: 6,
  status: 'ACTIVE_24X7'
},
{
  id: 'POL_WYD_02',
  name: 'Kalpetta District Police Headquarters & Control Room',
  district: 'Wayanad',
  state: 'Kerala',
  phone: '+91-4936-202225',
  altPhone: '100',
  officerInCharge: 'Superintendent of Police (Disaster Ops)',
  coordinates: [11.6085, 76.0825],
  availableVehicles: 14,
  status: 'ACTIVE_24X7'
},
{
  id: 'POL_WYD_03',
  name: 'Vythiri Hill Highway Police Outpost',
  district: 'Wayanad',
  state: 'Kerala',
  phone: '+91-4936-255222',
  altPhone: '112',
  officerInCharge: 'Sub-Inspector M. Varma',
  coordinates: [11.5512, 76.0418],
  availableVehicles: 4,
  status: 'PATROL_DISPATCHED'
},
{
  id: 'POL_UK_01',
  name: 'Joshimath Sector Police Thana & SDRF Post',
  district: 'Chamoli',
  state: 'Uttarakhand',
  phone: '+91-1372-222100',
  altPhone: '112',
  officerInCharge: 'Inspector D. S. Rawat',
  coordinates: [30.5564, 79.5663],
  availableVehicles: 8,
  status: 'ACTIVE_24X7'
},
{
  id: 'POL_HP_01',
  name: 'Dharamshala Kotwali Police Station',
  district: 'Kangra',
  state: 'Himachal Pradesh',
  phone: '+91-1892-224883',
  altPhone: '112',
  officerInCharge: 'Inspector A. Thakur',
  coordinates: [32.219, 76.3234],
  availableVehicles: 7,
  status: 'ACTIVE_24X7'
}];


export const governmentEmergencyDirectory = [
{
  number: '112',
  service: 'National Emergency Response System (NERS)',
  department: 'Ministry of Home Affairs (MHA)',
  description: 'All-in-one unified emergency number for Police, Fire, Medical & Disaster Rescue across India.',
  iconType: 'disaster',
  tollFree: true,
  priority: 'CRITICAL'
},
{
  number: '100',
  service: 'Police Emergency Hotline',
  department: 'State Police Command',
  description: 'Direct dispatch to nearest Police Control Room (PCR) vehicle and local Police Thana.',
  iconType: 'police',
  tollFree: true,
  priority: 'CRITICAL'
},
{
  number: '1078',
  service: 'NDRF National Control Room',
  department: 'National Disaster Response Force',
  description: 'Direct hotline to central NDRF headquarters for flood boats, heavy debris clearing & canine search.',
  iconType: 'ndrf',
  tollFree: true,
  priority: 'CRITICAL'
},
{
  number: '1070',
  service: 'State Disaster Management Authority (SDMA)',
  department: 'Revenue & Disaster Management Dept',
  description: 'State Emergency Operations Centre (SEOC) for air rescue dispatch and red-zone evacuations.',
  iconType: 'disaster',
  tollFree: true,
  priority: 'HIGH'
},
{
  number: '1077',
  service: 'District Emergency Operation Centre (DEOC)',
  department: 'District Collectorate / Magistrate',
  description: 'Local district collectorate control room coordinating safe shelter supplies and bus transit.',
  iconType: 'disaster',
  tollFree: true,
  priority: 'HIGH'
},
{
  number: '108',
  service: 'Emergency Medical & Disaster Ambulance',
  department: 'State Health Mission',
  description: '24x7 Advanced Life Support (ALS) and Basic Life Support (BLS) disaster ambulance service.',
  iconType: 'ambulance',
  tollFree: true,
  priority: 'CRITICAL'
},
{
  number: '101',
  service: 'Fire & Rescue Emergency Services',
  department: 'State Fire Force',
  description: 'Hydraulic cutting, water rescue, tree collapse removal, and structure collapse extraction.',
  iconType: 'fire',
  tollFree: true,
  priority: 'CRITICAL'
},
{
  number: '1098',
  service: 'Childline Disaster Protection Hotline',
  department: 'Ministry of Women & Child Development',
  description: 'Emergency rescue, reunification, and psychological first aid for displaced children.',
  iconType: 'child',
  tollFree: true,
  priority: 'HIGH'
},
{
  number: '181 / 1091',
  service: 'Women Emergency & Police Helpline',
  department: 'State Police & Women Welfare',
  description: 'Immediate relief, secure safe-shelter allocation, and protection for vulnerable women.',
  iconType: 'women',
  tollFree: true,
  priority: 'HIGH'
},
{
  number: '+91-11-26701728',
  service: 'NDMA HQ Disaster Hotline',
  department: 'National Disaster Management Authority, New Delhi',
  description: 'Apex national disaster monitoring authority for multi-state disaster coordination.',
  iconType: 'ndrf',
  tollFree: false,
  priority: 'HIGH'
}];