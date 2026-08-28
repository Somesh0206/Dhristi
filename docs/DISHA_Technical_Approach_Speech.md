# DISHA: Technical Approach & Architecture — 1-Minute Pitch Speech

**Speech Duration:** ~60 Seconds (Target: ~150 words spoken at a confident, natural cadence)  
**Programming Languages & Core Stack:** JavaScript (ES6+ / Node.js), React JSX, HTML5 / Tailwind CSS, GeoJSON / PostGIS  
**Target Audience:** Hackathon Judges, Technical Evaluators, Disaster Management Authorities (NDMA/SEOC)

---

### 🎙️ 1-Minute Spoken Script

"Distinguished judges and evaluators, welcome to **DISHA** — our proactive Geo-Intelligence platform engineered to transition disaster response from reactive chaos to deterministic, life-saving automation.

DISHA is built on a high-performance **Full-Stack JavaScript and Node.js architecture** powered by **Next.js 14 App Router** and **React JSX**. 

Our system operates across four modular architectural layers:
1. **The Telemetry & Physics Layer**, which continuously models soil saturation, pore-water pressure, and rainfall thresholds to compute slope stability factor-of-safety metrics.
2. **The Geospatial Routing Engine**, combining Leaflet, GeoJSON, and OpenStreetMap OSRM graphs to plot hazard-avoiding corridors while balancing displaced populations against verified shelter carrying capacities.
3. **The Autonomous Response Layer**, triaging citizen SOS beacons and synchronizing rescue squads.
4. **The Resilient Client Layer**, featuring offline caching, bilingual Web Speech AI (*Vaani*), AES-256 encrypted tactical chat, and role-gated official PDF audits.

By fusing real-time spatial computation with robust JavaScript architecture, DISHA ensures every emergency decision is fast, mathematically sound, and life-first."

---

## 🏛️ Comprehensive Architecture Blueprint (Cheat Sheet)

```
+-----------------------------------------------------------------------------------+
|                           DISHA ARCHITECTURAL STACK                               |
+-----------------------------------------------------------------------------------+

  [ 1. CLIENT & PRESENTATION LAYER ]
  • JavaScript (ES6+) & React 18 (JSX)
  • Modern Reactive UI: Tailwind CSS, Lucide Icons, Glassmorphism design tokens
  • Natural Language Interface: Bilingual Vaani AI Voice Engine (Web Speech API)
  • Client Security: Role-Based Access Control (Admin, Staff, Citizen clearance gates)

  [ 2. GEOSPATIAL & TELEMETRY ENGINE ]
  • Spatial Visualization: Leaflet GIS Engine + GeoJSON Hazard Polygon Layers
  • Road Network Routing: OpenStreetMap OSRM Engine (Shortest safe path calculation)
  • Geotechnical Physics: Real-time Factor of Safety (FS) & Pore-Water Pressure models
  • Disaster Aggregation: Multi-source feeds (USGS Seismic, Open-Meteo, NASA EONET)

  [ 3. CORE LOGIC & BACKEND API LAYER (Next.js 14 Node.js) ]
  • /api/routing/osrm         -> Algorithmic hazard-avoiding road corridors
  • /api/shelters             -> Dynamic carrying capacity & bed availability balancer
  • /api/sos                  -> Autonomous beacon triage & PCR rescue dispatching
  • /api/reports/export       -> In-memory & JSON archived PDF audit generator (jsPDF)
  • /api/chat/messages        -> AES-256 encrypted responder coordination channel

  [ 4. DATA & PERSISTENCE LAYER ]
  • Persistent Databases: sheltersData, zonesData, policeData, usageLogs, exportReports
  • Offline Fail-Safe Continuity: LocalStorage & SessionStorage fallback caches
+-----------------------------------------------------------------------------------+
```

---

## 💻 Programming Languages & Technologies Breakdown
- **JavaScript (ES6+)**: Powers client interactivity, dynamic map rendering, state synchronization, and serverless Node.js API endpoints.
- **React (JSX)**: Component-driven modular interface with Context API state management.
- **Node.js**: Next.js 14 App Router server-side execution runtime handling secure API routes and reporting pipelines.
- **HTML5 & Vanilla / Tailwind CSS**: Accessible semantic layouts, glassmorphism overlays, responsive grids, and print-ready document styling.
- **GeoJSON & OSRM (Graph Matrix)**: Vectorized spatial coordinates, bounding box queries, and road network routing.
