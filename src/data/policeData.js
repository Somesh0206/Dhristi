// Dhristi Geo-Intelligence Platform: Pan-India Emergency Response Posts, Police Stations & SDRF Units

export const mockPoliceStations = [
  // 1. KERALA
  {
    id: 'POL_KL_01',
    name: 'Meppadi Police Station & Disaster Response Post',
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
    id: 'POL_KL_02',
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

  // 2. UTTARAKHAND
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
    id: 'POL_UK_02',
    name: 'Dehradun State Emergency Police HQ & SDRF Battalion 1',
    district: 'Dehradun',
    state: 'Uttarakhand',
    phone: '+91-135-2716201',
    altPhone: '112',
    officerInCharge: 'Commandant R. K. Bhatt',
    coordinates: [30.3165, 78.0322],
    availableVehicles: 20,
    status: 'ACTIVE_24X7'
  },

  // 3. HIMACHAL PRADESH
  {
    id: 'POL_HP_01',
    name: 'Dharamshala Kotwali Police Station & SDRF Unit',
    district: 'Kangra',
    state: 'Himachal Pradesh',
    phone: '+91-1892-224883',
    altPhone: '112',
    officerInCharge: 'Inspector A. Thakur',
    coordinates: [32.2190, 76.3234],
    availableVehicles: 7,
    status: 'ACTIVE_24X7'
  },

  // 4. ASSAM
  {
    id: 'POL_AS_01',
    name: 'Guwahati Panbazar Police Control & River SDRF Base',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    phone: '+91-361-2540106',
    altPhone: '112',
    officerInCharge: 'Deputy Commissioner of Police (Ops)',
    coordinates: [26.1850, 91.7510],
    availableVehicles: 18,
    status: 'ACTIVE_24X7'
  },

  // 5. BIHAR
  {
    id: 'POL_BR_01',
    name: 'Supaul Sadar Police Station & SDRF Flood Depot',
    district: 'Supaul',
    state: 'Bihar',
    phone: '+91-6473-222244',
    altPhone: '112',
    officerInCharge: 'Inspector Rajeshwar Prasad',
    coordinates: [26.1261, 86.6053],
    availableVehicles: 10,
    status: 'ACTIVE_24X7'
  },

  // 6. ODISHA
  {
    id: 'POL_OD_01',
    name: 'Puri Sea Beach Police Station & ODRAF Cyclone Base',
    district: 'Puri',
    state: 'Odisha',
    phone: '+91-6752-222039',
    altPhone: '112',
    officerInCharge: 'Inspector S. K. Nayak',
    coordinates: [19.8000, 85.8200],
    availableVehicles: 12,
    status: 'ACTIVE_24X7'
  },

  // 7. MAHARASHTRA
  {
    id: 'POL_MH_01',
    name: 'Mahad City Police Station & NDRF 5th Bn Camp',
    district: 'Raigad',
    state: 'Maharashtra',
    phone: '+91-2145-222133',
    altPhone: '112',
    officerInCharge: 'Senior Police Inspector M. G. Shinde',
    coordinates: [18.0833, 73.4167],
    availableVehicles: 9,
    status: 'ACTIVE_24X7'
  },

  // 8. GUJARAT
  {
    id: 'POL_GJ_01',
    name: 'Bhuj A-Division Police Station & SDRF Kutch Unit',
    district: 'Kutch',
    state: 'Gujarat',
    phone: '+91-2832-250100',
    altPhone: '112',
    officerInCharge: 'Police Inspector D. V. Jadeja',
    coordinates: [23.2420, 69.6669],
    availableVehicles: 11,
    status: 'ACTIVE_24X7'
  },

  // 9. TAMIL NADU
  {
    id: 'POL_TN_01',
    name: 'Chennai Central Police Control Room (MHA Integrated)',
    district: 'Chennai',
    state: 'Tamil Nadu',
    phone: '+91-44-23452359',
    altPhone: '112',
    officerInCharge: 'Additional Commissioner of Police (Disaster Command)',
    coordinates: [13.0827, 80.2707],
    availableVehicles: 25,
    status: 'ACTIVE_24X7'
  },

  // 10. JAMMU & KASHMIR
  {
    id: 'POL_JK_01',
    name: 'Srinagar Kothibagh Police Station & Flood Control Post',
    district: 'Srinagar',
    state: 'Jammu & Kashmir',
    phone: '+91-194-2452093',
    altPhone: '112',
    officerInCharge: 'Station House Officer (J&K Police)',
    coordinates: [34.0700, 74.8100],
    availableVehicles: 10,
    status: 'ACTIVE_24X7'
  }
];

export const governmentEmergencyDirectory = [
  {
    number: '112',
    service: 'National Emergency Response System (NERS)',
    department: 'Ministry of Home Affairs (MHA), Govt. of India',
    description: 'Unified all-India single emergency contact for Police, Fire, Medical & Disaster Rescue across all states & UTs.',
    iconType: 'disaster',
    tollFree: true,
    priority: 'CRITICAL'
  },
  {
    number: '1078',
    service: 'NDMA National Disaster Helpline',
    department: 'National Disaster Management Authority',
    description: 'Direct national helpline for catastrophic disaster reporting, central logistics airlifts, and NDRF battalion dispatch.',
    iconType: 'disaster',
    tollFree: true,
    priority: 'CRITICAL'
  },
  {
    number: '1070',
    service: 'State Emergency Operations Centre (SEOC)',
    department: 'State Disaster Management Authorities (SDMAs)',
    description: 'State-level disaster control room coordinating SDRF rescue boats, dam cascade releases, and relief havens.',
    iconType: 'disaster',
    tollFree: true,
    priority: 'HIGH'
  },
  {
    number: '1077',
    service: 'District Emergency Operations Centre (DEOC)',
    department: 'District Collectorates / Magistrates',
    description: 'Direct district magistrate helpline for localized evacuation corridors, shelter supplies, and SDRF troop deployment.',
    iconType: 'disaster',
    tollFree: true,
    priority: 'HIGH'
  },
  {
    number: '108',
    service: 'National Ambulance & Medical Emergency Service',
    department: 'Ministry of Health & Family Welfare',
    description: '24x7 advanced life support and emergency ambulance fleet dispatch across all Indian districts.',
    iconType: 'medical',
    tollFree: true,
    priority: 'CRITICAL'
  },
  {
    number: '101',
    service: 'Fire & Specialized Rescue Services',
    department: 'State Fire and Emergency Services',
    description: 'Emergency structural collapse extrication, chemical leak neutralization, and flash flood boat rescue.',
    iconType: 'fire',
    tollFree: true,
    priority: 'CRITICAL'
  },
  {
    number: '1091',
    service: 'Women & Vulnerable Persons Disaster Support',
    department: 'Ministry of Women & Child Development',
    description: 'Safe haven security, maternal relief kits, and psychosocial trauma assistance in relief camps.',
    iconType: 'disaster',
    tollFree: true,
    priority: 'HIGH'
  }
];