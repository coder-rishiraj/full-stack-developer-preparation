import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A monotonic stack maintains indices (or values) in strictly increasing or decreasing order so each new element pops all dominated entries—solving “next greater/smaller element” and histogram problems in O(n).',
  whyExists:
    'Naive next-greater for each index scans rightward O(n²). Monotonic stack amortizes: each index enters and leaves once; when a hotter day arrives, it resolves all cooler pending days on the stack.',
  mentalModel:
    'A line of people by height waiting for a taller person to their right. Shorter people leave the line when someone taller appears; the stack holds still-waiting indices in height order.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Choose increasing stack (next greater) or decreasing (next smaller).',
        'For each index i, while stack not empty and a[i] dominates a[stack.top], pop j and record answer[j].',
        'Push i onto stack.',
        'Remaining stack entries have no next greater (answer 0 or −1).',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Increasing vs decreasing',
      text: 'Next greater to the right → maintain decreasing stack of values (top is smallest pending). When a[i] > top, top’s NGE is i.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  I[i scan] --> While{stack non-empty and a i beats top?}
  While -->|yes| Pop[Pop j, ans j = i]
  While -->|no| Push[Push i]
  Pop --> While`,
    caption: 'Monotonic stack scan',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Next Greater Element for [2,1,2,4,3]: stack tracks indices. At i=3 (4), pop indices 2,1,0 with answers 3,3,1 respectively.',
    },
    {
      type: 'table',
      headers: ['i', 'a[i]', 'stack (indices)', 'pops'],
      rows: [
        ['0', '2', '[0]', '—'],
        ['1', '1', '[0,1]', '—'],
        ['2', '2', '[0,2]', 'pop 1→ans=2'],
        ['3', '4', '[3]', 'pop 2,0→ans 3,1'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Next greater element (indices)',
      code: `int[] ans = new int[n];
Arrays.fill(ans, -1);
Deque<Integer> st = new ArrayDeque<>();
for (int i = 0; i < n; i++) {
    while (!st.isEmpty() && a[i] > a[st.peek()]) {
        ans[st.pop()] = a[i]; // or i for index distance
    }
    st.push(i);
}`,
    },
    {
      language: 'java',
      caption: 'Largest rectangle in histogram',
      code: `int best = 0;
Deque<Integer> st = new ArrayDeque<>();
for (int i = 0; i <= n; i++) {
    int h = (i == n) ? 0 : heights[i];
    while (!st.isEmpty() && h < heights[st.peek()]) {
        int idx = st.pop();
        int width = st.isEmpty() ? i : i - st.peek() - 1;
        best = Math.max(best, heights[idx] * width);
    }
    st.push(i);
}
return best;`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Daily Temperatures (monotonic decreasing stack)',
      code: `public int[] dailyTemperatures(int[] t) {
    int n = t.length;
    int[] ans = new int[n];
    Deque<Integer> st = new ArrayDeque<>();
    for (int i = 0; i < n; i++) {
        while (!st.isEmpty() && t[i] > t[st.peek()]) {
            int j = st.pop();
            ans[j] = i - j;
        }
        st.push(i);
    }
    return ans;
}`,
    },
  ],
  complexity: {
    best: 'O(n) each index pushed/popped once',
    average: 'O(n)',
    worst: 'O(n) time, O(n) stack size',
    space: 'O(n) for stack',
  },
  patternRecognition: [
    'Next greater/smaller element to left or right.',
    'Daily temperatures / stock span / waiting time.',
    'Largest rectangle in histogram / maximal rectangle in matrix.',
    'Remove K digits to form smallest number (monotonic increasing stack).',
    'Trapping rain water alternative with stack.',
  ],
  commonMistakes: [
    'Wrong monotonic direction (increasing vs decreasing confused).',
    'Storing values instead of indices when width/distance needed.',
    'Histogram: forgetting sentinel height 0 at i=n to flush stack.',
    'Recording answer on push instead of pop (depends on problem—be consistent).',
  ],
  variations: [
    'Monotonic queue (deque) for sliding window min/max',
    'Two passes for circular NGE (double array or modulo)',
    'Pair stack entries with auxiliary data (min, count)',
  ],
  tradeoffs: {
    advantages: [
      'O(n) for all-pairs “next greater” style',
      'Unified template across many problems',
      'No nested loops',
    ],
    disadvantages: [
      'Direction error is common',
      'Less intuitive than hash map for one-off queries',
    ],
    alternatives: ['Precompute with nested loops O(n²)', 'Segment tree for dynamic NGE', 'Two pointers for some span problems'],
    whenToUse: ['Next greater/smaller', 'Histogram/rectangle', 'Remove digits greedy'],
    whenNotToUse: ['Single static query', 'Need arbitrary range min with updates'],
  },
  failureModes: [
    'Width calculation in histogram off-by-one without empty stack check.',
    'Circular array without duplicate length trick leaves wrong NGE.',
  ],
  interview: {
    expectations: [
      'Explain amortized O(n)',
      'Pick correct monotonic direction',
      'Use indices for distance/width',
    ],
    commonQuestions: [
      'Daily Temperatures',
      'Next Greater Element I/II',
      'Largest Rectangle in Histogram',
      'Remove K Digits',
    ],
    followUps: ['Max rectangle in binary matrix?', 'Circular NGE?'],
    misconceptions: ['Monotonic stack is different algorithm per problem—it is one template'],
    traps: ['Histogram sentinel', 'Remove K digits: leading zeros after pop'],
    strongSignals: ['Says each index pushed and popped at most once'],
  },
  keyTakeaways: [
    'Maintain monotonic order in stack; pop when current dominates.',
    'O(n) amortized—each index once in/out.',
    'Store indices for width and distance answers.',
    'Histogram: flush with height 0 sentinel at end.',
    'NGE right → decreasing stack of values.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why is monotonic stack O(n)?',
      answerHint: 'Each index pushed once and popped at most once.',
    },
    {
      level: 'intermediate',
      question: 'Largest rectangle in histogram approach?',
      answerHint: 'Increasing stack of indices; pop when h[i] lower, width to smaller neighbors.',
    },
    {
      level: 'advanced',
      question: 'Max rectangle in binary matrix using histogram?',
      answerHint: 'Each row builds histogram heights; run largest rectangle per row O(cols).',
    },
  ],
  flashcards: [
    {
      front: 'Next greater to the right stack order',
      back: 'Decreasing stack of indices (pending smaller on top).',
    },
    {
      front: 'Histogram rectangle width when popping idx',
      back: 'i - st.peek() - 1 (or i if stack empty).',
    },
  ],
  quickRevision: [
    'NGE → monotonic decreasing stack',
    'Pop when current beats stack top',
    'O(n) push/pop once each',
    'Indices for width/distance',
    'Histogram: sentinel 0 at end',
    'Daily temps = NGE distance',
    'Remove K digits = increasing stack pop',
  ],
}
