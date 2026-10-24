# Career Duo lesson guide

This is the standard every lesson in `src/content/lessons/` follows. It exists so that a
learner who opens any topic gets the same quality of teaching, whichever track it is in.

The test of a finished lesson: **someone meeting the concept for the first time can understand
it from this page alone** — what it is, why it exists, how it works, how to use it, where it
shows up in real systems, and how it connects to what they already know.

---

## 1. Where lessons live

- One file per **classified topic**: `src/content/lessons/<topic-id>.md`. The file name must equal
  the topic id from the curriculum (`src/content/curriculum/*.ts`, listed in `CONTENTS.md`).
- **Nested concepts** (topics with a `parentTopicId`) are taught *inside the parent's lesson*
  under a heading with an explicit anchor equal to the nested topic's id:

  ```md
  ## HashMap {#a1-hashmap}
  ```

  The nested topic's page shows that section on its own, and links into the parent lesson for
  context. Every nested concept must be anchored (the validator enforces it). Choose the
  heading level that fits the lesson's flow (H2 or H3), and make the section readable on its
  own: its first paragraph should say what the concept is in plain words.
- Never delete, rename or merge a curriculum topic. If two topics overlap, teach the idea once in
  the most natural home and link to it from the other with `[[topic-id]]`, while still giving the
  other lesson enough explanation to stand on its own.

Run `npm run lessons:check` (fast) after writing, and `npm run lessons:sync` to refresh the
manifest and `docs/CURRICULUM_CHECKLIST.md`.

---

## 2. File format

```md
---
summary: One or two plain sentences saying what the learner will understand and why it matters.
difficulty: beginner        # beginner | intermediate | advanced
minutes: 35                 # honest reading + exercise time
objectives:
  - Explain why binary search needs sorted input
  - Write a bug-free iterative binary search and justify its loop condition
  - Recognise "binary search on the answer" problems
---

## Introduction

Prose…
```

- No H1 — the page title is rendered from the curriculum. Use `##` for primary sections, `###`
  for subsections, `####` only when really needed. Never skip a level.
- 3–6 objectives, each starting with a verb the learner could be tested on (explain, trace,
  implement, choose, debug, compare, design).

### Supported Markdown

| You write | You get |
|---|---|
| `**term**` | Bold — key terms when introduced, important conclusions, critical distinctions |
| `*text*` | Italics — sparing, subtle emphasis only |
| `` `code` `` | Identifiers, methods, keywords, commands, file names, literal values |
| `[[a3-binary-search]]` | Link to a topic (shows its title) |
| `[[a3-binary-search\|binary search]]` | Link with custom text |
| `[MDN](https://developer.mozilla.org/…)` | External link |
| `> [!NOTE] Optional title` + `> body` | Callout. Variants: `NOTE`, `TIP`, `IMPORTANT`, `WARNING`, `MISTAKE`, `INTERVIEW` |
| ` ```java title="Main.java" ` | Code block — language is required |
| ` ```output ` directly after a code block | The program's output, shown under the code |
| ` ```mermaid ` | Diagram (flowchart, sequenceDiagram, stateDiagram-v2, classDiagram, erDiagram, gantt) |
| ` ```quiz ` | Knowledge check (format below) |
| GFM pipe tables | Comparisons and structured facts |

