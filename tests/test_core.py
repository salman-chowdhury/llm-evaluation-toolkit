from pathlib import Path

from llm_eval.cli import evaluate
from llm_eval.core import (
    EvaluationRecord,
    citation_coverage,
    grounding_overlap,
    precision_at_k,
    recall_at_k,
    reciprocal_rank,
    refusal_correctness,
    summarise,
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


def test_refusal_and_usage_metrics() -> None:
    refused = EvaluationRecord(
        id="q2",
        question="Unknown?",
        reference_answer="The source does not answer this question.",
        answer="I could not find that in the sources.",
        relevant_document_ids=(),
        retrieved_documents=(),
        cited_document_ids=(),
        latency_ms=25,
        estimated_cost_usd=0,
        expected_refusal=True,
        refused=True,
        prompt_tokens=12,
        completion_tokens=8,
    )
    assert refusal_correctness(refused) == 1.0
    summary = summarise([
        {
            "id": "q2",
            "precision_at_5": 0.0,
            "recall_at_5": 0.0,
            "reciprocal_rank": 0.0,
            "answer_coverage": 0.0,
            "citation_coverage": 0.0,
            "grounding_overlap": 0.0,
            "unsupported_token_ratio": 1.0,
            "refusal_correctness": 1.0,
            "latency_ms": 25.0,
            "estimated_cost_usd": 0.0,
            "prompt_tokens": 12,
            "completion_tokens": 8,
        }
    ])
    assert summary["total_prompt_tokens"] == 12
    assert summary["total_completion_tokens"] == 8


def test_cli_writes_reports(tmp_path: Path) -> None:
    source = Path(__file__).parents[1] / "examples" / "sample.jsonl"
    output = tmp_path / "report"
    evaluate(source, output)
    assert (output / "summary.json").exists()
    assert (output / "records.json").exists()
    assert "LLM Evaluation Report" in (output / "report.md").read_text()
