"""
VitaGrid GOV - Swarm Status & Invocation Router
Coordinates continuous swarm telemetry runs and reports multi-agent consensus states.
"""

from typing import Any, Dict
from vitagrid_gov_ai.agents.orchestrator import swarm_orchestrator
from vitagrid_gov_ai.data.generators import data_generator


async def trigger_swarm_run() -> Dict[str, Any]:
    facilities = data_generator.generate_facilities()
    stocks = data_generator.generate_inventory(facilities)
    cold_readings = data_generator.generate_cold_chain_readings(facilities)
    history = data_generator.generate_syndromic_history(days=21)

    county_series: Dict[str, list] = {}
    for pt in history:
        county_series.setdefault(pt.county_code, []).append(pt.confirmed_cases)

    coords = {f.facility_id: (f.latitude, f.longitude) for f in facilities}

    payload = {
        "facilities": facilities,
        "stocks": stocks,
        "cold_chain_readings": cold_readings,
        "county_case_series": county_series,
        "facility_coords": coords,
        "disease": "Acute Respiratory Infection",
    }

    state = await swarm_orchestrator.run_swarm_pipeline(payload)

    return {
        "run_id": state.run_id,
        "final_state": state.current_state.value,
        "started_at": state.started_at_utc,
        "consensus_hash": state.audit_hash,
        "proposals_generated": state.consensus_result.get("proposals_queued_for_hitl", 0) if state.consensus_result else 0,
        "execution_trace": state.execution_trace,
    }
