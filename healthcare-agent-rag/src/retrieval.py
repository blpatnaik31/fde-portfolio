"""
TF-IDF + cosine-similarity retriever. Deliberately not an LLM call:
retrieval over a fixed, small policy corpus is a solved, deterministic
problem, and using classical IR here means the whole pipeline runs with
zero API keys and zero external cost — a reviewer can clone this and run
it immediately with no setup.
"""
from __future__ import annotations
from dataclasses import dataclass

import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

from chunking import Chunk


@dataclass
class RetrievedChunk:
    chunk: Chunk
    score: float


class Retriever:
    def __init__(self, chunks: list[Chunk]):
        # Preamble chunks are mostly document metadata (title, doc id, category) —
        # they're kept for citation context but excluded from the retrievable pool,
        # because their short, boilerplate text was winning on TF-IDF overlap with
        # query terms like "prior authorization" without containing any actual
        # policy content. See eval/README notes on this — it was found via eval,
        # not assumed up front.
        self.chunks = [c for c in chunks if not c.chunk_id.endswith("#preamble")]
        self.vectorizer = TfidfVectorizer(stop_words="english", ngram_range=(1, 2))
        # Index on title + body, not body alone. Found via eval: a chunk's own body
        # text often doesn't repeat the document/lens/procedure name (e.g. "IOL",
        # "toric") because it's implied by context a human reader has and a
        # keyword-matching retriever doesn't — prefixing the section title back in
        # (doc name + section name) recovers that context for retrieval without
        # changing what's shown to the user.
        index_texts = [f"{c.title}\n{c.text}" for c in self.chunks]
        self._matrix = self.vectorizer.fit_transform(index_texts)

    def retrieve(self, query: str, top_k: int = 3) -> list[RetrievedChunk]:
        query_vec = self.vectorizer.transform([query])
        sims = cosine_similarity(query_vec, self._matrix)[0]
        ranked_idx = np.argsort(sims)[::-1][:top_k]
        return [RetrievedChunk(chunk=self.chunks[i], score=float(sims[i])) for i in ranked_idx if sims[i] > 0]
