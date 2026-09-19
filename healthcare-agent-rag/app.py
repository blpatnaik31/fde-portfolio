"""
Minimal Flask front end so a reviewer can interact with the pipeline
instead of only reading a README. No JS framework, no build step —
one route serves a form, one route answers a question.

Run: python3 app.py, then open http://localhost:5050
"""
from __future__ import annotations
import sys
from pathlib import Path

from flask import Flask, request, render_template_string

sys.path.insert(0, str(Path(__file__).parent / "src"))
from pipeline import RagPipeline  # noqa: E402

app = Flask(__name__)
pipeline = RagPipeline()

PAGE = """
<!doctype html>
<html>
<head>
<meta charset="utf-8">
<title>Healthcare Policy RAG — demo</title>
<style>
  body { font-family: -apple-system, sans-serif; max-width: 760px; margin: 40px auto; padding: 0 16px; color: #1a1a1a; }
  h1 { font-size: 1.3rem; }
  form { margin-bottom: 24px; }
  input[type=text] { width: 100%; padding: 10px; font-size: 1rem; box-sizing: border-box; }
  button { margin-top: 8px; padding: 8px 16px; font-size: 1rem; cursor: pointer; }
  .answer { background: #f6f6f6; padding: 16px; border-radius: 6px; white-space: pre-wrap; font-size: 0.92rem; }
  .meta { color: #666; font-size: 0.85rem; margin-top: 8px; }
  .citations { margin-top: 8px; }
  .citations span { display: inline-block; background: #e8e8e8; border-radius: 4px; padding: 2px 8px; margin-right: 6px; font-size: 0.8rem; }
  .examples { font-size: 0.85rem; color: #666; }
  .examples a { color: #0645ad; text-decoration: none; }
</style>
</head>
<body>
  <h1>Prior-authorization policy Q&amp;A (synthetic demo)</h1>
  <p class="meta">Answers only from the synthetic policy set in <code>data/policies/</code>. Mode: <b>{{ mode_label }}</b>.</p>
  <form method="get" action="/">
    <input type="text" name="q" placeholder="e.g. What documentation is required for a toric IOL prior authorization?" value="{{ query or '' }}">
    <button type="submit">Ask</button>
  </form>
  {% if answer %}
  <div class="answer">{{ answer }}</div>
  <div class="citations">
    {% for c in citations %}<span>{{ c }}</span>{% endfor %}
  </div>
  <p class="meta">{{ latency_ms|round(1) }}ms · mode: {{ answer_mode }}</p>
  {% endif %}
  <p class="examples">Try:
    <a href="/?q=What+documentation+is+required+for+a+toric+IOL+prior+authorization%3F">toric IOL documentation</a> ·
    <a href="/?q=What+does+denial+code+SYN-96+mean%3F">SYN-96 denial code</a> ·
    <a href="/?q=How+many+topical+medications+must+be+tried+before+MIGS+is+authorized%3F">MIGS medical therapy trial</a>
  </p>
</body>
</html>
"""


@app.route("/")
def index():
    query = request.args.get("q", "").strip()
    if not query:
        return render_template_string(PAGE, query=None, answer=None, mode_label=_mode_label())

    result = pipeline.query(query)
    return render_template_string(
        PAGE,
        query=query,
        answer=result.answer.text,
        citations=result.answer.citations,
        answer_mode=result.answer.mode,
        latency_ms=result.latency_ms,
        mode_label=_mode_label(),
    )


def _mode_label() -> str:
    import os
    return "LLM-grounded synthesis" if os.environ.get("ANTHROPIC_API_KEY") else "extractive (no API key set — set ANTHROPIC_API_KEY to enable LLM synthesis)"


if __name__ == "__main__":
    app.run(port=5050, debug=False)
