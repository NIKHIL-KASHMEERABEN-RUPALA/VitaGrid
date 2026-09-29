"""
VitaGrid GOV - Human-in-the-Loop (HITL) Governance Gate
Strict separation of agentic algorithmic inference from executive legal execution.
"""

from dataclasses import dataclass, field, asdict
from enum import Enum
import time
from typing import Any, Dict, List, Optional
from vitagrid_gov_ai.core.security import CryptographicAuditor, ZeroPIISanitizer


class ProposalState(str, Enum):
    PENDING = "PENDING"
    AUTHORIZED = "AUTHORIZED"
    REJECTED = "REJECTED"
    EXPIRED = "EXPIRED"
    EXECUTED = "EXECUTED"
    ROLLED_BACK = "ROLLED_BACK"


class ProposalCategory(str, Enum):
    SUPPLY_REBALANCE = "SUPPLY_REBALANCE"
    VECTOR_CONTROL = "VECTOR_CONTROL"
    QUARANTINE_PERIMETER = "QUARANTINE_PERIMETER"
    STAFF_SURGE = "STAFF_SURGE"
    EMERGENCY_RATIONING = "EMERGENCY_RATIONING"


@dataclass
class ProposalItem:
    item_id: str
    name: str
    quantity: int
    unit: str
    source_facility_id: str
    target_facility_id: str
    estimated_transit_hours: float


@dataclass
class HumanApprovalProposal:
    proposal_id: str
    title: str
    summary: str
    category: ProposalCategory
    proposing_agent: str
    risk_level: str  # "LOW", "MEDIUM", "HIGH", "CRITICAL"
    confidence_score: float  # 0.0 to 1.0
    items: List[ProposalItem] = field(default_factory=list)
    state: ProposalState = ProposalState.PENDING
    created_at_utc: float = field(default_factory=time.time)
    expires_at_utc: float = field(default_factory=lambda: time.time() + 86400)  # 24h default
    action_payload: Dict[str, Any] = field(default_factory=dict)
    
    # Cryptographic Audit Enclave
    docket_id: Optional[str] = None
    audit_hash: Optional[str] = None
    authorizer_id: Optional[str] = None
    authorizer_role: Optional[str] = None
    authorized_at_utc: Optional[float] = None
    signature: Optional[str] = None
    rollback_token: Optional[str] = None
    audit_trail: List[Dict[str, Any]] = field(default_factory=list)

    def __post_init__(self):
        if not self.audit_hash:
            canonical = {
                "id": self.proposal_id,
                "title": self.title,
                "category": self.category,
                "payload": self.action_payload,
            }
            self.audit_hash = CryptographicAuditor.compute_sha256(canonical)
        if not self.docket_id:
            self.docket_id = f"DOCKET-SOV-{self.proposal_id[:8].upper()}-{int(self.created_at_utc)}"
        self._record_audit_event("PROPOSAL_CREATED", f"Drafted by autonomous agent {self.proposing_agent}")

    def _record_audit_event(self, action: str, details: str, actor: str = "SYSTEM"):
        event = {
            "timestamp": time.time(),
            "action": action,
            "actor": actor,
            "details": details,
            "state_snapshot": self.state.value,
        }
        self.audit_trail.append(event)

    def authorize(self, authorizer_id: str, authorizer_role: str, secret_salt: Optional[str] = None) -> bool:
        """Ministerial legal sign-off."""
        if self.state != ProposalState.PENDING:
            raise ValueError(f"Cannot authorize proposal in state {self.state}")
        if time.time() > self.expires_at_utc:
            self.state = ProposalState.EXPIRED
            self._record_audit_event("AUTO_EXPIRED", "Proposal validity window elapsed before signature", actor=authorizer_id)
            return False

        self.authorizer_id = authorizer_id
        self.authorizer_role = authorizer_role
        self.authorized_at_utc = time.time()
        self.state = ProposalState.AUTHORIZED

        # Generate cryptographic signature
        _, self.signature = CryptographicAuditor.sign_proposal(
            self.proposal_id,
            self.action_payload,
            signer_id=authorizer_id,
            secret_salt=secret_salt,
        )
        self.rollback_token = f"ROLLBACK-{CryptographicAuditor.compute_sha256(self.signature)[:16].upper()}"
        self._record_audit_event(
            "MINISTERIAL_AUTHORIZATION",
            f"Signed by {authorizer_id} ({authorizer_role}) with cryptographic token {self.signature[:12]}...",
            actor=authorizer_id,
        )
        return True

    def reject(self, reviewer_id: str, reason: str):
        if self.state != ProposalState.PENDING:
            raise ValueError(f"Cannot reject proposal in state {self.state}")
        self.state = ProposalState.REJECTED
        self._record_audit_event("PROPOSAL_REJECTED", f"Reason: {reason}", actor=reviewer_id)

    def execute(self, dispatcher_id: str = "AUTONOMOUS_FLEET_CONTROLLER") -> Dict[str, Any]:
        """Dispatch the authorized payload."""
        if self.state != ProposalState.AUTHORIZED:
            raise RuntimeError(f"Cannot execute proposal without AUTHORIZED status (Current: {self.state})")
        self.state = ProposalState.EXECUTED
        self._record_audit_event("EXECUTION_DISPATCHED", "Fleet and resource routing executed", actor=dispatcher_id)
        return {
            "status": "DISPATCHED",
            "docket_id": self.docket_id,
            "items_count": len(self.items),
            "signature": self.signature,
        }

    def rollback(self, requester_id: str, rollback_token: str, reason: str) -> bool:
        """Roll back an executed or authorized proposal using safety token."""
        if self.rollback_token != rollback_token:
            raise PermissionError("Invalid rollback token provided")
        self.state = ProposalState.ROLLED_BACK
        self._record_audit_event("SOVEREIGN_ROLLBACK", f"Reversion reason: {reason}", actor=requester_id)
        return True

    def to_dict(self) -> Dict[str, Any]:
        data = asdict(self)
        return ZeroPIISanitizer.sanitize_dict(data)


class HumanApprovalRegistry:
    """In-memory or persistent store for national proposals with search & audit index."""
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._instance._proposals: Dict[str, HumanApprovalProposal] = {}
        return cls._instance

    def register(self, proposal: HumanApprovalProposal) -> HumanApprovalProposal:
        self._proposals[proposal.proposal_id] = proposal
        return proposal

    def get(self, proposal_id: str) -> Optional[HumanApprovalProposal]:
        return self._proposals.get(proposal_id)

    def list_all(self, state: Optional[ProposalState] = None) -> List[HumanApprovalProposal]:
        proposals = list(self._proposals.values())
        if state:
            proposals = [p for p in proposals if p.state == state]
        return sorted(proposals, key=lambda p: p.created_at_utc, reverse=True)


approval_registry = HumanApprovalRegistry()
