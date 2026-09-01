import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Sorting + greedy pairs a sort key that orders candidates with a local greedy choice proven globally optimal (or good enough). Examples: sort by end for intervals, sort by ratio for fractional knapsack, sort pairs for minimum arrows, sort events for sweep-line greedy.',
  whyExists:
    'Many optimization problems become tractable after sorting exposes structure. The interview skill is identifying the sort key and greedy rule, then arguing correctness—or recognizing when greedy fails (need DP).',
  mentalModel:
    'Line everyone up in the right order, then scan once making the best local pick. If the order is wrong, greedy picks the wrong things.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Identify candidate objects and objective (max count, min cost).',
        'Choose sort key aligning with greedy decision.',
        'Single pass: apply greedy rule (take, skip, merge, count).',
        'Prove or cite exchange argument / staying ahead.',
        'If greedy fails counterexample → switch to DP.',
      ],
    },
    {
      type: 'table',
      headers: ['Problem', 'Sort by', 'Greedy rule'],
      rows: [
        ['Activity selection', 'End time', 'Take if start >= lastEnd'],
        ['Assign cookies', 'Both arrays', 'Smallest cookie satisfying child'],
        ['Boats to save people', 'Weight asc', 'Two-pointer light+heavy'],
        ['Partition labels', 'Last occurrence', 'Extend current segment'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Activity selection after sorting by end: earliest finish first maximizes count of compatible intervals.',
    },
  ],
  complexity: {
    average: 'O(n log n) dominated by sort',
    worst: 'O(n log n)',
    space: 'O(1) extra after sort',
  },
  tradeoffs: {
    advantages: ['Often optimal with simple code', 'Linear scan after sort', 'Easy to explain'],
    disadvantages: ['Wrong sort key silent failure', 'Not universal—need proof', 'Unstable sort issues rare'],
    alternatives: ['DP when local choice insufficient', 'Heap when dynamic ordering needed'],
    whenToUse: ['Interval-like', 'Scheduling', 'Two-pointer after sort'],
    whenNotToUse: ['Counterexamples exist (coin change arbitrary denominations)', 'Weighted dependencies'],
  },
  failureModes: [
    'Correct greedy wrong sort comparator.',
    'Assuming greedy without proof on weighted variant.',
    'Modifying array during sort confusing indices.',
  ],
  interview: {
    expectations: ['State sort key and why', 'O(n log n) complexity', 'Know when greedy fails'],
    commonQuestions: ['Merge Intervals', 'Non-overlapping Intervals', 'Minimum Number of Arrows'],
    followUps: ['Prove greedy?', 'What if weighted?'],
    misconceptions: ['Any sort works', 'Greedy always optimal'],
    traps: ['Coin change general denominations', 'Comparator overflow on subtraction'],
    strongSignals: ['Names proof technique', 'Identifies failure → DP pivot'],
  },
  implementation: [
    {
      language: 'java',
      caption: 'Sort then greedily select compatible intervals',
      code: `Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
int count = 0, lastEnd = Integer.MIN_VALUE;
for (int[] interval : intervals) {
    if (interval[0] >= lastEnd) {
        count++;
        lastEnd = interval[1];
    }
}`,
    },
  ],
  patternRecognition: [
    'Sorting candidates makes the next safe choice comparable to a single running boundary.',
    'After one ordering step, the solution can scan once and take, skip, or merge each item.',
    'The objective is a count, capacity, or coverage metric with an exchange argument.',
    'The candidate order is static rather than changing after every selection.',
  ],
  commonMistakes: [
    'Choosing a sort key by intuition without proving it preserves the optimum.',
    'Using subtraction in a Java comparator and risking integer overflow.',
    'Applying a greedy scan to a weighted version that requires dynamic programming.',
    'Mixing the end-sort rule for selection with the start-sort rule for merging.',
  ],
  keyTakeaways: [
    'Sort key + one-pass greedy is a major pattern.',
    'Intervals: end sort vs start sort serve different goals.',
    'Always analyze O(n log n) from sort.',
    'Verify greedy with counterexample hunt.',
    'Weighted variants usually need DP.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Typical complexity of sort + greedy?', answerHint: 'O(n log n) for sort + O(n) scan.' },
    { level: 'intermediate', question: 'When does coin change break greedy?', answerHint: 'Arbitrary denominations e.g. coins [1,3,4] amount 6: greedy 4+1+1=3 coins, optimal 3+3=2.' },
    { level: 'advanced', question: 'Exchange argument in one sentence?', answerHint: 'Show swapping greedy choice for any optimal choice does not worsen solution.' },
  ],
  flashcards: [
    { front: 'Sort + greedy time', back: 'O(n log n) typically.' },
    { front: 'Classic interval max non-overlap sort', back: 'By end time.' },
  ],
  quickRevision: [
    'Pick sort key carefully',
    'Single pass after sort',
    'O(n log n) total',
    'Prove or cite exchange argument',
    'Weighted → often DP',
    'Comparator use compare not subtract',
    'Merge vs select different sorts',
  ],
}
