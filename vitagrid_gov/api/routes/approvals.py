"""
VitaGrid GOV - Human Approvals & Ministerial Governance Router
Enforces the sovereign Human-in-the-Loop boundary.
Enables cryptographic authorization with ECDSA signatures and one-time emergency rollback.
"""

from fastapi import APIRouter, HTTPException
from vitagrid_gov.agents.security_hitl import security_hitl_agent
from vitagrid_gov.api.schemas import AuthorizeDocketRequest, RollbackDocketRequest

router = APIRouter(prefix="/approvals", tags=["Human Approvals (HITL)"])


@router.get("/dockets")
async def list_pending_approvals():
    """Lists all operational dockets awaiting ministerial cryptographic sign-off."""
    return security_hitl_agent.list_pending_dockets()


@router.post("/authorize")
async def authorize_docket(req: AuthorizeDocketRequest):
    """
    Applies Ministerial Cryptographic Sign-Off to an Action Docket.
    Generates verifiable signature and one-time rollback token.
    """
    res = security_hitl_agent.authorize_docket(
        docket_id=req.docket_id,
        authorizer_id=req.authorizer_id,
        authorizer_role=req.authorizer_role
    )
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("error"))
    return res


@router.post("/rollback")
async def rollback_docket(req: RollbackDocketRequest):
    """Executes emergency rollback of an authorized docket."""
    res = security_hitl_agent.rollback_docket(
        docket_id=req.docket_id,
        rollback_token=req.rollback_token,
        reason=req.reason
    )
    if not res.get("success"):
        raise HTTPException(status_code=400, detail=res.get("error"))
    return res
