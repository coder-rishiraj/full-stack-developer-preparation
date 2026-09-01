import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A min heap is a complete binary tree where each parent is ≤ its children—giving O(1) access to the minimum and O(log n) insert/extract. In Java, PriorityQueue is a binary min heap by default (natural ordering or Comparator).',
  whyExists:
    'Many algorithms need repeated "give me the smallest"—Dijkstra, merge K sorted lists, top-K by keeping a max heap of size K, scheduling by earliest deadline. Array-based heap avoids O(n) scan for min.',
  mentalModel:
    'A balanced binary tree packed in array index i with children 2i+1 and 2i+2. New items bubble up (swim); removing min puts last leaf at root and sinks down (sink)—always restoring parent ≤ children.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Insert: add at end, swim up while smaller than parent.',
        'Extract-min: save root, move last to root, sink down choosing smaller child.',
        'Peek-min: return array[0] without removal.',
        'Java PriorityQueue: offer(), poll(), peek(); not thread-safe; O(log n) mutators.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: '0-indexed heap formulas',
      text: 'parent(i)=(i-1)/2, left=2i+1, right=2i+2. Complete tree property enables array storage without pointers.',
    },
  ],
  architecture: {
    mermaid: `flowchart BT
  Root[Min at root] --> L[Left child ≥]
  Root --> R[Right child ≥]
  L --> LL[...]
  R --> RR[...]`,
    caption: 'Min heap ordering',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Insert 3,1,4,2 into min heap: array evolves [3]→[1,3]→[1,3,4]→[1,2,4,3] after swims. poll() returns 1, sink restores heap with 3 at root.',
    },
    {
      type: 'table',
      headers: ['operation', 'time', 'Java API'],
      rows: [
        ['peek min', 'O(1)', 'peek()'],
        ['insert', 'O(log n)', 'offer()'],
        ['extract min', 'O(log n)', 'poll()'],
        ['heapify array', 'O(n)', 'PriorityQueue(arr) or bottom-up'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Min heap with PriorityQueue',
      code: `PriorityQueue<Integer> minHeap = new PriorityQueue<>();
minHeap.offer(5);
minHeap.offer(1);
int smallest = minHeap.peek(); // 1
int removed = minHeap.poll(); // 1`,
    },
    {
      language: 'java',
      caption: 'Custom comparator min heap',
      code: `PriorityQueue<int[]> pq = new PriorityQueue<>(
    (a, b) -> a[0] - b[0] // min by first field
);
pq.offer(new int[]{dist, node});`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Kth largest using min heap size K',
      code: `public int findKthLargest(int[] nums, int k) {
    PriorityQueue<Integer> min = new PriorityQueue<>();
    for (int x : nums) {
        min.offer(x);
        if (min.size() > k) min.poll();
    }
    return min.peek();
}`,
    },
  ],
  complexity: {
    best: 'O(1) peek; O(log n) insert/extract',
    average: 'O(log n) per offer/poll',
    worst: 'O(n log n) n successive inserts; O(n) heapify build',
    space: 'O(n) array storage',
  },
  patternRecognition: [
    'Kth largest/smallest element.',
    'Merge K sorted lists (min heap of heads).',
    'Dijkstra shortest path.',
    'Task scheduler / meeting rooms with earliest time.',
    'Running median uses min heap as lower half (with max heap partner).',
  ],
  commonMistakes: [
    'Using default PriorityQueue when max heap needed (wrap with reversed comparator).',
    'Null elements in PriorityQueue—NullPointerException.',
    'Assuming poll() on empty returns null—it does; peek() too—check isEmpty().',
    'Confusing heap sort (in-place O(n log n)) with PriorityQueue usage.',
  ],
  tradeoffs: {
    advantages: [
      'O(1) min access',
      'O(log n) dynamic insert/delete min',
      'Compact array representation',
    ],
    disadvantages: [
      'Not efficient search for arbitrary key O(n)',
      'Not sorted iteration—only min guaranteed',
    ],
    alternatives: ['TreeMap for sorted keys', 'Sorted array if static', 'Quickselect O(n) average for one-off Kth'],
    whenToUse: ['Repeated extract minimum', 'K-way merge', 'Top-K via bounded heap'],
    whenNotToUse: ['Need full sorted order output → sort', 'Lookup by key → hash map'],
  },
  failureModes: [
    'Comparator inconsistent with equals causes undefined heap order.',
    'Integer overflow in comparator a[0]-b[0]—use Integer.compare.',
  ],
  interview: {
    expectations: [
      'State O(log n) offer/poll',
      'Know default min heap in Java',
      'Heapify O(n) optional knowledge',
    ],
    commonQuestions: [
      'Kth Largest Element in an Array',
      'Merge k Sorted Lists',
      'Find Median from Data Stream (with max heap)',
    ],
    followUps: ['Build heap in O(n)?', 'Indexed priority queue?'],
    misconceptions: ['PriorityQueue is always max heap—it is min by default in Java'],
    traps: ['Kth largest uses size-K min heap not max heap of all elements'],
    strongSignals: ['Uses Integer.compare in comparator', 'Explains swim/sink at high level'],
  },
  keyTakeaways: [
    'Min heap: parent ≤ children; root is minimum.',
    'Java PriorityQueue default = min heap.',
    'offer/poll O(log n); peek O(1).',
    'Kth largest: min heap of size k.',
    'Array indices: parent (i-1)/2, children 2i+1, 2i+2.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Min heap vs sorted array for repeated min?',
      answerHint: 'Heap O(1) peek O(log n) update; sorted array O(1) min but O(n) insert.',
    },
    {
      level: 'intermediate',
      question: 'Why min heap for Kth largest?',
      answerHint: 'Keep k largest seen; root is smallest of them = kth largest overall.',
    },
    {
      level: 'advanced',
      question: 'Build heap from array in O(n)?',
      answerHint: 'Bottom-up sink from last parent n/2 down to 0.',
    },
  ],
  flashcards: [
    {
      front: 'Java PriorityQueue default order',
      back: 'Min heap (smallest at peek).',
    },
    {
      front: 'Child indices in 0-based heap',
      back: 'left=2i+1, right=2i+2, parent=(i-1)/2.',
    },
  ],
  quickRevision: [
    'Min heap root = minimum',
    'PriorityQueue = min default',
    'offer/poll O(log n)',
    'Kth largest: size-k min heap',
    'Comparator: Integer.compare',
    'Complete tree in array',
    'heapify O(n) bottom-up',
  ],
}
