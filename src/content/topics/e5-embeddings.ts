import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Production embeddings: choosing, generating, storing, and querying dense vectors for semantic search and RAG — model selection, dimension, batching, and index lifecycle.',
  whyExists: 'Conceptual embeddings (e2) differ from ops: batch pipelines, pgvector/Pinecone, re-embed on model change, hybrid with filters.',
  mentalModel: 'Factory line: docs → chunks → embed model → vector DB → query-time same model → ranked hits.',
  howItWorks: [
    { type: 'list', items: [
      'Pick model: text-embedding-3-small/large, Cohere, open source.',
      'Batch embed offline; store id + vector + metadata.',
      'Query embed same model version.',
      'ANN index: HNSW, IVF — trade recall vs speed.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Nightly job embeds new Confluence pages; pgvector HNSW index; API embeds query, top-10 cosine, metadata filter team=eng.' },
  ],
  tradeoffs: {
    advantages: [
      'Semantic retrieval at scale',
    ],
    disadvantages: [
      'Re-embed cost on model change',
      'Storage grows with corpus',
    ],
    alternatives: [
      'BM25 only for small corpus',
    ],
    whenToUse: [
      'RAG, dedup, recommend',
    ],
    whenNotToUse: [
      'Exact ID lookup without metadata',
    ],
  },
  failureModes: [
    'Model version drift',
    'Not batching embed API',
    'Missing metadata for filter',
  ],
  production: {
    cost: [
      'Batch + cache query embeds',
      'Right-size dimensions',
    ],
    reliability: [
      'Version stamp on index',
      'Re-embed migration playbook',
    ],
  },
  interview: {
    expectations: [
      'Pipeline end-to-end',
      'Same model rule',
    ],
    commonQuestions: [
      'Embedding pipeline?',
      'Change model what happens?',
    ],
    followUps: [
      'Batch vs realtime?',
    ],
    misconceptions: [
      'Any embed model interchangeable',
    ],
    traps: [
      'Different model query vs index',
    ],
    strongSignals: [
      'Versioned index + batch + ANN',
    ],
  },
  keyTakeaways: [
    'Same model index and query',
    'Batch offline embed',
    'Version indexes',
    'Metadata alongside vectors',
    'ANN for scale',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Embedding pipeline steps?', answerHint: 'Chunk → embed → store vector+metadata → index → query embed → search.' },
    { level: 'intermediate', question: 'Model upgrade?', answerHint: 'Re-embed corpus; dual-write or rebuild index; version field.' },
    { level: 'advanced', question: 'Dimension tradeoff?', answerHint: 'Higher dim often better quality; more storage and slower ANN; eval on task.' },
  ],
  flashcards: [
    { front: 'ANN', back: 'Approximate nearest neighbor — fast vector search' },
    { front: 'HNSW', back: 'Graph-based ANN index common in vector DBs' },
    { front: 'Embed model version', back: 'Must match between index and query time' },
  ],
  quickRevision: [
    'Chunk→embed→index',
    'Same model/version',
    'Batch offline',
    'Metadata filters',
    'ANN at scale',
  ],
}
