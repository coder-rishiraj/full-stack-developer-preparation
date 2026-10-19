import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '**Big-O** is a way to say how fast a cost grows as **n** gets large. **O(g(n))** means the cost stays within some constant multiple of **g(n)** for every big enough **n**. It is an **upper bound**: “no worse than this shape.”',
  whyExists:
    'The difference between 500 and 501 loop steps does not matter at **n = 10⁶**. The difference between **n**, **n log n**, and **n²** does. Big-O is the shared sentence for that comparison, with the constants and the smaller terms removed.',
  mentalModel:
    'Keep the term that grows fastest and throw away coefficients. **3n² + 100n** is **O(n²)**. The usual order, slowest growth first, is **O(1)**, **O(log n)**, **O(n)**, **O(n log n)**, **O(n²)**, **O(2ⁿ)**, **O(n!)** .',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Upper bound, in one sentence.',
        'How to simplify an expression.',
        'Loops, halves, and sorts.',
        '**O**, **Ω**, and **Θ**.',
        '**Amortized**, said on purpose.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 1 — “No worse than”',
    },
    {
      type: 'list',
      items: [
        '**O(n²)** does not mean the code always does exactly **n²** steps. It means, past some input size, the steps are at most **c × n²** for a fixed **c**.',
        'That is why a linear scan is also **O(n²)**: a line stays under a parabola. In an interview you still give the tight class, **O(n)**, unless you are carefully saying “no worse than.”',
        'The bound is about large **n**. A fancy **O(n log n)** sort can lose to a simple **O(n²)** sort on 20 elements, because the constant and the setup dominate. Scaling arguments start when **n** is big.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 2 — Drop constants and smaller terms',
    },
    {
      type: 'list',
      items: [
        '**O(2n)** is **O(n)**. The 2 is a constant factor. Hardware, a tight loop, and a slow loop differ by constants, and Big-O ignores them.',
        '**O(n² + n)** is **O(n²)**. For large **n**, **n²** swamps **n**. **3n² + 10n + 5** simplifies to **O(n²)** the same way.',
        '**O(n + n log n)** is **O(n log n)**. Do not leave the sum in the answer. The sort-sized term is the one that remains.',
        'Do not drop the wrong term. **n² + n** keeps **n²**. Dropping **n²** and keeping **n** is the bug.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 3 — Where the shapes come from',
    },
    {
      type: 'list',
      items: [
        'One loop from 0 to **n - 1** with a constant body is **O(n)**.',
        'A loop inside a loop, both over **n**, is **O(n²)**. Independent nested loops multiply.',
        'Two blocks one after another: take the larger. A sort and then a scan is **O(n log n)**, not **O(n log n + n)** left unsimplified.',
        '**while (n > 0) n = n / 2** runs once per halving. That is **O(log n)** iterations. Binary search is this pattern.',
        'The loop **j** from **i** to **n - 1**, inside **i** from 0 to **n - 1**, runs **n(n+1)/2** times. The triangle is still **O(n²)**. Half of **n²** is a constant factor.',
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'A triangle, a halving loop, and a sort',
      code: `// i = 0..n-1 and j = i..n-1 → n(n+1)/2 bodies → O(n²)
for (int i = 0; i < n; i++)
    for (int j = i; j < n; j++) { /* O(1) */ }

// while (n > 0) n /= 2 → O(log n)

// Arrays.sort, then an O(n) scan → O(n log n)`,
    },
    {
      type: 'mermaid',
      diagram: `flowchart LR
  O1[O 1] --> Ol[O log n]
  Ol --> On[O n]
  On --> Onl[O n log n]
  Onl --> On2[O n²]
  On2 --> O2n[O 2^n]
  O2n --> Onf[O n!]`,
      caption: 'Each shape grows strictly faster than the one on its left',
    },
    {
      type: 'list',
      items: [
        '**O(2ⁿ)** is not a steep quadratic. Doubling **n** squares a quadratic. Adding one to **n** doubles an exponential. Subsets are the exponential. Nested loops are the quadratic.',
        'A recursion that branches **b** ways and goes **d** levels deep, with no shared subproblems, is **O(bᵈ)**.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 4 — O, Omega, and Theta',
    },
    {
      type: 'table',
      headers: ['Symbol', 'What it claims'],
      rows: [
        ['**O(g)**', 'Upper bound. The cost is at most a constant times **g**.'],
        ['**Ω(g)**', 'Lower bound. The cost is at least a constant times **g**.'],
        ['**Θ(g)**', 'Tight. It is both **O(g)** and **Ω(g)**.'],
        ['**o(g)**', 'Strictly slower growth than **g**.'],
        ['**ω(g)**', 'Strictly faster growth than **g**.'],
      ],
    },
    {
      type: 'list',
      items: [
        'A single loop is **Θ(n)** when it always runs **n** times: the upper and lower bounds match.',
        'People say **O** even when they mean the tight bound. That is normal in interviews. Use **Θ** when someone asks for the exact class, or when the best and worst cases differ and you want to be precise.',
        'Best case is not “the Big-O” unless you label it. Quicksort is **O(n log n)** on average and **O(n²)** in the worst case. Those are different sentences.',
      ],
    },
    {
      type: 'heading',
      text: 'Step 5 — Amortized is a different word',
    },
    {
      type: 'list',
      items: [
        '**Amortized** **O(1)** means the expensive step happens rarely enough that, averaged over a long sequence of operations, each one is constant.',
        '**ArrayList.add** sometimes allocates a bigger array and copies everything. That copy is **O(n)**. Doubling makes those copies add up to **O(n)** across **n** adds, so each add is **O(1)** amortized.',
        'One **HashMap** insert is **O(1)** amortized, and also **O(1)** average. Loading **n** keys is therefore **O(n)** average, not **O(n²)**, even though a resize copies the table.',
        'Say the word **amortized** when you rely on that averaging. A listener who hears plain **O(1)** may think every single call is constant, including the resize.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'How to phrase it',
      text: 'Say **O(n)** time and **O(1)** auxiliary space, not only “linear.” If the constant-time claim depends on resizing, say **O(1)** amortized.',
    },
    {
      type: 'quiz',
      title: 'Check your understanding — Big-O',
      questions: [
        {
          prompt: 'Simplify **3n² + 10n + 5**.',
          options: ['O(n)', 'O(3n²)', 'O(n²)', 'O(n³)'],
          answer: 2,
          explanation: 'The **n²** term dominates. The coefficient 3 and the lower terms **10n + 5** drop. Writing **O(3n²)** still has a constant inside the **O**, which we also drop.',
        },
        {
          prompt: 'How do **O** and **Θ** differ?',
          options: [
            'They are synonyms',
            'O is an upper bound. Θ means the upper and lower bounds are the same shape.',
            'Θ is only for space',
            'O is the exact operation count',
          ],
          answer: 1,
          explanation: '**O(n²)** is also true of a linear algorithm, because an upper bound can be loose. **Θ(n)** says it really grows like **n**, from below and from above.',
        },
        {
          prompt: 'Both loops run from 0 to n - 1, and one is inside the other. The body is O(1). The time is?',
          options: ['O(n)', 'O(n log n)', 'O(n²)', 'O(2ⁿ)'],
          answer: 2,
          explanation: 'Nested independent loops multiply. **n** times **n** constant bodies is **O(n²)**. **O(2ⁿ)** would be subsets or a branching recursion, not two loops.',
        },
        {
          prompt: 'A method sorts, then scans once. Which simplification is the one you report?',
          options: [
            'O(n + n log n), left as a sum',
            'O(n log n)',
            'O(n)',
            'O(n²)',
          ],
          answer: 1,
          explanation: 'Sequential costs take the maximum. **n log n** dominates **n**, so the sum simplifies to **O(n log n)**.',
        },
        {
          prompt: 'Why is inserting n keys into a HashMap O(n) on average, if a resize copies the table?',
          options: [
            'Resize never copies',
            'Doubling spreads the copy cost across the inserts, so n inserts stay linear on average',
            'Each insert is O(n), so n inserts are O(n)',
            'HashMap sorts, which is n log n, and we round down',
          ],
          answer: 1,
          explanation: 'A single insert is **O(1)** amortized: the occasional **O(n)** copy is charged across the many inserts that caused the doubling. **n** such inserts are **O(n)** average.',
        },
      ],
    },
  ],
  example: [
    {
      type: 'heading',
      text: 'Binary search',
    },
    {
      type: 'list',
      items: [
        'The range starts at length **n**. Each comparison keeps the left half or the right half, so the length becomes **n/2**, then **n/4**, and so on.',
        'You can halve **n** about **log₂ n** times before the range is empty. That is **O(log n)** comparisons, and **Θ(log n)** in the worst case, when the target is absent or at the last cell you check.',
        'The iterative version uses a few indexes. Auxiliary space is **O(1)**. The recursive version uses **O(log n)** stack frames.',
      ],
    },
  ],
  complexity: {
    notes: 'Big-O is about large n. Constants decide small inputs and constant-factor fights, which is why a measured benchmark can disagree with a Big-O ranking on tiny n.',
  },
  patternRecognition: [
    'One loop → O(n). Two loops on n → O(n²).',
    'A sort in the pipeline → the bottleneck is usually O(n log n).',
    'Branching factor b and depth d, with no memo → O(bᵈ).',
    'A doubling resize → say O(1) amortized, not a bare O(1).',
  ],
  commonMistakes: [
    'Leaving O(n + n log n) unsimplified.',
    'Calling an exponential O(n²), or a quadratic O(2ⁿ).',
    'Reporting the best case as the Big-O without labeling it.',
    'Using Big-O when the interviewer asked for the exact number of operations.',
  ],
  tradeoffs: {
    advantages: ['Algorithms become comparable without a stopwatch', 'A constraint like n ≤ 10⁵ turns into a yes or no'],
    disadvantages: ['Log factors and constants disappear, so small n can surprise you'],
    alternatives: ['A benchmark, when the constant actually matters', 'An exact count, when n is tiny and the interviewer asks for it'],
    whenToUse: ['Every time and space claim you make out loud'],
    whenNotToUse: ['When the question is “how many comparisons exactly?” Give the count, or Θ, and say which.'],
  },
  failureModes: [
    'Shipping an O(n²) solution under an n that only allows n log n.',
    'Dropping the dominant term and keeping the smaller one.',
  ],
  interview: {
    expectations: ['The right O for the code you wrote', 'The growth order of the common classes', 'The word amortized when a resize is involved'],
    commonQuestions: ['Big-O of binary search?', 'Simplify n² + 100n + 50'],
    followUps: ['Best case versus worst case?', 'Why is the sliding window O(n)?'],
    misconceptions: ['Big-O is a stopwatch reading. It is a growth class.'],
    traps: ['A binary search hidden inside a loop, which adds a log factor'],
    strongSignals: ['Uses Θ when the bound is tight, and O when it is only an upper bound'],
  },
  keyTakeaways: [
    'O is an asymptotic upper bound. Drop constants and lower-order terms.',
    'Nested loops multiply. Sequential blocks keep the larger term.',
    'O(1), then log n, n, n log n, n², 2ⁿ, n!.',
    'Θ is the tight class, when the lower bound matches the upper bound.',
    'Say amortized when a rare resize is part of the constant-time claim.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Simplify 3n² + 10n + 5.',
      answerHint: 'O(n²). The square dominates, and the coefficient 3 is a constant.',
    },
    {
      level: 'intermediate',
      question: 'What is the difference between O and Θ?',
      answerHint: 'O is an upper bound, which can be loose. Θ means the same shape is both an upper bound and a lower bound.',
    },
    {
      level: 'advanced',
      question: 'Why are n HashMap inserts O(n) on average if a resize copies the table?',
      answerHint: 'The table doubles, so the copy is rare. Spread across the inserts, each insert is O(1) amortized, and n of them are O(n) on average.',
    },
  ],
  flashcards: [
    { front: 'Two nested loops, each 0..n-1', back: 'O(n²). Nested loops multiply.' },
    { front: 'What you keep', back: 'The fastest-growing term. Constants and smaller terms go.' },
  ],
  quickRevision: [
    'O means an asymptotic upper bound',
    'Drop constants and lower terms',
    'Nested multiplies, sequential takes the max',
    'Halving is log n',
    'Sort is n log n',
    '1, log n, n, n log n, n², 2ⁿ',
    'Say amortized out loud',
  ],
}
