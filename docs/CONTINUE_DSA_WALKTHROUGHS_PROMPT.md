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

- Branch: `problem-walkthroughs`, 4 commits ahead of `origin/problem-walkthroughs`. Nothing is pushed.
  Do not push or merge unless the user asks.
- **Done and committed (58 / 650):** the NeetCode categories `arrays-hashing` (listOrder 1–22),
  `two-pointers` (23–35), `sliding-window` (36–44) and `stack` (45–58).
- **Batch 6, `binary-search` (listOrder 59–72), is half-finished and uncommitted.** Two earlier
  sessions were cut off by usage limits.
  - Complete, verified, ready to commit (page + tests pass): `nc-binary-search`,
    `nc-search-insert-position`, `nc-capacity-to-ship-packages-within-d-days`,
    `nc-find-minimum-in-rotated-sorted-array`, `nc-search-in-rotated-sorted-array`.
  - Page written, test file missing (so `problems:check` fails): `nc-search-in-rotated-sorted-array-ii`,
    `nc-split-array-largest-sum`. Read each page carefully, write `tests/<id>.java`, and fix the page
    if the tests disagree with it.
  - Test file written, page missing: `nc-guess-number-higher-or-lower`, `nc-time-based-key-value-store`,
    `nc-median-of-two-sorted-arrays`, `nc-find-in-mountain-array`. Read the existing test file
    before writing the page. If you rewrite it, keep any judge-provided types it declares
    (`GuessGame`, the `MountainArray` interface).
  - Nothing written yet: `nc-sqrt-x`, `nc-search-a-2d-matrix`, `nc-koko-eating-bananas`.
- **Next after batch 6:** continue NeetCode in `listOrder`, one category at a time (`linked-list`
  starts at listOrder 73). Then do CSES.
- Untracked `src/content/lessons/b2-*.md` files belong to the user. Never stage, edit or delete them.

## Official constraints for the rest of batch 6 (read from LeetCode on 2026-11-14)

- **Guess Number Higher or Lower:** 1 ≤ n ≤ 2^31 − 1; 1 ≤ pick ≤ n. `int guess(int num)` returns −1 if
  num > pick, 1 if num < pick, 0 if equal. Java template: `public class Solution extends GuessGame { public int guessNumber(int n) }`.
- **Sqrt(x):** 0 ≤ x ≤ 2^31 − 1; return ⌊√x⌋; no built-in exponent function or operator.
- **Search a 2D Matrix:** m × n matrix, rows non-decreasing, each row's first value is greater than
  the previous row's last; 1 ≤ m, n ≤ 100; −10^4 ≤ values, target ≤ 10^4; must be O(log(m·n)).
- **Koko Eating Bananas:** 1 ≤ piles.length ≤ 10^4; piles.length ≤ h ≤ 10^9; 1 ≤ piles[i] ≤ 10^9.
  The hours total overflows `int` at k = 1, so use `long`.
- **Time Based Key-Value Store:** class `TimeMap` with `set(String key, String value, int timestamp)`
  and `String get(String key, int timestamp)`, returning "" if there is no value. Keys and values
  are 1–100 lowercase letters or digits; 1 ≤ timestamp ≤ 10^7; set timestamps are strictly
  increasing; at most 2·10^5 calls.
- **Median of Two Sorted Arrays:** 0 ≤ m, n ≤ 1000; 1 ≤ m + n ≤ 2000; −10^6 ≤ values ≤ 10^6; must be O(log(m+n)).
- **Find in Mountain Array:** interactive. `int findInMountainArray(int target, MountainArray mountainArr)`;
  3 ≤ length ≤ 10^4; 0 ≤ target, values ≤ 10^9; more than 100 `get` calls is Wrong Answer; return
  the minimum index, or −1.
- **Search in Rotated Sorted Array II:** 1 ≤ n ≤ 5000; −10^4 ≤ values, target ≤ 10^4; duplicates
  allowed. The follow-up asks how duplicates affect complexity (worst case Θ(n)).
- **Split Array Largest Sum:** 1 ≤ n ≤ 1000; 0 ≤ nums[i] ≤ 10^6; 1 ≤ k ≤ min(50, n).

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
  - `npm run problems:check` checks page structure, frontmatter, links, and that a test file exists.
  - `npx tsc -b` and `npx vite build` check that the site still builds. Do not run `npm run build`:
    it regenerates lesson files and would sweep in the user's untracked lessons.
- **JDK:** `javac` on PATH is a macOS stub. The verifier finds Homebrew's JDK at
  `/opt/homebrew/opt/openjdk` automatically; otherwise set `JAVA_HOME` to that path.
- **After each batch:** all three checks pass; search the new pages for "obviously" and remove it;
  update `PROGRESS.md` (the done count, the next batch, and a row in the Done table); then commit
  only `src/content/problem-pages/` and any script you changed. Name the batch in the commit
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
