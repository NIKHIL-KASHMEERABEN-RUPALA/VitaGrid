"""
VitaGrid GOV - Explainability (XAI) Agent
Translates complex high-dimensional model logits and TreeSHAP attribution matrices
into plain-language root-cause reports with statutory legal citations for ministerial review.
"""

import asyncio
import logging
from typing import Any, Dict, List
from vitagrid_gov.core.feature_store import feature_store
from vitagrid_gov.models.stockout_model import stockout_model
from vitagrid_gov.models.lora_adapter import lora_manager

logger = logging.getLogger("vitagrid.xai")


class ExplainabilityAgent:
    async def explain_facility_risk(self, facility_id: str, commodity_name: str = "Amoxicillin 250mg Dispersible") -> Dict[str, Any]:
        """
        Runs TreeSHAP attribution on the facility's 28+ indicators and generates
        both numerical Shapley values and a legally defensible ministerial narrative.
        """
        vector = feature_store.get_vector(facility_id)
        if not vector:
            return {"error": f"Facility {facility_id} not found in feature store"}

        pred = stockout_model.predict(vector=vector, commodity_name=commodity_name)

        # Generate plain-language explanation via LoRA adapter logic
        narrative = lora_manager.generate_plain_language_explanation(
            prediction_type="30-Day Medicine Stockout",
            entity_name=f"{facility_id} ({commodity_name})",
            shap_factors=pred.top_shap_drivers,
            statutory_citation="National Health Logistics Mandate 2024, Section 8(B)"
        )

        report = {
            "facility_id": facility_id,
            "commodity_name": commodity_name,
            "stockout_probability_30d": pred.stockout_probability_30d,
            "risk_band": pred.risk_level,
            "projected_runout_days": pred.projected_runout_days,
            "tree_shap_attributions": pred.top_shap_drivers,
            "plain_language_narrative": narrative,
            "why_at_risk_card": {
                "headline": f"{pred.risk_level} Stockout Threat Detected",
                "primary_driver": pred.top_shap_drivers[0]["factor"] if pred.top_shap_drivers else "Unknown",
                "driver_weight_pct": pred.top_shap_drivers[0]["contribution_pct"] if pred.top_shap_drivers else 0.0,
                "action_recommendation": f"Stage buffer reorder of {pred.recommended_reorder_units:,} units.",
            }
        }

        return report


xai_agent = ExplainabilityAgent()
