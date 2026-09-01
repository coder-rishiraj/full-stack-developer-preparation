import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Hybrid search combines dense vector similarity with sparse keyword retrieval (BM25) — merged via weighted score or RRF — capturing both semantic and exact token matches.',
  whyExists: 'Pure semantic misses SKUs and rare tokens; pure keyword misses paraphrase. Production search needs both.',
  mentalModel: 'Two detectives — one understands intent, one matches fingerprints — combine evidence lists.',
  howItWorks: [
    { type: 'list', items: [
      'Run BM25 and vector search in parallel.',
      'Reciprocal Rank Fusion (RRF) merges ranked lists.',
      'Or weighted linear combo of normalized scores.',
      'Apply metadata filters on both legs.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Query PROD-8842-X: BM25 hits exact SKU; semantic hits related troubleshooting — RRF surfaces both in top-3.' },
  ],
  tradeoffs: {
    advantages: [
      'Best recall overall',
      'Handles IDs and paraphrase',
    ],
    disadvantages: [
      'Two indexes to maintain',
      'Tuning fusion weights',
    ],
    alternatives: [
      'Semantic only + metadata exact',
    ],
    whenToUse: [
      'Enterprise search',
      'E-commerce support',
    ],
    whenNotToUse: [
      'Tiny homogeneous corpus',
    ],
  },
  failureModes: [
    'One leg down silently',
    'Wrong fusion weights',
    'Duplicate chunks in merge',
  ],
  production: {
    reliability: [
      'Monitor each leg latency',
      'Fallback to single leg',
    ],
    maintainability: [
      'Unified chunk id for dedup in fusion',
    ],
  },
  interview: {
    expectations: [
      'BM25 + vectors',
      'RRF',
    ],
    commonQuestions: [
      'Hybrid search?',
      'Why not semantic only?',
    ],
    followUps: [
      'RRF vs weighted?',
    ],
    misconceptions: [
      'Hybrid always doubles latency unacceptable',
    ],
    traps: [
      'Semantic only for SKU app',
    ],
    strongSignals: [
      'Parallel retrieve + RRF + dedup',
    ],
  },
  keyTakeaways: [
    'Vector + BM25 together',
    'RRF common fusion',
    'SKUs and paraphrase covered',
    'Dedup merged results',
    'Filter both legs',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Hybrid search?', answerHint: 'Combine keyword and vector retrieval rankings.' },
    { level: 'intermediate', question: 'RRF?', answerHint: 'Reciprocal Rank Fusion — merge lists by rank position not raw scores.' },
    { level: 'advanced', question: 'Tune hybrid weights?', answerHint: 'Offline eval on golden queries; grid search alpha; per collection.' },
  ],
  flashcards: [
    { front: 'BM25', back: 'Sparse keyword relevance scoring' },
    { front: 'RRF', back: 'Rank fusion: score = sum 1/(k+rank)' },
    { front: 'Hybrid', back: 'Dense + sparse retrieval combined' },
  ],
  quickRevision: [
    'BM25+vectors',
    'RRF merge',
    'SKU+semantic',
    'Dedup chunks',
    'Eval weights',
  ],
}
