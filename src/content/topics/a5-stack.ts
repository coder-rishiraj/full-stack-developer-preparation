import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A stack is a LIFO (last-in, first-out) structure supporting push, pop, and peek in O(1) amortized time—ideal for matching nested structure, reversing order, or deferring work until a closing event.',
  whyExists:
    'Many algorithms need “most recent unmatched opener” or “undo last decision.” Recursion uses the call stack implicitly; an explicit stack simulates DFS, parses expressions, and tracks pending elements in linear scans.',
  mentalModel:
    'A stack of plates: you add and remove only from the top. The last plate placed is the first removed—natural for parentheses, DFS depth, and “wait until I see a closing bracket.”',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Scan input left-to-right (or traverse graph/ tree).',
        'Push on “open” events or when deferring index/value.',
        'Pop when a match/closing condition occurs; stack top is the partner.',
        'Empty stack at end often means validity; non-empty means leftover openers.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Stack of indices',
      text: 'Store indices instead of values to compute spans, temperatures, or distances—values live in the original array.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Scan[Scan input] --> Push[Push opener / defer]
  Push --> Top[Peek stack top]
  Top --> Match{Matches current?}
  Match -->|yes| Pop[Pop and process]
  Match -->|no| Push
  Pop --> Scan`,
    caption: 'Event-driven stack processing',
  },
  example: [
    {
      type: 'paragraph',
      text: 'Valid parentheses "()[]{}" : see ( push; see ) pop ( match; see [ push; see ] pop [; stack empty → valid.',
    },
    {
      type: 'table',
      headers: ['char', 'stack after', 'action'],
      rows: [
        ['(', '[(]', 'push'],
        [')', '[]', 'pop match'],
        ['[', '[[', 'push'],
        [']', '[]', 'pop match'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Parentheses validation',
      code: `Deque<Character> st = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if (c == '(' || c == '[' || c == '{') st.push(c);
    else {
        if (st.isEmpty()) return false;
        char open = st.pop();
        if (!matches(open, c)) return false;
    }
}
return st.isEmpty();`,
    },
    {
      language: 'java',
      caption: 'Evaluate RPN',
      code: `Deque<Integer> st = new ArrayDeque<>();
for (String tok : tokens) {
    if (isOperator(tok)) {
        int b = st.pop(), a = st.pop();
        st.push(apply(tok, a, b));
    } else st.push(Integer.parseInt(tok));
}
return st.pop();`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Daily Temperatures (next warmer — stack of indices)',
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
    best: 'O(n) each element pushed/popped once',
    average: 'O(n) for single-pass stack algorithms',
    worst: 'O(n) time; O(n) stack depth for nested input',
    space: 'O(n) explicit stack; recursion adds O(h) call stack',
  },
  patternRecognition: [
    'Matching brackets, tags, or nested structures.',
    'Reverse processing order (RPN, undo operations).',
    'Next greater/smaller element to the right (monotonic stack variant).',
    'DFS iterative with explicit stack instead of recursion.',
    'String decoding / flatten nested lists.',
  ],
  commonMistakes: [
    'Using Stack (legacy synchronized) instead of ArrayDeque in Java.',
    'Popping without checking isEmpty → EmptyStackException.',
    'Wrong order for binary ops in RPN (pop b then a).',
    'Forgetting stack non-empty at end for validation problems.',
  ],
  variations: [
    'Two stacks for queue simulation',
    'Min stack tracking secondary min stack',
    'Stack + hash map for bracket index mapping',
    'Call stack = implicit stack in recursion',
  ],
  tradeoffs: {
    advantages: [
      'O(1) push/pop',
      'Natural for nesting and LIFO semantics',
      'Iterative DFS without recursion limit',
    ],
    disadvantages: [
      'Only sequential access to top',
      'O(n) extra space for deep nesting',
    ],
    alternatives: ['Recursion (implicit stack)', 'Deque for both-end ops', 'Monotonic stack for range queries'],
    whenToUse: ['LIFO matching', 'Nested structure', 'Defer until closing token', 'Iterative DFS'],
    whenNotToUse: ['FIFO order → queue', 'Random access → array/hash'],
  },
  failureModes: [
    'Stack overflow on deep recursion without iterative conversion.',
    'Integer stack storing indices conflated with values.',
  ],
  interview: {
    expectations: [
      'Choose ArrayDeque',
      'State O(n) amortized for single pass',
      'Handle empty stack edge cases',
    ],
    commonQuestions: [
      'Valid Parentheses',
      'Min Stack',
      'Evaluate Reverse Polish Notation',
      'Decode String',
    ],
    followUps: ['Implement min stack O(1)?', 'Daily temperatures connection?'],
    misconceptions: ['Stack and queue interchangeable'],
    traps: ['Decode string: order of push/pop for nested repeats'],
    strongSignals: ['Stores indices when distance/span needed'],
  },
  keyTakeaways: [
    'LIFO: last pushed processed first on pop.',
    'ArrayDeque for stack in Java interviews.',
    'Each element pushed/popped once → O(n).',
    'Indices on stack preserve original array access.',
    'Explicit stack = iterative DFS.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Stack vs queue use case?',
      answerHint: 'Stack LIFO for nesting/undo; queue FIFO for BFS/order.',
    },
    {
      level: 'intermediate',
      question: 'Min stack with O(1) getMin?',
      answerHint: 'Secondary stack of mins or store pair (val, currentMin).',
    },
    {
      level: 'advanced',
      question: 'How does stack help daily temperatures?',
      answerHint: 'Decreasing index stack; pop while current warmer, set distance.',
    },
  ],
  flashcards: [
    {
      front: 'Java interview stack type',
      back: 'ArrayDeque push/pop — avoid legacy Stack class.',
    },
    {
      front: 'Single-pass stack time',
      back: 'O(n) — each index pushed and popped at most once.',
    },
  ],
  quickRevision: [
    'LIFO → stack',
    'ArrayDeque in Java',
    'Push open/defer; pop on match',
    'Stack of indices for spans',
    'O(n) single pass typical',
    'Iterative DFS uses stack',
    'Check empty at end for validity',
  ],
}
