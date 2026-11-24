const REPO = "https://github.com/blpatnaik31/fde-portfolio/tree/main";

const projects = [
  {
    slug: "agentic-delivery-tooling",
    number: "01",
    title: "Human-gated backlog triage agents",
    kicker: "Agentic delivery tooling",
    summary: "A clean-room rebuild of an agent pattern I designed and shipped as a Product Owner on an AI-platform team: two narrow weekly agents that turn backlog hygiene into one auditable approval checkpoint.",
    headline: "1 weekly human checkpoint",
    status: "Runnable · Python 3.9+ stdlib only",
    tags: ["Agents", "Human-in-the-loop", "Deterministic first", "Python"],
    filters: ["Agents"],
    problem: "Backlog triage is tedious, recurring, and easy to get wrong in the same way every week: duplicate auto-filed defects pile up, priority follows whoever complained last, and stories go stale without anyone noticing. The work needed to be automated without handing write access to a black box.",
    approach: [
      "Split the job into two narrow agents (triage and stale-review) so each has one failure mode that can be tested and tuned on its own.",
      "Put clustering, ranking, and joining in a small shared library of plain, unit-testable functions, so every proposal carries the exact tickets, grouping reason, and impact number behind it.",
      "Ranked clusters on telemetry hit counts instead of recency or filer, so 'why this and not that' is answered with a number.",
      "Made the human gate structural: every run prints a full proposal, and nothing is applied without --apply plus a typed confirmation. No flag skips both.",
    ],
    diagram: {
      label: "Weekly agent run, from synthetic backlog to a gated tracker write",
      stages: [
        { step: "Input", nodes: [{ kind: "data", title: "Synthetic backlog", detail: "Defect and To-Do pools with fake telemetry counts" }] },
        { step: "Agents", nodes: [
          { kind: "code", title: "Triage agent", detail: "Cluster duplicates, rank by combined telemetry" },
          { kind: "code", title: "Stale-review agent", detail: "Cluster and join items untouched 30+ days" },
        ], note: "Both share lib.py: small, unit-tested cluster · rank · join functions" },
        { step: "Review", nodes: [{ kind: "output", title: "Orchestrator", detail: "Renders one Markdown review deck with the rationale for every proposal" }] },
        { step: "Gate", nodes: [{ kind: "human", title: "Human approval", detail: "--apply plus a typed confirmation. No flag skips both." }] },
        { step: "Write", nodes: [{ kind: "external", title: "Tracker write", detail: "Simulated here; a real tracker write in production" }] },
      ],
      caption: "Every run prints the full proposal. Nothing is written until a person types the confirmation.",
    },
    run: `cd agents
python3 triage_agent.py              # dry-run triage proposal
python3 stale_review_agent.py        # dry-run stale-review cut
python3 run_weekly_agents.py         # both, rendered as one review deck
python3 run_weekly_agents.py --apply # then prompts for the human gate`,
    sample: [
      ["1", "Fix: bulk import null field", "DEF-1001, 1002, 1003", "1,065"],
      ["2", "Fix: payload timeout", "DEF-1010, 1011", "364"],
      ["3", "Fix: cache invalidation delay", "DEF-1030, 1031", "115"],
    ],
    outcomes: [
      ["2", "narrow agents, each independently testable"],
      ["5", "of 13 reusable PO/PM skills published"],
      ["0", "writes without a typed human confirmation"],
      ["0", "third-party dependencies"],
    ],
    production: "In production, the same pattern made a direct, authenticated telemetry-index query the canonical sizing method for backlog candidates, shipped as 2 agents, 2 slash commands, and this cluster/rank/join helper set, and reduced a recurring weekly manual triage task to a single human-approval checkpoint. The code, data, and numbers here are synthetic; no employer code or metrics are included.",
    skills: ["status-report", "sprint-plan", "risk-raid", "decision-ticket", "backlog-refinement"],
  },
  {
    slug: "healthcare-agent-rag",
    number: "02",
    title: "Prior-authorization policy RAG with a real eval harness",
    kicker: "Healthcare agent RAG",
    summary: "Cited Q&A over synthetic payer prior-authorization policies for ophthalmology, measured on retrieval hit@3, MRR, keyword coverage, latency, and cost, including a failure the eval caught that is still documented, not hidden.",
    headline: "100% retrieval hit@3",
    status: "Runnable · no API key required",
    tags: ["RAG", "Evaluation", "Healthcare", "Flask"],
    filters: ["RAG", "Healthcare"],
    problem: "A provider's office or claims team needs a fast, cited answer to 'what does policy X require for procedure Y' without reading five PDFs, and needs the system to say 'I don't know' rather than invent a criterion that isn't in the policy.",
    approach: [
      "Section-aware chunking over four synthetic policies: cataract/IOL, diabetic retinopathy screening, glaucoma/MIGS, and a claim-denial-code reference.",
      "Classical TF-IDF retrieval with cosine similarity: deterministic, zero-cost, sub-millisecond, and runnable by any reviewer with no setup.",
      "Two honest generation paths: Claude synthesizes a grounded, cited answer when ANTHROPIC_API_KEY is set; otherwise top passages are returned verbatim and cited. Neither answers from outside the retrieved passages.",
      "Twelve hand-written eval questions, each with a known source chunk and expected keywords, run against the full pipeline.",
    ],
    diagram: {
      label: "RAG pipeline from policy documents through retrieval and generation to the UI, CLI and eval harness",
      stages: [
        { step: "Corpus", nodes: [{ kind: "data", title: "Policy documents", detail: "4 synthetic prior-auth policies in Markdown" }] },
        { step: "Chunk", nodes: [{ kind: "code", title: "Section-aware chunking", detail: "Title + body indexed together; preamble chunks excluded" }] },
        { step: "Retrieve", nodes: [{ kind: "code", title: "TF-IDF + cosine", detail: "Deterministic, zero cost, sub-millisecond" }] },
        { step: "Generate", nodes: [
          { kind: "llm", title: "Claude synthesis", detail: "Used when ANTHROPIC_API_KEY is set; grounded and cited" },
          { kind: "code", title: "Extractive answer", detail: "Default: top passages verbatim, cited" },
        ], note: "Either path answers only from retrieved passages, and says \"I don't know\" when nothing matches" },
        { step: "Use", nodes: [
          { kind: "output", title: "Flask UI", detail: "localhost:5050" },
          { kind: "output", title: "CLI", detail: "src/pipeline.py" },
          { kind: "output", title: "Eval harness", detail: "12 questions · hit@3 · MRR · coverage" },
        ] },
      ],
      caption: "Classical retrieval keeps the system runnable with no key; the LLM is an optional upgrade, not a dependency.",
    },
    run: `pip install -r requirements.txt
python3 src/pipeline.py "What documentation is required for a toric IOL prior authorization?"
python3 eval/run_eval.py
python3 app.py   # http://localhost:5050`,
    outcomes: [
      ["1.00", "retrieval hit@3 across 12 questions"],
      ["0.861", "mean reciprocal rank"],
      ["91.7%", "average expected-keyword coverage"],
      ["0.68 ms", "average latency · $0 per query"],
    ],
    lessons: [
      ["Preamble chunks won on keyword overlap.", "The top result for the toric IOL question was a document's metadata preamble. Fix: exclude preamble chunks from the retrievable pool."],
      ["The right chunk never said 'IOL'.", "A different document's documentation section still outranked the correct one, because that context lived only in the title. Fix: index title + body (contextual chunk headers), added because the eval surfaced it."],
      ["Q10 is a known, unfixed miss.", "Retrieval finds the right passage for denial code SYN-197, but 600-character truncation cuts the table before that row. Root cause is understood (table-aware truncation is the fix) and left visible on purpose."],
    ],
    evalRows: [
      ["Q1", "Documentation required for a toric IOL prior auth", "1.00", "100%"],
      ["Q2", "Screening frequency for mild NPDR", "0.50", "100%"],
      ["Q3", "CPT code for cataract extraction with IOL", "1.00", "100%"],
      ["Q4", "Medication trial required before MIGS", "1.00", "100%"],
      ["Q5", "Meaning of denial code SYN-96", "1.00", "100%"],
      ["Q6", "Minimum corneal astigmatism for a toric IOL", "1.00", "100%"],
      ["Q7", "Prior auth for routine annual DR screening", "0.50", "100%"],
      ["Q8", "Tests needed before MIGS, and how recent", "0.33", "100%"],
      ["Q9", "Most common paperwork denial for premium IOL", "1.00", "100%"],
      ["Q10", "What to do about denial code SYN-197", "1.00", "0%"],
      ["Q11", "MIGS as a standalone procedure", "1.00", "100%"],
      ["Q12", "Modifier for bilateral surgery on separate dates", "1.00", "100%"],
    ],
    next: [
      "Embedding retriever plus a cross-encoder reranker, with this eval set as the regression check.",
      "Table-aware truncation to close the Q10 miss.",
      "Chunking and retrieval tuning validated at real corpus scale (this set is 4 documents, 15 retrievable chunks).",
    ],
  },
  {
    slug: "artha-ai",
    number: "03",
    title: "Artha.ai: personal finance automation I run every day",
    kicker: "Live personal project",
    summary: "Plaid bank syncing and an n8n receipt-parsing workflow, wired into the rest of my planning stack and running continuously on my own money.",
    headline: "Live, used daily",
    status: "Writeup · code not yet packaged for release",
    tags: ["Automation", "Plaid", "n8n", "Integrations"],
    filters: ["Automation"],
    problem: "Tracking money by hand means CSV exports, retyped receipts, and data stuck in a siloed app. The goal was to automate the routine parts so the only decisions left are the ones that matter. The name comes from the Sanskrit for wealth, or the meaningful pursuit of resources.",
    approach: [
      "Bank transactions sync across accounts through Plaid instead of manual exports.",
      "Receipts arriving as photos or email run through an n8n workflow (capture, parse, structure) with no human in the loop for the routine case.",
      "Structured data lands in Notion alongside Gmail, Google Calendar, and Google Drive, where the rest of my planning already lives.",
    ],
    diagram: {
      label: "Two ingestion paths, Plaid bank sync and n8n receipt parsing, feeding one structured store and Notion",
      stages: [
        { step: "Sources", nodes: [
          { kind: "external", title: "Bank accounts", detail: "Synced automatically through Plaid" },
          { kind: "external", title: "Receipts", detail: "Photos or email" },
        ] },
        { step: "Ingest", nodes: [
          { kind: "code", title: "Transaction sync", detail: "No manual CSV exports" },
          { kind: "code", title: "n8n workflow", detail: "Capture → parse → structure" },
        ] },
        { step: "Store", nodes: [{ kind: "data", title: "Structured store", detail: "One place for transactions and line items" }] },
        { step: "Use", nodes: [{ kind: "output", title: "Notion and reporting", detail: "Next to Gmail, Calendar and Drive planning" }] },
      ],
      caption: "The routine case runs with no human in the loop; my time goes to the decisions.",
    },
    outcomes: [
      ["2", "ingestion paths: bank sync and receipts"],
      ["0", "manual CSV exports"],
      ["4", "connected tools in the planning stack"],
      ["Daily", "real use, not a one-time demo"],
    ],
    why: "It is the same forward-deployed pattern outside of work: a real problem I feel personally, a bank data API, a workflow engine, and a document-parsing step, running continuously instead of abandoned after the demo worked once. Happy to walk through the implementation live.",
  },
];

