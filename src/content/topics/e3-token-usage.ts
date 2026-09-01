import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Token usage tracks input and output tokens consumed per API call — basis for billing, budgeting, and observability. Returned in response usage object.',
  whyExists: 'Without metering, costs explode silently. Product teams need per-user budgets and finance needs chargeback.',
  mentalModel: 'Electric meter on every call. Log kWh (tokens) to bill and cap overuse.',
  howItWorks: [
    { type: 'list', items: [
      'usage.prompt_tokens, completion_tokens, total_tokens.',
      'Aggregate per user, tenant, feature route.',
      'Pre-flight estimate with tokenizer.',
      'Alerts on anomaly spikes.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Middleware logs usage to DB; dashboard shows top tenants by tokens; block user over daily 100K cap.' },
  ],
  tradeoffs: {
    advantages: [
      'Cost control',
      'Capacity planning',
    ],
    disadvantages: [
      'Overhead logging',
      'Estimate vs actual gap',
    ],
    alternatives: [
      'Flat pricing ignore metering',
    ],
    whenToUse: [
      'All prod LLM features',
    ],
    whenNotToUse: [
      'Dev without any logging OK briefly',
    ],
  },
  failureModes: [
    'No per-tenant tracking',
    'Ignore output token growth',
    'Missing usage on stream finish event',
  ],
  production: {
    cost: [
      'Budgets and alerts',
      'Chargeback reports',
    ],
    observability: [
      'Tokens per request metric',
      'Cost = tokens × price table',
    ],
  },
  interview: {
    expectations: [
      'Input vs output billing',
      'Budget design',
    ],
    commonQuestions: [
      'Track LLM cost how?',
    ],
    followUps: [
      'Per-user limits?',
    ],
    misconceptions: [
      'Only input billed',
    ],
    traps: [
      'No logging on streaming',
    ],
    strongSignals: [
      'usage object + dashboards + caps',
    ],
  },
  keyTakeaways: [
    'Log usage every call',
    'Input + output billed',
    'Per-tenant budgets',
    'Pre-count when possible',
    'Stream: usage on finish',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'usage object fields?', answerHint: 'prompt_tokens, completion_tokens, total_tokens.' },
    { level: 'intermediate', question: 'User budget enforcement?', answerHint: 'Middleware sums daily tokens; reject or downgrade over cap.' },
    { level: 'advanced', question: 'Cost attribution?', answerHint: 'Tags on requests: tenant, feature, model; × price table.' },
  ],
  flashcards: [
    { front: 'prompt_tokens', back: 'Input side token count' },
    { front: 'completion_tokens', back: 'Generated output tokens — often pricier' },
    { front: 'Token budget', back: 'Cap usage per user/tenant/period' },
  ],
  quickRevision: [
    'Log usage',
    'In+out billed',
    'Tenant caps',
    'Pre-count',
    'Stream finish event',
  ],
}
