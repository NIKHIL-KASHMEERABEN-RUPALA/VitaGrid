"""
VitaGrid GOV - Command Center Router
Provides national KPIs, DEFCON status, active critical alerts, and overview summaries.
"""

from fastapi import APIRouter, HTTPException
import time
from typing import Any, Dict, List
from vitagrid_gov.agents.orchestrator import commander_orchestrator
from vitagrid_gov.api.schemas import DefconUpdateRequest
from vitagrid_gov.core.audit_ledger import audit_ledger

router = APIRouter(prefix="/command-center", tags=["Command Center"])


@router.get("/kpis")
async def get_national_kpis():
    """Returns the 4 primary cards for the Command Center dashboard."""
    state = commander_orchestrator.state
    return {
        "status": "SYNCHRONIZED",
        "timestamp_utc": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
        "defcon_level": state.defcon_level,
        "kpis": [
            {
                "id": "availability",
                "label": "Availability Index",
                "value": f"{state.national_availability_index}%",
                "status": "Optimal",
                "change": "+1.4% vs 30d base",
                "is_positive": True
            },
            {
                "id": "bed_capacity",
                "label": "Surge Bed Capacity",
                "value": f"{state.national_icu_utilization_pct}%",
                "status": "Nominal",
                "subtext": "1,420 / 1,815 Beds ICU",
                "is_positive": True
            },
            {
                "id": "rostering",
                "label": "Clinician Rostering",
                "value": f"{state.national_clinician_rostering_pct}%",
                "status": "Stable",
                "subtext": "14,920 On-shift live",
                "is_positive": True
            },
            {
                "id": "critical_alerts",
                "label": "Active Critical Alerts",
                "value": f"{state.active_critical_alerts:02d}",
                "status": "Immediate Action",
                "subtext": "2 Pending Human Approvals",
                "is_positive": False
            }
        ]
    }


@router.post("/defcon")
async def update_defcon_level(req: DefconUpdateRequest):
    """Sets a new sovereign DEFCON level."""
    new_level = await commander_orchestrator.set_defcon_level(req.defcon_level, reason=req.reason)
    return {
        "success": True,
        "new_defcon_level": new_level,
        "reason": req.reason,
        "updated_at": time.time()
    }


@router.get("/alerts")
async def get_active_alerts():
    """Returns national alert items with urgent tags and transfer linkages."""
    return [
        {
            "id": "ALT-01",
            "title": "Mombasa Subcounty • Amoxicillin Depletion Alert",
            "urgency": "CRITICAL",
            "badgeText": "STOCKOUT RISK (48H)",
            "description": "Pediatric suspension down to 4.2 days runway. Acute respiratory presentations surged +22%.",
            "proposalId": "DOCKET-ACT-842",
            "category": "SUPPLY_CHAIN"
        },
        {
            "id": "ALT-02",
            "title": "Lake Basin • Early Vector Stage Outbreak Notice",
            "urgency": "HIGH",
            "badgeText": "EPIDEMIC WAVE DETECTED",
            "description": "Cori R_t accelerated to 1.34 in Kisumu subcounties. 5,000 units IV saline pre-allocation drafted.",
            "proposalId": "DOCKET-ACT-843",
            "category": "EPIDEMIOLOGY"
        },
        {
            "id": "ALT-03",
            "title": "Turkana North • Cold-Chain Compressor Anomaly",
            "urgency": "MEDIUM",
            "badgeText": "THERMAL DRIFT",
            "description": "Compressor duty cycle elevated to 88%. Backup solar battery circuit scheduled for dispatch.",
            "proposalId": None,
            "category": "COLD_CHAIN"
        }
    ]


@router.get("/audit-ledger")
async def get_audit_trail(limit: int = 25):
    """Returns immutable cryptographic audit ledger records."""
    return audit_ledger.get_recent(limit=limit)
