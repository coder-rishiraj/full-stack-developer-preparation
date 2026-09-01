import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Type coercion is JavaScript\'s automatic or explicit conversion of values from one type to another — notably ToNumber, ToString, ToBoolean, and Abstract Equality Comparison (`==`). Primitives and objects follow well-defined but sometimes surprising rules in the ECMAScript spec.',
  whyExists:
    'Early JS targeted dynamic web pages where values arrive as strings from forms and URLs. Implicit coercion made loose APIs possible but created footguns. Modern code prefers explicit conversion and strict equality (`===`).',
  mentalModel:
    "The engine runs conversion algorithms when operators expect a type. `+` with a string prefers string concatenation. `==` coerces both sides before compare. Falsy values (`0`, `''`, `null`, `undefined`, `NaN`, `false`) become false in boolean context.",
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'ToBoolean: falsy list → false; everything else → true (including [] and {}).',
        'ToNumber: parse strings; true→1, false→0, null→0, undefined→NaN, objects→valueOf/toString dance.',
        'ToString: numbers and symbols stringify; objects call toString/valueOf.',
        'Abstract equality `==`: null == undefined only cross-nullish pair; otherwise often numeric compare after coercion.',
        'Strict `===`: no coercion; different types always false.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'The + operator',
      text: 'If either operand is a string (or Symbol), + does string concatenation after ToString on the other. `[1] + 1` → `"11"`. Prefer Number(), parseInt, or unary + with care.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Classic coercion traps',
      code: `console.log([] + []);       // '' (empty string concat)
console.log([] + {});       // '[object Object]'
console.log({} + []);       // 0 or '[object Object]' (statement vs expression)
console.log(null == undefined); // true
console.log(null === undefined); // false
console.log('0' == false);  // true
console.log('' == 0);       // true`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Explicit conversion in production code',
      code: `function toNumber(value: unknown): number {
  if (typeof value === 'number') return value;
  if (typeof value === 'string' && value.trim() !== '') {
    const n = Number(value);
    if (!Number.isNaN(n)) return n;
  }
  throw new TypeError('Expected numeric value');
}

// Prefer === and explicit parsing
const count = toNumber(formData.get('count'));`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Abstract Equality Comparison table in ECMA-262 §7.2.16.',
        'Object to primitive: hint Number or String, try valueOf then toString (or reverse for String hint).',
        'SameValueZero for Map/Set keys (NaN equals NaN).',
        'Symbol and BigInt have restricted mixing with + and == (TypeError in modern strict paths).',
        'Optional chaining and nullish coalescing reduce need for == null checks.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Flexible APIs accepting mixed input in legacy code',
      'Truthy/falsy enables concise guards (`if (items.length)`)',
    ],
    disadvantages: [
      'Subtle bugs from implicit conversion',
      'Hard to predict `==` without spec knowledge',
      'Debugging pain in loosely typed boundaries',
    ],
    alternatives: ['Always ===', 'Explicit Number/String/Boolean', 'Schema validation (Zod) at boundaries'],
    whenToUse: ['Explicit conversion at I/O boundaries; == null for null|undefined only (idiom)'],
    whenNotToUse: ['Comparing unrelated types with ==', 'Relying on + for arithmetic with unknown types'],
  },
  failureModes: [
    'Sorting numbers as strings: `[10, 2].sort()` → [10, 2] lexicographic.',
    'parseInt without radix: parseInt("08") legacy octal quirks.',
    'Double negation !! or Boolean() forgotten — implicit coercion in templates.',
    'Adding number to form input string → concatenation not sum.',
  ],
  production: {
    performance: ['Parse once at boundary; avoid repeated coercion in hot loops'],
    reliability: ['Validate types at API edges; use === internally'],
    maintainability: ['Enable eqeqeq ESLint rule; ban == except null check pattern'],
  },
  interview: {
    expectations: [
      'List falsy values',
      'Explain [] + {} style puzzles',
      'Know == vs === and when null == undefined',
    ],
    commonQuestions: ['What is type coercion?', 'Output of [] + []?', 'Truthy vs falsy?'],
    followUps: ['How does object to primitive work?', 'SameValue vs Strict Equality?'],
    misconceptions: ['=== never coerces (true, but -0 === +0)'],
    traps: ['{} + [] as statement vs expression'],
    strongSignals: ['References ToNumber/ToString, falsy list, prefer explicit conversion'],
  },
  keyTakeaways: [
    'Coercion converts types implicitly or via explicit wrappers.',
    'Falsy: false, 0, -0, 0n, "", null, undefined, NaN.',
    'Use === by default; == mostly for null/undefined check.',
    '+ prefers string if either side is string.',
    'Parse and validate at system boundaries.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Name all falsy values in JavaScript.',
      answerHint: 'false, 0, -0, 0n, "", null, undefined, NaN.',
    },
    {
      level: 'intermediate',
      question: 'Why does "5" + 3 equal "53" but "5" - 3 equals 2?',
      answerHint: '+ stringifies; - uses ToNumber on both operands.',
    },
    {
      level: 'advanced',
      question: 'When is == acceptable in modern code?',
      answerHint: 'Mostly x == null for null or undefined; otherwise ===.',
    },
  ],
  flashcards: [
    { front: 'Falsy values', back: 'false, 0, -0, 0n, "", null, undefined, NaN' },
    { front: '== vs ===', back: '== coerces types; === same type and value' },
    { front: '+ with string', back: 'String concatenation if either operand is string' },
    { front: 'Truthy [] and {}', back: 'Empty array/object are truthy' },
  ],
  quickRevision: [
    'Implicit vs explicit coercion',
    'Falsy list — memorize',
    '=== default; == null idiom only',
    '+ string wins; - numeric',
    'Parse at boundaries',
    'Objects: valueOf/toString for primitive',
  ],
}
