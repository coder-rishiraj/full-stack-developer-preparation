import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Time complexity counts primitive operations (comparisons, assignments, arithmetic) as a function of input size n—worst, average, or best case—abstracting machine constants to judge scalability.',
  whyExists:
    'Correctness is not enough at scale. Stating “O(n log n) sort + O(n) scan” proves your solution meets constraints (n≤10⁵ → ~10⁶ ops ok; n² may TLE). Interviewers expect complexity with every approach.',
  mentalModel:
    'Count the innermost work multiplied by how many times it runs. Drop constants and lower terms: 3n² + 100n → O(n²). Nested loops often multiply; sequential blocks add.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Step 1 — What are we measuring? Time complexity estimates how the number of basic steps grows as the input grows. We care about the shape of growth (linear? quadratic?), not the exact millisecond count on your laptop.',
    },
    {
      type: 'paragraph',
      text: 'Step 2 — Find n. Usually n is array length, number of nodes, or string length. Sometimes there are two sizes (n×m grid). Write the cost in terms of those variables, then simplify with Big-O (next topic) by dropping constants and smaller terms.',
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Identify n (array length, nodes, string length) and auxiliary parameters (k, m).',
        'Count operations in loops: single loop O(n), nested O(n²), halving loop O(log n).',
        'Sort dominates: O(n log n) for Arrays.sort.',
        'HashMap op amortized O(1); TreeMap O(log n).',
        'Recursion: branches^depth without memo; with memo O(states × work per state).',
      ],
    },
    {
      type: 'table',
      headers: ['Pattern', 'Time'],
      rows: [
        ['Single scan', 'O(n)'],
        ['Two nested loops on n', 'O(n²)'],
        ['Binary search on n', 'O(log n)'],
        ['Sort + scan', 'O(n log n)'],
        ['n × map op', 'O(n) avg with HashMap'],
        ['All pairs', 'O(n²)'],
        ['DFS tree V,E', 'O(V + E)'],
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Annotate complexity in solution',
      code: `// O(n log n) — sort dominates
Arrays.sort(a);
// O(n) — one pass with HashSet contains O(1)
Set<Integer> seen = new HashSet<>();
for (int x : a) {
    if (seen.contains(x)) return true;
    seen.add(x);
}
// Total: O(n log n) time, O(n) space`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Constraint → complexity budget',
      text: 'n≤10⁵: O(n log n) or O(n) usually fine. n≤5000: O(n²) may pass. n≤20: O(2^n) backtracking ok.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Two Sum with HashMap: one loop n iterations, O(1) map ops each → O(n) time. Brute force double loop → O(n²). State both; justify map for n=10⁵.',
    },
  ],
  complexity: {
    notes: 'Amortized: occasional expensive resize averaged over many cheap ops—ArrayList append, HashMap resize.',
  },
  patternRecognition: [
    'One pointer scan → O(n).',
    'Sort then two pointers → O(n log n).',
    'Divide half each step → O(log n) levels.',
    'Try all subsets → O(2^n).',
  ],
  commonMistakes: [
    'Ignoring sort cost when calling Collections.sort once.',
    'Assuming HashMap always O(1) worst case—say “average”.',
    'Counting hidden loops in library code as O(1) without thought.',
    'Using n and m interchangeably in 2D grids—clarify O(nm).',
  ],
  tradeoffs: {
    advantages: ['Predict TLE before coding', 'Compare approaches in interview'],
    disadvantages: ['Hides constants—O(n) with huge constant may lose'],
    alternatives: ['Empirical timing on judge (after analysis)'],
    whenToUse: ['Every interview solution', 'Choosing brute vs optimized'],
    whenNotToUse: ['Never skip—always state at least worst case'],
  },
  failureModes: [
    'TLE from O(n²) when n=10⁵.',
    'Wrong analysis missing inner while loop amortization.',
  ],
  interview: {
    expectations: ['State time after coding', 'Relate to constraints', 'Best vs worst if relevant'],
    commonQuestions: ['Analyze your solution', 'Can you do better?'],
    followUps: ['Amortized meaning?', 'Average vs worst for hash?'],
    misconceptions: ['One loop always O(n)—body may hide O(log n) search'],
    traps: ['Forgotten sort in pipeline'],
    strongSignals: ['Maps n bound to acceptable complexity class quickly'],
  },
  keyTakeaways: [
    'Count loops and dominant term.',
    'Sort = O(n log n); hash avg O(1).',
    'n≤10⁵ → need roughly O(n log n) or better.',
    'State average vs worst for hash tables.',
    'Sequential adds; nested multiplies.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Time of single for loop 0..n-1 with O(1) body?',
      answerHint: 'O(n).',
    },
    {
      level: 'intermediate',
      question: 'Two Sum HashMap solution complexity?',
      answerHint: 'O(n) time average, O(n) space for map.',
    },
    {
      level: 'advanced',
      question: 'Sliding window with while shrink—still O(n)?',
      answerHint: 'Yes amortized; each index enters/leaves window at most once.',
    },
  ],
  flashcards: [
    {
      front: 'Arrays.sort complexity',
      back: 'O(n log n) TimSort.',
    },
    {
      front: 'n≤10⁵ rough time budget',
      back: 'Target O(n log n) or O(n); avoid O(n²).',
    },
  ],
  quickRevision: [
    'Drop constants, keep dominant term',
    'Nested loops multiply',
    'Sort O(n log n)',
    'HashMap O(1) average',
    'DFS O(V+E)',
    'Match n bound to class',
  ],
}
