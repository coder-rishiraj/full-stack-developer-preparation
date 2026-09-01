import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Hashing maps keys (values, indices, tuples) to buckets via a hash function so average O(1) insert, lookup, and delete—turning “find complement / count frequency” problems from O(n²) into O(n).',
  whyExists:
    'Arrays give O(1) index access but O(n) search by value. Hash tables trade space for expected constant-time membership and counting—core to Two Sum, anagrams, subarray sum equals k, and deduplication.',
  mentalModel:
    'A hash map is a labeled drawer: each key lands in a drawer computed from its hash; collisions chain or probe to the right drawer. You ask “have I seen this before?” or “how many?” in one hop on average.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Choose key: value, index, frequency vector fingerprint, or composite (i,j).',
        'On each element, query map for needed complement or update count.',
        'Insert current state before advancing (or after, depending on problem).',
        'For subarray sums: prefixSum → count in map; add current prefix after processing.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Key design',
      text: 'Wrong key loses information—e.g. storing only value vs (value, index) for duplicate handling. For anagrams, sort string or 26-count array as key.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  E[Element] --> H[hash key]
  H --> B[Bucket]
  B --> Get{Lookup}
  Get -->|hit| Use[Update answer]
  Get -->|miss| Put[Insert / default]
  Put --> Next[Next element]`,
    caption: 'Hash map lookup per element',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Two Sum on [2,7,11,15], target 9: scan with map. At 11, map has 2→0; 11+? no. At 7, map has 2→0; 7+2=9 → return [1,0]. Insert each value after check (or complement before insert).',
    },
    {
      type: 'table',
      headers: ['i', 'val', 'map after', 'action'],
      rows: [
        ['0', '2', '{2:0}', 'insert'],
        ['1', '7', '{2:0,7:1}', 'found 2+7'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Complement lookup (Two Sum)',
      code: `Map<Integer, Integer> idx = new HashMap<>();
for (int i = 0; i < n; i++) {
    int need = target - a[i];
    if (idx.containsKey(need)) return new int[]{idx.get(need), i};
    idx.put(a[i], i);
}
return new int[]{-1, -1};`,
    },
    {
      language: 'java',
      caption: 'Prefix sum + frequency (subarray sum K)',
      code: `Map<Long, Integer> freq = new HashMap<>();
freq.put(0L, 1);
long pre = 0, ans = 0;
for (int x : nums) {
    pre += x;
    ans += freq.getOrDefault(pre - K, 0);
    freq.merge(pre, 1, Integer::sum);
}
return ans;`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Group Anagrams',
      code: `public List<List<String>> groupAnagrams(String[] strs) {
    Map<String, List<String>> groups = new HashMap<>();
    for (String s : strs) {
        int[] cnt = new int[26];
        for (char c : s.toCharArray()) cnt[c - 'a']++;
        String key = Arrays.toString(cnt);
        groups.computeIfAbsent(key, k -> new ArrayList<>()).add(s);
    }
    return new ArrayList<>(groups.values());
}`,
    },
  ],
  complexity: {
    best: 'O(n) average for single pass with O(1) map ops',
    average: 'O(n) time, O(n) space for index/frequency maps',
    worst: 'O(n²) if all keys collide (pathological); O(n log n) if tree map',
    space: 'O(n) keys typical; O(1) for fixed alphabet (26 counters)',
  },
  patternRecognition: [
    'Need O(1) “seen before?” or frequency count while scanning.',
    'Complement pair: target − x, pair with difference, zero-sum pair.',
    'Subarray/substring with sum or count constraint → prefix + map.',
    'Anagram / permutation equivalence → canonical key.',
    'First duplicate, longest consecutive sequence (value → index set).',
  ],
  commonMistakes: [
    'Updating map before checking complement (using same element twice).',
    'Using int key for prefix sum when sums overflow → use long.',
    'Forgetting initial map entry (prefix 0 count 1 for subarray sum).',
    'Mutable keys (arrays/lists) without copying—key changes in map.',
  ],
  variations: [
    'HashSet for existence only (cycle detection in value space)',
    'LinkedHashMap for insertion order; TreeMap for sorted keys',
    'Rolling hash (Rabin-Karp) for substring search',
    'Custom hash for tuples / state compression in DP',
  ],
  tradeoffs: {
    advantages: [
      'Expected O(1) lookups',
      'Simple interview code',
      'Handles unsorted data without preprocessing',
    ],
    disadvantages: [
      'Extra space O(n)',
      'Worst-case degradation without balanced structures',
      'Key design errors are subtle',
    ],
    alternatives: ['Sort + two pointers for pairs', 'Array of size m for bounded keys', 'Bloom filter for approximate membership'],
    whenToUse: ['Complement / frequency / last-seen index', 'Unsorted one-pass', 'Count subarrays with sum K'],
    whenNotToUse: ['Sorted static array pair sum (two pointers)', 'Order-statistics need TreeMap'],
  },
  failureModes: [
    'HashCode/equals bugs on custom objects.',
    'Concurrent modification if iterating and mutating poorly.',
  ],
  interview: {
    expectations: [
      'State brute force then hash map optimization',
      'Clarify insert vs lookup order',
      'Mention average vs worst case briefly',
    ],
    commonQuestions: [
      'Two Sum',
      'Subarray Sum Equals K',
      'Valid Anagram / Group Anagrams',
      'Longest Consecutive Sequence',
    ],
    followUps: ['What if multiple answers?', 'Space O(1) for Two Sum II → sorted two pointers'],
    misconceptions: ['Hash map always beats sorting'],
    traps: ['Subarray sum K missing freq(0)=1', 'Integer overflow in prefix sums'],
    strongSignals: ['Names correct key type and update order'],
  },
  keyTakeaways: [
    'Complement lookup: check need, then insert current.',
    'Prefix sum + freq map counts subarrays with sum K.',
    'Canonical key for anagrams: 26-count or sorted string.',
    'Average O(1) map ops → O(n) scan.',
    'Use long for cumulative sums when needed.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Two Sum unsorted approach?',
      answerHint: 'HashMap value→index; for each x check target−x then put x.',
    },
    {
      level: 'intermediate',
      question: 'Why put prefix 0 with count 1 in subarray sum K?',
      answerHint: 'Subarray from start equals K when prefix−K seen before.',
    },
    {
      level: 'advanced',
      question: 'Longest Consecutive Sequence in O(n)?',
      answerHint: 'HashSet of all nums; start sequence only at num-1 absent; expand num++.',
    },
  ],
  flashcards: [
    {
      front: 'Subarray sum K map invariant',
      back: 'freq(prefix) counts ways prefix sum occurred; add freq(prefix−K) each step.',
    },
    {
      front: 'Two Sum map update order',
      back: 'Check complement first, then insert current index.',
    },
  ],
  quickRevision: [
    'Complement / count / last index → hash map',
    'Check then insert (avoid double-use)',
    'Prefix sum + freq → subarray sum K',
    'Anagram key = char counts or sort',
    'O(n) avg time, O(n) space',
    'long prefix sums if needed',
    'freq(0)=1 for prefix subarrays',
  ],
}
