import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The running (streaming) median maintains the median after each insert in O(log n) per operation using two heaps: a max heap for the lower half and a min heap for the upper half, kept balanced so their sizes differ by at most one.',
  whyExists:
    'Sorting after every insert is O(n log n) per step. The two-heap pattern gives O(log n) add and O(1) median read—essential for real-time analytics, order statistics on streams, and classic hard heap problems like "Find Median from Data Stream."',
  mentalModel:
    'Split numbers into a low pile (max heap—biggest of lows at top) and high pile (min heap—smallest of highs at top). Median is either the top of the larger pile or average of both tops when equal size. After each insert, rebalance so low.size >= high.size and diff ≤ 1.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'low: max heap holds ≤ half of values; high: min heap holds ≥ half.',
        'addNum(x): push to low first; move max(low) to high if low too big; if high.size > low.size, move min(high) back to low.',
        'findMedian(): if equal size, average low.peek() and high.peek(); else peek larger heap.',
        'Invariant: low.size == high.size or low.size == high.size + 1.',
        'Lazy deletion variant: hash map of delayed deletes when supporting remove—advanced.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Add order trick',
      text: 'Always offer to low first, then offer low.poll() to high—guarantees x lands in correct half before rebalance. Then if high.size > low.size, offer high.poll() to low.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Add[addNum x] --> Low[max heap low]
  Low --> Move1[Move max to high]
  Move1 --> High[min heap high]
  High --> Bal{high.size > low.size?}
  Bal -->|yes| Move2[Move min back to low]
  Bal -->|no| Done[Balanced]
  Move2 --> Done
  Done --> Med[Median from tops]`,
    caption: 'Two-heap median structure',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Stream 5, 15, 1, 3: after 5 low=[5]; after 15 low=[5] high=[15] median 10; after 1 low=[5,1] high=[15] median 5; after 3 rebalance low=[3,1] high=[5,15] median (3+5)/2=4.',
    },
    {
      type: 'table',
      headers: ['operation', 'low (max)', 'high (min)', 'median'],
      rows: [
        ['add 5', '[5]', '[]', '5'],
        ['add 15', '[5]', '[15]', '10'],
        ['add 1', '[5,1]', '[15]', '5'],
        ['add 3', '[3,1]', '[5,15]', '4'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'MedianFinder two-heap',
      code: `class MedianFinder {
    PriorityQueue<Integer> low = new PriorityQueue<>((a,b)->Integer.compare(b,a));
    PriorityQueue<Integer> high = new PriorityQueue<>();

    public void addNum(int num) {
        low.offer(num);
        high.offer(low.poll());
        if (high.size() > low.size()) low.offer(high.poll());
    }

    public double findMedian() {
        if (low.size() > high.size()) return low.peek();
        return (low.peek() + high.peek()) / 2.0;
    }
}`,
    },
    {
      language: 'java',
      caption: 'Sliding window median (with TreeMap/balance)',
      code: `// Two TreeMaps or Multiset for removals — heaps alone need lazy delete
