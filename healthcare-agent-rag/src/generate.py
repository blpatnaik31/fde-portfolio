"""
Answer synthesis, with an honest fallback.

If ANTHROPIC_API_KEY is set, use it to synthesize a grounded answer from
the retrieved chunks. If it isn't (the default in most review
environments — nobody should have to hand a reviewer a live API key just
to see a demo run), fall back to an extractive synthesis: return the top
passages verbatim, clearly cited, with no generative step at all.

Both paths cite sources by chunk_id. Neither path answers from anything
other than the retrieved chunks — if retrieval comes back empty, both
paths say so instead of guessing.
"""
from __future__ import annotations
import os
from dataclasses import dataclass

from retrieval import RetrievedChunk


@dataclass
class Answer:
    text: str
    citations: list[str]
    mode: str  # "llm" or "extractive"


def _extractive_answer(query: str, retrieved: list[RetrievedChunk]) -> Answer:
    if not retrieved:
        return Answer(
            text="No policy passage matched this question closely enough to answer confidently. "
                 "Rather than guess, this system is declining to answer — try rephrasing, or this may "
                 "be outside the scope of the loaded policy set.",
            citations=[],
            mode="extractive",
        )
    lines = [f"Based on {len(retrieved)} matching policy excerpt(s):", ""]
    for r in retrieved:
        lines.append(f"[{r.chunk.chunk_id}] {r.chunk.title} (match score {r.score:.2f})")
        lines.append(r.chunk.text.split("\n", 1)[-1].strip()[:600])
        lines.append("")
    return Answer(text="\n".join(lines), citations=[r.chunk.chunk_id for r in retrieved], mode="extractive")


def _llm_answer(query: str, retrieved: list[RetrievedChunk]) -> Answer:
    import anthropic  # imported lazily — only needed on this path

    client = anthropic.Anthropic()
    context = "\n\n".join(f"[{r.chunk.chunk_id}] {r.chunk.title}\n{r.chunk.text}" for r in retrieved)
    prompt = (
        "You are answering a prior-authorization policy question using ONLY the excerpts below. "
        "Cite the chunk id(s) you used in brackets, e.g. [PA-104#3]. If the excerpts don't answer "
        "the question, say so explicitly rather than guessing.\n\n"
        f"Excerpts:\n{context}\n\nQuestion: {query}"
    )
    response = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=400,
        messages=[{"role": "user", "content": prompt}],
    )
    text = response.content[0].text
    return Answer(text=text, citations=[r.chunk.chunk_id for r in retrieved], mode="llm")


def synthesize(query: str, retrieved: list[RetrievedChunk]) -> Answer:
    if os.environ.get("ANTHROPIC_API_KEY"):
        try:
            return _llm_answer(query, retrieved)
        except Exception as e:  # noqa: BLE001 — demo-grade: fall back rather than crash
            fallback = _extractive_answer(query, retrieved)
            fallback.text = f"[LLM call failed ({e}); falling back to extractive mode]\n\n" + fallback.text
            return fallback
    return _extractive_answer(query, retrieved)
