# Dhristi - Product Requirements Document (PRD) & Specification

## 1. Product Vision & Problem Statement

In mountainous and river-basin regions such as Wayanad, Joshimath, and Dharamshala, unpredicted landslides, cloudbursts, and flash floods threaten dense human settlements. Existing systems lack **real-time carrying capacity awareness of safe havens** (schools, hospitals, stadiums, and government offices), **turn-by-turn road navigation around compromised corridors**, and **unified emergency dispatch**.

**Dhristi** solves this through an end-to-end intelligent platform that continuously monitors geotechnical sensor telemetry, dynamically models slope failure thresholds, automatically computes road evacuation routes, and connects citizens with immediate relief and police assistance.

---

## 2. Target User Personas

1. **Citizen in Distress (Pooja / Ramesh)**: Resident living on a steep hill slope needing instant SOS dispatch, nearest safe shelter route, and voice guidance in Hindi or English.
2. **First Responder / NDRF Squad Commander (Capt. Ananya Iyer)**: Field rescue team leader requiring GPS-accurate incident queues, turn-by-turn road navigation, and victim medical triage.
3. **SEOC Director / Administrator (Dr. Rajesh Kumar)**: State Emergency Operations Commander managing regional alerts, habitation carrying capacity stress overrides, and multi-channel siren broadcasts.

---

## 3. User Stories & Acceptance Criteria

### User Story 1: Universal Emergency SOS & Police PCR Dispatch
**As a** citizen trapped in a landslide red-zone,  
**I want to** broadcast my GPS location, victim count, and request police PCR/NDRF assistance in one click,  
**So that** emergency rescue squads can reach my exact coordinates immediately.

#### Acceptance Criteria:
- **AC 1.1**: *Given* a user clicks the persistent red SOS button or says *"Send SOS"*, *When* the Universal Emergency SOS Hub opens, *Then* the GPS coordinates are automatically captured with accuracy indication.
- **AC 1.2**: *Given* the user selects the Police SOS tab (PCR 112), *When* they submit the beacon, *Then* the nearest police station is assigned, vehicle status updates to `DISPATCHED_EN_ROUTE`, and a direct call button for `112` is presented.
- **AC 1.3**: *Given* an SOS beacon is submitted, *When* the SEOC console is open, *Then* the incident appears in the real-time distress queue with triage status (`PENDING`).

---

### User Story 2: Safe Haven Carrying Capacity & Filterable Directory
**As a** disaster response coordinator,  
**I want to** filter certified safe shelters (Schools, Hospitals, Stadiums, Government Offices) and monitor their live carrying capacities,  
**So that** evacuees are not sent to overcrowded or structurally compromised facilities.

#### Acceptance Criteria:
- **AC 2.1**: *Given* a user visits `/shelters`, *When* clicking category tabs (`Schools`, `Hospitals`, `Stadiums`, `Govt Offices`), *Then* only shelters matching the selected category are displayed.
- **AC 2.2**: *Given* any shelter card, *When* inspected, *Then* the card shows total capacity, live occupancy percentage bar, 50-year structural resilience score, and available relief supplies (potable water, rations, diesel genset, trauma kits).

---

### User Story 3: Turn-by-Turn Road Evacuation Guidance & Elevation Profile
**As an** evacuating citizen or rescue driver,  
**I want to** receive turn-by-turn road navigation with an elevation/slope profile avoiding hazardous red zones,  
**So that** I reach the assigned safe shelter without getting stranded on compromised mountain roads.

#### Acceptance Criteria:
- **AC 3.1**: *Given* a user enters the `/relocation` page, *When* an assigned shelter is active, *Then* the interactive map renders the true road vector calculated via OSRM, rather than a straight line.
- **AC 3.2**: *Given* the user toggles between `On Foot` and `4x4 Transit Vehicle`, *When* clicked, *Then* the travel duration and pace adjust dynamically ($4.5\text{ km/h}$ vs $35\text{ km/h}$).
- **AC 3.3**: *Given* the user completes evacuation, *When* clicking *"Confirm Safe Arrival"*, *Then* celebratory confetti triggers and shelter occupancy increments safely.

---

### User Story 4: Dhristi Vaani AI Voice Assistant
**As a** citizen in panic or with limited literacy,  
**I want to** speak naturally in Hindi or English to find safe shelters or trigger an SOS,  
**So that** I can get urgent disaster instructions hands-free.

#### Acceptance Criteria:
- **AC 4.1**: *Given* the user clicks the `Vaani AI` microphone or floating voice pill, *When* speaking *"Find nearest shelter"* or *"सुरक्षित आश्रय खोजो"*, *Then* the assistant responds with speech audio synthesis and automatically navigates to `/shelters`.
- **AC 4.2**: *Given* the user speaks *"Send SOS"* or *"पुलिस को बुलाओ"*, *Then* the assistant confirms via voice and opens the unified Emergency SOS modal with the target tab pre-selected.

---

### User Story 5: Full Bilingual Localization (English & Hindi)
**As a** non-English speaking resident in disaster-prone regions,  
**I want** the entire web application to render in fluent Hindi upon selection,  
**So that** I can comprehend critical safety instructions without language barriers.

#### Acceptance Criteria:
- **AC 5.1**: *Given* the user selects `हिन्दी` in the login modal or header toggle, *When* navigating across any of the 25 pages, *Then* all navigation labels, telemetry cards, SOP manuals, and form buttons display in Hindi.
