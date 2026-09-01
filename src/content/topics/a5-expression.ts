import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Expression problems evaluate or parse arithmetic strings using stacks—handling operator precedence (infix), postfix (RPN) evaluation, calculator with +−×÷, and basic calculator with parentheses via dual stacks or recursive descent.',
  whyExists:
    'Human-readable infix notation hides evaluation order; stacks defer operands and operators until precedence rules resolve. RPN eliminates parentheses entirely; shunting-yard converts infix to postfix for clean O(n) evaluation.',
  mentalModel:
    'Operands wait in a value stack; operators wait in an operator stack. Higher-precedence ops fire first; parentheses pause evaluation by pushing barriers; RPN reads left-to-right with no precedence table needed.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'RPN: number → push; operator → pop b, pop a, push apply(a,b)—order matters for − and ÷.',
        'Basic calculator II (+−×÷): stack nums; on +/− push signed value; on */ pop and combine top.',
        'With parentheses: second operator stack or recursion; flush on ).',
        'Infix evaluation: shunting-yard to postfix then evaluate, or recursive descent.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'RPN pop order',
      text: 'For "a b -", pop b first then a → a - b. Reversing operands is the #1 RPN bug.',
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Tok[Token] --> Num{number?}
  Num -->|yes| VPush[Push operand stack]
  Num -->|no| Op[Pop b,a; push result]
  Op --> VPush`,
    caption: 'RPN evaluation',
  },
  example: [
    {
      type: 'paragraph',
      text: 'RPN "2 1 + 3 *": push 2,1 → + → stack [3] → push 3 → * → 9. Basic calc "3+2*2": accumulate 3, on * combine 2*2=4, then + → 7.',
    },
    {
      type: 'table',
      headers: ['format', 'precedence handling', 'stack count'],
      rows: [
        ['RPN', 'none needed', '1 operand stack'],
        ['calc II', '*/ before +-', '1 num stack + last sign'],
        ['calc I (parens)', 'nested flush', '2 stacks or recursion'],
        ['infix', 'shunting-yard', 'operand + operator stacks'],
      ],
    },
  ],
  templates: [
    {
      language: 'java',
      caption: 'Evaluate Reverse Polish Notation',
      code: `Deque<Long> st = new ArrayDeque<>();
for (String tok : tokens) {
    if (isOperator(tok)) {
        long b = st.pop(), a = st.pop();
        st.push(apply(tok, a, b));
    } else st.push(Long.parseLong(tok));
}
return st.pop().intValue();`,
    },
    {
      language: 'java',
      caption: 'Basic calculator II (+−×÷ no parens)',
      code: `Deque<Integer> st = new ArrayDeque<>();
int num = 0, sign = 1, n = s.length();
for (int i = 0; i < n; i++) {
    char c = s.charAt(i);
    if (Character.isDigit(c)) num = num * 10 + (c - '0');
    if (!Character.isDigit(c) || i == n - 1) {
        st.push(sign * num);
        num = 0;
        if (c == '+') sign = 1;
        else if (c == '-') sign = -1;
        else if (c == '*') sign = st.pop() * num; // combine immediately
        else if (c == '/') { /* handle */ }
    }
}`,
    },
  ],
  implementation: [
    {
      language: 'java',
      caption: 'Basic Calculator with parentheses (recursive)',
      code: `public int calculate(String s) {
    return eval(s, new int[]{0});
}
int eval(String s, int[] i) {
    Deque<Integer> st = new ArrayDeque<>();
    int num = 0, sign = 1;
    while (i[0] < s.length()) {
        char c = s.charAt(i[0]++);
        if (Character.isDigit(c)) num = num * 10 + (c - '0');
        else if (c == '+') { st.push(sign * num); sign = 1; num = 0; }
        else if (c == '-') { st.push(sign * num); sign = -1; num = 0; }
        else if (c == '(') { num = eval(s, i); }
        else if (c == ')') break;
        else if (c == ' ') continue;
    }
    st.push(sign * num);
    int sum = 0;
    for (int x : st) sum += x;
    return sum;
}`,
    },
  ],
  complexity: {
    best: 'O(n) single pass over tokens/chars',
    average: 'O(n) time for RPN and calculator variants',
    worst: 'O(n) time; O(n) stack for deep nesting',
    space: 'O(n) operand/operator stacks',
  },
  patternRecognition: [
    'Evaluate RPN / postfix notation.',
    'Basic calculator I/II/III (+−×÷, parentheses).',
    'String to integer with sign handling.',
    'Decode string with nested repetition k[encoded].',
    'Infix to postfix (shunting-yard).',
  ],
  commonMistakes: [
    'RPN: pop b before a for non-commutative ops.',
    'Calc II: forgetting to push last number at end of string.',
    'Whitespace and unary minus edge cases.',
    'Integer overflow on long expressions—use long in RPN.',
  ],
  tradeoffs: {
    advantages: [
      'Stack gives O(n) without AST for simple grammars',
      'RPN simplest to implement',
      'Recursive descent readable for parentheses',
    ],
    disadvantages: [
      'Precedence bugs in hand-rolled infix',
      'Multiple stacks harder to debug',
    ],
    alternatives: ['Recursive descent parser', 'Shunting-yard + RPN', 'AST evaluation'],
    whenToUse: ['Linear expression scan', 'RPN evaluation', 'Nested parens with +− only or full ops'],
    whenNotToUse: ['Full language grammar → proper parser generator'],
  },
  failureModes: [
    'Division truncating toward zero vs floor for negatives.',
    'Stack underflow on malformed RPN input.',
  ],
  interview: {
    expectations: [
      'State RPN pop order for −/÷',
      'O(n) single pass',
      'Handle spaces and unary minus if asked',
    ],
    commonQuestions: [
      'Evaluate Reverse Polish Notation',
      'Basic Calculator',
      'Basic Calculator II',
      'Decode String',
    ],
    followUps: ['Shunting-yard for infix?', 'Calc III with multiplication?'],
    misconceptions: ['Must build explicit AST for calculator I'],
    traps: ['Decode string: push string stack on [ and pop on ] with repeat count'],
    strongSignals: ['Uses long for RPN or explains overflow risk'],
  },
  keyTakeaways: [
    'RPN: push nums; op pops b then a.',
    'Calc II: stack signed chunks; */ merge before push.',
    'Parens: recursion or operator stack flush on ).',
    'O(n) time, O(n) stack depth.',
    'Decode string is stack of strings + count stack.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How evaluate RPN "3 4 2 * +"?',
      answerHint: 'Push 3,4,2; * → 8; + → 11.',
    },
    {
      level: 'intermediate',
      question: 'Basic calculator II without parentheses?',
      answerHint: 'Stack signed numbers; on */ pop and apply immediately; sum stack at end.',
    },
    {
      level: 'advanced',
      question: 'Basic calculator I with nested parens?',
      answerHint: 'Recursive eval on (; inner returns value as num; or dual-stack shunting-yard.',
    },
  ],
  flashcards: [
    {
      front: 'RPN subtract pop order',
      back: 'Pop b, pop a, push a - b.',
    },
    {
      front: 'Basic calc II */ trick',
      back: 'Combine with previous stack top before pushing new signed chunk.',
    },
  ],
  quickRevision: [
    'RPN: pop b then a for −÷',
    'Calc II: signed num stack',
    'Parens: recurse or op stack',
    'O(n) single pass',
    'Use long if overflow risk',
    'Decode string: stack of strings',
    'Shunting-yard for infix→postfix',
  ],
}
