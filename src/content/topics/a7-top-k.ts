import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Top-K problems ask for the K largest, smallest, or most frequent elements in a stream or array without full sorting. A size-K heap (min heap for top-K largest, max heap for K smallest) maintains the answer in O(n log k) time and O(k) space.',
  whyExists:
    'Sorting all n elements costs O(n log n) and wastes work when only K matter. Heaps, quickselect, and bucket sort offer better bounds when K ≪ n or when data arrives online. Interviews test whether you pick the right heap polarity and tie-breaking.',
  mentalModel:
    'Keep a VIP list of size K. For top-K largest: min heap holds the K best so far—the root is the weakest VIP, evicted when someone better arrives. For K smallest: max heap at root is the cutoff. Never sort everything if a size-K window suffices.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Top-K largest: min heap size K; if size > K poll min; final heap = answer.',
        'Top-K smallest: max heap size K (reverse comparator).',
        'Top-K frequent: count frequencies, min heap on (freq, key) size K.',
        'K closest to origin: max heap on distance size K; poll evicts farthest among kept.',
        'Quickselect alternative: O(n) average, O(n²) worst—partition around pivot.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Heap polarity cheat sheet',
      text: 'Want K largest → min heap (root = smallest of top K, easy to evict). Want K smallest → max heap. Frequent/closest: heap on the metric you evict (freq or distance), not the key alone.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Stream[Each element] --> Heap[Size-K heap]
  Heap --> Over{size > K?}
  Over -->|yes| Evict[Poll weakest in heap]
  Over -->|no| Keep[Keep in heap]
  Evict --> Heap
  Keep --> Ans[Root/peek or extract all]`,
    caption: 'Streaming top-K with bounded heap',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Top 3 largest in [3,1,4,1,5,9,2,6]: min heap after stream—add 3,1,4 (size 3); add 1 no change; add 5 evict 1 → [3,4,5]; continue → final heap {5,6,9} (order varies). Kth largest = peek after maintaining size k.',
    },
    {
      type: 'table',
      headers: ['goal', 'heap type', 'comparator key', 'time'],
      rows: [
        ['K largest', 'min heap', 'value ascending', 'O(n log k)'],
        ['K smallest', 'max heap', 'value descending', 'O(n log k)'],
        ['K most frequent', 'min heap', 'frequency', 'O(n log k)'],
        ['K closest points', 'max heap', 'distance', 'O(n log k)'],
        ['Full sort', '—', '—', 'O(n log n)'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Kth largest element (min heap size k)',
      code: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> min = new PriorityQueue<>();
    for (int x : nums) {
        min.offer(x);
        if (min.size() > k) min.poll();
    }
    return min.peek();
}`,
    },
    {
      language: 'java',
      caption: 'Top K frequent elements',
      code: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> cnt = new HashMap<>();
    for (int x : nums) cnt.merge(x, 1, Integer::sum);
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]);
    for (var e : cnt.entrySet()) {
        pq.offer(new int[]{e.getKey(), e.getValue()});
        if (pq.size() > k) pq.poll();
    }
    return pq.stream().mapToInt(a -> a[0]).toArray();
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'K closest points to origin',
      code: `public int[][] kClosest(int[][] points, int k) {
    PriorityQueue<int[]> max = new PriorityQueue<>((a, b) -> {
        int da = a[0]*a[0] + a[1]*a[1];
        int db = b[0]*b[0] + b[1]*b[1];
        return Integer.compare(db, da);
    });
    for (int[] p : points) {
        max.offer(p);
        if (max.size() > k) max.poll();
    }
    int[][] ans = new int[k][2];
    for (int i = k - 1; i >= 0; i--) ans[i] = max.poll();
    return ans;
}`,
    },
  ],
  complexity: {
    best: 'O(n) quickselect average for single Kth',
    average: 'O(n log k) heap; O(n) quickselect',
    worst: 'O(n log n) if k≈n or full sort; O(n²) quickselect worst',
    space: 'O(k) heap; O(1) quickselect in-place',
  },
  patternRecognition: [
    '“K largest/smallest/frequent/closest” in array or stream.',
    'Online median uses two heaps—not pure top-K but related.',
    'Reorganize string by frequency → max heap on counts.',
    'Sort characters by frequency descending → bucket sort O(n) when alphabet bounded.',
    'Merge K sorted lists is k-way merge, not top-K—but same PQ intuition.',
  ],
  commonMistakes: [
    'Wrong heap polarity (min vs max) for largest vs smallest.',
    'Using (a,b) -> b-a instead of Integer.compare(b,a)—integer overflow.',
    'Sorting entire map when only top K frequencies needed.',
    'Forgetting tie-breakers in PQ comparators when keys equal.',
    'Confusing Kth largest (min heap k) with Kth smallest (max heap k).',
  ],
  variations: [
    'Quickselect / nth_element for O(n) average single Kth',
    'Bucket sort for top-K frequent when freq ≤ n',
    'TreeMap for dynamic top-K with removals',
    'Multi-criteria top-K: lexicographic comparator on (freq, value)',
  ],
  tradeoffs: {
    advantages: [
      'O(n log k) beats full sort when k ≪ n',
      'O(k) memory for streaming',
      'Simple PriorityQueue API in Java',
    ],
    disadvantages: [
      'Heap slower than quickselect for one-shot Kth',
      'PQ remove/contains O(n)—avoid',
      'Order of equal keys not guaranteed without tie-break',
    ],
    alternatives: ['Full sort O(n log n)', 'Quickselect O(n) avg', 'Bucket sort bounded range'],
    whenToUse: ['K ≪ n', 'Streaming data', 'K frequent/closest/largest'],
    whenNotToUse: ['Need full sorted output', 'K ≈ n (just sort)', 'Need exact nth with O(1) space and one query'],
  },
  failureModes: [
    'Comparator not transitive → PriorityQueue throws or wrong order.',
    'Off-by-one: kth vs top k elements (size k vs k-1).',
    'Distance overflow on coordinates—use long for dist² or compare cross-multiply.',
  ],
  interview: {
    expectations: [
      'State heap type and why in one sentence',
      'O(n log k) time O(k) space',
      'Mention quickselect as alternative for single Kth',
    ],
    commonQuestions: [
      'Kth Largest Element in Array',
      'Top K Frequent Elements',
      'K Closest Points to Origin',
      'Find K Pairs with Smallest Sums',
    ],
    followUps: ['What if stream is infinite?', 'Duplicates handling?', 'Quickselect vs heap?'],
    misconceptions: ['Always sort first', 'Max heap for K largest'],
    traps: ['K=1 still use heap vs linear scan', 'Top K frequent: min heap on freq not max on key'],
    strongSignals: ['Explains polarity without prompting', 'Handles ties in comparator', 'Mentions bucket sort when freq bounded'],
  },
  keyTakeaways: [
    'K largest → min heap size K; K smallest → max heap size K.',
    'O(n log k) time, O(k) space for heap approach.',
    'Top K frequent: count then min heap on frequency.',
    'Integer.compare for comparators—never b-a.',
    'Quickselect O(n) avg when only one Kth needed.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Which heap for K largest elements?',
      answerHint: 'Min heap size K—root is smallest among top K, evicted when larger arrives.',
    },
    {
      level: 'intermediate',
      question: 'Complexity of top-K with heap vs full sort?',
      answerHint: 'Heap O(n log k) O(k) space; sort O(n log n) O(n). Heap wins when k ≪ n.',
    },
    {
      level: 'advanced',
      question: 'When prefer quickselect over heap?',
      answerHint: 'Single Kth query, in-place ok, average O(n) acceptable; worst O(n²) rare with random pivot.',
    },
  ],
  flashcards: [
    {
      front: 'Top-K largest heap type',
      back: 'Min heap of size K.',
    },
    {
      front: 'Top-K heap time/space',
      back: 'O(n log k) time, O(k) space.',
    },
  ],
  quickRevision: [
    'K largest → min heap size K',
    'K smallest → max heap size K',
    'Frequent → count + min heap on freq',
    'O(n log k) not O(n log n)',
    'Integer.compare not b-a',
    'Quickselect for one-shot Kth',
    'Closest → max heap on distance',
  ],
}
