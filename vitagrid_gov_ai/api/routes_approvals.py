"""
VitaGrid GOV - Human Approvals Router
Sovereign Human-in-the-Loop ministerial sign-off, signature verification, and rollback.
"""

from typing import Any, Dict, List, Optional
from vitagrid_gov_ai.core.hitl import approval_registry, ProposalState


def list_proposals(state_filter: Optional[str] = None) -> List[Dict[str, Any]]:
    state = ProposalState(state_filter) if state_filter else None
    proposals = approval_registry.list_all(state=state)
    return [p.to_dict() for p in proposals]


def get_proposal_detail(proposal_id: str) -> Optional[Dict[str, Any]]:
    p = approval_registry.get(proposal_id)
    return p.to_dict() if p else None


def authorize_proposal(proposal_id: str, authorizer_id: str, role: str) -> Dict[str, Any]:
    p = approval_registry.get(proposal_id)
    if not p:
        return {"error": "PROPOSAL_NOT_FOUND", "status": 404}
    
    success = p.authorize(authorizer_id=authorizer_id, authorizer_role=role)
    if not success:
        return {"error": "AUTHORIZATION_FAILED", "state": p.state.value}

    # Automatically trigger execution dispatch for demo
    exec_result = p.execute()
    return {
        "status": "AUTHORIZED_AND_EXECUTED",
        "docket_id": p.docket_id,
        "signature": p.signature,
        "rollback_token": p.rollback_token,
        "execution": exec_result,
    }


def rollback_proposal(proposal_id: str, rollback_token: str, reason: str, requester_id: str) -> Dict[str, Any]:
    p = approval_registry.get(proposal_id)
    if not p:
        return {"error": "PROPOSAL_NOT_FOUND", "status": 404}
    try:
        p.rollback(requester_id=requester_id, rollback_token=rollback_token, reason=reason)
        return {"status": "SUCCESSFULLY_ROLLED_BACK", "proposal_id": proposal_id}
    except Exception as e:
        return {"error": str(e), "status": 403}
