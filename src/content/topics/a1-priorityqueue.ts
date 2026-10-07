import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'PriorityQueue<E> is a binary min-heap: peek/poll returns smallest element (or largest with reversed Comparator). offer and poll in O(log n); peek O(1). Default for “always process best/next smallest” problems.',
  whyExists:
    'Sorting entire input each step is O(n log n) per round. A heap maintains dynamic extremum—Dijkstra, merge K lists, top K frequent, median with lazy deletion—at O(log n) per update.',
  mentalModel:
    'Complete binary tree in array: parent ≤ children (min-heap). Root = min. Insert bubble up; poll replace root with last leaf, bubble down.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Step 1 — Queue vs PriorityQueue. A normal queue returns elements in insertion order (FIFO). A PriorityQueue always returns the “best” element next—smallest by default—regardless of insert order. Think “hospital triage,” not “ticket line.”',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Default min-heap: new PriorityQueue<>().',
        'Max-heap: new PriorityQueue<>((a,b) -> Integer.compare(b,a)) or Comparator.reverseOrder().',
        'offer(e), poll(), peek(); null from poll if empty.',
        'Not thread-safe; no null elements.',
        'remove(Object) / contains O(n)—avoid in hot paths.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Top K frequent + Dijkstra sketch',
      code: `// Top K by frequency: min-heap of size k on frequency
PriorityQueue<int[]> pq = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
for (var e : freq.entrySet()) {
    pq.offer(new int[]{e.getKey(), e.getValue()});
    if (pq.size() > k) pq.poll();
}

// Dijkstra
PriorityQueue<int[]> pq2 = new PriorityQueue<>(Comparator.comparingInt(a -> a[1]));
pq2.offer(new int[]{src, 0});
while (!pq2.isEmpty()) {
    int[] cur = pq2.poll();
    int u = cur[0], d = cur[1];
    if (d != dist[u]) continue; // lazy stale entry
    // relax edges...
}`,
    },
    {
      type: 'table',
      headers: ['Operation', 'Time'],
      rows: [
        ['offer / poll', 'O(log n)'],
        ['peek', 'O(1)'],
        ['build from collection', 'O(n) heapify'],
        ['contains / remove(obj)', 'O(n)'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Stale entries',
      text: 'Decrease-key not supported efficiently. Pattern: push updated distance anyway; skip poll if dist[u] != recorded when popping (lazy deletion).',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Root[min at index 0] --> L[child 2i+1]
  Root --> R[child 2i+2]
  Offer[offer] --> Up[sift up O log n]
  Poll[poll] --> Down[sift down O log n]`,
    caption: 'Binary heap array layout',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Merge K sorted lists: PQ holds head node of each list ordered by val; poll min, push node.next until empty—O(N log k) total.',
    },
  ],
  complexity: {
    average: 'O(log n) offer/poll',
    worst: 'O(log n) offer/poll; O(n) build heap from array',
    space: 'O(n) stored elements',
  },
  patternRecognition: [
    'Repeatedly need current min/max among dynamic set.',
    'K-way merge, shortest path (Dijkstra), scheduling by deadline.',
    'Top K: size-k heap beats full sort when K << n.',
    'Two heaps for streaming median.',
  ],
  commonMistakes: [
    'Expecting sorted iteration—iterator order not sorted.',
    'Using remove on arbitrary element in loop O(n²).',
    'Max-heap forgotten—default is min.',
    'Not handling tie-breaking in Comparator when needed.',
  ],
  tradeoffs: {
    advantages: ['Cheap extremum', 'Simple API', 'O(n) bulk heapify'],
    disadvantages: ['No efficient arbitrary delete/decrease-key', 'Not sorted traversal', 'O(log n) not O(1) pop'],
    alternatives: ['TreeSet for sorted set + neighbor queries', 'Sort once if batch', 'Deque if only FIFO/LIFO'],
    whenToUse: ['Dijkstra', 'Top K', 'Merge K sorted', 'Event simulation by time'],
    whenNotToUse: ['Need floor/ceiling on all keys', 'Only stack/queue order'],
  },
  failureModes: [
    'TLE from contains/remove in inner loop.',
    'Wrong comparator → wrong extremum or overflow.',
  ],
  interview: {
    expectations: ['State O(log n) ops', 'Min vs max heap setup', 'Lazy deletion in Dijkstra'],
    commonQuestions: ['Kth largest', 'Merge K lists', 'Dijkstra', 'Task scheduler'],
    followUps: ['Fibonacci heap in theory?', 'Why not sort each step?'],
    misconceptions: ['PQ keeps all elements sorted'],
    traps: ['Empty PQ poll returns null'],
    strongSignals: ['Mentions lazy stale check on poll for Dijkstra'],
  },
  keyTakeaways: [
    'Default min-heap; reverse Comparator for max.',
    'offer/poll O(log n); peek O(1).',
    'Top K with size-k heap.',
    'Dijkstra: lazy duplicate entries + skip stale.',
    'Avoid contains/remove O(n) in loops.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Complexity of PriorityQueue.poll()?',
      answerHint: 'O(log n) remove min and sift down.',
    },
    {
      level: 'intermediate',
      question: 'Find Kth largest in O(n log k)?',
      answerHint: 'Min-heap size k; if size>k poll; root is kth largest among seen.',
    },
    {
      level: 'advanced',
      question: 'Why push duplicate distances in Dijkstra?',
      answerHint: 'No decrease-key; pop stale when d > dist[u]; simpler than indexed heap.',
    },
  ],
  flashcards: [
    {
      front: 'Java max-heap',
      back: 'new PriorityQueue<>(Comparator.reverseOrder()) or compare (b,a).',
    },
    {
      front: 'PriorityQueue poll complexity',
      back: 'O(log n).',
    },
  ],
  quickRevision: [
    'Binary min-heap by default',
    'O(log n) offer/poll',
    'Max-heap via Comparator',
    'Top K size-k heap',
    'Dijkstra lazy deletion',
    'Iterator not sorted order',
  ],
}
