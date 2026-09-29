"""
RAG package for VitaGrid GOV AI
"""

from vitagrid_gov_ai.rag.knowledge_base import (
    SOVEREIGN_NATIONAL_PROTOCOLS,
    ProtocolDocument,
)
from vitagrid_gov_ai.rag.retriever import (
    SovereignHybridRetriever,
    RetrievedPassage,
    hybrid_retriever,
)
from vitagrid_gov_ai.rag.grounded_qa import (
    SovereignGroundedGenerator,
    GroundedAnswer,
    grounded_generator,
)

__all__ = [
    "SOVEREIGN_NATIONAL_PROTOCOLS",
    "ProtocolDocument",
    "SovereignHybridRetriever",
    "RetrievedPassage",
    "hybrid_retriever",
    "SovereignGroundedGenerator",
    "GroundedAnswer",
    "grounded_generator",
]
