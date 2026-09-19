"""
Orchestrator: runs both weekly agents, renders a single review deck
(Markdown, standing in for the slide deck the real version emits), and
enforces the human gate — nothing is "applied" to the backlog file
without an explicit --apply flag AND a typed confirmation.

This is the piece that matters most in an FDE-style build: the agent
does the tedious analysis, a human makes the call, and the system makes
it structurally impossible to skip that step by accident.

Run (dry-run / proposal only):
    python3 run_weekly_agents.py --data ../data/synthetic_backlog.json

Run (apply — will prompt for confirmation):
    python3 run_weekly_agents.py --data ../data/synthetic_backlog.json --apply
"""
from __future__ import annotations
import argparse
import json
from datetime import date
from pathlib import Path

from triage_agent import propose_umbrella_stories
from stale_review_agent import propose_review_cut


def render_deck(triage_proposals: list[dict], stale_review: dict, run_date: str) -> str:
    lines = [f"# Weekly Backlog Review — {run_date}", ""]
    lines.append("## 1. Auto-Triage Proposal (data-tiebroken)")
    lines.append("")
    if not triage_proposals:
        lines.append("_No clusters met the umbrella-story threshold this week._")
    for i, p in enumerate(triage_proposals, 1):
        lines.append(f"**{i}. {p['proposed_story']}**")
        lines.append(f"- Tickets: {', '.join(p['tickets_grouped'])}")
        lines.append(f"- Combined impact: {p['combined_telemetry_hits_7d']} telemetry hits / 7d")
        lines.append(f"- Rationale: {p['rationale']}")
        lines.append("")
    lines.append("## 2. Stale-Review Cut")
    lines.append("")
    lines.append(f"{stale_review['total_flagged']} item(s) untouched {stale_review['stale_after_days']}+ days:")
    lines.append("")
    for group in stale_review["by_category"]:
        lines.append(f"**{group['category']}** ({group['count']})")
        for item in group["items"]:
            lines.append(f"- {item['id']}: {item['title']} — stale {item['stale_days']}d")
        lines.append("")
    lines.append("---")
    lines.append("_Nothing above has been written to the backlog. Approve or edit, then re-run with `--apply`._")
    return "\n".join(lines)


def main():
    parser = argparse.ArgumentParser(description="Weekly backlog agents orchestrator (human-gated).")
    parser.add_argument("--data", default=str(Path(__file__).parent.parent / "data" / "synthetic_backlog.json"))
    parser.add_argument("--out", default=str(Path(__file__).parent.parent / "docs" / "weekly_review_deck.md"))
    parser.add_argument("--apply", action="store_true", help="After generating the deck, prompt to apply the proposals.")
    args = parser.parse_args()

    data = json.loads(Path(args.data).read_text())
    triage_proposals = propose_umbrella_stories(data)
    stale_review = propose_review_cut(data)

    run_date = date.today().isoformat()
    deck = render_deck(triage_proposals, stale_review, run_date)
    Path(args.out).write_text(deck)
    print(f"Review deck written to {args.out}\n")
    print(deck)

    if args.apply:
        print("\n--apply was set. This is the human gate: nothing is written without explicit confirmation.")
        confirm = input("Type APPLY to simulate writing these proposals to the tracker, anything else to abort: ")
        if confirm.strip() == "APPLY":
            print("Simulated: proposals would now be written to the tracker as new stories / a review batch.")
            print("(No real tracker is connected in this demo — this print statement IS the write.)")
        else:
            print("Aborted. No changes made.")
    else:
        print("\nDry run only (no --apply). Nothing was written anywhere.")


if __name__ == "__main__":
    main()
