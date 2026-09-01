import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'An iterator is an object with next() returning {value, done}. Iterables expose Symbol.iterator() producing an iterator — consumed by for...of, spread, destructuring.',
  whyExists: 'Uniform protocol lets any custom collection work with language constructs. Separates traversal logic from data structure.',
  mentalModel: 'Hand crank: each next() gives one item until done:true. Iterable is factory; iterator is cursor.',
  howItWorks: [
    { type: 'list', items: [
      'Symbol.iterator method on iterable returns fresh iterator',
      'next() returns {value, done}',
      'for...of calls iterator internally',
      'Manual iterables: { [Symbol.iterator]() { return this; }, next() {...} }',
      'Generators are syntactic sugar for iterators',
    ] },
  ],
  example: [
    { type: 'code', language: 'javascript', code: 'const it = [1,2][Symbol.iterator]();\nit.next(); // {value:1,done:false}' },
  ],
  tradeoffs: {
    advantages: [
      'Language-level consumption',
      'Custom traversal order',
      'Lazy sequences',
    ],
    disadvantages: [
      'Verbose without generators',
      'Iterator exhaustion — need new iterable',
    ],
    alternatives: [
      'Index loops',
      'Generators',
    ],
    whenToUse: [
      'Custom collections',
      'Tree/graph walks',
    ],
    whenNotToUse: [
      'Hot paths where index loop faster',
    ],
  },
  failureModes: [
    'Reusing exhausted iterator',
    'Mutating collection during iteration',
  ],
  production: {
    performance: [
      'Iterator vs index loop negligible unless micro-opt',
    ],
    maintainability: [
      'Implement Symbol.iterator on public collections',
    ],
  },
  interview: {
    expectations: [
      'Iterator protocol fields',
      'Iterable vs iterator difference',
    ],
    commonQuestions: [
      'Explain Iterators',
    ],
    followUps: [
      'Real-world use?',
    ],
    misconceptions: [
      'Superficial definition only',
    ],
    traps: [
      'Common pitfall in iterators',
    ],
    strongSignals: [
      'Protocol powers for...of',
      'Map/Set implement iterable',
      'Iterator helpers ES2024',
    ],
  },
  keyTakeaways: [
    'Protocol powers for...of',
    'Map/Set implement iterable',
    'Iterator helpers ES2024',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Iterator vs iterable?', answerHint: 'Iterable has Symbol.iterator; iterator has next().' },
    { level: 'intermediate', question: 'Can you reuse iterator?', answerHint: 'Exhausted — call Symbol.iterator again for fresh cursor.' },
    { level: 'advanced', question: 'Implement range iterable?', answerHint: 'Return object with next incrementing until end.' },
  ],
  flashcards: [
    { front: 'Symbol.iterator', back: 'Well-known key returning iterator factory' },
    { front: 'done:true', back: 'Signals iteration complete' },
  ],
  quickRevision: [
    'next() → {value,done}',
    'Symbol.iterator on iterable',
    'for...of uses protocol',
    'Generators implement iterator',
    'Fresh iterator per loop',
  ],
}
