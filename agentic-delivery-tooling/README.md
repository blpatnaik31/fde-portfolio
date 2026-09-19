# Agentic Delivery Tooling

A clean-room, open reconstruction of an agent pattern I designed and shipped in my current role (Product Owner, AI-platform team, Rithum Commerce) — two narrow, human-gated weekly agents that turn tedious backlog hygiene into a bounded, auditable weekly checkpoint, plus a trimmed sample of the reusable PO/PM skill pack I built alongside them.

**What "clean-room" means here:** this code, the data it runs against, and every number in the README are synthetic and generic. No employer code, proprietary data, internal system names, or real metrics appear anywhere in this repo. What's real is the *pattern* — narrow agents, shared inspectable primitives, data-grounded ranking, and a structural human gate before any write. That's the part that's mine to demonstrate; the specific numbers and systems belong to the job.

## What's here

- **`agents/`** — two weekly agents (`triage_agent.py`, `stale_review_agent.py`) plus a small shared library (`lib.py`: cluster / rank / join) and an orchestrator (`run_weekly_agents.py`) that renders one review deck and enforces the human gate.
- **`data/synthetic_backlog.json`** — fabricated defect and backlog data with fake telemetry counts, shaped like a real catalog-quality backlog but invented for this demo.
- **`docs/architecture.md`** — the design, with the reasoning behind each decision (why two agents, why the gate is structural, why telemetry breaks ties).
- **`skills/`** — 5 of the 13 reusable PO/PM skills I run day to day (status-report, sprint-plan, risk-raid, decision-ticket, backlog-refinement), written as standalone Markdown skill definitions.

## Run it

```bash
cd agents
python3 triage_agent.py                 # dry-run: auto-triage proposal only
python3 stale_review_agent.py            # dry-run: stale-review cut only
python3 run_weekly_agents.py             # both, rendered as one review deck (docs/weekly_review_deck.md)
python3 run_weekly_agents.py --apply     # same, then prompts for the human gate before "applying"
```

No dependencies beyond Python 3.9+ standard library — nothing to install.

## What it demonstrates

- **Deterministic-first design.** Clustering and ranking are plain, testable Python — not an LLM call — because this part of the problem has a correct, verifiable answer. That's a judgment call, not a default: know when *not* to reach for probabilistic control flow.
- **Auditability.** Every proposal comes with the exact rationale (which tickets, why grouped, what impact number drove the ranking) — a reviewer never has to trust a black box.
- **A real gate, not a warning label.** `--apply` alone changes nothing; a typed confirmation is required. In production this gate sits in front of a real tracker write — here it's a print statement, but the control-flow shape is identical.
- **In production, at real scale:** the version of this pattern I run made a direct, authenticated telemetry-index query the canonical sizing method for backlog candidates (replacing stale summary text and guesswork), shipped as 2 agents + 2 slash commands + this same cluster/rank/join helper set, and reduced a recurring weekly manual triage task to a single human-approval checkpoint.

## Related

[`../healthcare-agent-rag/`](../healthcare-agent-rag/) — a from-scratch agent/RAG build over synthetic healthcare claims data, the other project in this portfolio.
