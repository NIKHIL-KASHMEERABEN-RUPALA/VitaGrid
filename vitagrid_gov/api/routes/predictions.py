"""
VitaGrid GOV - AI/ML Predictions & XAI Router
Provides inference endpoints for Epidemic Trajectories, Stockout Forecasting,
TreeSHAP Attributions, and Counterfactual What-If Simulations.
"""

from fastapi import APIRouter, HTTPException
from typing import Any, Dict
from vitagrid_gov.agents.epidemic_prediction import epidemic_agent
from vitagrid_gov.agents.xai import xai_agent
from vitagrid_gov.agents.what_if import what_if_agent
from vitagrid_gov.agents.protocol_rag import protocol_rag_agent
from vitagrid_gov.core.feature_store import feature_store
from vitagrid_gov.models.stockout_model import stockout_model
from vitagrid_gov.api.schemas import WhatIfSimulationRequest, ClinicalQueryRequest

router = APIRouter(prefix="/predictions", tags=["Predictions & AI"])


@router.get("/epidemic/{county_code}")
async def get_county_epidemic_trajectory(county_code: str):
    """Computes Bayesian Rt, doubling time, and 14/30/60/90-day trajectories."""
    return await epidemic_agent.analyze_county_epidemic_status(county_code)


@router.get("/stockout/{facility_id}")
async def predict_facility_stockout(facility_id: str, commodity: str = "Amoxicillin 250mg Dispersible"):
    """Predicts 30-day stockout probability and runout runway."""
    vector = feature_store.get_vector(facility_id)
    if not vector:
        raise HTTPException(status_code=404, detail=f"Facility {facility_id} not found in feature store")
    
    pred = stockout_model.predict(vector=vector, commodity_name=commodity)
    return pred.__dict__


@router.get("/explain/{facility_id}")
async def explain_facility_risk(facility_id: str, commodity: str = "Amoxicillin 250mg Dispersible"):
    """Generates TreeSHAP feature attributions and a ministerial plain-language narrative."""
    result = await xai_agent.explain_facility_risk(facility_id, commodity_name=commodity)
    if "error" in result:
        raise HTTPException(status_code=404, detail=result["error"])
    return result


@router.post("/what-if")
async def run_what_if_simulation(req: WhatIfSimulationRequest):
    """Executes a counterfactual simulation on an isolated state sandbox."""
    res = await what_if_agent.simulate_intervention(
        target_facility_id=req.target_facility_id,
        intervention_type=req.intervention_type,
        parameters=req.parameters
    )
    if "error" in res:
        raise HTTPException(status_code=404, detail=res["error"])
    return res


@router.post("/clinical-query")
async def query_clinical_protocols(req: ClinicalQueryRequest):
    """Queries sovereign medical protocols with grounded citations and strict refusal."""
    return await protocol_rag_agent.answer_clinical_query(req.query)
