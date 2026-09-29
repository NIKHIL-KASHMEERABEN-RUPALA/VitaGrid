"""
VitaGrid GOV - Counterfactual What-If Simulation Agent
Simulates policy interventions and resource transfers (e.g. moving 5,000 vials or 12 nurses)
to evaluate expected outcome trajectories and cost-benefit trade-offs before physical orders are signed.
"""

import copy
import logging
from typing import Any, Dict, List
from vitagrid_gov.core.feature_store import feature_store, FacilityFeatureVector
from vitagrid_gov.models.stockout_model import stockout_model
from vitagrid_gov.models.fatigue_model import fatigue_model

logger = logging.getLogger("vitagrid.what_if")


class CounterfactualWhatIfAgent:
    async def simulate_intervention(
        self,
        target_facility_id: str,
        intervention_type: str,  # "STOCK_INJECTION", "STAFF_AUGMENTATION", "BUFFER_REORDER"
        parameters: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Executes a counterfactual simulation on an isolated copy of the feature store.
        """
        original_vector = feature_store.get_vector(target_facility_id)
        if not original_vector:
            return {"error": f"Facility {target_facility_id} not found"}

        # Clone vector for counterfactual simulation
        simulated_vector = copy.deepcopy(original_vector)

        baseline_stockout = stockout_model.predict(original_vector)
        baseline_fatigue = fatigue_model.evaluate_fatigue(
            facility_id=original_vector.facility_id,
            county_code=original_vector.county_code,
            active_clinicians=original_vector.clinician_on_shift_count,
            occupied_beds=original_vector.occupied_acute_beds,
            daily_inflow_triage=original_vector.unattended_triage_count
        )

        outcome_summary = ""
        risk_delta = 0.0

        if intervention_type == "STOCK_INJECTION":
            added_units = int(parameters.get("units", 3200))
            commodity = parameters.get("commodity", "Amoxicillin 250mg Dispersible")
            # Increase runout days
            added_runout_days = added_units / 120.0
            simulated_vector.amox_stockout_runout_days += added_runout_days

            simulated_stockout = stockout_model.predict(simulated_vector, commodity_name=commodity)
            risk_delta = baseline_stockout.stockout_probability_30d - simulated_stockout.stockout_probability_30d
            outcome_summary = (
                f"Injecting {added_units:,} units extends runway by {added_runout_days:.1f} days, "
                f"reducing stockout probability from {baseline_stockout.stockout_probability_30d*100:.1f}% "
                f"to {simulated_stockout.stockout_probability_30d*100:.1f}% (Δ {risk_delta*100:+.1f}%)."
            )

        elif intervention_type == "STAFF_AUGMENTATION":
            added_staff = int(parameters.get("clinicians", 8))
            simulated_vector.clinician_on_shift_count += added_staff
            simulated_fatigue = fatigue_model.evaluate_fatigue(
                facility_id=simulated_vector.facility_id,
                county_code=simulated_vector.county_code,
                active_clinicians=simulated_vector.clinician_on_shift_count,
                occupied_beds=simulated_vector.occupied_acute_beds,
                daily_inflow_triage=simulated_vector.unattended_triage_count
            )
            fatigue_delta = baseline_fatigue.fatigue_index - simulated_fatigue.fatigue_index
            outcome_summary = (
                f"Deploying {added_staff} clinicians reduces staffing deficit to {simulated_fatigue.staffing_deficit}, "
                f"lowering fatigue index from {baseline_fatigue.fatigue_index:.2f} to {simulated_fatigue.fatigue_index:.2f}."
            )

        return {
            "facility_id": target_facility_id,
            "intervention_type": intervention_type,
            "simulation_status": "COUNTERFACTUAL_SUCCESS",
            "outcome_summary": outcome_summary,
            "projected_risk_reduction_pct": round(abs(risk_delta) * 100, 1),
            "recommendation_verdict": "STRONGLY_FAVORABLE" if risk_delta > 0.20 else "MODERATELY_FAVORABLE",
        }


what_if_agent = CounterfactualWhatIfAgent()
