# Prompt: continue writing DSA interview walkthrough pages

Copy everything below the line into a new AI coding session opened in this repository.

---

You are continuing an in-progress project in this repository: one interview walkthrough page per
DSA problem (650 in total: NeetCode 250 + CSES 400). Each page trains the reader to solve the
problem on their own and to talk through it in a real coding interview. Quality and correctness
matter more than speed.

## Read these first (required, in this order)

1. `docs/PROBLEM_PAGE_GUIDE.md`: the standard. It covers the 13 sections, the parts every
   approach needs, the precision rules, the verification checklist, and §3 "Depth follows the
   problem". Follow it exactly.
2. `src/content/problem-pages/PROGRESS.md`: what is done and what comes next.
3. `src/content/problem-pages/nc-two-sum.md`: the approved reference page. Also skim one page of
   similar difficulty to the one you are writing (for example `nc-trapping-rain-water.md` for a
   hard problem, or `nc-design-hashmap.md` for a class-design problem) and its test file in
   `src/content/problem-pages/tests/`.
4. `docs/LESSON_GUIDE.md` §2: the Markdown dialect (callouts, tables, `[[id|label]]` links).

## Where things stand

- Branch: `problem-walkthroughs` (pushed to `origin`). Do not merge into `main` unless the user asks.
- **Done and committed (77 / 650):** the NeetCode categories `arrays-hashing` (listOrder 1–22),
  `two-pointers` (23–35), `sliding-window` (36–44), `stack` (45–58) and `binary-search` (59–72),
  and the five CSES Programming Fundamentals problems. `PROGRESS.md` has the current count.
- **Every page has a Run panel** (guide §6, "Run panel"): the reader runs each solution in the
  browser on the samples or on their own input. A new page is not done until it has samples in
  `src/content/problem-pages/run-samples.json` and `npm run problems:runner` passes.
- **Next:** continue NeetCode in `listOrder`, one category at a time (`linked-list` starts at
  listOrder 73), then CSES.
- Untracked `src/content/lessons/b2-*.md` files belong to the user. Never stage, edit or delete them.

## Official constraints

For every later problem, read the official statement and constraints before writing. Never invent
a constraint. LeetCode's GraphQL endpoint (`POST https://leetcode.com/graphql` with
`question(titleSlug:)` returning `content`) and `https://cses.fi/problemset/task/<id>` both work. A
premium-only LeetCode problem may have a free NeetCode version (neetcode.io/problems/...); if you
use it, say so on the page.

## How to work

- **Batches:** one category at a time, about 10–14 pages per batch. If you use parallel subagents,
  give each 2–3 related pages (related pages cross-link well) and keep the two hardest problems of a
  batch with one agent. Each agent must read the guide and the reference page, and receive the
  official constraints in its brief.
- **Depth follows the problem.** Easy pages are noticeably shorter than Two Sum. Hard pages spend
  their extra length on the derivation, the correctness argument and the dry runs. Never pad with
  invented challenges, alternatives or mistakes.
- **Commands** (run from the repo root):
  - `npm run problems:verify -- <ids>` compiles every Java block on the pages (warnings are errors)
    and runs it against `tests/<id>.java`. Run it with no ids to check all pages.
  - `npm run problems:runner` compiles the pages' Java to JavaScript (TeaVM) for the Run panel and
    fails unless it prints exactly what the JVM prints on every sample. Needs Gradle and a JDK 17.
    Commit `src/runner/generated/` with the pages.
  - `npm run problems:check` checks page structure, frontmatter, links, and that a test file exists.
  - `npx tsc -b` and `npx vite build` check that the site still builds. Do not run `npm run build`:
    it regenerates lesson files and would sweep in the user's untracked lessons.
- **JDK:** `javac` on PATH is a macOS stub. The verifier finds Homebrew's JDK at
  `/opt/homebrew/opt/openjdk` automatically; otherwise set `JAVA_HOME` to that path.
- **After each batch:** add the pages to `run-samples.json`; all four checks pass; search the new pages for "obviously" and remove it;
  update `PROGRESS.md` (the done count, the next batch, and a row in the Done table); then commit
  only `src/content/problem-pages/`, `src/runner/generated/` and any script you changed. Name the batch in the commit
  message.

## Pitfalls that earlier batches hit (check for each one)

- **Unconditional hash map claims.** Hash map complexity is *expected*. Java's tree bins are
  implementation behaviour, not an API guarantee. Write "O(n) expected".
- **Over-absolute lower bounds.** Write "in the worst case a correct algorithm must inspect
  essentially every element: Ω(n)". Never claim a lower bound you cannot argue; one page had to
  drop an "at least O(n³)" claim.
- **JDK documentation claims.** Describe them as what the documentation's *implementation note*
  says, for example `Arrays.sort(int[])` offering O(n log n) "on all data sets" in Java 17. Do not
  present them as guarantees.
- **Unrun bug claims.** Every claimed bug output must be run once; several drafts were wrong until
  they were run. The same goes for dry-run tables, which must match what the code actually does.
- **Overflow bounds.** Compute them from the constraints and state them on the page.
- **Approaches too slow for the largest tests.** These must not be numbered `### Approach N`,
  because the verifier runs every approach on every test. Describe them in prose or as
  `### Alternative: …`.
- **Design-problem classes.** These declare the class the problem names (`MyHashSet`, `TimeMap`,
  …). The verifier names the file after the first top-level class. Judge-provided types
  (`ListNode`, `TreeNode`, `GuessGame`, `MountainArray`) go in the test file.
- **Revision-card skeletons.** Either a complete class, or a fence with
  `fragment="<method signature>"`.
- **Titles.** The validator requires the exact name from `src/content/problems/*.ts`, capitals included.
- **Section 9 headings.** Section 9 groups its `####` challenges under `###` headings, because the
  parser forbids jumping from H2 to H4.
- **Sections 1–2.** These must not reveal the technique and must contain no `[[links]]`. The site
  hides everything after section 2 until the reader asks for it.

## The DSA roadmap (applied to the site)

The DSA explorer (`/dsa`) shows all 650 problems in the order from `docs/DSA_Roadmap_Recategorized.xlsx`:
61 topics, each with a Core tier (difficulty score below 6) and a Challenge tier, similar problems
grouped, easiest first. The data lives in `src/content/problems/dsa-roadmap.ts` (problem id → topic,
tier, group, score); keep it in sync with the spreadsheet if either changes. `src/test/dsa-roadmap.test.ts`
checks that every problem is placed once and the order is consistent.

The source lists (`neetcode250.ts`, `cses.ts`), their `listOrder` and `category` are unchanged, and
walkthrough batches still follow NeetCode `listOrder` unless the user asks you to follow the
roadmap order instead.

## When you report back

For each batch, say:

- which pages were written;
- the number of test cases each page passes;
- every claim you could not verify;
- the commit hash.

Report a failing check with its output rather than working around it.
