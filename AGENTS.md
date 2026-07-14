# AI Contributor Handoff

## Purpose

This repository provides provider-agnostic, inspectable baseline evaluation for RAG and LLM applications.

## Start here

1. Read `README.md` and `docs/case-study.md`.
2. Install with `pip install -e '.[dev]'`.
3. Run `ruff check .`, `pytest -q`, and the sample CLI evaluation before pushing.

## Current highest-priority work

1. Merge the current implementation only after the required independent approval.
2. Add experiment comparison and configurable regression thresholds.
3. Add bootstrap confidence intervals for aggregate metrics.
4. Add optional semantic metrics without making paid providers mandatory.
5. Add claim-level citation checking and explicit abstention/refusal analysis.
6. Support OpenTelemetry or structured trace import while preserving the JSONL contract.
7. Keep a small safe sample dataset and avoid committing private prompts or documents.

## Metric rules

- Lexical overlap is a transparent baseline, not semantic correctness.
- Citation coverage by identifier is not claim-level entailment.
- Zero tokens or cost means unavailable telemetry unless explicitly documented otherwise.
- Model-as-judge results must record provider, model, prompt and sampling settings.
- Report per-category failures and uncertainty rather than only a single aggregate score.

## Repository naming

The repository has already been renamed to `llm-evaluation-toolkit`, which accurately reflects its purpose. No further rename is required. If it expands into a broader observability platform, rename it before publicising that scope and update package metadata, clone URLs and portfolio links.

## Definition of done

- Ruff and pytest pass.
- The sample CLI report is generated.
- New metrics have deterministic unit tests and documented limitations.
- Input-schema changes remain backward compatible or include a migration note.
- No unsupported claims of factual or semantic evaluation are introduced.
