import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A max heap is a complete binary tree where each parent is ≥ its children—giving O(1) access to the maximum and O(log n) insert/extract-max. In Java, use PriorityQueue with reversed Comparator or Collections.reverseOrder().',
  whyExists:
    'Top-K smallest problems, median lower-half tracking, and "always take largest available" scheduling need fast max access. Max heap mirrors min heap with inverted comparisons in swim/sink.',
  mentalModel:
    'Same array-packed complete tree as min heap, but parents dominate children. Removing max replaces root with last element and sinks down choosing the larger child when both exist.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Max property: heap[i] ≥ heap[children].',
        'Insert: append, swim while greater than parent.',
        'Extract-max: poll root, place last at root, sink toward larger child.',
        'Java max heap: new PriorityQueue<>(Collections.reverseOrder()) or (a,b)->b-a with Integer.compare(b,a).',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Comparator overflow',
      text: 'Never use (a,b) -> b-a for integers—overflow. Use (a,b) -> Integer.compare(b,a) for max heap ordering.',
    },
  ],
  architecture: {
    mermaid: `flowchart BT
  Root[Max at root] --> L[Left child ≤]
  Root --> R[Right child ≤]
  L --> LL[...]
  R --> RR[...]`,
    caption: 'Max heap ordering',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Max heap after inserting 1,3,2: root 3, children 1,2. poll()→3; heap [2,1]. K smallest of stream: max heap size k evicts largest when over capacity.',
    },
    {
      type: 'table',
      headers: ['problem', 'heap type', 'size'],
      rows: [
        ['Kth smallest', 'max heap', 'k'],
        ['Kth largest', 'min heap', 'k'],
        ['median lower half', 'max heap', '~n/2'],
        ['Task pick largest priority', 'max heap', 'unbounded'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Max heap PriorityQueue',
      code: `PriorityQueue<Integer> maxHeap = new PriorityQueue<>(
    (a, b) -> Integer.compare(b, a)
);
// or: new PriorityQueue<>(Collections.reverseOrder());`,
    },
    {
      language: 'java',
      caption: 'Kth smallest with max heap',
      code: `PriorityQueue<Integer> max = new PriorityQueue<>((a,b)->Integer.compare(b,a));
for (int x : nums) {
    max.offer(x);
    if (max.size() > k) max.poll();
}
return max.peek(); // kth smallest`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Top K frequent elements',
      code: `public int[] topKFrequent(int[] nums, int k) {
    Map<Integer, Integer> cnt = new HashMap<>();
    for (int x : nums) cnt.merge(x, 1, Integer::sum);
    PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) -> a[1] - b[1]); // min by freq
    for (var e : cnt.entrySet()) {
        pq.offer(new int[]{e.getKey(), e.getValue()});
        if (pq.size() > k) pq.poll();
    }
    // extract keys — min heap of freq for top K frequent
}`,
    },
  ],
  complexity: {
    best: 'O(1) peek max',
    average: 'O(log n) offer/poll',
    worst: 'O(n log k) for top-K with size-k heap',
    space: 'O(k) or O(n) depending on heap size',
  },
  patternRecognition: [
    'Kth smallest element (max heap size k).',
    'Two-heap median: max heap stores lower half.',
    'Reorganize string / task scheduler by frequency.',
    'Last stone weight (max heap simulation).',
    'Connect ropes minimum cost uses min heap—not max—but pair with min topic.',
  ],
  commonMistakes: [
    'Using b-a comparator causing integer overflow.',
    'Max heap for Kth largest instead of min heap size k.',
    'Forgetting to limit heap size in top-K problems.',
    'Equal priority tie-breaking irrelevant for correctness but clarify Comparator stability not guaranteed.',
  ],
  tradeoffs: {
    advantages: [
      'O(1) max peek',
      'Bounded size-k heap for streaming top-K smallest',
      'Same O(log n) ops as min heap',
    ],
    disadvantages: [
      'Must invert comparator carefully in Java',
      'No random access to arbitrary elements',
    ],
    alternatives: ['Quickselect for one-shot Kth', 'Min heap for Kth largest symmetric pattern'],
    whenToUse: ['Track K smallest among stream', 'Lower half of numbers in median', 'Extract max repeatedly'],
    whenNotToUse: ['Need global minimum repeatedly → min heap'],
  },
  failureModes: [
    'Comparator not consistent with equals—PriorityQueue behavior undefined per contract.',
    'Empty heap peek/poll returns null—NullPointerException if unboxed blindly.',
  ],
  interview: {
    expectations: [
      'Integer.compare(b,a) for max heap',
      'K smallest ↔ max heap size k duality',
      'O(n log k) top-K analysis',
    ],
    commonQuestions: [
      'Kth Smallest Element in a Sorted Matrix',
      'Find K Closest Points to Origin',
      'Top K Frequent Elements',
    ],
    followUps: ['Why not sort O(n log n)?', 'Two heap median pattern?'],
    misconceptions: ['Java has MaxPriorityQueue class—it does not; use Comparator'],
    traps: ['Top K frequent: min heap on frequency not max on keys'],
    strongSignals: ['States K smallest uses max heap of size K explicitly'],
  },
  keyTakeaways: [
    'Max heap: parent ≥ children; root is maximum.',
    'Java: reverseOrder or Integer.compare(b,a).',
    'Kth smallest: max heap size k (evict largest).',
    'Kth largest: min heap size k (symmetric).',
    'Never b-a in comparator—overflow risk.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Create max heap in Java?',
      answerHint: 'PriorityQueue with Collections.reverseOrder() or compare(b,a).',
    },
    {
      level: 'intermediate',
      question: 'K smallest vs K largest heap choice?',
      answerHint: 'K smallest → max heap size k; K largest → min heap size k.',
    },
    {
      level: 'advanced',
      question: 'Median with two heaps?',
      answerHint: 'Max heap lower half, min heap upper; balance sizes; median from tops.',
    },
  ],
  flashcards: [
    {
      front: 'Kth smallest heap type',
      back: 'Max heap of size k—root is answer.',
    },
    {
      front: 'Safe max heap comparator',
      back: '(a,b) -> Integer.compare(b, a).',
    },
  ],
  quickRevision: [
    'Max heap root = maximum',
    'reverseOrder / compare(b,a)',
    'K smallest → max heap size k',
    'K largest → min heap size k',
    'No b-a comparator',
    'offer/poll O(log n)',
    'Two-heap median pattern',
  ],
}
