import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Mapped types transform properties of an existing type by iterating keys: { [K in keyof T]: ... }. They bulk rename, optionalize, or remap fields type-safely.',
  whyExists: 'Manually duplicating object shapes for Partial/Readonly variants violates DRY. Mapped types generate variants from a source type.',
  mentalModel: 'for-loop over keys at type level: each property K gets transformed expression.',
  howItWorks: [
    { type: 'list', items: [
      '{ [K in keyof T]: T[K] } identity map',
      'Modifiers: +readonly, -readonly, +?, -?',
      'Key remapping: [K in keyof T as NewKey]',
      'Combine with conditional on K or T[K]',
      'Powers Partial, Required, Pick, Record',
    ] },
  ],
  example: [
    { type: 'code', language: 'typescript', code: 'type Optional<T> = { [K in keyof T]?: T[K] };\ntype ReadonlyFields<T> = { readonly [K in keyof T]: T[K] };', caption: 'Mapped modifiers' },
  ],
  tradeoffs: {
    advantages: [
      'DRY type transforms',
      'Key remapping in TS 4.1+',
    ],
    disadvantages: [
      'Complex maps hurt readability',
      'Large unions of keys slow tsc',
    ],
    alternatives: [
      'Manual interfaces',
      'Codegen',
    ],
    whenToUse: [
      'API DTO variants',
      'Form state types',
    ],
    whenNotToUse: [
      'Unrelated object shapes',
    ],
  },
  failureModes: [
    'as clause producing duplicate keys error',
    'Mapped over non-object never',
  ],
  production: {
    maintainability: [
      'Export named mapped aliases not inline 5-level maps',
    ],
  },
  interview: {
    expectations: [
      'keyof T iteration syntax',
      'Partial/Readonly implementation',
    ],
    commonQuestions: [
      'Implement Partial<T>?',
    ],
    followUps: [
      'Key remapping with as?',
    ],
    misconceptions: [
      'Runtime object map',
    ],
    traps: [
      'Forgetting ? modifier',
    ],
    strongSignals: [
      'Writes Pick/Omit from scratch',
    ],
  },
  keyTakeaways: [
    '[K in keyof T] iterates properties',
    'Modifiers +? -readonly',
    'Key remapping via as',
    'Builds utility types',
    'Type-level only',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Mapped type syntax?', answerHint: '{ [K in keyof T]: ... } transforms each property.' },
    { level: 'intermediate', question: 'Make all props optional?', answerHint: 'Partial: { [K in keyof T]?: T[K] }.' },
    { level: 'advanced', question: 'Rename keys with prefix?', answerHint: '[K in keyof T as `get${Capitalize<string&K>}`]: T[K].' },
  ],
  flashcards: [
    { front: 'Mapped type', back: 'Transform all keys of T uniformly' },
    { front: 'key remapping', back: 'K in keyof T as NewName' },
  ],
  quickRevision: [
    'K in keyof T',
    'Partial/Readonly/Pick',
    'Modifiers +? -readonly',
    'Key remapping as',
    'Conditional in map',
  ],
}
