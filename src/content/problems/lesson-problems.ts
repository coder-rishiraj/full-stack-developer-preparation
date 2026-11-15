/**
 * Hand-picked practice problems for each Track A lesson, drawn from the DSA problems page
 * (NeetCode 250 + CSES). Shown as a "Practice problems" list at the end of the lesson.
 *
 * Order here does not matter: the list is shown in roadmap order (easiest first).
 * Every id must exist in PROBLEMS; src/test/lesson-problems.test.ts checks this.
 */
export const LESSON_PROBLEMS: Record<string, string[]> = {
  // A1 · Programming for Interviews
  'a1-java-syntax-competitive': ['cses-weird-algorithm', 'cses-repetitions', 'cses-increasing-array', 'cses-permutations', 'cses-two-sets', 'cses-missing-number'],
  'a1-arraylist': ['nc-two-sum', 'nc-contains-duplicate', 'nc-group-anagrams', 'nc-top-k-frequent-elements', 'nc-design-hashmap', 'nc-kth-largest-element-in-stream', 'nc-time-based-key-value-store', 'cses-concert-tickets'],
  'a1-comparable-comparator': ['nc-k-closest-points-to-origin', 'nc-merge-intervals', 'nc-meeting-rooms-ii', 'cses-movie-festival', 'cses-tasks-and-deadlines', 'nc-single-threaded-cpu'],
  'a1-strings-stringbuilder': ['nc-valid-palindrome', 'nc-longest-common-prefix', 'nc-merge-strings-alternately', 'nc-encode-and-decode-strings', 'nc-greatest-common-divisor-of-strings', 'cses-palindrome-reorder', 'nc-add-binary', 'nc-multiply-strings', 'nc-decode-string'],
  'a1-custom-classes': ['nc-min-stack', 'nc-design-hashmap', 'nc-time-based-key-value-store', 'nc-detect-squares', 'nc-lru-cache', 'nc-design-twitter', 'nc-implement-trie'],
  'a1-recursion': ['cses-tower-of-hanoi', 'cses-gray-code', 'nc-pow-x-n', 'nc-reverse-linked-list', 'nc-maximum-depth-of-binary-tree', 'nc-subsets', 'cses-apple-division'],
  'a1-time-complexity': ['cses-weird-algorithm', 'cses-missing-number', 'nc-contains-duplicate', 'nc-two-sum', 'nc-binary-search', 'nc-climbing-stairs'],
  'a1-big-o': ['cses-missing-number', 'nc-contains-duplicate', 'nc-two-sum', 'nc-binary-search', 'nc-maximum-subarray', 'nc-subsets'],
  'a1-java-streams-interviews': ['nc-contains-duplicate', 'nc-valid-anagram', 'nc-group-anagrams', 'nc-majority-element', 'nc-top-k-frequent-elements'],

  // A2 · Arrays & Strings
  'a2-array-string-traversal': ['nc-concatenation-of-array', 'nc-remove-element', 'nc-rotate-array', 'nc-plus-one', 'cses-increasing-array', 'cses-repetitions', 'nc-missing-number', 'nc-first-missing-positive'],
  'a2-prefix-suffix': ['cses-static-range-sum-queries', 'cses-range-xor-queries', 'cses-forest-queries', 'nc-range-sum-query-2d-immutable', 'nc-product-of-array-except-self', 'nc-subarray-sum-equals-k', 'cses-subarray-sums-ii', 'cses-subarray-divisibility', 'nc-trapping-rain-water'],
  'a2-two-pointers': ['nc-reverse-string', 'nc-valid-palindrome', 'nc-valid-palindrome-ii', 'nc-merge-sorted-array', 'nc-remove-duplicates-from-sorted-array', 'nc-two-sum-ii-input-array-is-sorted', 'nc-container-with-most-water', 'cses-sum-of-two-values', 'nc-boats-to-save-people', 'nc-3sum', 'nc-trapping-rain-water'],
  'a2-sliding-window': ['nc-contains-duplicate-ii', 'cses-sliding-window-sum', 'nc-best-time-to-buy-and-sell-stock', 'nc-permutation-in-string', 'nc-longest-substring-without-repeating-characters', 'nc-longest-repeating-character-replacement', 'nc-minimum-size-subarray-sum', 'cses-playlist', 'cses-distinct-values-subarrays', 'nc-minimum-window-substring'],
  'a2-frequency-counting': ['nc-valid-anagram', 'nc-group-anagrams', 'nc-majority-element', 'nc-majority-element-ii', 'nc-top-k-frequent-elements', 'cses-palindrome-reorder', 'nc-permutation-in-string', 'cses-distinct-values-subsequences'],
  'a2-hashing': ['cses-distinct-numbers', 'nc-contains-duplicate', 'nc-two-sum', 'nc-longest-consecutive-sequence', 'nc-design-hashset', 'nc-design-hashmap', 'nc-valid-sudoku', 'nc-verifying-an-alien-dictionary', 'nc-detect-squares', 'nc-subarray-sum-equals-k'],
  'a2-sorting-based': ['nc-sort-colors', 'nc-valid-anagram', 'cses-distinct-numbers', 'cses-apartments', 'cses-ferris-wheel', 'cses-stick-lengths', 'nc-merge-intervals', 'nc-3sum'],
  'a2-matrix': ['nc-transpose-matrix', 'nc-spiral-matrix', 'nc-rotate-image', 'nc-set-matrix-zeroes', 'nc-valid-sudoku', 'nc-search-a-2d-matrix', 'cses-number-spiral'],
  'a2-intervals': ['nc-meeting-rooms', 'nc-merge-intervals', 'nc-insert-interval', 'nc-non-overlapping-intervals', 'nc-meeting-rooms-ii', 'cses-restaurant-customers', 'cses-nested-ranges-check', 'nc-minimum-interval-to-include-each-query'],
  'a2-kadane': ['cses-maximum-subarray-sum', 'nc-maximum-subarray', 'nc-best-time-to-buy-and-sell-stock', 'nc-maximum-sum-circular-subarray', 'nc-longest-turbulent-subarray', 'nc-maximum-product-subarray'],
  'a2-difference-arrays': ['nc-car-pooling', 'cses-restaurant-customers', 'nc-meeting-rooms-ii', 'cses-range-update-queries'],

  // A3 · Searching & Sorting
  'a3-binary-search': ['nc-binary-search', 'nc-guess-number-higher-or-lower', 'nc-sqrt-x', 'cses-hidden-integer', 'nc-search-a-2d-matrix', 'nc-find-minimum-in-rotated-sorted-array', 'nc-search-in-rotated-sorted-array', 'nc-search-in-rotated-sorted-array-ii', 'nc-find-in-mountain-array', 'nc-median-of-two-sorted-arrays'],
  'a3-binary-search-on-answer': ['nc-koko-eating-bananas', 'nc-capacity-to-ship-packages-within-d-days', 'cses-factory-machines', 'cses-array-division', 'nc-split-array-largest-sum', 'cses-multiplication-table'],
  'a3-lower-upper-bounds': ['nc-search-insert-position', 'nc-time-based-key-value-store', 'nc-find-k-closest-elements', 'cses-concert-tickets', 'cses-towers', 'nc-longest-increasing-subsequence'],
  'a3-merge-sort': ['nc-merge-sorted-array', 'nc-sort-an-array', 'nc-merge-two-sorted-lists', 'nc-merge-k-sorted-lists'],
  'a3-quick-sort': ['nc-sort-colors', 'nc-sort-an-array', 'nc-kth-largest-element-in-array'],
  'a3-comparator-sorting': ['nc-k-closest-points-to-origin', 'nc-merge-intervals', 'nc-non-overlapping-intervals', 'nc-car-fleet', 'cses-movie-festival', 'cses-tasks-and-deadlines'],
  'a3-quickselect': ['nc-sort-colors', 'nc-kth-largest-element-in-array', 'nc-k-closest-points-to-origin', 'nc-top-k-frequent-elements'],
  'a3-counting-sort': ['nc-sort-colors', 'nc-valid-anagram', 'nc-sort-an-array', 'nc-top-k-frequent-elements', 'cses-collecting-numbers'],

  // A4 · Linked Lists
  'a4-singly-linked-lists': ['nc-reverse-linked-list', 'nc-merge-two-sorted-lists', 'nc-insert-greatest-common-divisors-in-linked-list', 'nc-remove-nth-node-from-end', 'nc-add-two-numbers', 'nc-copy-list-with-random-pointer', 'nc-lru-cache'],
  'a4-fast-slow-pointers': ['nc-happy-number', 'nc-linked-list-cycle', 'nc-reorder-list', 'nc-remove-nth-node-from-end', 'nc-find-the-duplicate-number'],
  'a4-reversal': ['nc-reverse-linked-list', 'nc-reorder-list', 'nc-reverse-linked-list-ii', 'nc-reverse-nodes-in-k-group'],
  'a4-cycle-detection': ['nc-happy-number', 'nc-linked-list-cycle', 'nc-find-the-duplicate-number'],
  'a4-merge-lists': ['nc-merge-two-sorted-lists', 'nc-reorder-list', 'nc-add-two-numbers', 'nc-merge-k-sorted-lists'],
  'a4-intersection': ['nc-remove-nth-node-from-end', 'nc-linked-list-cycle', 'nc-find-the-duplicate-number'],
  'a4-lru-style': ['nc-copy-list-with-random-pointer', 'nc-lru-cache', 'nc-maximum-frequency-stack', 'nc-lfu-cache'],

  // A5 · Stack & Queue
  'a5-stack': ['nc-baseball-game', 'nc-valid-parentheses', 'nc-min-stack', 'nc-implement-stack-using-queues', 'nc-evaluate-reverse-polish-notation', 'nc-simplify-path', 'nc-asteroid-collision', 'nc-decode-string', 'nc-maximum-frequency-stack'],
  'a5-queue': ['nc-implement-queue-using-stacks', 'nc-implement-stack-using-queues', 'nc-design-circular-queue', 'nc-dota2-senate', 'nc-rotting-oranges', 'cses-josephus-problem-i'],
  'a5-deque': ['nc-design-circular-queue', 'nc-implement-stack-using-queues', 'cses-sliding-window-minimum', 'nc-sliding-window-maximum'],
  'a5-monotonic-stack': ['cses-nearest-smaller-values', 'nc-daily-temperatures', 'nc-online-stock-span', 'nc-car-fleet', 'nc-largest-rectangle-in-histogram', 'cses-advertisement', 'cses-maximum-building-i', 'nc-trapping-rain-water'],
  'a5-monotonic-queue': ['cses-sliding-window-minimum', 'nc-sliding-window-maximum', 'cses-maximum-subarray-sum-ii'],
  'a5-next-greater-smaller': ['cses-nearest-smaller-values', 'nc-daily-temperatures', 'nc-online-stock-span', 'nc-car-fleet', 'nc-largest-rectangle-in-histogram'],
  'a5-parentheses': ['nc-valid-parentheses', 'nc-generate-parentheses', 'nc-evaluate-reverse-polish-notation', 'nc-decode-string', 'nc-valid-parenthesis-string', 'cses-bracket-sequences-i'],

  // A6 · Trees
  'a6-binary-trees': ['nc-invert-binary-tree', 'nc-maximum-depth-of-binary-tree', 'nc-same-tree', 'nc-subtree-of-another-tree', 'nc-balanced-binary-tree', 'nc-diameter-of-binary-tree', 'nc-count-good-nodes-in-tree', 'nc-binary-tree-max-path-sum'],
  'a6-dfs': ['nc-binary-tree-preorder-traversal', 'nc-binary-tree-inorder-traversal', 'nc-binary-tree-postorder-traversal', 'nc-invert-binary-tree', 'nc-same-tree', 'nc-delete-leaves-with-given-value', 'nc-count-good-nodes-in-tree', 'nc-house-robber-iii'],
  'a6-bfs': ['nc-binary-tree-level-order-traversal', 'nc-binary-tree-right-side-view', 'nc-maximum-depth-of-binary-tree', 'nc-serialize-deserialize-tree'],
  'a6-bst': ['nc-kth-smallest-element-in-a-bst', 'nc-insert-into-a-bst', 'nc-lca-of-a-bst', 'nc-delete-node-in-a-bst', 'nc-validate-bst'],
  'a6-height-depth': ['nc-maximum-depth-of-binary-tree', 'nc-balanced-binary-tree', 'nc-diameter-of-binary-tree', 'cses-subordinates', 'nc-minimum-height-trees'],
  'a6-diameter': ['nc-diameter-of-binary-tree', 'nc-balanced-binary-tree', 'nc-binary-tree-max-path-sum', 'cses-tree-diameter', 'cses-tree-distances-i'],
  'a6-lca': ['nc-lca-of-a-bst', 'cses-company-queries-i', 'cses-company-queries-ii', 'cses-distance-queries', 'cses-counting-paths'],
  'a6-path-problems': ['nc-count-good-nodes-in-tree', 'nc-diameter-of-binary-tree', 'nc-house-robber-iii', 'nc-binary-tree-max-path-sum', 'cses-path-queries', 'cses-fixed-length-paths-i'],
  'a6-construction': ['nc-construct-tree-from-pre-inorder', 'cses-tree-traversals', 'nc-serialize-deserialize-tree', 'nc-construct-quad-tree'],
  'a6-serialization': ['nc-subtree-of-another-tree', 'nc-construct-tree-from-pre-inorder', 'cses-tree-traversals', 'nc-serialize-deserialize-tree', 'cses-pr-fer-code', 'cses-tree-isomorphism-i'],
  'a6-tree-views': ['nc-binary-tree-level-order-traversal', 'nc-binary-tree-right-side-view'],
  'a6-nary-trees': ['nc-construct-quad-tree', 'cses-subordinates', 'cses-tree-diameter', 'cses-tree-matching', 'cses-tree-isomorphism-i'],

  // A7 · Heaps
  'a7-min-heap': ['nc-kth-largest-element-in-stream', 'nc-kth-largest-element-in-array', 'nc-single-threaded-cpu', 'cses-stick-divisions', 'nc-merge-k-sorted-lists', 'nc-network-delay-time'],
  'a7-priority-queues': ['nc-last-stone-weight', 'nc-k-closest-points-to-origin', 'nc-reorganize-string', 'nc-longest-happy-string', 'nc-task-scheduler', 'nc-single-threaded-cpu', 'nc-design-twitter', 'cses-room-allocation', 'nc-ipo'],
  'a7-top-k': ['nc-last-stone-weight', 'nc-kth-largest-element-in-stream', 'nc-k-closest-points-to-origin', 'nc-kth-largest-element-in-array', 'nc-top-k-frequent-elements', 'cses-k-subset-sums-i'],
  'a7-k-way-merge': ['nc-merge-sorted-array', 'nc-merge-two-sorted-lists', 'nc-merge-k-sorted-lists', 'cses-k-subset-sums-i'],
  'a7-running-median': ['nc-find-median-from-data-stream', 'cses-sliding-window-median', 'cses-sliding-window-cost'],
  'a7-two-heap-pattern': ['nc-find-median-from-data-stream', 'nc-ipo', 'cses-sliding-window-median', 'cses-sliding-window-cost'],

  // A8 · Graphs
  'a8-graph-representation': ['nc-find-the-town-judge', 'cses-building-roads', 'cses-message-route', 'nc-clone-graph', 'nc-course-schedule'],
  'a8-graph-interview-framework': ['nc-number-of-islands', 'nc-clone-graph', 'nc-rotting-oranges', 'nc-course-schedule', 'nc-redundant-connection', 'nc-network-delay-time', 'nc-word-ladder'],
  'a8-bfs': ['cses-message-route', 'cses-labyrinth', 'nc-walls-and-gates', 'nc-open-the-lock', 'cses-knight-moves-grid', 'nc-rotting-oranges', 'cses-monsters', 'nc-word-ladder'],
  'a8-multi-source-bfs': ['nc-walls-and-gates', 'nc-rotting-oranges', 'nc-pacific-atlantic-water-flow', 'cses-monsters', 'cses-nearest-shops'],
  'a8-connected-components': ['nc-island-perimeter', 'cses-counting-rooms', 'nc-max-area-of-island', 'nc-number-of-islands', 'nc-surrounded-regions', 'cses-building-roads', 'nc-number-of-connected-components', 'nc-graph-valid-tree'],
  'a8-cycle-undirected': ['cses-round-trip', 'nc-graph-valid-tree', 'nc-redundant-connection', 'cses-graph-girth'],
  'a8-cycle-detection': ['cses-course-schedule', 'nc-course-schedule', 'nc-course-schedule-ii', 'cses-round-trip-ii', 'cses-planets-cycles'],
  'a8-topological-sorting': ['cses-course-schedule', 'nc-course-schedule', 'nc-course-schedule-ii', 'cses-game-routes', 'cses-longest-flight-route', 'nc-build-matrix-with-conditions', 'nc-alien-dictionary'],
  'a8-bipartite': ['cses-building-teams', 'cses-school-dance'],
  'a8-graph-coloring': ['cses-building-teams', 'cses-graph-coloring', 'cses-grid-coloring-i', 'cses-hamiltonian-flights'],
  'a8-union-find': ['cses-road-construction', 'nc-redundant-connection', 'nc-accounts-merge', 'nc-number-of-connected-components', 'nc-graph-valid-tree', 'nc-gcd-traversal', 'cses-network-breakdown'],
  'a8-dijkstra': ['cses-shortest-routes-i', 'nc-network-delay-time', 'nc-path-with-minimum-effort', 'nc-swim-in-rising-water', 'cses-flight-discount', 'cses-flight-routes', 'cses-investigation'],
  'a8-bellman-ford': ['nc-cheapest-flights-within-k-stops', 'cses-high-score', 'cses-cycle-finding'],
  'a8-floyd-warshall': ['nc-evaluate-division', 'nc-course-schedule-iv', 'cses-shortest-routes-ii'],
  'a8-mst-kruskal': ['cses-road-reparation', 'nc-min-cost-to-connect-points', 'nc-find-critical-pseudo-edges-mst', 'cses-mst-edge-check', 'cses-mst-edge-cost'],
  'a8-scc': ['cses-flight-routes-check', 'cses-planets-and-kingdoms', 'cses-coin-collector', 'cses-giant-pizza', 'cses-new-flight-routes'],
  'a8-bridges': ['cses-necessary-roads', 'cses-strongly-connected-edges', 'cses-network-renovation'],
  'a8-articulation-points': ['cses-necessary-cities', 'cses-forbidden-cities', 'cses-critical-cities'],
  'a8-euler-path': ['nc-reconstruct-itinerary', 'cses-mail-delivery', 'cses-teleporters-path', 'cses-de-bruijn-sequence'],
  'a8-max-flow': ['cses-download-speed', 'cses-police-chase', 'cses-school-dance', 'cses-distinct-routes', 'cses-coin-grid'],
  'a8-gfg-must-do-extras': ['cses-swap-round-sorting', 'nc-minimum-path-sum', 'cses-minimal-grid-path', 'nc-word-ladder'],

  // A9 · Backtracking
  'a9-subsets': ['nc-subsets', 'nc-subsets-ii', 'cses-apple-division', 'nc-sum-of-all-subsets-xor-total', 'cses-meet-in-the-middle'],
  'a9-combinations': ['nc-combinations', 'nc-letter-combinations-of-phone', 'nc-generate-parentheses', 'nc-combination-sum'],
  'a9-combination-sum': ['nc-combination-sum', 'nc-combination-sum-ii', 'nc-combination-sum-iv', 'nc-coin-change-ii'],
  'a9-permutations': ['cses-creating-strings', 'nc-permutations', 'nc-permutations-ii', 'cses-permutation-subsequence'],
  'a9-n-queens': ['cses-chessboard-and-queens', 'nc-n-queens', 'nc-n-queens-ii'],
  'a9-grid-search': ['nc-word-search', 'cses-grid-path-description', 'nc-word-search-ii', 'cses-knight-s-tour'],
  'a9-constraint-backtracking': ['nc-palindrome-partitioning', 'nc-matchsticks-to-square', 'nc-partition-to-k-equal-sum-subsets', 'cses-chessboard-and-queens', 'nc-n-queens', 'cses-grid-path-description'],
  'a9-pruning': ['nc-combination-sum-ii', 'nc-matchsticks-to-square', 'nc-partition-to-k-equal-sum-subsets', 'cses-grid-path-description', 'cses-meet-in-the-middle'],

  // A10 · Greedy
  'a10-sorting-greedy': ['cses-stick-lengths', 'cses-tasks-and-deadlines', 'cses-missing-coin-sum', 'cses-reading-books', 'cses-apartments', 'cses-ferris-wheel', 'nc-boats-to-save-people', 'nc-hand-of-straights', 'nc-merge-triplets-to-form-target-triplet'],
  'a10-local-vs-global': ['nc-best-time-to-buy-sell-stock-ii', 'nc-jump-game', 'nc-jump-game-ii', 'nc-gas-station', 'nc-partition-labels', 'nc-candy', 'nc-coin-change'],
  'a10-interval-scheduling': ['nc-non-overlapping-intervals', 'nc-meeting-rooms-ii', 'cses-movie-festival', 'cses-movie-festival-ii', 'cses-projects', 'nc-meeting-rooms-iii'],
  'a10-heap-greedy': ['nc-reorganize-string', 'nc-longest-happy-string', 'nc-task-scheduler', 'nc-single-threaded-cpu', 'cses-stick-divisions', 'cses-room-allocation', 'nc-ipo'],

  // A11 · Dynamic Programming
  'a11-memoization': ['nc-climbing-stairs', 'nc-house-robber', 'nc-coin-change', 'nc-decode-ways', 'nc-word-break', 'nc-longest-increasing-path-in-a-matrix', 'nc-stone-game-ii'],
  'a11-tabulation': ['cses-dice-combinations', 'nc-climbing-stairs', 'nc-house-robber', 'cses-coin-combinations-i', 'nc-coin-change', 'cses-grid-paths-i', 'nc-unique-paths'],
  'a11-1d-dp': ['cses-dice-combinations', 'nc-min-cost-climbing-stairs', 'nc-n-th-tribonacci-number', 'nc-climbing-stairs', 'nc-house-robber', 'nc-house-robber-ii', 'cses-removing-digits', 'nc-perfect-squares', 'nc-decode-ways'],
  'a11-2d-dp': ['nc-unique-paths', 'cses-array-description', 'nc-longest-common-subsequence', 'nc-edit-distance', 'nc-interleaving-string', 'nc-target-sum', 'cses-rectangle-cutting'],
  'a11-grid-dp': ['cses-grid-paths-i', 'nc-unique-paths', 'nc-unique-paths-ii', 'nc-minimum-path-sum', 'cses-minimal-grid-path', 'nc-longest-increasing-path-in-a-matrix'],
  'a11-knapsack': ['cses-minimizing-coins', 'cses-coin-combinations-i', 'cses-coin-combinations-ii', 'nc-coin-change', 'nc-coin-change-ii', 'cses-book-shop', 'cses-money-sums', 'nc-partition-equal-subset-sum', 'nc-target-sum', 'nc-last-stone-weight-ii', 'cses-two-sets-ii'],
  'a11-lcs': ['nc-longest-common-subsequence', 'cses-longest-common-subsequence', 'nc-edit-distance', 'cses-edit-distance', 'nc-interleaving-string', 'nc-distinct-subsequences'],
  'a11-lis': ['nc-longest-increasing-subsequence', 'cses-increasing-subsequence', 'cses-towers', 'cses-increasing-subsequence-ii', 'nc-longest-increasing-path-in-a-matrix'],
  'a11-subsequences': ['nc-longest-increasing-subsequence', 'nc-longest-common-subsequence', 'nc-distinct-subsequences', 'cses-distinct-subsequences', 'nc-regular-expression-matching'],
  'a11-partition-dp': ['nc-word-break', 'nc-palindromic-substrings', 'cses-rectangle-cutting', 'cses-removal-game', 'nc-stone-game', 'nc-burst-balloons', 'cses-empty-string'],
  'a11-state-machine-dp': ['nc-best-time-to-buy-sell-stock-ii', 'nc-house-robber', 'nc-maximum-product-subarray', 'cses-array-description', 'nc-best-time-to-buy-and-sell-stock-with-cooldown'],
  'a11-bitmask-dp': ['nc-partition-to-k-equal-sum-subsets', 'cses-elevator-rides', 'cses-hamiltonian-flights', 'cses-counting-tilings', 'cses-sos-bit-problem'],
  'a11-tree-dp': ['nc-house-robber-iii', 'nc-binary-tree-max-path-sum', 'cses-subordinates', 'cses-tree-matching', 'cses-tree-diameter', 'cses-tree-distances-i', 'cses-tree-distances-ii'],

  // A12 · Advanced Data Structures
  'a12-trie': ['nc-implement-trie', 'nc-design-add-search-words', 'cses-word-combinations', 'nc-extra-characters-in-a-string', 'nc-word-search-ii', 'cses-maximum-xor-subarray'],
  'a12-prefix-matching': ['nc-longest-common-prefix', 'nc-implement-trie', 'nc-design-add-search-words', 'cses-word-combinations', 'cses-string-matching', 'cses-finding-patterns'],
  'a12-segment-trees': ['cses-dynamic-range-sum-queries', 'cses-dynamic-range-minimum-queries', 'cses-hotel-queries', 'cses-subarray-sum-queries', 'cses-range-updates-and-sums', 'cses-polynomial-queries'],
  'a12-fenwick': ['cses-dynamic-range-sum-queries', 'cses-range-update-queries', 'cses-forest-queries-ii', 'cses-list-removals', 'cses-salary-queries'],
  'a12-sparse-tables': ['cses-static-range-minimum-queries', 'cses-company-queries-i', 'cses-planets-queries-i'],

  // A13 · Bit Manipulation
  'a13-and-or-xor': ['nc-single-number', 'nc-missing-number', 'nc-sum-of-two-integers', 'nc-minimum-array-end', 'nc-bitwise-and-of-numbers-range', 'cses-range-xor-queries'],
  'a13-set-bit': ['nc-number-of-1-bits', 'nc-counting-bits', 'nc-reverse-bits', 'nc-minimum-array-end', 'cses-hamming-distance'],
  'a13-powers-of-two': ['nc-number-of-1-bits', 'nc-counting-bits', 'nc-reverse-bits', 'cses-gray-code', 'cses-counting-bits'],
  'a13-xor-tricks': ['nc-single-number', 'nc-missing-number', 'cses-missing-number', 'nc-sum-of-two-integers', 'cses-sliding-window-xor', 'cses-maximum-xor-subarray', 'cses-maximum-xor-subset'],
  'a13-bitmasking': ['nc-subsets', 'cses-apple-division', 'nc-sum-of-all-subsets-xor-total', 'cses-elevator-rides', 'cses-hamiltonian-flights'],

  // A14 · Interview Execution — classic problems to rehearse the skill on
  'a14-clarifying-requirements': ['nc-two-sum', 'nc-valid-palindrome', 'nc-encode-and-decode-strings', 'nc-merge-intervals', 'nc-lru-cache'],
  'a14-brute-force-first': ['nc-two-sum', 'nc-maximum-subarray', 'nc-container-with-most-water', 'nc-3sum', 'nc-trapping-rain-water'],
  'a14-deriving-optimization': ['nc-two-sum', 'nc-product-of-array-except-self', 'nc-longest-substring-without-repeating-characters', 'nc-daily-temperatures', 'nc-longest-increasing-subsequence', 'nc-trapping-rain-water'],
  'a14-complexity-in-interview': ['nc-contains-duplicate', 'nc-top-k-frequent-elements', 'nc-longest-consecutive-sequence', 'nc-kth-largest-element-in-array', 'nc-median-of-two-sorted-arrays'],
  'a14-edge-cases': ['nc-reverse-integer', 'nc-binary-search', 'nc-sqrt-x', 'nc-search-in-rotated-sorted-array', 'nc-remove-nth-node-from-end', 'nc-merge-intervals'],
  'a14-manual-testing': ['nc-valid-palindrome', 'nc-binary-search', 'nc-spiral-matrix', 'nc-reverse-linked-list', 'nc-merge-two-sorted-lists'],
  'a14-thinking-aloud': ['nc-group-anagrams', 'nc-merge-intervals', 'nc-number-of-islands', 'nc-course-schedule', 'nc-coin-change'],
  'a14-responding-to-hints': ['nc-longest-consecutive-sequence', 'nc-product-of-array-except-self', 'nc-container-with-most-water', 'nc-koko-eating-bananas', 'nc-jump-game'],
  'a14-clean-coding': ['nc-valid-parentheses', 'nc-merge-intervals', 'nc-number-of-islands', 'nc-lru-cache', 'nc-implement-trie'],
  'a14-timed-coding': ['nc-two-sum', 'nc-valid-anagram', 'nc-best-time-to-buy-and-sell-stock', 'nc-number-of-islands', 'nc-coin-change', 'nc-lru-cache', 'nc-merge-k-sorted-lists'],
}
