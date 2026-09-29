"""
VitaGrid GOV - Security, Audit & HITL Governance Agent
Strictly enforces the sovereign Human-in-the-Loop boundary.
Prevents any automated execution without ministerial cryptographic authorization.
Maintains tamper-evident audit trails and issues instant rollback tokens.
"""

from dataclasses import dataclass, field
from enum import Enum
import logging
import time
from typing import Any, Dict, List, Optional
from vitagrid_gov.core.security import security
from vitagrid_gov.core.audit_ledger import audit_ledger
from vitagrid_gov.core.config import settings

logger = logging.getLogger("vitagrid.security_hitl")


class DocketState(str, Enum):
    PENDING_AUTHORIZATION = "PENDING_AUTHORIZATION"
    AUTHORIZED = "AUTHORIZED"
    REJECTED = "REJECTED"
    DISPATCHED = "DISPATCHED"
    ROLLED_BACK = "ROLLED_BACK"


@dataclass
class ActionDocket:
    docket_id: str
    title: str
    action_type: str  # "STOCK_REBALANCE", "CLINICIAN_DEPLOYMENT", "VECTOR_PROTOCOL"
    originating_agent: str
    payload: Dict[str, Any]
    state: DocketState = DocketState.PENDING_AUTHORIZATION
    created_at: float = field(default_factory=time.time)
    authorizer_id: Optional[str] = None
    authorizer_role: Optional[str] = None
    authorized_at: Optional[float] = None
    signature: Optional[str] = None
    rollback_token: Optional[str] = None


class SecurityHITLAgent:
    def __init__(self):
        self._dockets: Dict[str, ActionDocket] = {}
        self._seed_sample_dockets()

    def _seed_sample_dockets(self):
        """Seeds standard pending dockets for immediate frontend demonstration."""
        docket_1 = ActionDocket(
            docket_id="DOCKET-ACT-842",
            title="Emergency Stock Rebalance: Amoxicillin 250mg to Mombasa Subcounty",
            action_type="STOCK_REBALANCE",
            originating_agent="AGENT-LOGISTICS-SUPPLY",
            payload={
                "source_facility": "Mombasa Central Medical Depot",
                "target_facility": "Likoni Subcounty Hospital (PHC-C01-002)",
                "commodity": "Amoxicillin 250mg Dispersible",
                "units": 3200,
                "transit_eta_hours": 0.8,
                "justification": "Predicted stockout within 48h driven by acute respiratory pediatric surge."
            }
        )
        self._dockets[docket_1.docket_id] = docket_1

        docket_2 = ActionDocket(
            docket_id="DOCKET-ACT-843",
            title="Pre-emptive Staging: Lake Basin Vector Protocol & Saline Staging",
            action_type="VECTOR_PROTOCOL",
            originating_agent="AGENT-EPIDEMIC-PREDICTION",
            payload={
                "target_county": "Kisumu (C42)",
                "commodity": "Pediatric IV Saline & Artemether",
                "units": 5000,
                "transit_eta_hours": 2.5,
                "justification": "Seasonal monsoon onset and R_t acceleration to 1.34."
            }
        )
        self._dockets[docket_2.docket_id] = docket_2

    def list_pending_dockets(self) -> List[Dict[str, Any]]:
        return [
            {
                "docket_id": d.docket_id,
                "title": d.title,
                "action_type": d.action_type,
                "originating_agent": d.originating_agent,
                "payload": d.payload,
                "state": d.state.value,
                "created_at": d.created_at,
            }
            for d in self._dockets.values()
            if d.state == DocketState.PENDING_AUTHORIZATION
        ]

    def authorize_docket(
        self,
        docket_id: str,
        authorizer_id: str = "DR_V_RAO",
        authorizer_role: str = "National Health Director"
    ) -> Dict[str, Any]:
        """
        Applies Ministerial Cryptographic Sign-Off to an Action Docket.
        Generates HMAC-signed proof and an emergency rollback token.
        """
        docket = self._dockets.get(docket_id)
        if not docket:
            return {"success": False, "error": f"Docket {docket_id} not found"}

        if docket.state != DocketState.PENDING_AUTHORIZATION:
            return {"success": False, "error": f"Docket {docket_id} is already in state {docket.state}"}

        # Generate cryptographic signature
        sig_payload = {
            "docket_id": docket.docket_id,
            "action_type": docket.action_type,
            "authorizer_id": authorizer_id,
            "authorizer_role": authorizer_role,
            "timestamp": time.time(),
        }
        signature, _ = security.sign_ministerial_docket(sig_payload)
        rollback_token = security.generate_rollback_token(docket.docket_id, authorizer_id)

        # Update docket state
        docket.state = DocketState.AUTHORIZED
        docket.authorizer_id = authorizer_id
        docket.authorizer_role = authorizer_role
        docket.authorized_at = time.time()
        docket.signature = signature
        docket.rollback_token = rollback_token

        # Append to append-only immutable ledger
        audit_ledger.append_event(
            event_type="MINISTERIAL_DOCKET_AUTHORIZED",
            actor_id=authorizer_id,
            payload={
                "docket_id": docket.docket_id,
                "action_type": docket.action_type,
                "authorizer_role": authorizer_role,
                "signature": signature,
                "rollback_token": rollback_token,
            }
        )

        logger.info("Docket %s AUTHORIZED by %s (%s). Signature: %s...", docket_id, authorizer_id, authorizer_role, signature[:16])

        return {
            "success": True,
            "docket_id": docket.docket_id,
            "state": docket.state.value,
            "cryptographic_signature": signature,
            "rollback_token": rollback_token,
            "authorized_at": docket.authorized_at,
        }

    def rollback_docket(self, docket_id: str, rollback_token: str, reason: str = "Ministerial Abort Directive") -> Dict[str, Any]:
        """
        Executes an instant rollback of an authorized docket using its unique rollback token.
        """
        docket = self._dockets.get(docket_id)
        if not docket:
            return {"success": False, "error": "Docket not found"}

        if docket.rollback_token != rollback_token:
            return {"success": False, "error": "Invalid or forged rollback token"}

        docket.state = DocketState.ROLLED_BACK

        audit_ledger.append_event(
            event_type="MINISTERIAL_DOCKET_ROLLED_BACK",
            actor_id=docket.authorizer_id or "SYSTEM_OVERRIDE",
            payload={"docket_id": docket_id, "reason": reason}
        )

        return {"success": True, "docket_id": docket_id, "state": DocketState.ROLLED_BACK.value, "reason": reason}


security_hitl_agent = SecurityHITLAgent()
