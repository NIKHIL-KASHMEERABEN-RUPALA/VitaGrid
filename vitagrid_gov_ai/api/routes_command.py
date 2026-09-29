"""
VitaGrid GOV - Command Center Router
Provides sovereign national health telemetry, DEFCON level, and KPI summaries.
"""

from typing import Any, Dict
from vitagrid_gov_ai.core.config import settings
from vitagrid_gov_ai.data.generators import data_generator, COUNTY_PROFILES


def get_command_center_telemetry() -> Dict[str, Any]:
    """Generates live overview of the national health grid."""
    facilities = data_generator.generate_facilities()
    
    total_beds = sum(f.total_beds for f in facilities if f.total_beds > 0)
    occupied_beds = sum(f.occupied_beds for f in facilities if f.total_beds > 0)
    icu_total = sum(f.icu_total for f in facilities if f.icu_total > 0)
    icu_occupied = sum(f.icu_occupied for f in facilities if f.icu_total > 0)
    clinicians_live = sum(f.clinicians_on_shift for f in facilities)

    return {
        "status": "OPERATIONAL",
        "defcon_level": settings.defcon_level,
        "enclave_id": settings.security.enclave_id,
        "kpi_metrics": {
            "availability_index_pct": 94.6,
            "icu_utilization_pct": round((icu_occupied / max(1, icu_total)) * 100.0, 1),
            "general_bed_utilization_pct": round((occupied_beds / max(1, total_beds)) * 100.0, 1),
            "clinicians_active_on_shift": clinicians_live,
            "total_reporting_nodes": len(facilities),
            "monitored_sovereign_counties": len(COUNTY_PROFILES),
        },
        "critical_watch_counties": [
            {"code": "KE-16", "name": "Machakos", "reason": "Pediatric Respiratory Surge & Amoxicillin Stockout Risk"},
            {"code": "KE-07", "name": "Garissa", "reason": "Cold-Chain Thermal Excursion Detected (9.8°C)"},
        ],
    }
