import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'JavaScript values are either primitives (stored and copied by value) or reference types (objects, arrays, functions — stored as references to heap locations). Assigning or passing a primitive copies the bits; assigning an object copies the pointer, not the object itself.',
  whyExists:
    'Primitives are cheap immutable atoms for numbers, strings, booleans, symbols, bigint, null, and undefined. Objects aggregate mutable state on the heap with shared identity. The split balances performance (stack-friendly scalars) with flexible data structures.',
  mentalModel:
    'Primitives are sticky notes with the value written on them — photocopying gives an independent note. Objects are house addresses — copying the address means two variables visit the same house; changing furniture inside affects everyone holding that address.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Primitives live in the value slot of a binding; assignment copies the value.',
        'Objects are allocated on the heap; the binding holds a reference (pointer).',
        'Function arguments are always passed by value — but object arguments pass the reference value (copy of pointer).',
        'Mutating object properties is visible through all references to that object.',
        'Reassigning a variable to a new object does not affect other variables still pointing at the old object.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'typeof null === "object"',
      text: 'Historical bug — null is a primitive null value, not an object. Always use `value === null` or `value == null` (also catches undefined) instead of typeof checks for null.',
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Stack[Stack: bindings]
  Heap[Heap: objects]
  P1[a = 42 primitive value]
  P2[b = a copies 42]
  R1[obj = ref to heap object]
  R2[copy = obj same ref]
  Stack --> P1
  Stack --> P2
  Stack --> R1
  Stack --> R2
  R1 --> Heap
  R2 --> Heap`,
    caption: 'Primitives copied by value; object references alias the same heap object',
  },
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Assignment vs mutation',
      code: `let a = { x: 1 };
let b = a;       // same reference
b.x = 2;
console.log(a.x); // 2 — mutated shared object

let c = a;       // still same ref
c = { x: 99 };   // reassign c to NEW object
console.log(a.x); // 2 — a unchanged

let n = 5;
let m = n;
m = 10;
console.log(n);   // 5 — primitives independent`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Pass-by-value of reference',
      code: `function bump(obj) {
  obj.count++;           // mutates caller's object
  obj = { count: 0 };    // reassign local param — caller unaffected
}
const state = { count: 1 };
bump(state);
console.log(state.count); // 2`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        '7 primitive types: undefined, null, boolean, number, bigint, string, symbol.',
        'Everything else is an object (including arrays, functions, dates, regex).',
        'Strings are immutable primitives — "changing" a string creates a new one.',
        'Boxing: primitives temporarily wrapped in object wrappers (new String) for method calls; avoid new String/Number.',
        'Structured cloning and JSON.parse/stringify create new object graphs (references broken).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Efficient copy semantics for scalars',
      'Shared mutable objects enable efficient updates and identity semantics',
      'Immutable primitives are safe keys and comparison targets',
    ],
    disadvantages: [
      'Accidental shared mutation bugs',
      'Shallow copy vs deep copy confusion',
      'NaN and -0 edge cases on number primitive',
    ],
    alternatives: [
      'Immutable data patterns (spread, structuredClone, Immer)',
      'Value objects / records with explicit copy-on-write',
    ],
    whenToUse: ['Primitives for IDs, flags, counts; objects for structured mutable state'],
    whenNotToUse: ['Mutating shared objects without documenting ownership; using objects as map keys when primitives suffice'],
  },
  failureModes: [
    'Expecting reassignment inside a function to replace caller object.',
    'Shallow copy `{ ...obj }` — nested objects still aliased.',
    'Comparing objects with === expecting value equality.',
    'Mutating default parameter objects shared across calls.',
  ],
  production: {
    performance: ['Avoid deep cloning in hot paths; prefer immutable updates at changed paths only'],
    reliability: ['Treat function params as read-only unless API documents mutation'],
    maintainability: ['Use spread/rest or structuredClone when ownership is unclear'],
    security: ['Deep clone untrusted JSON before use to avoid prototype pollution paths'],
  },
  interview: {
    expectations: [
      'Explain pass-by-value with object references',
      'Predict output of assignment vs mutation examples',
      'List primitive types and typeof quirks',
    ],
    commonQuestions: [
      'Primitive vs reference types?',
      'What happens when you pass an object to a function?',
      'Difference between == and === for objects?',
    ],
    followUps: ['Shallow vs deep copy?', 'How does structuredClone differ from JSON clone?'],
    misconceptions: ['JS is pass-by-reference for objects', 'typeof null is reliable for null checks'],
    traps: ['const prevents object mutation', 'Spread always deep copies'],
    strongSignals: ['References alias heap; reassignment local only; immutable strings'],
  },
  keyTakeaways: [
    'Primitives copy by value; objects copy reference by value.',
    'Mutation through a reference affects all aliases.',
    'Reassignment creates a new binding target, not mutation.',
    'typeof null is "object" — use === null.',
    'Strings are immutable primitives despite .length and methods.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between primitive and reference types?',
      answerHint: 'Primitives stored/copied by value; objects are references to heap identity.',
    },
    {
      level: 'intermediate',
      question: 'After `let b = a` where a is an object, does changing b.x affect a?',
      answerHint: 'Yes — same reference; mutation is shared.',
    },
    {
      level: 'advanced',
      question: 'Explain pass-by-value vs pass-by-reference in JavaScript.',
      answerHint: 'Always pass-by-value; object args pass copied pointer — mutate visible, reassign local not.',
    },
  ],
  flashcards: [
    { front: 'Primitive types (7)', back: 'undefined, null, boolean, number, bigint, string, symbol' },
    { front: 'Object assignment', back: 'Copies reference — aliases same heap object' },
    { front: 'typeof null', back: '"object" (historical bug) — use === null' },
  ],
  quickRevision: [
    '7 primitives — everything else object',
    'Assign primitive → copy value',
    'Assign object → copy reference',
    'Mutate shared; reassign local only',
    'Pass-by-value (reference is the value)',
    'Strings immutable; spread shallow',
  ],
}
