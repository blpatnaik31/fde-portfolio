# Pushing this repo to GitHub

The `blpatnaik31/fde-portfolio` repo already exists on GitHub (created, empty) — but this folder itself is **not yet a git repo**: the content was copied here from the cloud build without its git history (the file-transfer tool won't write into a `.git` folder). You need to initialize git fresh here before pushing. From inside this folder, run:

```bash
git init
git add .
git commit -m "Initial FDE portfolio: agentic delivery tooling, healthcare RAG, Artha.ai writeup"
git branch -M main
git remote add origin https://github.com/blpatnaik31/fde-portfolio.git
git push -u origin main
```

Then pin the repo from your GitHub profile (Customize your pins → select it).

## Before you push — one thing worth re-checking yourself

The `agentic-delivery-tooling/` project is a clean-room reconstruction of a pattern from your current role at Rithum Commerce, built against synthetic data with no real code, metrics, or system names carried over — I ran a keyword check for known-sensitive terms (marketplace partner names, your git handle, exact PR/telemetry figures, "Rithum" itself only appears once, in the README's framing line, same as a resume would state an employer). Worth a quick read-through of that project's README yourself before it goes public, since you're closer to what your employer would consider sensitive than I am.

Delete this file once you've pushed, or keep it — it's harmless either way.
