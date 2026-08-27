












export const mockEmergencyGuides = [
{
  id: 'SOP-LS',
  hazard: 'landslide',
  title: 'Landslide & Debris Flow Response Protocol',
  badge: 'High Mountain & Slope Habitats',
  criticalHelpline: '1077 (District Disaster Control)',
  phases: {
    before: [
    'Identify signs of slope movement: cracked foundations, tilted trees/poles, sudden mud plumes in streams.',
    'Pre-map two alternative high-ground escape routes avoiding gullies and riverbeds.',
    'Secure essential documents, dry rations, emergency meds, and whistle in a waterproof Go-Bag.'],

    during: [
    'If inside during sudden slope failure: Curl into a tight ball, protect head/neck under sturdy furniture.',
    'Move quickly laterally AWAY from the path of debris flow; do NOT run downhill along the slide path.',
    'Listen for unusual sounds: cracking trees, rushing boulders, or sudden change in water flow.'],

    after: [
    'Stay clear of slide areas; secondary landslides often follow initial collapses.',
    'Check for injured or trapped persons without entering direct hazard zones.',
    'Listen to Dhristi SOS broadcasts and authorized radios for safe shelter status.']

  }
},
{
  id: 'SOP-FLD',
  hazard: 'flood',
  title: 'Flash Flood & Inundation Evacuation Protocol',
  badge: 'Riparian & Lowland Habitats',
  criticalHelpline: '1070 (State Emergency Operations)',
  phases: {
    before: [
    'Monitor river gauge warnings and rainfall intensity gauges on Dhristi portal.',
    'Turn off main electrical breaker and gas cylinders before water enters residence.',
    'Elevate valuables, livestock, and critical supplies to upper floors or designated flood platforms.'],

    during: [
    'Do NOT attempt to walk, swim, or drive through moving water. 15cm of rushing water can knock you down.',
    'If vehicle stalls in rising water, abandon it immediately and seek elevated shelter.',
    'Signal rescuers with high-visibility cloths, mirrors, or mobile SOS flashlights.'],

    after: [
    'Avoid contact with floodwater; assume contamination by sewage, chemicals, and live power lines.',
    'Boil all drinking water for minimum 10 minutes or use chlorination tablets.',
    'Photograph property damage before cleanup for NDRF/SDRF disaster compensation claims.']

  }
},
{
  id: 'SOP-EQ',
  hazard: 'earthquake',
  title: 'Earthquake & Subsidence Survival Protocol',
  badge: 'Tectonic & Fracture Zones',
  criticalHelpline: '112 (National Emergency)',
  phases: {
    before: [
    'Anchor heavy cupboards, water heaters, and overhead fixtures to wall studs.',
    'Conduct bi-monthly "Drop, Cover, and Hold On" family drills.',
    'Establish an out-of-state family emergency contact person.'],

    during: [
    'DROP to your hands and knees. COVER your head and neck under a sturdy table. HOLD ON until shaking stops.',
    'If outdoors: Move to clear open ground away from buildings, streetlights, and utility wires.',
    'Do NOT use elevators during tremors.'],

    after: [
    'Expect aftershocks. Inspect structures for severe wall/foundation fractures before re-entry.',
    'Check for gas leaks: if you smell gas or hear hissing, evacuate immediately and notify fire dispatch.',
    'Broadcast your location via Dhristi Citizen SOS if trapped.']

  }
},
{
  id: 'SOP-CYC',
  hazard: 'cyclone',
  title: 'Super Cyclone & Coastal Storm Surge Protocol',
  badge: 'Coastal & Fisher Communities',
  criticalHelpline: '1078 (NDMA Emergency Support)',
  phases: {
    before: [
    'Board up windows or apply criss-cross heavy adhesive tape to prevent flying glass shards.',
    'Store 7-day reserve of drinking water and non-perishable canned food.',
    'Relocate strictly to designated Cyclone Shelters within 12 hours of Red Alert broadcast.'],

    during: [
    'Remain indoors in the strongest, windowless central room or bathroom.',
    'Beware of the "Eye of the Cyclone": sudden calm is temporary before extreme reverse winds resume.',
    'Keep battery-operated radio tuned to local disaster frequencies.'],

    after: [
    'Beware of fallen electrical lines and weakened trees.',
    'Strictly obey official "All Clear" advisory before leaving safe shelters.',
    'Assist local relief teams with community triage and clean-up.']

  }
}];


export const emergencyHelplines = [
{ name: 'National Emergency Helpline', number: '112', description: 'Single emergency response for Police, Fire, and Ambulance' },
{ name: 'NDRF Disaster Helpline', number: '1078 / 011-24363260', description: 'National Disaster Response Force HQ' },
{ name: 'State Disaster Emergency (SEOC)', number: '1070', description: '24x7 State Emergency Operations Centre' },
{ name: 'District Disaster Control (DEOC)', number: '1077', description: 'District Collector Emergency Dispatch' },
{ name: 'Ambulance & Medical Emergency', number: '108', description: 'Emergency Medical Service' },
{ name: 'Fire & Rescue Services', number: '101', description: 'Immediate Fire Response' },
{ name: 'Women Disaster Support Helpline', number: '1091', description: 'Safety & Relief for Vulnerable Women/Children' }];