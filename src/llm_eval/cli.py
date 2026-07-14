from __future__ import annotations

import argparse
import json
from pathlib import Path

from llm_eval.core import evaluate_record, load_jsonl, summarise


def render_markdown(summary: dict[str, float | int]) -> str:
    lines = ["# LLM Evaluation Report", "", f"Records: **{summary['records']}**", ""]
    for key, value in summary.items():
        if key == "records":
            continue
        lines.append(f"- `{key}`: {value}")
    lines.extend(
        [
            "",
            "> Deterministic lexical metrics are baseline indicators, not substitutes for human review.",
        ]
    )
    return "\n".join(lines) + "\n"


def evaluate(input_path: Path, output_dir: Path) -> None:
    records = load_jsonl(input_path)
    rows = [evaluate_record(record) for record in records]
    summary = summarise(rows)
    output_dir.mkdir(parents=True, exist_ok=True)
    (output_dir / "records.json").write_text(json.dumps(rows, indent=2) + "\n", encoding="utf-8")
    (output_dir / "summary.json").write_text(json.dumps(summary, indent=2) + "\n", encoding="utf-8")
    (output_dir / "report.md").write_text(render_markdown(summary), encoding="utf-8")


def main() -> None:
    parser = argparse.ArgumentParser(description="Evaluate structured RAG/LLM experiment records.")
    subparsers = parser.add_subparsers(dest="command", required=True)
    command = subparsers.add_parser("evaluate")
    command.add_argument("input", type=Path)
    command.add_argument("--output-dir", type=Path, default=Path("reports/latest"))
    args = parser.parse_args()
    evaluate(args.input, args.output_dir)
    print(f"Wrote evaluation report to {args.output_dir}")


if __name__ == "__main__":
    main()
