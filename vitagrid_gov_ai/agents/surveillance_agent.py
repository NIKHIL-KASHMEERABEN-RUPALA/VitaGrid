"""
VitaGrid GOV - Surveillance Agent
Continuous syndromic scanning, cluster detection, R_t calculation, and positivity shift alerts.
"""

from typing import Any, Dict, List
from vitagrid_gov_ai.agents.base import BaseSovereignAgent, AgentTool
from vitagrid_gov_ai.models.epidemiology import epidemiology_engine, RtEstimate, AnomalyAlert
from vitagrid_gov_ai.core.config import settings


class SurveillanceAgent(BaseSovereignAgent):
    """
    Scans national health facility feeds to detect nascent outbreaks before clinical capacity fails.
    """

    def __init__(self):
        super().__init__(
            agent_id="AGENT-SURVEILLANCE-01",
            name="Sovereign Surveillance Sentinel",
            role="Epidemiological Early Warning & Cluster Detection",
        )
        self._setup_tools()

    def _setup_tools(self):
        self.register_tool(
            AgentTool(
                name="calculate_r_t",
                description="Estimates instantaneous reproduction number R_t with 95% Credible Interval.",
                func=self._tool_estimate_rt,
                parameters_schema={"county_code": "str", "daily_cases": "List[int]"},
            )
        )
        self.register_tool(
            AgentTool(
                name="detect_anomaly",
                description="Detects anomalous epidemiological surges using CUSUM and Z-scores.",
                func=self._tool_detect_anomaly,
                parameters_schema={"county_code": "str", "historical_series": "List[int]", "disease": "str"},
            )
        )

    def _tool_estimate_rt(self, county_code: str, daily_cases: List[int]) -> Dict[str, Any]:
        estimate: RtEstimate = epidemiology_engine.estimate_r_t(daily_cases, county_code)
        return {
            "county_code": estimate.county_code,
            "r_t_median": estimate.r_t_median,
            "r_t_ci": [estimate.r_t_lower_ci, estimate.r_t_upper_ci],
            "doubling_time_days": estimate.doubling_time_days,
            "surge_phase": estimate.surge_phase,
            "growth_rate_pct": estimate.growth_rate_pct,
        }

    def _tool_detect_anomaly(self, county_code: str, historical_series: List[int], disease: str) -> Dict[str, Any]:
        alert: AnomalyAlert = epidemiology_engine.detect_syndromic_anomalies(historical_series, county_code, disease)
        return {
            "county_code": alert.county_code,
            "disease": alert.disease,
            "observed_cases": alert.observed_cases,
            "expected_baseline": alert.expected_baseline,
            "z_score": alert.z_score,
            "cusum_statistic": alert.cusum_statistic,
            "is_anomaly": alert.is_anomaly,
        }

    async def process_task(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """
        Input context contains 'syndromic_records' grouped by county.
        Evaluates R_t and anomalies across counties and flags surge zones.
        """
        self.state.status = "RUNNING"
        county_data = context.get("county_case_series", {})
        high_risk_zones = []

        for county_code, cases in county_data.items():
            if not cases:
                continue

            rt_res = self.call_tool("calculate_r_t", county_code=county_code, daily_cases=cases)
            anomaly_res = self.call_tool(
                "detect_anomaly",
                county_code=county_code,
                historical_series=cases,
                disease=context.get("disease", "Acute Respiratory Infection"),
            )

            is_alert = (
                rt_res["r_t_median"] >= settings.thresholds.outbreak_r_t_alert_threshold
                or anomaly_res["is_anomaly"]
            )

            if is_alert:
                high_risk_zones.append({
                    "county_code": county_code,
                    "r_t": rt_res["r_t_median"],
                    "surge_phase": rt_res["surge_phase"],
                    "doubling_time_days": rt_res["doubling_time_days"],
                    "z_score": anomaly_res["z_score"],
                    "urgency": "CRITICAL" if rt_res["r_t_median"] >= 1.3 else "HIGH",
                })

        self.state.status = "COMPLETED"
        return {
            "agent_id": self.agent_id,
            "outbreak_detected": len(high_risk_zones) > 0,
            "flagged_counties": high_risk_zones,
            "summary": (
                f"Surveillance complete: {len(high_risk_zones)} counties breached sovereign epidemiological "
                f"alert threshold (R_t >= {settings.thresholds.outbreak_r_t_alert_threshold})."
            ),
        }
