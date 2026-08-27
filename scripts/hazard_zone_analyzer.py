#!/usr/bin/env python3
"""
Dhristi Hazard Zone Analyzer
Parses CSV rainfall/soil sensor telemetry data and calculates
geotechnical Factor of Safety (FS) for landslide risk assessment.

Usage:
    python hazard_zone_analyzer.py --input sensor_data.csv --output report.json

Output columns:
    zone_id, rainfall_mm_hr, pore_pressure_kpa, soil_saturation_pct,
    factor_of_safety, risk_level (RED/ORANGE/GREEN)
"""

import csv
import json
import argparse
import math
import sys
from datetime import datetime, timezone

# Ensure stdout handles UTF-8 properly across cross-platform terminals
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass


# Geotechnical constants (Wayanad laterite soil profile)
COHESION_KPA = 12.5          # c' (kPa) - effective cohesion
FRICTION_ANGLE_DEG = 28.0    # φ' (degrees) - internal friction angle
UNIT_WEIGHT_KN_M3 = 19.2     # γ (kN/m³) - saturated unit weight
SLOPE_ANGLE_DEG = 32.0       # β (degrees) - typical Wayanad slope
DEPTH_M = 2.5                # H (m) - failure plane depth

RAINFALL_RED_THRESHOLD = 50.0    # mm/hr for RED alert
RAINFALL_ORANGE_THRESHOLD = 25.0 # mm/hr for ORANGE alert
FS_RED_THRESHOLD = 1.0           # Factor of Safety < 1.0 = failure imminent
FS_ORANGE_THRESHOLD = 1.3        # Factor of Safety < 1.3 = high risk


def calculate_factor_of_safety(rainfall_mm_hr, pore_pressure_kpa, soil_saturation_pct):
    """
    Simplified infinite slope stability analysis.
    FS = (c' + (γH·cos²β - u)·tan φ') / (γH·sin β·cos β)
    """
    beta_rad = math.radians(SLOPE_ANGLE_DEG)
    phi_rad = math.radians(FRICTION_ANGLE_DEG)

    # Pore water pressure contribution (u = γw·hw)
    # Approximate hw from saturation percentage
    hw = DEPTH_M * (soil_saturation_pct / 100.0) * 0.5
    u_actual = max(pore_pressure_kpa, 9.81 * hw)  # use reported or calculated

    normal_stress = UNIT_WEIGHT_KN_M3 * DEPTH_M * (math.cos(beta_rad) ** 2)
    shear_resistance = COHESION_KPA + (normal_stress - u_actual) * math.tan(phi_rad)
    driving_stress = UNIT_WEIGHT_KN_M3 * DEPTH_M * math.sin(beta_rad) * math.cos(beta_rad)

    if driving_stress <= 0:
        return 99.0  # Flat terrain, no failure risk

    fs = shear_resistance / driving_stress
    return round(max(fs, 0.01), 3)


def classify_risk(fs, rainfall_mm_hr):
    """Classify risk level based on Factor of Safety and rainfall rate."""
    if fs < FS_RED_THRESHOLD or rainfall_mm_hr > RAINFALL_RED_THRESHOLD:
        return 'RED'
    elif fs < FS_ORANGE_THRESHOLD or rainfall_mm_hr > RAINFALL_ORANGE_THRESHOLD:
        return 'ORANGE'
    else:
        return 'GREEN'


def analyze_csv(input_path):
    """
    Parse sensor CSV and compute FS for each reading.
    Expected CSV columns: zone_id, rainfall_mm_hr, pore_pressure_kpa, soil_saturation_pct
    """
    results = []

    with open(input_path, newline='', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                zone_id = row.get('zone_id', 'UNKNOWN')
                rainfall = float(row.get('rainfall_mm_hr', 0))
                pore = float(row.get('pore_pressure_kpa', 0))
                saturation = float(row.get('soil_saturation_pct', 0))

                fs = calculate_factor_of_safety(rainfall, pore, saturation)
                risk = classify_risk(fs, rainfall)

                results.append({
                    'zone_id': zone_id,
                    'rainfall_mm_hr': rainfall,
                    'pore_pressure_kpa': pore,
                    'soil_saturation_pct': saturation,
                    'factor_of_safety': fs,
                    'risk_level': risk,
                    'alert': risk == 'RED',
                    'analyzed_at': datetime.now(timezone.utc).isoformat(),
                })
            except (ValueError, KeyError) as e:
                print(f"Warning: Could not parse row {row}: {e}")

    return results


def run_demo():
    """Run demonstration with sample data."""
    sample_zones = [
        {'zone_id': 'WY-RED-001', 'rainfall_mm_hr': 58.4, 'pore_pressure_kpa': 142.1, 'soil_saturation_pct': 98},
        {'zone_id': 'WY-ORG-002', 'rainfall_mm_hr': 32.1, 'pore_pressure_kpa': 85.3, 'soil_saturation_pct': 82},
        {'zone_id': 'WY-GRN-003', 'rainfall_mm_hr': 12.7, 'pore_pressure_kpa': 45.0, 'soil_saturation_pct': 55},
        {'zone_id': 'JM-RED-004', 'rainfall_mm_hr': 45.2, 'pore_pressure_kpa': 138.0, 'soil_saturation_pct': 95},
        {'zone_id': 'KL-GRN-005', 'rainfall_mm_hr': 8.3, 'pore_pressure_kpa': 32.1, 'soil_saturation_pct': 42},
    ]

    print("\n=== DHRISTI HAZARD ZONE ANALYZER ===\n")
    print(f"{'Zone ID':<20} {'Rainfall':>10} {'Pore(kPa)':>12} {'Sat%':>6} {'FS':>8} {'Risk':>8}")
    print("-" * 70)

    results = []
    for zone in sample_zones:
        fs = calculate_factor_of_safety(
            zone['rainfall_mm_hr'],
            zone['pore_pressure_kpa'],
            zone['soil_saturation_pct']
        )
        risk = classify_risk(fs, zone['rainfall_mm_hr'])
        results.append({**zone, 'factor_of_safety': fs, 'risk_level': risk})

        risk_icon = '🔴' if risk == 'RED' else '🟠' if risk == 'ORANGE' else '🟢'
        print(
            f"{zone['zone_id']:<20} {zone['rainfall_mm_hr']:>10.1f} "
            f"{zone['pore_pressure_kpa']:>12.1f} {zone['soil_saturation_pct']:>6.0f} "
            f"{fs:>8.3f} {risk_icon} {risk:>6}"
        )

    red_zones = [r for r in results if r['risk_level'] == 'RED']
    print(f"\nSummary: {len(red_zones)} RED ZONES requiring immediate evacuation")
    return results


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Dhristi Hazard Zone Analyzer')
    parser.add_argument('--input', help='Input CSV file path')
    parser.add_argument('--output', help='Output JSON file path')
    parser.add_argument('--demo', action='store_true', help='Run with sample data')

    args = parser.parse_args()

    if args.demo or not args.input:
        results = run_demo()
    else:
        results = analyze_csv(args.input)
        print(f"Analyzed {len(results)} sensor readings.")

    if args.output:
        with open(args.output, 'w', encoding='utf-8') as f:
            json.dump(results, f, indent=2)
        print(f"Report saved to: {args.output}")
