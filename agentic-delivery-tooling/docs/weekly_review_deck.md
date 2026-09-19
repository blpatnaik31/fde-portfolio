# Weekly Backlog Review — 2026-09-19

## 1. Auto-Triage Proposal (data-tiebroken)

**1. Fix: bulk import null field**
- Tickets: DEF-1001, DEF-1002, DEF-1003
- Combined impact: 1065 telemetry hits / 7d
- Rationale: 3 auto-filed defects share this root cause and account for 1065 telemetry hits in the last 7 days — the highest combined impact in this week's pool. Proposing a single umbrella fix rather than 3 separate tickets.

**2. Fix: payload timeout**
- Tickets: DEF-1010, DEF-1011
- Combined impact: 364 telemetry hits / 7d
- Rationale: 2 auto-filed defects share this root cause and account for 364 telemetry hits in the last 7 days — the highest combined impact in this week's pool. Proposing a single umbrella fix rather than 2 separate tickets.

**3. Fix: cache invalidation delay**
- Tickets: DEF-1030, DEF-1031
- Combined impact: 115 telemetry hits / 7d
- Rationale: 2 auto-filed defects share this root cause and account for 115 telemetry hits in the last 7 days — the highest combined impact in this week's pool. Proposing a single umbrella fix rather than 2 separate tickets.

## 2. Stale-Review Cut

5 item(s) untouched 30+ days:

**catalog-quality** (2)
- STORY-201: Add bulk re-map action for category mismatches — stale 39d
- STORY-202: Support secondary category assignment — stale 55d

**reliability** (1)
- STORY-210: Add retry-with-backoff to import worker — stale 30d

**research** (2)
- STORY-230: Investigate: alternate attribute-schema spike — stale 88d
- STORY-231: Investigate: alternate attribute-schema spike (v2) — stale 47d

---
_Nothing above has been written to the backlog. Approve or edit, then re-run with `--apply`._