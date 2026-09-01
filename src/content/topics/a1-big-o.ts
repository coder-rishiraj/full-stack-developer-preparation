import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Big-O describes asymptotic upper bound on growth rate as n→∞: O(g(n)) means runtime/space ≤ c·g(n) for large n. Used to compare algorithms independent of hardware constants.',
  whyExists:
    '500 vs 501 loop iterations do not matter at n=10⁶; n vs n log n vs n² does. Big-O gives shared vocabulary for interviews and complexity proofs—dominant term, drop constants, focus on scalability.',
  mentalModel:
    'Tie-breaking hierarchy for common functions: O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n) < O(n!). Upper bound = worst-case ceiling; Ω lower bound; Θ tight when both match.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Drop constants: O(2n) → O(n). Drop lower terms: O(n² + n) → O(n²).',
        'Nested independent loops on n multiply to O(n²).',
        'Sequential blocks: take maximum term.',
        'Halving parameter each iteration → O(log n) iterations.',
        'Master theorem / recursion tree for divide-and-conquer (sketch in interview).',
      ],
    },
    {
      type: 'table',
      headers: ['Notation', 'Meaning'],
      rows: [
        ['O(g)', 'Upper bound (worst ≤ c·g)'],
        ['Ω(g)', 'Lower bound (best ≥ c·g)'],
        ['Θ(g)', 'Tight bound (both O and Ω)'],
        ['o(g)', 'Strictly smaller growth'],
        ['ω(g)', 'Strictly larger growth'],
      ],
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
      caption: 'Common complexity growth order',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Simplify to Big-O',
      code: `// Loop i=0..n-1, j=i..n-1 → n(n+1)/2 iterations → O(n²)
for (int i = 0; i < n; i++)
    for (int j = i; j < n; j++) { /* O(1) */ }

// while (n > 0) n /= 2 → O(log n)

// Arrays.sort + O(n) scan → O(n log n) dominates`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Interview phrasing',
      text: 'Say “O(n) time, O(1) auxiliary space” not “linear” alone. Mention amortized when discussing ArrayList append or HashMap resize.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Binary search on sorted array: each step halves range → at most ⌈log₂ n⌉+1 comparisons → O(log n) time, O(1) space iterative.',
    },
  ],
  complexity: {
    notes: 'Big-O is asymptotic—constants matter for small n but not for interview scaling arguments.',
  },
  patternRecognition: [
    'Single loop → O(n); two on n → O(n²).',
    'Sort appears → likely O(n log n) bottleneck.',
    'Branching factor b, depth d → O(b^d).',
    'Amortized O(1) still stated as O(1) amortized.',
  ],
  commonMistakes: [
    'Saying O(n + n log n) instead of O(n log n).',
    'Confusing O(2^n) with O(n²).',
    'Treating best case as Big-O without label.',
    'Using Big-O for exact operation count (use Θ or exact n).',
  ],
  tradeoffs: {
    advantages: ['Compare algorithms fairly', 'Quick feasibility vs n bounds'],
    disadvantages: ['Hides log factors and constants', 'Misleading for small n'],
    alternatives: ['Empirical benchmarks', 'Exact counts for tiny n brute force'],
    whenToUse: ['Every complexity statement in interviews'],
    whenNotToUse: ['When interviewer asks exact operations—give Θ or count'],
  },
  failureModes: [
    'Choosing O(n²) algorithm under tight n bound.',
    'Incorrect simplification dropping dominant term wrong way.',
  ],
  interview: {
    expectations: ['Correct O for your code', 'Know common hierarchy', 'Amortized when relevant'],
    commonQuestions: ['Big-O of binary search?', 'Simplify n² + 100n + 50'],
    followUps: ['Best vs worst case?', 'Prove O(n) sliding window?'],
    misconceptions: ['Big-O is exact time'],
    traps: ['Hidden log in binary search inside loop'],
    strongSignals: ['Uses Θ when tight; O when upper bound only'],
  },
  keyTakeaways: [
    'Drop constants and lower-order terms.',
    'Multiply nested loops; max sequential blocks.',
    'O(1) < O(log n) < O(n) < O(n log n) < O(n²) < O(2^n).',
    'O = upper bound; Θ = tight when proven both ways.',
    'State amortized explicitly when needed.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Simplify O(3n² + 10n + 5) to Big-O.',
      answerHint: 'O(n²).',
    },
    {
      level: 'intermediate',
      question: 'Difference between O and Θ?',
      answerHint: 'O is upper bound; Θ is tight bound (same order upper and lower).',
    },
    {
      level: 'advanced',
      question: 'Why is building HashMap from n inserts O(n) average but single insert O(1) amortized?',
      answerHint: 'Resize doubles table occasionally; cost spread over inserts; aggregate O(n).',
    },
  ],
  flashcards: [
    {
      front: 'Nested loop both 0..n-1',
      back: 'O(n²) time.',
    },
    {
      front: 'Big-O simplification rule',
      back: 'Keep dominant term; drop constants and lower terms.',
    },
  ],
  quickRevision: [
    'O = asymptotic upper bound',
    'Drop constants & lower terms',
    'Nested multiply, sequential max',
    'log n from halving',
    'Sort → n log n',
    'Hierarchy: 1 log n n n log n n² 2^n',
    'Amortized say explicitly',
  ],
}
