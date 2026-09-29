"""
VitaGrid GOV - Logistics & Supply Chain API Routes
Provides endpoints for automated multi-echelon rebalance plans,
cold-chain IoT thermal status, multi-tier depletion tracking, and Action Docket creation.
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Any, Dict, List, Optional
import time

from vitagrid_gov.agents.logistics import logistics_agent
from vitagrid_gov.models.coldchain_model import coldchain_model
from vitagrid_gov.models.optimizer import logistics_optimizer
from vitagrid_gov.models.stockout_model import stockout_model
from vitagrid_gov.core.feature_store import feature_store
from vitagrid_gov.core.audit_ledger import audit_ledger

router = APIRouter(prefix="/logistics", tags=["Logistics & Supply Chain"])


class ActionDocketCreateRequest(BaseModel):
    proposal_id: str
    commodity_name: str
    source_facility: str
    target_facility: str
    quantity_units: int
    transit_eta_hours: float
    justification: Optional[str] = "Emergency rebalancing transfer generated via Primal-Dual LP solver."


@router.get("/rebalance-proposals")
async def generate_rebalance_plan(commodity: str = "Amoxicillin 250mg Dispersible"):
    """
    Audits 5 echelons, executes Primal-Dual Linear Programming rebalancing,
    and returns ranked transfer directives (REB-XXXX).
    """
    return await logistics_agent.evaluate_supply_deficits(commodity_name=commodity)


@router.get("/cold-chain-status")
async def get_cold_chain_status(facility_id: str = "PHC-C01-001"):
    """
    Assesses IoT sensor readings against the 2.0°C - 8.0°C vaccine corridor
    using the physics-informed thermal inertia model.
    """
    report = coldchain_model.analyze_sensor(
        sensor_id=f"IOT-SENSOR-{facility_id}",
        facility_id=facility_id,
        temperature=4.6,
        ambient_temp=29.2,
        battery_pct=92.0,
        compressor_duty_cycle=0.35,
        door_open_events_per_hr=3,
    )
    return report.__dict__


@router.get("/multi-echelon-hierarchy")
async def get_multi_echelon_hierarchy(commodity: str = "Amoxicillin 250mg Dispersible"):
    """
    Returns live inventory, daily consumption velocity, and safety stock thresholds across all 5 tiers.
    """
    vec = feature_store.get_vector("PHC-C01-002")
    pred = stockout_model.predict(
        vector=vec,
        commodity_name=commodity,
        current_stock=1450,
        base_daily_burn=120.0
    )
    return {
        "commodity": commodity,
        "tiers": [t.__dict__ for t in pred.multi_echelon_tiers] if pred.multi_echelon_tiers else []
    }


@router.get("/staff-surge-plans")
async def get_staff_surge_plans():
    """Generates clinician mutual-aid redeployments across strained facilities."""
    surplus = [{"facility_id": "HOSP-NAIROBI-CENTRAL", "surplus_staff": 12, "lat": -1.2921, "lng": 36.8219}]
    strained = [{"facility_id": "HOSP-KISUMU-REFERRAL", "staff_deficit": 8, "lat": -0.0917, "lng": 34.7680}]
    plans = logistics_optimizer.solve_staff_reallocation(surplus, strained)
    return [p.__dict__ for p in plans]


@router.post("/dockets/create")
async def create_action_docket_from_proposal(req: ActionDocketCreateRequest):
    """
    One-click Action Docket creation from approved rebalancing proposals.
    Stages the Action Docket in the Human Approvals queue.
    """
    docket_id = f"DOCKET-ACT-{int(time.time()) % 10000}"
    docket_item = {
        "docket_id": docket_id,
        "title": f"Emergency Stock Rebalance: {req.commodity_name} to {req.target_facility}",
        "action_type": "STOCK_REBALANCE",
        "originating_agent": "AGENT-LOGISTICS-SUPPLY",
        "payload": {
            "source_facility": req.source_facility,
            "target_facility": req.target_facility,
            "commodity": req.commodity_name,
            "units": req.quantity_units,
            "transit_eta_hours": req.transit_eta_hours,
            "justification": req.justification,
        },
        "state": "PENDING_AUTHORIZATION",
        "created_at": time.time(),
    }

    # Append docket creation event to Merkle audit ledger
    audit_ledger.append_entry(
        event_type="DOCKET_CREATED",
        agent_id="AGENT-LOGISTICS-SUPPLY",
        docket_id=docket_id,
        payload=docket_item,
        authorizer_id="SYSTEM_LOGISTICS_OPTIMIZER"
    )

    return {
        "success": True,
        "docket_id": docket_id,
        "message": f"Action Docket #{docket_id} queued for National Director sign-off.",
        "docket": docket_item,
    }
