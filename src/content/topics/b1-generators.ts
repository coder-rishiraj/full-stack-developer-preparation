import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Generator functions (function*) yield values lazily one at a time, pausing execution between yields. They implement the iterable protocol via yield and return.',
  whyExists: 'Eager arrays materialize entire sequences in memory. Generators stream infinite or large sequences, pipeline transformations, and simplify async iteration patterns.',
  mentalModel: 'Pause/resume coroutine: call next() runs until yield, returns {value, done}. Each yield saves stack frame — lazy pipeline not bulk allocation.',
  howItWorks: [
    { type: 'list', items: [
      'function* defines generator; yields produce values',
      'next() resumes; return ends with done:true',
      'for...of consumes iterables including generators',
      'yield* delegates to another iterable',
      'Generators are both iterable and iterator',
    ] },
  ],
  example: [
    { type: 'code', language: 'javascript', code: 'function* range(n) {\n  for (let i = 0; i < n; i++) yield i;\n}\nconst g = range(3);\ng.next(); // {value:0,done:false}' },
  ],
  tradeoffs: {
    advantages: [
      'Lazy evaluation saves memory',
      'Composable pipelines with yield*',
      'Infinite sequences possible',
    ],
    disadvantages: [
      'Cannot index arbitrary position without advancing',
      'Debugging harder with suspended state',
    ],
    alternatives: [
      'Array methods',
      'Async generators for streams',
    ],
    whenToUse: [
      'Large/infinite sequences',
      'Custom iterables',
    ],
    whenNotToUse: [
      'When simple array suffices',
    ],
  },
  failureModes: [
    'Forgetting generator not array — no .map without wrapping',
    'Not calling .return() on early break leaks finally blocks',
  ],
  production: {
    performance: [
      'Prefer generators for streaming parsers',
    ],
    maintainability: [
      'Name generator functions clearly *suffix optional',
    ],
  },
  interview: {
    expectations: [
      'Define generator vs iterator',
      'Explain lazy evaluation benefit',
    ],
    commonQuestions: [
      'Explain Generators',
    ],
    followUps: [
      'Real-world use?',
    ],
    misconceptions: [
      'Superficial definition only',
    ],
    traps: [
      'Common pitfall in generators',
    ],
    strongSignals: [
      'Generators enable lazy IO',
      'yield* delegation',
      'Generator.return/throw',
    ],
  },
  keyTakeaways: [
    'Generators enable lazy IO',
    'yield* delegation',
    'Generator.return/throw',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What does yield do?', answerHint: 'Pauses fn, returns value to consumer via next().' },
    { level: 'intermediate', question: 'Generator vs array?', answerHint: 'Lazy O(1) memory vs eager materialization.' },
    { level: 'advanced', question: 'Use case for infinite generator?', answerHint: 'ID stream, paginated API walk without loading all.' },
  ],
  flashcards: [
    { front: 'function*', back: 'Declares generator function' },
    { front: 'Lazy', back: 'Values produced on demand not upfront' },
  ],
  quickRevision: [
    'function* + yield',
    'Lazy iterable',
    'next() pause/resume',
    'yield* delegate',
    'Not a real array',
  ],
}
