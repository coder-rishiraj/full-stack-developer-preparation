import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A union type (`A | B`) means a value can be one of several types. TypeScript narrows unions with control flow (typeof, in, discriminant checks) to access type-specific members safely. Unions model optional states, API variants, and polymorphic inputs.',
  whyExists:
    'Real data is heterogeneous — a field may be string or null, a result success or error. Unions encode allowed alternatives in the type system instead of loose any or overloaded runtime checks.',
  mentalModel:
    'A union is a fork in the road. You must prove which branch you are on before using branch-specific tools. The compiler is the guardrail — narrowing is showing your ID at each fork.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Literal unions: `type Theme = "light" | "dark"`.',
        'Object unions: members share or differ by discriminant property.',
        'Narrowing: typeof, instanceof, in operator, equality on discriminant.',
        'Exhaustiveness: switch with never in default catches missing cases.',
        'Union with null/undefined: optional chaining and nullish coalescing.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Common union pattern',
      text: 'Use discriminated unions `{ kind: "a"; ... } | { kind: "b"; ... }` for state machines and API results — best narrowing story.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Literal and primitive unions',
      code: `type Id = string | number;

function printId(id: Id) {
  if (typeof id === 'string') {
    console.log(id.toUpperCase());
  } else {
    console.log(id.toFixed(0));
  }
}

type Input = string | null | undefined;
function normalize(value: Input): string {
  return value ?? '';
}`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Discriminated union with exhaustiveness',
      code: `type Shape =
  | { kind: 'circle'; radius: number }
  | { kind: 'rect'; w: number; h: number };

function area(s: Shape): number {
  switch (s.kind) {
    case 'circle':
      return Math.PI * s.radius ** 2;
    case 'rect':
      return s.w * s.h;
    default: {
      const _exhaustive: never = s;
      return _exhaustive;
    }
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Union types are commutative: A | B equals B | A.',
        'Subtype reduction: union of overlapping object types flattens common props.',
        'Discriminant must be literal type on all members for reliable narrowing.',
        'Control flow analysis merges narrowing across assignments and returns.',
        'Distributive conditional types: (A | B) extends T ? X : Y distributes over union.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Models real-world variability precisely',
      'Forces handling of each case',
      'Better than any for JSON/API shapes',
    ],
    disadvantages: [
      'Wide unions complicate error messages',
      'Forgotten case → runtime bug if no exhaustiveness check',
      'Optional everything unions (`T | undefined`) can propagate',
    ],
    alternatives: ['Inheritance hierarchies (less idiomatic in TS)', 'Single object with optional fields (weaker)'],
    whenToUse: ['Result types, UI state, event payloads, theme/mode enums as literals'],
    whenNotToUse: ['When one struct with optional fields is clearer and mutually exclusive states not needed'],
  },
  failureModes: [
    'Accessing member not on all union members without narrowing.',
    'Missing default never — new union member silently falls through.',
    'Using || instead of ?? conflating 0/"" with nullish.',
    'Discriminant typo — narrowing fails silently at compile time if string widened.',
  ],
  production: {
    maintainability: ['Use const discriminant literals; enable strictNullChecks'],
    reliability: ['Exhaustive switch on discriminated unions in reducers'],
    observability: ['Log unhandled union tags in default branch at runtime as safety net'],
  },
  interview: {
    expectations: [
      'Write and narrow a union',
      'Explain discriminated unions',
      'Use never for exhaustiveness',
    ],
    commonQuestions: ['What is a union type?', 'How does narrowing work?', 'Discriminated union?'],
    followUps: ['Union vs intersection?', 'Distributive conditionals?'],
    misconceptions: ['Union means value has all types at once'],
    traps: ['Forgetting null/undefined in API types'],
    strongSignals: ['Mentions control flow narrowing, never exhaustiveness, discriminant'],
  },
  keyTakeaways: [
    'Union = value is one of several types.',
    'Narrow before accessing type-specific members.',
    'Discriminated unions use shared literal key (kind/tag).',
    'never in default ensures exhaustiveness.',
    'Prefer ?? over || for nullish defaults.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does string | number mean?',
      answerHint: 'Value may be string or number; narrow before type-specific ops.',
    },
    {
      level: 'intermediate',
      question: 'What is a discriminated union?',
      answerHint: 'Union members share literal discriminant field for switch narrowing.',
    },
    {
      level: 'advanced',
      question: 'How does exhaustiveness checking with never work?',
      answerHint: 'Assign s to never in default; error if union member unhandled.',
    },
  ],
  flashcards: [
    { front: 'Union A | B', back: 'Value is type A or type B' },
    { front: 'Narrowing', back: 'Control flow refines union to specific member' },
    { front: 'Discriminant', back: 'Shared literal key (kind) on union members' },
    { front: 'never exhaustiveness', back: 'Compile error if switch misses case' },
  ],
  quickRevision: [
    'Union = one of several types',
    'Narrow: typeof, in, discriminant',
    'Discriminated union + switch',
    'never for exhaustive check',
    '?? for nullish not ||',
    'strictNullChecks essential',
  ],
}
