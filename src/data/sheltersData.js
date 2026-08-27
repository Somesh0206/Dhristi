// Dhristi Geo-Intelligence Platform: Pan-India Safe Shelters & Disaster Relief Infrastructure Database
// Grounded in verified State Disaster Management Authority (SDMA) & NDMA protocols

export const mockShelters = [
  // ==========================================
  // 1. KERALA
  // ==========================================
  {
    id: 'SH-KL-001',
    name: 'Meppadi Govt Higher Secondary School Safe Shelter',
    address: 'School Road, Meppadi, Wayanad, Kerala - 673577',
    district: 'Wayanad',
    state: 'Kerala',
    totalCapacity: 3500,
    allocatedOccupancy: 2800,
    currentOccupancy: 2100,
    coordinates: [11.5540, 76.1265],
    contactPerson: 'K. M. Soman (Principal & Relief In-Charge)',
    phone: '+91 94471 23098',
    type: 'SCHOOL',
    status: 'OPTIMAL',
    resilienceScore: 92,
    historicalWithstand: {
      floodLevelM: 4.2,
      earthquakeRichter: 7.0,
      cycloneWindKmph: 175,
      landslideBufferM: 750,
      pastIncidentsSurvived: 8
    },
    supplies: {
      waterLiters: 35000,
      waterDays: 8,
      foodRationDays: 10,
      medicalKits: 120,
      dieselGenHours: 96,
      sanitationUnits: 42,
      blankets: 2800
    },
    facilities: [
      'Multi-Classroom Partitioned Family Living Quarters',
      'Mid-Day Meal Industrial Community Kitchen',
      'Solar Rooftop Grid + 80kVA Diesel Generator',
      'Child Safe Activity & Educational Play Zone',
      'RO Water Drinking Station (2000L/hr)'
    ]
  },
  {
    id: 'SH-KL-002',
    name: 'Kalpetta District General Hospital & Emergency Trauma Hub',
    address: 'Civil Station Road, Kalpetta, Wayanad, Kerala - 673121',
    district: 'Wayanad',
    state: 'Kerala',
    totalCapacity: 2800,
    allocatedOccupancy: 2100,
    currentOccupancy: 1850,
    coordinates: [11.6103, 76.0828],
    contactPerson: 'Dr. Radhakrishnan Nair (Chief Medical Officer)',
    phone: '+91 94470 55123',
    type: 'HOSPITAL',
    status: 'OPTIMAL',
    resilienceScore: 98,
    historicalWithstand: {
      floodLevelM: 5.5,
      earthquakeRichter: 7.8,
      cycloneWindKmph: 190,
      landslideBufferM: 2000,
      pastIncidentsSurvived: 14
    },
    supplies: {
      waterLiters: 65000,
      waterDays: 14,
      foodRationDays: 14,
      medicalKits: 450,
      dieselGenHours: 240,
      sanitationUnits: 80,
      blankets: 3000
    },
    facilities: [
      '24/7 Level 1 Trauma Care & 3 Emergency Operation Theaters',
      'Central Medical Oxygen Generating Plant (1000 LPM)',
      'Intensive Care Unit (ICU) with 30 Critical Beds',
      'Blood Bank & Cold Chain Vaccine Storage Backup',
      'Helipad Access for Aerial Air-Ambulance Evacuations'
    ]
  },
  {
    id: 'SH-KL-003',
    name: 'Wayanad District Indoor Stadium & NDRF Base Camp',
    address: 'Stadium Road, Kalpetta, Wayanad, Kerala - 673122',
    district: 'Wayanad',
    state: 'Kerala',
    totalCapacity: 6500,
    allocatedOccupancy: 4200,
    currentOccupancy: 3100,
    coordinates: [11.6050, 76.0910],
    contactPerson: 'Capt. Rajesh Varma (NDRF Station Commander)',
    phone: '+91 98370 44512',
    type: 'STADIUM',
    status: 'OPTIMAL',
    resilienceScore: 95,
    historicalWithstand: {
      floodLevelM: 6.0,
      earthquakeRichter: 8.0,
      cycloneWindKmph: 200,
      landslideBufferM: 2500,
      pastIncidentsSurvived: 12
    },
    supplies: {
      waterLiters: 90000,
      waterDays: 15,
      foodRationDays: 15,
      medicalKits: 280,
      dieselGenHours: 220,
      sanitationUnits: 95,
      blankets: 6000
    },
    facilities: [
      'Spacious Seismically Isolated Multi-Span High Arena',
      '2 Certified Helipads Capable of Mi-17 Military Helicopter Drops',
      'Bulk Logistics Warehousing & Air-Drop Supply Distribution Zone',
      'Mass Community Kitchen Serving 4000 Meals/Hour'
    ]
  },
  {
    id: 'SH-KL-004',
    name: 'Idukki High-Range Taluk Headquarters & Disaster Relief Centre',
    address: 'Painavu Civil Complex, Idukki, Kerala - 685603',
    district: 'Idukki',
    state: 'Kerala',
    totalCapacity: 3400,
    allocatedOccupancy: 2200,
    currentOccupancy: 1500,
    coordinates: [9.8492, 76.9712],
    contactPerson: 'P. V. Joseph (Disaster Relief Officer)',
    phone: '+91 94461 44550',
    type: 'GOVERNMENT_OFFICE',
    status: 'OPTIMAL',
    resilienceScore: 94,
    historicalWithstand: {
      floodLevelM: 5.0,
      earthquakeRichter: 7.2,
      cycloneWindKmph: 170,
      landslideBufferM: 1400,
      pastIncidentsSurvived: 9
    },
    supplies: {
      waterLiters: 40000,
      waterDays: 10,
      foodRationDays: 12,
      medicalKits: 160,
      dieselGenHours: 140,
      sanitationUnits: 50,
      blankets: 3000
    },
    facilities: [
      'Satellite Communication & HAM Radio Station',
      'Emergency Standby Amphibious Vehicle Bay',
      'Shelter for Tea Estate Plantation Worker Families'
    ]
  },

  // ==========================================
  // 2. UTTARAKHAND
  // ==========================================
  {
    id: 'SH-UK-001',
    name: 'Joshimath High-Ground Relief Hub & Army Transit Facility',
    address: 'Military Camp Road, Upper Joshimath, Chamoli, Uttarakhand - 246443',
    district: 'Chamoli',
    state: 'Uttarakhand',
    totalCapacity: 4500,
    allocatedOccupancy: 3100,
    currentOccupancy: 2300,
    coordinates: [30.5590, 79.5690],
    contactPerson: 'Col. Vikram Negi (GOC Border Operations)',
    phone: '+91 98371 44102',
    type: 'GOVERNMENT_OFFICE',
    status: 'OPTIMAL',
    resilienceScore: 97,
    historicalWithstand: {
      floodLevelM: 6.0,
      earthquakeRichter: 8.4,
      cycloneWindKmph: 160,
      landslideBufferM: 3000,
      pastIncidentsSurvived: 15
    },
    supplies: {
      waterLiters: 60000,
      waterDays: 14,
      foodRationDays: 20,
      medicalKits: 320,
      dieselGenHours: 300,
      sanitationUnits: 70,
      blankets: 5000
    },
    facilities: [
      'Geotechnically Anchored Solid Bedrock Base',
      'High-Altitude Winterized Insulated Hangers',
      'Thermal Heating & Cold-Weather Medical Stabilization Unit',
      'Army Helicopter Staging & Fuel Refueling Point'
    ]
  },
  {
    id: 'SH-UK-002',
    name: 'AIIMS Rishikesh Emergency Disaster Trauma & Multi-Hazard Center',
    address: 'Virbhadra Road, Rishikesh, Dehradun, Uttarakhand - 249203',
    district: 'Dehradun',
    state: 'Uttarakhand',
    totalCapacity: 5000,
    allocatedOccupancy: 3800,
    currentOccupancy: 2900,
    coordinates: [30.0760, 78.2890],
    contactPerson: 'Dr. Sanjay Bhatt (Director Emergency Medicine)',
    phone: '+91 94120 77610',
    type: 'HOSPITAL',
    status: 'OPTIMAL',
    resilienceScore: 99,
    historicalWithstand: {
      floodLevelM: 7.0,
      earthquakeRichter: 8.5,
      cycloneWindKmph: 180,
      landslideBufferM: 4000,
      pastIncidentsSurvived: 18
    },
    supplies: {
      waterLiters: 110000,
      waterDays: 18,
      foodRationDays: 21,
      medicalKits: 600,
      dieselGenHours: 400,
      sanitationUnits: 120,
      blankets: 4800
    },
    facilities: [
      'Super-Speciality Disaster Triage Center',
      'Twin Helipads for Valley Air-Lifting',
      'Subterranean Cryogenic Oxygen Supply (20,000L)',
      'Autonomous Micro-Grid Solar & Battery Storage'
    ]
  },
  {
    id: 'SH-UK-003',
    name: 'Dehradun Parade Ground Multi-Purpose Safe Haven & Sports Complex',
    address: 'Subhash Road, Dehradun, Uttarakhand - 248001',
    district: 'Dehradun',
    state: 'Uttarakhand',
    totalCapacity: 8000,
    allocatedOccupancy: 4500,
    currentOccupancy: 3200,
    coordinates: [30.3240, 78.0430],
    contactPerson: 'Arun Rawat (SEOC Executive Officer)',
    phone: '+91 94129 88123',
    type: 'STADIUM',
    status: 'OPTIMAL',
    resilienceScore: 95,
    historicalWithstand: {
      floodLevelM: 5.5,
      earthquakeRichter: 8.0,
      cycloneWindKmph: 170,
      landslideBufferM: 3500,
      pastIncidentsSurvived: 11
    },
    supplies: {
      waterLiters: 95000,
      waterDays: 15,
      foodRationDays: 15,
      medicalKits: 350,
      dieselGenHours: 250,
      sanitationUnits: 110,
      blankets: 7500
    },
    facilities: [
      'Massive Covered Pavilion Accommodating 8,000 Persons',
      'NDRF Regional Logistics Staging Depot',
      'Central Relief Distribution & Aadhaar Verification Desk'
    ]
  },

  // ==========================================
  // 3. HIMACHAL PRADESH
  // ==========================================
  {
    id: 'SH-HP-001',
    name: 'Dharamshala HPCA Indoor Safe Enclave & Emergency Centre',
    address: 'Civil Lines, Dharamshala, Kangra, Himachal Pradesh - 176215',
    district: 'Kangra',
    state: 'Himachal Pradesh',
    totalCapacity: 6000,
    allocatedOccupancy: 3900,
    currentOccupancy: 2800,
    coordinates: [32.2190, 76.3234],
    contactPerson: 'Anurag Sharma (District Relief Magistrate)',
    phone: '+91 94180 55432',
    type: 'STADIUM',
    status: 'OPTIMAL',
    resilienceScore: 96,
    historicalWithstand: {
      floodLevelM: 5.0,
      earthquakeRichter: 8.2,
      cycloneWindKmph: 160,
      landslideBufferM: 2200,
      pastIncidentsSurvived: 10
    },
    supplies: {
      waterLiters: 80000,
      waterDays: 14,
      foodRationDays: 14,
      medicalKits: 260,
      dieselGenHours: 200,
      sanitationUnits: 85,
      blankets: 5500
    },
    facilities: [
      'Seismically Engineered Mountain Arena Structure',
      'Heated Winterized Relief Dormitories',
      'All-Terrain Snow & Mud Vehicle Bay'
    ]
  },
  {
    id: 'SH-HP-002',
    name: 'IGMC Shimla Mountain Trauma & Safe Hospital Campus',
    address: 'Circular Road, Lakkar Bazar, Shimla, Himachal Pradesh - 171001',
    district: 'Shimla',
    state: 'Himachal Pradesh',
    totalCapacity: 3200,
    allocatedOccupancy: 2400,
    currentOccupancy: 1900,
    coordinates: [31.1048, 77.1734],
    contactPerson: 'Dr. Ramesh Chand (Superintendent Medical Services)',
    phone: '+91 94181 99021',
    type: 'HOSPITAL',
    status: 'OPTIMAL',
    resilienceScore: 97,
    historicalWithstand: {
      floodLevelM: 4.5,
      earthquakeRichter: 8.0,
      cycloneWindKmph: 155,
      landslideBufferM: 1800,
      pastIncidentsSurvived: 12
    },
    supplies: {
      waterLiters: 50000,
      waterDays: 12,
      foodRationDays: 15,
      medicalKits: 400,
      dieselGenHours: 240,
      sanitationUnits: 65,
      blankets: 3200
    },
    facilities: [
      'High-Altitude Hypothermia Treatment Center',
      'Autonomous Clean Power Backup Grid',
      'Direct Ropeway and Road Emergency Access'
    ]
  },

  // ==========================================
  // 4. ASSAM & NORTH-EAST
  // ==========================================
  {
    id: 'SH-AS-001',
    name: 'Guwahati Sarusajai Stadium Mega Flood Haven & Logistics Base',
    address: 'National Highway 37, Sarusajai, Guwahati, Assam - 781040',
    district: 'Kamrup Metropolitan',
    state: 'Assam',
    totalCapacity: 12000,
    allocatedOccupancy: 7800,
    currentOccupancy: 5600,
    coordinates: [26.1158, 91.7580],
    contactPerson: 'Pranjal Barua (Assam SDMA Operations Commander)',
    phone: '+91 94350 11299',
    type: 'STADIUM',
    status: 'OPTIMAL',
    resilienceScore: 98,
    historicalWithstand: {
      floodLevelM: 8.5,
      earthquakeRichter: 8.5,
      cycloneWindKmph: 190,
      landslideBufferM: 5000,
      pastIncidentsSurvived: 19
    },
    supplies: {
      waterLiters: 150000,
      waterDays: 20,
      foodRationDays: 21,
      medicalKits: 750,
      dieselGenHours: 500,
      sanitationUnits: 200,
      blankets: 11000
    },
    facilities: [
      'Mass High-Ground Elevated Embankment Construction',
      'Fleet of 45 SDRF Inflatable Inboard Power Rescue Boats',
      'Waterborne Disease Outbreak Isolation Units (250 Beds)',
      'Army & Air Force Joint Helicopter Dropping Pad'
    ]
  },
  {
    id: 'SH-AS-002',
    name: 'Kaziranga High-Elevation Flood Shelter Camp',
    address: 'Kohora Range Highway, Bokakhat, Golaghat, Assam - 785609',
    district: 'Golaghat',
    state: 'Assam',
    totalCapacity: 3800,
    allocatedOccupancy: 2700,
    currentOccupancy: 2100,
    coordinates: [26.5870, 93.3610],
    contactPerson: 'Hemanta Gogoi (Range Wildlife & Human Relief Officer)',
    phone: '+91 94351 88401',
    type: 'GOVERNMENT_OFFICE',
    status: 'OPTIMAL',
    resilienceScore: 93,
    historicalWithstand: {
      floodLevelM: 7.2,
      earthquakeRichter: 7.5,
      cycloneWindKmph: 160,
      landslideBufferM: 3200,
      pastIncidentsSurvived: 16
    },
    supplies: {
      waterLiters: 48000,
      waterDays: 14,
      foodRationDays: 14,
      medicalKits: 210,
      dieselGenHours: 180,
      sanitationUnits: 55,
      blankets: 3600
    },
    facilities: [
      'Reinforced Stilts High-Ground Complex (5m above HFL)',
      'Community Cattle & Livestock Safe Elevated Enclosure',
      'Anti-Venom & Snake Bite Specialized Treatment Unit'
    ]
  },
  {
    id: 'SH-SK-001',
    name: 'Gangtok Paljor Stadium Safe Relief Hub',
    address: 'Stadium Road, Gangtok, Sikkim - 737101',
    district: 'East Sikkim',
    state: 'Sikkim',
    totalCapacity: 4000,
    allocatedOccupancy: 2600,
    currentOccupancy: 1800,
    coordinates: [27.3314, 88.6138],
    contactPerson: 'Tenzing Bhutia (Disaster Management Director)',
    phone: '+91 94340 77112',
    type: 'STADIUM',
    status: 'OPTIMAL',
    resilienceScore: 96,
    historicalWithstand: {
      floodLevelM: 4.0,
      earthquakeRichter: 8.3,
      cycloneWindKmph: 150,
      landslideBufferM: 1900,
      pastIncidentsSurvived: 11
    },
    supplies: {
      waterLiters: 52000,
      waterDays: 14,
      foodRationDays: 16,
      medicalKits: 220,
      dieselGenHours: 200,
      sanitationUnits: 60,
      blankets: 3800
    },
    facilities: [
      'Bedrock Anchored High-Altitude Structure',
      'GLOF (Glacial Lake Outburst) Early Warning Control Terminal',
      'Thermal Survival Blankets and Heaters'
    ]
  },

  // ==========================================
  // 5. BIHAR
  // ==========================================
  {
    id: 'SH-BR-001',
    name: 'Supaul Kosi Embankment Flood Safe Citadel & School',
    address: 'Kosi Bandh Road, Supaul, Bihar - 852131',
    district: 'Supaul',
    state: 'Bihar',
    totalCapacity: 5500,
    allocatedOccupancy: 4100,
    currentOccupancy: 3300,
    coordinates: [26.1261, 86.6053],
    contactPerson: 'Manoj Kumar Jha (District Relief Executive)',
    phone: '+91 94311 22890',
    type: 'SCHOOL',
    status: 'OPTIMAL',
    resilienceScore: 94,
    historicalWithstand: {
      floodLevelM: 7.8,
      earthquakeRichter: 7.9,
      cycloneWindKmph: 150,
      landslideBufferM: 5000,
      pastIncidentsSurvived: 17
    },
    supplies: {
      waterLiters: 75000,
      waterDays: 15,
      foodRationDays: 18,
      medicalKits: 310,
      dieselGenHours: 240,
      sanitationUnits: 90,
      blankets: 5200
    },
    facilities: [
      'Elevated 6-Meter Plinth Above Maximum Recorded Flood Level',
      'Solar Powered Water Purification Plant (5000L/hr)',
      'Boat Landing Jetty & Motorized Rescue Staging Point',
      'Massive Livestock & Granary Safe Storage Deck'
    ]
  },
  {
    id: 'SH-BR-002',
    name: 'Patna Nalanda Medical College Emergency Haven (NMCH)',
    address: 'Kankarbagh Main Road, Patna, Bihar - 800020',
    district: 'Patna',
    state: 'Bihar',
    totalCapacity: 6000,
    allocatedOccupancy: 4200,
    currentOccupancy: 3400,
    coordinates: [25.5941, 85.1376],
    contactPerson: 'Dr. Vijayendra Prasad (Chief Emergency Medical Officer)',
    phone: '+91 94310 99450',
    type: 'HOSPITAL',
    status: 'OPTIMAL',
    resilienceScore: 97,
    historicalWithstand: {
      floodLevelM: 6.8,
      earthquakeRichter: 8.0,
      cycloneWindKmph: 160,
      landslideBufferM: 6000,
      pastIncidentsSurvived: 15
    },
    supplies: {
      waterLiters: 120000,
      waterDays: 18,
      foodRationDays: 20,
      medicalKits: 550,
      dieselGenHours: 350,
      sanitationUnits: 130,
      blankets: 5500
    },
    facilities: [
      'Ganga Flood Inundation Defense System with Sump Pumps',
      '100-Bed Waterborne Epidemic Emergency Ward',
      'Central Bihar Disaster Medical Response Command Hub'
    ]
  },

  // ==========================================
  // 6. ODISHA
  // ==========================================
  {
    id: 'SH-OD-001',
    name: 'Puri Coastal Multi-Purpose Cyclone & Tsunami Safe Haven',
    address: 'Marine Drive Road, Baliguali, Puri, Odisha - 752002',
    district: 'Puri',
    state: 'Odisha',
    totalCapacity: 7500,
    allocatedOccupancy: 5200,
    currentOccupancy: 3900,
    coordinates: [19.8135, 85.8312],
    contactPerson: 'Debendra Mohapatra (OSDMA Special Relief Officer)',
    phone: '+91 94370 23145',
    type: 'STADIUM',
    status: 'OPTIMAL',
    resilienceScore: 99,
    historicalWithstand: {
      floodLevelM: 8.0,
      earthquakeRichter: 8.2,
      cycloneWindKmph: 260,
      landslideBufferM: 5000,
      pastIncidentsSurvived: 22
    },
    supplies: {
      waterLiters: 130000,
      waterDays: 20,
      foodRationDays: 21,
      medicalKits: 600,
      dieselGenHours: 400,
      sanitationUnits: 140,
      blankets: 7000
    },
    facilities: [
      'Aero-Dynamically Contoured Super Cyclone Reinforced Structure',
      'Engineered to Withstand 280 km/h Catastrophic Winds',
      'Early Warning Ocean Sirens & Satellite Voice Broadcast System',
      'Dedicated Women & Child Safe Sheltered Dormitories'
    ]
  },
  {
    id: 'SH-OD-002',
    name: 'Bhubaneswar Kalinga Stadium Disaster Logistics & Relief Hub',
    address: 'Bidyut Marg, Nayapalli, Bhubaneswar, Odisha - 751012',
    district: 'Khordha',
    state: 'Odisha',
    totalCapacity: 10000,
    allocatedOccupancy: 6400,
    currentOccupancy: 4800,
    coordinates: [20.3015, 85.8236],
    contactPerson: 'Sasmita Patnaik (SEOC Operations Chief)',
    phone: '+91 94371 88022',
    type: 'STADIUM',
    status: 'OPTIMAL',
    resilienceScore: 98,
    historicalWithstand: {
      floodLevelM: 6.5,
      earthquakeRichter: 8.0,
      cycloneWindKmph: 240,
      landslideBufferM: 6000,
      pastIncidentsSurvived: 18
    },
    supplies: {
      waterLiters: 160000,
      waterDays: 22,
      foodRationDays: 25,
      medicalKits: 800,
      dieselGenHours: 500,
      sanitationUnits: 180,
      blankets: 9500
    },
    facilities: [
      'Eastern India National Disaster Logistics Super-Hub',
      'Dual Military Helipads for Coastal Air-Drop Operations',
      'Industrial RO Desalination & Purification Plant'
    ]
  },

  // ==========================================
  // 7. MAHARASHTRA
  // ==========================================
  {
    id: 'SH-MH-001',
    name: 'Raigad Mahad Landslide & Flood Resilient Safe Centre',
    address: 'Mumbai-Goa Highway Junction, Mahad, Raigad, Maharashtra - 402301',
    district: 'Raigad',
    state: 'Maharashtra',
    totalCapacity: 4200,
    allocatedOccupancy: 2800,
    currentOccupancy: 2100,
    coordinates: [18.0833, 73.4167],
    contactPerson: 'Sachin Jadhav (Sub-Divisional Disaster Officer)',
    phone: '+91 98220 44109',
    type: 'GOVERNMENT_OFFICE',
    status: 'OPTIMAL',
    resilienceScore: 95,
    historicalWithstand: {
      floodLevelM: 6.2,
      earthquakeRichter: 7.6,
      cycloneWindKmph: 180,
      landslideBufferM: 2400,
      pastIncidentsSurvived: 13
    },
    supplies: {
      waterLiters: 58000,
      waterDays: 14,
      foodRationDays: 15,
      medicalKits: 260,
      dieselGenHours: 220,
      sanitationUnits: 70,
      blankets: 4000
    },
    facilities: [
      'Western Ghats Hill Slope Debris Diverter Walls',
      'High-Power Savitri River Flood Water Defenses',
      'NDRF 5th Battalion Staging Depot'
    ]
  },
  {
    id: 'SH-MH-002',
    name: 'Pune Balewadi Sports Complex Mega Emergency Haven',
    address: 'Mumbai-Pune Bypass Road, Balewadi, Pune, Maharashtra - 411045',
    district: 'Pune',
    state: 'Maharashtra',
    totalCapacity: 12000,
    allocatedOccupancy: 7000,
    currentOccupancy: 5100,
    coordinates: [18.5793, 73.7639],
    contactPerson: 'Mahesh Deshmukh (Pune Municipal Disaster Head)',
    phone: '+91 98225 11980',
    type: 'STADIUM',
    status: 'OPTIMAL',
    resilienceScore: 98,
    historicalWithstand: {
      floodLevelM: 5.8,
      earthquakeRichter: 8.2,
      cycloneWindKmph: 175,
      landslideBufferM: 5000,
      pastIncidentsSurvived: 14
    },
    supplies: {
      waterLiters: 180000,
      waterDays: 20,
      foodRationDays: 22,
      medicalKits: 850,
      dieselGenHours: 450,
      sanitationUnits: 220,
      blankets: 11000
    },
    facilities: [
      'Multi-Tier Indoor Sports Arena with 12,000 Capacity',
      'State-Level Drone Monitoring & Communications Base',
      'Central Blood & Trauma Medical Reservoir'
    ]
  },

  // ==========================================
  // 8. GUJARAT
  // ==========================================
  {
    id: 'SH-GJ-001',
    name: 'Bhuj Earthquake-Resilient Disaster Haven & Civil Complex',
    address: 'Town Hall Road, Bhuj, Kutch, Gujarat - 370001',
    district: 'Kutch',
    state: 'Gujarat',
    totalCapacity: 5000,
    allocatedOccupancy: 3200,
    currentOccupancy: 2400,
    coordinates: [23.2420, 69.6669],
    contactPerson: 'Jitendra Patel (Kutch Disaster Management Cell)',
    phone: '+91 98250 33120',
    type: 'GOVERNMENT_OFFICE',
    status: 'OPTIMAL',
    resilienceScore: 99,
    historicalWithstand: {
      floodLevelM: 4.5,
      earthquakeRichter: 8.8,
      cycloneWindKmph: 195,
      landslideBufferM: 4000,
      pastIncidentsSurvived: 16
    },
    supplies: {
      waterLiters: 80000,
      waterDays: 16,
      foodRationDays: 20,
      medicalKits: 380,
      dieselGenHours: 300,
      sanitationUnits: 85,
      blankets: 4800
    },
    facilities: [
      'Seismic Base-Isolated Damping Foundation (Zone V Certified)',
      'Subterranean Emergency Borewell with Solar RO Filters',
      'SDRF Desert & Coastal All-Terrain Rescue Vehicle Center'
    ]
  },
  {
    id: 'SH-GJ-002',
    name: 'Surat Indoor Stadium & Tapi Flood Safe Haven',
    address: 'Ghod Dod Road, Athwa, Surat, Gujarat - 395007',
    district: 'Surat',
    state: 'Gujarat',
    totalCapacity: 8500,
    allocatedOccupancy: 5400,
    currentOccupancy: 4100,
    coordinates: [21.1702, 72.8311],
    contactPerson: 'Bhavesh Shah (Surat Disaster Officer)',
    phone: '+91 98252 88410',
    type: 'STADIUM',
    status: 'OPTIMAL',
    resilienceScore: 97,
    historicalWithstand: {
      floodLevelM: 7.5,
      earthquakeRichter: 7.8,
      cycloneWindKmph: 190,
      landslideBufferM: 6000,
      pastIncidentsSurvived: 15
    },
    supplies: {
      waterLiters: 110000,
      waterDays: 16,
      foodRationDays: 18,
      medicalKits: 450,
      dieselGenHours: 320,
      sanitationUnits: 125,
      blankets: 8000
    },
    facilities: [
      'Tapi River Flood Embankment Barrier System',
      'Dual Generator Redundant Micro-Grid',
      'Fast-Transit Emergency Boat Deployment Ramp'
    ]
  },

  // ==========================================
  // 9. TAMIL NADU
  // ==========================================
  {
    id: 'SH-TN-001',
    name: 'Chennai Jawaharlal Nehru Stadium Coastal Haven & Camp',
    address: 'Sydenhams Road, Periamet, Chennai, Tamil Nadu - 600003',
    district: 'Chennai',
    state: 'Tamil Nadu',
    totalCapacity: 14000,
    allocatedOccupancy: 8800,
    currentOccupancy: 6700,
    coordinates: [13.0827, 80.2707],
    contactPerson: 'M. Senthil Nathan (TNSDMA Operations Director)',
    phone: '+91 94440 12099',
    type: 'STADIUM',
    status: 'OPTIMAL',
    resilienceScore: 98,
    historicalWithstand: {
      floodLevelM: 7.0,
      earthquakeRichter: 7.8,
      cycloneWindKmph: 220,
      landslideBufferM: 8000,
      pastIncidentsSurvived: 20
    },
    supplies: {
      waterLiters: 200000,
      waterDays: 21,
      foodRationDays: 24,
      medicalKits: 900,
      dieselGenHours: 600,
      sanitationUnits: 250,
      blankets: 13000
    },
    facilities: [
      'Coastal Storm Surge Defenses with Heavy Dewatering Pumps',
      '3 Certified Helicopter Landing Zones',
      'State Disaster Control Central Video-Wall Link'
    ]
  },
  {
    id: 'SH-TN-002',
    name: 'Nilgiris Ooty Hill-Station Landslide Safe Haven',
    address: 'Club Road, Ooty, The Nilgiris, Tamil Nadu - 643001',
    district: 'The Nilgiris',
    state: 'Tamil Nadu',
    totalCapacity: 3500,
    allocatedOccupancy: 2300,
    currentOccupancy: 1700,
    coordinates: [11.4102, 76.6950],
    contactPerson: 'R. K. Meena (Nilgiris District Collectorate Relief)',
    phone: '+91 94441 55601',
    type: 'GOVERNMENT_OFFICE',
    status: 'OPTIMAL',
    resilienceScore: 94,
    historicalWithstand: {
      floodLevelM: 4.8,
      earthquakeRichter: 7.2,
      cycloneWindKmph: 165,
      landslideBufferM: 1600,
      pastIncidentsSurvived: 12
    },
    supplies: {
      waterLiters: 45000,
      waterDays: 12,
      foodRationDays: 14,
      medicalKits: 190,
      dieselGenHours: 160,
      sanitationUnits: 55,
      blankets: 3200
    },
    facilities: [
      'Geotextile Reinforced Slope Buffer Zone',
      'Cold Mountain Heated Shelters & Tea Estate Triage Deck',
      'Direct Highway Clearance Heavy Machinery Standby'
    ]
  },

  // ==========================================
  // 10. JAMMU & KASHMIR / LADAKH
  // ==========================================
  {
    id: 'SH-JK-001',
    name: 'Srinagar Bakshi Stadium High-Elevation Disaster Safe Haven',
    address: 'Wazir Bagh, Srinagar, Jammu & Kashmir - 190008',
    district: 'Srinagar',
    state: 'Jammu & Kashmir',
    totalCapacity: 7000,
    allocatedOccupancy: 4400,
    currentOccupancy: 3100,
    coordinates: [34.0700, 74.8050],
    contactPerson: 'Farooq Ahmad Mir (J&K SDMA Commander)',
    phone: '+91 94190 22100',
    type: 'STADIUM',
    status: 'OPTIMAL',
    resilienceScore: 96,
    historicalWithstand: {
      floodLevelM: 7.5,
      earthquakeRichter: 8.4,
      cycloneWindKmph: 150,
      landslideBufferM: 4500,
      pastIncidentsSurvived: 14
    },
    supplies: {
      waterLiters: 90000,
      waterDays: 16,
      foodRationDays: 20,
      medicalKits: 400,
      dieselGenHours: 350,
      sanitationUnits: 100,
      blankets: 6500
    },
    facilities: [
      'Jhelum River High Embankment Inundation Barrier',
      'Winter Snow & Sub-Zero Insulation Heating System',
      'Emergency Ham Radio & Inmarsat Satellite Station'
    ]
  }
];