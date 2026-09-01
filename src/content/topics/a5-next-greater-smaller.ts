import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Next Greater/Smaller Element (NGE/NSE) problems ask, for each index, the nearest element to the left or right that is strictly greater or smaller—solved in O(n) with a monotonic stack instead of O(n²) brute force.',
  whyExists:
    'Span problems, stock prices, temperature forecasts, and histogram rectangles all reduce to "who is the next dominant neighbor?" The monotonic stack amortizes pairwise comparisons across the whole array in one left-to-right (or right-to-left) scan.',
  mentalModel:
    'Walk left to right carrying a waiting line of indices whose "next greater" is not yet known. When you see a taller value, everyone shorter at the back of the line gets this index as their answer and leaves the line.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'NGE to the right: decreasing stack of indices; while a[i] > a[stack.top], pop and set ans[j]=a[i] or i.',
        'NGE to the left: scan leftward or reverse array with same template.',
        'Circular NGE: traverse 2n with i%n or duplicate array.',
        'Next smaller: flip comparison to < and use increasing stack.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Answer on pop',
      text: 'Record answer when popping index j—the current i is j’s next greater. Remaining stack entries have no greater neighbor (answer -1 or 0).',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Scan[i from 0..n-1] --> While{a[i] > stack top?}
  While -->|yes| Pop[ans[pop]=a[i]; pop]
  While -->|no| Push[push i]
  Pop --> While`,
    caption: 'Next greater to the right',
  },
  example: [
    {
      type: 'paragraph',
      text: 'NGE for [2,1,2,4,3]: i=3 val 4 pops indices 2,1,0 → ans[2]=4, ans[1]=2, ans[0]=4. Remaining stack [3] → ans[3]=-1, ans[4]=-1 after scan (4 pops 3 at end if sentinel used).',
    },
    {
      type: 'table',
      headers: ['variant', 'stack order', 'pop when'],
      rows: [
        ['NGE right', 'decreasing vals', 'a[i] > a[top]'],
        ['NSE right', 'increasing vals', 'a[i] < a[top]'],
        ['NGE left', 'reverse scan', 'same logic mirrored'],
        ['circular', '2n loop i%n', 'compare doubled array'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Next greater element (values)',
      code: `int[] ans = new int[n];
Arrays.fill(ans, -1);
Deque<Integer> st = new ArrayDeque<>();
for (int i = 0; i < n; i++) {
    while (!st.isEmpty() && nums[i] > nums[st.peek()]) {
        ans[st.pop()] = nums[i];
    }
    st.push(i);
}`,
    },
    {
      language: 'java',
      caption: 'Next greater element II (circular)',
      code: `int[] ans = new int[n];
Arrays.fill(ans, -1);
Deque<Integer> st = new ArrayDeque<>();
for (int i = 0; i < 2 * n; i++) {
    int idx = i % n;
    while (!st.isEmpty() && nums[idx] > nums[st.peek()]) {
        ans[st.pop()] = nums[idx];
    }
    if (i < n) st.push(idx);
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Daily Temperatures (NGE distance)',
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
    average: 'O(n) single pass',
    worst: 'O(n) time, O(n) stack for strictly decreasing input',
    space: 'O(n) stack and answer array',
  },
  patternRecognition: [
    'Daily temperatures / days until warmer.',
    'Stock span / consecutive smaller counts.',
    'Next greater element I/II/III.',
    'Largest rectangle in histogram (NSE variant).',
    'Remove K digits (monotonic increasing stack).',
  ],
  commonMistakes: [
    'Increasing vs decreasing stack direction inverted.',
    'Circular NGE: pushing indices twice instead of limiting push to i < n.',
    'Recording answer on push instead of pop (works only if template adjusted consistently).',
    'Strict vs non-strict inequality changes tie behavior.',
  ],
  tradeoffs: {
    advantages: [
      'O(n) for all-pairs nearest dominant neighbor',
      'One unified template across many problems',
      'Indices enable distance and width computation',
    ],
    disadvantages: [
      'Direction errors are very common',
      'Circular and 2D variants need extra care',
    ],
    alternatives: ['Brute O(n²)', 'Segment tree for dynamic queries', 'Monotonic queue for sliding window NGE'],
    whenToUse: ['Static array NGE/NSE', 'Span/distance to next warmer', 'Histogram as NSE width'],
    whenNotToUse: ['Single query on static array → precompute once anyway', 'Sliding window → monotonic queue'],
  },
  failureModes: [
    'Equal elements: strict > vs >= changes which index wins.',
    'Circular array forgetting modulo on index access.',
  ],
  interview: {
    expectations: [
      'Amortized O(n) proof',
      'Decreasing stack for NGE right',
      'Circular trick: 2n loop, push only first n',
    ],
    commonQuestions: [
      'Next Greater Element I',
      'Daily Temperatures',
      'Next Greater Element II',
      '503. Next Greater Element II',
    ],
    followUps: ['NGE with stack of values from nums2?', 'NSE for histogram width?'],
    misconceptions: ['Must scan separately for each index'],
    traps: ['Next Greater Element I: hash map nums2 value → index for O(n) lookup after stack on nums1'],
    strongSignals: ['Says answer assigned when popping, not when pushing'],
  },
  keyTakeaways: [
    'NGE right → decreasing stack of indices.',
    'Pop when current beats top; assign ans on pop.',
    'O(n)—each index once in/out of stack.',
    'Circular: 2n iterations, push indices only once.',
    'NSE: flip comparison to smaller-than.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Brute vs monotonic stack for NGE?',
      answerHint: 'Brute O(n²) scan right; stack O(n) amortized single pass.',
    },
    {
      level: 'intermediate',
      question: 'Daily temperatures relationship to NGE?',
      answerHint: 'Same stack; answer is index distance i-j instead of value.',
    },
    {
      level: 'advanced',
      question: 'Circular NGE without doubling array memory?',
      answerHint: 'Loop i from 0 to 2n-1, idx=i%n, only push when i<n.',
    },
  ],
  flashcards: [
    {
      front: 'NGE to the right stack type',
      back: 'Decreasing stack of indices; pop when nums[i] > nums[top].',
    },
    {
      front: 'When is NGE answer recorded?',
      back: 'On pop of index j—current i is j’s next greater.',
    },
  ],
  quickRevision: [
    'NGE right = decreasing index stack',
    'Answer on pop, not push',
    'O(n) amortized single pass',
    'Circular: 2n loop, push if i<n',
    'NSE: flip to increasing stack',
    'Daily temps = distance not value',
    'See a5-monotonic-stack for histogram',
  ],
}
