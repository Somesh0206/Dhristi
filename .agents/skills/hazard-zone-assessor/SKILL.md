---
name: hazard-zone-assessor
description: Evaluates geotechnical sensor telemetry, pore-water pressure, and slope stability Factor of Safety (FS).
---

# Hazard Zone Assessor Skill

## Overview
The `hazard-zone-assessor` skill ingests real-time IoT sensors (piezometers, inclinometers, seismographs, and rain gauges) to categorize geographic sectors into Red, Orange, Yellow, and Green risk tiers based on mathematical threshold models.

## Risk Assessment Formula
The skill evaluates the infinite slope Factor of Safety ($FS$):
- **$FS < 1.0$**: **CRITICAL RED** (Imminent slope failure, immediate relocation mandate).
- **$1.0 \le FS < 1.3$**: **HIGH ORANGE** (Pre-evacuation alert, standby mobilization).
- **$1.3 \le FS < 1.6$**: **MODERATE YELLOW** (Continuous geotechnical monitoring).
- **$FS \ge 1.6$**: **SAFE GREEN** (Stable geological baseline).

## Input Parameters
- `rainfallMmHr`: number (hourly rainfall rate)
- `poreWaterKPa`: number (pore-water pressure)
- `slopeGradientDeg`: number (slope angle in degrees)
- `seismicMagnitude`: number (Richter magnitude)
- `soilSaturationPct`: number (soil saturation percentage)

## Output Format
```json
{
  "riskTier": "RED",
  "factorOfSafety": 0.88,
  "statusDescription": "Unstable - Critical Failure Threshold Exceeded",
  "evacuationMandate": true,
  "recommendations": [
    "Trigger immediate siren broadcast in sector",
    "Dispatch SDRF mountain rescue squad to GPS coordinates",
    "Open school and hospital safe havens for inbound evacuees"
  ]
}
```
