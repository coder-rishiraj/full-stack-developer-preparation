import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A priority queue abstracts "extract highest-priority element"—typically implemented as a binary heap with O(log n) insert and extract. Java\'s PriorityQueue is the standard interview priority queue; ordering comes from natural order or Comparator.',
  whyExists:
    'Schedulers, event simulators, Dijkstra, and merge patterns need dynamic ordering without full resorting after each change. Priority queue decouples API from heap internals while guaranteeing efficient min/max retrieval.',
  mentalModel:
    'A waiting room where the next called patient is always highest priority—not arrival order. Internally a heap enforces the invariant; you think in terms of offer and poll by priority.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'offer(e): insert with O(log n) restore heap property.',
        'poll(): remove and return extremal element O(log n).',
        'peek(): view extremal without removal O(1).',
        'remove(Object) / contains: O(n)—avoid in hot paths.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Entry as int[] or record',
      text: 'Store (priority, tie-breaker, payload) in heap entries—Comparator compares priority first, then index for stable-ish behavior.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Offer[offer task] --> PQ[Priority Queue / Heap]
  PQ --> Poll[poll highest priority]
  Poll --> Process[Process task]`,
    caption: 'Priority-driven processing',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Dijkstra: PQ holds (distance, node). poll() gives smallest distance; relax edges and offer improved distances. K-way merge: PQ holds (value, listId, index) always picking global minimum next.',
    },
    {
      type: 'table',
      headers: ['API', 'heap op', 'time'],
      rows: [
        ['offer', 'insert swim', 'O(log n)'],
        ['poll', 'extract sink', 'O(log n)'],
        ['peek', 'read root', 'O(1)'],
        ['remove(x)', 'linear search', 'O(n)'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Priority queue of pairs',
      code: `PriorityQueue<int[]> pq = new PriorityQueue<>(
    (a, b) -> a[0] != b[0] ? Integer.compare(a[0], b[0]) : Integer.compare(a[1], b[1])
);
pq.offer(new int[]{priority, id});
int[] best = pq.poll();`,
    },
    {
      language: 'java',
      caption: 'Dijkstra skeleton',
      code: `PriorityQueue<int[]> pq = new PriorityQueue<>((a,b)->a[0]-b[0]);
dist[src] = 0;
pq.offer(new int[]{0, src});
while (!pq.isEmpty()) {
    int[] cur = pq.poll();
    int d = cur[0], u = cur[1];
    if (d > dist[u]) continue; // stale entry
    for (int[] e : adj.get(u)) {
        int v = e[0], w = e[1];
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            pq.offer(new int[]{dist[v], v});
        }
    }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Task Scheduler (max heap on freq)',
      code: `public int leastInterval(char[] tasks, int n) {
    int[] cnt = new int[26];
    for (char c : tasks) cnt[c - 'A']++;
    PriorityQueue<Integer> pq = new PriorityQueue<>((a,b)->b-a);
    for (int f : cnt) if (f > 0) pq.offer(f);
    int time = 0;
    while (!pq.isEmpty()) {
        List<Integer> tmp = new ArrayList<>();
        for (int i = 0; i <= n; i++) {
            if (!pq.isEmpty()) tmp.add(pq.poll() - 1);
            time++;
            if (pq.isEmpty() && tmp.stream().allMatch(x -> x == 0)) break;
        }
        for (int f : tmp) if (f > 0) pq.offer(f);
    }
    return time;
}`,
    },
  ],
  complexity: {
    best: 'O(1) peek',
    average: 'O(log n) per offer/poll',
    worst: 'O(E log V) Dijkstra with binary heap',
    space: 'O(n) entries in queue',
  },
  patternRecognition: [
    'Dijkstra / Prim MST with edge weights.',
    'Merge K sorted sequences.',
    'Top-K / K closest via bounded heap.',
    'Meeting rooms II (min heap of end times).',
    'Find median from data stream (two priority queues).',
  ],
  commonMistakes: [
    'Not handling stale entries in Dijkstra (skip if d > dist[u]).',
    'Using remove() on PriorityQueue in loop—O(n) each.',
    'Assuming iteration order is sorted—it is not.',
    'Null elements forbidden.',
  ],
  tradeoffs: {
    advantages: [
      'Dynamic ordering without full sort each step',
      'Standard library battle-tested heap',
      'Flexible Comparator priorities',
    ],
    disadvantages: [
      'No efficient arbitrary delete/update—use indexed heap advanced',
      'Not thread-safe',
      'remove(Object) is O(n)',
    ],
    alternatives: ['TreeMap for sorted keys with duplicates', 'Sort once if static', 'Fibonacci heap theory for Dijkstra (rare in interviews)'],
    whenToUse: ['Repeated best-next selection', 'Graph weighted shortest path', 'Scheduling by priority/time'],
    whenNotToUse: ['FIFO fairness only → ArrayDeque queue', 'Fixed order after one sort'],
  },
  failureModes: [
    'Stale PQ entries inflate Dijkstra if not guarded by dist check.',
    'Comparator contract violation causes erratic ordering.',
  ],
  interview: {
    expectations: [
      'Know offer/poll/peek complexity',
      'Comparator for custom priority',
      'Stale entry skip in Dijkstra',
    ],
    commonQuestions: [
      'Merge k Sorted Lists',
      'Network Delay Time (Dijkstra)',
      'Meeting Rooms II',
      'Task Scheduler',
    ],
    followUps: ['Indexed priority queue when needed?', 'Lazy deletion pattern?'],
    misconceptions: ['PriorityQueue iteration returns sorted order'],
    traps: ['Meeting Rooms II: min heap of end times not start times'],
    strongSignals: ['Mentions lazy deletion for Dijkstra stale nodes'],
  },
  keyTakeaways: [
    'PriorityQueue = heap-backed priority queue in Java.',
    'offer/poll O(log n); peek O(1).',
    'Comparator defines min vs max behavior.',
    'Dijkstra: skip stale (dist, node) on poll.',
    'Not FIFO—use ArrayDeque for queue semantics.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'PriorityQueue vs Queue?',
      answerHint: 'PQ orders by priority/Comparator; Queue (Deque) is FIFO.',
    },
    {
      level: 'intermediate',
      question: 'Why stale entries in Dijkstra?',
      answerHint: 'Multiple offers per node; older larger dist polled later—ignore if d>dist[u].',
    },
    {
      level: 'advanced',
      question: 'Meeting Rooms II heap invariant?',
      answerHint: 'Min heap of meeting end times; if start >= peek end, reuse room else add room.',
    },
  ],
  flashcards: [
    {
      front: 'PriorityQueue poll complexity',
      back: 'O(log n) extract extremal element.',
    },
    {
      front: 'Dijkstra stale entry check',
      back: 'On poll, if d > dist[u] continue.',
    },
  ],
  quickRevision: [
    'PQ = heap in Java',
    'offer/poll O(log n)',
    'Comparator sets min/max',
    'Not sorted iteration',
    'Dijkstra lazy deletion',
    'Meeting rooms: min end times',
    'FIFO → Deque not PQ',
  ],
}
