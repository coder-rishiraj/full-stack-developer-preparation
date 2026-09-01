import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Vector similarity scores how close two embeddings are — cosine, dot product, Euclidean — ranking retrieval candidates for semantic search.',
  whyExists: 'Search needs ordering by relevance. Picking wrong metric or threshold breaks RAG recall and precision.',
  mentalModel: 'Sort friends by closeness on map. Metric is ruler; threshold is how close counts as match.',
  howItWorks: [
    { type: 'list', items: [
      'Cosine: direction similarity — default text.',
      'Dot product: magnitude-sensitive if not normalized.',
      'Euclidean (L2): geometric distance in space.',
      'Threshold tuning on eval set — domain specific.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Top-20 by cosine; discard below 0.72 similarity threshold calibrated on golden queries to reduce noise.' },
  ],
  tradeoffs: {
    advantages: [
      'Simple ranking signal',
    ],
    disadvantages: [
      'Absolute scores not calibrated across models',
    ],
    alternatives: [
      'Cross-encoder rerank on top-k',
    ],
    whenToUse: [
      'First-stage retrieval',
    ],
    whenNotToUse: [
      'Final relevance without rerank on critical apps',
    ],
  },
  failureModes: [
    'Wrong metric vs index',
    'Fixed threshold across domains',
    'Ignoring score calibration shift after model change',
  ],
  production: {
    reliability: [
      'Eval threshold per collection',
      'Rerank top candidates',
    ],
    observability: [
      'Track score distribution drift',
    ],
  },
  interview: {
    expectations: [
      'Cosine default',
      'Threshold tuning',
    ],
    commonQuestions: [
      'Similarity metrics?',
      'Set threshold how?',
    ],
    followUps: [
      'Bi-encoder vs cross-encoder?',
    ],
    misconceptions: [
      '0.8 universal good threshold',
    ],
    traps: [
      'L2 when indexed cosine',
    ],
    strongSignals: [
      'Eval-based threshold + rerank',
    ],
  },
  keyTakeaways: [
    'Cosine default for text',
    'Match index metric',
    'Threshold from eval',
    'Bi-encoder first stage',
    'Rerank for precision',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Common text similarity?', answerHint: 'Cosine similarity on embedding vectors.' },
    { level: 'intermediate', question: 'Tune similarity threshold?', answerHint: 'Golden queries; precision/recall curve; per collection.' },
    { level: 'advanced', question: 'Bi vs cross-encoder?', answerHint: 'Bi: embed separately fast; cross: joint encode accurate slow — rerank pipeline.' },
  ],
  flashcards: [
    { front: 'Bi-encoder', back: 'Separate query/doc embed — fast retrieval' },
    { front: 'Cross-encoder', back: 'Joint encode pair — accurate reranking' },
    { front: 'Similarity threshold', back: 'Minimum score to include chunk in RAG' },
  ],
  quickRevision: [
    'Cosine default',
    'Metric match index',
    'Eval threshold',
    'Bi-encoder retrieve',
    'Cross rerank',
  ],
}
