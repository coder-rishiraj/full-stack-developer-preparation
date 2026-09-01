import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'infer keyword inside conditional types declares a type variable to capture from matched position — extract function return type, promise unwrap, tuple element types.',
  whyExists: 'Need to parse/compute types from existing types without manual duplication. infer lets compiler pattern-match type structure.',
  mentalModel: 'Regex capture group for types: if shape matches, bind captured part to infer U.',
  howItWorks: [
    { type: 'list', items: [
      'Only valid in extends clause of conditional type',
      'infer U captures matched subtype',
      'Multiple infer in same clause allowed',
      'ReturnType<T> = T extends (...args: any) => infer R ? R : never',
      'Can infer in contravariant positions with care',
    ] },
  ],
  example: [
    { type: 'code', language: 'typescript', code: 'type ElementType<T> = T extends (infer E)[] ? E : T;\ntype X = ElementType<string[]>; // string', caption: 'Extract array element' },
  ],
  tradeoffs: {
    advantages: [
      'DRY type extraction',
      'Enables advanced utilities',
    ],
    disadvantages: [
      'Opaque errors when match fails',
    ],
    alternatives: [
      'Manual generic params',
    ],
    whenToUse: [
      'ReturnType, Parameters, Awaited',
    ],
    whenNotToUse: [
      'When explicit generic simpler',
    ],
  },
  failureModes: [
    'infer never matches → never branch',
    'Covariant infer in function params pitfalls',
  ],
  production: {
    maintainability: [
      'Reuse built-in Awaited/ReturnType before custom infer',
    ],
  },
  interview: {
    expectations: [
      'infer in conditional types',
      'ReturnType implementation',
    ],
    commonQuestions: [
      'How does infer work?',
    ],
    followUps: [
      'Implement UnwrapPromise?',
    ],
    misconceptions: [
      'Runtime variable',
    ],
    traps: [
      'infer outside extends clause',
    ],
    strongSignals: [
      'Can write ReturnType from scratch',
    ],
  },
  keyTakeaways: [
    'infer captures in extends match',
    'Powers ReturnType/Awaited',
    'Only inside conditional extends',
    'Fails to never if no match',
    'Multiple infer supported',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Where is infer allowed?', answerHint: 'In extends clause of conditional type.' },
    { level: 'intermediate', question: 'Implement ReturnType?', answerHint: 'T extends (...args:any)=>infer R ? R : never.' },
    { level: 'advanced', question: 'Unwrap nested Promise?', answerHint: 'Recursive conditional with infer R on Promise.' },
  ],
  flashcards: [
    { front: 'infer', back: 'Capture type variable from pattern match' },
    { front: 'ReturnType', back: 'Built-in using infer on function return' },
  ],
  quickRevision: [
    'infer in extends',
    'Pattern capture',
    'ReturnType idiom',
    'never if no match',
    'Recursive infer unwrap',
  ],
}
