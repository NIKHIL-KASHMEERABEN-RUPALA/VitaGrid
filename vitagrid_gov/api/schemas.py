"""
VitaGrid GOV - Pydantic Request & Response Schemas
Matches the exact JSON structure consumed by the React 19 Command Center dashboards.
"""

from pydantic import BaseModel, Field
from typing import Any, Dict, List, Optional


class DefconUpdateRequest(BaseModel):
    defcon_level: int = Field(..., ge=1, le=5, description="New DEFCON level (1 to 5)")
    reason: str = Field(default="Ministerial command decision")


class IngestTelemetryRequest(BaseModel):
    facility_id: str
    commodity_name: str
    current_stock: int
    daily_consumption: float
    temperature_celsius: Optional[float] = 4.5
    occupied_beds: Optional[int] = 45


class WhatIfSimulationRequest(BaseModel):
    target_facility_id: str
    intervention_type: str = Field(..., description="'STOCK_INJECTION' or 'STAFF_AUGMENTATION'")
    parameters: Dict[str, Any] = Field(default_factory=dict)


class AuthorizeDocketRequest(BaseModel):
    docket_id: str
    authorizer_id: str = "DR_V_RAO"
    authorizer_role: str = "National Health Director"


class RollbackDocketRequest(BaseModel):
    docket_id: str
    rollback_token: str
    reason: str = "Ministerial Abort Directive"


class ClinicalQueryRequest(BaseModel):
    query: str
