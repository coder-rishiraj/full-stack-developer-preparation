import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Local vs global optimum reasoning asks whether a locally best choice at each step guarantees a globally best outcome. Greedy succeeds when the problem has greedy-choice property and optimal substructure; otherwise local optima trap you (need DP or exhaustive search).',
  whyExists:
    'Interviewers want you to justify greedy before coding. Recognizing counterexamples (coin change, 0/1 knapsack) vs valid greedy (activity selection, Huffman) separates rote memorization from algorithmic reasoning.',
  mentalModel:
    'Hiking greedy: always pick the steepest uphill step locally might miss the true summit behind a hill. Prove there is no taller hidden peak before trusting local steps.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Greedy-choice property: safe to take local best without losing global optimum.',
        'Optimal substructure: optimal solution contains optimal subsolutions.',
        'Exchange argument: swap first differing choice in optimal with greedy without worsening.',
        'Counterexample hunt: try small inputs where greedy fails.',
        'If fail → DP, backtrack, or other.',
      ],
    },
    {
      type: 'table',
      headers: ['Problem', 'Greedy OK?', 'Why / counterexample'],
      rows: [
        ['Activity selection', 'Yes', 'Earliest finish exchange argument'],
        ['Fractional knapsack', 'Yes', 'Take by value/weight ratio'],
        ['0/1 knapsack', 'No', 'Cannot split items'],
        ['Coin change (general)', 'No', '1,3,4 for amount 6'],
        ['Jump Game', 'Yes', 'Max reachable index'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Coins [1,3,4] amount 6: greedy 4+1+1 uses three coins; optimal 3+3 uses two—local largest coin fails globally.',
    },
  ],
  tradeoffs: {
    advantages: ['O(n log n) or O(n) when valid', 'Simple implementation', 'Strong interview signal when proven'],
    disadvantages: ['Silent wrong answers if invalid', 'Proof burden in interview', 'Easy to confuse similar problems'],
    alternatives: ['DP for conflicting local choices', 'Backtrack when exponential OK'],
    whenToUse: ['Proven greedy problems', 'Interval scheduling', 'Reachability max extensions'],
    whenNotToUse: ['Dependency between choices (0/1 knapsack)', 'Custom coin systems'],
  },
  failureModes: [
    'Applying greedy to 0/1 knapsack by ratio.',
    'Coin change greedy on arbitrary denominations.',
    'Assuming local max jump always works without farthest reach proof.',
  ],
  interview: {
    expectations: ['State greedy-choice and optimal substructure', 'Give counterexample when greedy fails', 'Pivot to DP'],
    commonQuestions: ['Coin Change', 'Jump Game', 'Partition Labels'],
    followUps: ['Prove Jump Game greedy?', 'Why not greedy knapsack?'],
    misconceptions: ['Greedy and DP interchangeable', 'Sorting always makes greedy work'],
    traps: ['Fractional vs 0/1 knapsack', 'Minimum coins vs fewest greedy picks'],
    strongSignals: ['Constructs counterexample live', 'Names proof technique'],
  },
  complexity: {
    average: 'Varies by the proven greedy algorithm; commonly O(n) after preprocessing.',
    worst: 'Often O(n log n) when sorting establishes the greedy order.',
    space: 'Usually O(1) auxiliary space, excluding sorting.',
    notes: 'Complexity is meaningful only after validating that the local choice is globally safe.',
  },
  implementation: [
    {
      language: 'java',
      caption: 'Activity selection greedy by earliest finish',
      code: `Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));
int chosen = 0, lastEnd = Integer.MIN_VALUE;
for (int[] interval : intervals) {
    if (interval[0] >= lastEnd) {
        chosen++;
        lastEnd = interval[1];
    }
}`,
    },
  ],
  patternRecognition: [
    'The prompt asks to optimize a sequence of choices and a tempting best-next choice is visible.',
    'A locally optimal rule can be ordered by an endpoint, ratio, deadline, or reach.',
    'You can try to replace the first choice in an optimal answer with the greedy choice.',
    'Small counterexamples may expose dependencies between early and later choices.',
  ],
  commonMistakes: [
    'Claiming greedy works because the code is simple without an exchange or staying-ahead argument.',
    'Using fractional-knapsack ratio greedy for 0/1 knapsack.',
    'Assuming arbitrary coin denominations support largest-coin greedy.',
    'Confusing a heuristic that finds a good answer with a proof of optimality.',
  ],
  keyTakeaways: [
    'Local optimum ≠ global unless proven.',
    'Validate greedy with exchange argument or counterexamples.',
    '0/1 knapsack and general coin change need DP.',
    'Fractional knapsack and activity selection are greedy-safe.',
    'Say "I will verify greedy" before coding.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'When does greedy work?', answerHint: 'Greedy-choice property + optimal substructure; e.g. activity selection.' },
    { level: 'intermediate', question: 'Coin change greedy counterexample?', answerHint: 'Coins [1,3,4], amount 6: greedy uses 3 coins, optimal 2.' },
    { level: 'advanced', question: 'Exchange argument sketch for activity selection?', answerHint: 'If optimal picks later-finishing first interval, swap to earliest finish without reducing count.' },
  ],
  flashcards: [
    { front: '0/1 knapsack greedy by ratio?', back: 'Fails; need DP.' },
    { front: 'Two properties for greedy correctness', back: 'Greedy-choice property and optimal substructure.' },
  ],
  quickRevision: [
    'Prove greedy before coding',
    'Hunt counterexamples',
    'Exchange argument tool',
    '0/1 knapsack → DP',
    'Fractional knapsack → greedy ratio',
    'Activity selection → end sort',
    'Pivot to DP when greedy fails',
  ],
}
