import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '**TreeSet<E>** is a sorted set of unique elements, backed by a **Red-Black tree**. **add**, **contains**, and **remove** are **O(log n)**. You also get **first**, **last**, **floor**, **ceiling**, and **pollFirst**.',
  whyExists:
    '**HashSet** cannot answer “what is the largest element currently ≤ x?” Sorting a list after every insert is O(n log n) each time. **TreeSet** keeps that neighbor available after every update.',
  mentalModel:
    'A **TreeMap** that only stores keys. In-order iteration is ascending order. It is a **HashSet** that charges **O(log n)** so the elements stay sorted.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        '**HashSet** versus **TreeSet**.',
        'Adding, and the neighbor methods.',
        'A sliding window that asks “is anyone within t of me?”',
        'When a heap or a hash set is the smaller tool.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — Unique and fast, or unique and sorted',
    },
    {
      type: 'list',
      items: [
        '**HashSet**: unique, about **O(1)**, no order, no “next larger.”',
        '**TreeSet**: unique, **O(log n)**, always sorted, with **floor** and **ceiling**.',
        'Reach for **TreeSet** when the algorithm inserts and deletes, and then asks for a neighbor. If you only deduplicate and scan once at the end, hash and sort once.',
        'If you only ever need the current minimum, **PriorityQueue** is the smaller tool. It will not give you **floor**.',
        'Duplicates are rejected. **add** of an element that is already present returns **false**, same as **HashSet**.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — Comparable, floor, and the ends',
    },
    {
      type: 'list',
      items: [
        'Elements must be **Comparable**, or you pass a **Comparator** to the constructor. Otherwise you get **ClassCastException** when two elements cannot be ordered.',
        'Use **Integer.compare**. Do not subtract. The overflow bug is the same one as on **TreeMap**.',
        '**floor(x)** is the greatest element **≤ x**. **ceiling(x)** is the least element **≥ x**. Missing neighbor returns **null**.',
        '**first** / **last** are the current minimum and maximum. **pollFirst** / **pollLast** remove them.',
        '**headSet**, **tailSet**, and **subSet** are range views, not copies.',
        '**null** elements are not allowed.',
        'Do not change a field that the order depends on while the element sits in the set. The tree would be sorted by the old value.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Inserts, a duplicate, then the neighbors of 2',
      code: `TreeSet<Integer> active = new TreeSet<>();
active.add(3);
active.add(1);
active.add(3); // false, duplicate
System.out.println(active.first()); // 1
Integer floor = active.floor(2);    // 1
Integer ceil = active.ceiling(2);   // 3`,
    },
    {
      type: 'list',
      items: [
        'After **1** and **3** are in the set, **floor(2)** cannot be 2, because 2 was never added. The greatest element still **≤ 2** is **1**.',
        '**ceiling(2)** is **3**, the smallest element still **≥ 2**.',
        'The second **add(3)** returns **false**. A set does not store two 3s. If you need duplicates, this is the wrong structure — use a list, or a **TreeMap** of value → count.',
      ],
    },
    {
      type: 'table',
      headers: ['Operation', 'TreeSet', 'HashSet'],
      rows: [
        ['**add** / **contains** / **remove**', 'O(log n)', 'About O(1), no order'],
        ['**first** / **last**', 'O(log n)', 'Not available'],
        ['**floor** / **ceiling**', 'O(log n)', 'Not available'],
        ['Walk every element', 'O(n), sorted', 'O(n), no promised order'],
      ],
    },
    {
      type: 'heading',
      text: 'Step 3 — A window, and the nearest value',
    },
    {
      type: 'list',
      items: [
        'Contains Duplicate III: among the last **k** numbers, is any within **t** of the new value?',
        'Keep those **k** values in a **TreeSet**. When the window slides, **remove** the value that falls out.',
        'For the new **val**, **floor(val)** is the closest candidate that is not larger, and **ceiling(val)** is the closest that is not smaller.',
        'Either neighbor within **t** is a hit. Each check is **O(log k)**, so the scan is O(n log k) rather than O(nk).',
      ],
    },
    {
      type: 'heading',
      text: 'Step 4 — Pick the smaller structure',
    },
    {
      type: 'list',
      items: [
        'Only “have I seen it?” → **HashSet**.',
        'Only the current min or max, and you never ask for an arbitrary neighbor → **PriorityQueue**.',
        'Sorted unique values, plus **floor** or **ceiling** → **TreeSet**.',
        'The same key can appear more than once and you need the count → **TreeMap<K, Integer>** with **merge**, not a set.',
        'An O(log n) operation inside an O(n²) loop can still time out. The set does not fix a quadratic algorithm.',
      ],
    },
    {
      type: 'quiz',
      title: 'Check your understanding — TreeSet',
      questions: [
        {
          prompt: 'How does **TreeSet** differ from **HashSet**?',
          options: [
            'TreeSet allows duplicates and is O(1)',
            'TreeSet is sorted and O(log n); HashSet is unordered and about O(1)',
            'They are the same class',
            'HashSet is sorted',
          ],
          answer: 1,
          explanation: 'Both reject duplicates. The tree keeps order and neighbor queries. The hash set is faster and has no order.',
        },
        {
          prompt: 'The set contains 1 and 3. What is **floor(2)**?',
          options: ['2', '3', '1', 'null'],
          answer: 2,
          explanation: '**floor(2)** is the greatest element that is still **≤ 2**. 2 is absent, so the answer is **1**. **ceiling(2)** would be **3**.',
        },
        {
          prompt: '**add** of a value that is already in the TreeSet returns what?',
          options: [
            'true, and the set now has two copies',
            'false, and the set is unchanged',
            'null',
            'The size of the set',
          ],
          answer: 1,
          explanation: 'It is still a set. The second copy is rejected. If you need multiples, store a count in a **TreeMap**.',
        },
        {
          prompt: 'Can you insert **null**?',
          options: [
            'Yes, once',
            'No. Null elements are rejected',
            'Yes, and it sorts first',
            'Yes, if you pass a comparator',
          ],
          answer: 1,
          explanation: 'There is nothing to compare **null** with. **TreeSet** does not allow null elements.',
        },
        {
          prompt: 'You only pop the current minimum, and you never call floor. Which structure is enough?',
          options: ['TreeSet', 'PriorityQueue', 'HashMap', 'ArrayDeque'],
          answer: 1,
          explanation: 'A heap gives you the extreme in **O(log n)** and nothing else. **TreeSet** is justified when you need neighbors or full sorted order, not only the min.',
        },
      ],
    },
  ],
  example: [
    {
      type: 'heading',
      text: 'The window holds the recent values',
    },
    {
      type: 'list',
      items: [
        'Add the new value, ask **floor** and **ceiling** whether a close neighbor exists, then remove the value that slides out of the window.',
        'The set’s size stays about **k**, so each of those operations is **O(log k)**.',
      ],
    },
  ],
  complexity: {
    average: 'O(log n) per operation',
    worst: 'O(log n). The tree stays balanced.',
    space: 'O(n)',
  },
  patternRecognition: [
    'Sorted unique elements with inserts and deletes mixed in.',
    'You need the predecessor or successor in a changing set.',
    'A count of duplicates → TreeMap of counts, not TreeSet.',
    'Only the minimum → a heap.',
  ],
  commonMistakes: [
    'Using TreeSet for pure membership when HashSet is enough.',
    'A comparator that overflows, or that disagrees with equals.',
    'Expecting duplicates to be stored.',
    'Mutating an element so that its sort key changes while it is in the set.',
  ],
  tradeoffs: {
    advantages: ['Sorted order', 'floor and ceiling', 'No separate sort after each insert'],
    disadvantages: ['O(log n), not O(1)', 'No nulls', 'Heavier than HashSet'],
    alternatives: ['HashSet, then sort once at the end', 'PriorityQueue when you only need an extreme', 'TreeMap when each key has a count'],
    whenToUse: ['A dynamic sorted set', 'Neighbor queries on the values'],
    whenNotToUse: ['A plain duplicate check', 'Only min extraction'],
  },
  failureModes: [
    'ClassCastException when the elements are not mutually comparable and you passed no Comparator.',
    'Time limit when an O(log n) operation sits inside a loop that is still quadratic.',
  ],
  interview: {
    expectations: ['Name floor or ceiling', 'Contrast TreeSet, HashSet, and a heap'],
    commonQuestions: ['Contains Duplicate III', 'Count of smaller numbers after self'],
    followUps: ['How would two balanced halves give you a median?'],
    misconceptions: ['TreeSet allows duplicates'],
    traps: ['A custom class with no Comparable and no Comparator'],
    strongSignals: ['Uses floor and ceiling for the neighbor inside a window'],
  },
  keyTakeaways: [
    'Sorted unique elements. Every main operation is O(log n).',
    'floor and ceiling find the nearest neighbor in the set.',
    'No nulls. Elements need Comparable or a Comparator.',
    'HashSet when order does not matter.',
    'pollFirst and pollLast take the current extremes off the set.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'TreeSet versus HashSet?',
      answerHint: 'TreeSet is sorted and O(log n). HashSet is unordered and O(1) on average. Both keep unique elements.',
    },
    {
      level: 'intermediate',
      question: 'How do you find the largest element ≤ x?',
      answerHint: 'set.floor(x). It returns null when every element is greater than x.',
    },
    {
      level: 'advanced',
      question: 'Why would someone keep two TreeSets for a running median?',
      answerHint: 'One half holds the smaller values, one holds the larger. Balance the sizes. The median is an endpoint of a half. Each insert is O(log n).',
    },
  ],
  flashcards: [
    { front: 'Second add of the same element', back: 'Returns false. The set does not grow.' },
    { front: 'floor(x)', back: 'Greatest element that is still ≤ x, or null.' },
  ],
  quickRevision: [
    'Red-black tree of unique sorted elements',
    'O(log n) add, contains, remove',
    'floor, ceiling, first, last',
    'No null elements',
    'HashSet when you do not need order',
    'TreeMap if you need a count per key',
  ],
}
