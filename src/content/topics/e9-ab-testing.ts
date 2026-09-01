import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'A/B testing for LLM products compares prompt versions, models, or retrieval configs on live traffic — measuring quality, latency, and cost with statistical rigor.',
  whyExists: 'Offline eval misses real user distribution. Controlled experiments validate improvements before full rollout.',
  mentalModel: 'Two recipes served randomly — measure satisfaction and cost per recipe before menu change.',
  howItWorks: [
    { type: 'list', items: [
      'Split traffic by user hash to variant A/B.',
      'Primary metric: task success, thumbs up, grounded rate.',
      'Guardrails: latency, cost, safety incident rate.',
      'Run until statistical significance or max duration.',
      'Log variant id on every response for analysis.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: '50% prompt_v2 with stricter citations; after 10K requests v2 +8% grounded rate, same latency — ship v2; v2 +15% cost — reject or tune.' },
  ],
  tradeoffs: {
    advantages: [
      'Evidence-based ship',
      'Catches surprise regressions',
    ],
    disadvantages: [
      'Slower iteration',
      'Needs traffic volume',
    ],
    alternatives: [
      'Shadow traffic offline',
    ],
    whenToUse: [
      'Material prompt/model changes',
    ],
    whenNotToUse: [
      'Tiny traffic cannot reach significance',
    ],
  },
  failureModes: [
    'Peeking and early stop bias',
    'Multiple metrics without correction',
    'Variant leak via cache',
  ],
  production: {
    observability: [
      'Experiment dashboard',
      'Variant tagged logs',
    ],
    reliability: [
      'Kill switch for bad variant',
    ],
    cost: [
      'Monitor $ per variant',
    ],
  },
  interview: {
    expectations: [
      'Hash split',
      'Guardrail metrics',
    ],
    commonQuestions: [
      'A/B test LLM feature?',
    ],
    followUps: [
      'Sample size?',
    ],
    misconceptions: [
      '100 users enough always',
    ],
    traps: [
      'Change variant mid experiment',
    ],
    strongSignals: [
      'Primary+guardrails + fixed duration + variant log',
    ],
  },
  keyTakeaways: [
    'Hash-stable user split',
    'Primary and guardrail metrics',
    'Log variant everywhere',
    'Avoid peeking bias',
    'Need sufficient traffic',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LLM A/B testing?', answerHint: 'Compare prompts/models on live traffic with metrics.' },
    { level: 'intermediate', question: 'Guardrail metrics?', answerHint: 'Latency, cost, safety — must not regress while quality improves.' },
    { level: 'advanced', question: 'Interleaving vs A/B?', answerHint: 'Interleaving compares two answers same user; more sensitive, UX complexity.' },
  ],
  flashcards: [
    { front: 'Variant id', back: 'Logged on each response for experiment analysis' },
    { front: 'Guardrail metric', back: 'Secondary metric that must not worsen' },
    { front: 'Peeking bias', back: 'Stopping early when random noise looks like win' },
  ],
  quickRevision: [
    'Hash split',
    'Primary metric',
    'Guardrails',
    'Variant logs',
    'Significance',
  ],
}
