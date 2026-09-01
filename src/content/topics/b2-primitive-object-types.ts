import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'JavaScript has seven primitive types (string, number, bigint, boolean, undefined, null, symbol) and one object type. Primitives are immutable values stored by value; objects are mutable reference types. Primitives can be wrapped in object wrappers (String, Number, etc.) for method access.',
  whyExists:
    'Primitives enable fast, copy-by-value semantics for simple data. Objects model collections, identity, and behavior. The split balances performance with the need for methods on strings and numbers via temporary boxing.',
  mentalModel:
    'Primitives are like sticky notes — copying duplicates the value. Objects are like shared whiteboards — copying the reference means two variables point at the same board. typeof null is "object" (historical bug); use === null for null checks.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'typeof distinguishes most primitives; null returns "object".',
        'Primitives compared by value; objects compared by reference (unless valueOf/toString coerced).',
        'Autoboxing: `"hi".toUpperCase()` wraps in temporary String object, then discards.',
        'Object.is handles edge cases: NaN equals NaN; -0 !== +0.',
        'Structured cloning duplicates object graphs; primitives copy inline.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'null vs undefined',
      text: 'undefined = missing binding or no return. null = intentional absence. Both are nullish (?? and ?. treat them alike).',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Value vs reference',
      code: `let a = { count: 1 };
let b = a;
b.count = 2;
console.log(a.count); // 2 — same reference

let x = 5;
let y = x;
y = 10;
console.log(x); // 5 — primitive copied

typeof null;        // 'object' (legacy)
Object.prototype.toString.call(null); // '[object Null]'`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Primitive vs object types',
      code: `type Id = string;           // primitive
type User = { id: Id; name: string }; // object

function cloneUser(u: User): User {
  return { ...u }; // shallow — nested objects still shared
}

const sym = Symbol('id'); // unique primitive key
const map = new Map<object, string>();
map.set({ k: 1 }, 'a'); // object keys compared by reference`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Primitive tags in engines (Smi, heap numbers, string ropes/cons strings).',
        'Wrapper objects: new String("x") creates object; avoid in production (typeof "object").',
        'Symbol registry and well-known symbols (Symbol.iterator, Symbol.toStringTag).',
        'BigInt cannot mix with Number in arithmetic without explicit conversion.',
        'Record vs object in TS: structural typing for plain object shapes.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Primitives cheap to copy and compare',
      'Objects flexible for identity and mutation',
      'Symbols enable hidden property keys',
    ],
    disadvantages: [
      'Reference semantics surprise beginners',
      'typeof null bug',
      'Autoboxing hides allocation in hot paths if abused',
    ],
    alternatives: ['Immutable data libraries for nested updates', 'Value objects via classes with custom equality'],
    whenToUse: ['Primitives for IDs, flags, counts; objects for entities and collections'],
    whenNotToUse: ['new String/Number/Boolean wrappers', 'Mutating shared objects without intent'],
  },
  failureModes: [
    'Mutating shared default object params: `function f(opts = {})` safe; `opts = defaults` shared ref bad.',
    'Comparing objects with === expecting deep equality.',
    'Mixing bigint and number in + without conversion.',
    'Using typeof for null detection.',
  ],
  production: {
    performance: ['Prefer primitives in hot paths; avoid unnecessary boxing'],
    reliability: ['Use Object.is or SameValueZero where NaN/-0 matter'],
    maintainability: ['structuredClone or immutable patterns for nested state'],
  },
  interview: {
    expectations: [
      'List primitive types',
      'Explain value vs reference',
      'Know typeof null and Object.is nuances',
    ],
    commonQuestions: ['Primitive vs reference types?', 'typeof null?', 'Difference null vs undefined?'],
    followUps: ['What is autoboxing?', 'How does Map key equality work?'],
    misconceptions: ['All typeof object results are plain objects'],
    traps: ['[] and {} are truthy objects, not primitives'],
    strongSignals: ['Mentions immutability of primitives, reference identity, nullish coalescing'],
  },
  keyTakeaways: [
    '7 primitives + object; primitives immutable, by value.',
    'Objects mutable, compared by reference.',
    'typeof null === "object" — use === null.',
    'Autoboxing enables "hi".length on primitives.',
    'Object.is for NaN and signed zero edge cases.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What are JavaScript primitive types?',
      answerHint: 'string, number, bigint, boolean, undefined, null, symbol.',
    },
    {
      level: 'intermediate',
      question: 'Why does changing b affect a when b = a for objects?',
      answerHint: 'Both hold same reference; mutation visible through both.',
    },
    {
      level: 'advanced',
      question: 'When is Object.is preferable to ===?',
      answerHint: 'NaN equality; distinguishing -0 and +0.',
    },
  ],
  flashcards: [
    { front: 'Primitive types', back: 'string, number, bigint, boolean, undefined, null, symbol' },
    { front: 'typeof null', back: '"object" — historical bug' },
    { front: 'Object comparison', back: 'Reference identity unless SameValue/coercion' },
    { front: 'Autoboxing', back: 'Temporary wrapper for primitive method access' },
  ],
  quickRevision: [
    'Primitives: by value, immutable',
    'Objects: by reference, mutable',
    'typeof null → object',
    'null = intentional absent; undefined = missing',
    'Object.is for NaN/-0',
    'Avoid new String/Number',
  ],
}
