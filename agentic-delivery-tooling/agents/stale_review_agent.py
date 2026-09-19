"""
Stale-review hygiene agent.

Pattern: cluster the aged To Do pool (items untouched past a threshold)
by category, and propose a gated review cut — a short list a human
reviews once a week to close, reprioritize, or explicitly keep. This
turns "someone eventually notices the backlog is bloated" into a
standing, bounded weekly checkpoint.

Run: python3 stale_review_agent.py --data ../data/synthetic_backlog.json
"""
from __future__ import annotations
import argparse
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from lib import cluster_by_signature, join_stale_candidates


def propose_review_cut(data: dict, stale_after_days: int = 30) -> dict:
    todo = data["todo_pool"]
    stale = join_stale_candidates(todo, stale_after_days=stale_after_days)
    clusters = cluster_by_signature(stale, key="category")

    cut = []
    for category, items in clusters.items():
        cut.append({
            "category": category,
            "count": len(items),
            "items": [{"id": i["id"], "title": i["title"], "stale_days": i["last_touched_days_ago"]} for i in items],
        })
    return {"stale_after_days": stale_after_days, "total_flagged": len(stale), "by_category": cut}


def main():
    parser = argparse.ArgumentParser(description="Weekly stale-review hygiene agent (human-gated).")
    parser.add_argument("--data", default=str(Path(__file__).parent.parent / "data" / "synthetic_backlog.json"))
    parser.add_argument("--stale-after-days", type=int, default=30)
    args = parser.parse_args()

    data = json.loads(Path(args.data).read_text())
    result = propose_review_cut(data, stale_after_days=args.stale_after_days)

    print(f"\n=== Stale-Review Cut — {result['total_flagged']} item(s) untouched {result['stale_after_days']}+ days ===\n")
    for group in result["by_category"]:
        print(f"[{group['category']}] {group['count']} item(s):")
        for item in group["items"]:
            print(f"   - {item['id']}: {item['title']} (stale {item['stale_days']}d)")
        print()
    print("No tracker writes made. This cut is human-gated — see run_weekly_agents.py --apply.")
    return result


if __name__ == "__main__":
    main()
