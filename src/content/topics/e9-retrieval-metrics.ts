import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Retrieval metrics evaluate search quality — recall@k, precision@k, MRR, nDCG — whether relevant documents appear in top-k retrieved chunks for RAG.',
  whyExists: 'Bad retrieval caps generation quality. Measure finder before blaming LLM.',
  mentalModel: 'Library catalog search: did right book appear in first k results?',
  howItWorks: [
    { type: 'list', items: [
      'Label qrels query→relevant doc ids',
      'recall@k: fraction relevant in top k',
      'MRR: mean reciprocal rank of first hit',
      'nDCG: graded relevance position weighted',
      'Evaluate per query category',
    ] },
  ],
  example: [
    { type: 'code', language: 'python', code: '# recall@5 = |relevant ∩ top5| / |relevant|\n# MRR = mean(1/rank_first_relevant)' },
  ],
  tradeoffs: {
    advantages: [
      'Diagnose RAG bottlenecks',
      'Tune chunking and index',
    ],
    disadvantages: [
      'Labeling cost',
      'Metrics ignore generation',
    ],
    alternatives: [
      'End-to-end answer only eval',
      'Manual spot check',
    ],
    whenToUse: [
      'RAG pipeline tuning',
    ],
    whenNotToUse: [
      'Non-retrieval tasks',
    ],
  },
  failureModes: [
    'High recall wrong chunks noisy context',
    'Optimizing recall@1 only',
    'Test set leakage in chunk params',
  ],
  production: {
    observability: [
      'Log retrieval ids per query in prod sample',
    ],
  },
  interview: {
    expectations: [
      'recall@k MRR nDCG',
      'Separate from generation',
    ],
    commonQuestions: [
      'Explain Retrieval Metrics',
    ],
    followUps: [
      'How in CI?',
    ],
    misconceptions: [
      'One metric enough',
    ],
    traps: [
      'Eval only happy path',
    ],
    strongSignals: [
      'recall@k precision@k',
      'MRR first relevant rank',
      'nDCG graded',
    ],
  },
  keyTakeaways: [
    'recall@k precision@k',
    'MRR first relevant rank',
    'nDCG graded',
    'Label qrels',
    'Per-category',
    'Tune retrieval before LLM',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'recall@k?', answerHint: 'Fraction of relevant docs found in top k retrieved.' },
    { level: 'intermediate', question: 'MRR?', answerHint: 'Average 1/rank of first relevant result.' },
    { level: 'advanced', question: 'Good retrieval bad answers?', answerHint: 'Groundedness/generation issue; chunk size; prompt.' },
  ],
  flashcards: [
    { front: 'recall@k', back: 'Relevant retrieved in top k over all relevant' },
    { front: 'nDCG', back: 'Discounted cumulative gain for graded relevance' },
  ],
  quickRevision: [
    'recall@k',
    'precision@k',
    'MRR',
    'nDCG',
    'qrels labels',
    'Fix retrieval first',
  ],
}
