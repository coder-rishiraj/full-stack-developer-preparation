import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '**Time complexity** counts how many basic steps a solution does as the input grows. A basic step is a comparison, an assignment, or one arithmetic operation. We write the count as a function of **n**, usually the **worst case**, sometimes the **average**.',
  whyExists:
    'A correct double loop still fails when **n** is **10⁵**. Saying “sort is **O(n log n)**, then one scan is **O(n)**” tells you the sort is the whole cost, and that this fits a typical limit. Interviewers ask for that sentence after every solution.',
  mentalModel:
    'Find the innermost piece of work, then multiply by how many times it runs. One loop over **n** is about **n** steps. A loop inside a loop is about **n × n**. Two blocks one after another cost the larger of the two, once you drop the smaller term.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'What a “step” is, and what **n** is.',
        'Loops that add, and loops that multiply.',
        'What the library already costs: sort, hash, tree, DFS.',
        'A constraint is a budget.',
        'A sliding window that still only touches each index twice.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — Count steps, name n',
    },
    {
      type: 'list',
      items: [
        'We are not timing your laptop. We are asking how the step count **grows** when the input grows. Linear, quadratic, or exponential is the useful answer.',
        '**n** is usually the array length, the string length, or the number of nodes. A grid has two sizes, **n** rows and **m** columns. Write **O(nm)**, not a single **n**, when both matter.',
        '**Worst case** is the input that makes you do the most work. **Average** is the typical input, which is what a hash table’s “**O(1)**” actually means. **Best case** is the lucky input. Say which one you mean.',
        'A constant factor, such as doing 3 operations instead of 1 inside the loop, does not change the shape. **3n** and **n** are the same class. The next topic, Big-O, is the formal way to drop that constant.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — Sequential blocks, nested loops',
    },
    {
      type: 'list',
      items: [
        'A loop **i** from 0 to **n - 1** with a constant body runs **n** times. That is **O(n)**.',
        'A second loop **inside** that loop, also running **n** times, runs the body **n × n** times. That is **O(n²)**. Nested means multiply.',
        'A loop that follows a loop, not inside it, is sequential. **O(n)** then **O(n)** is still **O(n)**. **O(n log n)** then **O(n)** is **O(n log n)**, because the sort is larger. Sequential means take the bigger one.',
        'A loop that halves **n** each time (**n = n / 2**) runs about **log₂ n** times. Binary search is that loop.',
        'The body is not free. If each iteration does a **TreeMap** lookup, the body is **O(log n)**, and **n** iterations are **O(n log n)**. “One loop” is not automatically **O(n)**.',
      ],
    },
    {
      type: 'table',
      headers: ['Pattern', 'Time'],
      rows: [
        ['One scan', '**O(n)**'],
        ['Two nested loops on n', '**O(n²)**'],
        ['Binary search', '**O(log n)**'],
        ['Sort, then a scan', '**O(n log n)**'],
        ['n hash-map operations', '**O(n)** average'],
        ['DFS or BFS', '**O(V + E)**'],
        ['All subsets', '**O(2ⁿ)**'],
      ],
    },
    {
      type: 'heading',
      text: 'Step 3 — Library calls have a cost',
    },
    {
      type: 'list',
      items: [
        '**Arrays.sort** and **Collections.sort** are **TimSort**, **O(n log n)**. Forgetting that one line is the most common wrong analysis.',
        '**HashMap** **get** and **put** are **O(1)** on average, and **O(1)** amortized for the resizes. The worst case, every key in one bucket, is **O(n)**. Say **average** when you claim **O(1)**.',
        '**TreeMap** and **TreeSet** are **O(log n)** per operation, worst case, because the tree stays balanced.',
        'A graph search visits each vertex and each edge a constant number of times, so **O(V + E)**.',
        'Recursion without sharing work costs about **branches ^ depth**. With a memo, it costs **number of states × work per state**.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'The sort is the whole cost',
      code: `// O(n log n) — sort dominates
Arrays.sort(a);
// O(n) — one pass; HashSet contains is O(1) average
Set<Integer> seen = new HashSet<>();
for (int x : a) {
    if (seen.contains(x)) return true;
    seen.add(x);
}
// Total: O(n log n) time, O(n) space`,
    },
    {
      type: 'heading',
      text: 'Step 4 — The constraint is a budget',
    },
    {
      type: 'list',
      items: [
        'A judge that allows about a second can do on the order of **10⁸** simple operations. Use that only as a rough ceiling.',
        '**n ≤ 10⁵** wants **O(n)** or **O(n log n)**. **O(n²)** is about **10¹⁰** operations and will time out.',
        '**n ≤ 5000** can sometimes afford **O(n²)**, about 25 million operations.',
        '**n ≤ 20** can afford **O(2ⁿ)** backtracking. **n = 40** cannot: **2⁴⁰** is about a trillion.',
        'State the class, then point at the constraint. “**O(n)** average, and **n** is **10⁵**, so this fits.”',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Read the bound before you code',
      text: '**n ≤ 10⁵** means reach for a scan, a sort, or a hash table. **n ≤ 20** means subsets are allowed. The bound is part of the problem statement, not a footnote.',
    },
    {
      type: 'heading',
      text: 'Step 5 — A shrinking window is still linear',
    },
    {
      type: 'list',
      items: [
        'A sliding window often has a **for** that moves the right edge, and a **while** that moves the left edge inward.',
        'The **while** looks nested, so it is tempting to say **O(n²)**.',
        'Each index enters the window once and leaves once. Across the whole run, the **while** body executes **O(n)** times, not **n** times per outer step.',
        'That is **amortized** **O(n)**: a single iteration of the outer loop may shrink a lot, but the shrinks cannot add up to more than **n**.',
      ],
    },
    {
      type: 'quiz',
      title: 'Check your understanding — time',
      questions: [
        {
          prompt: 'A loop from 0 to n - 1 does a constant amount of work. What is the time?',
          options: ['O(1)', 'O(log n)', 'O(n)', 'O(n²)'],
          answer: 2,
          explanation: 'The body runs once per index. n constant-time bodies are **O(n)**.',
        },
        {
          prompt: 'Two Sum stores each value in a HashMap and looks up the complement in the same loop. What do you say?',
          options: [
            'O(n²) time, because a map is a loop',
            'O(n) time on average, O(n) space',
            'O(1) time, because get is O(1)',
            'O(n log n), because HashMap sorts',
          ],
          answer: 1,
          explanation: 'One pass, and each **get** or **put** is **O(1)** on average. The map holds up to **n** entries. Brute force, two loops, is the **O(n²)** version.',
        },
        {
          prompt: 'You sort, then scan once, and you report O(n). What did you miss?',
          options: [
            'The scan',
            'Arrays.sort, which is O(n log n) and dominates',
            'The input size',
            'Nothing. A scan after a sort is free.',
          ],
          answer: 1,
          explanation: '**TimSort** is **O(n log n)**. The later **O(n)** scan is smaller. The total is **O(n log n)**.',
        },
        {
          prompt: 'n is at most 10⁵. Which class is the one you should be aiming for?',
          options: [
            'O(n²)',
            'O(2ⁿ)',
            'O(n) or O(n log n)',
            'O(n!)',
          ],
          answer: 2,
          explanation: '**n²** at **10⁵** is about **10¹⁰** operations. A linear or **n log n** solution stays near **10⁶** to **2×10⁶** steps.',
        },
        {
          prompt: 'A window’s right edge moves once per index, and a while loop moves the left edge. Why is this still O(n)?',
          options: [
            'while loops are always O(1)',
            'Each index enters and leaves at most once, so the shrinks add up to O(n)',
            'The while never runs',
            'HashMap makes it linear',
          ],
          answer: 1,
          explanation: 'One outer step can shrink many times, but the left index only moves right, at most **n** times in the whole algorithm. That is amortized linear.',
        },
      ],
    },
  ],
  example: [
    {
      type: 'heading',
      text: 'Two Sum, two ways',
    },
    {
      type: 'list',
      items: [
        'The brute force checks every pair. The outer index runs **n** times and the inner index runs about **n** times, so **O(n²)**. At **n = 10⁵** that is too slow.',
        'The map version does one loop. For each value, **get** the complement and **put** the value. Each of those is **O(1)** on average, so the loop is **O(n)** average time and **O(n)** space.',
        'Say both, then say why the map matches the constraint.',
      ],
    },
  ],
  complexity: {
    notes: 'Amortized means an occasional expensive step, such as an ArrayList or HashMap resize, is averaged over the many cheap steps around it. A single append is O(1) amortized, not O(1) every single time.',
  },
  patternRecognition: [
    'One pointer scan → O(n).',
    'Sort, then two pointers → O(n log n).',
    'The range halves each step → O(log n) levels.',
    'Every subset → O(2ⁿ).',
  ],
  commonMistakes: [
    'Forgetting the sort you called once.',
    'Saying HashMap is always O(1). Say average.',
    'Treating a library call as free when it hides a loop or a tree.',
    'Writing O(n) for a grid that is n by m. It is O(nm).',
  ],
  tradeoffs: {
    advantages: ['You can predict a time limit before you code', 'You can compare two ideas in one sentence'],
    disadvantages: ['A huge constant can make a “faster” class lose on small n'],
    alternatives: ['Timing a solution on the judge, after the analysis, not instead of it'],
    whenToUse: ['After every interview solution, and when you choose brute force versus the optimized idea'],
    whenNotToUse: ['There is no solution you should leave without at least a worst-case class'],
  },
  failureModes: [
    'Time limit exceeded from O(n²) at n = 10⁵.',
    'A nested while that you called O(n²), or a nested while you called O(n) without the enter-once argument.',
  ],
  interview: {
    expectations: ['State time after the code', 'Tie it to the constraint', 'Say best versus worst when they differ'],
    commonQuestions: ['What is the complexity of your solution?', 'Can you do better?'],
    followUps: ['What does amortized mean?', 'Average versus worst for a hash table?'],
    misconceptions: ['One loop is always O(n). The body may hide an O(log n) search.'],
    traps: ['A forgotten sort'],
    strongSignals: ['Reads n ≤ 10⁵ and immediately rules out n²'],
  },
  keyTakeaways: [
    'One loop is O(n). A loop inside a loop multiplies. Blocks in a row take the larger cost.',
    'Sort is O(n log n). A hash operation is O(1) on average.',
    'n ≤ 10⁵ wants O(n) or O(n log n).',
    'A sliding window’s inner while is still O(n) if each index enters and leaves once.',
    'Name the variables. A grid is O(nm).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Time of a single loop from 0 to n - 1 with a constant body?',
      answerHint: 'O(n). The body runs once per index.',
    },
    {
      level: 'intermediate',
      question: 'Complexity of the HashMap Two Sum?',
      answerHint: 'O(n) time on average and O(n) space. Each get and put is O(1) average, and the map stores up to n entries.',
    },
    {
      level: 'advanced',
      question: 'A sliding window shrinks with a while loop. Is it still O(n)?',
      answerHint: 'Yes, amortized. Each index enters the window at most once and leaves at most once, so the inner body runs O(n) times across the whole scan.',
    },
  ],
  flashcards: [
    { front: 'Arrays.sort', back: 'O(n log n) TimSort. It often dominates the rest of the method.' },
    { front: 'n ≤ 10⁵', back: 'Aim for O(n) or O(n log n). O(n²) is too slow.' },
  ],
  quickRevision: [
    'Nested loops multiply',
    'Sequential blocks take the max',
    'Sort is O(n log n)',
    'HashMap is O(1) average',
    'DFS is O(V + E)',
    'Match the class to the constraint',
  ],
}
