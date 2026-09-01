import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'ArrayList<E> is Java’s resizable-array implementation of List: dynamic append, indexed get/set in O(1) amortized, insert/remove in the middle O(n). The default “growable array” for competitive coding when size is unknown.',
  whyExists:
    'Raw arrays have fixed length. ArrayList doubles capacity when full (amortized O(1) add-at-end), gives size(), and interoperates with Collections.sort—essential for building edge lists, result buffers, and unknown-length outputs.',
  mentalModel:
    'Backing array + size counter. add(e) appends at index size; remove(i) shifts tail left. Random access by index is direct array access; middle insert is a slide operation.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Default capacity 10; grows ~1.5× (implementation detail) when size == capacity.',
        'get(i) / set(i, e): O(1) after bounds check.',
        'add(e): amortized O(1) at end; add(i, e): O(n) shift.',
        'remove(i) or remove(Object): O(n) shift; removeLast (Java 21+) O(1).',
        'toArray(new T[0]) or stream to int[] when primitives needed.',
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
      variant: 'tip',
      title: 'Primitives',
      text: 'ArrayList<Integer> boxes ints. For heavy numeric work prefer int[] or IntArrayList-style manual arrays; use ArrayList when size grows unpredictably or you need List API.',
    },
  ],
  example: [
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
    'Need dynamic growth or unknown output count.',
    'Graph adjacency lists: List<List<Integer>> or List<List<int[]>>.',
    'Merge intervals, meeting rooms: sort list then scan.',
    'Stack-like only at end → ArrayList as stack (add/remove last).',
  ],
  commonMistakes: [
    'remove(int index) vs remove(Integer) — autoboxing picks wrong overload.',
    'Concurrent modification: foreach + remove → ConcurrentModificationException.',
    'get(i) without checking empty list or i >= size().',
    'Using ArrayList for queue at front → O(n) per poll; use Deque instead.',
  ],
  tradeoffs: {
    advantages: ['Fast random access', 'Simple API', 'Works with Collections.sort'],
    disadvantages: ['O(n) front/middle edits', 'Boxing cost for Integer lists', 'Not thread-safe'],
    alternatives: ['int[] when size fixed', 'LinkedList for frequent middle insert (rare in CP)', 'ArrayDeque for queue/stack'],
    whenToUse: ['Adjacency lists', 'Collecting results', 'Sortable sequences'],
    whenNotToUse: ['FIFO queue at front', 'Fixed-size primitive arrays with no resize'],
  },
  failureModes: [
    'Iterator invalidation during structural modify.',
    'Memory blow-up from default capacity + many small lists—pre-size with new ArrayList<>(expected).',
  ],
  interview: {
    expectations: [
      'Know amortized append vs middle insert cost',
      'Use List<List<T>> for graphs',
      'Sort with Comparator',
    ],
    commonQuestions: [
      'Implement dynamic array',
      'Why ArrayList over LinkedList?',
    ],
    followUps: ['What is load factor / growth strategy?', 'How to remove while iterating?'],
    misconceptions: ['ArrayList is always O(1) insert'],
    traps: ['remove in enhanced for-loop', 'IndexOutOfBounds on empty list'],
    strongSignals: ['Mentions Iterator.remove or reverse iteration for deletes'],
  },
  keyTakeaways: [
    'O(1) get/set; O(1) amortized add end; O(n) middle.',
    'List<List<Integer>> = graph adjacency.',
    'Collections.sort + Comparator for custom order.',
    'Do not use as queue from index 0.',
    'Watch remove(int) vs remove(Integer).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Time complexity of ArrayList.get(i)?',
      answerHint: 'O(1) random access in backing array.',
    },
    {
      level: 'intermediate',
      question: 'Why is append amortized O(1)?',
      answerHint: 'Doubling capacity; resize cost spread over many appends.',
    },
    {
      level: 'advanced',
      question: 'Safe way to remove elements while iterating?',
      answerHint: 'Iterator.remove(), or loop backwards, or removeIf / new list.',
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
  ],
  quickRevision: [
    'Resizable array + size',
    'O(1) get/set, amortized add end',
    'O(n) insert/remove middle',
    'Adjacency: List of lists',
    'Sort with Comparator',
    'Not a front-queue',
    'remove(int) vs remove(Integer)',
  ],
}
