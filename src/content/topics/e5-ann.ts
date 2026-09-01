import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Approximate Nearest Neighbour (ANN) search finds vectors close to a query in high dimensions without exact O(n) scan — HNSW, IVF, LSH trade recall for speed.',
  whyExists: 'Exact brute-force cosine on millions of embeddings too slow for interactive RAG. ANN indexes sub-linear query time with tunable recall.',
  mentalModel: 'Skip most of haystack: build graph/clusters offline; query navigates to nearby region; may miss true nearest neighbor occasionally.',
  howItWorks: [
    { type: 'list', items: [
      'HNSW: hierarchical navigable small world graph layers',
      'IVF: inverted file clusters; search top probes clusters',
      'LSH: hash similar vectors to same buckets',
      'Tunable ef_search/nprobe balances recall vs latency',
      'Combine with reranker on top-k for accuracy',
    ] },
  ],
  example: [
    { type: 'code', language: 'python', code: '# FAISS HNSW example concept\n# index.hnsw.efSearch = 64  # higher → better recall, slower', caption: 'Recall knob' },
  ],
  tradeoffs: {
    advantages: [
      'Millisecond queries on millions',
    ],
    disadvantages: [
      'Imperfect recall',
      'Index build cost',
    ],
    alternatives: [
      'Exact flat index small n',
      'Hybrid BM25 + vector',
    ],
    whenToUse: [
      'RAG retrieval scale',
    ],
    whenNotToUse: [
      'Tiny corpus exact OK',
    ],
  },
  failureModes: [
    'Low recall misses relevant doc',
    'Stale index after doc updates',
    'Wrong distance metric for embedding model',
  ],
  production: {
    performance: [
      'Tune ef_search on golden queries',
      'Rebuild index on bulk update',
    ],
    observability: [
      'Recall@k on eval set; query latency p99',
    ],
  },
  interview: {
    expectations: [
      'ANN vs exact',
      'HNSW intuition',
    ],
    commonQuestions: [
      'How ANN works?',
    ],
    followUps: [
      'Improve recall?',
    ],
    misconceptions: [
      'Always returns true nearest',
    ],
    traps: [
      'No recall eval',
    ],
    strongSignals: [
      'ef_search, rerank top-k, hybrid search',
    ],
  },
  keyTakeaways: [
    'ANN trades recall for speed',
    'HNSW/IVF common algorithms',
    'Tune search params on eval',
    'Rerank top results',
    'Rebuild on corpus change',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'ANN vs exact search?', answerHint: 'ANN approximate fast; exact O(n) scan accurate.' },
    { level: 'intermediate', question: 'HNSW idea?', answerHint: 'Multi-layer graph greedy navigate to neighbors.' },
    { level: 'advanced', question: 'Missed relevant doc?', answerHint: 'Increase ef_search; hybrid BM25; reranker.' },
  ],
  flashcards: [
    { front: 'HNSW', back: 'Graph-based ANN with layered greedy search' },
    { front: 'Recall@k', back: 'Fraction of true neighbors in top-k results' },
  ],
  quickRevision: [
    'Approx not exact',
    'HNSW IVF LSH',
    'Tune ef_search',
    'Eval recall@k',
    'Rerank top-k',
    'Hybrid BM25',
  ],
}
