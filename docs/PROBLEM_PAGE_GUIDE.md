# Problem walkthrough guide

The standard for every page in `src/content/problem-pages/`. The reference page is
[`nc-two-sum.md`](../src/content/problem-pages/nc-two-sum.md): read it before writing a new one.

A walkthrough is not a solution write-up. Its job is to train the reader to **solve the problem
unaided, reason through variations of it, and talk through it in an interview**. Judge every
paragraph by that.

## 1. Files and commands

| What | Where |
|---|---|
| Page | `src/content/problem-pages/<problem-id>.md` (the `id` from `src/content/problems/*.ts`) |
| Java tests | `src/content/problem-pages/tests/<problem-id>.java` |
| Progress log | `src/content/problem-pages/PROGRESS.md` |
| Rendered at | `/dsa/<problem-id>` |

| Command | Checks |
|---|---|
| `npm run problems:check` | Structure: frontmatter, the 13 sections, required parts, links, a test file exists |
| `npm run problems:verify` | Java: every solution compiles (warnings are errors) and passes its tests. Needs a JDK |
| `npm run problems:verify -- <id> <id>` | The same, for the named pages only |
| `npm run build` | The site still builds |

Pages use the lesson Markdown dialect ([LESSON_GUIDE.md](LESSON_GUIDE.md)). `[[id|label]]` links a
lesson or another problem.

## 2. Template

Frontmatter: `problemId`, `title`, `source` (`neetcode` or `cses`), `sourceUrl`, `difficulty`,
`patterns` (primary pattern first), `relatedLessons`, `companies` (leave `[]` unless certain),
`timeToSolve` (minutes).

The thirteen `##` sections, in this order:

| # | Section | Must contain |
|---|---|---|
| 1 | Problem restatement | Own words, 1–2 examples with the reason, the statement's guarantees. No hint of the technique |
| 2 | Practice first | How to practise, three `> [!HINT]` blocks (nudge → tool → near-complete plan), a self-check list. No code, no links, no technique names outside the hints |
| 3 | Interview script: understand the problem | **Me:** / **Interviewer:** dialogue, one example by hand, then `### Given constraints`, `### Clarifications confirmed by the interviewer`, `### My assumptions`, each saying how the fact shapes the solution, and the edge cases |
| 4 | Think out loud | One `### Approach N: …` per approach, naive to best, with the `####` parts below. Other valid options as `### Alternative: …` with trade-offs |
| 5 | Comparison table | Table `Approach / Expected time / Worst-case time / Auxiliary space` and table `Approach / Pros / Cons / When to pick it` |
| 6 | Which solution to give, and when to stop optimizing | The recommended answer, whether it is optimal, when another is better in practice, where to stop |
| 7 | Interview script: code it and test it | What to say while coding; traces of a normal case and every edge case |
| 8 | Time plan for the interview | A time-split table, where the time should go, what to do when stuck |
| 9 | Interviewer challenges | `####` questions about this solution, each with **What they are testing**, **How to reason**, **What I say**, **Nuance** |
| 10 | Follow-up questions | Changes to the problem, each a bold question with a short answer and complexity |
| 11 | Common mistakes | `### Reasoning mistakes` and `### Implementation mistakes` |
| 12 | Pattern recognition | The pattern, the signals in the statement, 3+ related problems linked by id, one takeaway |
| 13 | 60-second revision card | Key insight, invariant, complexity, code skeleton, traps |

Parts of every approach, in order: `What I say out loud`, `Intuition`, `Algorithm`, `Why it is
correct`, `Dry run`, `Java code`, `Time complexity`, `Space complexity`, and (all but the last)
`The bridge to the next approach`.

The site hides everything after section 2 until the reader asks for it. Sections 1 and 2 are
all a reader sees while practising, so they must not give the approach away.

## 3. Depth follows the problem, not the template

Two Sum is long because it is foundational and has several approaches worth comparing. That
length is not the target. Every section appears on every page, but its size depends on what the
problem needs.

- **A simple problem** (one obvious idea, little to compare): two approaches, short dry runs, three
  challenges, three follow-ups. Sections 6 and 8 can be a few sentences each. Do not invent
  alternatives, challenges or mistakes to fill space.
