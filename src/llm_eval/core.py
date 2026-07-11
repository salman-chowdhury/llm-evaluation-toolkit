from __future__ import annotations

import json
import math
import re
import statistics
from dataclasses import dataclass
from pathlib import Path
from typing import Any

TOKEN_RE = re.compile(r"[a-z0-9]+")


@dataclass(frozen=True, slots=True)
class EvaluationRecord:
    id: str
    question: str
    reference_answer: str
    answer: str
    relevant_document_ids: tuple[str, ...]
    retrieved_documents: tuple[dict[str, Any], ...]
    cited_document_ids: tuple[str, ...]
    latency_ms: float
    estimated_cost_usd: float


def tokenize(text: str) -> set[str]:
    return set(TOKEN_RE.findall(text.lower()))


def safe_divide(numerator: float, denominator: float) -> float:
    return numerator / denominator if denominator else 0.0


def precision_at_k(record: EvaluationRecord, k: int = 5) -> float:
    retrieved = [str(item.get("id", "")) for item in record.retrieved_documents[:k]]
    relevant = set(record.relevant_document_ids)
    return safe_divide(sum(item in relevant for item in retrieved), len(retrieved))


def recall_at_k(record: EvaluationRecord, k: int = 5) -> float:
    retrieved = {str(item.get("id", "")) for item in record.retrieved_documents[:k]}
    relevant = set(record.relevant_document_ids)
    return safe_divide(len(retrieved & relevant), len(relevant))


def reciprocal_rank(record: EvaluationRecord) -> float:
    relevant = set(record.relevant_document_ids)
    for index, item in enumerate(record.retrieved_documents, start=1):
        if str(item.get("id", "")) in relevant:
            return 1 / index
    return 0.0


def answer_coverage(record: EvaluationRecord) -> float:
    reference = tokenize(record.reference_answer)
    answer = tokenize(record.answer)
    return safe_divide(len(reference & answer), len(reference))


def citation_coverage(record: EvaluationRecord) -> float:
    relevant = set(record.relevant_document_ids)
    cited = set(record.cited_document_ids)
    return safe_divide(len(relevant & cited), len(relevant))


def grounding_overlap(record: EvaluationRecord) -> float:
    evidence = tokenize(" ".join(str(item.get("text", "")) for item in record.retrieved_documents))
    answer = tokenize(record.answer)
    return safe_divide(len(answer & evidence), len(answer))


def unsupported_token_ratio(record: EvaluationRecord) -> float:
    return 1 - grounding_overlap(record)


def evaluate_record(record: EvaluationRecord) -> dict[str, float | str]:
    return {
        "id": record.id,
        "precision_at_5": round(precision_at_k(record), 4),
        "recall_at_5": round(recall_at_k(record), 4),
        "reciprocal_rank": round(reciprocal_rank(record), 4),
        "answer_coverage": round(answer_coverage(record), 4),
        "citation_coverage": round(citation_coverage(record), 4),
        "grounding_overlap": round(grounding_overlap(record), 4),
        "unsupported_token_ratio": round(unsupported_token_ratio(record), 4),
        "latency_ms": round(record.latency_ms, 2),
        "estimated_cost_usd": round(record.estimated_cost_usd, 6),
    }


def percentile(values: list[float], probability: float) -> float:
    if not values:
        return 0.0
    ordered = sorted(values)
    position = (len(ordered) - 1) * probability
    lower = math.floor(position)
    upper = math.ceil(position)
    if lower == upper:
        return ordered[lower]
    fraction = position - lower
    return ordered[lower] + (ordered[upper] - ordered[lower]) * fraction


def summarise(rows: list[dict[str, float | str]]) -> dict[str, float | int]:
    metric_names = [
        "precision_at_5",
        "recall_at_5",
        "reciprocal_rank",
        "answer_coverage",
        "citation_coverage",
        "grounding_overlap",
        "unsupported_token_ratio",
    ]
    summary: dict[str, float | int] = {"records": len(rows)}
    for metric in metric_names:
        values = [float(row[metric]) for row in rows]
        summary[f"mean_{metric}"] = round(statistics.fmean(values), 4) if values else 0.0
    latencies = [float(row["latency_ms"]) for row in rows]
    summary["latency_p50_ms"] = round(percentile(latencies, 0.5), 2)
    summary["latency_p95_ms"] = round(percentile(latencies, 0.95), 2)
    summary["total_estimated_cost_usd"] = round(
        sum(float(row["estimated_cost_usd"]) for row in rows), 6
    )
    return summary


def load_jsonl(path: Path) -> list[EvaluationRecord]:
    records: list[EvaluationRecord] = []
    for line_number, line in enumerate(path.read_text(encoding="utf-8").splitlines(), start=1):
        if not line.strip():
            continue
        payload = json.loads(line)
        try:
            records.append(
                EvaluationRecord(
                    id=str(payload["id"]),
                    question=str(payload["question"]),
                    reference_answer=str(payload["reference_answer"]),
                    answer=str(payload["answer"]),
                    relevant_document_ids=tuple(map(str, payload.get("relevant_document_ids", []))),
                    retrieved_documents=tuple(payload.get("retrieved_documents", [])),
                    cited_document_ids=tuple(map(str, payload.get("cited_document_ids", []))),
                    latency_ms=float(payload.get("latency_ms", 0)),
                    estimated_cost_usd=float(payload.get("estimated_cost_usd", 0)),
                )
            )
        except (KeyError, TypeError, ValueError) as exc:
            raise ValueError(f"Invalid evaluation record at line {line_number}: {exc}") from exc
    return records
