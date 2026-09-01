import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'HashMap<K,V> stores key-value pairs with average O(1) get, put, and remove via hashing. The workhorse for frequency counts, first/last index, complement lookup, and grouping in DSA.',
  whyExists:
    'Arrays index by contiguous integers; many problems need “have I seen this value/state before?” or “count occurrences.” HashMap generalizes constant-time associative lookup to arbitrary hashable keys.',
  mentalModel:
    'hash(key) → bucket index → chain or tree of entries. equals() decides match in bucket. Think: labeled drawer system; collision = multiple keys in same drawer.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'put(k, v): insert or replace value for key.',
        'get(k): returns value or null (missing key).',
        'getOrDefault(k, d): avoid null check.',
        'merge(k, v, remappingFunction): atomic update for counts.',
        'computeIfAbsent(k, f): lazy insert (e.g. adjacency list node).',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Frequency count + two-sum pattern',
      code: `Map<Integer, Integer> freq = new HashMap<>();
for (int x : nums) freq.merge(x, 1, Integer::sum);

Map<Integer, Integer> seen = new HashMap<>();
for (int i = 0; i < nums.length; i++) {
    int need = target - nums[i];
    if (seen.containsKey(need)) return new int[]{seen.get(need), i};
    seen.put(nums[i], i);
}`,
    },
    {
      type: 'table',
      headers: ['Method', 'Use case'],
      rows: [
        ['merge(k,1,Integer::sum)', 'Frequency / tally'],
        ['computeIfAbsent(k, x -> new ArrayList<>())', 'Graph adjacency map'],
        ['putIfAbsent', 'First occurrence wins'],
        ['containsKey', 'Membership before get'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Key contract',
      text: 'Keys must not mutate after insert if hashCode/equals depend on mutable fields. Prefer immutable keys (Integer, String, record).',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  K[key] --> H[hashCode spread]
  H --> B[bucket]
  B --> E{equals match?}
  E -->|yes| V[value]
  E -->|no| Next[next in chain]`,
    caption: 'HashMap lookup path',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Subarray sum equals k: prefix sum map stores count of each prefix seen. At prefix s, add map.getOrDefault(s-k,0) to answer, then map.merge(s,1,Integer::sum).',
    },
  ],
  complexity: {
    average: 'O(1) get/put/remove',
    worst: 'O(n) if all keys collide (rare with good hash)',
    space: 'O(n) entries',
    notes: 'Iteration O(capacity + size); avoid iterating huge empty maps.',
  },
  patternRecognition: [
    'Need O(1) lookup by value, index, or composite state.',
    'Count frequency, track first/last index, group anagrams.',
    'Prefix sum + target difference → map of prefix counts.',
    'Complement: store seen values while scanning.',
  ],
  commonMistakes: [
    'Using mutable object as key then changing it.',
    'get() null conflated with stored null value—use containsKey.',
    'Integer vs int: unboxing NPE if get returns null.',
    'Forgetting merge/getOrDefault for counting.',
  ],
  tradeoffs: {
    advantages: ['Expected O(1) operations', 'Rich Map API', 'Works with any proper key type'],
    disadvantages: ['Not ordered', 'Not thread-safe', 'Worst-case collisions O(n)'],
    alternatives: ['int[] when keys in small range [0..n]', 'TreeMap when need sorted keys', 'HashSet when no value needed'],
    whenToUse: ['Frequency', 'Complement lookup', 'Memoization cache'],
    whenNotToUse: ['Need sorted traversal', 'Keys not hashable / mutable'],
  },
  failureModes: [
    'Wrong answer from bad hashCode on custom class.',
    'Memory limit from storing too many distinct keys/states.',
  ],
  interview: {
    expectations: [
      'State O(n) map approach vs O(n²) brute force',
      'Know merge / getOrDefault idioms',
      'Mention key immutability for custom types',
    ],
    commonQuestions: ['Two Sum', 'Group Anagrams', 'Subarray sum equals K'],
    followUps: ['What if duplicates allowed?', 'TreeMap instead?'],
    misconceptions: ['HashMap iterates in insertion order (that is LinkedHashMap)'],
    traps: ['Null key allowed once; null value allowed'],
    strongSignals: ['Uses prefix sum + HashMap pattern cleanly'],
  },
  keyTakeaways: [
    'Average O(1) get/put with good hash keys.',
    'merge and getOrDefault are counting idioms.',
    'Immutable keys; never mutate key fields in map.',
    'Two Sum / prefix sum = classic map patterns.',
    'Use int[] when key range is small and dense.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'HashMap get vs getOrDefault?',
      answerHint: 'get returns null if missing; getOrDefault returns provided default without null ambiguity for counting.',
    },
    {
      level: 'intermediate',
      question: 'Why must equal keys have equal hashCodes?',
      answerHint: 'Contract: equals true ⇒ same hash; else bucket lookup misses entries.',
    },
    {
      level: 'advanced',
      question: 'When is TreeMap better than HashMap?',
      answerHint: 'Need sorted keys, floor/ceiling, range queries O(log n).',
    },
  ],
  flashcards: [
    {
      front: 'Count frequency one-liner',
      back: 'freq.merge(x, 1, Integer::sum);',
    },
    {
      front: 'HashMap average get/put',
      back: 'O(1) expected; O(n) worst case all collide.',
    },
  ],
  quickRevision: [
    'Key → hash → bucket → equals',
    'merge / getOrDefault for counts',
    'Immutable keys only',
    'Two Sum, prefix sum patterns',
    'Not ordered; not thread-safe',
    'int[] if keys in [0,n]',
  ],
}
