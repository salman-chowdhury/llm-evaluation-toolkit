# LLM Evaluation Toolkit

A lightweight, provider-agnostic toolkit for evaluating retrieval-augmented generation and LLM applications with reproducible, inspectable metrics.

## Why this project exists

Many portfolio AI projects stop at “the model produced an answer.” This toolkit makes quality measurable by evaluating retrieval, grounding, answer coverage, latency and cost from structured JSONL experiment records.

It is designed to work without paid APIs. Any system can write evaluation records, and the toolkit calculates deterministic metrics and produces Markdown/JSON reports in CI.

## Metrics

- Retrieval precision@k
- Retrieval recall@k
- Mean reciprocal rank
- Answer-token coverage against a reference answer
- Citation/source coverage
- Grounding overlap between the answer and retrieved evidence
- Unsupported-token ratio
- Latency percentiles
- Estimated cost aggregation

These lexical metrics are intentionally transparent baselines. They do not replace human review or model-based judging, but they provide a stable foundation for comparing system changes.

## Input format

Each JSONL row represents one evaluated request:

```json
{
  "id": "q1",
  "question": "What is retrieval-augmented generation?",
  "reference_answer": "RAG retrieves relevant evidence before generation.",
  "answer": "RAG retrieves evidence before generating an answer [doc-1].",
  "relevant_document_ids": ["doc-1"],
  "retrieved_documents": [
    {"id": "doc-1", "text": "RAG retrieves relevant evidence before generation."},
    {"id": "doc-2", "text": "Unrelated material."}
  ],
  "cited_document_ids": ["doc-1"],
  "latency_ms": 420,
  "estimated_cost_usd": 0.0012
}
```

## Usage

```bash
python -m venv .venv
source .venv/bin/activate
pip install -e '.[dev]'
llm-eval evaluate examples/sample.jsonl --output-dir reports/sample
```

Outputs:

- `summary.json`
- `report.md`
- `records.json`

## Development

```bash
ruff check .
pytest -q
llm-eval evaluate examples/sample.jsonl --output-dir reports/sample
```

## Portfolio value

This project demonstrates:

- evaluation design rather than model-demo-only work
- typed Python packaging and CLI development
- reproducible experiment records
- deterministic tests and CI
- awareness of metric limitations and failure analysis

## Planned extensions

- semantic similarity using optional local embeddings
- claim-level citation validation
- configurable LLM-as-judge adapters
- bootstrap confidence intervals
- experiment comparison and regression thresholds
- OpenTelemetry trace ingestion
