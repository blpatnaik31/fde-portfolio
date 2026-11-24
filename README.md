# FDE Portfolio — Lokapati "Loki" Patnaik

**Live site: [blpatnaik31.github.io/fde](https://blpatnaik31.github.io/fde/)** · Companion: [TPM portfolio](https://blpatnaik31.github.io/tpm/) · [All portfolios](https://blpatnaik31.github.io/)

Senior Product Manager / Technical Program Manager, 13+ years in healthcare IT and medical devices, currently a Product Owner on an AI-platform team. I've spent most of my career on the delivery/program side of technical builds — but I also build. This repo is three examples: two real, runnable systems and one honest writeup of a live personal project.

I care about the same things this portfolio is trying to demonstrate: deterministic-first design (don't reach for an LLM when a plain function solves the problem correctly), honest evaluation over a slick-looking demo, and a human gate that's structurally enforced, not just documented.

## Projects

| Project | What it is | Status |
|---|---|---|
| [`agentic-delivery-tooling/`](agentic-delivery-tooling/) | Clean-room reconstruction of a human-gated backlog-triage agent pattern I designed and shipped in my current role, plus a sample of the reusable PO/PM skill pack | Runnable, no dependencies beyond stdlib |
| [`healthcare-agent-rag/`](healthcare-agent-rag/) | RAG system over synthetic healthcare prior-authorization policies, with a real evaluation harness (retrieval hit@3, MRR, keyword coverage, latency, cost) — includes an honestly-documented, caught-but-unfixed failure mode | Runnable, `pip install -r requirements.txt`, no API key required |
| [`artha-ai/`](artha-ai/) | Writeup of a live personal finance automation tool (Plaid + n8n) I built and use myself | Writeup (codebase not structured for public release yet) |

## Website

The visual portfolio lives in [`site/`](site/), a dependency-free static site (no build step). Preview it locally with `cd site && python3 -m http.server 8000`.

It is published at <https://blpatnaik31.github.io/fde/>. A sync workflow in [`blpatnaik31.github.io`](https://github.com/blpatnaik31/blpatnaik31.github.io) copies `site/` from this repo's `main` branch to `/fde/` there, so a change merged here goes live automatically (hourly, or right away if the `PAGES_SYNC_TOKEN` secret is set; see `.github/workflows/notify-pages.yml`). Project content on the site is written in `site/app.js`; editing a project's README does not change the site, so update both when a project changes.

## Background

HL7/FHIR R4, EDI X12 (837/835), SQL, Rhapsody, Snowflake, Power BI, Tableau, Aha!, Jira, Confluence. PMP, CSPO, CSM. MBA (University of San Diego). The domain depth here — healthcare interoperability, payer/provider data, regulated-environment delivery — is what the `healthcare-agent-rag` project draws on directly.

For program-delivery case studies (quantified outcomes from Baxter, Gold Coast Health Plan, and others), see my companion [TPM portfolio](https://blpatnaik31.github.io/tpm/) ([source](https://github.com/blpatnaik31/tpm-portfolio)).

Contact: blpatnaik31@gmail.com · [LinkedIn](https://linkedin.com/in/lbhogela)
