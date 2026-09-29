"""
VitaGrid GOV - Clinician Fatigue & Rostering Optimization Model
Monitors healthcare workforce strain, predicts shift burnout probability,
and suggests cross-district clinician redeployment to prevent triage collapse.
"""

from dataclasses import dataclass
from typing import Dict, List, Tuple


@dataclass
class ClinicianFatigueAssessment:
    facility_id: str
    county_code: str
    active_clinicians_on_shift: int
    optimal_staffing_required: int
    staffing_deficit: int
    fatigue_index: float  # 0.0 to 1.0
    burnout_risk_level: str  # "NOMINAL", "ELEVATED", "CRITICAL"
    recommended_surge_transfer_needed: int
    mitigation_strategy: str


class ClinicianFatigueModel:
    def evaluate_fatigue(
        self,
        facility_id: str,
        county_code: str,
        active_clinicians: int,
        occupied_beds: int,
        daily_inflow_triage: int,
        avg_consecutive_hours: float = 11.5
    ) -> ClinicianFatigueAssessment:
        """
        Assesses clinical fatigue ratio and recommends mutual-aid redeployments.
        Standard safe ratio: 1 clinician per 4 acute beds + 1 per 8 emergency triage patients.
        """
        required_staff = max(2, int((occupied_beds / 4.0) + (daily_inflow_triage / 8.0)))
        deficit = max(0, required_staff - active_clinicians)

        # Baseline workload strain
        workload_ratio = (occupied_beds + (daily_inflow_triage * 0.5)) / max(1.0, active_clinicians * 6.0)
        # Shift duration penalty
        hours_penalty = max(0.0, (avg_consecutive_hours - 8.0) * 0.08)

        raw_index = min(1.0, (workload_ratio * 0.6) + hours_penalty)
        fatigue_index = round(raw_index, 2)

        if fatigue_index >= 0.75:
            risk = "CRITICAL"
            strat = "Immediate inter-county mutual aid clinician deployment required within 24h."
        elif fatigue_index >= 0.50:
            risk = "ELEVATED"
            strat = "Rotate standby reserve medical officers and stagger 8-hour triage shifts."
        else:
            risk = "NOMINAL"
            strat = "Workforce capacity stable within safe clinical fatigue parameters."

        return ClinicianFatigueAssessment(
            facility_id=facility_id,
            county_code=county_code,
            active_clinicians_on_shift=active_clinicians,
            optimal_staffing_required=required_staff,
            staffing_deficit=deficit,
            fatigue_index=fatigue_index,
            burnout_risk_level=risk,
            recommended_surge_transfer_needed=deficit,
            mitigation_strategy=strat
        )


fatigue_model = ClinicianFatigueModel()
