import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'ML learns patterns from data with algorithms on features. Deep learning uses stacked neural nets for automatic features. Generative AI produces novel content — LLMs are large generative DL models.',
  whyExists: 'Wrong tier wastes money (LLM for tabular fraud) or fails (rules for summarization). Architects must map tasks to ML, DL, or GenAI layers.',
  mentalModel: 'ML = spreadsheet wizard. DL = eyes/ears pattern machine. GenAI = writer that drafts new text from prompts.',
  howItWorks: [
    { type: 'list', items: [
      'ML: XGBoost, logistic regression on structured features.',
      'DL: CNN/Transformer encoders for raw media/text.',
      'GenAI: autoregressive LLMs, diffusion for images.',
      'Prod often hybrid: ML routes, RAG retrieves, LLM generates.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Churn prediction: ML on usage features. Ticket summarization: LLM. Image moderation: DL classifier + LLM for appeal explanation.' },
  ],
  tradeoffs: {
    advantages: [
      'Right-sized cost and latency',
      'Composable pipelines',
    ],
    disadvantages: [
      'GenAI overkill for simple classify',
      'ML cannot open-ended generate',
    ],
    alternatives: [
      'Rules for deterministic policy',
      'Templates without LLM',
    ],
    whenToUse: [
      'GenAI for language/reasoning',
      'ML for tabular at scale',
    ],
    whenNotToUse: [
      'LLM for exact arithmetic without tools',
    ],
  },
  failureModes: [
    'LLM everywhere design',
    'ML on raw PDFs without embed',
    'Treating LLM output as ground truth',
  ],
  production: {
    cost: [
      'Route easy paths to small/ML models',
    ],
    reliability: [
      'Validator after LLM step',
    ],
  },
  interview: {
    expectations: [
      'Three-way distinction',
      'When NOT LLM',
    ],
    commonQuestions: [
      'ML vs DL vs GenAI?',
    ],
    followUps: [
      'Support bot architecture?',
    ],
    misconceptions: [
      'GenAI replaces ML',
    ],
    traps: [
      'LLM for all classification',
    ],
    strongSignals: [
      'Tiered routing by task',
    ],
  },
  keyTakeaways: [
    'ML structured prediction',
    'DL representation learning',
    'GenAI generates content',
    'Hybrid prod stacks common',
    'Do not default to largest LLM',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Three differences?', answerHint: 'ML features+algos; DL neural nets; GenAI generates novel output.' },
    { level: 'intermediate', question: 'XGBoost vs GPT?', answerHint: 'Tabular labels, interpretability, cost — not open-ended language.' },
    { level: 'advanced', question: 'Hybrid fraud system?', answerHint: 'ML score; LLM explains; human edge cases.' },
  ],
  flashcards: [
    { front: 'Generative AI', back: 'Creates new content not just labels' },
    { front: 'Deep learning', back: 'Multi-layer nets learn features' },
    { front: 'When not LLM', back: 'Simple classify, exact math, strict rules' },
  ],
  quickRevision: [
    'ML=tabular',
    'DL=nets',
    'GenAI=generate',
    'Hybrid stacks',
    'Right-size model',
  ],
}
