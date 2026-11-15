# Problem walkthrough progress

One interview walkthrough per problem: `src/content/problem-pages/<problem-id>.md`.
650 problems in total (NeetCode 250 + CSES 400), listed in `src/content/problems/*.ts`.

- Standards: `docs/PROBLEM_PAGE_GUIDE.md`. Reference page: `nc-two-sum.md`. Read both before writing.
- Depth follows the problem: Two Sum's length is not the target (guide §3).
- After each batch: `npm run problems:check`, `npm run problems:verify` (compiles and tests every Java approach), `npm run build`, then commit.
- Order: NeetCode by `listOrder`, one category at a time, in batches of about 10. Then CSES.

## Status

**Done: 77 / 650.** NeetCode `arrays-hashing` (`listOrder` 1–22), `two-pointers` (23–35), `sliding-window` (36–44), `stack` (45–58) and `binary-search` (59–72) are complete. CSES: the five Programming Fundamentals problems (`cses-weird-algorithm`, `cses-repetitions`, `cses-increasing-array`, `cses-permutations`, `cses-two-sets`).

## Next batch (not started)

NeetCode `linked-list`, from `listOrder` 73.

## Done

| Batch | Category | Problem ids | Notes |
|---|---|---|---|
| sample | arrays-hashing | `nc-two-sum` | Reference page |
| 1 | arrays-hashing | `nc-concatenation-of-array`, `nc-contains-duplicate`, `nc-valid-anagram`, `nc-longest-common-prefix`, `nc-group-anagrams`, `nc-remove-element`, `nc-majority-element`, `nc-design-hashset`, `nc-design-hashmap` | Constraints checked against LeetCode; every approach compiled and tested |
| 2 | arrays-hashing | `nc-sort-an-array`, `nc-sort-colors`, `nc-top-k-frequent-elements`, `nc-encode-and-decode-strings`, `nc-range-sum-query-2d-immutable`, `nc-product-of-array-except-self`, `nc-valid-sudoku`, `nc-longest-consecutive-sequence`, `nc-best-time-to-buy-sell-stock-ii`, `nc-majority-element-ii`, `nc-subarray-sum-equals-k`, `nc-first-missing-positive` | Constraints checked against LeetCode (Encode and Decode: NeetCode's free version); every approach compiled and tested |
| 3 | two-pointers | `nc-reverse-string`, `nc-valid-palindrome`, `nc-valid-palindrome-ii`, `nc-merge-strings-alternately`, `nc-merge-sorted-array`, `nc-remove-duplicates-from-sorted-array`, `nc-two-sum-ii-input-array-is-sorted`, `nc-3sum`, `nc-4sum`, `nc-rotate-array`, `nc-container-with-most-water`, `nc-boats-to-save-people`, `nc-trapping-rain-water` | Constraints checked against LeetCode; every approach compiled and tested |
| 4 | sliding-window | `nc-contains-duplicate-ii`, `nc-best-time-to-buy-and-sell-stock`, `nc-longest-substring-without-repeating-characters`, `nc-longest-repeating-character-replacement`, `nc-permutation-in-string`, `nc-minimum-size-subarray-sum`, `nc-find-k-closest-elements`, `nc-minimum-window-substring`, `nc-sliding-window-maximum` | Constraints checked against LeetCode; every approach compiled and tested |
| 5 | stack | `nc-baseball-game`, `nc-valid-parentheses`, `nc-implement-stack-using-queues`, `nc-implement-queue-using-stacks`, `nc-min-stack`, `nc-evaluate-reverse-polish-notation`, `nc-asteroid-collision`, `nc-daily-temperatures`, `nc-online-stock-span`, `nc-car-fleet`, `nc-simplify-path`, `nc-decode-string`, `nc-maximum-frequency-stack`, `nc-largest-rectangle-in-histogram` | Constraints checked against LeetCode; every approach compiled and tested |
| 6 | binary-search | `nc-binary-search`, `nc-search-insert-position`, `nc-guess-number-higher-or-lower`, `nc-sqrt-x`, `nc-search-a-2d-matrix`, `nc-koko-eating-bananas`, `nc-capacity-to-ship-packages-within-d-days`, `nc-find-minimum-in-rotated-sorted-array`, `nc-search-in-rotated-sorted-array`, `nc-search-in-rotated-sorted-array-ii`, `nc-time-based-key-value-store`, `nc-split-array-largest-sum`, `nc-median-of-two-sorted-arrays`, `nc-find-in-mountain-array` | Constraints checked against LeetCode; every approach compiled and tested |
| 7 | CSES introductory (roadmap topic 1) | `cses-weird-algorithm`, `cses-repetitions`, `cses-increasing-array`, `cses-permutations`, `cses-two-sets` | First CSES pages; whole-program convention in the guide §7 |
