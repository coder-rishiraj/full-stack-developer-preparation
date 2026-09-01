import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: "Difference array applies range updates in O(1) per update by marking start/end deltas; prefix sum reconstructs final array—classic for range add on static base or offline queries.",
  whyExists: "Repeated range updates on array naive O(n) each. Diff array + prefix sum handles many updates then one materialize in O(n+U).",
  mentalModel: "Timeline of +v from L to R: increment diff[L], decrement diff[R+1]; prefix sum spreads the ink.",
  howItWorks: [
    {
      type: "list",
      items: [
        "Build diff[n+1] zeros.",
        "Range [l,r] add v: diff[l]+=v; diff[r+1]-=v.",
        "Prefix sum diff → result array.",
        "Works on top of existing base if add base[i] to result.",
        "2D diff for submatrix updates (interview rare).",
      ],
    },
  ],
  example: [
    {
      type: "paragraph",
      text: "Array [0,0,0,0], add 2 on [1,3]: diff[1]+=2, diff[4]-=2 → prefix [0,2,2,2,0].",
    },
  ],
  templates: [
    {
      language: "java",
      caption: "Range add on diff array",
      code: `void rangeAdd(int[] diff, int l, int r, int v) {
    diff[l] += v;
    if (r + 1 < diff.length) diff[r + 1] -= v;
}
int[] prefix(int[] diff) {
    for (int i = 1; i < diff.length; i++) diff[i] += diff[i - 1];
    return diff;
}`,
    },
  ],
  tradeoffs: {
    advantages: [
      "Fast range updates",
      "Simple offline pattern",
    ],
    disadvantages: [
      "Not for dynamic point queries without rebuild",
      "2D trickier",
    ],
    alternatives: [
      "Segment tree/Fenwick online",
      "Brute force small n",
    ],
    whenToUse: [
      "Many range adds then final array",
      "Corporate flight capacity style",
    ],
    whenNotToUse: [
      "Point queries during updates",
    ],
  },
  failureModes: [
    "Forgot decrement at r+1",
    "Off-by-one inclusive vs exclusive",
    "Prefix before all updates applied",
  ],
  interview: {
    expectations: [
      "O(1) range update",
      "Prefix restore",
    ],
    commonQuestions: [
      "Difference array technique?",
      "Flight booking capacity?",
    ],
    followUps: [
      "2D diff?",
      "Combine with base array?",
    ],
    misconceptions: [
      "Same as Fenwick always",
      "In-place on original without diff",
    ],
    traps: [
      "r+1 out of bounds",
    ],
    strongSignals: [
      "States diff[l] and diff[r+1]",
    ],
  },
  patternRecognition: [
    'Many range increment or decrement updates are applied before a final array is needed.',
    'Each operation changes every element in a contiguous interval by the same delta.',
    'The prompt asks for an efficient batch-update representation rather than immediate point values.',
  ],
  commonMistakes: [
    'Forgetting to subtract the delta at r + 1 for an inclusive range update.',
    'Writing past the end of the difference array when r is the last index.',
    'Returning the difference array without taking its prefix sums.',
    'Using a difference array when online point queries require a Fenwick or segment tree.',
  ],
  keyTakeaways: [
    "diff[l]+=v diff[r+1]-=v",
    "Prefix sum materialize",
    "O(1) per range update",
    "Offline batch updates",
    "Watch inclusive bounds",
    "Flight capacity template",
  ],
  interviewQuestions: [
    {
      level: "basic",
      question: "Why diff[r+1]-=v?",
      answerHint: "Cancels increment after range end at prefix time.",
    },
    {
      level: "intermediate",
      question: "Corporate flight bookings?",
      answerHint: "Diff on days; prefix > capacity => false.",
    },
    {
      level: "advanced",
      question: "Diff vs segment tree?",
      answerHint: "Diff offline batch; segtree online queries/updates.",
    },
  ],
  flashcards: [
    {
      front: "Range update diff",
      back: "diff[l]+=v; diff[r+1]-=v",
    },
    {
      front: "Restore",
      back: "Prefix sum diff array",
    },
  ],
  quickRevision: [
    "O(1) range add",
    "Prefix to rebuild",
    "r+1 decrement",
    "Inclusive [l,r]",
    "Offline updates",
    "Capacity check pattern",
    "Not online point query",
  ],
  complexity: {
    average: "O(1) per update, O(n) build",
    space: "O(n)",
  },
}
