"""
VitaGrid GOV - Sovereign Multi-Agent Swarm Orchestrator
LangGraph-style stateful async execution graph with explicit state machine transitions,
shared memory, parallel agent dispatch, and sovereign HITL escalation.
"""

import asyncio
from dataclasses import dataclass, field
from enum import Enum
import time
from typing import Any, Dict, List, Optional
from vitagrid_gov_ai.agents.surveillance_agent import SurveillanceAgent
from vitagrid_gov_ai.agents.supply_chain_agent import SupplyChainOptimizerAgent
from vitagrid_gov_ai.agents.cold_chain_agent import ColdChainAgent
from vitagrid_gov_ai.agents.resource_intel_agent import ResourceIntelligenceAgent
from vitagrid_gov_ai.agents.consensus_verifier_agent import ConsensusVerifierAgent
from vitagrid_gov_ai.core.telemetry import logger
from vitagrid_gov_ai.core.security import CryptographicAuditor, ZeroPIISanitizer


class SwarmExecutionState(str, Enum):
    INITIALIZED = "INITIALIZED"
    INGESTING_TELEMETRY = "INGESTING_TELEMETRY"
    PARALLEL_ANALYSIS = "PARALLEL_ANALYSIS"
    CONSENSUS_VERIFICATION = "CONSENSUS_VERIFICATION"
    HITL_ESCALATION = "HITL_ESCALATION"
    COMPLETED = "COMPLETED"
    FAILED = "FAILED"


@dataclass
class SwarmSharedState:
    run_id: str
    started_at_utc: float = field(default_factory=time.time)
    current_state: SwarmExecutionState = SwarmExecutionState.INITIALIZED
    telemetry_input: Dict[str, Any] = field(default_factory=dict)
    agent_outputs: Dict[str, Any] = field(default_factory=dict)
    execution_trace: List[Dict[str, Any]] = field(default_factory=list)
    consensus_result: Optional[Dict[str, Any]] = None
    audit_hash: Optional[str] = None


class SovereignSwarmOrchestrator:
    """
    Coordinates the 5 autonomous agents in a stateful directed acyclic graph:
    [Ingest] --> [Surveillance + Cold Chain] --> [Supply Chain + Resource Intel] --> [Consensus Verifier] --> [HITL]
    """

    def __init__(self):
        self.surveillance = SurveillanceAgent()
        self.supply_chain = SupplyChainOptimizerAgent()
        self.cold_chain = ColdChainAgent()
        self.resource_intel = ResourceIntelligenceAgent()
        self.consensus = ConsensusVerifierAgent()

    def _transition(self, state: SwarmSharedState, new_state: SwarmExecutionState, message: str):
        old_state = state.current_state
        state.current_state = new_state
        trace_record = {
            "timestamp": time.time(),
            "from_state": old_state.value,
            "to_state": new_state.value,
            "message": message,
        }
        state.execution_trace.append(trace_record)
        logger.info(
            f"Swarm [{state.run_id}] Transition: {old_state.value} -> {new_state.value} | {message}",
            extra={"trace_id": state.run_id, "audit_event": "SWARM_TRANSITION"},
        )

    async def run_swarm_pipeline(self, telemetry_payload: Dict[str, Any]) -> SwarmSharedState:
        run_id = f"SWARM-RUN-{int(time.time())}-{hash(str(telemetry_payload)) % 10000:04d}"
        state = SwarmSharedState(
            run_id=run_id,
            telemetry_input=ZeroPIISanitizer.sanitize_dict(telemetry_payload),
        )

        try:
            # Step 1: Ingest & Validate
            self._transition(state, SwarmExecutionState.INGESTING_TELEMETRY, "Sanitizing sovereign feeds across all nodes")
            await asyncio.sleep(0.01)

            # Step 2: Parallel Wave 1 - Outbreak & Cold-Chain Early Warning
            self._transition(state, SwarmExecutionState.PARALLEL_ANALYSIS, "Dispatched Surveillance & Cold-Chain agents")
            
            surv_task = self.surveillance.process_task({
                "county_case_series": telemetry_payload.get("county_case_series", {}),
                "disease": telemetry_payload.get("disease", "Acute Respiratory Infection"),
            })
            cold_task = self.cold_chain.process_task({
                "cold_chain_readings": telemetry_payload.get("cold_chain_readings", []),
            })

            surv_res, cold_res = await asyncio.gather(surv_task, cold_task)
            state.agent_outputs["surveillance"] = surv_res
            state.agent_outputs["cold_chain"] = cold_res

            # Step 3: Dependent Wave 2 - Supply Chain & Critical Resource Optimization
            # Supply Chain correlates with detected outbreaks
            outbreak_rt_map = {
                item["county_code"]: item["r_t"]
                for item in surv_res.get("flagged_counties", [])
            }

            sc_task = self.supply_chain.process_task({
                "stocks": telemetry_payload.get("stocks", []),
                "outbreak_r_t_by_county": outbreak_rt_map,
                "facility_coords": telemetry_payload.get("facility_coords", {}),
            })
            res_task = self.resource_intel.process_task({
                "facilities": telemetry_payload.get("facilities", []),
            })

            sc_res, res_res = await asyncio.gather(sc_task, res_task)
            state.agent_outputs["supply_chain"] = sc_res
            state.agent_outputs["resource_intel"] = res_res

            # Step 4: Consensus & Policy Verification
            self._transition(state, SwarmExecutionState.CONSENSUS_VERIFICATION, "Synthesizing cross-agent recommendations")
            consensus_res = await self.consensus.process_task({
                "agent_reports": state.agent_outputs,
            })
            state.consensus_result = consensus_res

            # Step 5: HITL Escalation Check
            queued_proposals = consensus_res.get("proposals_queued_for_hitl", 0)
            if queued_proposals > 0:
                self._transition(
                    state,
                    SwarmExecutionState.HITL_ESCALATION,
                    f"{queued_proposals} critical actions queued for ministerial cryptographic authorization",
                )
            else:
                self._transition(state, SwarmExecutionState.COMPLETED, "Autonomous telemetry audit normal - no escalation required")

            # Finalize immutable run hash
            state.audit_hash = CryptographicAuditor.compute_sha256({
                "run_id": state.run_id,
                "consensus": state.consensus_result,
                "outputs": state.agent_outputs,
            })

        except Exception as e:
            logger.error(f"Swarm failure during pipeline: {str(e)}", exc_info=True)
            self._transition(state, SwarmExecutionState.FAILED, f"Pipeline exception: {str(e)}")

        return state


swarm_orchestrator = SovereignSwarmOrchestrator()
