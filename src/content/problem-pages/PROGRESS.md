# Problem walkthrough progress

One interview walkthrough per problem: `src/content/problem-pages/<problem-id>.md`.
650 problems in total (NeetCode 250 + CSES 400), listed in `src/content/problems/*.ts`.

- Standards: `docs/PROBLEM_PAGE_GUIDE.md`. Reference page: `nc-two-sum.md`. Read both before writing.
- Depth follows the problem: Two Sum's length is not the target (guide §3).
- After each batch: `npm run problems:check`, `npm run problems:verify` (compiles and tests every Java approach), `npm run build`, then commit.
- Order: NeetCode by `listOrder`, one category at a time, in batches of about 10. Then CSES.

## Status

**Done: 44 / 650.** NeetCode `arrays-hashing` (`listOrder` 1–22), `two-pointers` (23–35) and `sliding-window` (36–44) are complete.

## Next batch (not started)

NeetCode `stack`, `listOrder` 45–58 (14 problems): `nc-baseball-game` … `nc-largest-rectangle-in-histogram`.

## Done

| Batch | Category | Problem ids | Notes |
|---|---|---|---|
| sample | arrays-hashing | `nc-two-sum` | Reference page |
| 1 | arrays-hashing | `nc-concatenation-of-array`, `nc-contains-duplicate`, `nc-valid-anagram`, `nc-longest-common-prefix`, `nc-group-anagrams`, `nc-remove-element`, `nc-majority-element`, `nc-design-hashset`, `nc-design-hashmap` | Constraints checked against LeetCode; every approach compiled and tested |
| 2 | arrays-hashing | `nc-sort-an-array`, `nc-sort-colors`, `nc-top-k-frequent-elements`, `nc-encode-and-decode-strings`, `nc-range-sum-query-2d-immutable`, `nc-product-of-array-except-self`, `nc-valid-sudoku`, `nc-longest-consecutive-sequence`, `nc-best-time-to-buy-sell-stock-ii`, `nc-majority-element-ii`, `nc-subarray-sum-equals-k`, `nc-first-missing-positive` | Constraints checked against LeetCode (Encode and Decode: NeetCode's free version); every approach compiled and tested |
| 3 | two-pointers | `nc-reverse-string`, `nc-valid-palindrome`, `nc-valid-palindrome-ii`, `nc-merge-strings-alternately`, `nc-merge-sorted-array`, `nc-remove-duplicates-from-sorted-array`, `nc-two-sum-ii-input-array-is-sorted`, `nc-3sum`, `nc-4sum`, `nc-rotate-array`, `nc-container-with-most-water`, `nc-boats-to-save-people`, `nc-trapping-rain-water` | Constraints checked against LeetCode; every approach compiled and tested |
| 4 | sliding-window | `nc-contains-duplicate-ii`, `nc-best-time-to-buy-and-sell-stock`, `nc-longest-substring-without-repeating-characters`, `nc-longest-repeating-character-replacement`, `nc-permutation-in-string`, `nc-minimum-size-subarray-sum`, `nc-find-k-closest-elements`, `nc-minimum-window-substring`, `nc-sliding-window-maximum` | Constraints checked against LeetCode; every approach compiled and tested |
