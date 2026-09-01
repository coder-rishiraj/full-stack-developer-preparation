import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Cost tracking aggregates token usage, model pricing, embed jobs, and infra spend per tenant, feature, and request — enabling budgets, chargeback, and optimization.',
  whyExists: 'LLM bills are opaque without metering. Finance and eng need per-tenant P&L and alerts before spend runs away.',
  mentalModel: 'Electric meter per apartment — every API call logs kWh (tokens × price) tagged by unit and appliance (feature).',
  howItWorks: [
    { type: 'list', items: [
      'Parse usage.prompt_tokens and completion_tokens from provider response.',
      'Multiply by model price table; add embed and rerank costs.',
      'Tag requests: tenant_id, feature, model, environment.',
      'Roll up to dashboards and daily budgets.',
      'Anomaly alerts on spike vs baseline.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Middleware writes cost_event {tenant, route, model, in_tokens, out_tokens, usd} to ClickHouse; Grafana shows top 10 costly tenants; cap blocks over budget.' },
  ],
  tradeoffs: {
    advantages: [
      'Visibility and accountability',
      'Data-driven model routing',
    ],
    disadvantages: [
      'Instrumentation overhead',
      'Price table maintenance',
    ],
    alternatives: [
      'Flat monthly estimate only',
    ],
    whenToUse: [
      'Any production LLM product',
    ],
    whenNotToUse: [
      'Throwaway prototype with fixed spend',
    ],
  },
  failureModes: [
    'Missing stream finish usage',
    'Wrong price table model',
    'Untagged requests → unallocated spend',
  ],
  production: {
    cost: [
      'Real-time budget enforcement',
      'Chargeback reports',
    ],
    observability: [
      '$/request, $/tenant metrics',
    ],
    maintainability: [
      'Central price config versioned',
    ],
  },
  interview: {
    expectations: [
      'Token × price attribution',
      'Per-tenant',
    ],
    commonQuestions: [
      'Track LLM spend how?',
    ],
    followUps: [
      'Budget enforcement?',
    ],
    misconceptions: [
      'Provider dashboard enough for SaaS',
    ],
    traps: [
      'Ignore embed/rerank costs',
    ],
    strongSignals: [
      'Tagged events + budgets + anomaly alerts',
    ],
  },
  keyTakeaways: [
    'Log tokens × price per request',
    'Tag tenant and feature',
    'Include embed/rerank',
    'Budgets and alerts',
    'Chargeback dashboards',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LLM cost tracking basics?', answerHint: 'Record tokens per call × model price; aggregate by tenant/feature.' },
    { level: 'intermediate', question: 'Streaming cost?', answerHint: 'Usage on stream end event; bill partial if client disconnects.' },
    { level: 'advanced', question: 'Optimize from cost data?', answerHint: 'Route low-value paths to mini model; cache; compress context; show $ in admin UI.' },
  ],
  flashcards: [
    { front: 'Cost attribution', back: 'Assign spend to tenant, feature, model via request tags' },
    { front: 'Price table', back: 'Versioned $/1M tokens per model and provider' },
    { front: 'Budget cap', back: 'Reject or downgrade requests when tenant exceeds limit' },
  ],
  quickRevision: [
    'Token×price',
    'Tag tenant',
    'Stream finish usage',
    'Budget cap',
    'Anomaly alert',
  ],
}
