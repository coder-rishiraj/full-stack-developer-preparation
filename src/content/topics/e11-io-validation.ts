import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Input/output validation for LLM apps validates user inputs and model outputs — length, schema, policy, citations, toxicity — before processing and before returning or executing actions.',
  whyExists: 'Garbage in causes crashes; garbage out corrupts DB. Validators are the contract between probabilistic model and deterministic systems.',
  mentalModel: 'Airport security both sides — scan luggage entering and packages leaving.',
  howItWorks: [
    { type: 'list', items: [
      'Input: max length, charset, file type, virus scan.',
      'Structured output: JSON Schema / Zod validation.',
      'Business rules: amounts positive, dates valid.',
      'Citation ids must exist in retrieval set.',
      'Retry with validation error or fallback on fail.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Extract order JSON → Zod fails missing sku → retry prompt with error → after 2 fails route to human queue; never INSERT invalid row.' },
  ],
  tradeoffs: {
    advantages: [
      'Data integrity and safety',
    ],
    disadvantages: [
      'Latency on retry loops',
    ],
    alternatives: [
      'Human review queue',
    ],
    whenToUse: [
      'Machine-consumed outputs and DB writes',
    ],
    whenNotToUse: [
      'Skip for read-only prose with no actions',
    ],
  },
  failureModes: [
    'Validate once never update schema',
    'Execute tool args unvalidated',
    'No fallback after max retries',
  ],
  production: {
    reliability: [
      'Shared validator library',
      'Metrics on validation_fail_rate',
    ],
    maintainability: [
      'Version schemas in repo',
    ],
  },
  interview: {
    expectations: [
      'Input + output both',
      'Retry with error',
    ],
    commonQuestions: [
      'Validate LLM I/O how?',
    ],
    followUps: [
      'Citation validation?',
    ],
    misconceptions: [
      'Structured mode enough alone',
    ],
    traps: [
      'SQL from model without allowlist',
    ],
    strongSignals: [
      'Zod + business rules + retry + fallback',
    ],
  },
  keyTakeaways: [
    'Validate input and output',
    'Schema + business rules',
    'Retry with error context',
    'Fallback after max fails',
    'Never trust tool args raw',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why I/O validation?', answerHint: 'Protect systems from malformed, unsafe, or hallucinated model data.' },
    { level: 'intermediate', question: 'Validation retry loop?', answerHint: 'Send model the Zod error; bounded retries; then fallback.' },
    { level: 'advanced', question: 'Grounded citation check?', answerHint: 'Claim must reference chunk id from retrieval set; optional NLI.' },
  ],
  flashcards: [
    { front: 'Zod validate', back: 'Runtime TypeScript schema check on JSON output' },
    { front: 'Validation retry', back: 'Re-prompt with specific schema error message' },
    { front: 'Input length cap', back: 'Reject oversized prompts before token cost' },
  ],
  quickRevision: [
    'Validate in+out',
    'Zod/schema',
    'Retry w/ error',
    'Fallback queue',
    'Tool arg validate',
  ],
}
