# Artha.ai: from a personal finance tool to a product plan

A personal finance automation platform I built and use myself, now being planned as a product. The name (Sanskrit/Telugu, roughly "wealth" or "meaningful pursuit of resources") reflects the goal: automate the tedious parts of tracking money so the only decisions left are the ones that matter.

**Live site:** https://blpatnaik31.github.io/fde/#/projects/artha-ai

## The live tool

- **Bank transaction syncing** via Plaid across accounts, instead of manual CSV exports.
- **Receipt parsing** through an n8n workflow: receipts are captured and parsed into structured line items automatically.
- Connected to the rest of my planning stack (Notion, Gmail, Google Calendar, Google Drive), so financial data lands where my planning already lives.

## The product plan (in progress)

Budgeting apps get multi-account households wrong. They count transfers and credit-line draws as income, list the same kind of service billed on three different cards as three unrelated charges, and inherit the bank's wrong categories. The plan is a **read-only** household money app that fixes those numbers and explains every one of them.

Productization runs as a delivery program in a private repo linked to a GitHub Project: six workstreams, 65 tracked issues, architecture decision records, and a running log of steps, guardrails and missteps.

| Workstream | What it produced |
|---|---|
| Business plan | Competitive landscape, personas, discovery interview kit, bottom-up market sizing, legal checklist |
| Monetization | A live-formula unit-economics model, pricing tiers, risks, a recommendation memo |
| Security guardrails | A "never store" list, data flow and trust boundaries, a STRIDE threat model, AI guardrails, a compliance map, and a CI data guard |
| Technical design | 4 ADRs, architecture, data model, a deterministic detection engine, AI layer and evals, a full no-bank-connection (file-import) mode |
| Design library | Tokens with a contrast test in CI, foundations, 11 component specs, accessibility and content guidelines, an HTML specimen |
| Wireframes | A flow map, 16 low-fi screens across 9 flows, a usability test plan |

### Design choices

- **Never move money, never hold bank logins** or full account, card or Social Security numbers. This was decided before any architecture.
- **Deterministic first.** Transfer pairing, credit-draw exclusion, recurring-charge detection and overlap grouping are rules with reason codes. The LLM maps unknown merchants and answers questions over totals, and its output is untrusted.
- **People confirm what the AI suggests.** Nothing the model proposes changes a number until someone accepts it.
- **The bank connection is optional.** Everything works from file imports, which is also the free tier.
- **Synthetic data only.** No real transaction is in the repo. A CI guard checks for account numbers, card numbers and secrets, and its own tests document what it can't catch.

### What the planning changed

- **The first price failed the unit-economics model** once bank-connection fees were counted. The plan now prices higher, caps synced institutions, and makes the free tier import-only.
- **AI isn't the cost.** Per-merchant caching keeps categorization under a cent per user per month.
- **A rule was letting the AI skip the human.** A principles audit caught an automatic path for AI merchant mappings and closed it.
- **Exact-value scans aren't enough for privacy.** Example numbers copied from my own finances twice slipped into drafts and were caught in review before commit.

### Next

Discovery interviews and usability sessions (synthetic data only), real quotes from bank-connection providers, an outside security review, then an MVP that starts with file import.

## Status

The live tool is a personal codebase that isn't packaged for release. The product plan lives in a private repo. Happy to walk through either in depth.
