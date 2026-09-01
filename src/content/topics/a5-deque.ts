import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A deque (double-ended queue) supports O(1) insert and remove at both front and rear—unifying stack, queue, and sliding-window patterns in one structure via offerFirst/offerLast and pollFirst/pollLast.',
  whyExists:
    'Some algorithms need both ends: 0-1 BFS pushes weight-0 edges to front and weight-1 to back; monotonic deques maintain window min/max; palindrome checks compare both ends. Deque avoids awkward two-structure hacks.',
  mentalModel:
    'A deck of cards where you can draw or place from either end. Push/pop at one end is a stack; offer/poll at opposite ends is a queue; both together enable sliding-window and 0-1 BFS tricks.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Choose end semantics: stack uses one end; queue uses opposite ends.',
        'Monotonic deque: drop from rear while dominated; drop from front when out of window.',
        '0-1 BFS: offerFirst for 0-weight edge, offerLast for 1-weight edge.',
        'ArrayDeque in Java: no null elements; not thread-safe; faster than LinkedList.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'One type, three roles',
      text: 'ArrayDeque as stack (push/pop), as queue (offer/poll), or as deque (offerFirst + pollLast)—memorize one class for all linear ADT interview code.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Front[Front pollFirst] --> D[Deque]
  D --> Rear[Rear pollLast]
  D --> PushF[offerFirst]
  D --> PushR[offerLast]`,
    caption: 'Double-ended access',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Sliding window max for [1,3,-1,-3,5,3,6,7], k=3: monotonic deque stores indices with decreasing values. At i=5, front index 3 is out of window → pollFirst; rear pops while a[rear]≤3.',
    },
    {
      type: 'table',
      headers: ['use case', 'front op', 'rear op'],
      rows: [
        ['stack', '—', 'push/pop'],
        ['queue', 'poll', 'offer'],
        ['0-1 BFS', 'offerFirst w=0', 'offerLast w=1'],
        ['window max', 'poll stale index', 'pop smaller values'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Deque as stack and queue',
      code: `Deque<Integer> dq = new ArrayDeque<>();
// stack
dq.push(x); dq.pop();
// queue
dq.offer(x); dq.poll();
// both ends
dq.offerFirst(x); dq.pollLast();`,
    },
    {
      language: 'java',
      caption: 'Sliding window maximum (monotonic deque)',
      code: `Deque<Integer> dq = new ArrayDeque<>(); // indices, decreasing vals
int[] ans = new int[n - k + 1];
for (int i = 0; i < n; i++) {
    while (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
    while (!dq.isEmpty() && nums[dq.peekLast()] <= nums[i]) dq.pollLast();
    dq.offerLast(i);
    if (i >= k - 1) ans[i - k + 1] = nums[dq.peekFirst()];
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: '0-1 BFS with deque',
      code: `Deque<int[]> dq = new ArrayDeque<>();
dq.offerFirst(new int[]{start, 0});
dist[start] = 0;
while (!dq.isEmpty()) {
    int[] cur = dq.pollFirst();
    int u = cur[0], d = cur[1];
    if (d > dist[u]) continue;
    for (int[] e : edges[u]) {
        int v = e[0], w = e[1];
        if (dist[u] + w < dist[v]) {
            dist[v] = dist[u] + w;
            if (w == 0) dq.offerFirst(new int[]{v, dist[v]});
            else dq.offerLast(new int[]{v, dist[v]});
        }
    }
}`,
    },
  ],
  complexity: {
    best: 'O(1) per end operation',
    average: 'O(1) offer/poll at either end',
    worst: 'O(n) for monotonic deque scan—each index in/out once',
    space: 'O(n) deque storage; O(k) for window size k',
  },
  patternRecognition: [
    'Sliding window min/max (monotonic deque).',
    '0-1 BFS shortest path on graphs with 0/1 weights.',
    'Palindrome verification from both ends.',
    'Stack + queue simulation with single ArrayDeque.',
    'Work-stealing / undo from both ends in parsing.',
  ],
  commonMistakes: [
    'Forgetting to evict front index when i - dq.peekFirst() >= k in window problems.',
    'Using LinkedList by habit—ArrayDeque is preferred unless null needed.',
    'Confusing peekFirst with pollFirst—peek does not remove stale window indices.',
    '0-1 BFS: pushing weight-1 to front breaks distance ordering.',
  ],
  tradeoffs: {
    advantages: [
      'One class covers stack, queue, deque patterns',
      'O(1) both-end ops with ArrayDeque',
      'Enables monotonic window techniques',
    ],
    disadvantages: [
      'ArrayDeque cannot hold null',
      'Not thread-safe without external sync',
    ],
    alternatives: ['Two stacks for queue only', 'Segment tree for range max', 'Multiset for window counts'],
    whenToUse: ['Both-end access', 'Sliding window extrema', '0-1 BFS', 'Unified interview ADT'],
    whenNotToUse: ['Need thread-safe blocking queue', 'Priority ordering → PriorityQueue'],
  },
  failureModes: [
    'Window deque grows unbounded if front eviction forgotten.',
    'Monotonic direction wrong → wrong min/max answers.',
  ],
  interview: {
    expectations: [
      'ArrayDeque API for both ends',
      'Explain window index eviction at front',
      '0-1 BFS front vs back push rule',
    ],
    commonQuestions: [
      'Sliding Window Maximum',
      'Shortest Path in Binary Matrix with 0-1 weights variant',
      'Design Circular Deque',
    ],
    followUps: ['Why each index enters deque once in window max?', 'Circular buffer vs ArrayDeque?'],
    misconceptions: ['Deque must always use both ends—often used as stack or queue only'],
    traps: ['Design Circular Deque: modular index arithmetic for fixed array'],
    strongSignals: ['States pollFirst when index leaves window before reading max'],
  },
  keyTakeaways: [
    'Deque = O(1) at front and rear.',
    'ArrayDeque: stack, queue, or true deque.',
    'Window max: decreasing deque of indices; evict stale front.',
    '0-1 BFS: offerFirst for 0-weight, offerLast for 1-weight.',
    'Each index pushed/popped once → O(n) window algorithms.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Stack vs deque in Java?',
      answerHint: 'Deque (ArrayDeque) supports both ends; stack uses push/pop on one end.',
    },
    {
      level: 'intermediate',
      question: 'Sliding window maximum with deque?',
      answerHint: 'Monotonic decreasing indices; poll front when out of window; answer at peekFirst.',
    },
    {
      level: 'advanced',
      question: '0-1 BFS why use deque?',
      answerHint: '0-weight edges to front preserve non-decreasing dist order like Dijkstra with two buckets.',
    },
  ],
  flashcards: [
    {
      front: 'ArrayDeque window max front eviction',
      back: 'pollFirst while peekFirst <= i - k.',
    },
    {
      front: '0-1 BFS enqueue rule',
      back: 'weight 0 → offerFirst; weight 1 → offerLast.',
    },
  ],
  quickRevision: [
    'Deque = both ends O(1)',
    'ArrayDeque for interviews',
    'Window max: mono deque + index eviction',
    '0-1 BFS: front for 0 edges',
    'Stack/queue special cases of deque',
    'Each index in/out once → O(n)',
    'No null in ArrayDeque',
  ],
}
