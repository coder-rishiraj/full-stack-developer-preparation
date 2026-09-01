import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Binary search on the answer space treats the optimal value (min capacity, max speed, minimum days) as unknown and binary-searches it, checking feasibility with a greedy or linear scan at each candidate.',
  whyExists:
    'Direct optimization formulas are rare. Often “can we achieve X?” is easy to verify and monotonic: if X works, any X′ ≥ X works (maximize) or any X′ ≤ X works (minimize). BS on answer avoids enumerating all X.',
  mentalModel:
    'You are tuning a dial from min to max. Ask “Is this setting good enough?” If yes, try a better (smaller/larger) setting; if no, loosen the dial. The feasibility function is a one-bit cliff: false…false true…true.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Identify the answer variable (integer or discrete) with known lo/hi bounds.',
        'Define feasible(x): can we satisfy constraints with parameter x?',
        'Prove monotonicity: feasible(x) ⇒ feasible(x′) for all x′ on the “good” side.',
        'Binary search lo..hi; on feasible mid, record answer and search better half.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Minimize vs maximize',
      text: 'Minimize: if feasible(mid) then ans=mid, hi=mid−1. Maximize: if feasible(mid) then ans=mid, lo=mid+1. Always separate search loop from check function.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Range[lo..hi answer] --> Mid[candidate x]
  Mid --> Check{feasible x?}
  Check -->|yes minimize| Better[hi = mid-1, ans=mid]
  Check -->|no| Worse[lo = mid+1]
  Better --> Range
  Worse --> Range`,
    caption: 'Parametric binary search (minimize answer)',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Koko Eating Bananas: piles [3,6,7,11], h=8 hours. Answer = min eating speed k. feasible(k) = sum(ceil(pile/k)) ≤ h. BS k in [1, max pile]; k=4 works → try smaller.',
    },
    {
      type: 'table',
      headers: ['k', 'hours needed', 'feasible?'],
      rows: [
        ['6', '1+1+2+2=6', 'yes'],
        ['4', '1+2+2+3=8', 'yes'],
        ['3', '1+2+3+4=10', 'no'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Minimize answer template',
      code: `int lo = MIN, hi = MAX, ans = MAX;
while (lo <= hi) {
    int mid = lo + (hi - lo) / 2;
    if (feasible(mid)) {
        ans = mid;
        hi = mid - 1;
    } else {
        lo = mid + 1;
    }
}
return ans;`,
    },
    {
      language: 'java',
      caption: 'Feasibility check (Koko eating bananas)',
      code: `boolean feasible(int k, int[] piles, int h) {
    long hours = 0;
    for (int p : piles) hours += (p + k - 1L) / k;
    return hours <= h;
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Ship packages within D days (min capacity)',
      code: `public int shipWithinDays(int[] weights, int days) {
    int lo = 0, hi = 0;
    for (int w : weights) { lo = Math.max(lo, w); hi += w; }
    while (lo < hi) {
        int mid = lo + (hi - lo) / 2;
        if (canShip(weights, days, mid)) hi = mid;
        else lo = mid + 1;
    }
    return lo;
}
boolean canShip(int[] w, int days, int cap) {
    int d = 1, load = 0;
    for (int x : w) {
        if (load + x > cap) { d++; load = 0; }
        load += x;
    }
    return d <= days;
}`,
    },
  ],
  complexity: {
    best: 'O(check) if first guess feasible',
    average: 'O(log R × check) where R = answer range',
    worst: 'O(log R × check) — check often O(n) or O(n log n)',
    space: 'O(1) beyond check auxiliary',
  },
  patternRecognition: [
    '“Minimum maximum” or “maximum minimum” phrasing.',
    'Split array into k parts minimizing largest sum.',
    'At most D days / H hours with per-day capacity parameter.',
    'Feasibility is greedy after fixing the answer parameter.',
    'Implicit monotonic: harder parameter → fewer solutions.',
  ],
  commonMistakes: [
    'Wrong monotonic direction (minimize coded as maximize).',
    'Bounds too tight: lo must be at least minimum feasible value.',
    'Using floating BS without defining precision / iteration count.',
    'Feasibility check not greedy-optimal → false negatives.',
  ],
  variations: [
    'Real-valued answer with fixed epsilon iterations',
    'BS on index in sorted space with custom predicate',
    'Aggressive feasibility with prefix sums / deque',
    'Parallel binary search on multiple queries offline',
  ],
  tradeoffs: {
    advantages: [
      'Turns hard optimization into log R feasibility checks',
      'Clean separation: search vs verify',
      'Works when direct formula unknown',
    ],
    disadvantages: [
      'Requires proof of monotonic feasibility',
      'Check function must be correct and efficient',
    ],
    alternatives: ['DP for small k', 'Greedy direct if known (e.g. Huffman)', 'Convex optimization for continuous'],
    whenToUse: ['Monotonic feasible(x)', 'Min-max / max-min split problems', 'Capacity/speed/rate tuning'],
    whenNotToUse: ['Non-monotonic objective', 'Need all optimal structures not just value'],
  },
  failureModes: [
    'Off-by-one on lo/hi when using half-open vs inclusive for minimize.',
    'Integer overflow in feasibility sums (use long).',
  ],
  interview: {
    expectations: [
      'Identify answer variable and bounds',
      'Write feasible() and prove monotonicity',
      'State overall O(log R × n)',
    ],
    commonQuestions: [
      'Koko Eating Bananas',
      'Capacity To Ship Packages Within D Days',
      'Split Array Largest Sum',
      'Minimum Number of Days to Make m Bouquets',
    ],
    followUps: ['Why greedy packing in ship days check?', 'Can check be O(n log n)?'],
    misconceptions: ['Any optimization problem can use BS on answer'],
    traps: ['Wrong lo bound (0 vs max element)', 'Feasibility allows partial invalid packing'],
    strongSignals: ['Articulates false…true monotonic predicate explicitly'],
  },
  keyTakeaways: [
    'Fix answer X; verify feasible(X); monotonic ⇒ BS.',
    'Minimize: feasible → ans=mid, search lower.',
    'Maximize: feasible → ans=mid, search higher.',
    'Total cost = O(log range × cost of check).',
    'Bounds: lo = min possible, hi = loose upper bound.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What makes binary search on answer valid?',
      answerHint: 'feasible(x) monotonic: once true, stays true (maximize) or reverse for minimize.',
    },
    {
      level: 'intermediate',
      question: 'Split array into k subarrays minimizing largest sum—approach?',
      answerHint: 'BS on max sum; greedy count segments needed if no part exceeds mid.',
    },
    {
      level: 'advanced',
      question: 'How do bounds for ship capacity lo/hi initialize?',
      answerHint: 'lo = max single weight; hi = sum all weights; feasible tightens hi.',
    },
  ],
  flashcards: [
    {
      front: 'Minimize answer BS update when feasible(mid)',
      back: 'ans = mid; hi = mid − 1.',
    },
    {
      front: 'BS on answer complexity',
      back: 'O(log R × cost(feasible)).',
    },
  ],
  quickRevision: [
    'Min-max / max-min → BS on answer',
    'Write feasible(x) first',
    'Prove monotonic predicate',
    'Minimize: feasible → hi = mid−1',
    'Maximize: feasible → lo = mid+1',
    'lo/hi from problem bounds',
    'Check often greedy O(n)',
  ],
}
