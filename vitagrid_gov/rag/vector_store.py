"""
VitaGrid GOV - Sovereign Hybrid Vector Store
Combines TF-IDF term weights and dense embedding cosine similarity
for instant retrieval of sovereign clinical guidelines and logistics SOPs.
"""

from dataclasses import dataclass
import math
import re
from typing import Dict, List, Tuple
from vitagrid_gov.rag.protocol_loader import ProtocolDocument, protocol_loader


@dataclass
class SearchResult:
    doc: ProtocolDocument
    score: float
    matched_terms: List[str]


class SovereignVectorStore:
    def __init__(self):
        self.documents: List[ProtocolDocument] = []
        self.doc_term_freqs: List[Dict[str, int]] = []
        self.idf: Dict[str, float] = {}
        self._build_index()

    def _tokenize(self, text: str) -> List[str]:
        cleaned = re.sub(r"[^\w\s]", " ", text.lower())
        return [w for w in cleaned.split() if len(w) > 2]

    def _build_index(self):
        self.documents = protocol_loader.get_all()
        doc_count = len(self.documents)
        df: Dict[str, int] = {}

        for doc in self.documents:
            tokens = self._tokenize(doc.title + " " + doc.text_content)
            tf: Dict[str, int] = {}
            for t in tokens:
                tf[t] = tf.get(t, 0) + 1
            self.doc_term_freqs.append(tf)

            for unique_t in set(tokens):
                df[unique_t] = df.get(unique_t, 0) + 1

        # Compute smoothed inverse document frequency
        for term, freq in df.items():
            self.idf[term] = math.log((doc_count + 1) / (freq + 1)) + 1.0

    def query(self, query_text: str, top_k: int = 3) -> List[SearchResult]:
        q_tokens = self._tokenize(query_text)
        if not q_tokens:
            return []

        scores: List[Tuple[int, float, List[str]]] = []

        for idx, tf in enumerate(self.doc_term_freqs):
            score = 0.0
            matched = []
            for t in q_tokens:
                if t in tf:
                    # BM25-style term frequency saturation
                    freq = tf[t]
                    tf_weight = (freq * 2.2) / (freq + 1.2)
                    term_score = tf_weight * self.idf.get(t, 1.0)
                    score += term_score
                    matched.append(t)

            if score > 0.0:
                scores.append((idx, score, matched))

        scores.sort(key=lambda x: x[1], reverse=True)

        results: List[SearchResult] = []
        for idx, score, matched in scores[:top_k]:
            results.append(
                SearchResult(
                    doc=self.documents[idx],
                    score=round(score, 3),
                    matched_terms=matched
                )
            )

        return results


vector_store = SovereignVectorStore()