// Simpler interview: TreeMap freq + two pointers on sorted keys
// Or delay-delete: track invalidated entries in HashMap`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Find Median from Data Stream (LeetCode 295)',
      code: `class MedianFinder {
    private final PriorityQueue<Integer> lo = new PriorityQueue<>(Collections.reverseOrder());
    private final PriorityQueue<Integer> hi = new PriorityQueue<>();

    public void addNum(int num) {
        lo.offer(num);
        hi.offer(lo.poll());
        if (hi.size() > lo.size()) lo.offer(hi.poll());
    }

    public double findMedian() {
        return lo.size() > hi.size()
            ? lo.peek()
            : (lo.peek() + hi.peek()) / 2.0;
    }
}`,
    },
  ],
  complexity: {
    best: 'O(log n) per add; O(1) median read',
    average: 'O(log n) per add',
    worst: 'O(log n) per add; O(n) space for n elements',
    space: 'O(n) across both heaps',
  },
  patternRecognition: [
    '“Median from data stream” → two heaps.',
    'Sliding window median → heaps + lazy deletion or TreeMap/multiset.',
    'Balance two partitions (similar spirit to two heaps).',
    'IPO / meeting rooms variants use heaps but not always median.',
    'Order statistics: Kth element uses different heap sizing—not median pattern.',
  ],
  commonMistakes: [
    'Both heaps same polarity—must be max low, min high.',
    'Wrong rebalance: allow high.size > low.size without fix.',
    'Integer median average: use 2.0 for double result.',
    'Sliding window: forgetting to remove expired elements from heaps.',
    'Comparator overflow with (a,b)->b-a.',
  ],
  variations: [
    'Lazy deletion heaps for remove/slide window',
    'TreeMap + two multisets for exact sliding median',
    'Order statistic tree / PBDS (not in Java std)',
    'Approximate median with reservoir sampling',
  ],
  tradeoffs: {
    advantages: [
      'O(log n) insert, O(1) median',
      'Simple two PriorityQueues in Java',
      'No full resort per insert',
    ],
    disadvantages: [
      'Heaps alone don’t support arbitrary delete efficiently',
      'Sliding window needs extra machinery',
      'O(n) memory holds all stream values',
    ],
    alternatives: ['Resort each query O(n log n)', 'TreeMap multiset O(log n) add/remove', 'Quickselect batch median'],
    whenToUse: ['Streaming median', 'Dynamic median queries after inserts'],
    whenNotToUse: ['Sliding window without lazy delete plan', 'Need exact Kth with deletes only'],
  },
  failureModes: [
    'Sliding window median TLE without lazy delete or balanced BST.',
    'Rebalance logic inverted → heaps wrong size invariant.',
    'Empty stream median query—define behavior (throw vs sentinel).',
  ],
  interview: {
    expectations: [
      'Draw low max-heap + high min-heap',
      'State size invariant and rebalance steps',
      'O(log n) add, O(1) findMedian',
    ],
    commonQuestions: [
      'Find Median from Data Stream',
      'Sliding Window Median',
      'IPO (two heap scheduling variant)',
    ],
    followUps: ['How handle sliding window removals?', 'Median of two sorted arrays?'],
    misconceptions: ['One heap enough', 'Sort each time is fine for stream'],
    traps: ['Sliding window: naive heap remove O(n)', 'Average of ints without 2.0'],
    strongSignals: ['Explains offer-to-low-first trick', 'Mentions lazy deletion for window'],
  },
  keyTakeaways: [
    'Low half = max heap; high half = min heap.',
    'Sizes differ by at most 1; low.size >= high.size.',
    'addNum: low → high → maybe high → low rebalance.',
    'Median: top of larger heap or average both tops.',
    'Sliding window needs delete strategy beyond basic two heaps.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why two heaps for streaming median?',
      answerHint: 'Split values; tops of halves give median in O(1) after O(log n) balanced insert.',
    },
    {
      level: 'intermediate',
      question: 'What invariant on heap sizes?',
      answerHint: 'low.size == high.size or low.size == high.size + 1; low is max-heap, high is min-heap.',
    },
    {
      level: 'advanced',
      question: 'Sliding window median challenge with heaps?',
      answerHint: 'Must remove elements leaving window—lazy delete map or balanced multiset; plain heap remove is O(n).',
    },
  ],
  flashcards: [
    {
      front: 'Two-heap median: low heap type',
      back: 'Max heap (largest of lower half at peek).',
    },
    {
      front: 'Streaming median add complexity',
      back: 'O(log n) per addNum; O(1) findMedian.',
    },
  ],
  quickRevision: [
    'Low = max heap, high = min heap',
    'Size diff ≤ 1, low.size ≥ high.size',
    'add: offer low, move max to high, rebalance',
    'Median: larger peek or avg tops',
    'Integer.compare / reverseOrder',
    'Sliding window → lazy delete or TreeMap',
    'O(log n) add O(1) query',
  ],
}
