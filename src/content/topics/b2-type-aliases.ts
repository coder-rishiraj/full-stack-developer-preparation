import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A type alias (`type Name = ...`) creates a name for any type — primitives, unions, intersections, tuples, functions, or object shapes. Unlike interfaces, type aliases can express unions and use advanced type operators (mapped, conditional, indexed access).',
  whyExists:
    'Not every type is an object interface. Unions (`string | number`), utility compositions, and branded types need a flexible alias mechanism. type keeps complex types readable and reusable without runtime cost.',
  mentalModel:
    'type is a macro for types — a shorthand label for a type expression. Once expanded, TS checks values against that expression. Aliases do not create new nominal brands unless you intentionally add opaque/branded patterns.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Syntax: `type Point = { x: number; y: number }` or `type ID = string`.',
        'Unions: `type Result = Success | Failure`.',
        'Intersections: `type Admin = User & { role: "admin" }`.',
        'Tuples: `type Pair = [string, number]`.',
        'Cannot declaration-merge; recursive types via self-reference.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'interface vs type',
      text: 'Use interface for extendable object APIs. Use type for unions, tuples, mapped/conditional types, and utility compositions.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Unions, tuples, and function types',
      code: `type Status = 'idle' | 'loading' | 'error' | 'success';

type ApiResult<T> =
  | { ok: true; data: T }
  | { ok: false; error: string };

type Coords = [number, number];

type EventHandler = (event: MouseEvent) => void;

function handle(result: ApiResult<User>) {
  if (result.ok) console.log(result.data.name);
  else console.error(result.error);
}`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Branded / opaque type',
      code: `type UserId = string & { readonly __brand: unique symbol };
type ProductId = string & { readonly __brand: unique symbol };

function userId(id: string): UserId {
  return id as UserId;
}

// Prevents mixing IDs at compile time
function loadUser(id: UserId) { /* ... */ }
// loadUser(productId) // error`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Type aliases fully erased — no runtime artifact.',
        'Recursive types: type Json = string | number | Json[] | { [k: string]: Json }.',
        'Distributive conditional types apply over union members in extends clause.',
        'type vs interface performance: identical; choice is ergonomics.',
        'satisfies operator checks literal against type while inferring narrower type.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Express unions, tuples, and advanced type logic',
      'Branded types for domain safety',
      'Composable with utility and conditional types',
    ],
    disadvantages: [
      'No declaration merging',
      'Complex aliases hurt readability without decomposition',
      'Still no runtime validation alone',
    ],
    alternatives: ['interface for object extension', 'enum for runtime constants (with caveats)'],
    whenToUse: ['Unions, API result types, event name unions, utility type pipelines'],
    whenNotToUse: ['Simple extendable object API — interface may read cleaner'],
  },
  failureModes: [
    'Overly nested conditional types — unreadable error messages.',
    'Branded types bypassed with `as` assertions.',
    'Confusing type alias with runtime value (type-only import needed).',
    'Circular type references without base case.',
  ],
  production: {
    maintainability: ['Split complex types into named steps; document discriminant fields'],
    reliability: ['Use discriminated unions for API results instead of boolean flags'],
    performance: ['Type complexity affects compile time, not runtime'],
  },
  interview: {
    expectations: [
      'Define type alias with union and tuple examples',
      'Compare interface vs type alias',
      'Explain branded types briefly',
    ],
    commonQuestions: ['interface vs type?', 'What is a union type?', 'Do types exist at runtime?'],
    followUps: ['Discriminated unions?', 'satisfies vs as?'],
    misconceptions: ['type creates a new runtime class'],
    traps: ['Thinking interface can be union of primitives directly (use type)'],
    strongSignals: ['Mentions unions, erasure, when to pick type over interface'],
  },
  keyTakeaways: [
    'type names any type expression — unions, tuples, objects.',
    'Erased at runtime; purely static.',
    'Prefer type for unions and advanced compositions.',
    'Branded types add nominal flavor to structural TS.',
    'interface merges; type does not.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What can a type alias represent that an interface cannot easily?',
      answerHint: 'Unions, tuples, primitive aliases, conditional/mapped types.',
    },
    {
      level: 'intermediate',
      question: 'interface vs type — when choose each?',
      answerHint: 'Interface for extendable objects/merging; type for unions and complex ops.',
    },
    {
      level: 'advanced',
      question: 'What is a branded/opaque type?',
      answerHint: 'Intersection with unique symbol brand to prevent structurally identical types mixing.',
    },
  ],
  flashcards: [
    { front: 'type alias', back: 'Name for any type expression' },
    { front: 'Union type', back: 'A | B — value is one of' },
    { front: 'type vs interface merge', back: 'Only interface supports declaration merging' },
    { front: 'Branded type', back: 'Nominal tag via intersection — prevents accidental mix' },
  ],
  quickRevision: [
    'type = alias for any type',
    'Unions, tuples, functions OK',
    'No runtime, no merging',
    'Use for discriminated unions',
    'interface for extendable objects',
    'Branded types for domain IDs',
  ],
}
