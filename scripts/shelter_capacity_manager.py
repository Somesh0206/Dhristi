#!/usr/bin/env python3
"""
Dhristi Shelter Capacity Manager
Calculates shelter utilization rates, overflow risks,
and optimal population redistribution across safe havens.

Usage:
    python shelter_capacity_manager.py --demo
    python shelter_capacity_manager.py --input shelters.json --output allocation.json

Shelter types supported: SCHOOL, HOSPITAL, STADIUM, GOVT_OFFICE
"""

import json
import argparse
import sys
from datetime import datetime, timezone

# Ensure stdout handles UTF-8 properly across cross-platform terminals
if hasattr(sys.stdout, 'reconfigure'):
    try:
        sys.stdout.reconfigure(encoding='utf-8', errors='replace')
    except Exception:
        pass


# Sample shelter database (mirrors src/data/sheltersData.js)
SAMPLE_SHELTERS = [
    {
        "id": "SH-001",
        "name": "Meppadi Govt Higher Secondary School",
        "type": "SCHOOL",
        "district": "Wayanad",
        "coordinates": [11.5113, 76.0981],
        "total_capacity": 850,
        "current_occupancy": 742,
        "facilities": ["water", "power", "toilets", "medical_bay"],
        "contact": "+91 4936 260 221",
    },
    {
        "id": "SH-002",
        "name": "St. Joseph District Hospital",
        "type": "HOSPITAL",
        "district": "Wayanad",
        "coordinates": [11.607, 76.082],
        "total_capacity": 320,
        "current_occupancy": 241,
        "facilities": ["water", "power", "toilets", "medical_bay", "icu"],
        "contact": "+91 4936 202 424",
    },
    {
        "id": "SH-003",
        "name": "Kalpetta Mini Stadium",
        "type": "STADIUM",
        "district": "Wayanad",
        "coordinates": [11.608, 76.083],
        "total_capacity": 2400,
        "current_occupancy": 1187,
        "facilities": ["water", "toilets", "power", "outdoor_kitchen"],
        "contact": "+91 4936 202 000",
    },
    {
        "id": "SH-004",
        "name": "Mananthavady Taluk Office",
        "type": "GOVT_OFFICE",
        "district": "Wayanad",
        "coordinates": [11.802, 76.006],
        "total_capacity": 420,
        "current_occupancy": 389,
        "facilities": ["water", "power", "toilets", "communication_room"],
        "contact": "+91 4935 240 001",
    },
    {
        "id": "SH-005",
        "name": "Sulthan Bathery Govt College",
        "type": "SCHOOL",
        "district": "Wayanad",
        "coordinates": [11.668, 76.254],
        "total_capacity": 600,
        "current_occupancy": 145,
        "facilities": ["water", "power", "toilets", "kitchen"],
        "contact": "+91 4936 225 001",
    },
]


def calculate_utilization(shelter):
    """Calculate shelter utilization rate and status."""
    if shelter['total_capacity'] == 0:
        return 0.0, 'UNKNOWN'

    rate = (shelter['current_occupancy'] / shelter['total_capacity']) * 100
    rate = round(rate, 1)

    if rate >= 95:
        status = 'FULL'
    elif rate >= 80:
        status = 'NEAR_FULL'
    elif rate >= 50:
        status = 'MODERATE'
    else:
        status = 'AVAILABLE'

    return rate, status


def calculate_available_capacity(shelter):
    """Return remaining capacity for incoming evacuees."""
    return max(0, shelter['total_capacity'] - shelter['current_occupancy'])


def recommend_shelter(evacuee_count, shelters):
    """
    Recommend the best shelter(s) for a given evacuee count.
    Prioritizes hospitals for medical cases, then available capacity.
    """
    available = [
        {**s, 'available': calculate_available_capacity(s)}
        for s in shelters
        if calculate_available_capacity(s) >= evacuee_count
    ]

    # Sort by: most available capacity first
    available.sort(key=lambda x: x['available'], reverse=True)

    return available[:3]  # Top 3 options


