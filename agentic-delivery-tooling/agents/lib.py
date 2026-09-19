"""
Small shared helpers used by both weekly agents: cluster, rank, join.

This mirrors a pattern I use in production — a handful of narrow,
independently-testable functions rather than one monolithic agent script —
so each step of the reasoning is inspectable and unit-testable on its own.
"""
from __future__ import annotations
from collections import defaultdict
from typing import Any


def cluster_by_signature(items: list[dict[str, Any]], key: str) -> dict[str, list[dict[str, Any]]]:
    """Group items by a shared field (e.g. root_cause_signature, category)."""
    clusters: dict[str, list[dict[str, Any]]] = defaultdict(list)
    for item in items:
        clusters[item[key]].append(item)
    return dict(clusters)


def rank_clusters_by_telemetry(clusters: dict[str, list[dict[str, Any]]], telemetry_key: str) -> list[tuple[str, int, list[dict[str, Any]]]]:
    """
    Rank clusters by total telemetry impact, descending. This is the
    'data-tiebroken' part of the pattern: when multiple tickets could be
    the week's priority, live signal breaks the tie instead of recency
    or whoever filed the loudest ticket.
    """
    ranked = []
    for sig, group in clusters.items():
        total = sum(g.get(telemetry_key, 0) for g in group)
        ranked.append((sig, total, group))
    return sorted(ranked, key=lambda r: r[1], reverse=True)


def join_stale_candidates(items: list[dict[str, Any]], stale_after_days: int, staleness_key: str = "last_touched_days_ago") -> list[dict[str, Any]]:
    """Filter + join items that have crossed the staleness threshold."""
    return [i for i in items if i.get(staleness_key, 0) >= stale_after_days]
