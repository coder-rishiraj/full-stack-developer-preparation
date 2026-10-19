import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '**TreeMap<K,V>** is a **Red-Black tree** of **key → value** pairs. The keys stay sorted. **get**, **put**, **remove**, and the neighbor queries **floor** and **ceiling** are all **O(log n)**.',
  whyExists:
    '**HashMap** will not tell you the next larger key. Sweep lines, calendars, and “largest key ≤ x” need that neighbor, and they need it after every insert. Sorting the keys from scratch on every query is too slow.',
  mentalModel:
    'A balanced binary search tree, ordered by the key. Left is smaller, right is larger. An in-order walk is the sorted order. Think of a sorted array that can insert and delete in **O(log n)** instead of shifting **O(n)** elements.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'When the order of keys is the point.',
        'How a key is allowed to be compared.',
        '**floor** and **ceiling**.',
        'A sweep line, which is just a sorted timeline.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — HashMap when order does not matter, TreeMap when it does',
    },
    {
      type: 'list',
      items: [
        '**HashMap** is the faster plain **get** / **put**, about **O(1)**. It has no “next key.”',
        '**TreeMap** keeps every key in sorted order. Each **get**, **put**, and **remove** is **O(log n)** because the tree stays balanced.',
        'You pay that log factor only because you need order: the smallest key, the largest, or the neighbor of **x**.',
        'If you only need the minimum, a **PriorityQueue** is enough and does not keep the whole order navigable.',
        '**TreeMap** sorts **keys**, not values. Two values are not ordered unless you stored the ordering in the key.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — The keys must be comparable',
    },
    {
      type: 'list',
      items: [
        '**Integer** and **String** already implement **Comparable**. **new TreeMap<>()** uses that natural order.',
        'A custom order needs a **Comparator** at construction.',
        'Write **Integer.compare(a, b)**. Do not write **a - b**. Subtraction overflows, and a negative overflow looks like a positive comparison.',
        'The comparator must agree with **equals**. If **compare** says two keys are the same, the map treats them as the same key.',
        '**null** keys are not allowed. **put(null, v)** throws **NullPointerException**. **HashMap** allows one null key. **TreeMap** does not.',
        'Do not change a key after insert. The tree placed it by the old comparison, and a changed key breaks the order.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 3 — floor, ceiling, and the ends',
    },
    {
      type: 'list',
      items: [
        '**floorKey(k)** is the greatest key that is **≤ k**. **ceilingKey(k)** is the least key that is **≥ k**. Both are **O(log n)**. If none exists, you get **null**.',
        '**floorEntry** / **ceilingEntry** return the key and the value together.',
        '**higherKey(k)** is strictly greater than **k**. **lowerKey(k)** is strictly smaller. Floor and ceiling may return **k** itself when it is present.',
        '**firstKey** / **lastKey** are the current minimum and maximum.',
        '**pollFirstEntry** / **pollLastEntry** remove that end. Use them when the algorithm consumes the smallest or largest key.',
        '**headMap**, **tailMap**, and **subMap** are views of a range. They are not copies. Editing the view edits the map.',
      ],
    },
    {
      type: 'table',
      headers: ['Operation', 'Time', 'What you get'],
      rows: [
        ['**get** / **put** / **remove**', 'O(log n)', 'The usual map operations, on a sorted tree'],
        ['**firstKey** / **lastKey**', 'O(log n)', 'Current minimum or maximum key'],
        ['**floor** / **ceiling**', 'O(log n)', 'Neighbor on the left or the right of a query'],
        ['Walk every entry', 'O(n)', 'Keys in sorted order'],
      ],
    },
    {
      type: 'heading',
      text: 'Step 4 — A sweep line is a TreeMap of events',
    },
    {
      type: 'list',
      items: [
        'A meeting that starts at **s** and ends at **e** is two events: **+1** at **s**, **−1** at **e**.',
        '**merge(start, 1, Integer::sum)** and **merge(end, -1, Integer::sum)** record them. The keys are times, so the map’s iteration order is time order.',
        'Walk **entrySet** from earliest to latest. A running **active** sum is how many meetings are open at that time.',
        'The maximum **active** is the number of rooms. You never sorted a separate list; the tree is the order.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Meetings as +1 and −1 on a timeline',
      code: `TreeMap<Integer, Integer> timeline = new TreeMap<>();
timeline.merge(start, 1, Integer::sum);
timeline.merge(end, -1, Integer::sum);
int active = 0;
for (var e : timeline.entrySet()) {
    active += e.getValue();
    // track max concurrent
}`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Comparator and null',
      text: '**Integer.compare(a, b)**, never **a - b**. And never a **null** key. Those two mistakes are the usual wrong answers and the usual crash.',
    },
    {
      type: 'quiz',
      title: 'Check your understanding — TreeMap',
      questions: [
        {
          prompt: 'How do **TreeMap** and **HashMap** differ on **get** and **put**?',
          options: [
            'Both are O(1)',
            'TreeMap is O(log n); HashMap is about O(1) and has no key order',
            'TreeMap is O(1); HashMap is O(log n)',
            'Both are O(n)',
          ],
          answer: 1,
          explanation: 'The tree walk is **O(log n)** and the keys stay sorted. The hash map is faster and unordered. Use the tree only when you need that order.',
        },
        {
          prompt: 'What does **floorEntry(k)** return?',
          options: [
            'The smallest key strictly greater than k',
            'The entry with the greatest key that is still ≤ k, or null',
            'Every key less than k',
            'The value k, even if it was never inserted',
          ],
          answer: 1,
          explanation: '**floor** is the predecessor, including **k** if **k** itself is a key. **lowerEntry** is the strict one, always smaller than **k**.',
        },
        {
          prompt: 'What happens if you **put** a null key?',
          options: [
            'It is allowed, once, like HashMap',
            'NullPointerException',
            'The key is stored at the front',
            'It becomes 0',
          ],
          answer: 1,
          explanation: 'Ordering a **null** has no natural comparison. **TreeMap** rejects null keys. **HashMap** allows one.',
        },
        {
          prompt: 'A comparator is written **(a, b) -> a - b** for large ints. What is the risk?',
          options: [
            'None. Subtraction is how compare is defined',
            'Overflow can flip the sign, so the order is wrong',
            'TreeMap ignores the comparator',
            'It makes every operation O(1)',
          ],
          answer: 1,
          explanation: '**Integer.MIN_VALUE - 1** does not stay negative in **int** arithmetic. **Integer.compare(a, b)** does not subtract.',
        },
        {
          prompt: 'You sort a TreeMap by value to find the largest value. Does iteration do that?',
          options: [
            'Yes. entrySet is sorted by value',
            'No. The tree is ordered by key',
            'Yes, but only for Integer values',
            'Yes, after the first put',
          ],
          answer: 1,
          explanation: 'In-order iteration yields **keys** from small to large. If the value is what must be ordered, the value has to be part of the key, or you need a different structure.',
        },
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Root[RBT root] --> L[left subtree smaller keys]
  Root --> R[right subtree larger keys]
  Nav[floor/ceiling] --> Root`,
    caption: 'Keys live in a balanced tree',
    explanation:
      'Every key in the left subtree is smaller than the root, and every key on the right is larger. **floor** and **ceiling** walk that order. The red-black balance keeps the walk **O(log n)** after inserts and deletes.',
  },
  example: [
    {
      type: 'heading',
      text: 'Does this new meeting overlap?',
    },
    {
      type: 'list',
      items: [
        'Store booked intervals as **start → end** in a **TreeMap**.',
        'For a new **[s, e)**, **floorEntry(s)** is the last interval that starts at or before **s**.',
        'It overlaps when that previous interval ends after **s**. Also check the next interval: it overlaps when its start is before **e**.',
        'Both checks are **O(log n)**. Scanning every booked interval would be O(n) per insert.',
      ],
    },
  ],
  complexity: {
    average: 'O(log n) per map operation',
    worst: 'O(log n). The tree stays balanced.',
    space: 'O(n)',
  },
  patternRecognition: [
    'You need sorted keys, or the predecessor or successor of a query.',
    'A sweep line: coordinate → a delta.',
    'Intervals ordered by start, with an overlap check against the neighbor.',
    'Only the minimum, with no neighbor query → a heap is enough.',
  ],
  commonMistakes: [
    'A comparator that subtracts. Use Integer.compare.',
    'Expecting HashMap speed. TreeMap is O(log n).',
    'Inserting a null key.',
    'Mutating a key after insert, which breaks the tree order.',
  ],
  tradeoffs: {
    advantages: ['Sorted iteration', 'floor and ceiling', 'A reliable O(log n), not an average'],
    disadvantages: ['Slower than HashMap', 'No null keys', 'The comparator must agree with equals'],
    alternatives: ['Sort once and binary-search if the keys never change', 'PriorityQueue if you only need min or max', 'HashMap, then sort the keys only when you print'],
    whenToUse: ['Neighbor queries on keys', 'Sweep lines', 'A dynamic set of ordered times'],
    whenNotToUse: ['Plain lookup with no order', 'Keys that cannot be compared'],
  },
  failureModes: [
    'Time limit from a TreeMap where a HashMap was enough.',
    'An inconsistent comparator, so the order and equals disagree.',
  ],
  interview: {
    expectations: ['State O(log n) and name floor or ceiling', 'Contrast it with HashMap and with a heap'],
    commonQuestions: ['My Calendar', 'Count of smaller numbers after self'],
    followUps: ['Why a red-black tree rather than “just a BST”?', 'What if the keys never change after the start?'],
    misconceptions: ['TreeMap sorts values. It sorts keys.'],
    traps: ['int[] is not Comparable, so it cannot be a natural-order key'],
    strongSignals: ['Uses floorEntry to test the neighboring interval instead of scanning'],
  },
  keyTakeaways: [
    'O(log n) get and put, and the keys are always sorted.',
    'floor and ceiling are the predecessor and successor queries.',
    'Integer.compare in comparators. No null keys.',
    'A sweep line is a map from coordinate to delta.',
    'Use HashMap when you do not care about order.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'TreeMap versus HashMap, in time?',
      answerHint: 'TreeMap is O(log n) and sorted. HashMap is O(1) on average and unordered.',
    },
    {
      level: 'intermediate',
      question: 'What does floorEntry(k) return?',
      answerHint: 'The entry with the greatest key that is still ≤ k, or null if every key is larger.',
    },
    {
      level: 'advanced',
      question: 'How do you reject an overlapping interval with a TreeMap?',
      answerHint: 'floorEntry(start) checks the previous interval’s end. The next entry’s start is checked against the new end. Either neighbor overlapping means reject.',
    },
  ],
  flashcards: [
    { front: 'TreeMap null keys?', back: 'Not allowed. put(null, …) throws NullPointerException.' },
    { front: 'Safe int comparator', back: 'Integer.compare(a, b). Not a - b.' },
  ],
  quickRevision: [
    'Red-black tree, keys sorted',
    'O(log n) for the main operations',
    'floor and ceiling',
    'No null keys',
    'Integer.compare',
    'Sweep line: time → delta',
  ],
}
