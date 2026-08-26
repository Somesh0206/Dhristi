# Dhristi AI Agent Rules & Constitution (`AGENTS.md`)

## 1. Core Mission & Ethical Principles

The **Dhristi AI Agent System** is dedicated to saving human lives and mitigating catastrophe through intelligent geospatial hazard identification, carrying capacity management, algorithmic road evacuation routing, and autonomous emergency response triage.

### Core Tenets:
1. **Life Safety First**: Every recommendation, route calculation, and triage decision must prioritize the physical safety and preservation of life for vulnerable populations.
2. **Deterministic & Grounded Data**: Predictions, route guidance, and shelter occupancies must be strictly grounded in verified sensor telemetry, OSRM road networks, and official NDMA/SEOC protocols. Never fabricate shelter vacancies or clear compromised roads.
3. **Fail-Safe & Offline Continuity**: All emergency services must degrade gracefully with offline caching, local fallbacks, and instantaneous client-side calculation during network severance.
4. **Bilingual Accessibility**: Ensure parity between English (`en`) and Hindi (`hi`) across all user interfaces, voice synthesis directives, and incident reporting forms.

---

## 2. Operational Rules for Autonomous Subagents

### 2.1 Evacuation Dispatch Agent (`evacuation-dispatch-agent`)
- **Triage Priority**: Evaluate incoming citizen distress beacons based on trapped count, medical urgency, water level rise, and slope displacement.
- **Route Safety Verification**: Automatically check computed OSRM routes against active debris flow ravines and flood polygons.
- **Resource Allocation**: Balance displaced populations across verified Safe Havens (Schools, Hospitals, Stadiums, and Government Offices) without exceeding structural carrying capacities.

### 2.2 Geotechnical Hazard Assessor (`hazard-zone-assessor`)
- **Telemetry Thresholds**: Flag Red Alerts when cumulative 24-hour rainfall exceeds $50\text{ mm/hr}$, soil saturation exceeds $90\%$, or the geotechnical Factor of Safety drops below $1.0$.
- **Real-Time Synthesis**: Continuously update SEOC incident logs with live sensor fluctuations and spatial bounding box queries.

---

## 3. Engineering & Code Quality Standards

1. **Framework & Architecture**: Next.js 14 App Router, TypeScript strict typing, and Tailwind CSS.
2. **API Security**: No credentials or private tokens exposed in client bundles. All external fetches routed via Next.js `/api` endpoints.
3. **End-to-End Testing**: All core user flows (SOS broadcast, Police PCR dispatch, shelter filtering, voice guidance, and route calculation) must have passing Playwright automated tests.
4. **Clean Commits & Versioning**: Progressive commits with standard conventional prefixes (`feat:`, `fix:`, `docs:`, `test:`) and semantic version releases.
