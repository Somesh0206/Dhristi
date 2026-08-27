# Dhristi Python Utility Scripts

This directory contains **offline Python data-processing utilities** for the Dhristi disaster management platform.

## Scripts

### `hazard_zone_analyzer.py`
Parses rainfall/soil sensor CSV telemetry and computes geotechnical **Factor of Safety (FS)** for landslide risk assessment.

**Usage:**
```bash
# Demo mode with sample data
python hazard_zone_analyzer.py --demo

# Analyze a CSV file
python hazard_zone_analyzer.py --input sensor_data.csv --output report.json
```

**CSV Input Format:**
```csv
zone_id,rainfall_mm_hr,pore_pressure_kpa,soil_saturation_pct
WY-001,58.4,142.1,98
WY-002,32.1,85.3,82
```

**Output:** JSON with `factor_of_safety`, `risk_level` (RED/ORANGE/GREEN), and geotechnical details.

---

### `shelter_capacity_manager.py`
Calculates shelter utilization rates, identifies overflow, and recommends population redistribution across safe havens (Schools, Hospitals, Stadiums, Government Offices).

**Usage:**
```bash
# Demo mode
python shelter_capacity_manager.py --demo

# Find shelter for 150 evacuees
python shelter_capacity_manager.py --evacuees 150

# Analyze shelter file
python shelter_capacity_manager.py --input shelters.json --output allocation.json
```

---

## Requirements
- Python 3.8+
- No external dependencies (uses only Python standard library)
