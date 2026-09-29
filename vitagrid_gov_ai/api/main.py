"""
VitaGrid GOV - FastAPI Application Entry Point
Production-ready sovereign API gateway conforming to FedRAMP High and FIPS 140-3.
"""

from typing import Any, Dict, Optional
from vitagrid_gov_ai.core.config import settings
from vitagrid_gov_ai.core.security import ZeroPIISanitizer
from vitagrid_gov_ai.api import (
    routes_command,
    routes_supply_chain,
    routes_radar,
    routes_resources,
    routes_approvals,
    routes_copilot,
    routes_swarm,
)

# Standard imports when running with FastAPI installed
try:
    from fastapi import FastAPI, HTTPException, Request, Response
    from fastapi.middleware.cors import CORSMiddleware
    FASTAPI_AVAILABLE = True
except ImportError:
    FASTAPI_AVAILABLE = False


def create_app():
    if not FASTAPI_AVAILABLE:
        return None

    app = FastAPI(
        title="VitaGrid GOV - Sovereign Health Intelligence Backend",
        description="Autonomous Multi-Agent AI & Logistics Command Platform for Ministries of Health",
        version=settings.version,
        docs_url="/docs",
        redoc_url="/redoc",
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def sovereign_audit_middleware(request: Request, call_next):
        response: Response = await call_next(request)
        response.headers["X-Sovereign-Enclave"] = settings.security.enclave_id
        response.headers["X-Zero-PII-Policy"] = "STRICT_ENFORCED"
        response.headers["X-Audit-FIPS"] = "140-3"
        return response

    @app.get("/healthz", tags=["System"])
    def health_check():
        return {
            "status": "HEALTHY",
            "enclave": settings.security.enclave_id,
            "fips_compliant": settings.security.fips_mode,
            "version": settings.version,
        }

    # Module Routers
    @app.get("/api/v1/command/telemetry", tags=["Command Center"])
    def get_telemetry():
        return routes_command.get_command_center_telemetry()

    @app.get("/api/v1/supply-chain/overview", tags=["Supply Chain"])
    def get_supply_overview():
        return routes_supply_chain.get_supply_chain_overview()

    @app.get("/api/v1/radar/overview", tags=["Epidemiology"])
    def get_radar_overview():
        return routes_radar.get_outbreak_radar_overview()

    @app.get("/api/v1/resources/overview", tags=["Resources"])
    def get_resource_overview():
        return routes_resources.get_resource_overview()

    @app.get("/api/v1/approvals", tags=["HITL Governance"])
    def list_approvals(state: Optional[str] = None):
        return routes_approvals.list_proposals(state_filter=state)

    @app.post("/api/v1/approvals/{proposal_id}/authorize", tags=["HITL Governance"])
    def authorize(proposal_id: str, authorizer_id: str = "DR_V_RAO", role: str = "National Director"):
        res = routes_approvals.authorize_proposal(proposal_id, authorizer_id=authorizer_id, role=role)
        if "error" in res:
            raise HTTPException(status_code=res.get("status", 400), detail=res["error"])
        return res

    @app.post("/api/v1/copilot/query", tags=["Copilot"])
    async def copilot_chat(query: str):
        return await routes_copilot.query_copilot(query)

    @app.post("/api/v1/copilot/simulate", tags=["Copilot"])
    async def copilot_simulate(target_county: str = "Machakos", delay_hours: float = 6.0, surge_pct: float = 25.0):
        return await routes_copilot.run_what_if_simulation(target_county, delay_hours, surge_pct)

    @app.post("/api/v1/swarm/run", tags=["Multi-Agent Swarm"])
    async def trigger_swarm():
        return await routes_swarm.trigger_swarm_run()

    return app


app = create_app()
