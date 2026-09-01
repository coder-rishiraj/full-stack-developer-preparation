import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Conditional types select one of two types based on a type relationship: T extends U ? X : Y. They enable type-level if/else for generics, overload simulation, and utility type libraries.',
  whyExists: 'Generics alone cannot branch on input shape. Conditional types express API return types that depend on argument types (e.g. unwrap Promise, filter nullable).',
  mentalModel: 'Type-level ternary: compiler evaluates extends check at compile time; distributes over unions in T.',
  howItWorks: [
    { type: 'list', items: [
      'Syntax: A extends B ? C : D',
      'Distributive when T is naked type parameter: Union<T> distributes',
      'Wrap in tuple [T] extends [U] to disable distribution',
      'Combine with infer for extracting inner types',
      'Often nested for multi-branch logic',
    ] },
  ],
  example: [
    { type: 'code', language: 'typescript', code: 'type IsString<T> = T extends string ? true : false;\ntype A = IsString<\'hi\'>; // true\ntype B = IsString<number>; // false', caption: 'Simple conditional' },
  ],
  tradeoffs: {
    advantages: [
      'Precise dependent types',
      'Powers Exclude/Extract utilities',
    ],
    disadvantages: [
      'Hard to read/debug',
      'Instantiations can slow tsc',
    ],
    alternatives: [
      'Function overloads',
      'Runtime checks only',
    ],
    whenToUse: [
      'Library typings',
      'Type-safe wrappers',
    ],
    whenNotToUse: [
      'Simple fixed return types',
    ],
  },
  failureModes: [
    'Unexpected union distribution',
    'Infinite recursion in nested conditionals',
    'any disables extends checks',
  ],
  production: {
    maintainability: [
      'Alias complex conditionals with descriptive names',
      'Add comment examples for distributive cases',
    ],
  },
  interview: {
    expectations: [
      'extends ternary syntax',
      'Distribution behavior',
    ],
    commonQuestions: [
      'What is T extends U ? X : Y?',
    ],
    followUps: [
      'Distributive conditional types?',
    ],
    misconceptions: [
      'Runtime if statement',
    ],
    traps: [
      'Union distribution surprise',
    ],
    strongSignals: [
      'Mentions infer, distributive, utility types',
    ],
  },
  keyTakeaways: [
    'Type-level if via extends',
    'Distributive over naked union T',
    'Disable with [T] extends [U]',
    'Pairs with infer',
    'Powers Exclude/Omit patterns',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Conditional type syntax?', answerHint: 'T extends U ? X : Y evaluated at compile time.' },
    { level: 'intermediate', question: 'Distributive behavior?', answerHint: 'T extends U ? X : Y maps over each union member of T.' },
    { level: 'advanced', question: 'Non-distributive trick?', answerHint: 'Wrap: [T] extends [U] ? X : Y.' },
  ],
  flashcards: [
    { front: 'Conditional type', back: 'T extends U ? X : Y type selection' },
    { front: 'Distributive', back: 'Union T splits into per-member conditionals' },
  ],
  quickRevision: [
    'extends ? :',
    'Compile-time branch',
    'Union distributes',
    '[T] disable distribute',
    'Use with infer',
  ],
}
