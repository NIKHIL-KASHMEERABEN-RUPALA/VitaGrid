"""
VitaGrid GOV - API Routes Package
"""

from vitagrid_gov.api.routes.command_center import router as command_center_router
from vitagrid_gov.api.routes.predictions import router as predictions_router
from vitagrid_gov.api.routes.logistics import router as logistics_router
from vitagrid_gov.api.routes.approvals import router as approvals_router
from vitagrid_gov.api.routes.digital_twin import router as digital_twin_router
from vitagrid_gov.api.routes.websocket import router as websocket_router

__all__ = [
    "command_center_router",
    "predictions_router",
    "logistics_router",
    "approvals_router",
    "digital_twin_router",
    "websocket_router",
]
