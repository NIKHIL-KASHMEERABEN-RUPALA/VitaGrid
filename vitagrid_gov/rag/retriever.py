"""
VitaGrid GOV - Sovereign RAG Retriever & Grounded QA Engine
Strictly validates queries against sovereign medical protocols.
Refuses ungrounded clinical recommendations and quotes statutory guidelines with citations.
"""

from dataclasses import dataclass
from typing import Dict, List, Optional
from vitagrid_gov.rag.vector_store import vector_store, SearchResult


@dataclass
class GroundedAnswer:
    query: str
    is_grounded: bool
    answer_text: str
    primary_citation: Optional[str]
    statutory_sla_hours: Optional[int]
    confidence_score: float
    retrieved_protocol_ids: List[str]


class SovereignProtocolRetriever:
    MIN_CONFIDENCE_THRESHOLD = 1.2

    def answer_query(self, query: str) -> GroundedAnswer:
        """
        Retrieves relevant protocols and constructs an authenticated, cited response.
        If confidence is below threshold, strictly refuses ungrounded medical claims.
        """
        results: List[SearchResult] = vector_store.query(query, top_k=2)

        if not results or results[0].score < self.MIN_CONFIDENCE_THRESHOLD:
            return GroundedAnswer(
                query=query,
                is_grounded=False,
                answer_text=(
                    "REFUSAL: The query cannot be grounded in sovereign clinical protocols "
                    "or WHO Emergency Guidelines currently ingested in this enclave. "
                    "In accordance with FIPS 140-3 safety guardrails, ungrounded medical claims "
                    "or off-formulary recommendations cannot be inferred autonomously."
                ),
                primary_citation=None,
                statutory_sla_hours=None,
                confidence_score=0.0,
                retrieved_protocol_ids=[]
            )

        top_match = results[0]
        doc = top_match.doc

        answer = (
            f"According to {doc.citation} ('{doc.title}'):\n\n"
            f"{doc.text_content}\n\n"
            f"Statutory Response SLA: Mandatory intervention within {doc.statutory_sla_hours} hours."
        )

        return GroundedAnswer(
            query=query,
            is_grounded=True,
            answer_text=answer,
            primary_citation=doc.citation,
            statutory_sla_hours=doc.statutory_sla_hours,
            confidence_score=top_match.score,
            retrieved_protocol_ids=[r.doc.doc_id for r in results]
        )


protocol_retriever = SovereignProtocolRetriever()
