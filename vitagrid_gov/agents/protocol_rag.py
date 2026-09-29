"""
VitaGrid GOV - Clinical Protocol & Document Intelligence Agent
Provides authoritative RAG access to sovereign clinical guidelines, WHO manuals,
and treatment protocols. Directly powers the AI Decision Copilot.
"""

import asyncio
import logging
from typing import Any, Dict, List
from vitagrid_gov.rag.retriever import protocol_retriever, GroundedAnswer
from vitagrid_gov.rag.protocol_loader import protocol_loader

logger = logging.getLogger("vitagrid.protocol_rag")


class ClinicalProtocolRAGAgent:
    async def answer_clinical_query(self, user_query: str) -> Dict[str, Any]:
        """
        Executes grounded clinical QA retrieval and returns authenticated statutory citations.
        """
        grounded: GroundedAnswer = protocol_retriever.answer_query(user_query)

        return {
            "query": user_query,
            "is_grounded": grounded.is_grounded,
            "answer": grounded.answer_text,
            "primary_citation": grounded.primary_citation,
            "statutory_sla_hours": grounded.statutory_sla_hours,
            "confidence_score": grounded.confidence_score,
            "referenced_protocol_ids": grounded.retrieved_protocol_ids,
        }

    async def list_available_protocols(self) -> List[Dict[str, Any]]:
        protocols = protocol_loader.get_all()
        return [
            {
                "doc_id": p.doc_id,
                "title": p.title,
                "category": p.category,
                "citation": p.citation,
                "sla_hours": p.statutory_sla_hours,
            }
            for p in protocols
        ]


protocol_rag_agent = ClinicalProtocolRAGAgent()
