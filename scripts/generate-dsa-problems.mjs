/**
 * Generates Phase 3 DSA problem indexes from embedded NeetCode 250 + CSES lists.
 * Run: node scripts/generate-dsa-problems.mjs
 */
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.join(root, '../src/content/problems')

const NC_CAT = {
  'ARRAYS & HASHING': {
    category: 'arrays-hashing',
    primaryTopic: 'a2-hashing',
    primaryPattern: 'arrays-hashing',
    secondary: ['hashing'],
  },
  'TWO POINTERS': {
    category: 'two-pointers',
    primaryTopic: 'a2-two-pointers',
    primaryPattern: 'two-pointers',
    secondary: [],
  },
  'SLIDING WINDOW': {
    category: 'sliding-window',
    primaryTopic: 'a2-sliding-window',
    primaryPattern: 'sliding-window',
    secondary: [],
  },
  STACK: {
    category: 'stack',
    primaryTopic: 'a5-stack',
    primaryPattern: 'stack',
    secondary: [],
  },
  'BINARY SEARCH': {
    category: 'binary-search',
    primaryTopic: 'a3-binary-search',
    primaryPattern: 'binary-search',
    secondary: [],
  },
  'LINKED LIST': {
    category: 'linked-list',
    primaryTopic: 'a4-singly-linked-lists',
    primaryPattern: 'linked-list',
    secondary: [],
  },
  TREES: {
    category: 'trees',
    primaryTopic: 'a6-binary-trees',
    primaryPattern: 'trees',
    secondary: [],
  },
  'HEAP / PRIORITY QUEUE': {
    category: 'heap',
    primaryTopic: 'a7-priority-queues',
    primaryPattern: 'heap',
    secondary: ['priority-queue'],
  },
  BACKTRACKING: {
    category: 'backtracking',
    primaryTopic: 'a9-subsets',
    primaryPattern: 'backtracking',
    secondary: [],
  },
  TRIE: {
    category: 'trie',
    primaryTopic: 'a12-trie',
    primaryPattern: 'trie',
    secondary: [],
  },
  GRAPHS: {
    category: 'graphs',
    primaryTopic: 'a8-graph-representation',
    primaryPattern: 'graphs',
    secondary: [],
  },
  'ADVANCED GRAPHS': {
    category: 'advanced-graphs',
    primaryTopic: 'a8-dijkstra',
    primaryPattern: 'advanced-graphs',
    secondary: ['graphs'],
  },
  '1D DYNAMIC PROGRAMMING': {
    category: '1d-dp',
    primaryTopic: 'a11-1d-dp',
    primaryPattern: '1d-dp',
    secondary: ['dp'],
  },
  '2D DYNAMIC PROGRAMMING': {
    category: '2d-dp',
    primaryTopic: 'a11-2d-dp',
    primaryPattern: '2d-dp',
    secondary: ['dp'],
  },
  GREEDY: {
    category: 'greedy',
    primaryTopic: 'a10-sorting-greedy',
    primaryPattern: 'greedy',
    secondary: [],
  },
  INTERVALS: {
    category: 'intervals',
    primaryTopic: 'a2-intervals',
    primaryPattern: 'intervals',
    secondary: [],
  },
  'MATH & GEOMETRY': {
    category: 'math-geometry',
    primaryTopic: 'a2-matrix',
    primaryPattern: 'math-geometry',
    secondary: [],
  },
  'BIT MANIPULATION': {
    category: 'bit-manipulation',
    primaryTopic: 'a13-and-or-xor',
    primaryPattern: 'bit-manipulation',
    secondary: [],
  },
}

/**
 * Curated starter problems kept on the Java competitive-syntax topic.
 * Everything else in INTRODUCTORY PROBLEMS maps to Arrays & Strings practice.
 */
const CSES_TOPIC_OVERRIDES = {
  'Weird Algorithm': 'a1-java-syntax-competitive',
  'Missing Number': 'a1-java-syntax-competitive',
  'Repetitions': 'a1-java-syntax-competitive',
  'Increasing Array': 'a1-java-syntax-competitive',
  'Tower of Hanoi': 'a1-recursion',
  'Creating Strings': 'a1-recursion',
  'Gray Code': 'a1-recursion',
  'Palindrome Reorder': 'a1-strings-stringbuilder',
  'String Reorder': 'a1-strings-stringbuilder',
  'Chessboard and Queens': 'a9-subsets',
}