- **A foundational problem** with several real approaches: the depth of Two Sum.
- **A hard problem** (graphs, dynamic programming, advanced data structures): as long as it needs.
  Spend the extra length on the derivation, the correctness argument and the dry runs, which are
  where understanding is won, not on more follow-ups.

Tests for cutting: would an interviewer really ask this? Would a candidate really make this
mistake? Does this alternative have a situation where it wins? If not, leave it out.

The validator sets floors (two approaches, three hints, three challenges, three follow-ups,
1,500 words), not targets.

## 4. Reasoning and voice

- **Derive, don't recite.** Start from the simplest correct approach, name the bottleneck, ask
  what information would avoid the repeated work, weigh candidate data structures, then commit.
  Say why the approach works before the code.
- **Show uncertainty productively:** "I'm not sure yet whether sorting helps, because I need the
  indices; let me follow it and see what it costs."
- **Do not reuse the same script.** Each problem's dialogue should follow that problem's own
  difficulties.
- **Correctness:** for each approach, say why it returns only valid answers, why it cannot miss
  one, and the invariant if there is one. Plain arguments, not formal proofs. The recommended
  approach also gets a 20–30 second spoken version.
- **The recommended solution is the best interview answer,** which is not always the most
  advanced one. Weigh time, space, simplicity and implementation risk.

## 5. Precision rules

These came out of review. They apply to every page.

- **Constraints:** never invent one. If unsure, open `sourceUrl`. Keep statement guarantees,
  interviewer clarifications and your own assumptions apart, and never present an assumption as
  a constraint.
- **Hashing:** `HashMap` and `HashSet` operations are O(1) *on average, assuming hash codes
  spread well*. Write "O(n) expected", never an unconditional O(1) or O(n).
- **Implementation behaviour is not an API guarantee.** Example: modern Java can turn a heavily
  collided bucket into a balanced tree, which for comparable keys such as `Integer` limits a
  lookup to about O(log n). Describe it that way; do not state it as a worst-case guarantee of
  `HashMap`. The same care applies to sort internals, `StringBuilder` growth, and so on.
- **Lower bounds:** qualify them. "In the worst case a correct algorithm must inspect essentially
  every element, so there is an Ω(n) worst-case lower bound", not "every element must be read".
- **Expected is not guaranteed.** Randomized pivots, hash partitioning and similar techniques give
  an expected result under stated assumptions. Say what happens when the assumption fails (skewed
  partitions, bad pivots) and what the fallback is.
- **Complexity:** define every variable (n, V, E, k…). Say where the bound comes from. Give
  expected and worst-case time separately when they differ, and auxiliary space (the input is
  not counted; say so when the output or recursion stack matters).

## 6. Verification before a page counts as done

Run for every page, and for **every approach on it**, not only the recommended one.

1. **Every solution compiles.** Each `### Approach N` has a ```` ```java ```` block declaring
   `class Solution`, complete with imports. `problems:verify` compiles each one separately with
   `-Xlint:all -Werror`. Mark a code skeleton with `fragment="<method signature>"` on its fence so
   that it is compiled and tested too.
2. **Every solution passes the tests.** `tests/<id>.java` declares `class Tests` with a `main`
   that throws on failure and prints `PASS n cases`. It may declare helper types the judge
   provides (`ListNode`, `TreeNode`). It must cover:
   - the examples in section 1 and every dry-run input in section 4;
   - every edge case listed in section 3 and traced in section 7;
   - the extremes of the stated constraints (largest n, value limits, overflow boundaries);
   - where feasible, random inputs checked against an independent brute force;
   - a guard that rejects an invalid test case (for example, an input with two answers when the
     problem promises one).
3. **Dry runs match the code.** Run each approach on its dry-run input and compare the actual
   result, and the intermediate states you can observe, with the table on the page.
4. **Complexity matches the code.** Check each claim against the loops and data structures
   actually written: a sort inside a loop, a `contains` on a list, or string concatenation in a
   loop changes the bound.
5. **Claimed bugs are real.** If the page says a mistake produces a particular wrong output, make
   that change once and confirm the output.
6. `npm run problems:check` and `npm run build` pass.

## 7. Batches

Work in `listOrder` order, one category at a time, about ten pages per batch. After each batch:
run the three commands above, commit with a message naming the batch, and update `PROGRESS.md`
(ids done, next batch). Never commit a placeholder page or a page whose Java has not been run.