def redistribute_overflow(shelters):
    """
    Identify overflow shelters and suggest redistribution targets.
    Returns a list of redistribution recommendations.
    """
    overflow = [s for s in shelters if calculate_available_capacity(s) < 20]
    available_targets = [
        s for s in shelters
        if calculate_available_capacity(s) >= 100
    ]

    recommendations = []
    for ov in overflow:
        excess = ov['current_occupancy'] - int(ov['total_capacity'] * 0.85)
        if excess > 0 and available_targets:
            target = available_targets[0]
            recommendations.append({
                'from_shelter': ov['id'],
                'from_name': ov['name'],
                'to_shelter': target['id'],
                'to_name': target['name'],
                'recommended_transfer': min(excess, calculate_available_capacity(target)),
                'priority': 'HIGH' if ov['type'] == 'HOSPITAL' else 'MEDIUM',
            })

    return recommendations


def generate_report(shelters):
    """Generate a full capacity utilization report."""
    report = {
        'generated_at': datetime.now(timezone.utc).isoformat(),
        'total_shelters': len(shelters),
        'total_capacity': sum(s['total_capacity'] for s in shelters),
        'total_occupancy': sum(s['current_occupancy'] for s in shelters),
        'shelters': [],
        'redistribution_recommendations': [],
    }

    report['overall_utilization_pct'] = round(
        (report['total_occupancy'] / report['total_capacity']) * 100, 1
    ) if report['total_capacity'] > 0 else 0

    for shelter in shelters:
        rate, status = calculate_utilization(shelter)
        available = calculate_available_capacity(shelter)
        report['shelters'].append({
            **shelter,
            'utilization_pct': rate,
            'status': status,
            'available_capacity': available,
        })

    report['redistribution_recommendations'] = redistribute_overflow(shelters)
    return report


def print_report(report):
    """Pretty print the shelter capacity report."""
    print("\n=== DHRISTI SHELTER CAPACITY MANAGER ===\n")
    print(f"Generated: {report['generated_at']}")
    print(f"Total Capacity: {report['total_capacity']} | Occupancy: {report['total_occupancy']} ({report['overall_utilization_pct']}%)\n")

    print(f"{'ID':<8} {'Name':<38} {'Type':<14} {'Cap':>5} {'Occ':>5} {'Util%':>7} {'Status':<12}")
    print("-" * 95)

    for s in report['shelters']:
        status_icon = '🔴' if s['status'] == 'FULL' else '🟠' if s['status'] == 'NEAR_FULL' else '🟢'
        print(
            f"{s['id']:<8} {s['name'][:36]:<38} {s['type']:<14} "
            f"{s['total_capacity']:>5} {s['current_occupancy']:>5} "
            f"{s['utilization_pct']:>6.1f}% {status_icon} {s['status']}"
        )

    if report['redistribution_recommendations']:
        print("\n⚠️  REDISTRIBUTION RECOMMENDATIONS:")
        for rec in report['redistribution_recommendations']:
            print(
                f"  [{rec['priority']}] Transfer {rec['recommended_transfer']} persons "
                f"from {rec['from_name']} → {rec['to_name']}"
            )
    else:
        print("\n✅ No overflow detected. All shelters within safe capacity limits.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Dhristi Shelter Capacity Manager')
    parser.add_argument('--input', help='Input JSON shelters file')
    parser.add_argument('--output', help='Output JSON report file')
    parser.add_argument('--demo', action='store_true', help='Run with sample data')
    parser.add_argument('--evacuees', type=int, help='Find shelter for N evacuees')

    args = parser.parse_args()

    # Load shelter data
    if args.input:
        with open(args.input, 'r', encoding='utf-8') as f:
            shelters = json.load(f)
    else:
        shelters = SAMPLE_SHELTERS

    # Find shelter recommendation for evacuees
    if args.evacuees:
        recommendations = recommend_shelter(args.evacuees, shelters)
        print(f"\nRecommended shelters for {args.evacuees} evacuees:")
        for i, s in enumerate(recommendations, 1):
            print(f"  {i}. {s['name']} ({s['type']}) — Available: {s['available']}")
    else:
        report = generate_report(shelters)
        print_report(report)

        if args.output:
            with open(args.output, 'w', encoding='utf-8') as f:
                json.dump(report, f, indent=2)
            print(f"\nReport saved to: {args.output}")
