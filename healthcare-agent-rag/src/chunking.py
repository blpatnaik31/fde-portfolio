"""
Simple section-aware chunker: splits each policy markdown file on its
`## Section` headers so each chunk is a coherent, citable unit rather
than an arbitrary fixed-width window that might cut a requirement in
half.
"""
from __future__ import annotations
import re
from dataclasses import dataclass
from pathlib import Path


@dataclass
class Chunk:
    chunk_id: str
    doc_id: str
    source_file: str
    title: str
    text: str


def load_and_chunk(policies_dir: str | Path) -> list[Chunk]:
    policies_dir = Path(policies_dir)
    chunks: list[Chunk] = []

    for md_file in sorted(policies_dir.glob("*.md")):
        raw = md_file.read_text()
        # Top-level doc title is the first line (# ...)
        doc_title_match = re.match(r"^#\s+(.*)", raw)
        doc_title = doc_title_match.group(1).strip() if doc_title_match else md_file.stem

        # Extract a doc id like PA-104 / REF-050 from the title if present
        doc_id_match = re.search(r"\b([A-Z]{2,3}-\d+)\b", doc_title)
        doc_id = doc_id_match.group(1) if doc_id_match else md_file.stem

        # Split on level-2 headers ("## Section N: ...")
        parts = re.split(r"\n(?=##\s)", raw)
        section_index = 0
        for part in parts:
            part = part.strip()
            if not part or part.startswith("# "):
                # This is the doc title/preamble block; keep it as chunk 0 for context.
                if part.startswith("# "):
                    chunks.append(Chunk(
                        chunk_id=f"{doc_id}#preamble",
                        doc_id=doc_id,
                        source_file=md_file.name,
                        title=f"{doc_title} — preamble",
                        text=part,
                    ))
                continue
            header_match = re.match(r"##\s+(.*)", part)
            section_title = header_match.group(1).strip() if header_match else f"section-{section_index}"
            section_index += 1
            chunks.append(Chunk(
                chunk_id=f"{doc_id}#{section_index}",
                doc_id=doc_id,
                source_file=md_file.name,
                title=f"{doc_title} — {section_title}",
                text=part,
            ))
    return chunks
