import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Explaining brute-force first means describing the naive exhaustive approach and its complexity before optimizing. Shows you understand the problem space and gives a correct fallback if time runs out.',
  whyExists:
    'Jumping to optimal without baseline risks wrong optimizations and silent confusion. Interview rubrics reward progressive refinement: brute → bottleneck → better algorithm.',
  mentalModel:
    'Sketch the slow obvious solution on paper, measure why it is slow, then remove redundant work—that is how real optimizations are discovered.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Describe naive: try all pairs, all subsets, all permutations, etc.',
        'State time/space of brute (e.g. O(n²), O(2^n)).',
        'Identify repeated work or unnecessary enumeration.',
        'Propose optimization targeting that bottleneck.',
        'Implement optimal if time; else code brute partial credit.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Two Sum brute: check all pairs O(n²). Bottleneck: re-scanning for complement. Optimization: HashMap of seen values → O(n). Say this sequence aloud before coding the map.',
    },
  ],
  tradeoffs: {
    advantages: ['Correctness anchor', 'Natural path to DP/hash/greedy', 'Partial credit if stuck'],
    disadvantages: ['Uses precious minutes', 'Can feel slow on easy problems'],
    alternatives: ['Skip verbal brute on trivial easy if interviewer agrees', 'Write one-line brute complexity only'],
    whenToUse: ['Medium/hard problems', 'When pattern not immediately obvious'],
    whenNotToUse: ['Trivial warm-up unless asked—still mention O(n) scan briefly'],
  },
  failureModes: [
    'Only describe optimal without justification.',
    'Brute force wrong on constraints invalidates optimization path.',
    'Never transition from brute to improved.',
  ],
  interview: {
    expectations: ['Name brute complexity', 'Explain optimization delta', 'Progressive improvement story'],
    commonQuestions: ['Two Sum progression', 'Subsets brute to backtrack'],
    followUps: ['When skip brute?', 'If optimal known from pattern?'],
    misconceptions: ['Brute first wastes time always', 'Must implement full brute code'],
    traps: ['Brute TLE on hidden tests if you stop there', 'Wrong brute complexity stated'],
    strongSignals: ['Links bottleneck to data structure choice', 'Implements optimal after clear story'],
  },
  keyTakeaways: [
    'Start with naive approach and Big-O.',
    'Point at redundancy brute repeats.',
    'Optimization follows from that diagnosis.',
    'Verbal brute OK; full code optional unless hard.',
    'Story: naive → slow because X → fix with Y.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why mention brute force in interview?', answerHint: 'Shows understanding; baseline correctness; path to optimization.' },
    { level: 'intermediate', question: 'Two Sum brute to optimal story?', answerHint: 'Pairs O(n²); complement lookup repeated → HashMap O(n).' },
    { level: 'advanced', question: 'Brute for DP problems?', answerHint: 'Recursive try all subproblems exponential; memo/tabulation removes overlap.' },
  ],
  flashcards: [
    { front: 'Brute-first interview pattern', back: 'Naive → complexity → bottleneck → optimize.' },
    { front: 'Must you code full brute?', back: 'No; verbal often enough before optimal implementation.' },
  ],
  quickRevision: [
    'State naive approach',
    'Give brute Big-O',
    'Find repeated work',
    'Propose targeted fix',
    'Then implement optimal',
    'Partial credit path',
    'Say aloud before typing',
  ],
}
