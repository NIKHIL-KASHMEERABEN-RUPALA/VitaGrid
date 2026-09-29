"""
VitaGrid GOV - Sovereign Base Agent Architecture
Defines tool execution contracts, audit tracking, and structured state outputs.
"""

from abc import ABC, abstractmethod
from dataclasses import dataclass, field
import time
from typing import Any, Callable, Dict, List, Optional
from vitagrid_gov_ai.core.telemetry import logger
from vitagrid_gov_ai.core.security import CryptographicAuditor, ZeroPIISanitizer


@dataclass
class AgentTool:
    name: str
    description: str
    func: Callable[..., Any]
    parameters_schema: Dict[str, Any]


@dataclass
class AgentState:
    agent_id: str
    current_step: str
    memory: Dict[str, Any] = field(default_factory=dict)
    actions_taken: List[Dict[str, Any]] = field(default_factory=list)
    confidence: float = 1.0
    status: str = "IDLE"  # IDLE, RUNNING, COMPLETED, FAILED, ESCALATED


class BaseSovereignAgent(ABC):
    """
    Abstract sovereign agent. Enforces zero-PII in state memory,
    cryptographic action hashing, and explicit tool authorization.
    """

    def __init__(self, agent_id: str, name: str, role: str):
        self.agent_id = agent_id
        self.name = name
        self.role = role
        self.tools: Dict[str, AgentTool] = {}
        self.state = AgentState(agent_id=agent_id, current_step="INITIALIZED")

    def register_tool(self, tool: AgentTool):
        self.tools[tool.name] = tool

    def call_tool(self, tool_name: str, **kwargs) -> Any:
        if tool_name not in self.tools:
            raise KeyError(f"Tool {tool_name} not registered with agent {self.agent_id}")
        clean_kwargs = ZeroPIISanitizer.sanitize_dict(kwargs)
        start_t = time.time()
        result = self.tools[tool_name].func(**clean_kwargs)
        duration = round(time.time() - start_t, 4)

        action_record = {
            "timestamp": time.time(),
            "tool": tool_name,
            "inputs_hash": CryptographicAuditor.compute_sha256(clean_kwargs),
            "duration_sec": duration,
        }
        self.state.actions_taken.append(action_record)
        logger.info(
            f"Agent [{self.agent_id}] executed tool [{tool_name}] in {duration}s",
            extra={"agent_id": self.agent_id, "audit_event": "TOOL_EXECUTION"},
        )
        return result

    @abstractmethod
    async def process_task(self, context: Dict[str, Any]) -> Dict[str, Any]:
        """Core execution logic implemented by specialized agent."""
        pass
