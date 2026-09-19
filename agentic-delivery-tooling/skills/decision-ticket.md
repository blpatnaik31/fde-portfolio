---
name: decision-ticket
description: Turn a contested technical or product trade-off into a structured, durable decision record instead of a Slack thread that gets lost
---

# Skill: decision-ticket

Given a description of a contested trade-off (from a discussion, a thread, or a set of competing proposals), produce a decision record with:

1. **Context** — the situation forcing a decision, stated neutrally, without pre-loading toward one option.
2. **Options considered** — each option with its real trade-offs, including the ones nobody's championing but that were genuinely on the table.
3. **Recommendation** — the facilitated recommendation, with the reasoning that leads there, clearly separated from the options list itself.
4. **Decision** — left blank/TBD for the actual decision-maker to fill in; this skill facilitates, it doesn't decide.
5. **Reversibility** — one line on how expensive it would be to reverse this later, since that should affect how much deliberation the decision deserves.

## Rules this skill enforces

- Never collapse "options considered" down to a strawman and the recommended option — if an option only gets two words while the recommendation gets a paragraph, the record is skewed and needs rebalancing.
- The record is written to be understood by someone with zero context on the original discussion, six months later.

## Output

A single, numbered decision record (e.g. `DEC-014-<slug>.md`) ready to sit in a durable decisions folder, referenceable by ID in future tickets and discussions.
