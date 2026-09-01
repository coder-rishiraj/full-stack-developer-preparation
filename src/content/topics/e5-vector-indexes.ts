import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Vector indexes store embedding vectors with metadata enabling filtered similarity search — Pinecone, pgvector, FAISS, Weaviate, Milvus with HNSW/IVF backends and namespace/shard layout.',
  whyExists: 'Raw embedding files lack query API, persistence, filtering, and horizontal scale. Managed indexes provide production retrieval infrastructure.',
  mentalModel: 'Specialized DB for vectors: upsert id+vector+metadata; query vector returns top-k similar with optional metadata filter.',
  howItWorks: [
    { type: 'list', items: [
      'Upsert: id, embedding float[], metadata JSON',
      'Index type: HNSW flat IVF per vendor',
      'Metadata pre-filter narrows search space',
      'Namespaces/collections isolate tenants',
      'Hybrid: sparse BM25 + dense vector fusion',
    ] },
  ],
  example: [
    { type: 'code', language: 'python', code: 'index.upsert([(\'doc1\', embedding, {\'team\': \'eng\'})])\nresults = index.query(vector=q_emb, top_k=5, filter={\'team\': \'eng\'})', caption: 'Upsert and filtered query' },
  ],
  tradeoffs: {
    advantages: [
      'Managed scale',
      'Metadata filters',
    ],
    disadvantages: [
      'Vendor cost',
      'Eventual consistency on upsert',
    ],
    alternatives: [
      'Self-host FAISS',
      'Postgres pgvector small scale',
    ],
    whenToUse: [
      'Production RAG',
    ],
    whenNotToUse: [
      '<10k vectors in Postgres OK',
    ],
  },
  failureModes: [
    'Dimension mismatch on upsert',
    'Filter too selective empty results',
    'Index lag after upsert',
    'Single shard hot tenant',
  ],
  production: {
    scalability: [
      'Shard by tenant; replicate read',
    ],
    observability: [
      'Query latency, index size, upsert lag',
    ],
    cost: [
      'Right-size dimensions; prune stale vectors',
    ],
  },
  interview: {
    expectations: [
      'Upsert/query API',
      'Metadata filter + ANN',
    ],
    commonQuestions: [
      'Vector DB vs relational?',
    ],
    followUps: [
      'Hybrid search?',
    ],
    misconceptions: [
      'Store full text in vector DB only',
    ],
    traps: [
      'No metadata for filtering',
    ],
    strongSignals: [
      'pgvector vs managed, HNSW, hybrid',
    ],
  },
  keyTakeaways: [
    'Store vectors + metadata + id',
    'ANN backend HNSW/IVF',
    'Pre-filter metadata',
    'Hybrid sparse+dense',
    'Match embedding dimensions',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Vector index query?', answerHint: 'Similarity search top-k near query embedding.' },
    { level: 'intermediate', question: 'Metadata filter why?', answerHint: 'Restrict search to tenant/doc type before ANN.' },
    { level: 'advanced', question: 'pgvector vs Pinecone?', answerHint: 'pgvector simpler ops small scale; managed scales ANN ops.' },
  ],
  flashcards: [
    { front: 'Upsert', back: 'Insert or update vector by id' },
    { front: 'Metadata filter', back: 'Pre-filter candidates before similarity search' },
  ],
  quickRevision: [
    'id + vector + metadata',
    'HNSW ANN backend',
    'Filtered query',
    'Hybrid BM25+vector',
    'Dimension match',
    'Shard tenants',
  ],
}
