# Problem walkthrough progress

One interview walkthrough per problem: `src/content/problem-pages/<problem-id>.md`.
650 problems in total (NeetCode 250 + CSES 400), listed in `src/content/problems/*.ts`.

- Standards: `docs/PROBLEM_PAGE_GUIDE.md`. Reference page: `nc-two-sum.md`. Read both before writing.
- Depth follows the problem: Two Sum's length is not the target (guide §3).
- After each batch: `npm run problems:check`, `npm run problems:verify` (compiles and tests every Java approach), `npm run build`, then commit.
- Order: NeetCode by `listOrder`, one category at a time, in batches of about 10. Then CSES.

## Status

**Done: 1 / 650.** The sample page is approved as the template; no batch has started.

## Sample

- [x] `nc-two-sum` (NeetCode #4, arrays-hashing): reference page; all 4 approaches and the skeleton compile and pass `tests/nc-two-sum.java`

## Next batch (not started)

NeetCode `arrays-hashing`, `listOrder` 1–10, skipping `nc-two-sum`.

## Done

| Batch | Category | Problem ids | Commit |
|---|---|---|---|
| sample | arrays-hashing | `nc-two-sum` | not committed |
