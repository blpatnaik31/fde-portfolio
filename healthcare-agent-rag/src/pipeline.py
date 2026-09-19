"""
End-to-end pipeline: load policies -> chunk -> retrieve -> synthesize.
This is the single entry point both the CLI and the Flask app use, so
there's exactly one code path to trust.
"""
from __future__ import annotations
import time
from dataclasses import dataclass
from pathlib import Path

from chunking import load_and_chunk, Chunk
from retrieval import Retriever, RetrievedChunk
from generate import synthesize, Answer

POLICIES_DIR = Path(__file__).parent.parent / "data" / "policies"


@dataclass
class QueryResult:
    query: str
    answer: Answer
    retrieved: list[RetrievedChunk]
    latency_ms: float


class RagPipeline:
    def __init__(self, policies_dir: Path = POLICIES_DIR):
        self.chunks: list[Chunk] = load_and_chunk(policies_dir)
        self.retriever = Retriever(self.chunks)

    def query(self, question: str, top_k: int = 3) -> QueryResult:
        start = time.perf_counter()
        retrieved = self.retriever.retrieve(question, top_k=top_k)
        answer = synthesize(question, retrieved)
        latency_ms = (time.perf_counter() - start) * 1000
        return QueryResult(query=question, answer=answer, retrieved=retrieved, latency_ms=latency_ms)


if __name__ == "__main__":
    import sys
    pipeline = RagPipeline()
    q = " ".join(sys.argv[1:]) or "What documentation is required for a toric IOL prior authorization?"
    result = pipeline.query(q)
    print(f"Q: {result.query}\n")
    print(f"A ({result.answer.mode} mode, {result.latency_ms:.1f}ms):\n{result.answer.text}\n")
    print(f"Citations: {result.answer.citations}")
