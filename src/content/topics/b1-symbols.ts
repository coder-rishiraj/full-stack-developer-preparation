import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Symbol is a primitive type for unique property keys — Symbol() or well-known Symbol.* (iterator, toStringTag) avoid name collisions on objects.',
  whyExists: 'String keys collide across libraries. Symbols create guaranteed-unique keys for metadata, protocols, and pseudo-private fields.',
  mentalModel: 'Unique stamp: each Symbol() !== any other; well-known symbols are shared protocol hooks.',
  howItWorks: [
    { type: 'list', items: [
      'Symbol(\'desc\') always unique',
      'Not enumerable in Object.keys — use getOwnPropertySymbols',
      'Well-known: Symbol.iterator, Symbol.toStringTag, Symbol.hasInstance',
      'Global registry: Symbol.for(key) shared',
      'Cannot coerce with + or implicit string without String()',
    ] },
  ],
  example: [
    { type: 'code', language: 'javascript', code: 'const ID = Symbol(\'id\');\nobj[ID] = 42;\nObject.keys(obj); // [] — symbol not listed' },
  ],
  tradeoffs: {
    advantages: [
      'Collision-free metadata keys',
      'Define language protocols',
      'Semi-private properties',
    ],
    disadvantages: [
      'Not true privacy — still accessible via getOwnPropertySymbols',
      'Serialization skips symbols by default',
    ],
    alternatives: [
      'WeakMap for private data',
      'Private class fields #',
    ],
    whenToUse: [
      'Library extensibility',
      'Custom iteration/toStringTag',
    ],
    whenNotToUse: [
      'When string key fine',
    ],
  },
  failureModes: [
    'Assuming Symbol.for creates unique each call — it reuses global',
    'JSON.stringify drops symbol props silently',
  ],
  production: {
    maintainability: [
      'Document well-known symbol usage on public APIs',
    ],
  },
  interview: {
    expectations: [
      'Symbol uniqueness',
      'Well-known symbols list',
    ],
    commonQuestions: [
      'Explain Symbols',
    ],
    followUps: [
      'Real-world use?',
    ],
    misconceptions: [
      'Superficial definition only',
    ],
    traps: [
      'Common pitfall in symbols',
    ],
    strongSignals: [
      'Powers iterable protocol',
      'Symbol.for global registry',
    ],
  },
  keyTakeaways: [
    'Powers iterable protocol',
    'Symbol.for global registry',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Are two Symbol(\'x\') equal?', answerHint: 'No — each call creates unique value.' },
    { level: 'intermediate', question: 'Why not enumerable?', answerHint: 'Hidden from normal iteration; protocol/metadata use.' },
    { level: 'advanced', question: 'Symbol.for vs Symbol()?', answerHint: 'for returns global registered symbol; () always new.' },
  ],
  flashcards: [
    { front: 'Symbol.iterator', back: 'Method key making object iterable' },
    { front: 'Symbol.for', back: 'Global symbol registry lookup/create' },
  ],
  quickRevision: [
    'Unique property keys',
    'Not in Object.keys',
    'Well-known protocol symbols',
    'Symbol.for global',
    'JSON skips symbols',
  ],
}
