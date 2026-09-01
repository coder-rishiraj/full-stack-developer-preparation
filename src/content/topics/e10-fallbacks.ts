import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Fallback models are secondary LLM providers or smaller tiers invoked when primary fails — outage, 429, timeout, or quality gate — preserving availability with degraded capability.',
  whyExists: 'Single-model dependency causes total outage. Fallbacks trade peak quality for uptime and graceful degradation.',
  mentalModel: 'Spare tire — not ideal for highway speed but keeps you moving when primary flat.',
  howItWorks: [
    { type: 'list', items: [
      'Primary call with timeout; on 429/5xx/timeout → fallback chain.',
      'Cheaper/smaller model as first fallback; alternate vendor second.',
      'Circuit breaker stops hammering failing primary.',
      'User messaging when degraded mode active.',
      'Log fallback reason for postmortem.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'gpt-4o timeout 30s → gpt-4o-mini; still fail → Claude via adapter; all fail → cached FAQ or human handoff.' },
  ],
  tradeoffs: {
    advantages: [
      'Higher availability',
      '429 absorption',
    ],
    disadvantages: [
      'Quality variance',
      'Multi-vendor compliance',
    ],
    alternatives: [
      'Queue and retry primary only',
    ],
    whenToUse: [
      'Customer-facing prod',
    ],
    whenNotToUse: [
      'Internal batch where delay OK',
    ],
  },
  failureModes: [
    'Fallback also down — no tertiary plan',
    'Silent quality drop unlogged',
    'Incompatible tool schemas across models',
  ],
  production: {
    reliability: [
      'Ordered fallback list in config',
      'Circuit breaker',
    ],
    observability: [
      'fallback_rate metric',
    ],
    cost: [
      'Cheaper model in chain saves outage spend',
    ],
  },
  interview: {
    expectations: [
      'Chain + circuit breaker',
      'User comms',
    ],
    commonQuestions: [
      'Primary model down what do?',
    ],
    followUps: [
      'Cross-vendor fallback?',
    ],
    misconceptions: [
      'Same prompt works all models',
    ],
    traps: [
      'Infinite retry primary only',
    ],
    strongSignals: [
      'Config chain + metrics + degraded UX copy',
    ],
  },
  keyTakeaways: [
    'Ordered fallback chain',
    'Circuit breaker on primary',
    'Log fallback reason',
    'User-visible degraded mode',
    'Test cross-model prompts',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Fallback model purpose?', answerHint: 'Continue service when primary fails or rate limited.' },
    { level: 'intermediate', question: 'Fallback order?', answerHint: 'Same vendor smaller tier → alternate vendor → static/cached → human.' },
    { level: 'advanced', question: 'Quality guard on fallback?', answerHint: 'Eval threshold; if fallback output fails validation retry or escalate.' },
  ],
  flashcards: [
    { front: 'Fallback chain', back: 'Ordered list of models tried on primary failure' },
    { front: 'Circuit breaker', back: 'Skip failing provider temporarily' },
    { front: 'Degraded mode', back: 'Reduced capability with transparent user messaging' },
  ],
  quickRevision: [
    'Fallback chain',
    'Circuit breaker',
    'Log reason',
    'Degraded UX',
    'Multi-vendor adapter',
  ],
}
