import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Semantic search finds documents by meaning similarity via embeddings, not exact keyword match — handles paraphrase, synonyms, and conceptual queries.',
  whyExists: 'Users ask how do I return item not refund policy section 4. Keyword search misses; semantic maps intent to relevant passages.',
  mentalModel: 'Librarian who understands question intent not just title keywords.',
  howItWorks: [
    { type: 'list', items: [
      'Index: chunk docs → embed → vector store.',
      'Query: embed question → ANN top-k.',
      'Optional metadata pre-filter.',
      'Return chunks with scores to RAG or UI.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Query cancel subscription finds billing FAQ about termination though word cancel absent in chunk.' },
  ],
  tradeoffs: {
    advantages: [
      'Paraphrase robust',
      'Multilingual potential',
    ],
    disadvantages: [
      'Weak on SKUs/codes',
      'Needs embed infra',
    ],
    alternatives: [
      'BM25 keyword',
      'Hybrid',
    ],
    whenToUse: [
      'Support KB, legal, internal docs',
    ],
    whenNotToUse: [
      'Exact serial number lookup',
    ],
  },
  failureModes: [
    'Chunks too large muddy vectors',
    'Stale index',
    'No hybrid for rare tokens',
  ],
  production: {
    performance: [
      'ANN + metadata filter first',
    ],
    reliability: [
      'Hybrid for SKU paths',
      'Monitor recall@k',
    ],
  },
  interview: {
    expectations: [
      'Embed query-doc flow',
      'vs keyword',
    ],
    commonQuestions: [
      'Semantic vs keyword?',
    ],
    followUps: [
      'When hybrid?',
    ],
    misconceptions: [
      'Replaces Elasticsearch entirely always',
    ],
    traps: [
      'Semantic only for product IDs',
    ],
    strongSignals: [
      'Hybrid + eval recall',
    ],
  },
  keyTakeaways: [
    'Meaning not keywords',
    'Embed index and query',
    'Chunk quality matters',
    'Hybrid for exact tokens',
    'Eval recall@k',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Semantic search?', answerHint: 'Vector similarity retrieval by meaning.' },
    { level: 'intermediate', question: 'Failure on SKUs?', answerHint: 'Add BM25 hybrid or metadata exact filter.' },
    { level: 'advanced', question: 'Measure search quality?', answerHint: 'Recall@k, MRR on labeled query-chunk pairs.' },
  ],
  flashcards: [
    { front: 'Semantic search', back: 'Retrieval by embedding similarity not keywords' },
    { front: 'Recall@k', back: 'Fraction of queries with relevant doc in top k' },
    { front: 'Paraphrase robust', back: 'Same intent different words still match' },
  ],
  quickRevision: [
    'Meaning-based',
    'Embed+ANN',
    'Good chunks',
    'Hybrid SKUs',
    'Recall@k eval',
  ],
}
