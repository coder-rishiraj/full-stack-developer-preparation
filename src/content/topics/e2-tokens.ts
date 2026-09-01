import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Tokens are the atomic units LLMs read and generate — typically subword pieces not whole words. Billing, context limits, and latency all measured in tokens.',
  whyExists: 'Unified unit for model I/O, pricing, and memory. Misunderstanding tokens causes budget overruns and truncated prompts.',
  mentalModel: 'Model alphabet pieces. Hello may be 1 token; antidisestablishmentarianism may be many. You pay per piece processed.',
  howItWorks: [
    { type: 'list', items: [
      'Input tokens: prompt + system + history + RAG.',
      'Output tokens: completion; often billed higher.',
      'Context window caps total input+output.',
      '~0.75 words/token English rough; code/json differs.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: '2K token system prompt + 6K RAG + 1K user + 1K max output must fit 8K window — 2K headroom or error.' },
  ],
  tradeoffs: {
    advantages: [
      'Precise cost/limit accounting',
    ],
    disadvantages: [
      'Non-intuitive vs words/chars',
    ],
    alternatives: [
      'Provider token counting APIs',
    ],
    whenToUse: [
      'Every LLM cost estimate',
    ],
    whenNotToUse: [
      'Do not use word count for billing math',
    ],
  },
  failureModes: [
    'Underestimating output tokens',
    'Huge JSON in prompt',
    'No tokenizer in CI budget checks',
  ],
  production: {
    cost: [
      'Token budgets per user/request',
      'Cache repeated system prompt tokens where supported',
    ],
    observability: [
      'Log input/output token counts per route',
    ],
  },
  interview: {
    expectations: [
      'Input vs output',
      'Billing unit',
    ],
    commonQuestions: [
      'What is a token?',
    ],
    followUps: [
      'Estimate cost?',
    ],
    misconceptions: [
      'Token = word',
    ],
    traps: [
      'Ignore output token reserve',
    ],
    strongSignals: [
      'Count with model tokenizer',
      'Budget allocator',
    ],
  },
  keyTakeaways: [
    'Subword billing unit',
    'Input + output both count',
    'Model-specific counts',
    'Reserve output budget',
    'Use official counter',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'LLM token?', answerHint: 'Subword piece; unit of model I/O and pricing.' },
    { level: 'intermediate', question: '8K window planning?', answerHint: 'Sum system, RAG, history, user, max completion tokens.' },
    { level: 'advanced', question: 'Prompt caching savings?', answerHint: 'Providers discount repeated prefix tokens — structure prompts with stable system prefix.' },
  ],
  flashcards: [
    { front: 'Input tokens', back: 'All prompt content sent to model' },
    { front: 'Output tokens', back: 'Generated completion tokens — often priced higher' },
    { front: 'Context limit', back: 'Max input+output tokens per request' },
  ],
  quickRevision: [
    'Subword unit',
    'Input+output billed',
    'Per-model count',
    'Reserve completion',
    'Budget middleware',
  ],
}
