import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Model selection chooses which LLM (size, vendor, capability) per task based on reasoning depth, context need, cost, latency, multimodal, and compliance requirements.',
  whyExists: 'Dozens of models with different price/performance. Wrong choice wastes money or fails task quality.',
  mentalModel: 'Pick vehicle: bike for short errand, truck for heavy haul. Match model to job requirements.',
  howItWorks: [
    { type: 'list', items: [
      'Evaluate on golden set per use case.',
      'Consider context window, tool support, JSON mode.',
      'Check data residency and enterprise agreements.',
      'Plan fallback model if primary down/rate-limited.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Code review: strong reasoning model. Entity extraction: mini + structured output. 1M context doc QA: long-context variant.' },
  ],
  tradeoffs: {
    advantages: [
      'Right cost/quality fit',
    ],
    disadvantages: [
      'Eval burden',
      'Vendor fragmentation',
    ],
    alternatives: [
      'Single vendor family tiers',
    ],
    whenToUse: [
      'Before production launch',
    ],
    whenNotToUse: [
      'Switching daily without eval',
    ],
  },
  failureModes: [
    'Benchmark on toy data only',
    'Ignoring tool/JSON support',
    'No fallback model',
  ],
  production: {
    reliability: [
      'Config-driven model map',
      'Feature flags for swap',
    ],
    cost: [
      'Track quality per $ by model',
    ],
  },
  interview: {
    expectations: [
      'Eval-driven choice',
      'Tier examples',
    ],
    commonQuestions: [
      'How pick model?',
    ],
    followUps: [
      'Fallback strategy?',
    ],
    misconceptions: [
      'Newest always best',
    ],
    traps: [
      'No eval set',
    ],
    strongSignals: [
      'Golden set + metrics + fallback',
    ],
  },
  keyTakeaways: [
    'Match model to task',
    'Eval on real prompts',
    'Check context and tools',
    'Plan fallback',
    'Monitor quality per model',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Model selection factors?', answerHint: 'Quality, cost, latency, context, tools, compliance.' },
    { level: 'intermediate', question: 'Mini vs frontier?', answerHint: 'Mini for high-volume simple; frontier for complex reasoning.' },
    { level: 'advanced', question: 'Safe model swap?', answerHint: 'Shadow eval, A/B, rollback flag, compare golden metrics.' },
  ],
  flashcards: [
    { front: 'Golden set', back: 'Representative prompts with expected quality bar' },
    { front: 'Fallback model', back: 'Secondary when primary unavailable or slow' },
    { front: 'Long-context model', back: 'Chosen when input exceeds standard window' },
  ],
  quickRevision: [
    'Eval-driven',
    'Task fit',
    'Context+tools',
    'Fallback plan',
    'Track $/quality',
  ],
}