const CSES_CAT = {
  'INTRODUCTORY PROBLEMS': {
    category: 'introductory',
    primaryTopic: 'a2-array-string-traversal',
    primaryPattern: 'introductory',
    secondary: [],
  },
  'SORTING AND SEARCHING': {
    category: 'sorting-searching',
    primaryTopic: 'a3-binary-search',
    primaryPattern: 'sorting-searching',
    secondary: [],
  },
  'DYNAMIC PROGRAMMING': {
    category: 'dynamic-programming',
    primaryTopic: 'a11-1d-dp',
    primaryPattern: 'dp',
    secondary: [],
  },
  'GRAPH ALGORITHMS': {
    category: 'graph-algorithms',
    primaryTopic: 'a8-graph-representation',
    primaryPattern: 'graphs',
    secondary: [],
  },
  'RANGE QUERIES': {
    category: 'range-queries',
    primaryTopic: 'a12-segment-trees',
    primaryPattern: 'range-queries',
    secondary: [],
  },
  'TREE ALGORITHMS': {
    category: 'tree-algorithms',
    primaryTopic: 'a6-binary-trees',
    primaryPattern: 'trees',
    secondary: [],
  },
  MATHEMATICS: {
    category: 'mathematics',
    primaryTopic: 'a1-big-o',
    primaryPattern: 'mathematics',
    secondary: [],
  },
  'STRING ALGORITHMS': {
    category: 'string-algorithms',
    primaryTopic: 'a1-strings-stringbuilder',
    primaryPattern: 'strings',
    secondary: [],
  },
  GEOMETRY: {
    category: 'geometry',
    primaryTopic: 'a2-matrix',
    primaryPattern: 'geometry',
    secondary: [],
  },
  'ADVANCED TECHNIQUES': {
    category: 'advanced-techniques',
    primaryTopic: 'a12-segment-trees',
    primaryPattern: 'advanced',
    secondary: [],
  },
  'SLIDING WINDOW PROBLEMS': {
    category: 'sliding-window',
    primaryTopic: 'a2-sliding-window',
    primaryPattern: 'sliding-window',
    secondary: [],
  },
  'INTERACTIVE PROBLEMS': {
    category: 'interactive',
    primaryTopic: 'a14-timed-coding',
    primaryPattern: 'interactive',
    secondary: [],
  },
  'BITWISE OPERATIONS': {
    category: 'bitwise',
    primaryTopic: 'a13-and-or-xor',
    primaryPattern: 'bit-manipulation',
    secondary: [],
  },
  'CONSTRUCTION PROBLEMS': {
    category: 'construction',
    primaryTopic: 'a2-matrix',
    primaryPattern: 'construction',
    secondary: [],
  },
  'ADVANCED GRAPH PROBLEMS': {
    category: 'advanced-graphs',
    primaryTopic: 'a8-dijkstra',
    primaryPattern: 'advanced-graphs',
    secondary: ['graphs'],
  },
  'COUNTING PROBLEMS': {
    category: 'counting',
    primaryTopic: 'a11-1d-dp',
    primaryPattern: 'counting',
    secondary: [],
  },
  'ADDITIONAL PROBLEMS I': {
    category: 'additional-1',
    primaryTopic: 'a14-timed-coding',
    primaryPattern: 'additional',
    secondary: [],
  },
  'ADDITIONAL PROBLEMS II': {
    category: 'additional-2',
    primaryTopic: 'a14-timed-coding',
    primaryPattern: 'additional',
    secondary: [],
  },
}

/** Manual fills for CSES rows that lacked a task URL in the source paste. */
const CSES_URL_OVERRIDES = {
  'Apple Division': { id: '1623', verified: true },
  'Chessboard and Queens': { id: '1624', verified: true },
  'Raab Game I': { id: '3399', verified: true },
  'Mex Grid Construction': { id: '3419', verified: true },
  'Knight Moves Grid': { id: '3217', verified: true },
  'Grid Coloring I': { id: '3311', verified: true },
  'Digit Queries': { id: '2431', verified: true },
  'String Reorder': { id: '1743', verified: true },
  'Grid Path Description': { id: '1625', verified: true },
}

function slug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function diff(d) {
  const x = d.toLowerCase()
  if (x === 'easy') return 'easy'
  if (x === 'medium') return 'medium'
  if (x === 'hard') return 'hard'
  return 'unknown'
}

function priorityFor(diff, source) {
  if (source === 'neetcode250') {
    if (diff === 'hard') return 'tier1'
    if (diff === 'medium') return 'tier1'
    return 'tier1'
  }
  // CSES: core sections tier1, additional/advanced tier2/3
  return 'tier1'
}

function lit(s) {
  return JSON.stringify(s)
}

function emitProblem(p) {
  return `  {
    id: ${lit(p.id)},
    name: ${lit(p.name)},
    source: ${lit(p.source)},
    sourceUrl: ${lit(p.sourceUrl)},
    sourceId: ${p.sourceId ? lit(p.sourceId) : 'undefined'},
    urlVerified: ${p.urlVerified},
    category: ${lit(p.category)},
    primaryTopic: ${lit(p.primaryTopic)},
    primaryPattern: ${lit(p.primaryPattern)},
    secondaryPatterns: ${lit(p.secondaryPatterns)},
    difficulty: ${lit(p.difficulty)},
    priority: ${lit(p.priority)},
    listOrder: ${p.listOrder},
  }`
}

