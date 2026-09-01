import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The two-heap pattern maintains a running median (or order statistics on a stream) with a max-heap for the lower half and a min-heap for the upper half. Invariant: lower.size() >= upper.size() and lower.size() - upper.size() <= 1, max(lower) <= min(upper).',
  whyExists:
    'Sorting after each insert is O(n log n). Two heaps give O(log n) per add and O(1) median read—standard for Find Median from Data Stream, sliding window median, and revenue split problems.',
  mentalModel:
    'Balance two piles of cards: left pile faces up (max at top = largest of small half), right pile faces down (min at top = smallest of large half). Median is top of left or average of both tops when equal size.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'low: PriorityQueue max-heap (Collections.reverseOrder or (a,b)->b-a).',
        'high: PriorityQueue min-heap default.',
        'On add num: offer to low first; move low.poll() to high if low.size() > high.size()+1 or max(low) > min(high) after rebalance step.',
        'Standard rebalance: offer num to low; offer low.poll() to high; if low.size() < high.size(), move high.poll() back to low.',
        'Median: if low.size() > high.size() return low.peek(); else (low.peek() + high.peek()) / 2.0.',
        'Sliding window: two heaps + HashMap delayed deletion for stale heap tops (lazy removal).',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Lazy deletion for window',
      text: 'Heaps do not support arbitrary remove. Track counts of invalid entries; skip stale tops when peek/poll until valid.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Stream 1, 2, 3: after 1 median 1; after 2 low={1} high={2} median 1.5; after 3 rebalance low={2} high={3} with 1 evicted... final low={2} high={3}? Standard add: low gets all first push then rebalance—after 3, low={2}, high={3}, median 2.',
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Running median stream',
      code: `class MedianFinder {
    PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder());
    PriorityQueue<Integer> high = new PriorityQueue<>();

    void addNum(int num) {
        low.offer(num);
        high.offer(low.poll());
        if (low.size() < high.size())
            low.offer(high.poll());
    }

    double findMedian() {
        if (low.size() > high.size()) return low.peek();
        return (low.peek() + high.peek()) / 2.0;
    }
}`,
    },
    {
      language: 'java',
      caption: 'Sliding window median with lazy deletion',
      code: `class SlidingMedian {
    PriorityQueue<Integer> low = new PriorityQueue<>(Collections.reverseOrder());
    PriorityQueue<Integer> high = new PriorityQueue<>();
    Map<Integer, Integer> delayed = new HashMap<>();

    void prune(PriorityQueue<Integer> heap) {
        while (!heap.isEmpty() && delayed.getOrDefault(heap.peek(), 0) > 0) {
            delayed.merge(heap.peek(), -1, Integer::sum);
            heap.poll();
        }
    }
    // balance(), add(), remove() adjust sizes then prune both heaps
}`,
    },
  ],
  complexity: {
    average: 'O(log n) per insert/delete with heap',
    space: 'O(n) store all elements in heaps',
  },
  patternRecognition: [
    'Find Median from Data Stream.',
    'Sliding Window Median.',
    'IPO / two pool scheduling (capital vs profit heaps).',
    'Scheduling: always process smallest/largest from alternating heaps.',
  ],
  commonMistakes: [
    'Wrong heap polarity (both min-heaps).',
    'Skip rebalance after insert—max(low) > min(high).',
    'Integer median division without 2.0 double cast.',
    'Window median: remove from heap without lazy delete—stale tops.',
  ],
  tradeoffs: {
    advantages: [
      'O(log n) dynamic median',
      'Simple invariant template',
      'Extends to k-th with multiple heaps or multiset',
    ],
    disadvantages: [
      'Not O(1) median without heaps',
      'Lazy deletion adds complexity for windows',
      'Duplicates handled but need consistent rebalance',
    ],
    alternatives: ['Order-statistic tree (TreeMap counts)', 'Insertion sort list for tiny n', 'Bucket/count array if bounded range'],
    whenToUse: ['Streaming median', 'Dynamic order statistics', 'Two-pool min-max pairing'],
    whenNotToUse: ['Static array one-shot median (quickselect)', 'Need exact k-th for all k simultaneously'],
  },
  failureModes: [
    'Size invariant broken → wrong median.',
    'Overflow on sum for median of two ints (use long or /2.0).',
    'Stale heap entries in window variant corrupt median.',
  ],
  interview: {
    expectations: [
      'Max-heap lower, min-heap upper',
      'Rebalance after every add',
      'O(log n) add, O(1) median peek',
    ],
    commonQuestions: ['Find Median from Data Stream', 'Sliding Window Median', 'IPO problem dual heap'],
    followUps: ['Delete from stream?', 'Window version lazy delete?', 'Median of unsorted array different?'],
    misconceptions: ['Single heap enough', 'Sort each time acceptable for large stream', 'Median always top of one heap when even count'],
    traps: ['Even count median needs both tops', 'Forgetting to move element from low to high on insert'],
    strongSignals: ['States size invariant clearly', 'Knows lazy deletion for window', 'Mentions quickselect for offline'],
  },
  keyTakeaways: [
    'low = max-heap smaller half; high = min-heap larger half.',
    'Always offer to low, then push low.max to high, rebalance sizes.',
    'Median: low.peek() if sizes differ; else average both tops.',
    'O(log n) per add; O(1) read median.',
    'Window: lazy delete with delayed count map.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Two-heap median invariant?', answerHint: 'low.size() >= high.size(), size diff <= 1, max(low) <= min(high).' },
    { level: 'intermediate', question: 'addNum steps?', answerHint: 'Offer to low, move low.max to high, if low too small pull high.min back to low.' },
    { level: 'advanced', question: 'Sliding window median challenge?', answerHint: 'Heaps lack O(log n) arbitrary delete—lazy mark removed in HashMap, prune stale tops.' },
  ],
  flashcards: [
    { front: 'Lower half heap type', back: 'Max-heap (largest of small numbers at peek).' },
    { front: 'Median even count', back: '(low.peek() + high.peek()) / 2.0' },
    { front: 'Per-insert complexity', back: 'O(log n) heap operations.' },
  ],
  quickRevision: [
    'low max-heap, high min-heap',
    'add: low → high → rebalance size',
    'max(low) <= min(high)',
    'Odd size: low.peek()',
    'Even: average both tops',
    'Window: lazy deletion map',
    'O(log n) insert',
  ],
}
