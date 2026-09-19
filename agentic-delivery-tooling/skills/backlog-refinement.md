---
name: backlog-refinement
description: Refine a raw batch of backlog candidates to Definition of Ready, grounded in whatever real signal (telemetry, data, prior tickets) is available rather than guesswork
---

# Skill: backlog-refinement

Given a batch of raw candidate stories/tickets and the team's Definition of Ready, refine each one:

1. **Restate the problem** in one or two sentences a new team member could understand without additional context.
2. **Pull grounding signal** where available — telemetry counts, prior incident tickets, usage data — rather than sizing off a gut feel. If no signal exists, say so explicitly instead of inventing a number.
3. **Write acceptance criteria** that are independently checkable (a reviewer with no other context could verify pass/fail).
4. **Estimate** against the team's existing gold-set reference stories, not in isolation.
5. **Flag gaps** — anything still needed before this can be marked Ready (a missing design, an unresolved dependency, a stakeholder sign-off).

## Rules this skill enforces

- A story doesn't reach "Ready" status with acceptance criteria still written as vague intent ("should work well") — every criterion must be a testable statement.
- Grounding data, when available, gets cited inline (e.g. "412 telemetry hits/7d, see triage run 2026-09-15") so the sizing rationale survives past the original conversation.

## Output

Each input candidate rewritten to Definition-of-Ready format, plus a short list of anything still blocking full readiness.
