---
name: risk-raid
description: Extract and structure risks, assumptions, issues, and dependencies from meeting notes, tickets, or free-form status updates into a maintained RAID log
---

# Skill: risk-raid

Given unstructured input (meeting transcript, status update thread, a pile of ticket comments), extract candidate RAID entries and merge them into the existing RAID log rather than starting over each time.

1. **Classify** each candidate as Risk (might happen, would hurt), Assumption (believed true, unverified), Issue (already happened), or Dependency (blocked-on or blocking).
2. **Dedupe** against existing entries — a slightly reworded restatement of an open risk is an update to that risk's notes, not a new row.
3. **Assign severity/likelihood** (for risks) or **status** (for issues/dependencies) based on what the source material actually supports — don't upgrade severity beyond what's stated.
4. **Flag ownerless entries** explicitly. An entry with no owner is a known gap, not something to silently assign to the program lead by default.

## Rules this skill enforces

- Every entry needs a next action or an explicit "monitoring, no action needed" — a RAID log entry that just sits there restating the problem isn't doing its job.
- Closed issues stay in the log with a resolution note rather than being deleted — the history of what broke and how it got fixed is often the most useful part of the log later.

## Output

An updated RAID log (Markdown table, one section per category) plus a short "what changed this pass" summary for whoever's reviewing the diff.
