"""
VitaGrid GOV - Outbreak Radar Router
Epidemiological early warning, Bayesian R_t estimations, and anomaly alerts.
"""

from typing import Any, Dict
from vitagrid_gov_ai.data.generators import data_generator
from vitagrid_gov_ai.models.epidemiology import epidemiology_engine


def get_outbreak_radar_overview() -> Dict[str, Any]:
    history = data_generator.generate_syndromic_history(days=21)
    
    # Group by county
    county_series: Dict[str, list] = {}
    for pt in history:
        county_series.setdefault(pt.county_code, []).append(pt.confirmed_cases)

    estimates = []
    for c_code, cases in county_series.items():
        rt_res = epidemiology_engine.estimate_r_t(cases, c_code)
        anomaly = epidemiology_engine.detect_syndromic_anomalies(cases, c_code, "Acute Respiratory Infection")
        
        estimates.append({
            "county_code": c_code,
            "r_t_median": rt_res.r_t_median,
            "r_t_ci": [rt_res.r_t_lower_ci, rt_res.r_t_upper_ci],
            "doubling_time_days": rt_res.doubling_time_days,
            "surge_phase": rt_res.surge_phase,
            "is_anomaly": anomaly.is_anomaly,
            "z_score": anomaly.z_score,
        })

    # Sort by R_t descending
    estimates.sort(key=lambda x: x["r_t_median"], reverse=True)

    return {
        "active_surveillance_counties": len(estimates),
        "accelerating_counties": [e for e in estimates if e["r_t_median"] >= 1.15],
        "all_county_estimates": estimates[:10],
    }
