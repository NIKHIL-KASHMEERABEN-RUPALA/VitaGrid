"""
VitaGrid GOV - Resource Intelligence Agent
Multi-facility linear programming optimizer for ICU beds, ventilators, and clinical staffing.
"""

from typing import Any, Dict, List, Tuple
from vitagrid_gov_ai.agents.base import BaseSovereignAgent, AgentTool
from vitagrid_gov_ai.models.optimizer import optimization_engine, StaffReallocationMove
from vitagrid_gov_ai.data.schemas import FacilityTelemetry
from vitagrid_gov_ai.core.config import settings


class ResourceIntelligenceAgent(BaseSovereignAgent):
    """
    Monitors national hospital capacity, bed occupancy, and clinician burnout.
    Generates cross-county mutual aid deployment proposals.
    """

    def __init__(self):
        super().__init__(
            agent_id="AGENT-RESOURCE-INTEL-01",
            name="Sovereign Resource Intelligence Agent",
            role="Critical Care Capacity Optimization & Staff Surge Planner",
        )
        self._setup_tools()

    def _setup_tools(self):
        self.register_tool(
            AgentTool(
                name="solve_clinician_surge",
                description="Optimizes humanitarian clinician reallocations from low-stress to surge counties.",
                func=self._tool_surge_clinicians,
                parameters_schema={
                    "stressed_counties": "List[Tuple]",
                    "donor_counties": "List[Tuple]",
                },
            )
        )

    def _tool_surge_clinicians(
        self,
        stressed_counties: List[Tuple[str, int, int]],
        donor_counties: List[Tuple[str, int, int]],
    ) -> List[StaffReallocationMove]:
        return optimization_engine.optimize_clinician_surge(stressed_counties, donor_counties)

    async def process_task(self, context: Dict[str, Any]) -> Dict[str, Any]:
        self.state.status = "RUNNING"
        facilities: List[Any] = context.get("facilities", [])

        # Group by county
        county_icu_util: Dict[str, Dict[str, Any]] = {}
        for fac in facilities:
            icu_total = fac.get("icu_total", 0) if isinstance(fac, dict) else fac.icu_total
            icu_occupied = fac.get("icu_occupied", 0) if isinstance(fac, dict) else fac.icu_occupied
            county_code = fac.get("county_code", "KE") if isinstance(fac, dict) else fac.county_code
            county_name = fac.get("county_name", "County") if isinstance(fac, dict) else fac.county_name
            clinicians = fac.get("clinicians_on_shift", 0) if isinstance(fac, dict) else fac.clinicians_on_shift

            if icu_total > 0:
                c = county_icu_util.setdefault(county_code, {
                    "county_name": county_name,
                    "icu_total": 0,
                    "icu_occupied": 0,
                    "clinicians": 0,
                })
                c["icu_total"] += icu_total
                c["icu_occupied"] += icu_occupied
                c["clinicians"] += clinicians

        stressed = []
        donors = []
        critical_alerts = []

        for code, data in county_icu_util.items():
            util_pct = (data["icu_occupied"] / data["icu_total"] * 100.0) if data["icu_total"] > 0 else 0.0
            if util_pct >= settings.thresholds.icu_utilization_critical_pct:
                deficit_clinicians = max(5, int(data["icu_occupied"] * 0.25))
                stressed.append((code, data["clinicians"], deficit_clinicians))
                critical_alerts.append({
                    "county_code": code,
                    "county_name": data["county_name"],
                    "icu_utilization_pct": round(util_pct, 1),
                    "deficit_clinicians": deficit_clinicians,
                })
            elif util_pct < 65.0 and data["clinicians"] > 25:
                surplus = int(data["clinicians"] * 0.15)
                donors.append((code, data["clinicians"], surplus))

        surge_moves: List[StaffReallocationMove] = []
        if stressed and donors:
            moves = self.call_tool("solve_clinician_surge", stressed_counties=stressed, donor_counties=donors)
            surge_moves.extend(moves)

        self.state.status = "COMPLETED"
        return {
            "agent_id": self.agent_id,
            "stressed_icu_counties": critical_alerts,
            "staffing_reallocation_plan": [
                {
                    "from_county": m.source_county,
                    "to_county": m.target_county,
                    "clinicians_dispatched": m.clinicians_transferred,
                    "origin_retention_ratio": m.origin_remaining_ratio,
                }
                for m in surge_moves
            ],
            "total_clinicians_mobilized": sum(m.clinicians_transferred for m in surge_moves),
        }
