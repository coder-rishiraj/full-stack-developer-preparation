import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A **Deque** is a double-ended queue. **ArrayDeque** adds and removes at **both** ends in **O(1)**. It is the stack and the queue you should actually use in Java.',
  whyExists:
    'BFS needs a line: first in, first out. A stack needs the opposite: last in, first out. A sliding-window maximum needs to drop elements from both ends. One circular array does all three. **java.util.Stack** and **ArrayList.remove(0)** do not.',
  mentalModel:
    'A ring of slots with a **front** and a **back**. **offerLast** grows the back. **pollFirst** takes the front. **push** and **pop** are the stack names for the back end. **null** is not allowed.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Why both ends exist.',
        'The queue spelling and the stack spelling.',
        'Why not **Stack**, and why not **remove(0)**.',
        'A monotonic deque for the window maximum.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — One structure, three jobs',
    },
    {
      type: 'list',
      items: [
        'A **queue** adds at the back and removes at the front. That is BFS: the node you discovered first is the one you expand first.',
        'A **stack** adds and removes at the same end. That is DFS, parentheses, and “undo the latest.”',
        'A **deque** can do either, because both ends are open. You do not need two classes.',
        '**ArrayDeque** stores the elements in a circular array. The front and back indexes wrap around. No linked-list node per element.',
        'There is no useful **get(i)**. If you need index access, that is an **ArrayList**, not a deque.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — Spell the queue and the stack on purpose',
    },
    {
      type: 'list',
      items: [
        '**Queue:** **offerLast** to enqueue, **pollFirst** to dequeue, **peekFirst** to look without removing.',
        '**Stack:** **push** to put on top, **pop** to take the top. Those are **offerLast** and **pollLast** under friendlier names.',
        '**peek** does not remove. **poll** on an empty deque returns **null**, so test **isEmpty()** before you use the value.',
        'Declare the variable as **Deque<Integer>**, and construct **new ArrayDeque<>()**.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'BFS uses the front. A stack uses the back.',
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
      type: 'heading',
      text: 'Step 3 — The two things not to use',
    },
    {
      type: 'list',
      items: [
        '**java.util.Stack** is old. It extends **Vector**, and every call is synchronized. Use **ArrayDeque**.',
        '**ArrayList.remove(0)** shifts every later element. A BFS written that way is O(n) per pop and will time out.',
        '**LinkedList** can be a deque, but each element is a separate node. **ArrayDeque** is the default unless you have a reason.',
        '**ArrayDeque** rejects **null**. A null element is how some queues signal “empty,” and this class refuses that ambiguity. Check **isEmpty()** instead.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'ArrayDeque is the default',
      text: 'Stack, queue, and both-ends tricks all start as **new ArrayDeque<>()**. Reach for **LinkedList** only if you truly insert in the middle, which contest code almost never does.',
    },
    {
      type: 'heading',
      text: 'Step 4 — Monotonic deque: the window maximum',
    },
    {
      type: 'list',
      items: [
        'The deque stores **indexes**, not the values. The values are read from the array. Indexes let you see when an element has fallen out of the window.',
        'The indexes stay in increasing order. Their values stay in **decreasing** order, so the front is always the maximum of the current window.',
        'Before you push **i**, drop the front while **peekFirst() <= i - k**. Those indexes are no longer inside the window of size **k**.',
        'Then drop from the back while the value at the back is **≤ a[i]**. Those indexes can never be the maximum while **i** is still in the window. A smaller, older value is useless.',
        '**offerLast(i)**. If the window is full (**i >= k - 1**), the answer at this position is **a[peekFirst()]**.',
        'Each index is pushed once and popped once. The inner **while** loops are amortized O(1), so the whole scan is **O(n)**, not O(nk).',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Sliding window maximum. The front index is the max.',
      code: `Deque<Integer> dq = new ArrayDeque<>(); // indexes, decreasing values
for (int i = 0; i < n; i++) {
    while (!dq.isEmpty() && dq.peekFirst() <= i - k) dq.pollFirst();
    while (!dq.isEmpty() && a[dq.peekLast()] <= a[i]) dq.pollLast();
    dq.offerLast(i);
    if (i >= k - 1) ans[i - k + 1] = a[dq.peekFirst()];
}`,
    },
    {
      type: 'list',
      items: [
        'A window **minimum** flips the value test: drop from the back while the back is **≥ a[i]**, so the front is the smallest.',
        '**0-1 BFS** uses both ends for a different reason. An edge of weight 0 is **offerFirst** (still the same distance). An edge of weight 1 is **offerLast**. **pollFirst** still takes the next node. That is O(V + E) for weights that are only 0 or 1.',
      ],
    },
    {
      type: 'quiz',
      title: 'Check your understanding — Deque',
      questions: [
        {
          prompt: 'Which pair is a BFS queue on an ArrayDeque?',
          options: [
            'push and pop',
            'offerLast and pollFirst',
            'offerFirst and pollLast only',
            'add at index 0 and remove at the end',
          ],
          answer: 1,
          explanation: 'Enqueue at the **back** (**offerLast**). Dequeue at the **front** (**pollFirst**). **push** / **pop** are the stack pair, both at the back.',
        },
        {
          prompt: 'Why avoid **java.util.Stack**?',
          options: [
            'It cannot hold integers',
            'It is a legacy synchronized Vector. ArrayDeque is the stack to use',
            'It is unordered',
            'pop is O(n)',
          ],
          answer: 1,
          explanation: '**Stack** extends **Vector**. Every operation takes a lock you do not need. **ArrayDeque.push** and **pop** are the replacement.',
        },
        {
          prompt: 'Why is the sliding-window maximum O(n) with a deque?',
          options: [
            'Each index is pushed once and popped at most once, so the while-loops add up to O(n)',
            'The deque sorts the window with quicksort',
            'peekFirst scans the window',
            'k is always 1',
          ],
          answer: 0,
          explanation: 'The inner loops look nested, but every index enters once and leaves once. That total is linear.',
        },
        {
          prompt: 'What does **ArrayDeque** do with a **null** element?',
          options: [
            'It stores one null, like HashMap',
            'It rejects null',
            'It treats null as the number 0',
            'It uses null to mean the deque is empty',
          ],
          answer: 1,
          explanation: 'Null is not allowed. Emptiness is **isEmpty()**, not a null element. **poll** on an empty deque returns null, which is why you check **isEmpty** first.',
        },
        {
          prompt: 'A BFS uses **ArrayList** and **remove(0)**. What goes wrong?',
          options: [
            'remove(0) is O(1), so nothing',
            'Every removal shifts the whole list, so each pop is O(n)',
            'ArrayList cannot be iterated',
            'remove(0) deletes the value 0',
          ],
          answer: 1,
          explanation: '**remove(0)** closes the hole by shifting every later element. The queue operations belong on an **ArrayDeque**.',
        },
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  F[front pollFirst] --> Ring[circular array]
  Ring --> B[back offerLast]
  Mono[monotonic invariant] --> Ring`,
    caption: 'The same ring is a queue, a stack, or a window',
    explanation:
      '**pollFirst** takes the front of the ring. **offerLast** writes at the back. A stack uses the back for both **push** and **pop**. A monotonic deque keeps an extra rule on that ring: indexes increase, and the values from the front are decreasing, so the front is the window maximum.',
  },
  example: [
    {
      type: 'heading',
      text: '0-1 BFS',
    },
    {
      type: 'list',
      items: [
        'Edge weight **0**: **offerFirst**. The distance did not grow, so this node should be processed before nodes that already paid 1.',
        'Edge weight **1**: **offerLast**. It is a strictly later distance.',
        '**pollFirst** always takes the next node. Both ends are what make the weights stay in order without a heap.',
      ],
    },
  ],
  complexity: {
    average: 'O(1) offer, poll, and peek at either end',
    worst: 'O(1) per end operation. A resize is occasional and amortized.',
    space: 'O(n) elements',
  },
  patternRecognition: [
    'Level-order BFS → a queue.',
    'Iterative DFS, or matching brackets → a stack.',
    'Sliding window min or max → a monotonic deque of indexes.',
    '0-1 BFS → push weight 0 at the front and weight 1 at the back.',
  ],
  commonMistakes: [
    'ArrayList.remove(0) as the queue pop. That is O(n).',
    'Reaching for java.util.Stack out of habit.',
    'Forgetting to drop indexes that have left the window, from the front.',
    'Inserting null into an ArrayDeque.',
  ],
  tradeoffs: {
    advantages: ['O(1) at both ends', 'Tight array storage', 'No lock on every call'],
    disadvantages: ['No random access by index', 'No null elements', 'Not thread-safe'],
    alternatives: ['PriorityQueue when the order is a priority, not arrival time', 'ArrayList only if you also need indexes'],
    whenToUse: ['BFS', 'A monotonic window', 'A stack simulation'],
    whenNotToUse: ['You need priority order', 'You insert in the middle all the time'],
  },
  failureModes: [
    'Time limit from a LinkedList or from ArrayList front removal dressed up as BFS.',
    'The monotonic test faces the wrong way, so the front is the minimum when you wanted the maximum.',
  ],
  interview: {
    expectations: ['Name ArrayDeque for both the stack and the queue', 'Explain why the window maximum is O(n)'],
    commonQuestions: ['Sliding Window Maximum', 'Valid Parentheses', 'BFS shortest path'],
    followUps: ['Why not the Stack class?', 'How does 0-1 BFS use both ends?'],
    misconceptions: ['A deque is only for problems that are literally double-ended'],
    traps: ['poll on an empty deque returns null. Check isEmpty.'],
    strongSignals: ['Says ArrayDeque, and can state the decreasing-value invariant'],
  },
  keyTakeaways: [
    'ArrayDeque is the default stack and the default queue.',
    'Both ends are O(1). Do not use Stack or Vector.',
    'A monotonic deque makes sliding window min and max O(n).',
    'BFS is offerLast plus pollFirst.',
    '0-1 BFS pushes a weight-0 edge at the front.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How do you write the BFS queue?',
      answerHint: 'Deque, new ArrayDeque. offerLast to enqueue, pollFirst to dequeue.',
    },
    {
      level: 'intermediate',
      question: 'Why is the monotonic deque O(n) for the window maximum?',
      answerHint: 'Each index is offered once and polled once. The while loops are amortized across the whole array.',
    },
    {
      level: 'advanced',
      question: 'How does 0-1 BFS use the deque?',
      answerHint: 'Weight 0 goes to the front, weight 1 goes to the back. pollFirst still takes the next node. Distances stay in order without a heap.',
    },
  ],
  flashcards: [
    { front: 'The stack to use', back: 'ArrayDeque push and pop. Not java.util.Stack.' },
    { front: 'BFS operations', back: 'offerLast to enqueue, pollFirst to dequeue.' },
  ],
  quickRevision: [
    'ArrayDeque for the stack and the queue',
    'O(1) at both ends',
    'No null elements',
    'Monotonic deque for the window max or min',
    'Do not remove(0) on an ArrayList',
    '0-1 BFS: weight 0 at the front',
  ],
}
