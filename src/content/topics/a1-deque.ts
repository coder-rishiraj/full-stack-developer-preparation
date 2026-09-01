import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Deque (double-ended queue) via ArrayDeque: O(1) add/remove at both ends. The standard Java stack and queue—prefer over Stack class and ArrayList front-removal.',
  whyExists:
    'BFS needs FIFO queue; DFS/monotonic stack needs LIFO; sliding window max needs push/pop both ends. ArrayDeque implements Deque with circular array—fast and allocation-friendly.',
  mentalModel:
    'Ring buffer with head/tail pointers. offerFirst/offerLast append; pollFirst/pollLast remove. No null elements allowed.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Queue (FIFO): offerLast + pollFirst (or add/poll).',
        'Stack (LIFO): push (= offerLast) + pop (= pollLast).',
        'Never use java.util.Stack—legacy, synchronized, extends Vector.',
        'peekFirst/peekLast inspect without remove.',
        'Monotonic deque: indices or values with increasing/decreasing invariant.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'BFS and stack idioms',
      code: `Deque<Integer> q = new ArrayDeque<>();
q.offerLast(start);
while (!q.isEmpty()) {
    int u = q.pollFirst();
    for (int v : adj.get(u)) q.offerLast(v);
}

Deque<Integer> st = new ArrayDeque<>();
st.push(u);          // offerLast
int x = st.pop();    // pollLast`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Monotonic deque — sliding window maximum',
      code: `Deque<Integer> dq = new ArrayDeque<>(); // indices, decreasing values
for (int i = 0; i < n; i++) {
    while (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
    while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();
    dq.offerLast(i);
    if (i >= k - 1) ans[i - k + 1] = a[dq.peekFirst()];
}`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'ArrayDeque vs LinkedList',
      text: 'ArrayDeque: better cache locality, no node overhead. LinkedList: rarely faster in practice—use ArrayDeque unless deque middle insert (almost never in CP).',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  F[front pollFirst] --> Ring[circular array]
  Ring --> B[back offerLast]
  Mono[monotonic invariant] --> Ring`,
    caption: 'ArrayDeque as queue, stack, or monotonic window',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Shortest path in 0-1 BFS: deque stores nodes; weight-0 edges push front, weight-1 push back—O(V+E) with O(1) pop/push both ends.',
    },
  ],
  complexity: {
    average: 'O(1) offer/poll/peek at ends',
    worst: 'O(1) per end op; occasional resize O(n) amortized',
    space: 'O(n) elements',
  },
  patternRecognition: [
    'BFS level order → queue.',
    'DFS iterative, parse nested structure → stack.',
    'Sliding window min/max → monotonic deque.',
    '0-1 BFS, Dijkstra with small weights → deque two-end.',
  ],
  commonMistakes: [
    'Using ArrayList remove(0) as queue → O(n) per step.',
    'Using Stack class out of habit.',
    'Forgetting to drop out-of-window indices from monotonic deque front.',
    'Null elements in ArrayDeque → NPE.',
  ],
  tradeoffs: {
    advantages: ['O(1) both ends', 'Lightweight', 'No sync overhead'],
    disadvantages: ['No random access by index', 'No nulls', 'Not thread-safe'],
    alternatives: ['PriorityQueue when order by priority not time', 'ArrayList as stack only at end'],
    whenToUse: ['BFS', 'Monotonic window', 'Stack simulation'],
    whenNotToUse: ['Need priority ordering', 'Middle insert frequently'],
  },
  failureModes: [
    'TLE from LinkedList or ArrayList front removal disguised as BFS.',
    'Wrong monotonic direction (min vs max window).',
  ],
  interview: {
    expectations: ['ArrayDeque for stack/queue', 'Explain monotonic deque for window max'],
    commonQuestions: ['Sliding Window Maximum', 'Valid Parentheses', 'BFS shortest path'],
    followUps: ['Why not Stack class?', '0-1 BFS deque trick'],
    misconceptions: ['Deque is only for double-ended problems'],
    traps: ['Empty deque poll returns null—check isEmpty'],
    strongSignals: ['Says ArrayDeque explicitly; draws monotonic invariant'],
  },
  keyTakeaways: [
    'ArrayDeque = default stack and queue.',
    'O(1) at both ends; no Stack/Vector.',
    'Monotonic deque → O(n) sliding window min/max.',
    'BFS: offerLast + pollFirst.',
    '0-1 BFS: push weight-0 to front.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Implement queue in Java for BFS.',
      answerHint: 'ArrayDeque offerLast, pollFirst.',
    },
    {
      level: 'intermediate',
      question: 'Why monotonic deque gives O(n) window maximum?',
      answerHint: 'Each index added once, removed once from ends; while loops amortized.',
    },
    {
      level: 'advanced',
      question: '0-1 BFS deque strategy?',
      answerHint: '0-weight edges push front, 1-weight push back; like Dial’s algorithm for weights 0/1.',
    },
  ],
  flashcards: [
    {
      front: 'Java competitive stack',
      back: 'ArrayDeque push/pop — not java.util.Stack.',
    },
    {
      front: 'BFS queue ops',
      back: 'offerLast enqueue, pollFirst dequeue.',
    },
  ],
  quickRevision: [
    'ArrayDeque for stack + queue',
    'O(1) both ends',
    'No null elements',
    'Monotonic deque for window max/min',
    'Avoid remove(0) on ArrayList',
    '0-1 BFS front/back push',
  ],
}
