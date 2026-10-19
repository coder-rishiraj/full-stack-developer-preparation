import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '**Comparable** is the order a class gives itself, through **compareTo**. **Comparator** is an order you attach from the outside, through **compare**. Sorting, **TreeMap**, **TreeSet**, and **PriorityQueue** all ask one of those two for the same answer: which of these two comes first?',
  whyExists:
    'A sort and a tree cannot guess whether you want meetings by start time, by end time, or by distance. The comparison is the rule. A wrong rule sorts the wrong key, and a **TreeSet** that returns 0 for two different objects quietly drops one of them.',
  mentalModel:
    '**compare(a, b) < 0** means **a** comes before **b**. Zero means “tie.” Positive means **a** comes after **b**. A min-heap treats the “before” element as smaller. A **TreeSet** treats a tie as the same element.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'The three answers a comparison can give.',
        '**Comparable**: the class knows its own order.',
        '**Comparator**: you supply a different order at the call site.',
        '**Integer.compare**, never subtraction.',
        'Ties, and why **TreeSet** cares.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — Negative, zero, or positive',
    },
    {
      type: 'list',
      items: [
        'Every ordering API returns an **int**, not a boolean.',
        '**Negative** means the first argument comes first. **Positive** means it comes later. **Zero** means this rule cannot tell them apart.',
        '**Arrays.sort** on **int[]** already knows integer order. **Collections.sort** and **list.sort** need a rule when the elements are objects.',
        '**TreeMap**, **TreeSet**, and **PriorityQueue** use that same rule on every insert. They do not sort once and forget. The rule has to stay consistent.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — Comparable lives on the class',
    },
    {
      type: 'list',
      items: [
        '**class State implements Comparable<State>** and you write **compareTo**.',
        'That is the **natural order**: the one order the type claims as its own. **Integer** and **String** already have one.',
        'A min-heap of **State** can then be **new PriorityQueue<>()** with no extra lambda, because **compareTo** says which state is smaller.',
        'One class gets one **compareTo**. If the same intervals must sometimes sort by start and sometimes by end, do not keep rewriting **compareTo**. Use a **Comparator**.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 3 — Comparator lives outside the class',
    },
    {
      type: 'list',
      items: [
        '**Comparator<T>** is an object whose only job is **compare(a, b)**. The class itself does not change.',
        'Pass it to **list.sort(cmp)**, **new TreeMap<>(cmp)**, **new TreeSet<>(cmp)**, or **new PriorityQueue<>(cmp)**.',
        'One type, many orders. Intervals by start for merging. The same intervals by end for a scheduling greedy.',
        '**Comparator.comparingInt(a -> a[0])** builds a comparator from a key. **thenComparingInt** breaks the tie with a second key. That is lexicographic order: first key, then second key.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Start, then end. Then a descending x. Then a max-heap.',
      code: `// Sort intervals by start, then end
intervals.sort(Comparator
    .comparingInt((int[] a) -> a[0])
    .thenComparingInt(a -> a[1]));

// Sort points by x descending, y ascending
points.sort((p, q) -> {
    if (p[0] != q[0]) return Integer.compare(q[0], p[0]);
    return Integer.compare(p[1], q[1]);
});

// PQ: farthest point first (max-heap on distance)
PriorityQueue<int[]> pq = new PriorityQueue<>((a, b) ->
    Integer.compare(dist(b), dist(a)));`,
    },
    {
      type: 'heading',
      text: 'Step 4 — Never subtract the two ints',
    },
    {
      type: 'list',
      items: [
        '**return a - b** looks like a comparison. It is not safe.',
        '**Integer.MIN_VALUE - 1** does not stay negative. The subtraction overflows, the sign flips, and the sort or the tree is wrong with no exception.',
        '**Integer.compare(a, b)** and **Long.compare(a, b)** do not subtract. Use them for every integer key.',
        'To reverse the order, swap the arguments: **Integer.compare(b, a)** puts the larger value first. That is a max-heap when you pass it to a **PriorityQueue**.',
        '**Comparator.reverseOrder()** is the same flip when the elements already have a natural order.',
      ],
    },
    {
      type: 'table',
      headers: ['Tool', 'When you use it'],
      rows: [
        ['**Comparable** / **compareTo**', 'One canonical order, such as **Integer** or **String**'],
        ['**Comparator**', 'A custom sort, a **TreeMap**, a **TreeSet**, or a heap'],
        ['**Integer.compare**', 'Any **int** key'],
        ['**Long.compare**', 'Any **long** key'],
        ['**thenComparing**', 'A tie on the first key'],
      ],
    },
    {
      type: 'heading',
      text: 'Step 5 — A tie is a duplicate inside a TreeSet',
    },
    {
      type: 'list',
      items: [
        '**Arrays.sort** can keep two equal keys. A stable sort even keeps their original relative order. Java’s **TimSort** is stable.',
        '**TreeSet** and **TreeMap** do not. **compare == 0** means “this is the same key.” The second **add** is ignored.',
        'If two different meetings have the same end time and both must stay in the set, the comparator needs a tie-breaker, such as an index, so compare returns 0 only when they really are the same item.',
        'The sort key also has to match the proof. Merge-intervals sorts by **start**. A greedy that always takes the earliest finishing job sorts by **end**. The right comparator on the wrong key is still a wrong answer.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'compare 0 drops an element',
      text: 'In a **TreeSet**, **compare(a, b) == 0** means duplicate, even if **a != b** and **equals** would say they differ. The tree trusts **compare**, not **equals**. Add a tie-breaker field when both objects must survive.',
    },
    {
      type: 'quiz',
      title: 'Check your understanding — ordering',
      questions: [
        {
          prompt: 'What does a negative **compare(a, b)** mean?',
          options: [
            'a and b are equal',
            'a comes before b',
            'a comes after b',
            'The sort should crash',
          ],
          answer: 1,
          explanation: 'Negative means the first argument is smaller in this order. Zero is a tie. Positive means the first argument comes later.',
        },
        {
          prompt: 'Why not **return a - b** from a comparator of ints?',
          options: [
            'Subtraction is slower than Integer.compare',
            'The difference can overflow and flip the sign',
            'Java forbids subtraction in lambdas',
            'It only works for negative numbers',
          ],
          answer: 1,
          explanation: '**Integer.MIN_VALUE** minus a positive int overflows. **Integer.compare(a, b)** never subtracts.',
        },
        {
          prompt: 'Two different objects compare as 0, and you add both to a TreeSet. How many are stored?',
          options: [
            'Two. TreeSet uses equals.',
            'One. compare 0 means the same element.',
            'Zero. TreeSet rejects ties.',
            'Two, but only if they are Integers.',
          ],
          answer: 1,
          explanation: '**TreeSet** membership is the comparator, not **equals**. A tie-breaker is required when both objects must remain.',
        },
        {
          prompt: 'You want a PriorityQueue that polls the largest distance first. What do you pass?',
          options: [
            'Nothing. The default heap is a max-heap.',
            'A comparator that compares the second distance against the first',
            'Comparable on int[]',
            'TreeMap',
          ],
          answer: 1,
          explanation: 'The default heap is a min-heap. **Integer.compare(dist(b), dist(a))** reverses the order, so the larger distance is “smaller” to the heap and comes out first.',
        },
        {
          prompt: 'Intervals must sort by start, and if starts match, by end. Which call is that?',
          options: [
            'Comparator.comparingInt(a -> a[0]).thenComparingInt(a -> a[1])',
            'Comparator.comparingInt(a -> a[1]) only',
            'return a[0] - b[0]',
            'Arrays.sort with no comparator on int[][]',
          ],
          answer: 0,
          explanation: '**comparingInt** is the first key. **thenComparingInt** is the tie. **int[][]** has no natural order, so a bare **Arrays.sort** does not know to use start then end.',
        },
      ],
    },
  ],
  example: [
    {
      type: 'heading',
      text: 'Merge intervals sorts by start',
    },
    {
      type: 'list',
      items: [
        'Sort so each interval’s **start** is ≤ the next interval’s **start**.',
        'Scan left to right. If the current start is after the previous end, they do not overlap: emit the previous one and move on.',
        'Otherwise extend the previous end to the max of the two ends.',
        'That scan is only correct because the comparator put earlier starts first. Sorting by end would make the same loop wrong.',
      ],
    },
  ],
  complexity: {
    notes: 'TimSort does O(n log n) comparisons. Each comparison should be O(1). If the key itself is an expensive computation, that cost multiplies the n log n.',
  },
  patternRecognition: [
    'The statement names an order: by deadline, by end, by ratio.',
    'A greedy that is “sort, then scan.”',
    'A heap that should pop the largest → reverse the comparator.',
    'Two keys → comparing, then thenComparing.',
  ],
  commonMistakes: [
    'Subtracting ints inside compare.',
    'A comparator that is not consistent, so a tree’s order breaks.',
    'Sorting by the wrong field, which breaks the greedy argument.',
    'No tie-breaker, so a TreeSet drops an element you still needed.',
  ],
  tradeoffs: {
    advantages: ['Many orders without editing the class', 'Comparators chain', 'The same rule works for sort, tree, and heap'],
    disadvantages: ['The contract is easy to get wrong', 'compare 0 means duplicate inside a TreeSet'],
    alternatives: ['Sort an array of indexes by arr[i]', 'Counting sort when the keys are a small range'],
    whenToUse: ['Any sort, heap, or tree whose order is not the default'],
    whenNotToUse: ['A single small integer key, where a counting sort may be the whole algorithm'],
  },
  failureModes: [
    'A greedy fails because the sort key does not match the proof.',
    'A TreeSet’s size is short because compare returned 0 for two unequal objects.',
  ],
  interview: {
    expectations: ['Write a comparator lambda', 'State the negative/zero/positive contract', 'Use Integer.compare'],
    commonQuestions: ['Sort intervals or meetings', 'Custom order in a heap'],
    followUps: ['Is Java’s sort stable?', 'Does compareTo have to match equals?'],
    misconceptions: ['a - b is safe for every int'],
    traps: ['TreeSet treats compare 0 as a duplicate'],
    strongSignals: ['Chains a tie-breaker', 'Never subtracts the two ints'],
  },
  keyTakeaways: [
    'Negative means the first argument comes first. Zero is a tie.',
    'Comparable is the class’s own order. Comparator is an order you pass in.',
    'Integer.compare and Long.compare. Never a - b.',
    'thenComparing is the second key.',
    'In a TreeSet, compare 0 means duplicate.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Comparable versus Comparator?',
      answerHint: 'compareTo is the one natural order inside the class. Comparator is external, so one type can be sorted many ways.',
    },
    {
      level: 'intermediate',
      question: 'Why not return a - b?',
      answerHint: 'The difference can overflow the int range and flip the sign. Integer.compare does not subtract.',
    },
    {
      level: 'advanced',
      question: 'Must compareTo agree with equals?',
      answerHint: 'It should: equal objects ought to compare as 0. A TreeSet does not consult equals. It uses compare, so a 0 result drops the second object even when equals would keep both.',
    },
  ],
  flashcards: [
    { front: 'Safe int comparison', back: 'Integer.compare(a, b). Not a - b.' },
    { front: 'TreeSet and compare 0', back: 'The second element is treated as a duplicate and ignored.' },
  ],
  quickRevision: [
    'compareTo is the natural order',
    'Comparator is a custom order',
    'Integer.compare for ints',
    'thenComparing for a tie',
    'TreeSet: compare 0 means duplicate',
    'Max-heap: reverse the compare',
  ],
}
