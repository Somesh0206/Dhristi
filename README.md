# Dhristi (दृष्टि) - Geo-Intelligence for Vulnerable Habitations

> **"Mapping Risk, Protecting Lives: Smart Geo-Intelligence for Vulnerable Habitations"**

Dhristi is an enterprise-grade, responsive disaster management and hazard red-zone identification web platform. It integrates real-time geospatial analytics, carrying capacity stress assessment, automated citizen relocation routing, 50-year historical AI disaster prediction analytics, emergency incident dispatch, and a persistent Global SOS system.

---

## 🌟 Core Architecture & Features

### 1. Global SOS & Emergency Dispatch (`<SosModal />`)
- Accessible from any page via the persistent floating Red Emergency button in navbar and headers.
- **Citizen SOS Pathway**: 1-click GPS location lock, distress beacon transmitter, direct emergency helpline speed-dials (112, 1078, 1070, 108), and medical triage flags.
- **Responder Incident Dispatch Pathway**: Regional red-zone evacuation trigger, multi-channel broadcast (Cell SMS CBS 4370, Sirens, HAM radio relays), and live dispatch logging.
- Synthesized Web Audio API emergency pulse sound effects.

### 2. Hazard Red-Zone Identification (`/red-zones`)
- Interactive GIS Leaflet map categorizing areas into:
  - **Red Zones (Critical Risk >75%)**: High debris flow & active fault lines.
  - **Orange Zones (Moderate Risk 40-75%)**: Saturated soil & river spillway channels.
  - **Green Zones (Safe Havens <40%)**: Geotechnically stable corridors.
- Multi-hazard filtering: Landslides, Flash Floods, Earthquakes, Cyclones.
- Live sensor telemetry metrics per habitation (Pore-water pressure in kPa, rainfall intensity in mm/hr, seismic tremor magnitude, slope displacement mm/24h, soil moisture saturation %).

### 3. Live User Location & Allocation Hub (`/relocation`)
- Browser Geolocation detection with manual coordinate & habitation preset overrides.
- Automated nearest safe shelter allocation algorithm with route visualization, distance (km), estimated time of arrival (ETA on foot vs. 4x4 transit).
- Dynamic Habitation Carrying Capacity breakdown: Total capacity, Allocated occupancy, Remaining buffer, Stress index % with visual warning thresholds.

### 4. Global Shelter Database (`/shelters`)
- Directory & interactive map of certified multi-hazard safe shelters.
- Real-time live occupancy and overflow tracking.
- Emergency relief supplies on hand (Potable water liters/days, dry food rations, auxiliary genset fuel hours, trauma medical kits, sanitation units).
- 50-Year Disaster Resilience Audit rating & structural withstand benchmarks (flood depth meters, seismic Richter, cyclone wind speed, past survived events).

### 5. AI Predictions & Historical Analytics (`/predictions`)
- 50-year historical disaster analysis (EM-DAT style dataset from 1975 to 2025).
- Machine learning multi-horizon risk forecasting (7-day high-resolution & 30-day multi-week hazard probability curves powered by Recharts).
- Interactive Risk Simulation Sandbox: Adjust rainfall intensity slider, earthquake magnitude, soil saturation %, and slope gradient to compute real-time Factor of Safety (FS) and risk tier activations.

### 6. Responder & Admin Command Console (`/admin`)
- Live Citizen SOS alert feed with triage management (`PENDING` ➔ `DISPATCHED` ➔ `RESCUED`).
- Habitation population & capacity threshold overrides.
- Regional Emergency Alert Dispatch Station with geofenced broadcast directives.
- Real-time tally of deployed NDRF platoons, motorized boats, rescue helicopters, and field ambulances.

### 7. Disaster SOPs & Community Awareness (`/resources`)
- Actionable disaster survival SOP manuals for Landslides, Floods, Earthquakes, and Cyclones across Before, During, and After phases.
- Family 72-Hour Evacuation Go-Bag checklist builder with interactive readiness scoring.
- Downloadable/Printable Emergency Pocket Card with offline evacuation coordinates.
- Crowdsourced citizen hazard reporting portal with geotagging and community validation voting.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 14 (App Router)](https://nextjs.org/)
- **UI / Styling**: [Tailwind CSS](https://tailwindcss.com/) with custom dark command-center glassmorphism
- **Geospatial Mapping**: [Leaflet](https://leafletjs.com/) & [React-Leaflet](https://react-leaflet.js.org/)
- **Data Visualization**: [Recharts](https://recharts.org/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State Management**: React Context with Web Audio API sound synthesis

---

## 🚀 Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher)
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Somesh0206/Dhristi.git

# Navigate into project directory
cd Dhristi

# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to explore Dhristi.

### Production Build
```bash
npm run build
npm start
```

---

## 📄 License
MIT License - Built for humanitarian disaster resilience and early warning geo-intelligence.