// --- NeetCode data (category headers + problems) ---
const neetcodeRaw = `
ARRAYS & HASHING
1|Concatenation of Array|Easy|https://leetcode.com/problems/concatenation-of-array/
2|Contains Duplicate|Easy|https://leetcode.com/problems/contains-duplicate/
3|Valid Anagram|Easy|https://leetcode.com/problems/valid-anagram/
4|Two Sum|Easy|https://leetcode.com/problems/two-sum/
5|Longest Common Prefix|Easy|https://leetcode.com/problems/longest-common-prefix/
6|Group Anagrams|Medium|https://leetcode.com/problems/group-anagrams/
7|Remove Element|Easy|https://leetcode.com/problems/remove-element/
8|Majority Element|Easy|https://leetcode.com/problems/majority-element/
9|Design HashSet|Easy|https://leetcode.com/problems/design-hashset/
10|Design HashMap|Easy|https://leetcode.com/problems/design-hashmap/
11|Sort an Array|Medium|https://leetcode.com/problems/sort-an-array/
12|Sort Colors|Medium|https://leetcode.com/problems/sort-colors/
13|Top K Frequent Elements|Medium|https://leetcode.com/problems/top-k-frequent-elements/
14|Encode and Decode Strings|Medium|https://leetcode.com/problems/encode-and-decode-strings/
15|Range Sum Query 2D - Immutable|Medium|https://leetcode.com/problems/range-sum-query-2d-immutable/
16|Product of Array Except Self|Medium|https://leetcode.com/problems/product-of-array-except-self/
17|Valid Sudoku|Medium|https://leetcode.com/problems/valid-sudoku/
18|Longest Consecutive Sequence|Medium|https://leetcode.com/problems/longest-consecutive-sequence/
19|Best Time to Buy/Sell Stock II|Medium|https://leetcode.com/problems/best-time-to-buy-and-sell-stock-ii/
20|Majority Element II|Medium|https://leetcode.com/problems/majority-element-ii/
21|Subarray Sum Equals K|Medium|https://leetcode.com/problems/subarray-sum-equals-k/
22|First Missing Positive|Hard|https://leetcode.com/problems/first-missing-positive/
TWO POINTERS
23|Reverse String|Easy|https://leetcode.com/problems/reverse-string/
24|Valid Palindrome|Easy|https://leetcode.com/problems/valid-palindrome/
25|Valid Palindrome II|Easy|https://leetcode.com/problems/valid-palindrome-ii/
26|Merge Strings Alternately|Easy|https://leetcode.com/problems/merge-strings-alternately/
27|Merge Sorted Array|Easy|https://leetcode.com/problems/merge-sorted-array/
28|Remove Duplicates from Sorted Array|Easy|https://leetcode.com/problems/remove-duplicates-from-sorted-array/
29|Two Sum II - Input Array Is Sorted|Medium|https://leetcode.com/problems/two-sum-ii-input-array-is-sorted/
30|3Sum|Medium|https://leetcode.com/problems/3sum/
31|4Sum|Medium|https://leetcode.com/problems/4sum/
32|Rotate Array|Medium|https://leetcode.com/problems/rotate-array/
33|Container With Most Water|Medium|https://leetcode.com/problems/container-with-most-water/
34|Boats to Save People|Medium|https://leetcode.com/problems/boats-to-save-people/
35|Trapping Rain Water|Hard|https://leetcode.com/problems/trapping-rain-water/
SLIDING WINDOW
36|Contains Duplicate II|Easy|https://leetcode.com/problems/contains-duplicate-ii/
37|Best Time to Buy and Sell Stock|Easy|https://leetcode.com/problems/best-time-to-buy-and-sell-stock/
38|Longest Substring Without Repeating Characters|Medium|https://leetcode.com/problems/longest-substring-without-repeating-characters/
39|Longest Repeating Character Replacement|Medium|https://leetcode.com/problems/longest-repeating-character-replacement/
40|Permutation In String|Medium|https://leetcode.com/problems/permutation-in-string/
41|Minimum Size Subarray Sum|Medium|https://leetcode.com/problems/minimum-size-subarray-sum/
42|Find K Closest Elements|Medium|https://leetcode.com/problems/find-k-closest-elements/
43|Minimum Window Substring|Hard|https://leetcode.com/problems/minimum-window-substring/
44|Sliding Window Maximum|Hard|https://leetcode.com/problems/sliding-window-maximum/
STACK
45|Baseball Game|Easy|https://leetcode.com/problems/baseball-game/
46|Valid Parentheses|Easy|https://leetcode.com/problems/valid-parentheses/
47|Implement Stack Using Queues|Easy|https://leetcode.com/problems/implement-stack-using-queues/
48|Implement Queue using Stacks|Easy|https://leetcode.com/problems/implement-queue-using-stacks/
49|Min Stack|Medium|https://leetcode.com/problems/min-stack/
50|Evaluate Reverse Polish Notation|Medium|https://leetcode.com/problems/evaluate-reverse-polish-notation/
51|Asteroid Collision|Medium|https://leetcode.com/problems/asteroid-collision/
52|Daily Temperatures|Medium|https://leetcode.com/problems/daily-temperatures/
53|Online Stock Span|Medium|https://leetcode.com/problems/online-stock-span/
54|Car Fleet|Medium|https://leetcode.com/problems/car-fleet/
55|Simplify Path|Medium|https://leetcode.com/problems/simplify-path/
56|Decode String|Medium|https://leetcode.com/problems/decode-string/
57|Maximum Frequency Stack|Hard|https://leetcode.com/problems/maximum-frequency-stack/
58|Largest Rectangle In Histogram|Hard|https://leetcode.com/problems/largest-rectangle-in-histogram/
BINARY SEARCH
59|Binary Search|Easy|https://leetcode.com/problems/binary-search/
60|Search Insert Position|Easy|https://leetcode.com/problems/search-insert-position/
61|Guess Number Higher Or Lower|Easy|https://leetcode.com/problems/guess-number-higher-or-lower/
62|Sqrt(x)|Easy|https://leetcode.com/problems/sqrtx/
63|Search a 2D Matrix|Medium|https://leetcode.com/problems/search-a-2d-matrix/
64|Koko Eating Bananas|Medium|https://leetcode.com/problems/koko-eating-bananas/
65|Capacity to Ship Packages Within D Days|Medium|https://leetcode.com/problems/capacity-to-ship-packages-within-d-days/
66|Find Minimum In Rotated Sorted Array|Medium|https://leetcode.com/problems/find-minimum-in-rotated-sorted-array/
67|Search In Rotated Sorted Array|Medium|https://leetcode.com/problems/search-in-rotated-sorted-array/
68|Search In Rotated Sorted Array II|Medium|https://leetcode.com/problems/search-in-rotated-sorted-array-ii/
69|Time Based Key-Value Store|Medium|https://leetcode.com/problems/time-based-key-value-store/
70|Split Array Largest Sum|Hard|https://leetcode.com/problems/split-array-largest-sum/
71|Median of Two Sorted Arrays|Hard|https://leetcode.com/problems/median-of-two-sorted-arrays/
72|Find in Mountain Array|Hard|https://leetcode.com/problems/find-in-mountain-array/
LINKED LIST
73|Reverse Linked List|Easy|https://leetcode.com/problems/reverse-linked-list/
74|Merge Two Sorted Lists|Easy|https://leetcode.com/problems/merge-two-sorted-lists/
75|Linked List Cycle|Easy|https://leetcode.com/problems/linked-list-cycle/
76|Reorder List|Medium|https://leetcode.com/problems/reorder-list/
77|Remove Nth Node From End|Medium|https://leetcode.com/problems/remove-nth-node-from-end-of-list/
78|Copy List With Random Pointer|Medium|https://leetcode.com/problems/copy-list-with-random-pointer/
79|Add Two Numbers|Medium|https://leetcode.com/problems/add-two-numbers/
80|Find The Duplicate Number|Medium|https://leetcode.com/problems/find-the-duplicate-number/
81|Reverse Linked List II|Medium|https://leetcode.com/problems/reverse-linked-list-ii/
82|Design Circular Queue|Medium|https://leetcode.com/problems/design-circular-queue/
83|LRU Cache|Medium|https://leetcode.com/problems/lru-cache/
84|LFU Cache|Hard|https://leetcode.com/problems/lfu-cache/
85|Merge K Sorted Lists|Hard|https://leetcode.com/problems/merge-k-sorted-lists/
86|Reverse Nodes In K Group|Hard|https://leetcode.com/problems/reverse-nodes-in-k-group/
TREES
87|Binary Tree Inorder Traversal|Easy|https://leetcode.com/problems/binary-tree-inorder-traversal/
88|Binary Tree Preorder Traversal|Easy|https://leetcode.com/problems/binary-tree-preorder-traversal/
89|Binary Tree Postorder Traversal|Easy|https://leetcode.com/problems/binary-tree-postorder-traversal/
90|Invert Binary Tree|Easy|https://leetcode.com/problems/invert-binary-tree/
91|Maximum Depth of Binary Tree|Easy|https://leetcode.com/problems/maximum-depth-of-binary-tree/
92|Diameter of Binary Tree|Easy|https://leetcode.com/problems/diameter-of-binary-tree/
93|Balanced Binary Tree|Easy|https://leetcode.com/problems/balanced-binary-tree/
94|Same Tree|Easy|https://leetcode.com/problems/same-tree/
95|Subtree of Another Tree|Easy|https://leetcode.com/problems/subtree-of-another-tree/
96|LCA of a BST|Medium|https://leetcode.com/problems/lowest-common-ancestor-of-a-binary-search-tree/
97|Insert into a BST|Medium|https://leetcode.com/problems/insert-into-a-binary-search-tree/
98|Delete Node in a BST|Medium|https://leetcode.com/problems/delete-node-in-a-bst/
99|Binary Tree Level Order Traversal|Medium|https://leetcode.com/problems/binary-tree-level-order-traversal/
100|Binary Tree Right Side View|Medium|https://leetcode.com/problems/binary-tree-right-side-view/
101|Construct Quad Tree|Medium|https://leetcode.com/problems/construct-quad-tree/
102|Count Good Nodes In Tree|Medium|https://leetcode.com/problems/count-good-nodes-in-binary-tree/
103|Validate BST|Medium|https://leetcode.com/problems/validate-binary-search-tree/
104|Kth Smallest Element In a BST|Medium|https://leetcode.com/problems/kth-smallest-element-in-a-bst/
105|Construct Tree from Pre/Inorder|Medium|https://leetcode.com/problems/construct-binary-tree-from-preorder-and-inorder-traversal/
106|House Robber III|Medium|https://leetcode.com/problems/house-robber-iii/
107|Delete Leaves With Given Value|Medium|https://leetcode.com/problems/delete-leaves-with-a-given-value/
108|Binary Tree Max Path Sum|Hard|https://leetcode.com/problems/binary-tree-maximum-path-sum/
109|Serialize/Deserialize Tree|Hard|https://leetcode.com/problems/serialize-and-deserialize-binary-tree/
HEAP / PRIORITY QUEUE
110|Kth Largest Element In Stream|Easy|https://leetcode.com/problems/kth-largest-element-in-a-stream/
111|Last Stone Weight|Easy|https://leetcode.com/problems/last-stone-weight/
112|K Closest Points to Origin|Medium|https://leetcode.com/problems/k-closest-points-to-origin/
113|Kth Largest Element In Array|Medium|https://leetcode.com/problems/kth-largest-element-in-an-array/
114|Task Scheduler|Medium|https://leetcode.com/problems/task-scheduler/
115|Design Twitter|Medium|https://leetcode.com/problems/design-twitter/
116|Single Threaded CPU|Medium|https://leetcode.com/problems/single-threaded-cpu/
117|Reorganize String|Medium|https://leetcode.com/problems/reorganize-string/
118|Longest Happy String|Medium|https://leetcode.com/problems/longest-happy-string/
119|Car Pooling|Medium|https://leetcode.com/problems/car-pooling/
120|Find Median From Data Stream|Hard|https://leetcode.com/problems/find-median-from-data-stream/
121|IPO|Hard|https://leetcode.com/problems/ipo/
BACKTRACKING
122|Sum of All Subsets XOR Total|Easy|https://leetcode.com/problems/sum-of-all-subsets-xor-total/
123|Subsets|Medium|https://leetcode.com/problems/subsets/
124|Combination Sum|Medium|https://leetcode.com/problems/combination-sum/
125|Combination Sum II|Medium|https://leetcode.com/problems/combination-sum-ii/
126|Combinations|Medium|https://leetcode.com/problems/combinations/
127|Permutations|Medium|https://leetcode.com/problems/permutations/
128|Subsets II|Medium|https://leetcode.com/problems/subsets-ii/
129|Permutations II|Medium|https://leetcode.com/problems/permutations-ii/
130|Generate Parentheses|Medium|https://leetcode.com/problems/generate-parentheses/
131|Word Search|Medium|https://leetcode.com/problems/word-search/
132|Palindrome Partitioning|Medium|https://leetcode.com/problems/palindrome-partitioning/
133|Letter Combinations of Phone|Medium|https://leetcode.com/problems/letter-combinations-of-a-phone-number/
134|Matchsticks to Square|Medium|https://leetcode.com/problems/matchsticks-to-square/
135|Partition to K Equal Sum Subsets|Medium|https://leetcode.com/problems/partition-to-k-equal-sum-subsets/
136|N-Queens|Hard|https://leetcode.com/problems/n-queens/
137|N-Queens II|Hard|https://leetcode.com/problems/n-queens-ii/
138|Word Break II|Hard|https://leetcode.com/problems/word-break-ii/
TRIE
139|Implement Trie|Medium|https://leetcode.com/problems/implement-trie-prefix-tree/
140|Design Add/Search Words|Medium|https://leetcode.com/problems/design-add-and-search-words-data-structure/
141|Extra Characters in a String|Medium|https://leetcode.com/problems/extra-characters-in-a-string/
142|Word Search II|Hard|https://leetcode.com/problems/word-search-ii/
GRAPHS
143|Island Perimeter|Easy|https://leetcode.com/problems/island-perimeter/
144|Verifying An Alien Dictionary|Easy|https://leetcode.com/problems/verifying-an-alien-dictionary/
145|Find the Town Judge|Easy|https://leetcode.com/problems/find-the-town-judge/
146|Number of Islands|Medium|https://leetcode.com/problems/number-of-islands/
147|Max Area of Island|Medium|https://leetcode.com/problems/max-area-of-island/
148|Clone Graph|Medium|https://leetcode.com/problems/clone-graph/
149|Walls And Gates|Medium|https://leetcode.com/problems/walls-and-gates/
150|Rotting Oranges|Medium|https://leetcode.com/problems/rotting-oranges/
151|Pacific Atlantic Water Flow|Medium|https://leetcode.com/problems/pacific-atlantic-water-flow/
152|Surrounded Regions|Medium|https://leetcode.com/problems/surrounded-regions/
153|Open The Lock|Medium|https://leetcode.com/problems/open-the-lock/
154|Course Schedule|Medium|https://leetcode.com/problems/course-schedule/
155|Course Schedule II|Medium|https://leetcode.com/problems/course-schedule-ii/
156|Graph Valid Tree|Medium|https://leetcode.com/problems/graph-valid-tree/
157|Course Schedule IV|Medium|https://leetcode.com/problems/course-schedule-iv/
158|Number of Connected Components|Medium|https://leetcode.com/problems/number-of-connected-components-in-an-undirected-graph/
159|Redundant Connection|Medium|https://leetcode.com/problems/redundant-connection/
160|Accounts Merge|Medium|https://leetcode.com/problems/accounts-merge/
161|Evaluate Division|Medium|https://leetcode.com/problems/evaluate-division/
162|Minimum Height Trees|Medium|https://leetcode.com/problems/minimum-height-trees/
163|Word Ladder|Hard|https://leetcode.com/problems/word-ladder/
ADVANCED GRAPHS
164|Path with Minimum Effort|Medium|https://leetcode.com/problems/path-with-minimum-effort/
165|Network Delay Time|Medium|https://leetcode.com/problems/network-delay-time/
166|Reconstruct Itinerary|Hard|https://leetcode.com/problems/reconstruct-itinerary/
167|Min Cost to Connect Points|Medium|https://leetcode.com/problems/min-cost-to-connect-all-points/
168|Swim In Rising Water|Hard|https://leetcode.com/problems/swim-in-rising-water/
169|Alien Dictionary|Hard|https://leetcode.com/problems/alien-dictionary/
170|Cheapest Flights Within K Stops|Medium|https://leetcode.com/problems/cheapest-flights-within-k-stops/
171|Find Critical/Pseudo Edges MST|Hard|https://leetcode.com/problems/find-critical-and-pseudo-critical-edges-in-minimum-spanning-tree/
172|Build Matrix With Conditions|Hard|https://leetcode.com/problems/build-a-matrix-with-conditions/
173|GCD Traversal|Hard|https://leetcode.com/problems/greatest-common-divisor-traversal/
1D DYNAMIC PROGRAMMING
174|Climbing Stairs|Easy|https://leetcode.com/problems/climbing-stairs/
175|Min Cost Climbing Stairs|Easy|https://leetcode.com/problems/min-cost-climbing-stairs/
176|N-th Tribonacci Number|Easy|https://leetcode.com/problems/n-th-tribonacci-number/
177|House Robber|Medium|https://leetcode.com/problems/house-robber/
178|House Robber II|Medium|https://leetcode.com/problems/house-robber-ii/
179|Longest Palindromic Substring|Medium|https://leetcode.com/problems/longest-palindromic-substring/
180|Palindromic Substrings|Medium|https://leetcode.com/problems/palindromic-substrings/
181|Decode Ways|Medium|https://leetcode.com/problems/decode-ways/
182|Coin Change|Medium|https://leetcode.com/problems/coin-change/
183|Maximum Product Subarray|Medium|https://leetcode.com/problems/maximum-product-subarray/
184|Word Break|Medium|https://leetcode.com/problems/word-break/
185|Longest Increasing Subsequence|Medium|https://leetcode.com/problems/longest-increasing-subsequence/
186|Partition Equal Subset Sum|Medium|https://leetcode.com/problems/partition-equal-subset-sum/
187|Combination Sum IV|Medium|https://leetcode.com/problems/combination-sum-iv/
188|Perfect Squares|Medium|https://leetcode.com/problems/perfect-squares/
189|Integer Break|Medium|https://leetcode.com/problems/integer-break/
190|Stone Game III|Hard|https://leetcode.com/problems/stone-game-iii/
2D DYNAMIC PROGRAMMING
191|Unique Paths|Medium|https://leetcode.com/problems/unique-paths/
192|Unique Paths II|Medium|https://leetcode.com/problems/unique-paths-ii/
193|Minimum Path Sum|Medium|https://leetcode.com/problems/minimum-path-sum/
194|Longest Common Subsequence|Medium|https://leetcode.com/problems/longest-common-subsequence/
195|Last Stone Weight II|Medium|https://leetcode.com/problems/last-stone-weight-ii/
196|Best Time to Buy and Sell Stock With Cooldown|Medium|https://leetcode.com/problems/best-time-to-buy-and-sell-stock-with-cooldown/
197|Coin Change II|Medium|https://leetcode.com/problems/coin-change-ii/
198|Target Sum|Medium|https://leetcode.com/problems/target-sum/
199|Interleaving String|Medium|https://leetcode.com/problems/interleaving-string/
200|Stone Game|Medium|https://leetcode.com/problems/stone-game/
201|Stone Game II|Medium|https://leetcode.com/problems/stone-game-ii/
202|Longest Increasing Path In a Matrix|Hard|https://leetcode.com/problems/longest-increasing-path-in-a-matrix/
203|Distinct Subsequences|Hard|https://leetcode.com/problems/distinct-subsequences/
204|Edit Distance|Medium|https://leetcode.com/problems/edit-distance/
205|Burst Balloons|Hard|https://leetcode.com/problems/burst-balloons/
206|Regular Expression Matching|Hard|https://leetcode.com/problems/regular-expression-matching/
GREEDY
207|Lemonade Change|Easy|https://leetcode.com/problems/lemonade-change/
208|Maximum Subarray|Medium|https://leetcode.com/problems/maximum-subarray/
209|Maximum Sum Circular Subarray|Medium|https://leetcode.com/problems/maximum-sum-circular-subarray/
210|Longest Turbulent Subarray|Medium|https://leetcode.com/problems/longest-turbulent-subarray/
211|Jump Game|Medium|https://leetcode.com/problems/jump-game/
212|Jump Game II|Medium|https://leetcode.com/problems/jump-game-ii/
213|Jump Game VII|Medium|https://leetcode.com/problems/jump-game-vii/
214|Gas Station|Medium|https://leetcode.com/problems/gas-station/
215|Hand of Straights|Medium|https://leetcode.com/problems/hand-of-straights/
216|Dota2 Senate|Medium|https://leetcode.com/problems/dota2-senate/
217|Merge Triplets to Form Target Triplet|Medium|https://leetcode.com/problems/merge-triplets-to-form-target-triplet/
218|Partition Labels|Medium|https://leetcode.com/problems/partition-labels/
219|Valid Parenthesis String|Medium|https://leetcode.com/problems/valid-parenthesis-string/
220|Candy|Hard|https://leetcode.com/problems/candy/
INTERVALS
221|Insert Interval|Medium|https://leetcode.com/problems/insert-interval/
222|Merge Intervals|Medium|https://leetcode.com/problems/merge-intervals/
223|Non Overlapping Intervals|Medium|https://leetcode.com/problems/non-overlapping-intervals/
224|Meeting Rooms|Easy|https://leetcode.com/problems/meeting-rooms/
225|Meeting Rooms II|Medium|https://leetcode.com/problems/meeting-rooms-ii/
226|Meeting Rooms III|Hard|https://leetcode.com/problems/meeting-rooms-iii/
227|Minimum Interval to Include Each Query|Hard|https://leetcode.com/problems/minimum-interval-to-include-each-query/
MATH & GEOMETRY
228|Excel Sheet Column Title|Easy|https://leetcode.com/problems/excel-sheet-column-title/
229|Greatest Common Divisor of Strings|Easy|https://leetcode.com/problems/greatest-common-divisor-of-strings/
230|Insert Greatest Common Divisors in Linked List|Medium|https://leetcode.com/problems/insert-greatest-common-divisors-in-linked-list/
231|Transpose Matrix|Easy|https://leetcode.com/problems/transpose-matrix/
232|Rotate Image|Medium|https://leetcode.com/problems/rotate-image/
233|Spiral Matrix|Medium|https://leetcode.com/problems/spiral-matrix/
234|Set Matrix Zeroes|Medium|https://leetcode.com/problems/set-matrix-zeroes/
235|Happy Number|Easy|https://leetcode.com/problems/happy-number/
236|Plus One|Easy|https://leetcode.com/problems/plus-one/
237|Roman to Integer|Easy|https://leetcode.com/problems/roman-to-integer/
238|Pow(x n)|Medium|https://leetcode.com/problems/powx-n/
239|Multiply Strings|Medium|https://leetcode.com/problems/multiply-strings/
240|Detect Squares|Medium|https://leetcode.com/problems/detect-squares/
BIT MANIPULATION
241|Single Number|Easy|https://leetcode.com/problems/single-number/
242|Number of 1 Bits|Easy|https://leetcode.com/problems/number-of-1-bits/
243|Counting Bits|Easy|https://leetcode.com/problems/counting-bits/
244|Add Binary|Easy|https://leetcode.com/problems/add-binary/
245|Reverse Bits|Easy|https://leetcode.com/problems/reverse-bits/
246|Missing Number|Easy|https://leetcode.com/problems/missing-number/
247|Sum of Two Integers|Medium|https://leetcode.com/problems/sum-of-two-integers/
248|Reverse Integer|Medium|https://leetcode.com/problems/reverse-integer/
249|Bitwise AND of Numbers Range|Medium|https://leetcode.com/problems/bitwise-and-of-numbers-range/
250|Minimum Array End|Medium|https://leetcode.com/problems/minimum-array-end/
`.trim()

