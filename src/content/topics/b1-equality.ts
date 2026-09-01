import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'JavaScript equality compares values with `===` (strict, no coercion) or `==` (abstract equality with type coercion). Object equality is identity (same reference), not structural. `Object.is` handles edge cases like NaN and signed zero.',
  whyExists:
    'Dynamic typing means comparisons often cross types (string "5" vs number 5). Strict equality avoids subtle bugs; loose equality exists for legacy ergonomics. Separate identity vs value semantics match how primitives and objects behave in memory.',
  mentalModel:
    '=== asks “same type and same value?” with no conversion. == asks “can I coerce these to something equal?” — often surprising. For objects, all three (==, ===, Object.is) check same reference, not same contents.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        '=== : types must match; then compare values. NaN !== NaN; +0 === -0.',
        '== : if types differ, apply coercion rules (ToNumber, ToString, ToBoolean, object ToPrimitive).',
        'Object.is : like === except Object.is(NaN, NaN) true; Object.is(+0, -0) false.',
        'Same-value-zero: used internally for Map keys — treats NaN as equal, +0/-0 as equal.',
        'Deep equality (lodash isEqual, JSON.stringify) is library/convention, not built-in.',
      ],
    },
    {
      type: 'table',
      headers: ['Comparison', 'null == undefined', 'NaN', '+0 vs -0', '"5" vs 5'],
      rows: [
        ['===', 'false', 'false (NaN !== NaN)', 'true', 'false'],
        ['==', 'true', 'false', 'true', 'true'],
        ['Object.is', 'false', 'true', 'false', 'false'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TD
  A[Compare a and b]
  Strict{=== ?}
  Loose{== ?}
  Types{Same type?}
  Coerce[Abstract equality coercion]
  Val[Compare values]
  Ref[Same object reference?]
  A --> Strict
  A --> Loose
  Strict --> Types
  Types -->|no| False[false]
  Types -->|yes primitives| Val
  Types -->|objects| Ref
  Loose --> Coerce --> Val`,
    caption: 'Strict checks type first; loose coerces then compares',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Notorious == cases',
      code: `console.log([] == false);   // true — [] → "" → 0, false → 0
console.log(null == undefined); // true — special case
console.log('' == 0);           // true
console.log(NaN == NaN);        // false

console.log([] === false);      // false — different types
console.log(Object.is(NaN, NaN)); // true`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Object identity vs structure',
      code: `const a = { x: 1 };
const b = { x: 1 };
const c = a;
console.log(a === b); // false — different references
console.log(a === c); // true — same reference

// Structural compare (manual / library)
JSON.stringify(a) === JSON.stringify(b); // true (key order caveat)`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Abstract Equality Algorithm (ECMA-262): null/undefined pairing, boolean ToNumber, string/number mix, object ToPrimitive.',
        'SameValue: Object.is semantics; SameValueZero: Map/Set use (NaN equal, +0/-0 equal).',
        'Symbols are unique — Symbol() === Symbol() is false.',
        'BigInt cannot mix with Number in == without TypeError in modern strict contexts.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      '=== is predictable and linter-default',
      '== convenient for null/undefined checks with == null',
      'Object.is for Map keys and NaN checks',
    ],
    disadvantages: [
      '== coercion table is hard to memorize',
      'No built-in deep equality',
      'JSON.stringify equality is fragile (key order, undefined, Date)',
    ],
    alternatives: ['Always === plus explicit null checks', 'structuredClone + deep libs', 'Value objects with custom equals'],
    whenToUse: ['=== everywhere; Object.is for NaN; == null for nil checks only'],
    whenNotToUse: ['== for general comparisons; JSON.stringify for object equality in production'],
  },
  failureModes: [
    'Using == and hitting [] == ![] style surprises.',
    'Assuming two identical-looking objects are equal.',
    'Map.has(NaN) works (SameValueZero) but NaN === NaN is false — confusion.',
    'Comparing floating point with === without epsilon.',
  ],
  production: {
    performance: ['Prefer === ; avoid deep equality on large graphs in hot paths'],
    reliability: ['Standardize on === ; document any intentional == null'],
    maintainability: ['eslint eqeqeq; use typed APIs to reduce coercion need'],
    security: ['Coercion in == can hide type confusion bugs in untrusted input'],
  },
  interview: {
    expectations: [
      'Explain === vs == with examples',
      'Know null == undefined',
      'Object identity for {} === {}',
    ],
    commonQuestions: ['[] == ![]?', 'Difference === and Object.is?', 'How compare objects by value?'],
    followUps: ['SameValueZero vs SameValue?', 'Why NaN !== NaN?'],
    misconceptions: ['== compares without conversion', 'Deep equality is built-in'],
    traps: ['[] + [] and coercion chains', 'forgetting Symbol uniqueness'],
    strongSignals: ['Mentions coercion algorithm, Object.is NaN, reference identity'],
  },
  keyTakeaways: [
    'Default to === ; avoid == except maybe `x == null`.',
    'Objects compare by reference, not structure.',
    'NaN !== NaN; Object.is(NaN, NaN) is true.',
    'Object.is differs on +0 vs -0.',
    'Deep equality requires a library or custom logic.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between == and ===?',
      answerHint: '=== strict type+value; == coerces types then compares.',
    },
    {
      level: 'intermediate',
      question: 'Why is {} === {} false?',
      answerHint: 'Different object references on heap; identity not structure.',
    },
    {
      level: 'advanced',
      question: 'When would you use Object.is over ===?',
      answerHint: 'NaN equality, distinguish +0 and -0; SameValue semantics.',
    },
  ],
  flashcards: [
    { front: 'null == undefined', back: 'true (special case); === is false' },
    { front: 'NaN === NaN', back: 'false; Object.is(NaN, NaN) true' },
    { front: 'Object equality', back: 'Reference identity, not deep structure' },
  ],
  quickRevision: [
    'Prefer === always',
    '== null catches null and undefined',
    'Objects: same reference only',
    'NaN: use Number.isNaN or Object.is',
    'Symbols always unique',
    'Deep compare: library / custom',
  ],
}
