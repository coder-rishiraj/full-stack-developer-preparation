import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The **Collections Framework** is Java’s toolkit for grouping objects: **lists**, **sets**, **maps**, **queues**, and **deques**. You program to an interface (**List**, **Set**, **Map**, **Deque**) and pick a class (**ArrayList**, **HashSet**, **HashMap**, **ArrayDeque**, **PriorityQueue**) for the job. This page is the map of that toolkit, then a close look at **ArrayList**.',
  whyExists:
    'A raw array has a fixed length and almost no helpers. Interviews keep asking for “unknown length,” “unique elements,” “look up by a key,” or “the next smallest.” The framework already has those structures, so you spend time on the algorithm.',
  mentalModel:
    'The **interface** is the contract: what you can do. The **class** is how it is done: array, hash table, or tree. Pick by the operation you do most. Index access → **ArrayList**. Unique membership → **HashSet**. Key to value → **HashMap**. Both ends → **ArrayDeque**. Sorted keys → **TreeMap** / **TreeSet**. Always the smallest → **PriorityQueue**.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Read this page first. The later topics assume you can place each class on this map.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'The two families: **Collection** and **Map**.',
        'Declare the **interface**, construct the **class**.',
        'What **ArrayList** actually is.',
        'The cost of **get**, **add**, and **remove**.',
        'Boxing, and the two **remove** methods.',
        'When a different class is the better tool.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — Two families: Collection and Map',
    },
    {
      type: 'list',
      items: [
        '**Collection** is the root for things you can loop over: lists, sets, and queues. Each item is one element.',
        '**Map** is separate. It stores **key → value** pairs, not a single sequence. You do not iterate “elements”; you look up a value by a key.',
        '**List** keeps order and allows duplicates. You can ask for index 3.',
        '**Set** keeps each value at most once. The question is “have I seen this?”',
        '**Deque** adds and removes at both ends. That covers a stack and a queue.',
        'The nested pages — **HashMap**, **HashSet**, **TreeMap**, **TreeSet**, **Deque**, **PriorityQueue** — each fill one box below. Learn the box first.',
      ],
    },
    {
      type: 'table',
      headers: ['You need', 'Interface', 'Class you usually new', 'Remember'],
      rows: [
        ['Ordered sequence, index access', '**List**', '**ArrayList**', '**get** / **set** are O(1). Growing happens at the end.'],
        ['Unique elements, fast contains', '**Set**', '**HashSet**', '**add** / **contains** are about O(1)'],
        ['Key → value lookup', '**Map**', '**HashMap**', '**get** / **put** are about O(1)'],
        ['Sorted unique keys', '**NavigableSet** / **Map**', '**TreeSet** / **TreeMap**', 'Every op is O(log n)'],
        ['Stack, queue, or both ends', '**Deque**', '**ArrayDeque**', 'Ends are O(1)'],
        ['Always take the current min or max', '**Queue**', '**PriorityQueue**', '**offer** / **poll** are O(log n)'],
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — Declare the interface, construct the class',
    },
    {
      type: 'list',
      items: [
        'Write **List<Integer> a = new ArrayList<>();**',
        'The variable’s type is the interface. The object’s type is the class.',
        'Call sites only see **List**. Later you can switch the class without rewriting every line that uses **a**.',
        'Same habit for **Map**, **Set**, and **Deque**.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Say the need out loud first',
      text: 'Before you type **new**, name the operation. “I need index 0 in O(1)” is **ArrayList**. “I need contains in a loop” is **HashSet**. “I need the smallest each time” is **PriorityQueue**. The table above is that sentence, written down.',
    },
    {
      type: 'heading',
      text: 'Step 3 — ArrayList is a resizable array',
    },
    {
      type: 'list',
      items: [
        'Inside, an **ArrayList** is an ordinary array plus a **size** (how many slots you have used) and a **capacity** (how many slots exist).',
        '**add** at the end writes into the next free slot and increases **size**.',
        '**get(i)** and **set(i, value)** jump straight to index **i**. That is why they are O(1).',
        'When **size** reaches **capacity**, Java allocates a bigger array, about **1.5×**, and copies the old elements over. That copy is expensive, but it happens rarely.',
        'Use it for a sequence whose length you do not know yet: answers you collect, neighbors of a graph node, a list you will sort and then scan.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 4 — What each operation costs',
    },
    {
      type: 'list',
      items: [
        '**get(i)** and **set(i, e)** are O(1). Java still checks that **i** is inside **size**.',
        '**add(e)** at the end is **amortized O(1)**. Most adds are cheap. The occasional resize copies everything, and that cost is spread over the many cheap adds that filled the old array.',
        '**add(i, e)** is O(n). Everything from **i** to the end must shift right to open a hole.',
        '**remove(i)** is O(n). Everything after **i** shifts left to close the hole.',
        '**contains** is O(n). It walks the list and uses **equals**. Do not call it inside a loop over a large list.',
        '**Collections.sort** on an ArrayList is O(n log n). The sort is stable (**TimSort**).',
      ],
    },
    {
      type: 'table',
      headers: ['Operation', 'Time', 'Why'],
      rows: [
        ['**get** / **set**', 'O(1)', 'Direct index into the backing array'],
        ['**add** at the end', 'O(1) amortized', 'A resize sometimes copies the whole array'],
        ['**add** at an index', 'O(n)', 'Shift every later element right'],
        ['**remove** at an index', 'O(n)', 'Shift every later element left'],
        ['**contains**', 'O(n)', 'Linear scan, using **equals**'],
        ['**sort**', 'O(n log n)', 'Stable TimSort'],
      ],
    },
    {
      type: 'heading',
      text: 'Step 5 — Boxing, and the two remove methods',
    },
    {
      type: 'list',
      items: [
        '**ArrayList** stores objects. **ArrayList<Integer>** boxes every **int** into an **Integer**. That costs time and memory.',
        'If you know **n** and you only need numbers, prefer **int[]**. Use **ArrayList** when the length grows, or when you need **sort**, **subList**, or a list of lists.',
        '**remove** has two overloads. **remove(int index)** deletes by position. **remove(Integer value)** deletes the first equal object.',
        '**list.remove(2)** deletes index 2. **list.remove(Integer.valueOf(2))** deletes the value 2. Autoboxing can pick the wrong one if you are not explicit.',
        'Do not **remove** inside a for-each loop. The iterator notices the structure changed and throws **ConcurrentModificationException**. Use **removeIf**, loop backwards, or **Iterator.remove()**.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Empty list, bad index',
      text: '**get(i)** on an empty list, or when **i >= size()**, throws **IndexOutOfBoundsException**. Check **isEmpty()** and the size before you index.',
    },
    {
      type: 'heading',
      text: 'Step 6 — When ArrayList is the wrong tool',
    },
    {
      type: 'list',
      items: [
        'A queue that removes from the front: **remove(0)** shifts the whole list every time. Use **ArrayDeque**.',
        '“Have I seen this?” inside a loop: **contains** is O(n) per call. Use **HashSet**.',
        'Key to value: that is a **Map**, not a list of pairs you scan.',
        'Many tiny lists: the default capacity wastes memory. If you know the size, write **new ArrayList<>(expected)**.',
        'A stack that only touches the end can be an ArrayList (**add** / **remove(size() - 1)**). **ArrayDeque** is still the clearer stack.',
      ],
    },
    {
      type: 'quiz',
      title: 'Check your understanding — the framework and ArrayList',
      questions: [
        {
          prompt: 'In one line each: what is a **List**, a **Set**, and a **Map**?',
          options: [
            'List is unique values; Set is key→value; Map is an ordered sequence',
            'List is an ordered sequence; Set is unique elements; Map is key→value',
            'All three store key→value pairs',
            'List and Set are the same; Map is a queue',
          ],
          answer: 1,
          explanation: '**List** keeps order and indexes. **Set** answers membership and rejects duplicates. **Map** looks up a value by a key. **Map** is not a **Collection**.',
        },
        {
          prompt: 'What is the time for **ArrayList.get(i)**?',
          options: ['O(n)', 'O(log n)', 'O(1)', 'O(n log n)'],
          answer: 2,
          explanation: 'The backing store is an array. Index **i** is a direct jump, after a bounds check.',
        },
        {
          prompt: 'Why is **add** at the end called amortized O(1)?',
          options: [
            'Every single add copies the whole array',
            'Most adds are cheap; a rare resize copies everything, and that cost is spread over many adds',
            'Java sorts the list on every add',
            'The end is always O(n)',
          ],
          answer: 1,
          explanation: 'Capacity grows by about **1.5×**. The copy is O(n), but it happens only when the array is full. The cheap adds in between pay for it.',
        },
        {
          prompt: 'You need a FIFO queue and you call **list.remove(0)** every step. What is wrong?',
          options: [
            'Nothing; remove at the front is O(1)',
            'Each remove shifts every later element, so the queue is O(n) per step',
            'ArrayList cannot store integers',
            'remove(0) deletes the value 0, not index 0',
          ],
          answer: 1,
          explanation: '**remove(0)** is the index overload, and it shifts the entire list. A queue belongs in an **ArrayDeque**: **offerLast** and **pollFirst**.',
        },
        {
          prompt: '**contains** is inside a loop over a large list, and the program is too slow. What should you switch to?',
          options: ['LinkedList', 'HashSet', 'TreeMap', 'PriorityQueue'],
          answer: 1,
          explanation: '**ArrayList.contains** scans from the start every time. **HashSet.contains** is about O(1). Use a set when the question is membership, not index.',
        },
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  CF[Collections Framework]
  CF --> Coll[Collection]
  CF --> Map[Map]
  Coll --> List[List → ArrayList]
  Coll --> Set[Set → HashSet / TreeSet]
  Coll --> Queue[Queue / Deque → ArrayDeque / PriorityQueue]
  Map --> HM[HashMap]
  Map --> TM[TreeMap]`,
    caption: 'Where ArrayList sits in the Collections Framework',
    explanation:
      'Start at the top. The framework splits into **Collection** (a group of elements) and **Map** (key → value). **List** is the ordered, indexable branch, and **ArrayList** is the everyday class. **Set** is uniqueness. **Deque** and **PriorityQueue** cover stacks, queues, and “give me the smallest.” The nested topics each open one of those boxes.',
  },
  example: [
    {
      type: 'heading',
      text: 'A graph is a list of lists',
    },
    {
      type: 'list',
      items: [
        'Node **i** has a list of neighbors. Different nodes have different numbers of neighbors, so a fixed rectangle is a poor fit.',
        '**List<List<Integer>>** is an **ArrayList** whose elements are themselves **ArrayList**s.',
        'Create **n** empty inner lists first. Then **adj.get(u).add(v)** hangs an edge.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Build an adjacency list',
      code: `int n = 5;
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
adj.get(0).add(1);
adj.get(1).add(0);`,
    },
    {
      type: 'heading',
      text: 'Collect, then sort',
    },
    {
      type: 'list',
      items: [
        'Intervals arrive in any order. Put them in an **ArrayList**, then sort by the start.',
        'After the sort, one left-to-right scan can merge overlaps. The list’s job was “grow, then random-access in order.”',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Sort intervals by start',
      code: `List<int[]> intervals = new ArrayList<>();
intervals.add(new int[]{1, 3});
intervals.add(new int[]{0, 2});
intervals.sort(Comparator.comparingInt(a -> a[0]));`,
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Two pointers on an ArrayList',
      code: `List<Integer> list = new ArrayList<>();
int left = 0, right = list.size() - 1;
while (left < right) {
    // use list.get(left), list.get(right)
    left++; right--;
}`,
    },
  ],
  complexity: {
    average: 'O(1) indexed access; O(1) amortized append',
    worst: 'O(n) when one append triggers a resize; O(n) for a middle insert or remove',
    space: 'O(n) elements, plus unused slots in the backing array',
  },
  patternRecognition: [
    'Need dynamic growth or an unknown output count → ArrayList.',
    'Graph adjacency lists: List<List<Integer>>.',
    'Merge intervals / meeting rooms: sort the list, then scan.',
    'Stack that only touches the end → ArrayList can do it; Deque is clearer.',
    'Fast contains on many values → HashSet, not ArrayList.contains.',
  ],
  commonMistakes: [
    'Using ArrayList.contains in a hot loop (O(n) each) — prefer HashSet.',
    'remove(int index) vs remove(Integer) — autoboxing picks the wrong overload.',
    'for-each plus remove → ConcurrentModificationException.',
    'get(i) without checking an empty list or i >= size().',
    'Using ArrayList as a front queue → O(n) per poll; use ArrayDeque.',
  ],
  tradeoffs: {
    advantages: ['Fast random access', 'Simple API', 'Works with Collections.sort', 'A clear place on the framework map'],
    disadvantages: ['O(n) edits at the front or middle', 'Boxing cost for Integer lists', 'Not thread-safe'],
    alternatives: ['int[] when the size is fixed', 'LinkedList only if you truly insert in the middle a lot', 'ArrayDeque for a queue or stack'],
    whenToUse: ['Adjacency lists', 'Collecting results', 'Sequences you will sort'],
    whenNotToUse: ['A FIFO queue at the front', 'Membership tests at scale — use HashSet'],
  },
  failureModes: [
    'The iterator breaks if you change the structure during a for-each.',
    'Many tiny default-capacity lists waste memory. Pre-size with new ArrayList<>(expected).',
  ],
  interview: {
    expectations: [
      'Sketch List, Set, Map, and Deque and name one class for each',
      'Know amortized append versus a middle insert on ArrayList',
      'Use List<List<T>> for a graph',
    ],
    commonQuestions: [
      'ArrayList vs LinkedList?',
      'When HashSet instead of ArrayList?',
      'How would you implement a dynamic array?',
    ],
    followUps: ['What is the growth strategy?', 'How do you remove while iterating?'],
    misconceptions: ['ArrayList insert is always O(1)', 'The Collections Framework is only ArrayList'],
    traps: ['remove inside an enhanced for-loop', 'IndexOutOfBounds on an empty list'],
    strongSignals: ['Picks the structure from the need, not from habit', 'Mentions Iterator.remove, removeIf, or deleting backwards'],
  },
  keyTakeaways: [
    'Program to the interface. List, Set, Map, and Deque are the contracts.',
    'ArrayList: O(1) get and set, amortized O(1) add at the end, O(n) in the middle.',
    'List<List<Integer>> is a graph adjacency list.',
    'Do not use ArrayList as a front-queue or as a set you search with contains.',
    'Next pages: HashMap, HashSet, TreeMap, TreeSet, Deque, PriorityQueue.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'List vs Set vs Map — one sentence each?',
      answerHint: 'List is an ordered sequence. Set holds unique elements. Map stores key → value.',
    },
    {
      level: 'basic',
      question: 'Time complexity of ArrayList.get(i)?',
      answerHint: 'O(1). It is an index into the backing array.',
    },
    {
      level: 'intermediate',
      question: 'Why is append amortized O(1)?',
      answerHint: 'Capacity grows by about 1.5×. The rare O(n) copy is spread over the many cheap appends that filled the old array.',
    },
    {
      level: 'advanced',
      question: 'How do you safely remove elements while iterating?',
      answerHint: 'Iterator.remove(), a backwards index loop, removeIf, or build a new list. A for-each plus remove throws ConcurrentModificationException.',
    },
  ],
  flashcards: [
    { front: 'ArrayList add at the end', back: 'O(1) amortized. An occasional resize copies the array and is O(n).' },
    { front: 'Graph adjacency in Java', back: 'List<List<Integer>> adj; for each node add a new ArrayList; adj.get(u).add(v).' },
    { front: 'When not ArrayList.contains?', back: 'Many membership tests → HashSet, about O(1).' },
  ],
  quickRevision: [
    'Interfaces: List, Set, Map, Deque',
    'ArrayList = resizable array',
    'O(1) get/set, amortized add at the end',
    'O(n) insert or remove in the middle',
    'Adjacency: list of lists',
    'Not a front-queue, not a fast set',
    'remove(int) vs remove(Integer)',
  ],
}
