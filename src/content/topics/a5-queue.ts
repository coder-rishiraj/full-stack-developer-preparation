import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A queue is a FIFO (first-in, first-out) structure supporting enqueue at the back and dequeue from the front in O(1) amortized time—ideal for processing items in arrival order, BFS wavefronts, and buffering work.',
  whyExists:
    'Many algorithms need "oldest pending item first": BFS expands by distance layers, task schedulers process jobs in order, and sliding windows track elements in time sequence. A queue preserves insertion order unlike a stack.',
  mentalModel:
    'A line at a ticket counter: newcomers join at the rear; service happens at the front. The first person in line is the first served—natural for BFS layers and fair scheduling.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Initialize empty queue; offer seed element(s).',
        'While not empty: poll front element and process it.',
        'For each valid successor, offer to rear (mark visited on enqueue in BFS).',
        'Level-order variant: snapshot queue size before each layer to process row-by-row.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'ArrayDeque in Java',
      text: 'Use ArrayDeque for queue (offer/poll) and stack (push/pop). Avoid LinkedList unless you need null elements—ArrayDeque is faster and cache-friendly.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Enq[Offer rear] --> Q[Queue FIFO]
  Q --> Deq[Poll front]
  Deq --> Process[Process node]
  Process --> Enq`,
    caption: 'FIFO queue processing loop',
  },
  example: [
    {
      type: 'paragraph',
      text: 'BFS from node 0 in graph {0→[1,2], 1→[3], 2→[3]}: queue [0] → poll 0, enqueue 1,2 → queue [1,2] → poll 1, enqueue 3 → poll 2 (3 visited) → poll 3. Order: 0,1,2,3.',
    },
    {
      type: 'table',
      headers: ['operation', 'stack', 'queue'],
      rows: [
        ['insert', 'push top', 'offer rear'],
        ['remove', 'pop top', 'poll front'],
        ['order', 'LIFO', 'FIFO'],
        ['classic use', 'DFS, nesting', 'BFS, scheduling'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Basic queue loop',
      code: `Deque<Integer> q = new ArrayDeque<>();
q.offer(start);
while (!q.isEmpty()) {
    int cur = q.poll();
    for (int nxt : neighbors(cur)) {
        if (!seen[nxt]) {
            seen[nxt] = true;
            q.offer(nxt);
        }
    }
}`,
    },
    {
      language: 'java',
      caption: 'Two-stack queue simulation',
      code: `Deque<Integer> in = new ArrayDeque<>();
Deque<Integer> out = new ArrayDeque<>();
void push(int x) { in.push(x); }
int pop() {
    if (out.isEmpty()) {
        while (!in.isEmpty()) out.push(in.pop());
    }
    return out.pop();
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Implement Queue using Stacks',
      code: `class MyQueue {
    Deque<Integer> in = new ArrayDeque<>();
    Deque<Integer> out = new ArrayDeque<>();

    public void push(int x) { in.push(x); }

    public int pop() {
        peek();
        return out.pop();
    }

    public int peek() {
        if (out.isEmpty()) {
            while (!in.isEmpty()) out.push(in.pop());
        }
        return out.peek();
    }

    public boolean empty() {
        return in.isEmpty() && out.isEmpty();
    }
}`,
    },
  ],
  complexity: {
    best: 'O(1) per enqueue/dequeue amortized',
    average: 'O(1) per operation with ArrayDeque',
    worst: 'O(n) for two-stack queue when draining in-stack to out-stack',
    space: 'O(n) for n stored elements',
  },
  patternRecognition: [
    'BFS shortest path on unweighted graphs or grids.',
    'Level-order tree traversal.',
    'Sliding window maximum (with monotonic deque variant).',
    'Task/job processing in FIFO order.',
    'Multi-source BFS: seed all sources at distance 0.',
  ],
  commonMistakes: [
    'Using add/remove instead of offer/poll—add throws on capacity limit.',
    'Marking visited on dequeue instead of enqueue (duplicate entries).',
    'Confusing Queue interface with PriorityQueue (heap, not FIFO).',
    'LinkedList as default queue when ArrayDeque is preferred in interviews.',
  ],
  tradeoffs: {
    advantages: [
      'O(1) enqueue/dequeue',
      'Natural FIFO semantics for fair ordering',
      'Simple BFS and level-order template',
    ],
    disadvantages: [
      'No random access to middle elements',
      'Two-stack simulation adds amortized cost spikes',
    ],
    alternatives: ['Deque for both-end ops', 'PriorityQueue for priority order', 'Stack for LIFO'],
    whenToUse: ['BFS', 'Level-order traversal', 'FIFO scheduling', 'Buffering in order'],
    whenNotToUse: ['LIFO nesting → stack', 'Need min/max at front → heap or monotonic deque'],
  },
  failureModes: [
    'Unbounded queue growth if visited check missing in BFS.',
    'BlockingQueue deadlock in concurrent code (out of scope for DSA but know FIFO).',
  ],
  interview: {
    expectations: [
      'ArrayDeque offer/poll',
      'FIFO vs LIFO distinction',
      'Visited on enqueue for BFS',
    ],
    commonQuestions: [
      'Implement Queue using Stacks',
      'Number of Recent Calls',
      'Moving Average from Data Stream',
    ],
    followUps: ['Amortized analysis of two-stack queue?', 'Circular queue with fixed capacity?'],
    misconceptions: ['java.util.Queue always means FIFO—PriorityQueue is ordered by priority'],
    traps: ['Recent calls: evict by timestamp window, not count alone'],
    strongSignals: ['Explains why out-stack lazy transfer gives amortized O(1)'],
  },
  keyTakeaways: [
    'FIFO: first offered is first polled.',
    'ArrayDeque is the interview default for queue.',
    'BFS marks visited on enqueue to avoid duplicates.',
    'Two stacks simulate queue with lazy drain.',
    'Level-order uses queue + size snapshot per layer.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Queue vs stack in one sentence?',
      answerHint: 'Queue FIFO for order/BFS; stack LIFO for nesting/DFS.',
    },
    {
      level: 'intermediate',
      question: 'Implement queue with two stacks—amortized complexity?',
      answerHint: 'Each element pushed to in once, transferred to out once—O(1) amortized pop.',
    },
    {
      level: 'advanced',
      question: 'Why mark visited on enqueue in BFS?',
      answerHint: 'Prevents same node entering queue multiple times before dequeue.',
    },
  ],
  flashcards: [
    {
      front: 'Java interview queue API',
      back: 'ArrayDeque offer() rear, poll() front.',
    },
    {
      front: 'Two-stack queue pop cost',
      back: 'Amortized O(1)—each element moved in→out at most once.',
    },
  ],
  quickRevision: [
    'FIFO → queue',
    'ArrayDeque offer/poll',
    'BFS: visited on enqueue',
    'Level-order: size loop per layer',
    'Two stacks: in + lazy out',
    'Not PriorityQueue for plain FIFO',
    'O(1) amortized enqueue/dequeue',
  ],
}
