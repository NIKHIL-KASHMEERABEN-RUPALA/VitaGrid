"""
VitaGrid GOV - Cold-Chain Agent
Thermal integrity monitoring, IoT sensor anomaly detection, and vaccine integrity risk scoring.
"""

from typing import Any, Dict, List
from vitagrid_gov_ai.agents.base import BaseSovereignAgent, AgentTool
from vitagrid_gov_ai.data.schemas import ColdChainSensorReading


class ColdChainAgent(BaseSovereignAgent):
    """
    Monitors IoT cold-chain nodes across regional vaccine hubs and district clinics.
    Flags temperature breaches and triggers emergency power or dry-ice rotation protocols.
    """

    def __init__(self):
        super().__init__(
            agent_id="AGENT-COLD-CHAIN-01",
            name="Sovereign Cold-Chain Sentinel",
            role="Vaccine Thermal Integrity & Cryogenic Enclave Protection",
        )
        self._setup_tools()

    def _setup_tools(self):
        self.register_tool(
            AgentTool(
                name="assess_thermal_integrity",
                description="Audits temperature sensor telemetry against WHO/EPI +2C to +8C standards.",
                func=self._tool_assess_sensor,
                parameters_schema={"reading": "ColdChainSensorReading"},
            )
        )

    def _tool_assess_sensor(self, reading: Any) -> Dict[str, Any]:
        if isinstance(reading, dict):
            temp = float(reading.get("temperature_celsius", 4.0))
            sensor_id = reading.get("sensor_id", "SENS-CC")
            facility_id = reading.get("facility_id", "FAC")
            county_code = reading.get("county_code", "KE")
            compressor_status = reading.get("compressor_status", "NORMAL")
            target_min = float(reading.get("target_min_celsius", 2.0))
            target_max = float(reading.get("target_max_celsius", 8.0))
            is_excursion = (temp < target_min or temp > target_max)
        else:
            is_excursion = reading.is_thermal_excursion
            temp = reading.temperature_celsius
            sensor_id = reading.sensor_id
            facility_id = reading.facility_id
            county_code = reading.county_code
            compressor_status = reading.compressor_status

        risk_score = 0.0
        if temp > 8.0:
            degree_hours_delta = temp - 8.0
            risk_score = min(1.0, 0.2 + (degree_hours_delta * 0.18))
        elif temp < 2.0:
            degree_hours_delta = 2.0 - temp
            risk_score = min(1.0, 0.4 + (degree_hours_delta * 0.25))  # Freezing is immediate danger for liquid vaccines

        recommendation = "Maintain standard automated telemetry."
        if is_excursion:
            if compressor_status == "FAILED" or temp >= 10.0:
                recommendation = "EMERGENCY: Dispatch secondary solar battery inverter and deploy portable dry-ice cryo-tanks."
            else:
                recommendation = "WARNING: Service compressor fan and re-verify thermal seal."

        return {
            "sensor_id": sensor_id,
            "facility_id": facility_id,
            "county_code": county_code,
            "temperature_celsius": temp,
            "is_excursion": is_excursion,
            "spoilage_risk_score": round(risk_score, 2),
            "recommendation": recommendation,
        }

    async def process_task(self, context: Dict[str, Any]) -> Dict[str, Any]:
        self.state.status = "RUNNING"
        readings: List[ColdChainSensorReading] = context.get("cold_chain_readings", [])
        
        excursions: List[Dict[str, Any]] = []
        for r in readings:
            eval_res = self.call_tool("assess_thermal_integrity", reading=r)
            if eval_res["is_excursion"]:
                excursions.append(eval_res)

        self.state.status = "COMPLETED"
        return {
            "agent_id": self.agent_id,
            "total_sensors_audited": len(readings),
            "thermal_excursions_count": len(excursions),
            "excursions": excursions,
            "status": "CRITICAL_ALERT" if any(e["spoilage_risk_score"] > 0.5 for e in excursions) else "NORMAL",
        }