const principles = [
  ["Deterministic first", "Clustering, ranking, and retrieval are plain functions when the problem has a verifiable answer. An LLM is a tool for the parts that need one, not the default control flow."],
  ["Honest evaluation", "Ship the eval with the system, report the misses, and fix what the eval surfaces instead of what I assumed up front."],
  ["A structural human gate", "Proposals are free; writes are not. The gate is in the control flow, not in a warning label."],
  ["Auditable output", "Every proposal carries the tickets, grouping reason, and number behind it, so a reviewer never has to trust a black box."],
  ["Domain depth", "13+ years in healthcare IT, HL7/FHIR, payer and provider data, and regulated delivery shape what I build and how I test it."],
];

const main = document.querySelector("#main-content");
const nav = document.querySelector("#site-nav");
document.querySelector("#current-year").textContent = new Date().getFullYear();

const tagList = (tags) => `<div class="tag-list">${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</div>`;
const code = (text) => `<pre class="code-block"><code>${text.replace(/&/g, "&amp;").replace(/</g, "&lt;")}</code></pre>`;

const KINDS = {
  data: { label: "Data", icon: '<ellipse cx="12" cy="6" rx="7" ry="3"/><path d="M5 6v12c0 1.7 3.1 3 7 3s7-1.3 7-3V6"/><path d="M5 12c0 1.7 3.1 3 7 3s7-1.3 7-3"/>' },
  code: { label: "Deterministic code", icon: '<path d="m8 8-4 4 4 4"/><path d="m16 8 4 4-4 4"/><path d="m14 5-4 14"/>' },
  llm: { label: "LLM (optional)", icon: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4"/><path d="m12 8 1.5 2.5L16 12l-2.5 1.5L12 16l-1.5-2.5L8 12l2.5-1.5Z"/>' },
  human: { label: "Human decision", icon: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c.8-3.6 3.6-5.5 7-5.5s6.2 1.9 7 5.5"/>' },
  output: { label: "Output", icon: '<rect x="4" y="4" width="16" height="16" rx="2"/><path d="M8 9h8M8 13h8M8 17h5"/>' },
  external: { label: "External system", icon: '<path d="M14 4h6v6"/><path d="m20 4-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>' },
};
const kindIcon = (kind) => `<svg class="dg-icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">${KINDS[kind].icon}</svg>`;

function diagram(d) {
  const used = [...new Set(d.stages.flatMap((st) => st.nodes.map((n) => n.kind)))];
  const stages = d.stages.map((st, i) => `<li class="dg-stage">
      <span class="dg-step"><span class="dg-step-num">${String(i + 1).padStart(2, "0")}</span>${st.step}</span>
      <div class="dg-body">
        <ul class="dg-nodes" data-count="${st.nodes.length}">${st.nodes.map((n) => `<li class="dg-node dg-${n.kind}">
          <span class="dg-kind">${kindIcon(n.kind)}${KINDS[n.kind].label}</span>
          <strong>${n.title}</strong><span class="dg-detail">${n.detail}</span>
        </li>`).join("")}</ul>
        ${st.note ? `<p class="dg-note">${st.note}</p>` : ""}
      </div>
    </li>`).join("");
  return `<figure class="diagram">
    <ol class="dg-flow" aria-label="${d.label}">${stages}</ol>
    <figcaption><span class="dg-legend" aria-hidden="true">${used.map((k) => `<span class="dg-legend-item dg-${k}">${kindIcon(k)}${KINDS[k].label}</span>`).join("")}</span><span>${d.caption}</span></figcaption>
  </figure>`;
}

function projectCard(item) {
  return `<a class="work-card" href="#/projects/${item.slug}" data-case-card data-tags="${item.filters.join("|")}">
    <div class="card-top">
      <span class="card-index">${item.number} / 0${projects.length}</span>
      <h3>${item.title}</h3>
      <span class="card-company">${item.kicker} · ${item.status}</span>
    </div>
    <div class="card-bottom">
      <p class="card-result"><strong>${item.headline}</strong>${item.summary}</p>
      ${tagList(item.tags.slice(0, 2))}
    </div>
  </a>`;
}

function metrics() {
  return `<div class="metrics-grid">
    <div class="metric"><span class="metric-value">1.00</span><span class="metric-label">retrieval hit@3 on the healthcare RAG eval</span></div>
    <div class="metric"><span class="metric-value">0.861</span><span class="metric-label">mean reciprocal rank across 12 questions</span></div>
    <div class="metric"><span class="metric-value">$0</span><span class="metric-label">per query in the default, no-key mode</span></div>
    <div class="metric"><span class="metric-value">13+</span><span class="metric-label">years in healthcare IT and medical devices</span></div>
  </div>`;
}

function principleGrid() {
  return `<div class="process-grid">${principles.map(([title, body], i) => `<div class="process-step"><span class="process-number">0${i + 1}</span><h3>${title}</h3><p>${body}</p></div>`).join("")}</div>`;
}

function renderHome() {
  main.innerHTML = `<section class="hero"><div class="container hero-grid">
    <div>
      <span class="eyebrow">Product Owner · AI platform · Builder</span>
      <h1>I lead technical programs, and I <em>build</em> the systems too.</h1>
      <p class="lede">Runnable agent and RAG projects from a healthcare IT program leader: deterministic where the answer is verifiable, evaluated honestly, and gated by a human before anything writes.</p>
      <div class="hero-actions"><a class="button button-primary" href="#/projects">Explore the projects <span aria-hidden="true">↗</span></a><a class="button button-quiet" href="#/principles">How I build <span aria-hidden="true">↓</span></a></div>
    </div>
    <aside class="hero-aside"><p>Know when not to reach for a probabilistic tool. Show the miss the eval caught. Never let an agent write without a person saying yes.</p><span class="signature-line"></span><span class="signature-label">Agents · RAG · Evaluation · Healthcare</span></aside>
  </div></section>
  <section class="section"><div class="container">${metrics()}</div></section>
  <section class="section"><div class="container">
    <div class="section-heading"><div><span class="eyebrow">Projects</span><h2>Two runnable systems and one live tool.</h2></div><p>Each one runs on a laptop with no secrets, or is a tool I use every day.</p></div>
    <div class="work-grid">${projects.map(projectCard).join("")}</div>
  </div></section>
  <section class="section"><div class="container">
    <div class="section-heading"><div><span class="eyebrow">Principles</span><h2>What these builds are meant to prove.</h2></div><p>The same judgment calls a forward-deployed engineer makes with a customer, applied to my own work.</p></div>
    ${principleGrid()}
  </div></section>`;
}

function renderProjects() {
  main.innerHTML = `<section class="page-hero"><div class="container"><span class="eyebrow">Projects</span><h1>Builds you can run, read, and question.</h1><p class="lede">Agents with a structural human gate, a healthcare RAG system with a real eval harness, and a personal automation stack in daily use.</p></div></section>
  <section class="section"><div class="container"><div class="filter-row" aria-label="Filter projects"><button class="filter-button" type="button" aria-pressed="true" data-filter="All">All projects</button>${["Agents", "RAG", "Healthcare", "Automation"].map((filter) => `<button class="filter-button" type="button" aria-pressed="false" data-filter="${filter}">${filter}</button>`).join("")}</div><div class="work-grid">${projects.map(projectCard).join("")}</div></div></section>`;
  document.querySelectorAll("[data-filter]").forEach((button) => button.addEventListener("click", () => {
    const filter = button.dataset.filter;
    document.querySelectorAll("[data-filter]").forEach((item) => item.setAttribute("aria-pressed", item === button ? "true" : "false"));
    document.querySelectorAll("[data-case-card]").forEach((card) => {
      card.hidden = filter !== "All" && !card.dataset.tags.split("|").includes(filter);
    });
  }));
}

function projectExtras(item) {
  let html = "";
  if (item.sample) {
    html += `<section class="detail-section"><h2>Sample output</h2><p>From the generated weekly review deck: auto-filed defects clustered by root cause and ranked by combined telemetry impact.</p><div class="skills-table-wrap"><table class="skills-table eval-table"><thead><tr><th>#</th><th>Proposed umbrella fix</th><th>Tickets</th><th>Hits / 7d</th></tr></thead><tbody>${item.sample.map(([n, fix, t, hits]) => `<tr><td>${n}</td><td>${fix}</td><td>${t}</td><td class="num">${hits}</td></tr>`).join("")}</tbody></table></div></section>`;
  }
  if (item.lessons) {
    html += `<section class="detail-section"><h2>What the eval caught</h2><ol class="lesson-list">${item.lessons.map(([title, body]) => `<li><strong>${title}</strong> ${body}</li>`).join("")}</ol></section>`;
    html += `<section class="detail-section"><h2>Per-question results</h2><div class="skills-table-wrap"><table class="skills-table eval-table"><thead><tr><th>ID</th><th>Question</th><th>Reciprocal rank</th><th>Keyword coverage</th></tr></thead><tbody>${item.evalRows.map(([id, q, rr, kw]) => `<tr><td>${id}</td><td>${q}</td><td class="num">${rr}</td><td class="num${kw === "0%" ? " miss" : ""}">${kw}</td></tr>`).join("")}</tbody></table></div><p style="font-size:0.78rem;color:var(--ink-faint);margin-top:0.9rem">Extractive mode, no API key set. All policy documents are synthetic, written for this demo.</p></section>`;
  }
  if (item.next) html += `<section class="detail-section"><h2>What I'd harden next</h2><ul>${item.next.map((n) => `<li>${n}</li>`).join("")}</ul></section>`;
  if (item.production) html += `<section class="detail-section"><h2>In production</h2><div class="scope-note"><strong>Clean-room reconstruction.</strong><br>${item.production}</div></section>`;
  if (item.skills) html += `<section class="detail-section"><h2>Skill pack sample</h2><p>Five of the 13 reusable PO/PM skills I run day to day, written as standalone Markdown skill definitions.</p>${tagList(item.skills)}</section>`;
  if (item.why) html += `<section class="detail-section"><h2>Why it's here</h2><p>${item.why}</p></section>`;
  return html;
}

function renderProject(slug) {
  const item = projects.find((p) => p.slug === slug);
  if (!item) return renderNotFound();
  main.innerHTML = `<section class="detail-hero"><div class="container"><span class="eyebrow">${item.kicker} · Project ${item.number}</span><h1>${item.title}</h1><p class="lede">${item.summary}</p><div class="detail-meta"><div class="meta-item"><small>Status</small><span>${item.status}</span></div><div class="meta-item"><small>Stack</small><span>${item.tags.join(" · ")}</span></div><div class="meta-item"><small>Source</small><span><a href="${REPO}/${item.slug}" target="_blank" rel="noreferrer">GitHub ↗</a></span></div></div></div></section>
  <div class="container detail-layout"><article class="detail-content">
    <section class="detail-section"><h2>The problem</h2><p>${item.problem}</p></section>
    <section class="detail-section"><h2>Architecture</h2>${diagram(item.diagram)}</section>
    <section class="detail-section"><h2>The approach</h2><ul>${item.approach.map((step) => `<li>${step}</li>`).join("")}</ul></section>
    <section class="detail-section"><h2>By the numbers</h2><div class="outcomes-grid">${item.outcomes.map(([value, label]) => `<div class="outcome-card"><span class="outcome-value">${value}</span><span class="outcome-label">${label}</span></div>`).join("")}</div></section>
    ${projectExtras(item)}
    ${item.run ? `<section class="detail-section"><h2>Run it</h2>${code(item.run)}<div class="button-row"><a class="button button-primary" href="${REPO}/${item.slug}" target="_blank" rel="noreferrer">View source on GitHub <span aria-hidden="true">↗</span></a></div></section>` : ""}
  </article><aside class="detail-sidebar"><div class="side-label">More projects</div><div class="side-list">${projects.filter((o) => o.slug !== item.slug).map((o) => `<a href="#/projects/${o.slug}">${o.number} · ${o.kicker}</a>`).join("")}</div><div class="side-label">Companion portfolios</div><div class="side-list"><a href="https://blpatnaik31.github.io/tpm/">TPM: delivery outcomes →</a><a href="https://blpatnaik31.github.io/arch/">Architecture: design decisions →</a></div></aside></div>`;
}

function renderPrinciples() {
  main.innerHTML = `<section class="page-hero"><div class="container"><span class="eyebrow">Principles</span><h1>The judgment calls behind the code.</h1><p class="lede">A slick demo is easy. These are the choices that make a system something a customer can trust in production.</p></div></section>
  <section class="section"><div class="container">${principleGrid()}</div></section>`;
}

function renderAbout() {
  main.innerHTML = `<section class="page-hero"><div class="container"><span class="eyebrow">About</span><h1>Program leader by training. Builder by habit.</h1><p class="lede">Senior Product Manager and Technical Program Manager with 13+ years in healthcare IT and medical devices, now a Product Owner on an AI-platform team.</p></div></section>
  <section class="section"><div class="container about-grid"><div><span class="eyebrow">Background</span><h2>Most of my career has been on the delivery side of technical builds. I also build.</h2><p>The domain depth here (healthcare interoperability, payer and provider data, regulated delivery) is what the healthcare RAG project draws on directly. For quantified program-delivery case studies from Baxter, Gold Coast Health Plan, and Alcon, see the companion TPM portfolio.</p><div class="credential-list"><span class="credential">PMP</span><span class="credential">CSPO</span><span class="credential">CSM</span><span class="credential">MBA · University of San Diego</span></div><div class="button-row"><a class="button button-primary" href="mailto:blpatnaik31@gmail.com">Get in touch <span aria-hidden="true">↗</span></a><a class="button" href="https://blpatnaik31.github.io/tpm/">TPM portfolio <span aria-hidden="true">→</span></a></div></div><div><span class="eyebrow">Toolkit</span><h2>What I work with.</h2>${tagList(["Python", "Claude API", "RAG / TF-IDF", "Flask", "n8n", "Plaid", "HL7 / FHIR R4", "EDI X12 837/835", "SQL", "Rhapsody", "Snowflake", "Power BI", "Tableau", "Jira", "Confluence", "Aha!"])}</div></div></section>`;
}

function renderNotFound() {
  main.innerHTML = `<section class="not-found container"><span class="eyebrow">404</span><h1>No chunk matched that query.</h1><p class="lede" style="margin-inline:auto">Rather than invent an answer, here is the way back.</p><div class="button-row" style="justify-content:center"><a class="button button-primary" href="#/">Return home</a></div></section>`;
}

function updateNav(page) {
  document.querySelectorAll("[data-nav-link]").forEach((link) => {
    if (link.getAttribute("href") === `#/${page}`) link.setAttribute("aria-current", "page");
    else link.removeAttribute("aria-current");
  });
}

function render() {
  const parts = (window.location.hash.replace(/^#/, "") || "/").split("/").filter(Boolean);
  updateNav(parts[0] || "");
  if (parts[0] === "projects" && parts[1]) renderProject(parts[1]);
  else if (parts[0] === "projects") renderProjects();
  else if (parts[0] === "principles") renderPrinciples();
  else if (parts[0] === "about") renderAbout();
  else if (parts.length === 0) renderHome();
  else renderNotFound();
  main.focus({ preventScroll: true });
  window.scrollTo(0, 0);
  nav.classList.remove("is-open");
  document.querySelector(".menu-toggle")?.setAttribute("aria-expanded", "false");
}

document.querySelector(".menu-toggle").addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  document.querySelector(".menu-toggle").setAttribute("aria-expanded", String(open));
});
window.addEventListener("hashchange", render);
render();
