---
name: sprint-plan
description: Turn a prioritized backlog and team capacity into a sprint plan with an explicit sprint goal and Done-When criteria
---

# Skill: sprint-plan

Given a ranked backlog, known team capacity (velocity history or explicit point budget), and any hard external deadlines, produce a sprint plan with:

1. **Sprint goal** — one sentence, outcome-framed ("ship X so that Y"), not a list of tickets.
2. **Done-When** — the specific, checkable condition that makes the goal true. If the goal can be hit without this condition, the condition is wrong.
3. **Committed scope** — tickets pulled in priority order until capacity is spent, with each ticket's point estimate shown so the math is auditable.
4. **Stretch scope** — clearly separated, never silently promoted into committed scope mid-sprint.
5. **Known risks to the goal** — anything already visible that could blow up the Done-When condition (a dependency not yet resolved, a spike still in progress).

## Rules this skill enforces

- Capacity is a hard budget: total committed points never exceeds the input capacity figure, no "we'll just stretch."
- Every committed ticket must already meet Definition of Ready — if it doesn't, it goes in a "needs refinement before commit" list instead of committed scope.
- The sprint goal gets tested against one question: "if we ship every committed ticket but this goal isn't true, did the sprint succeed?" If the honest answer is yes, the goal is mis-scoped.

## Output

A Markdown sprint plan in the structure above, plus a short list of any tickets that were considered but explicitly deferred, with the reason why.
