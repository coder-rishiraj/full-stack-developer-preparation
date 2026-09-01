import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Model routing selects which LLM handles each request based on task type, complexity, cost tier, latency SLO, and tenant policy — often via classifier, rules, or cascade.',
  whyExists: 'One frontier model for all traffic is expensive and slow. Routing sends easy tasks to mini models and hard tasks to reasoning models.',
  mentalModel: 'Triage nurse — routine cases to clinic, trauma to specialist.',
  howItWorks: [
    { type: 'list', items: [
      'Rule-based: route /extract → mini, /analyze → frontier.',
      'Classifier model or heuristics on query length/intent.',
      'Cascade: try mini; escalate if confidence low.',
      'Tenant overrides in config DB.',
      'Log route decision for eval and cost.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Gateway reads feature header: support_tier1 → gpt-4o-mini; legal_review → gpt-4o + reranker; enterprise tenant flag forces EU-hosted model.' },
  ],
  tradeoffs: {
    advantages: [
      'Cost and latency optimization',
      'Policy per tenant',
    ],
    disadvantages: [
      'Misroute hurts quality',
      'Router maintenance',
    ],
    alternatives: [
      'User picks model',
      'Single model simplicity',
    ],
    whenToUse: [
      'Multi-feature LLM platform',
    ],
    whenNotToUse: [
      'Single homogeneous use case',
    ],
  },
  failureModes: [
    'Classifier drift',
    'Escalation never triggers',
    'Wrong model for tool schema',
  ],
  production: {
    cost: [
      'Track quality/$ per route',
    ],
    reliability: [
      'Feature-flag route tables',
    ],
    observability: [
      'route_decision on spans',
    ],
  },
  interview: {
    expectations: [
      'Rules vs cascade',
      'Metrics per route',
    ],
    commonQuestions: [
      'Design model router?',
    ],
    followUps: [
      'Cascade escalation?',
    ],
    misconceptions: [
      'Router must be ML',
    ],
    traps: [
      'No eval per route',
    ],
    strongSignals: [
      'Config routes + cascade + golden eval',
    ],
  },
  keyTakeaways: [
    'Route by task and tenant',
    'Cascade cheap → expensive',
    'Log route decisions',
    'Eval per route',
    'Feature-flag table',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Model routing?', answerHint: 'Pick LLM per request based on task, cost, latency, policy.' },
    { level: 'intermediate', question: 'Cascade pattern?', answerHint: 'Try mini model; escalate to frontier on low confidence or validation fail.' },
    { level: 'advanced', question: 'Safe route change?', answerHint: 'Shadow traffic, A/B on golden set, rollback flag.' },
  ],
  flashcards: [
    { front: 'Model cascade', back: 'Cheap model first; escalate if needed' },
    { front: 'Route table', back: 'Config mapping feature/intent → model id' },
    { front: 'Misroute', back: 'Wrong tier causes quality or cost failure' },
  ],
  quickRevision: [
    'Rule+cascade',
    'Per-tenant config',
    'Log decision',
    'Eval routes',
    'Feature flags',
  ],
}
