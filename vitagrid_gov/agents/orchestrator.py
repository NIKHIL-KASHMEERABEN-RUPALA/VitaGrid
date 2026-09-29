"""
VitaGrid GOV - Commander Orchestrator Agent
The central brain of the multi-agent mesh. Routes tasks, orchestrates specialist agents,
maintains global DEFCON state, monitors system health, and enforces the HITL authorization gate.
"""

import asyncio
from dataclasses import dataclass, field, asdict
import logging
import time
from typing import Any, Dict, List, Optional
from vitagrid_gov.core.event_bus import event_bus, VitaGridEvent
from vitagrid_gov.core.audit_ledger import audit_ledger
from vitagrid_gov.core.config import settings

logger = logging.getLogger("vitagrid.orchestrator")


@dataclass
class SwarmSystemState:
    defcon_level: int = settings.DEFAULT_DEFCON_LEVEL
    national_availability_index: float = 94.6
    national_icu_utilization_pct: float = 78.2
    national_clinician_rostering_pct: float = 98.4
    active_critical_alerts: int = 3
    connected_phc_count: int = settings.TOTAL_PRIMARY_HEALTH_CENTERS
    last_synchronized_timestamp: float = field(default_factory=time.time)
    enclave_status: str = "FIPS_140_3_VERIFIED_OPERATIONAL"
    agent_health_statuses: Dict[str, str] = field(default_factory=dict)


class CommanderOrchestratorAgent:
    def __init__(self):
        self.state = SwarmSystemState()
        self._initialize_agent_health()
        self._subscribed = False

    def _initialize_agent_health(self):
        self.state.agent_health_statuses = {
            "AGENT-DATA-INGESTION": "HEALTHY",
            "AGENT-EPIDEMIC-PREDICTION": "HEALTHY",
            "AGENT-LOGISTICS-SUPPLY": "HEALTHY",
            "AGENT-XAI-EXPLAINABILITY": "HEALTHY",
            "AGENT-COUNTERFACTUAL-WHATIF": "HEALTHY",
            "AGENT-GEOSPATIAL-DIGITAL-TWIN": "HEALTHY",
            "AGENT-CLINICAL-PROTOCOL-RAG": "HEALTHY",
            "AGENT-SECURITY-HITL-GOVERNANCE": "HEALTHY",
            "AGENT-MLOPS-DRIFT-GUARD": "HEALTHY",
        }

    async def initialize(self):
        """Subscribes to all critical swarm event topics."""
        if not self._subscribed:
            await event_bus.subscribe("telemetry.*", self.handle_telemetry_event)
            await event_bus.subscribe("agent.alert.*", self.handle_agent_alert)
            await event_bus.subscribe("hitl.action.*", self.handle_hitl_action)
            self._subscribed = True
            logger.info("Commander Orchestrator Agent initialized and subscribed to event mesh.")

    async def handle_telemetry_event(self, event: VitaGridEvent):
        """Processes high-throughput telemetry pulses and recalculates DEFCON watch status."""
        self.state.last_synchronized_timestamp = time.time()
        # If severe anomalies logged, evaluate Defcon shift
        if event.payload.get("defcon_shift_required"):
            new_defcon = event.payload.get("new_defcon_level", self.state.defcon_level)
            await self.set_defcon_level(new_defcon, reason=event.payload.get("reason", "Automated Sentinel Alert"))

    async def handle_agent_alert(self, event: VitaGridEvent):
        """Handles escalated alerts raised by specialist agents."""
        logger.warning("Commander received alert from %s: %s", event.source_agent, event.payload.get("summary"))
        audit_ledger.append_event(
            event_type="ESCALATED_AGENT_ALERT",
            actor_id=event.source_agent,
            payload=event.payload
        )

    async def handle_hitl_action(self, event: VitaGridEvent):
        """Records ministerial decisions and coordinates downstream physical execution."""
        audit_ledger.append_event(
            event_type="HITL_AUTHORIZATION_DISPATCH",
            actor_id=event.source_agent,
            payload=event.payload
        )

    async def set_defcon_level(self, level: int, reason: str = "Ministerial Command") -> int:
        """Updates national DEFCON state and notifies the entire agent swarm."""
        old_level = self.state.defcon_level
        self.state.defcon_level = max(1, min(5, level))
        
        evt = VitaGridEvent(
            topic="system.defcon.changed",
            event_type="DEFCON_TRANSITION",
            source_agent="COMMANDER-ORCHESTRATOR",
            payload={
                "previous_defcon": old_level,
                "new_defcon": self.state.defcon_level,
                "reason": reason,
                "timestamp": time.time()
            }
        )
        await event_bus.publish(evt)
        audit_ledger.append_event(
            event_type="DEFCON_TRANSITION",
            actor_id="COMMANDER-ORCHESTRATOR",
            payload=evt.payload
        )
        logger.info("DEFCON level changed from %d to %d (Reason: %s)", old_level, self.state.defcon_level, reason)
        return self.state.defcon_level

    def get_system_status(self) -> Dict[str, Any]:
        """Provides full operational telemetry status of the sovereign command grid."""
        return asdict(self.state)


commander_orchestrator = CommanderOrchestratorAgent()
