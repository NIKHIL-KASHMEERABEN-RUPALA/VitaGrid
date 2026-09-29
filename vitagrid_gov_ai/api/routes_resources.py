"""
VitaGrid GOV - Resource Intelligence Router
ICU and ventilator utilization metrics and clinician surge reallocations.
"""

from typing import Any, Dict
from vitagrid_gov_ai.data.generators import data_generator
from vitagrid_gov_ai.models.optimizer import optimization_engine


def get_resource_overview() -> Dict[str, Any]:
    facilities = data_generator.generate_facilities()
    
    county_beds: Dict[str, Dict[str, Any]] = {}
    for f in facilities:
        if f.icu_total > 0:
            c = county_beds.setdefault(f.county_code, {
                "county_name": f.county_name,
                "icu_total": 0,
                "icu_occupied": 0,
                "vents_total": 0,
                "vents_in_use": 0,
                "clinicians": 0,
            })
            c["icu_total"] += f.icu_total
            c["icu_occupied"] += f.icu_occupied
            c["vents_total"] += f.ventilators_total
            c["vents_in_use"] += f.ventilators_in_use
            c["clinicians"] += f.clinicians_on_shift

    stressed = []
    donors = []
    for code, d in county_beds.items():
        util = (d["icu_occupied"] / d["icu_total"] * 100.0) if d["icu_total"] > 0 else 0.0
        d["util_pct"] = round(util, 1)
        if util >= 85.0:
            stressed.append((code, d["clinicians"], 15))
        elif util < 65.0 and d["clinicians"] > 25:
            donors.append((code, d["clinicians"], 8))

    surge_moves = optimization_engine.optimize_clinician_surge(stressed, donors)

    return {
        "counties_monitored": len(county_beds),
        "high_utilization_counties": [d for d in county_beds.values() if d.get("util_pct", 0) >= 80.0],
        "active_surge_moves": [
            {
                "source": m.source_county,
                "target": m.target_county,
                "clinicians": m.clinicians_transferred,
            }
            for m in surge_moves
        ],
    }
