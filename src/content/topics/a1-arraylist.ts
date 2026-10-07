import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The Collections Framework is Java’s standard toolkit of interfaces and classes for grouping objects: lists, sets, maps, queues, and deques. In interviews you almost always program to an interface (List, Set, Map, Deque) and pick a concrete class (ArrayList, HashSet, HashMap, ArrayDeque, PriorityQueue) based on the operations you need. This topic starts with the map of the framework, then zooms into ArrayList—the default growable sequence.',
  whyExists:
    'Raw arrays have a fixed length and no rich API. Contests and interviews constantly need “unknown length,” “unique elements,” “fast key lookup,” or “min/max next.” The framework gives battle-tested implementations so you spend time on algorithms, not reinventing dynamic arrays and hash tables.',
  mentalModel:
    'Interface = the contract (what you can do). Implementation = how it is done (array vs hash table vs tree). Choose by the dominant operation: index access → ArrayList; unique membership → HashSet; key→value → HashMap; stack/queue ends → ArrayDeque; ordered keys → TreeMap/TreeSet; “always get smallest” → PriorityQueue.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Step 1 — The big picture. Collection is the root for things you can iterate (lists, sets, queues). Map is separate: it stores key→value pairs, not a single sequence. Nested topics under this section cover HashMap, HashSet, TreeMap, TreeSet, Deque, and PriorityQueue in depth—learn ArrayList here first, then branch out.',
    },
    {
      type: 'table',
      headers: ['Need', 'Interface', 'Typical class', 'Cheatsheet'],
      rows: [
        ['Ordered sequence, index access', 'List', 'ArrayList', 'get/set O(1); grow at end'],
        ['Unique elements, fast contains', 'Set', 'HashSet', 'add/contains ~O(1) avg'],
        ['Key → value lookup', 'Map', 'HashMap', 'get/put ~O(1) avg'],
        ['Sorted unique keys', 'NavigableSet / Map', 'TreeSet / TreeMap', 'O(log n) ops'],
        ['Stack / queue / both ends', 'Deque', 'ArrayDeque', 'push/pop/offer/poll O(1)'],
        ['Always extract min/max', 'Queue', 'PriorityQueue', 'O(log n) offer/poll'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Declare the interface',
      text: 'Write List<Integer> a = new ArrayList<>(); not ArrayList<Integer> a = …. Same for Map/Set/Deque. You can swap the implementation later without rewriting call sites.',
    },
    {
      type: 'paragraph',
      text: 'Step 2 — What is ArrayList? It is a resizable array behind the List interface: you append, get by index, and grow automatically when capacity runs out. Use it when you need a dynamic sequence and mostly touch the end or random indices—adjacency lists, collecting answers, sorting then scanning.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Default capacity starts small; grows (~1.5×) when size == capacity.',
        'get(i) / set(i, e): O(1) after bounds check.',
        'add(e): amortized O(1) at end; add(i, e): O(n) shift.',
        'remove(i) or remove(Object): O(n) shift; removeLast (Java 21+) O(1).',
        'toArray(new T[0]) or manual copy to int[] when primitives are required.',
      ],
    },
    {
      type: 'table',
      headers: ['Operation', 'Time', 'Notes'],
      rows: [
        ['get / set', 'O(1)', 'Index bounds checked'],
        ['add (end)', 'O(1) amortized', 'Occasional resize O(n)'],
        ['add (index)', 'O(n)', 'Shifts right'],
        ['remove (index)', 'O(n)', 'Shifts left'],
        ['contains', 'O(n)', 'Uses equals'],
        ['sort (Collections)', 'O(n log n)', 'TimSort stable'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Primitives vs boxing',
      text: 'ArrayList<Integer> boxes each int. For heavy numeric work prefer int[] when size is known; use ArrayList when length grows unpredictably or you need the List API (sort, subList, Collections).',
    },
    {
      type: 'paragraph',
      text: 'Step 3 — ArrayList vs fixed array. int[] a = new int[n] when n is known and you only need primitives. ArrayList when you do not know the final size, or when each slot is itself a list (graph adjacency).',
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
      'Start at the top: the framework splits into Collection (group of elements) and Map (key→value). List is the ordered, indexable branch—ArrayList is the everyday implementation. Set is uniqueness; Deque/Queue cover stacks, queues, and heaps via PriorityQueue. Nested topics in this section drill into HashMap, HashSet, TreeMap, TreeSet, Deque, and PriorityQueue. Master ArrayList and this map first so each nested topic plugs into a mental slot instead of feeling like a random API.',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Graph adjacency: for each of n nodes, create an empty ArrayList of neighbors. That is List<List<Integer>>—an ArrayList of ArrayLists. Fixed int[][] does not grow when degrees vary.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Build adjacency list',
      code: `int n = 5;
List<List<Integer>> adj = new ArrayList<>();
for (int i = 0; i < n; i++) adj.add(new ArrayList<>());
adj.get(0).add(1);
adj.get(1).add(0);`,
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
      caption: 'Two-pointer on ArrayList',
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
    worst: 'O(n) single append triggers resize; O(n) middle insert/remove',
    space: 'O(n) elements + unused capacity in backing array',
  },
  patternRecognition: [
    'Need dynamic growth or unknown output count → ArrayList.',
    'Graph adjacency lists: List<List<Integer>>.',
    'Merge intervals / meeting rooms: sort list then scan.',
    'Stack-like only at end → ArrayList as stack (add/remove last)—or prefer Deque.',
    'Fast contains on many values → HashSet, not ArrayList.contains.',
  ],
  commonMistakes: [
    'Using ArrayList.contains in a hot loop (O(n) each)—prefer HashSet.',
    'remove(int index) vs remove(Integer)—autoboxing picks the wrong overload.',
    'foreach + remove → ConcurrentModificationException.',
    'get(i) without checking empty list or i >= size().',
    'Using ArrayList as a front queue → O(n) per poll; use ArrayDeque.',
  ],
  tradeoffs: {
    advantages: ['Fast random access', 'Simple API', 'Works with Collections.sort', 'Clear place in the framework'],
    disadvantages: ['O(n) front/middle edits', 'Boxing cost for Integer lists', 'Not thread-safe'],
    alternatives: ['int[] when size fixed', 'LinkedList for frequent middle insert (rare in CP)', 'ArrayDeque for queue/stack'],
    whenToUse: ['Adjacency lists', 'Collecting results', 'Sortable sequences'],
    whenNotToUse: ['FIFO queue at front', 'Membership tests at scale—use HashSet'],
  },
  failureModes: [
    'Iterator invalidation during structural modify.',
    'Memory blow-up from many tiny default-capacity lists—pre-size with new ArrayList<>(expected).',
  ],
  interview: {
    expectations: [
      'Sketch List / Set / Map / Deque and name one class each',
      'Know amortized append vs middle insert cost for ArrayList',
      'Use List<List<T>> for graphs',
    ],
    commonQuestions: [
      'ArrayList vs LinkedList?',
      'When HashSet instead of ArrayList?',
      'Implement a dynamic array',
    ],
    followUps: ['What is the growth strategy?', 'How to remove while iterating?'],
    misconceptions: ['ArrayList insert is always O(1)', 'Collections = only ArrayList'],
    traps: ['remove in enhanced for-loop', 'IndexOutOfBounds on empty list'],
    strongSignals: ['Picks structure from the need table', 'Mentions Iterator.remove or reverse delete'],
  },
  keyTakeaways: [
    'Framework = interfaces + implementations; program to the interface.',
    'ArrayList: O(1) get/set; O(1) amortized add end; O(n) middle.',
    'List<List<Integer>> = graph adjacency.',
    'Do not use ArrayList as a front-queue or as a huge contains-set.',
    'Next: HashMap / HashSet / Tree* / Deque / PriorityQueue nested topics.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'List vs Set vs Map—one sentence each?',
      answerHint: 'List = ordered sequence; Set = unique elements; Map = key→value.',
    },
    {
      level: 'basic',
      question: 'Time complexity of ArrayList.get(i)?',
      answerHint: 'O(1) random access in the backing array.',
    },
    {
      level: 'intermediate',
      question: 'Why is append amortized O(1)?',
      answerHint: 'Capacity growth; rare resize cost spread over many cheap appends.',
    },
    {
      level: 'advanced',
      question: 'Safe way to remove elements while iterating?',
      answerHint: 'Iterator.remove(), loop backwards, removeIf, or build a new list.',
    },
  ],
  flashcards: [
    {
      front: 'ArrayList add at end complexity',
      back: 'O(1) amortized; occasional O(n) resize.',
    },
    {
      front: 'Graph adjacency in Java',
      back: 'List<List<Integer>> adj = new ArrayList<>(n); adj.get(u).add(v);',
    },
    {
      front: 'When not ArrayList.contains?',
      back: 'Many membership tests → HashSet (~O(1) avg).',
    },
  ],
  quickRevision: [
    'Interfaces: List Set Map Deque',
    'ArrayList = resizable array',
    'O(1) get/set, amortized add end',
    'O(n) insert/remove middle',
    'Adjacency: List of lists',
    'Not a front-queue or fast set',
    'remove(int) vs remove(Integer)',
  ],
}
