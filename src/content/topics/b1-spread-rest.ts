import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Spread (`...`) expands iterables or object properties into individual elements or key-value pairs. Rest (`...`) collects remaining items into a new array or object. Same syntax, opposite direction: spread unpacks; rest packs.',
  whyExists:
    'Before ES2015, copying arrays, merging objects, and variadic functions required verbose APIs (slice, concat, apply, arguments). Spread/rest gives a uniform, readable syntax for immutable updates and flexible function signatures.',
  mentalModel:
    'Spread is “pour out” — `[...arr]` pours array elements into a new container. Rest is “gather leftovers” — `function fn(first, ...rest)` gathers trailing args. Object spread shallow-copies enumerable own properties.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Array spread: `[...iterable]` creates a shallow copy or concatenation.',
        'Object spread: `{ ...obj, key: val }` shallow-merges; later keys override earlier.',
        'Function rest params: `(...args)` collects remaining arguments as a real Array.',
        'Destructuring rest: `const [head, ...tail] = arr` gathers remainder.',
        'Spread in function calls: `fn(...items)` expands iterable as positional args.',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Shallow only',
      text: 'Spread copies one level. Nested objects/arrays are shared references — deep clone needs structuredClone, lodash cloneDeep, or manual recursion.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Array and object spread',
      code: `const a = [1, 2];
const b = [...a, 3];        // [1, 2, 3] — new array
const user = { name: 'Ada', role: 'admin' };
const updated = { ...user, role: 'viewer' }; // shallow merge

const nested = { meta: { count: 1 } };
const copy = { ...nested };
copy.meta.count = 2;
console.log(nested.meta.count); // 2 — shared nested ref`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Rest parameters and destructuring',
      code: `function sum(first: number, ...rest: number[]) {
  return rest.reduce((acc, n) => acc + n, first);
}
sum(1, 2, 3); // 6

const [head, ...tail] = [10, 20, 30];
// head = 10, tail = [20, 30]

const { id, ...payload } = { id: '1', name: 'Ada', active: true };
// payload: { name: 'Ada', active: true } — common API pattern`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Array spread uses iterator protocol (Symbol.iterator); array-likes need Array.from.',
        'Object spread copies enumerable own properties; skips prototype chain and non-enumerable.',
        'Rest in destructuring must be last; creates a new array/object, not a view.',
        'Spread in calls uses CreateListFromArrayLike / iterator semantics per spec.',
        'TypeScript tuple rest preserves length info: `[T, ...U[]]`.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Readable immutable updates in React/state',
      'Replaces apply and arguments object',
      'Uniform syntax for arrays and plain objects',
    ],
    disadvantages: [
      'Shallow copy surprises with nested data',
      'Object spread order matters for overrides',
      'Performance cost for very large collections vs in-place mutation',
    ],
    alternatives: ['Object.assign for objects', 'Array.prototype.concat', 'Immer for deep immutable updates'],
    whenToUse: ['State updates, default merging, variadic APIs, omitting keys (rest destructure)'],
    whenNotToUse: ['Deep cloning', 'When mutating in place is intentional and safe (hot loops)'],
  },
  failureModes: [
    'Expecting deep copy from spread — nested mutation leaks.',
    'Spreading null/undefined in object context throws (use `...(obj ?? {})`).',
    'Rest not last in destructuring → SyntaxError.',
    'Spreading class instances may lose methods if only enumerable own props copied.',
  ],
  production: {
    performance: ['Avoid spread in tight loops on huge arrays; consider mutation or structural sharing'],
    maintainability: ['Use rest destructure for omitting id/timestamp in PATCH payloads'],
    reliability: ['Guard optional objects: `{ ...defaults, ...maybeConfig }` with nullish coalescing'],
  },
  interview: {
    expectations: [
      'Explain spread vs rest with examples',
      'Know shallow copy limitation',
      'Use rest to omit fields from objects',
    ],
    commonQuestions: ['Spread vs rest?', 'Is `{...obj}` a deep clone?', 'Replace apply with spread?'],
    followUps: ['How to deep clone?', 'Object spread vs Object.assign?'],
    misconceptions: ['Spread always creates deep copies'],
    traps: ['Confusing spread in types (tuple) vs value spread'],
    strongSignals: ['Mentions shallow copy, iterator protocol, rest must be last'],
  },
  keyTakeaways: [
    'Spread expands; rest collects — same `...` syntax, opposite roles.',
    'Array/object spread creates shallow copies.',
    'Rest params replace the arguments object.',
    'Object spread: later keys win on collision.',
    'Use rest destructure to omit properties (e.g. id).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is the difference between spread and rest?',
      answerHint: 'Spread unpacks iterables/objects; rest gathers remaining elements/args.',
    },
    {
      level: 'intermediate',
      question: 'Does `{ ...user }` deep clone user?',
      answerHint: 'No — shallow copy; nested objects shared.',
    },
    {
      level: 'advanced',
      question: 'How do you omit a field when sending an API update?',
      answerHint: 'const { id, ...body } = entity; send body.',
    },
  ],
  flashcards: [
    { front: 'Spread in arrays', back: 'Expands iterable into elements: [...arr, x]' },
    { front: 'Rest in functions', back: 'Collects trailing args: (...args) =>' },
    { front: 'Object spread depth', back: 'Shallow — one level of own enumerable props' },
    { front: 'Rest in destructure', back: 'Must be last; gathers remainder' },
  ],
  quickRevision: [
    'Spread = unpack; rest = pack',
    'Shallow copy only',
    'Rest param replaces arguments',
    'Object spread: right overrides left',
    'Guard null: ...(obj ?? {})',
    'Omit keys via rest destructure',
  ],
}
