"""
Auto-triage agent.

Pattern: pull the auto-filed defect pool, cluster by root-cause signature,
rank clusters by live telemetry impact (not filer, not recency), and
propose ONE umbrella fix story per top cluster. The agent never writes to
a tracker on its own — it emits a proposal that a human approves or
rejects. That gate is the point: the agent's job is to remove the
tedious clustering/ranking work, not the judgment call.

Run: python3 triage_agent.py --data ../data/synthetic_backlog.json
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from lib import cluster_by_signature, rank_clusters_by_telemetry


def propose_umbrella_stories(data: dict, top_n: int = 3, min_cluster_size: int = 2) -> list[dict]:
    defects = data["defect_pool"]
    clusters = cluster_by_signature(defects, key="root_cause_signature")
    ranked = rank_clusters_by_telemetry(clusters, telemetry_key="telemetry_hits_7d")

    proposals = []
    for signature, total_hits, group in ranked[:top_n]:
        if len(group) < min_cluster_size:
            continue  # not worth an umbrella story if it's a single ticket
        proposals.append({
            "proposed_story": f"Fix: {signature.replace('-', ' ')}",
            "root_cause_signature": signature,
            "tickets_grouped": [g["id"] for g in group],
            "ticket_count": len(group),
            "combined_telemetry_hits_7d": total_hits,
            "rationale": (
                f"{len(group)} auto-filed defects share this root cause and account for "
                f"{total_hits} telemetry hits in the last 7 days — the highest combined "
                f"impact in this week's pool. Proposing a single umbrella fix rather than "
                f"{len(group)} separate tickets."
            ),
        })
    return proposals


def main():
    parser = argparse.ArgumentParser(description="Weekly auto-triage agent (human-gated).")
    parser.add_argument("--data", default=str(Path(__file__).parent.parent / "data" / "synthetic_backlog.json"))
    parser.add_argument("--top-n", type=int, default=3)
    args = parser.parse_args()

    data = json.loads(Path(args.data).read_text())
    proposals = propose_umbrella_stories(data, top_n=args.top_n)

    print(f"\n=== Auto-Triage Proposal — {len(proposals)} umbrella stor{'y' if len(proposals)==1 else 'ies'} ===\n")
    for i, p in enumerate(proposals, 1):
        print(f"{i}. {p['proposed_story']}")
        print(f"   Groups: {', '.join(p['tickets_grouped'])}  (impact: {p['combined_telemetry_hits_7d']} hits/7d)")
        print(f"   {p['rationale']}\n")
    print("No tracker writes made. This proposal is human-gated — see run_weekly_agents.py --apply.")
    return proposals


if __name__ == "__main__":
    main()
