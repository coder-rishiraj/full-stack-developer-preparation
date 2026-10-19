import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '**PriorityQueue<E>** is a binary heap. **peek** and **poll** give you the current smallest element, or the largest if you reverse the comparator. **offer** and **poll** are **O(log n)**. **peek** is **O(1)**.',
  whyExists:
    'Sorting the whole input again on every step is wasteful. Dijkstra, merging K lists, and “the K most frequent” only need the current best element, and they need it after every update. A heap maintains that extreme.',
  mentalModel:
    'A complete binary tree stored in an array. In a min-heap the parent is **≤** its children, so the root is the minimum. **offer** bubbles a new element up. **poll** moves the last leaf to the root and bubbles it down. This is triage, not a ticket line.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'A queue versus a priority queue.',
        'Min-heap, max-heap, and the costs.',
        'Top K with a heap of size K.',
        'Dijkstra, where a stale entry is skipped on **poll**.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — Arrival order is not priority order',
    },
    {
      type: 'list',
      items: [
        'An **ArrayDeque** returns elements in the order you inserted them. First in, first out.',
        'A **PriorityQueue** returns the **best** element next, no matter when it was inserted. By default, best means smallest.',
        'The rest of the heap is **not** sorted. Only the root is guaranteed to be the extreme. Walking the heap with an iterator does not give sorted order.',
        'If you need every element in order once, and nothing else is inserted, sort an array. The heap earns its place when the set keeps changing.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — Min, max, and what not to call in a loop',
    },
    {
      type: 'list',
      items: [
        '**new PriorityQueue<>()** is a **min-heap**. **poll** returns the smallest.',
        'A **max-heap** reverses the order: **new PriorityQueue<>(Comparator.reverseOrder())**, or **(a, b) -> Integer.compare(b, a)**.',
        '**offer(e)** inserts in **O(log n)**. **poll()** removes the root in **O(log n)**. **peek()** reads the root in **O(1)** and leaves it there.',
        '**poll** on an empty heap returns **null**. Check **isEmpty()** first.',
        '**null** elements are not allowed.',
        '**contains** and **remove(object)** scan the heap. They are **O(n)**. Do not put them in an inner loop.',
        'Building a heap from a collection you already have is **O(n)**, not n separate inserts.',
        'Use **Integer.compare** inside a comparator. **a - b** overflows.',
      ],
    },
    {
      type: 'table',
      headers: ['Operation', 'Time', 'Note'],
      rows: [
        ['**offer** / **poll**', 'O(log n)', 'Bubble up, or bubble down from the root'],
        ['**peek**', 'O(1)', 'Read the root. Do not remove it.'],
        ['Build from a collection', 'O(n)', 'Heapify, cheaper than n inserts'],
        ['**contains** / **remove(object)**', 'O(n)', 'A scan. Avoid it on the hot path.'],
      ],
    },
    {
      type: 'heading',
      text: 'Step 3 — Top K is a heap that stays size K',
    },
    {
      type: 'list',
      items: [
        '“Kth largest” and “top K frequent” do not need a full sort when **K** is much smaller than **n**.',
        'Keep a **min-heap of size K** of the best items seen so far. The root is the worst of those K, which is exactly the Kth best.',
        '**offer** the new candidate. If **size() > k**, **poll** the root away. The small ones fall out. The K largest remain.',
        'Each of the n updates is **O(log K)**. A full sort would be O(n log n).',
        'For frequencies, the heap element is a pair **[value, count]**, and the comparator looks at the count.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'A size-K heap, then the Dijkstra loop',
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
      type: 'heading',
      text: 'Step 4 — Dijkstra cannot decrease a key, so it skips stale polls',
    },
    {
      type: 'list',
      items: [
        'When you find a shorter path to **u**, a real heap would **decrease** the key already inside. **PriorityQueue** has no efficient decrease-key.',
        'The usual pattern: **offer** a new pair **[u, newDist]** anyway, and also write **dist[u] = newDist**. The old, worse pair is still in the heap.',
        'On **poll**, if **d != dist[u]**, this pair is stale. **continue**. The improved pair is still waiting, with the distance you recorded.',
        'You may push several pairs per node. The extra entries are the price of not having decrease-key. Each edge is still processed a limited number of times.',
        'Merging K sorted lists is the same heap, used more gently: the heap holds the current head of each list, ordered by value. **poll** the smallest, then **offer** that node’s **next**. Total time is O(N log K).',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'The heap is not a sorted list',
      text: 'Only the root is the min or the max. If you print the heap by iterating, the order will look scrambled. **poll** repeatedly if you need the elements in order — and that empties the heap.',
    },
    {
      type: 'quiz',
      title: 'Check your understanding — PriorityQueue',
      questions: [
        {
          prompt: 'What does **new PriorityQueue<>()** return from **poll**, if you never pass a comparator?',
          options: ['The largest element', 'The smallest element', 'The oldest element', 'A random element'],
          answer: 1,
          explanation: 'The default is a **min-heap**. A max-heap needs **Comparator.reverseOrder()** or a comparator that flips the arguments.',
        },
        {
          prompt: 'What is the cost of **poll()**?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n log n)'],
          answer: 1,
          explanation: 'The root is removed and the last leaf moves to the root, then sifts down. That path is the height of the tree, **O(log n)**. **peek** is the O(1) read.',
        },
        {
          prompt: 'You iterate a PriorityQueue. What order do you see?',
          options: [
            'Sorted order',
            'Insertion order',
            'No useful order. Only the root is the extreme.',
            'Reverse sorted order',
          ],
          answer: 2,
          explanation: 'The array layout keeps the heap property, not sorted order. Do not loop the heap and expect the elements to come out sorted.',
        },
        {
          prompt: 'Top K largest with a heap of size K. Which heap, and what sits at the root?',
          options: [
            'A max-heap; the root is the largest of everything',
            'A min-heap of the K best; the root is the smallest of those K, which is the Kth largest',
            'A min-heap of every element; the root is the Kth',
            'An ArrayDeque of size K',
          ],
          answer: 1,
          explanation: 'You keep only K elements. The min-heap root is the weakest survivor. Anything smaller than the root is polled away. If the heap grew past K, you would be storing more than K.',
        },
        {
          prompt: 'In the Dijkstra snippet, why **continue** when **d != dist[u]**?',
          options: [
            'The node is unreachable',
            'This pair is a stale longer distance. A better one was already recorded.',
            'The heap is empty',
            'd is always equal to dist[u]',
          ],
          answer: 1,
          explanation: 'Decrease-key is not available, so worse pairs stay in the heap. **dist[u]** is the best known distance. A polled **d** that disagrees is an old pair and must be ignored.',
        },
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Root[min at index 0] --> L[child 2i+1]
  Root --> R[child 2i+2]
  Offer[offer] --> Up[sift up O log n]
  Poll[poll] --> Down[sift down O log n]`,
    caption: 'The heap lives in an array',
    explanation:
      'Index **0** is the root, the current minimum in a min-heap. The children of index **i** are **2i+1** and **2i+2**. **offer** sifts a new element up until the parent is smaller. **poll** puts the last leaf at the root and sifts it down. Both walks are **O(log n)**.',
  },
  example: [
    {
      type: 'heading',
      text: 'Merge K sorted lists',
    },
    {
      type: 'list',
      items: [
        'The heap starts with the head of each list, ordered by value. Its size is **K**, not the total number of nodes.',
        '**poll** is the next node in the merged order. **offer** that node’s successor, if it has one.',
        'Every node is offered and polled once, each time against a heap of size at most **K**. That is **O(N log K)**.',
      ],
    },
  ],
  complexity: {
    average: 'O(log n) offer and poll',
    worst: 'O(log n) offer and poll. Building a heap from an array is O(n).',
    space: 'O(n) stored elements',
  },
  patternRecognition: [
    'You repeatedly need the current min or max, and the set changes.',
    'K-way merge, Dijkstra, or events ordered by time.',
    'Top K, with K much smaller than n: a heap of size K beats a full sort.',
    'A running median: one heap for the low half and one for the high half.',
  ],
  commonMistakes: [
    'Expecting the iterator to be sorted.',
    'Calling remove or contains on an arbitrary element inside a loop.',
    'Forgetting that the default heap is a min-heap.',
    'A comparator that subtracts and overflows, or that does not break ties when the problem cares.',
  ],
  tradeoffs: {
    advantages: ['The extreme is cheap to read', 'A small API', 'O(n) heapify when you already have the data'],
    disadvantages: ['No fast decrease-key or arbitrary delete', 'No sorted walk', 'poll is O(log n), not O(1)'],
    alternatives: ['TreeSet when you need floor or ceiling', 'Sort once if the data is a batch', 'ArrayDeque if the order is FIFO or LIFO'],
    whenToUse: ['Dijkstra', 'Top K', 'Merge K sorted lists', 'A simulation ordered by time'],
    whenNotToUse: ['You need the neighbor of an arbitrary key', 'You only need a stack or a queue'],
  },
  failureModes: [
    'Time limit from contains or remove inside the inner loop.',
    'The comparator faces the wrong way, so you pop the maximum when you wanted the minimum.',
  ],
  interview: {
    expectations: ['State O(log n)', 'Show the min-heap and the max-heap construction', 'Mention the stale-poll check in Dijkstra'],
    commonQuestions: ['Kth largest', 'Merge K lists', 'Dijkstra', 'Task Scheduler'],
    followUps: ['Why not sort on every step?', 'What would decrease-key change?'],
    misconceptions: ['A priority queue keeps every element in sorted order'],
    traps: ['poll on an empty queue returns null'],
    strongSignals: ['Skips a stale Dijkstra entry instead of pretending decrease-key exists'],
  },
  keyTakeaways: [
    'The default is a min-heap. Reverse the comparator for a max-heap.',
    'offer and poll are O(log n). peek is O(1).',
    'Top K keeps a heap of size K.',
    'Dijkstra pushes a new pair and ignores a stale poll.',
    'Do not call contains or remove(object) in a loop.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the complexity of PriorityQueue.poll()?',
      answerHint: 'O(log n). The root is removed and the replacement sifts down the height of the heap.',
    },
    {
      level: 'intermediate',
      question: 'How do you find the Kth largest in O(n log K)?',
      answerHint: 'A min-heap of size K. Offer each element, and poll when the size exceeds K. The root is the Kth largest of what you have seen.',
    },
    {
      level: 'advanced',
      question: 'Why does Dijkstra push a duplicate distance instead of updating the old one?',
      answerHint: 'PriorityQueue has no efficient decrease-key. The better pair is pushed, dist[u] is updated, and a later poll whose distance disagrees with dist[u] is ignored.',
    },
  ],
  flashcards: [
    { front: 'A max-heap in Java', back: 'new PriorityQueue<>(Comparator.reverseOrder()), or compare (b, a).' },
    { front: 'poll versus peek', back: 'poll removes the root in O(log n). peek only reads it, in O(1).' },
  ],
  quickRevision: [
    'Binary min-heap by default',
    'O(log n) offer and poll',
    'Max-heap via the comparator',
    'Top K is a heap of size K',
    'Dijkstra skips stale polls',
    'The iterator is not sorted',
  ],
}
