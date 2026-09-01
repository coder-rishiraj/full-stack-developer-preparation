import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'pgvector extends PostgreSQL with vector type and ANN indexes (IVFFlat, HNSW) — storing embeddings alongside relational metadata for hybrid RAG without separate vector DB.',
  whyExists: 'Teams already on Postgres want semantic search with SQL filters, transactions, and ops familiarity — one database for app data and vectors.',
  mentalModel: 'Postgres table with float[] column plus special index — SQL WHERE tenant_id=X ORDER BY embedding <=> query LIMIT k.',
  howItWorks: [
    { type: 'list', items: [
      'CREATE EXTENSION vector; column embedding vector(1536).',
      'Distance ops: <=> cosine, <-> L2, <#> inner product.',
      'HNSW index for fast ANN; IVFFlat for build speed.',
      'Combine metadata filters in SQL WHERE.',
      'Upsert chunks with doc_id, tenant_id, content.',
    ] },
  ],
  example: [
    { type: 'code', language: 'sql', code: 'SELECT id, content, embedding <=> $1 AS dist\nFROM chunks\nWHERE tenant_id = $2\nORDER BY embedding <=> $1\nLIMIT 10;', caption: 'Tenant-scoped similarity search' },
  ],
  tradeoffs: {
    advantages: [
      'Single DB',
      'ACID + joins',
      'Familiar ops',
    ],
    disadvantages: [
      'Scale limits vs dedicated vector DB',
      'Index tuning needed',
    ],
    alternatives: [
      'Pinecone, Weaviate, Qdrant',
    ],
    whenToUse: [
      'Moderate scale RAG on Postgres',
    ],
    whenNotToUse: [
      'Billion-vector extreme ANN scale',
    ],
  },
  failureModes: [
    'No index — seq scan slow',
    'Wrong distance operator vs index',
    'Forgot tenant filter',
  ],
  production: {
    performance: [
      'HNSW m/ef params tune recall',
      'Batch embed upserts',
    ],
    reliability: [
      'Vacuum and reindex plan',
    ],
    cost: [
      'Right-size RDS instance RAM',
    ],
  },
  interview: {
    expectations: [
      '<=> cosine',
      'HNSW + SQL filter',
    ],
    commonQuestions: [
      'pgvector vs Pinecone?',
    ],
    followUps: [
      'Index choice?',
    ],
    misconceptions: [
      'Postgres cannot scale vectors at all',
    ],
    traps: [
      'No tenant WHERE',
    ],
    strongSignals: [
      'HNSW + metadata filter + same DB transactions',
    ],
  },
  keyTakeaways: [
    'vector column in Postgres',
    'HNSW/IVFFlat indexes',
    'SQL metadata filters',
    'Match distance metric',
    'Good for moderate RAG scale',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'pgvector?', answerHint: 'Postgres extension for vector storage and similarity search.' },
    { level: 'intermediate', question: 'HNSW vs IVFFlat?', answerHint: 'HNSW better query recall/speed; IVFFlat faster build lower memory.' },
    { level: 'advanced', question: 'Hybrid SQL+RAG?', answerHint: 'WHERE tags && + vector ORDER BY <=> query; join to documents table.' },
  ],
  flashcards: [
    { front: '<=> operator', back: 'Cosine distance in pgvector' },
    { front: 'HNSW', back: 'Graph ANN index in pgvector for fast search' },
    { front: 'Single DB RAG', back: 'Relational metadata + vectors in Postgres' },
  ],
  quickRevision: [
    'vector column',
    'HNSW index',
    '<=> cosine',
    'SQL tenant filter',
    'Moderate scale',
  ],
}
