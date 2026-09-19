---
name: status-report
description: Generate this week's status report from raw sprint/ticket data, in a fixed one-page format
---

# Skill: status-report

Given raw inputs (ticket status export, sprint board state, last week's report for continuity), produce a status report that follows this fixed structure every time, so stakeholders can scan it in under a minute:

1. **Overall status** — Green/Yellow/Red, with one line on *why*, tied to the committed date, not vibes.
2. **This week** — 2-3 bullets on what actually shipped or got resolved, not what was planned.
3. **Next week** — 2-3 bullets, only things that are actually committed.
4. **Metrics table** — whatever 2-4 numbers matter for this program, with target vs. actual vs. trend arrow.
5. **Risks & blockers** — only what changed since last week. Link out to the full RAID log rather than restating it.
6. **Decisions needed** — explicit ask, explicit owner, explicit deadline. A status report that buries a decision request in prose gets ignored.

## Rules this skill enforces

- Never mark a status Green if a risk that same week would put the committed date in question — status reflects trajectory, not sentiment.
- If a metric has no target defined yet, say so explicitly rather than omitting the row.
- Keep the whole report to one page. If it doesn't fit, the "this week" section is trying to say too much — cut, don't shrink the font.

## Output

A single Markdown document matching the structure above, ready to paste into email/Slack/Confluence without further editing.
