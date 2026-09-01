import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '`keyof T` produces a union of string, number, or symbol keys of type T. It connects runtime object keys to compile-time types — essential for type-safe property access, mapped types, and generic pick/pluck/update helpers.',
  whyExists:
    'Stringly-typed property names (`obj[name]`) lose autocomplete and typo checking. keyof ties valid keys to an object type so refactors rename safely and generics preserve key-value relationships.',
  mentalModel:
    'keyof is “list every door on this object type.” If User has id and name, keyof User is "id" | "name". Use with extends to say “K must be one of those doors.”',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Primitive keyof: keyof string → number | typeof Symbol.iterator | ... (rare).',
        'Object: keyof User → union of declared keys.',
        'With generics: `K extends keyof T` for typed get/set.',
        'Mapped types iterate `P in keyof T`.',
        'Optional keys: `-?` modifiers in mapped types affect requiredness.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'const assertion synergy',
      text: 'as const on tuples/objects narrows keys and values — `keyof typeof config` for enum-like configs without runtime enum.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Typed get and set',
      code: `function getProp<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

function setProp<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
  obj[key] = value;
}

const user = { id: '1', name: 'Ada', age: 30 };
getProp(user, 'name'); // string
// getProp(user, 'email'); // error — not in keyof User`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Mapped type from keyof',
      code: `type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type UserKeys = keyof { id: string; name: string }; // 'id' | 'name'`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Index signatures add string | number keys to keyof result.',
        'keyof (A & B) is keyof A | keyof B (approximation — intersection nuances).',
        'Template literal keys: `${Prefix}${keyof T}` in advanced mapped types.',
        'Private/protected class members excluded from public keyof instance type.',
        'Computed keys with as const feed keyof typeof object.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Refactor-safe property names',
      'Powers Pick, Omit, Partial, Record utilities',
      'Generic helpers preserve value types via T[K]',
    ],
    disadvantages: [
      'Wide index signatures widen keyof to string',
      'Complex mapped types slow compile time',
      'Does not include keys only present at runtime',
    ],
    alternatives: ['String literal union manually maintained', 'Runtime Object.keys + validation'],
    whenToUse: ['Generic CRUD, form field typing, event name maps, config keys'],
    whenNotToUse: ['Dynamic keys unknown at compile time — validate at runtime'],
  },
  failureModes: [
    'keyof T too wide when T has `[key: string]: unknown`.',
    'Using string instead of K extends keyof T loses T[K] link.',
    'Assuming keyof includes symbol keys user never set.',
    'Mapped type not distributing as expected on unions.',
  ],
  production: {
    maintainability: ['Define key unions from keyof typeof constants for API routes'],
    reliability: ['Runtime validate dynamic keys; keyof only for static shapes'],
  },
  interview: {
    expectations: [
      'Explain keyof User result',
      'Write getProp with K extends keyof T',
      'Connect to Pick/Omit/mapped types',
    ],
    commonQuestions: ['What is keyof?', 'keyof vs Object.keys?', 'Indexed access T[K]?'],
    followUps: ['Mapped types?', 'as const + keyof typeof?'],
    misconceptions: ['keyof returns runtime array'],
    traps: ['keyof any is string | number | symbol'],
    strongSignals: ['Shows T[K] indexed access, pick pattern, mapped type loop'],
  },
  keyTakeaways: [
    'keyof T = union of keys of T.',
    'Use with extends for type-safe property params.',
    'Indexed access T[K] gives value type at key K.',
    'Foundation of utility and mapped types.',
    'Pair with as const for config key unions.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is keyof { a: 1; b: 2 }?',
      answerHint: '"a" | "b".',
    },
    {
      level: 'intermediate',
      question: 'How do keyof and indexed access work together?',
      answerHint: 'K extends keyof T lets you return T[K] for typed get.',
    },
    {
      level: 'advanced',
      question: 'Why does an index signature widen keyof?',
      answerHint: 'string index signature adds string to keyof union.',
    },
  ],
  flashcards: [
    { front: 'keyof T', back: 'Union of property names of T' },
    { front: 'K extends keyof T', back: 'K must be valid key of T' },
    { front: 'T[K]', back: 'Indexed access — type of property K on T' },
    { front: 'Mapped type', back: '[P in keyof T]: ...' },
  ],
  quickRevision: [
    'keyof = key union',
    'T[K] = value type at K',
    'Mapped types loop keyof',
    'Pick/Omit built on keyof',
    'as const + keyof typeof',
    'Index signature widens keys',
  ],
}
