import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Indexed access types `T[K]` look up the type of property K on T. K can be a literal, union of literals, or keyof T. They power utility types, conditional property extraction, and generic helpers that preserve key-value type relationships.',
  whyExists:
    'When K is generic, returning “some property of T” needs a type operator linking key to value type. Indexed access is that operator — without it, Pick and get/set helpers would collapse to unknown.',
  mentalModel:
    'T[K] is “the type you get when you read obj[k].” If K is a union, T[K] is a union of those property types (distributive over K as union). Nested access: User["address"]["city"].',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Single key: `User["id"]` → string.',
        'Union of keys: `User["id" | "name"]` → string | string.',
        'Generic: `T[K]` where K extends keyof T.',
        'Array/tuple: `T[number]` for element type; `T[0]` first element.',
        'Optional properties: T[K] includes undefined when strictOptionalPropertyTypes off.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Pick is indexed access in a loop',
      text: 'Pick<T, K> = { [P in K]: T[P] } — mapped type with indexed access T[P] for each P.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'typescript',
      caption: 'Basic and nested indexed access',
      code: `type User = {
  id: string;
  name: string;
  address: { city: string; zip: string };
};

type UserId = User['id'];                    // string
type City = User['address']['city'];         // string
type IdOrName = User['id' | 'name'];         // string

type ArrayElement = string[][number];        // string
type TupleSecond = [string, number, boolean][1]; // number`,
    },
    {
      type: 'code',
      language: 'typescript',
      caption: 'Generic pluck with T[K]',
      code: `function pluck<T, K extends keyof T>(records: T[], key: K): Array<T[K]> {
  return records.map(r => r[key]);
}

const users = [
  { id: '1', name: 'Ada' },
  { id: '2', name: 'Lin' },
];

const names = pluck(users, 'name'); // string[]`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Access on union T: (A | B)[K] distributes — (A[K] | B[K]) if K on both.',
        'Readonly and optional modifiers flow into T[K].',
        'Template literal keys in mapped types combine with indexed access.',
        'No runtime operation — purely type-level lookup.',
        'Recursive types use indexed access on self-type carefully to terminate.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Precise generic return types',
      'Composable with Pick, Omit, conditional types',
      'Extract nested API response field types',
    ],
    disadvantages: [
      'Errors cryptic when K not assignable to keyof T',
      'Union key access can produce unexpected wide unions',
      'Optional undefined handling confuses strict mode users',
    ],
    alternatives: ['Manual duplicate type aliases per field', 'Codegen from schema'],
    whenToUse: ['pluck, getField, form value types, API field extraction'],
    whenNotToUse: ['When keyof already too wide from index signature'],
  },
  failureModes: [
    'K not extends keyof T — compile error on generic call.',
    'Accessing non-existent key on union of objects — may be never.',
    'T[number] on tuple returns union of all element types not rest.',
    'Forgetting optional ? adds undefined in some configs.',
  ],
  production: {
    maintainability: ['type ApiUserName = ApiResponse["data"]["user"]["name"] for docs'],
    reliability: ['Extract types from OpenAPI fields via indexed paths'],
  },
  interview: {
    expectations: [
      'Write User["id"] and nested access',
      'Explain T[K] in generic pluck',
      'Connect to Pick mapped type',
    ],
    commonQuestions: ['What is T[K]?', 'User["id" | "name"] result?', 'Array element type?'],
    followUps: ['Optional property T[K]?', 'Conditional indexed access?'],
    misconceptions: ['T[K] runs at runtime'],
    traps: ['Confusing tuple index with object key access syntax'],
    strongSignals: ['pluck generic, Pick definition, tuple T[number]'],
  },
  keyTakeaways: [
    'T[K] = type of property K on T.',
    'K can be union → union of property types.',
    'Core of Pick and many utility types.',
    'Use with K extends keyof T in generics.',
    'Tuple/array: T[number] for elements.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is User["name"] if name: string?',
      answerHint: 'string — indexed access type.',
    },
    {
      level: 'intermediate',
      question: 'Return type of pluck<T,K>(arr, key) with K extends keyof T?',
      answerHint: 'Array<T[K]>.',
    },
    {
      level: 'advanced',
      question: 'How is Pick<T,K> related to indexed access?',
      answerHint: '{ [P in K]: T[P] } — mapped type using T[P].',
    },
  ],
  flashcards: [
    { front: 'T[K]', back: 'Type of property K on T' },
    { front: 'User["a" | "b"]', back: 'Union of User[a] and User[b] types' },
    { front: 'Arr[number]', back: 'Element type of array' },
    { front: 'Pick connection', back: '[P in K]: T[P]' },
  ],
  quickRevision: [
    'Indexed access T[K]',
    'K = literal or keyof',
    'Generics: K extends keyof T',
    'Nested: T["a"]["b"]',
    'Arrays: T[number]',
    'Pick uses T[P] in map',
  ],
}
