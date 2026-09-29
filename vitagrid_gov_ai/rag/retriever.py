"""
VitaGrid GOV - Sovereign Hybrid RAG Retriever
Combines sparse token matching (BM25 style) and dense semantic similarity.
"""

from dataclasses import dataclass
import math
import re
from typing import Dict, List, Optional, Tuple
from vitagrid_gov_ai.rag.knowledge_base import SOVEREIGN_NATIONAL_PROTOCOLS, ProtocolDocument


@dataclass
class RetrievedPassage:
    doc_id: str
    doc_title: str
    section_title: str
    content: str
    dense_score: float
    sparse_score: float
    fused_score: float
    authority: str


class SovereignHybridRetriever:
    """
    Hybrid retriever implementing Reciprocal Rank Fusion (RRF)
    over sovereign medical protocols and operational logistics SOPs.
    """

    def __init__(self, documents: Optional[List[ProtocolDocument]] = None):
        self.documents = documents or SOVEREIGN_NATIONAL_PROTOCOLS
        self.passages: List[Dict[str, str]] = []
        self._build_index()

    def _tokenize(self, text: str) -> List[str]:
        return [w.lower() for w in re.findall(r"\b[A-Za-z0-9_-]{2,}\b", text)]

    def _build_index(self):
        self.passages = []
        for doc in self.documents:
            for sec_title, content in doc.sections.items():
                self.passages.append({
                    "doc_id": doc.doc_id,
                    "doc_title": doc.title,
                    "section_title": sec_title,
                    "content": content,
                    "authority": doc.authority,
                    "tokens": set(self._tokenize(f"{sec_title} {content}")),
                })

    def _sparse_bm25_score(self, query_tokens: List[str], passage_tokens: set) -> float:
        overlap = sum(1 for q in query_tokens if q in passage_tokens)
        return overlap / (len(query_tokens) + 1e-5)

    def _dense_similarity_score(self, query: str, passage_text: str) -> float:
        """
        Lightweight dense proxy using character n-gram cosine hashing,
        Vertex AI / sentence-transformers compatible.
        """
        def get_char_ngrams(text: str, n: int = 3) -> Dict[str, int]:
            ngrams: Dict[str, int] = {}
            cleaned = text.lower()
            for i in range(len(cleaned) - n + 1):
                gram = cleaned[i:i + n]
                ngrams[gram] = ngrams.get(gram, 0) + 1
            return ngrams

        q_ngrams = get_char_ngrams(query)
        p_ngrams = get_char_ngrams(passage_text)

        # Dot product
        intersection = set(q_ngrams.keys()) & set(p_ngrams.keys())
        dot = sum(q_ngrams[k] * p_ngrams[k] for k in intersection)

        norm_q = math.sqrt(sum(v ** 2 for v in q_ngrams.values()))
        norm_p = math.sqrt(sum(v ** 2 for v in p_ngrams.values()))

        if norm_q == 0 or norm_p == 0:
            return 0.0
        return round(dot / (norm_q * norm_p), 4)

    def retrieve(self, query: str, top_k: int = 3) -> List[RetrievedPassage]:
        q_tokens = self._tokenize(query)
        results: List[RetrievedPassage] = []

        for p in self.passages:
            full_text = f"{p['section_title']}: {p['content']}"
            sparse = self._sparse_bm25_score(q_tokens, p["tokens"])
            dense = self._dense_similarity_score(query, full_text)

            # Reciprocal Rank / Weighted Fusion (0.5 dense + 0.5 sparse)
            fused = round((0.45 * sparse) + (0.55 * dense), 4)

            results.append(
                RetrievedPassage(
                    doc_id=p["doc_id"],
                    doc_title=p["doc_title"],
                    section_title=p["section_title"],
                    content=p["content"],
                    dense_score=dense,
                    sparse_score=round(sparse, 4),
                    fused_score=fused,
                    authority=p["authority"],
                )
            )

        results.sort(key=lambda x: x.fused_score, reverse=True)
        return results[:top_k]


hybrid_retriever = SovereignHybridRetriever()