Mermaid: put any label containing punctuation in double quotes — `A["mid = low + (high - low) / 2"]`,
`B{"a[mid] < target?"}`. Do not use HTML entities. Keep diagrams small (under ~15 nodes) and
give them a short caption with ` ```mermaid title="…" `.

Quiz format:

````md
```quiz
Q: Why does `low + (high - low) / 2` avoid a bug that `(low + high) / 2` has?
- [ ] It rounds up instead of down
- [x] `low + high` can overflow `int` when both are large
- [ ] It is faster on modern CPUs
> `high - low` never exceeds the array length, so the sum stays in range; `low + high` can pass
> `Integer.MAX_VALUE` for arrays longer than about a billion elements.
```
````

Every question needs exactly one `[x]` and a `>` explanation that teaches *why*, including why
the tempting wrong answer is wrong.

---

## 3. How to teach

1. **Start simple, then build.** Open with the problem the concept solves, in plain words,
   before any terminology. Introduce one new term at a time and define it the first time it
   appears (bold it there).
2. **Explain, don't just define.** A definition is the start of an explanation, not the whole
   thing. After every definition, show what it means with a concrete case.
3. **Give the reasoning.** Don't only show *what* the code does — say why it is written this way
   and why the alternative is worse.
4. **Connect.** Say what earlier idea this builds on (and link it), and what it unlocks next.
5. **Use real examples.** Examples demonstrate behaviour — inputs, outputs, state changes —
   rather than restating the definition.
6. **Be precise.** Simplify, never falsify. Analogies must not imply wrong behaviour; say where an
   analogy stops working. If behaviour depends on version (Java 21, React 19, PostgreSQL 16,
   ES2023), say so.
7. **Write paragraphs.** Lists are for genuinely list-shaped things (steps, options, checklists).
   A reader should be able to move from one paragraph to the next without feeling notes were
   pasted together. Avoid "this is important" without saying why.
8. **Right-size it.** Depth follows complexity. A narrow concept can be 900–1,500 words; a core
   concept (event loop, transactions, binary search, RAG) usually needs 2,500–5,000. Never pad.

### Recommended section flow

Adapt this — don't force all twelve into a small topic — but cover the substance.

1. `## Introduction` — what it is, the problem it solves, why an engineer needs it, where it shows up.
2. `## Before you start` — prerequisites, each linked with `[[id]]`, with one line on what is needed from it.
3. `## The intuition` — analogy, small scenario or picture that builds the mental model.
4. `## <Core explanation sections>` — the concept taught in a natural order, several H2s as needed.
5. `## How it works internally` — mechanisms, execution flow, memory, architecture.
6. `## Worked example(s)` — complete, runnable code, explained step by step, with output and edge cases.
7. Visual walkthrough — mermaid diagrams, state tables, timelines or dry-run tables, *where they genuinely help*.
8. `## In real systems` — how engineers use it in production code and systems.
9. `## Trade-offs and alternatives` — advantages, costs, limits, performance, when to use / not use.
10. `## Common mistakes` — real beginner bugs and misconceptions, each with the fix and the reason.
11. `## Interview perspective` — conceptual, implementation and follow-up questions, with the reasoning behind good answers.
12. `## Practice` — exercises (and problems where relevant), then
    `## Quick revision {#quick-revision}` (dense bullet summary for later revision),
    `## Key takeaways {#key-takeaways}` (4–8 sentences/bullets of what to remember).

The validator requires, for classified topics: a `{#quick-revision}` section, a
`{#key-takeaways}` section, at least one ```quiz```, at least 900 words, and an anchored section
for every nested concept. The revision view is built from the quick-revision, cheat-sheet and
key-takeaways sections plus the quizzes, so make those sections self-contained.

---

## 4. Track-specific depth

**DSA (Track A)** — teach problem-solving, not templates. For each algorithm or pattern: the
underlying problem → naive approach → why it is slow (with its complexity) → how to derive the
better idea → the intuition / invariant → step-by-step procedure → a dry run on a meaningful
input (table of variable values per step) → complete Java implementation → time complexity
*derivation* → space complexity derivation → edge cases → variations and how to recognise the
pattern in an unseen problem. Link the relevant problems in the DSA explorer by topic.

**Frontend (Track B)** — explain *why* the browser, JavaScript engine, TypeScript compiler or
React behave as they do: execution contexts, the event loop, rendering pipeline, reconciliation.
Use runnable snippets with their console output, and realistic UI scenarios.

**Java & backend (Track C)** — show what actually happens: what the JVM allocates, what a
thread interleaving looks like (use a timeline table or sequence diagram), what the database
does when a query runs (parse → plan → execute, index lookups, locks, MVCC versions), and the
lifecycle of a real HTTP request through Spring.

**System design (Track D)** — teach the decisions, not just boxes. Case studies walk through:
problem understanding, functional requirements, non-functional requirements, constraints and
assumptions, capacity estimation (show the arithmetic), API design, data model, high-level
architecture (diagram), each component and *why it exists*, data flow, bottlenecks, scaling
strategy, failure handling, trade-offs. A beginner must be able to follow without already
knowing every building block — link to the building-block lessons.

**Applied AI (Track E)** — progress from fundamentals; keep the distinctions clear between a
model, an LLM API, a RAG pipeline, an agent and a production AI application. Give practical
implementation examples (Python or TypeScript), with realistic data and failure handling.

---

## 5. Code standards

- Always label the language. Prefer complete, runnable programs over fragments; when a fragment
  is clearer, say what surrounds it.
- Show output in an ` ```output ` block right after the code.
- Comments explain *why*, not what. Keep lines under ~90 characters.
- Java 21, modern JavaScript (ES2023), TypeScript 5, React 19, Spring Boot 3, PostgreSQL 16,
  Python 3.12 unless the topic is specifically about an older version.
- After each significant block, walk through it in prose: what happens first, what each part is
  for, what would break if you changed it.

## 6. Formatting discipline

- Bold is for terms and conclusions, not decoration. Two or three bolded phrases per section is
  typical.
- Callouts are seasoning: usually 2–5 per lesson. Never wrap ordinary paragraphs in callouts.
- Tables for comparisons and classifications, never for paragraphs.
- No emoji, no exclamation marks, no "simply"/"just"/"obviously".
- Spell out abbreviations the first time (Garbage Collection (GC)).
