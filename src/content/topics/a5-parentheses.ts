import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Parentheses problems use a stack to match opening and closing brackets in LIFO order—validating balanced strings, computing longest valid substrings, and generating all valid combinations via backtracking or DP.',
  whyExists:
    'Nested structure is inherently LIFO: the most recent unmatched opener must close first. Stacks simulate this in O(n) without recursion; backtracking explores the space of valid insertions for generation problems.',
  mentalModel:
    'Open brackets go on a stack like pushed plates; a closing bracket must match the top plate’s type. If the stack is empty or types mismatch, the string is invalid or you need to insert/fix.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Validation: push openers; on closer, pop and verify pair; empty stack at end required.',
        'Longest valid substring: stack stores indices; pop on match updates length from new top.',
        'Minimum remove: two passes or stack counting excess opens/closes.',
        'Generate n pairs: backtrack with open < n and close < open constraints.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Stack of indices',
      text: 'For longest valid parentheses, push -1 sentinel then indices. On ")" match, pop and length = i - stack.top after pop.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Open[( [ {] --> Push[Push to stack]
  Close[) ] }] --> Pop{Stack match?}
  Pop -->|yes| Continue
  Pop -->|no| Invalid`,
    caption: 'Bracket matching flow',
  },
  example: [
    {
      type: 'paragraph',
      text: '")()()" longest valid: stack [-1,0]; i=1 ")" pop 0, len=1-(-1)=2? Actually classic: push -1; at i=3 match gives segments. Valid "()[]{}" pushes/pops cleanly; stack empty → true.',
    },
    {
      type: 'table',
      headers: ['problem', 'stack holds', 'key trick'],
      rows: [
        ['valid?', 'open chars', 'empty at end'],
        ['longest valid', 'indices + sentinel -1', 'len on pop'],
        ['min remove', 'indices or counts', 'two-pass left-right'],
        ['generate n', 'backtrack', 'open<n, close<open'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Valid parentheses',
      code: `Deque<Character> st = new ArrayDeque<>();
for (char c : s.toCharArray()) {
    if (c == '(' || c == '[' || c == '{') st.push(c);
    else {
        if (st.isEmpty()) return false;
        char o = st.pop();
        if (!matches(o, c)) return false;
    }
}
return st.isEmpty();`,
    },
    {
      language: 'java',
      caption: 'Longest valid parentheses',
      code: `Deque<Integer> st = new ArrayDeque<>();
st.push(-1);
int best = 0;
for (int i = 0; i < s.length(); i++) {
    if (s.charAt(i) == '(') st.push(i);
    else {
        st.pop();
        if (st.isEmpty()) st.push(i);
        else best = Math.max(best, i - st.peek());
    }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Minimum add to make valid',
      code: `public int minAddToMakeValid(String s) {
    int open = 0, add = 0;
    for (char c : s.toCharArray()) {
        if (c == '(') open++;
        else if (open > 0) open--;
        else add++;
    }
    return add + open;
}`,
    },
  ],
  complexity: {
    best: 'O(n) single pass',
    average: 'O(n) time for validation and longest valid',
    worst: 'O(n) time; O(n) stack for nested "(((...)))"',
    space: 'O(n) stack depth',
  },
  patternRecognition: [
    'Balanced bracket validation with multiple types.',
    'Longest valid / shortest supersequence with matching.',
    'Remove minimum to make valid (two-pointer or stack).',
    'Generate parentheses (backtrack, not stack scan).',
    'Score of parentheses with nested multiplier (stack of ints).',
  ],
  commonMistakes: [
    'Forgetting stack empty check before pop.',
    'Longest valid: missing -1 sentinel breaks length math.',
    'Confusing minimum insert vs minimum remove counting.',
    'Wrong mapping for bracket pairs (HashMap helps clarity).',
  ],
  tradeoffs: {
    advantages: [
      'O(n) linear scan with natural LIFO semantics',
      'Index stack gives substring lengths directly',
      'Counter-only approach works for single-type parens',
    ],
    disadvantages: [
      'Multiple bracket types need explicit match table',
      'Generation problems need backtrack, not stack alone',
    ],
    alternatives: ['Two-pass balance counter for () only', 'DP O(n²) for longest valid without stack'],
    whenToUse: ['Matching nested open/close', 'Valid substring length from indices', 'Decode nested structure'],
    whenNotToUse: ['Wildcard matching with backtracking only', 'Regex full grammar'],
  },
  failureModes: [
    'Stack overflow on extremely deep nesting (rare in interviews).',
    'Off-by-one on longest valid when using index difference.',
  ],
  interview: {
    expectations: [
      'ArrayDeque stack',
      'O(n) time O(n) space',
      'Handle empty and single-char edge cases',
    ],
    commonQuestions: [
      'Valid Parentheses',
      'Longest Valid Parentheses',
      'Minimum Add to Make Parentheses Valid',
      'Generate Parentheses',
    ],
    followUps: ['Wildcard valid with *?', 'Score of parentheses nested depth?'],
    misconceptions: ['Generate parentheses uses stack—it uses backtracking constraints'],
    traps: ['Longest valid: push index of unmatched ")" as new base'],
    strongSignals: ['Uses -1 sentinel for longest valid length baseline'],
  },
  keyTakeaways: [
    'Open push; close pop-and-match; end stack empty.',
    'Longest valid: index stack + -1 sentinel.',
    'Min add: count unmatched opens + unmatched closes.',
    'Generate: backtrack with open<n and close<open.',
    'O(n) single pass for matching problems.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Valid parentheses algorithm?',
      answerHint: 'Stack opens; on close pop and verify pair; return stack empty.',
    },
    {
      level: 'intermediate',
      question: 'Longest valid parentheses with stack?',
      answerHint: 'Stack indices; -1 sentinel; on ) pop, len = i - peek if stack non-empty else push i.',
    },
    {
      level: 'advanced',
      question: 'Remove minimum parentheses to make valid?',
      answerHint: 'Stack indices of bad positions or two-pass filter excess ) then excess (.',
    },
  ],
  flashcards: [
    {
      front: 'Longest valid parentheses sentinel',
      back: 'Push -1 initially so first valid segment length computes correctly.',
    },
    {
      front: 'Generate n pairs constraint',
      back: 'Add ( if open<n; add ) if close<open.',
    },
  ],
  quickRevision: [
    'LIFO matching → stack',
    'Valid: push open, pop match close',
    'Longest valid: index stack + -1',
    'Min add: count orphan ( and )',
    'Generate: backtrack open/close limits',
    'O(n) time typical',
    'Check empty before pop',
  ],
}
