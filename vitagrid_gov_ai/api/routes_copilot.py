"""
VitaGrid GOV - AI Copilot Router
Interactive ministerial decision support, counterfactual simulations, and protocol lookup.
"""

from typing import Any, Dict
from vitagrid_gov_ai.agents.copilot_agent import copilot_agent


async def query_copilot(query: str) -> Dict[str, Any]:
    res = await copilot_agent.process_task({"user_query": query, "mode": "chat"})
    return res


async def run_what_if_simulation(target_county: str, delay_hours: float, surge_pct: float) -> Dict[str, Any]:
    res = await copilot_agent.process_task({
        "mode": "what_if",
        "target_county": target_county,
        "delay_hours": delay_hours,
        "surge_pct": surge_pct,
    })
    return res
