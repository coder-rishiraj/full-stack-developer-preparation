# Problem walkthrough progress

One interview walkthrough per problem: `src/content/problem-pages/<problem-id>.md`.
650 problems in total (NeetCode 250 + CSES 400), listed in `src/content/problems/*.ts`.

- Standards: `docs/PROBLEM_PAGE_GUIDE.md`. Reference page: `nc-two-sum.md`. Read both before writing.
- Depth follows the problem: Two Sum's length is not the target (guide §3).
- After each batch: `npm run problems:check`, `npm run problems:verify` (compiles and tests every Java approach), `npm run build`, then commit.
- Order: NeetCode by `listOrder`, one category at a time, in batches of about 10. Then CSES.

## Status

**Done: 10 / 650.** NeetCode `arrays-hashing` `listOrder` 1–10 are written and verified.

## Next batch (not started)

NeetCode `arrays-hashing`, `listOrder` 11–20: `nc-sort-an-array`, `nc-sort-colors`, `nc-top-k-frequent-elements`, `nc-encode-and-decode-strings`, then the next six by `listOrder`.

## Done

| Batch | Category | Problem ids | Notes |
|---|---|---|---|
| sample | arrays-hashing | `nc-two-sum` | Reference page |
| 1 | arrays-hashing | `nc-concatenation-of-array`, `nc-contains-duplicate`, `nc-valid-anagram`, `nc-longest-common-prefix`, `nc-group-anagrams`, `nc-remove-element`, `nc-majority-element`, `nc-design-hashset`, `nc-design-hashmap` | Constraints checked against LeetCode; every approach compiled and tested |
