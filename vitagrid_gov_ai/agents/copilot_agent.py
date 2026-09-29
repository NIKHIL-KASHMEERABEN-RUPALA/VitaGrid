"""
VitaGrid GOV - Context-Aware AI Decision Copilot
Ministerial conversational agent, What-If simulation engine, and RAG protocol explainer.
"""

from dataclasses import dataclass
import time
from typing import Any, Dict, List, Optional
from vitagrid_gov_ai.agents.base import BaseSovereignAgent, AgentTool
from vitagrid_gov_ai.rag.grounded_qa import grounded_generator, GroundedAnswer
from vitagrid_gov_ai.core.hitl import HumanApprovalProposal, ProposalCategory, ProposalItem, approval_registry
from vitagrid_gov_ai.core.security import CryptographicAuditor, ZeroPIISanitizer


@dataclass
class SimulationScenario:
    scenario_id: str
    description: str
    target_zone: str
    delay_hours: float = 0.0
    demand_surge_pct: float = 0.0
    stock_delta_pct: float = 0.0


@dataclass
class SimulationOutcome:
    scenario_id: str
    baseline_runout_days: float
    simulated_runout_days: float
    additional_facilities_breached: int
    casualty_or_morbidity_risk: str  # ELEVATED, SEVERE, CATASTROPHIC
    recommended_contingency: str


class DecisionCopilotAgent(BaseSovereignAgent):
    """
    Copilot agent assisting National Directors, County Commissioners, and Supply Officers.
    Capable of protocol RAG query, counterfactual simulation, and one-click HITL escalation.
    """

    def __init__(self):
        super().__init__(
            agent_id="AGENT-COPILOT-01",
            name="Sovereign Decision Copilot",
            role="Ministerial Advisory, Counterfactual What-If Simulation & Protocol Guidance",
        )
        self._setup_tools()

    def _setup_tools(self):
        self.register_tool(
            AgentTool(
                name="grounded_protocol_lookup",
                description="Queries sovereign national treatment protocols and SOP guidelines.",
                func=self._tool_rag_lookup,
                parameters_schema={"query": "str"},
            )
        )
        self.register_tool(
            AgentTool(
                name="simulate_what_if_scenario",
                description="Simulates logistics delays or demand surges on national stock and ICU capacity.",
                func=self._tool_simulate_what_if,
                parameters_schema={
                    "corridor_delay_hours": "float",
                    "demand_surge_pct": "float",
                    "target_county": "str",
                },
            )
        )
        self.register_tool(
            AgentTool(
                name="queue_ministerial_action",
                description="Immediately pushes a synthesized intervention into the Human Approvals Queue.",
                func=self._tool_queue_action,
                parameters_schema={"title": "str", "summary": "str", "category": "str", "items": "List"},
            )
        )

    def _tool_rag_lookup(self, query: str) -> Dict[str, Any]:
        ans: GroundedAnswer = grounded_generator.answer_query(query)
        return {
            "query": ans.query,
            "response": ans.response_text,
            "grounded": ans.grounded,
            "citations": ans.citations,
            "faithfulness_score": ans.faithfulness_score,
        }

    def _tool_simulate_what_if(
        self, corridor_delay_hours: float, demand_surge_pct: float, target_county: str
    ) -> Dict[str, Any]:
        baseline_days = 3.2
        # Impact: every 6h delay reduces buffer by 0.35 days; demand surge accelerates depletion
        depletion_factor = 1.0 + (demand_surge_pct / 100.0)
        delay_penalty = (corridor_delay_hours / 24.0)
        simulated_days = max(0.2, round((baseline_days / depletion_factor) - delay_penalty, 1))

        breached_facilities = 1
        if simulated_days <= 1.5:
            breached_facilities = 3
        if simulated_days <= 0.8:
            breached_facilities = 7

        risk = "ELEVATED"
        if simulated_days < 1.0:
            risk = "SEVERE"
        if simulated_days < 0.5:
            risk = "CATASTROPHIC"

        contingency = (
            f"If {target_county} experiences a {corridor_delay_hours}h transit delay with a {demand_surge_pct}% surge, "
            f"stock run-out drops from {baseline_days} days to {simulated_days} days. "
            f"Recommendation: Divert secondary emergency airlift from Nairobi CMS Enclave immediately."
        )

        return {
            "target_county": target_county,
            "corridor_delay_hours": corridor_delay_hours,
            "demand_surge_pct": demand_surge_pct,
            "baseline_runout_days": baseline_days,
            "simulated_runout_days": simulated_days,
            "breached_facilities_count": breached_facilities,
            "risk_level": risk,
            "contingency_recommendation": contingency,
        }

    def _tool_queue_action(self, title: str, summary: str, category: str, items: List[Dict[str, Any]]) -> Dict[str, Any]:
        proposal = HumanApprovalProposal(
            proposal_id=f"PROP-COPILOT-{int(time.time())}",
            title=title,
            summary=summary,
            category=ProposalCategory(category),
            proposing_agent=self.agent_id,
            risk_level="HIGH",
            confidence_score=0.98,
            items=[
                ProposalItem(
                    item_id=i.get("item_code", "GEN-ITEM"),
                    name=i.get("name", "Medical Resource"),
                    quantity=i.get("quantity", 1000),
                    unit=i.get("unit", "Units"),
                    source_facility_id=i.get("source", "FAC-CMS-001"),
                    target_facility_id=i.get("target", "FAC-KE-16-L5"),
                    estimated_transit_hours=i.get("eta_hours", 2.5),
                )
                for i in items
            ],
            action_payload={"generated_by": "Copilot Decision Enclave"},
        )
        approval_registry.register(proposal)
        return proposal.to_dict()

    async def process_task(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Interactive query interface."""
        user_query = context.get("user_query", "")
        mode = context.get("mode", "chat")  # chat, what_if, queue_action

        if mode == "what_if":
            delay = context.get("delay_hours", 6.0)
            surge = context.get("surge_pct", 25.0)
            target = context.get("target_county", "Machakos")
            res = self.call_tool("simulate_what_if_scenario", corridor_delay_hours=delay, demand_surge_pct=surge, target_county=target)
            return {"mode": "what_if", "result": res}

        # Standard RAG-augmented query
        rag_res = self.call_tool("grounded_protocol_lookup", query=user_query)
        return {
            "mode": "chat",
            "reply": rag_res["response"],
            "grounded": rag_res["grounded"],
            "citations": rag_res["citations"],
        }


copilot_agent = DecisionCopilotAgent()
