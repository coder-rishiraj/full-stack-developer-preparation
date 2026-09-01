import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Few-shot prompting includes example input-output pairs in the prompt to teach format, style, or task pattern without weight updates.',
  whyExists: 'Many tasks need consistent format — classification labels, JSON shape, tone — examples cheaper than fine-tuning for small pattern sets.',
  mentalModel: 'Show homework examples before the test question. Model mimics pattern from demonstrations.',
  howItWorks: [
    { type: 'list', items: [
      'Include 2–5 diverse high-quality examples.',
      'Same format as expected real output.',
      'Order matters — recency bias on last example.',
      'Costs tokens — balance vs system clarity.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Sentiment task: two labeled reviews in prompt, then new review to classify — model follows label format.' },
  ],
  tradeoffs: {
    advantages: [
      'No training',
      'Quick iteration',
    ],
    disadvantages: [
      'Token cost',
      'Bad examples teach bad habits',
    ],
    alternatives: [
      'Fine-tune',
      'Structured output schema',
    ],
    whenToUse: [
      'Format-heavy extraction',
      'Nuanced tone matching',
    ],
    whenNotToUse: [
      'When schema mode sufficient alone',
    ],
  },
  failureModes: [
    'Contradictory examples',
    'Too many shots eat context',
    'Examples not representative',
  ],
  production: {
    cost: [
      'Minimize shots when schema works',
      'Cache static few-shot prefix',
    ],
    reliability: [
      'Curate examples from prod failures',
    ],
  },
  interview: {
    expectations: [
      'When useful',
      'Token cost',
    ],
    commonQuestions: [
      'Few-shot vs zero-shot?',
    ],
    followUps: [
      'How many examples?',
    ],
    misconceptions: [
      'More shots always better',
    ],
    traps: [
      '10 noisy examples',
    ],
    strongSignals: [
      '2-5 diverse',
      'Schema + 1 example',
    ],
  },
  keyTakeaways: [
    'Examples in prompt not weights',
    'Teach format and style',
    '2-5 quality examples',
    'Costs tokens',
    'Combine with structured output',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Few-shot prompting?', answerHint: 'Include example I/O pairs in prompt to guide model.' },
    { level: 'intermediate', question: 'When skip few-shot?', answerHint: 'Strong schema/structured mode or fine-tuned model.' },
    { level: 'advanced', question: 'Example selection strategy?', answerHint: 'Dynamic retrieval of similar solved examples from library.' },
  ],
  flashcards: [
    { front: 'Zero-shot', back: 'Instruction only, no examples' },
    { front: 'Few-shot', back: 'Small set of demonstrations in prompt' },
    { front: 'Recency bias', back: 'Last examples disproportionately influence output' },
  ],
  quickRevision: [
    'Examples in prompt',
    '2-5 quality',
    'Token cost',
    'Schema alternative',
    'Dynamic example retrieval',
  ],
}
