#!/usr/bin/env python3
"""Generate Wave 10 / Phase 4 topic content files (42 topics)."""
import json
import os

OUT = os.path.join(os.path.dirname(__file__), "../src/content/topics")


def q(s: str) -> str:
    return s.replace("\\", "\\\\").replace("'", "\\'")


def dq(s: str) -> str:
    """Prefer double quotes for strings with apostrophes."""
    if "'" in s and '"' not in s:
        return json.dumps(s, ensure_ascii=False)
    return f"'{q(s)}'"


def block_list(items, indent=4):
    sp = " " * indent
    lines = [f"{sp}{{ type: 'list', items: ["]
    for it in items:
        lines.append(f"{sp}  {dq(it)},")
    lines.append(f"{sp}] }},")
    return "\n".join(lines)


def block_para(text, indent=4):
    sp = " " * indent
    return f"{sp}{{ type: 'paragraph', text: {dq(text)} }},"


def block_code(lang, code, caption=None, indent=4):
    sp = " " * indent
    cap = f", caption: {dq(caption)}" if caption else ""
    esc = code.replace("\\", "\\\\").replace("'", "\\'").replace("\n", "\\n")
    return f"{sp}{{ type: 'code', language: '{lang}', code: '{esc}'{cap} }},"


def str_list(key, items, indent=2):
    sp = " " * indent
    lines = [f"{sp}{key}: ["]
    for it in items:
        lines.append(f"{sp}  {dq(it)},")
    lines.append(f"{sp}],")
    return "\n".join(lines)


def prod_section(d):
    sp = "  "
    lines = [f"{sp}production: {{"]
    for k, v in d.items():
        if k == "testing":
            continue
        lines.append(f"{sp}  {k}: [")
        for it in v:
            lines.append(f"{sp}    {dq(it)},")
        lines.append(f"{sp}  ],")
    lines.append(f"{sp}}},")
    return "\n".join(lines)


def interview_section(d):
    sp = "  "
    lines = [f"{sp}interview: {{"]
    for k, v in d.items():
        lines.append(f"{sp}  {k}: [")
        for it in v:
            lines.append(f"{sp}    {dq(it)},")
        lines.append(f"{sp}  ],")
    lines.append(f"{sp}}},")
    return "\n".join(lines)


def tradeoffs_section(d):
    sp = "  "
    lines = [f"{sp}tradeoffs: {{"]
    for k in ["advantages", "disadvantages", "alternatives", "whenToUse", "whenNotToUse"]:
        lines.append(f"{sp}  {k}: [")
        for it in d[k]:
            lines.append(f"{sp}    {dq(it)},")
        lines.append(f"{sp}  ],")
    lines.append(f"{sp}}},")
    return "\n".join(lines)


def iq_section(items):
    sp = "  "
    lines = [f"{sp}interviewQuestions: ["]
    for it in items:
        lines.append(
            f"{sp}  {{ level: '{it['level']}', question: {dq(it['q'])}, answerHint: {dq(it['h'])} }},"
        )
    lines.append(f"{sp}],")
    return "\n".join(lines)


def fc_section(items):
    sp = "  "
    lines = [f"{sp}flashcards: ["]
    for it in items:
        lines.append(f"{sp}  {{ front: {dq(it['f'])}, back: {dq(it['b'])} }},")
    lines.append(f"{sp}],")
    return "\n".join(lines)


def blocks_section(key, blocks, indent=2):
    sp = " " * indent
    lines = [f"{sp}{key}: ["]
    for b in blocks:
        if b["type"] == "list":
            lines.append(block_list(b["items"], indent + 2))
        elif b["type"] == "paragraph":
            lines.append(block_para(b["text"], indent + 2))
        elif b["type"] == "code":
            lines.append(block_code(b["lang"], b["code"], b.get("caption"), indent + 2))
    lines.append(f"{sp}],")
    return "\n".join(lines)