function parseNeetcode() {
  let cat = null
  const out = []
  for (const line of neetcodeRaw.split('\n')) {
    const t = line.trim()
    if (!t) continue
    if (!/^\d+\|/.test(t)) {
      cat = t
      continue
    }
    const [num, name, difficulty, url] = t.split('|')
    const meta = NC_CAT[cat]
    if (!meta) throw new Error(`Unknown NC category: ${cat}`)
    const d = diff(difficulty)
    out.push({
      id: `nc-${slug(name)}`,
      name,
      source: 'neetcode250',
      sourceUrl: url,
      sourceId: String(num),
      urlVerified: true,
      category: meta.category,
      primaryTopic: meta.primaryTopic,
      primaryPattern: meta.primaryPattern,
      secondaryPatterns: meta.secondary,
      difficulty: d,
      priority: priorityFor(d, 'neetcode250'),
      listOrder: Number(num),
    })
  }
  return out
}

// CSES will be loaded from external file to keep this manageable
const csesPath = path.join(root, 'data/cses.tsv')

function parseCses() {
  const text = fs.readFileSync(csesPath, 'utf8')
  let cat = null
  const out = []
  for (const line of text.split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    if (t.startsWith('@')) {
      cat = t.slice(1)
      continue
    }
    const [num, name, urlField] = t.split('\t')
    const meta = CSES_CAT[cat]
    if (!meta) throw new Error(`Unknown CSES category: ${cat}`)

    let sourceId
    let sourceUrl
    let urlVerified = false

    const urlMatch = (urlField || '').match(/cses\.fi\/problemset\/task\/(\d+)/)
    if (urlMatch) {
      sourceId = urlMatch[1]
      sourceUrl = `https://cses.fi/problemset/task/${sourceId}`
      urlVerified = true
    } else if (CSES_URL_OVERRIDES[name]) {
      sourceId = CSES_URL_OVERRIDES[name].id
      sourceUrl = `https://cses.fi/problemset/task/${sourceId}`
      urlVerified = CSES_URL_OVERRIDES[name].verified
    } else {
      sourceUrl = 'https://cses.fi/problemset/'
      urlVerified = false
    }

    // Difficulty unknown for CSES in our schema
    out.push({
      id: `cses-${slug(name)}`,
      name,
      source: 'cses',
      sourceUrl,
      sourceId,
      urlVerified,
      category: meta.category,
      primaryTopic: CSES_TOPIC_OVERRIDES[name] ?? meta.primaryTopic,
      primaryPattern: meta.primaryPattern,
      secondaryPatterns: meta.secondary,
      difficulty: 'unknown',
      priority:
        cat.includes('ADDITIONAL') || cat.includes('ADVANCED') || cat === 'GEOMETRY'
          ? 'tier2'
          : cat.includes('INTERACTIVE') || cat.includes('CONSTRUCTION')
            ? 'tier2'
            : 'tier1',
      listOrder: Number(num),
    })
  }
  return out
}

function writeModule(filename, exportName, problems) {
  const body = `import type { DsaProblem } from '@/domain/types'

/** Auto-generated by scripts/generate-dsa-problems.mjs — do not edit by hand. */
export const ${exportName}: DsaProblem[] = [
${problems.map(emitProblem).join(',\n')}
]
`
  fs.writeFileSync(path.join(outDir, filename), body)
}

const nc = parseNeetcode()
const cses = parseCses()

if (nc.length !== 250) {
  console.error('NeetCode count expected 250, got', nc.length)
  process.exit(1)
}
if (cses.length < 390) {
  console.error('CSES count unexpectedly low:', cses.length)
  process.exit(1)
}

writeModule('neetcode250.ts', 'NEETCODE_250', nc)
writeModule('cses.ts', 'CSES_PROBLEMS', cses)

console.log(
  JSON.stringify(
    {
      neetcode: nc.length,
      cses: cses.length,
      csesVerified: cses.filter((p) => p.urlVerified).length,
      csesUnverified: cses.filter((p) => !p.urlVerified).length,
      total: nc.length + cses.length,
    },
    null,
    2,
  ),
)
