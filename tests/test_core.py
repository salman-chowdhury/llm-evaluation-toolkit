from pathlib import Path

from llm_eval.cli import evaluate
from llm_eval.core import (
    EvaluationRecord,
    citation_coverage,
    grounding_overlap,
    precision_at_k,
    recall_at_k,
    reciprocal_rank,
)


def record() -> EvaluationRecord:
    return EvaluationRecord(
        id="q1",
        question="What is RAG?",
        reference_answer="RAG retrieves evidence before generation.",
        answer="RAG retrieves evidence before generation.",
        relevant_document_ids=("a",),
        retrieved_documents=(
            {"id": "b", "text": "Unrelated."},
            {"id": "a", "text": "RAG retrieves evidence before generation."},
        ),
        cited_document_ids=("a",),
        latency_ms=100,
        estimated_cost_usd=0.01,
    )


def test_retrieval_metrics() -> None:
    item = record()
    assert precision_at_k(item) == 0.5
    assert recall_at_k(item) == 1.0
    assert reciprocal_rank(item) == 0.5


def test_grounding_and_citations() -> None:
    item = record()
    assert grounding_overlap(item) == 1.0
    assert citation_coverage(item) == 1.0


def test_cli_writes_reports(tmp_path: Path) -> None:
    source = Path(__file__).parents[1] / "examples" / "sample.jsonl"
    output = tmp_path / "report"
    evaluate(source, output)
    assert (output / "summary.json").exists()
    assert (output / "records.json").exists()
    assert "LLM Evaluation Report" in (output / "report.md").read_text()
