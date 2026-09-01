import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Output validation programmatically checks LLM responses — schema, regex, policy rules, citation presence — before returning to users or executing downstream actions.',
  whyExists: 'Models hallucinate and drift format. Validators catch bad outputs; retry or fallback instead of corrupting DB or UX.',
  mentalModel: 'Quality gate at factory exit. Reject or rework defective parts before shipping.',
  howItWorks: [
    { type: 'list', items: [
      'JSON Schema / Zod parse structured outputs.',
      'Business rules: dates future, amounts positive.',
      'Citation IDs must exist in retrieved set.',
      'Retry with error feedback to model on fail.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Extract order JSON — Zod fails on missing sku → retry prompt listing validation error → fallback human queue after 2 fails.' },
  ],
  tradeoffs: {
    advantages: [
      'Safety and data integrity',
    ],
    disadvantages: [
      'Latency on retry loops',
    ],
    alternatives: [
      'Human review queue',
    ],
    whenToUse: [
      'Any machine-consumed LLM output',
    ],
    whenNotToUse: [
      'Skip for read-only prose with no actions',
    ],
  },
  failureModes: [
    'Validate once at deploy never update',
    'Retry without telling model error',
    'No fallback path',
  ],
  production: {
    reliability: [
      'Validator library shared',
      'Metrics on fail rate',
    ],
    maintainability: [
      'Version validators with schemas',
    ],
  },
  interview: {
    expectations: [
      'Schema + business rules',
      'Retry loop',
    ],
    commonQuestions: [
      'Validate LLM output how?',
    ],
    followUps: [
      'Citation validation?',
    ],
    misconceptions: [
      'Structured mode enough',
    ],
    traps: [
      'Execute tool args unvalidated',
    ],
    strongSignals: [
      'Zod + retry + fallback + metrics',
    ],
  },
  keyTakeaways: [
    'Never trust raw output',
    'Schema and business validators',
    'Retry with error context',
    'Fallback on repeated fail',
    'Track validation failure rate',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why validate outputs?', answerHint: 'Models err; protect downstream systems and users.' },
    { level: 'intermediate', question: 'Retry on validation fail?', answerHint: 'Send model the validation error; bounded retries.' },
    { level: 'advanced', question: 'Grounded citation check?', answerHint: 'Claim must link chunk id present in retrieval set; NLI optional.' },
  ],
  flashcards: [
    { front: 'Zod validate', back: 'Runtime TypeScript schema check on JSON output' },
    { front: 'Validation retry', back: 'Re-prompt model with specific error message' },
    { front: 'Fallback queue', back: 'Human or safe default after max validation failures' },
  ],
  quickRevision: [
    'Zod/schema',
    'Business rules',
    'Retry w/ error',
    'Fallback path',
    'Metric fail rate',
  ],
}