def system_design_section(sd):
    sp = "  "
    lines = [f"{sp}systemDesign: {{"]
    lines.append(f"{sp}  problem: {dq(sd['problem'])},")
    lines.append(f"{sp}  requirements: {{")
    lines.append(f"{sp}    functional: [")
    for it in sd["requirements"]["functional"]:
        lines.append(f"{sp}      {dq(it)},")
    lines.append(f"{sp}    ],")
    lines.append(f"{sp}    nonFunctional: [")
    for it in sd["requirements"]["nonFunctional"]:
        lines.append(f"{sp}      {dq(it)},")
    lines.append(f"{sp}    ],")
    lines.append(f"{sp}  }},")
    for arr_key in ["scaleAssumptions", "capacityEstimates", "dataFlow", "storage", "caching",
                    "asyncProcessing", "scaling", "consistency", "reliability", "failureScenarios",
                    "security", "observability", "bottlenecks", "alternatives", "tradeoffs",
                    "interviewFollowUps"]:
        lines.append(f"{sp}  {arr_key}: [")
        for it in sd.get(arr_key, []):
            lines.append(f"{sp}    {dq(it)},")
        lines.append(f"{sp}  ],")
    for block_key in ["api", "dataModel", "highLevelArchitecture"]:
        lines.append(blocks_section(block_key, sd.get(block_key, []), indent=4).rstrip(",") + ",")
    if sd.get("diagram"):
        dm = sd["diagram"]["mermaid"].replace("\\", "\\\\").replace('"', '\\"').replace("\n", "\\n")
        cap = sd["diagram"].get("caption")
        cap_s = f", caption: {dq(cap)}" if cap else ""
        lines.append(f'{sp}  diagram: {{ mermaid: "{dm}"{cap_s} }},')
    lines.append(f"{sp}  evolution: [")
    for ev in sd.get("evolution", []):
        bn = f", bottleneck: {dq(ev['bottleneck'])}" if ev.get("bottleneck") else ""
        lines.append(
            f"{sp}    {{ stage: {dq(ev['stage'])}, description: {dq(ev['description'])}{bn} }},"
        )
    lines.append(f"{sp}  ],")
    lines.append(f"{sp}}},")
    return "\n".join(lines)


def write_topic(tid, t):
    parts = [
        "import type { TopicContent } from '@/domain/types'",
        "",
        "export const content: TopicContent = {",
        f"  whatIsIt: {dq(t['whatIsIt'])},",
        f"  whyExists: {dq(t['whyExists'])},",
        f"  mentalModel: {dq(t['mentalModel'])},",
        "  howItWorks: [",
    ]
    for b in t.get("howItWorks", []):
        if b["type"] == "list":
            parts.append(block_list(b["items"], 4))
        elif b["type"] == "paragraph":
            parts.append(block_para(b["text"], 4))
        elif b["type"] == "code":
            parts.append(block_code(b["lang"], b["code"], b.get("caption"), 4))
    parts.append("  ],")
    parts.append("  example: [")
    for b in t.get("example", []):
        if b["type"] == "paragraph":
            parts.append(block_para(b["text"], 4))
        elif b["type"] == "code":
            parts.append(block_code(b["lang"], b["code"], b.get("caption"), 4))
        elif b["type"] == "list":
            parts.append(block_list(b["items"], 4))
    parts.append("  ],")
    parts.append(tradeoffs_section(t["tradeoffs"]))
    parts.append(str_list("failureModes", t["failureModes"]))
    parts.append(prod_section(t["production"]))
    parts.append(interview_section(t["interview"]))
    parts.append(str_list("keyTakeaways", t["keyTakeaways"]))
    parts.append(iq_section(t["iq"]))
    parts.append(fc_section(t["flashcards"]))
    parts.append(str_list("quickRevision", t["quickRevision"]))
    if t.get("systemDesign"):
        parts.append(system_design_section(t["systemDesign"]))
    parts.append("}")
    parts.append("")
    path = os.path.join(OUT, f"{tid}.ts")
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(parts))
    return path


import sys

sys.path.insert(0, os.path.dirname(__file__))
from gen_wave10_data import ALL_TOPICS  # noqa: E402

if __name__ == "__main__":
    ids = sorted(ALL_TOPICS.keys())
    for tid in ids:
        write_topic(tid, ALL_TOPICS[tid])
    print(f"Wrote {len(ids)} topics")
    print("IDs:", ", ".join(ids))
