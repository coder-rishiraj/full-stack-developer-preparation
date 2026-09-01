import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'The cost/latency/quality triangle: bigger models and longer context improve answer quality but increase price and response time. Production routing picks the right point per request.',
  whyExists: 'Using GPT-4-class for every autocomplete burns budget. Architects must tier models, cache, and compress context to hit SLOs.',
  mentalModel: 'Fast cheap good — pick two per path. Route easy queries to mini models; escalate hard ones.',
  howItWorks: [
    { type: 'list', items: [
      'Smaller models: lower $/token, faster, weaker reasoning.',
      'Long prompts: higher input cost and latency.',
      'Caching stable prefixes reduces repeated spend.',
      'Cascade: classifier → small model → fallback large.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'FAQ bot: gpt-4o-mini for 90% queries; escalate to gpt-4o when confidence low or user selects expert mode.' },
  ],
  tradeoffs: {
    advantages: [
      'Optimizes unit economics',
      'Meets p99 latency',
    ],
    disadvantages: [
      'Routing errors downgrade quality',
      'Complexity in gateway',
    ],
    alternatives: [
      'Single model simplicity',
      'Self-host small model',
    ],
    whenToUse: [
      'Any multi-tenant LLM product',
    ],
    whenNotToUse: [
      'Prototype only — single model OK briefly',
    ],
  },
  failureModes: [
    'Frontier model for all traffic',
    'No token budget',
    'Ignoring p99 latency',
  ],
  production: {
    cost: [
      'Per-route model map',
      'Token budgets',
    ],
    performance: [
      'Streaming improves perceived latency',
    ],
    observability: [
      'Cost and latency per route dashboards',
    ],
  },
  interview: {
    expectations: [
      'Triangle tradeoff',
      'Routing example',
    ],
    commonQuestions: [
      'Cost vs quality?',
    ],
    followUps: [
      'Model cascade design?',
    ],
    misconceptions: [
      'Best model always',
    ],
    traps: [
      'One model everywhere',
    ],
    strongSignals: [
      'Tiered routing + metrics',
    ],
  },
  keyTakeaways: [
    'Quality costs money and time',
    'Route by task difficulty',
    'Measure $/request and p99',
    'Cache and compress context',
    'Mini models for bulk paths',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Cost/latency/quality tradeoff?', answerHint: 'Better models/longer context cost more and run slower.' },
    { level: 'intermediate', question: 'Design tiered routing?', answerHint: 'Classifier or heuristics → cheap model; escalate on low confidence.' },
    { level: 'advanced', question: 'Optimize spend without quality drop?', answerHint: 'Prompt caching, RAG precision, distill, batch offline, eval per tier.' },
  ],
  flashcards: [
    { front: 'Model cascade', back: 'Try cheap model first; escalate if needed' },
    { front: 'p99 latency', back: 'Tail latency matters for UX SLAs' },
    { front: '$/1M tokens', back: 'Primary cost unit for LLM APIs' },
  ],
  quickRevision: [
    'Triangle tradeoff',
    'Tier routing',
    'Token budget',
    'Cache prefix',
    'Metrics per route',
  ],
}
