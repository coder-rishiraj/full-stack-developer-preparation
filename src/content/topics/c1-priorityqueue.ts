import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'PriorityQueue is an unbounded queue where elements are ordered by priority (natural ordering or Comparator). The head is least element (min-heap) or greatest if reverse comparator — O(log n) insert/remove, O(1) peek.',
  whyExists:
    'FIFO Queue is wrong when urgency matters. PriorityQueue efficiently retrieves the highest-priority item repeatedly — task schedulers, Dijkstra, merge K sorted lists, top-K problems.',
  mentalModel:
    'Binary min-heap in array: index 0 is smallest. Parent at i has children at 2i+1, 2i+2. Offer adds and bubbles up; poll removes root and sinks down.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Default natural ordering — elements must be Comparable.',
        'Or PriorityQueue(Comparator) for custom priority.',
        'offer(e)/add(e) insert O(log n); peek() O(1); poll() O(log n) removes head.',
        'Iterator does NOT return priority order — only guaranteed order is poll sequence.',
        'Not thread-safe — PriorityBlockingQueue for concurrent use.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Iterator order',
      text: 'Enhanced for-loop over PriorityQueue is NOT sorted. Repeated poll() or remove() yields priority order.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Top-K largest with min-heap of size K',
      code: `public List<Integer> topK(int[] nums, int k) {
  PriorityQueue<Integer> minHeap = new PriorityQueue<>(k);
  for (int n : nums) {
    minHeap.offer(n);
    if (minHeap.size() > k) minHeap.poll(); // evict smallest
  }
  return new ArrayList<>(minHeap);
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Max-heap via reverse comparator',
      code: `record Task(int id, int urgency) {}

PriorityQueue<Task> urgent = new PriorityQueue<>(
    Comparator.comparingInt(Task::urgency).reversed());

urgent.offer(new Task(1, 5));
urgent.offer(new Task(2, 10));
urgent.poll(); // Task(2, 10) — highest urgency first`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Binary heap stored in Object[] queue; size field tracks elements.',
        'Growth similar to ArrayList when capacity exceeded.',
        'siftUp on insert; siftDown on poll/remove-at-root.',
        'remove(Object) linear search O(n) then sift — avoid in hot paths.',
        'PriorityBlockingQueue uses ReentrantLock + heap for thread-safe blocking.',
      ],
    },
  ],
  complexity: {
    average: 'O(log n) offer/poll; O(1) peek',
    worst: 'O(n) remove(Object) or contains',
    space: 'O(n) array storage',
    notes: 'Building heap from n elements can be O(n) with heapify (not exposed in standard ctor from collection — still O(n log n) addAll).',
  },
  tradeoffs: {
    advantages: [
      'Efficient repeated min/max retrieval',
      'Unbounded — grows as needed',
      'Flexible Comparator ordering',
    ],
    disadvantages: [
      'No random access by priority without poll',
      'Iterator not priority-ordered',
      'Not thread-safe',
      'remove(Object) is O(n)',
    ],
    alternatives: [
      'TreeSet when need dedup + sorted iteration without removal of head only',
      'Sort full list when need all sorted once — O(n log n)',
      'PriorityBlockingQueue for producer-consumer with priority',
    ],
    whenToUse: [
      'Schedulers, event simulation by time',
      'Graph algorithms (Dijkstra, Prim)',
      'Streaming top-K / median approximations',
    ],
    whenNotToUse: [
      'Need FIFO fairness — use ArrayDeque',
      'Need sorted full traversal — sort or TreeSet',
      'Concurrent access without blocking queue',
    ],
  },
  failureModes: [
    'Iterating expecting sorted order — wrong output.',
    'Non-Comparable elements without Comparator — ClassCastException.',
    'Mutating compared fields after insert — heap property broken.',
    'Using peek on empty queue returns null — NPE if unguarded.',
    'Sharing PriorityQueue across threads — corruption.',
  ],
  interview: {
    expectations: [
      'Min-heap default; max-heap via comparator',
      'Complexities offer/poll/peek',
      'Iterator vs poll ordering',
    ],
    commonQuestions: [
      'How is PriorityQueue implemented?',
      'Time complexity of insertion?',
      'How to get max instead of min?',
      'Is iteration in priority order?',
    ],
    followUps: [
      'Top-K pattern with heap?',
      'PriorityQueue vs TreeSet?',
    ],
    misconceptions: [
      'PriorityQueue is sorted list (it is heap — partial order only)',
      'for-each gives priority order (false)',
    ],
    traps: ['Using PriorityQueue where TreeSet dedup needed'],
    strongSignals: [
      'Binary heap array representation',
      'Top-K min-heap size K pattern',
      'Comparator.reversed for max-heap',
    ],
  },
  keyTakeaways: [
    'Min-heap by default; head is smallest.',
    'offer/poll O(log n); peek O(1).',
    'Iterator NOT priority order — use poll.',
    'Comparable or Comparator required.',
    'Top-K: maintain size-K min-heap.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What data structure backs PriorityQueue?',
      answerHint: 'Binary heap in array — typically min-heap.',
    },
    {
      level: 'intermediate',
      question: 'How do you find top K largest elements in a stream?',
      answerHint: 'Min-heap of size K; evict smallest when size exceeds K.',
    },
    {
      level: 'advanced',
      question: 'Why does PriorityQueue iterator not return sorted order?',
      answerHint: 'Heap only guarantees parent-child order locally; full sort not maintained in array layout.',
    },
  ],
  flashcards: [
    { front: 'PriorityQueue peek', back: 'O(1) — view min element without remove' },
    { front: 'Default ordering', back: 'Natural min-heap (least element at head)' },
    { front: 'Iteration order', back: 'Not priority order — use poll() repeatedly' },
  ],
  quickRevision: [
    'Binary min-heap in array',
    'offer/poll O(log n)',
    'peek O(1) min element',
    'Comparator for custom priority',
    'Iterator unordered',
    'Top-K heap trick',
    'PriorityBlockingQueue for threads',
  ],
}
