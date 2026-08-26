export type Language = 'en' | 'hi';

export const translations: Record<Language, Record<string, string>> = {
  en: {
    // Brand & Header
    'brand.name': 'DHRISTI',
    'brand.tagline': 'National Disaster Red-Zone & Relief Command',
    'nav.home': 'Overview',
    'nav.redZones': 'Red Zones',
    'nav.shelters': 'Safe Shelters',
    'nav.relocation': 'Relocation Guide',
    'nav.predictions': 'AI Predictions',
    'nav.admin': 'SEOC Command',
    'nav.policeSos': 'Police 112 & Helplines',
    'nav.sosEmergency': 'EMERGENCY SOS',
    'nav.liveFeeds': 'Live Global Feeds',
    'nav.login': 'Sign In / Role',
    'nav.language': 'Language',

    // Role & Login Modal
    'auth.title': 'DHRISTI GEO-INTELLIGENCE',
    'auth.subtitle': 'National Disaster Red-Zone & Relief Command Gateway',
    'auth.selectRole': 'Select Operational Clearance Role',
    'auth.chooseLanguage': 'Choose Preferred Language / भाषा चुनें',
    'auth.roleAdmin': 'Admin (SEOC)',
    'auth.roleStaff': 'Staff / NDRF',
    'auth.roleCitizen': 'Citizen Guest',
    'auth.nameLabel': 'Official Name / Officer Call-Sign',
    'auth.emailLabel': 'Official Email / Contact ID',
    'auth.passcodeLabel': 'Security Passcode / Token',
    'auth.demoProfile': 'One-Click Pre-Authenticated Demo Profile',
    'auth.autofill': 'Auto-Fill',
    'auth.guestBtn': 'Guest View',
    'auth.enterAs': 'Enter Portal as',

    // Home Page Hero
    'hero.badge': 'State Emergency Operations Center Active',
    'hero.title': 'Hazard Red-Zones & Immediate Relocation Command',
    'hero.subtitle':
      'Real-time geospatial intelligence, carrying capacity assessment of safe havens (Schools, Hospitals, Stadiums & Govt Offices), and AI predictive evacuation dispatch.',
    'hero.btnEvacuate': 'Find My Safe Shelter Route',
    'hero.btnSos': 'Trigger Immediate Citizen SOS',
    'hero.btnRadar': 'Inspect 3D GIS Hazard Zones',

    // Stat Cards
    'stat.monitoredHabitations': 'Monitored Habitations',
    'stat.activeRedZones': 'Critical Red Zones',
    'stat.safeShelterCapacity': 'Safe Havens Capacity',
    'stat.relocationUrgency': 'Relocation Mandate Pop',
    'stat.poreWaterAlert': 'Pore-Water Stress',

    // Safe Shelter Categories
    'shelters.title': 'Safe Shelters & Relief Camps',
    'shelters.subtitle':
      'Carrying capacity tracking, real-time occupancy, and 50-year structural resilience across verified safe havens.',
    'shelters.filterAll': 'All Shelters',
    'shelters.filterSchool': '🏫 Schools',
    'shelters.filterHospital': '🏥 Hospitals',
    'shelters.filterStadium': '🏟️ Stadiums',
    'shelters.filterGovt': '🏛️ Govt Offices',
    'shelters.capacity': 'Total Capacity',
    'shelters.occupancy': 'Live Occupancy',
    'shelters.resilience': '50-Yr Resilience Score',
    'shelters.routeBtn': 'Plan Evacuation Route',

    // Relocation & Navigation
    'relocation.title': 'AI Dynamic Evacuation Road Guidance',
    'relocation.subtitle':
      'Turn-by-turn road navigation avoiding debris-flow ravines, real-time elevation profile, and nearest safe haven allocation.',
    'relocation.assignedShelter': 'Assigned Safe Haven',
    'relocation.transitMode': 'Transit Mode',
    'relocation.onFoot': 'On Foot',
    'relocation.vehicle': '4x4 Transit',
    'relocation.elevation': 'Corridor Elevation & Slope Profile',
    'relocation.maneuvers': 'Turn-by-Turn Safe Maneuvers',
    'relocation.completeEvac': 'Confirm Safe Arrival at Shelter',

    // AI Predictions
    'predictions.title': 'AI Predictive Hazard Analytics & Early Warning',
    'predictions.subtitle':
      'Machine learning ensemble models forecasting landslide susceptibility, slope pore pressure, and 72-hour rainfall thresholds.',
    'predictions.runSimulation': 'Run AI Multi-Hazard Simulation',
    'predictions.rainfallThreshold': 'Cumulative 24h Rainfall Trigger',
    'predictions.poreWaterIndex': 'Soil Saturation & Pore Pressure',
    'predictions.debrisVelocity': 'Projected Debris Flow Velocity',

    // Admin / SEOC Console
    'admin.title': 'State Emergency Operations Console (SEOC)',
    'admin.subtitle':
      'Real-time citizen SOS triage, rapid rescue team dispatch, and turn-by-turn road route guidance.',
    'admin.liveSosStream': 'Citizen SOS Distress Beacons & Live Rescue Dispatch',
    'admin.dispatchBtn': 'Respond & Dispatch Rescue Team',
    'admin.viewRouteBtn': 'View Rescue Road Route',
    'admin.markRescuedBtn': 'Mark Rescued',
    'admin.broadcastAlert': 'Multi-Channel Emergency Warning Broadcast',
    'admin.capacityOverride': 'Habitation Population & Capacity Stress Override',

    // SOS & Police Modals
    'sos.title': 'EMERGENCY CITIZEN SOS BEACON',
    'sos.name': 'Your Name',
    'sos.phone': 'Contact Phone Number',
    'sos.trappedCount': 'Number of Trapped Persons',
    'sos.medicalReq': 'Medical Assistance Required (Ambulance)',
    'sos.transmitBtn': 'TRANSMIT CITIZEN SOS BEACON',
    'police.title': 'Emergency Government Contacts & Police 112',
    'police.subtitle': 'Rapid one-tap calling for Police, NDRF, SDRF, Disaster Control, and Medical Emergencies',

    // Common
    'common.status': 'Status',
    'common.live': 'LIVE',
    'common.distance': 'Distance',
    'common.eta': 'Estimated Arrival',
    'common.googleNav': 'Google Maps',
    'common.appleNav': 'Apple Maps',
  },
  hi: {
    // Brand & Header
    'brand.name': 'दृष्टि (DHRISTI)',
    'brand.tagline': 'राष्ट्रीय आपदा रेड-ज़ोन एवं राहत कमान केंद्र',
    'nav.home': 'अवलोकन',
    'nav.redZones': 'रेड ज़ोन',
    'nav.shelters': 'सुरक्षित आश्रय स्थल',
    'nav.relocation': 'पुनर्वास मार्गदर्शन',
    'nav.predictions': 'एआई पूर्वानुमान',
    'nav.admin': 'राज्य नियंत्रण केंद्र',
    'nav.policeSos': 'पुलिस 112 एवं हेल्पलाइन',
    'nav.sosEmergency': 'आपातकालीन एसओएस',
    'nav.liveFeeds': 'लाइव आपदा फ़ीड्स',
    'nav.login': 'लॉग इन / पद',
    'nav.language': 'भाषा (Language)',

    // Role & Login Modal
    'auth.title': 'दृष्टि भू-स्थानिक सुरक्षा प्रणाली',
    'auth.subtitle': 'राष्ट्रीय आपदा प्रबंधन, रेड-ज़ोन पहचान एवं राहत कमान पोर्टल',
    'auth.selectRole': 'संचालन भूमिका / पद का चयन करें',
    'auth.chooseLanguage': 'अपनी पसंदीदा भाषा चुनें (Select Language)',
    'auth.roleAdmin': 'प्रशासक (SEOC निदेशक)',
    'auth.roleStaff': 'राहत दल (NDRF/SDRF)',
    'auth.roleCitizen': 'नागरिक / जनसामान्य',
    'auth.nameLabel': 'अधिकारी / नागरिक का नाम',
    'auth.emailLabel': 'आधिकारिक ईमेल / संपर्क आईडी',
    'auth.passcodeLabel': 'सुरक्षा कोड / टोकन',
    'auth.demoProfile': 'एक-क्लिक स्वचालित प्रमाणित डेमो प्रोफ़ाइल',
    'auth.autofill': 'स्वतः भरें',
    'auth.guestBtn': 'नागरिक दर्शक रूप में देखें',
    'auth.enterAs': 'के रूप में प्रवेश करें',

    // Home Page Hero
    'hero.badge': 'राज्य आपातकालीन संचालन केंद्र सक्रिय',
    'hero.title': 'आपदा रेड-ज़ोन पहचान एवं तत्काल पुनर्वास कमान',
    'hero.subtitle':
      'वास्तविक समय की भू-स्थानिक निगरानी, सुरक्षित आश्रयों (स्कूल, अस्पताल, स्टेडियम एवं सरकारी कार्यालय) की वहन क्षमता का आकलन और एआई आधारित त्वरित निकासी मार्ग।',
    'hero.btnEvacuate': 'मेरा सुरक्षित आश्रय मार्ग खोजें',
    'hero.btnSos': 'तत्काल नागरिक SOS भेजें',
    'hero.btnRadar': '3D जीआईएस आपदा रेड-ज़ोन देखें',

    // Stat Cards
    'stat.monitoredHabitations': 'निगरानी बस्तियां',
    'stat.activeRedZones': 'अति-संवेदनशील रेड ज़ोन',
    'stat.safeShelterCapacity': 'सुरक्षित आश्रय वहन क्षमता',
    'stat.relocationUrgency': 'तत्काल निकासी योग्य आबादी',
    'stat.poreWaterAlert': 'मृदा जल दबाव तनाव',

    // Safe Shelter Categories
    'shelters.title': 'सुरक्षित आश्रय स्थल एवं राहत शिविर',
    'shelters.subtitle':
      'स्कूलों, अस्पतालों, स्टेडियमों और सरकारी कार्यालयों में वहन क्षमता, लाइव अधिभोग और 50-वर्षीय संरचनात्मक सुरक्षा रेटिंग।',
    'shelters.filterAll': 'सभी आश्रय स्थल',
    'shelters.filterSchool': '🏫 स्कूल',
    'shelters.filterHospital': '🏥 अस्पताल',
    'shelters.filterStadium': '🏟️ स्टेडियम',
    'shelters.filterGovt': '🏛️ सरकारी कार्यालय',
    'shelters.capacity': 'कुल क्षमता',
    'shelters.occupancy': 'वर्तमान अधिभोग',
    'shelters.resilience': '50-वर्षीय स्थायित्व स्कोर',
    'shelters.routeBtn': 'निकासी मार्ग बनाएं',

    // Relocation & Navigation
    'relocation.title': 'एआई डायनामिक सड़क निकासी मार्गदर्शन',
    'relocation.subtitle':
      'भूस्खलन व जलभराव से मुक्त वास्तविक सड़क मोड़-दर-मोड़ नेविगेशन, ऊंचाई प्रोफ़ाइल एवं निकटतम सुरक्षित आश्रय आवंटन।',
    'relocation.assignedShelter': 'आवंटित सुरक्षित आश्रय',
    'relocation.transitMode': 'पारगमन का माध्यम',
    'relocation.onFoot': 'पैदल',
    'relocation.vehicle': '4x4 आपातकालीन वाहन',
    'relocation.elevation': 'कॉरिडोर ऊंचाई एवं ढलान विश्लेषण',
    'relocation.maneuvers': 'सुरक्षित सड़क मोड़ निर्देश (OSRM)',
    'relocation.completeEvac': 'आश्रय स्थल पर सुरक्षित आगमन दर्ज करें',

    // AI Predictions
    'predictions.title': 'एआई बहु-आपदा जोखिम विश्लेषण एवं पूर्व चेतावनी',
    'predictions.subtitle':
      'मशीन लर्निंग मॉडल द्वारा भूस्खलन संवेदनशीलता, मिट्टी में छिद्र जल दबाव और 72 घंटे के वर्षा थ्रेशोल्ड का सटीक पूर्वानुमान।',
    'predictions.runSimulation': 'एआई आपदा सिमुलेशन चलाएं',
    'predictions.rainfallThreshold': 'संचयी 24 घंटे का वर्षा स्तर',
    'predictions.poreWaterIndex': 'मृदा संतृप्ति एवं जल दबाव सूचकांक',
    'predictions.debrisVelocity': 'संभावित मलबे के बहाव की गति',

    // Admin / SEOC Console
    'admin.title': 'राज्य आपातकालीन संचालन नियंत्रण केंद्र (SEOC)',
    'admin.subtitle':
      'नागरिक संकटकालीन SOS की लाइव निगरानी, त्वरित बचाव दल प्रेषण और सड़क मार्ग नेविगेशन।',
    'admin.liveSosStream': 'नागरिक SOS संकट बीकन एवं लाइव बचाव दल प्रेषण',
    'admin.dispatchBtn': 'बचाव दल अधिकृत कर भेजें',
    'admin.viewRouteBtn': 'बचाव सड़क मार्ग देखें',
    'admin.markRescuedBtn': 'सुरक्षित बचा लिया गया दर्ज करें',
    'admin.broadcastAlert': 'बहु-माध्यम आपातकालीन चेतावनी प्रसारण',
    'admin.capacityOverride': 'बस्ती जनसंख्या एवं वहन क्षमता ओवरराइड',

    // SOS & Police Modals
    'sos.title': 'नागरिक आपातकालीन SOS बीकन',
    'sos.name': 'आपका नाम',
    'sos.phone': 'संपर्क फोन नंबर',
    'sos.trappedCount': 'फंसे हुए व्यक्तियों की संख्या',
    'sos.medicalReq': 'चिकित्सा सहायता आवश्यक (एम्बुलेंस)',
    'sos.transmitBtn': 'नागरिक SOS बीकन प्रेषित करें',
    'police.title': 'आपातकालीन सरकारी नंबर एवं पुलिस 112',
    'police.subtitle': 'पुलिस, एनडीआरएफ, एसडीआरएफ, आपदा नियंत्रण कक्ष और एम्बुलेंस के लिए वन-टैप कॉल सुविधा',

    // Common
    'common.status': 'स्थिति',
    'common.live': 'लाइव',
    'common.distance': 'दूरी',
    'common.eta': 'अनुमानित आगमन समय',
    'common.googleNav': 'गूगल मैप्स नेविगेशन',
    'common.appleNav': 'एप्पल मैप्स नेविगेशन',
  },
};

export function getTranslation(key: string, lang: Language = 'en'): string {
  const langDict = translations[lang] || translations.en;
  return langDict[key] || translations.en[key] || key;
}
