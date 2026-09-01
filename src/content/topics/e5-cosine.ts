import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Cosine similarity measures angle between vectors: dot(a,b)/(|a||b|). Range -1 to 1; for normalized embeddings equals dot product. Standard metric for semantic similarity.',
  whyExists: 'Euclidean distance biased by vector magnitude. Cosine focuses direction (meaning) not length — matches how embed models trained.',
  mentalModel: 'Two arrows from origin — small angle = similar topic regardless of arrow length if normalized.',
  howItWorks: [
    { type: 'list', items: [
      'cos(θ) = (a·b) / (||a|| ||b||).',
      'If ||a||=||b||=1, cosine = dot product.',
      'Many APIs return cosine distance = 1 - similarity.',
      'Normalize embeddings at index time for speed.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Query and doc vectors normalized; pgvector <=> operator or numpy dot ranks nearest neighbors by cosine similarity.' },
  ],
  tradeoffs: {
    advantages: [
      'Scale invariant direction',
      'Fast with normalized vectors',
    ],
    disadvantages: [
      'Ignores magnitude info rarely needed',
    ],
    alternatives: [
      'Dot product if unnormalized',
      'Euclidean on small dims',
    ],
    whenToUse: [
      'Default for text embeddings',
    ],
    whenNotToUse: [
      'When magnitude carries signal — rare in text',
    ],
  },
  failureModes: [
    'Forgot normalize — dot skewed',
    'Mixing metrics index vs query',
    'Confusing distance vs similarity',
  ],
  production: {
    performance: [
      'Pre-normalize at index',
      'SIMD/dot optimized ANN',
    ],
    reliability: [
      'Document metric in index config',
    ],
  },
  interview: {
    expectations: [
      'Formula intuition',
      'Normalize trick',
    ],
    commonQuestions: [
      'Cosine vs Euclidean?',
    ],
    followUps: [
      'Why normalize?',
    ],
    misconceptions: [
      'Cosine needs unnormalized vectors',
    ],
    traps: [
      'Distance vs similarity sign',
    ],
    strongSignals: [
      'Normalize + dot = cosine',
      'ANN with cosine',
    ],
  },
  keyTakeaways: [
    'Angle between vectors',
    'Normalize → dot product',
    'Standard for embeddings',
    'Distance = 1 - similarity often',
    'Consistent metric in index',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Cosine similarity?', answerHint: 'Dot product divided by product of L2 norms; measures direction similarity.' },
    { level: 'intermediate', question: 'Why normalize embeddings?', answerHint: 'Cosine reduces to dot; faster search; removes magnitude bias.' },
    { level: 'advanced', question: 'Cosine vs inner product ANN?', answerHint: 'If normalized, equivalent; IP index works for cosine on unit vectors.' },
  ],
  flashcards: [
    { front: 'Cosine formula', back: 'a·b / (||a|| ||b||)' },
    { front: 'Unit vectors', back: 'L2 norm 1 — cosine equals dot product' },
    { front: 'Cosine distance', back: 'Often 1 - cosine_similarity' },
  ],
  quickRevision: [
    'Angle metric',
    'Normalize vectors',
    'Dot=cosine if unit',
    'Match index metric',
    'ANN search',
  ],
}
