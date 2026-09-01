import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Embeddings are dense vectors mapping text (or other data) into a space where semantic similarity ≈ geometric closeness. LLMs produce contextual embeddings; dedicated models (text-embedding-3) optimize for retrieval.',
  whyExists: 'Keyword search misses paraphrases. Embeddings enable semantic retrieval, clustering, and RAG — bridge between language and vector indexes.',
  mentalModel: 'GPS coordinates for meaning. Similar ideas sit nearby; unrelated topics far apart. Cosine distance approximates relatedness.',
  howItWorks: [
    { type: 'list', items: [
      'Encoder model maps text chunk → fixed-dim vector (384–3072).',
      'Similar meanings → small angle / high cosine similarity.',
      'Stored in vector DB; query embedded same model.',
      'LLM hidden states are contextual; sentence embeddings often pooled.',
      'Same model required at index and query time.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Query refund policy and return window embed near chunk about 30-day returns even without shared keywords.' },
  ],
  tradeoffs: {
    advantages: [
      'Semantic match',
      'Multilingual potential',
      'Powers RAG/search',
    ],
    disadvantages: [
      'Not exact match for IDs/SKUs',
      'Model drift if re-embed inconsistently',
      'Domain gap without fine-tune',
    ],
    alternatives: [
      'BM25 keyword',
      'Hybrid search',
      'Structured filters',
    ],
    whenToUse: [
      'RAG retrieval',
      'Deduplication',
      'Clustering support tickets',
    ],
    whenNotToUse: [
      'Exact SKU lookup — use metadata filter',
    ],
  },
  failureModes: [
    'Different embed models index vs query',
    'Stale index after doc updates',
    'Chunk too large — muddy vector',
    'Assuming embedding = understanding',
  ],
  production: {
    reliability: [
      'Version embed model in index metadata',
      'Re-embed pipeline on model change',
    ],
    cost: [
      'Batch embed offline; cache query embeddings',
    ],
    performance: [
      'Normalize vectors for cosine via dot product',
    ],
  },
  interview: {
    expectations: [
      'Vector semantic similarity',
      'Index/query same model',
      'vs keyword',
    ],
    commonQuestions: [
      'What are embeddings?',
      'How used in RAG?',
    ],
    followUps: [
      'Contextual vs static?',
      'Dimension tradeoff?',
    ],
    misconceptions: [
      'Embeddings guarantee correctness',
      'Bigger dim always better',
    ],
    traps: [
      'Mix models across index and query',
    ],
    strongSignals: [
      'Same model, cosine, hybrid for SKUs',
    ],
  },
  keyTakeaways: [
    'Dense vectors encode semantics',
    'Similarity ≈ cosine/dot',
    'Same model index and query',
    'Enable RAG retrieval',
    'Combine with metadata for precision',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Embedding?', answerHint: 'Numeric vector representing meaning of text.' },
    { level: 'intermediate', question: 'RAG role?', answerHint: 'Embed query, ANN search chunks, inject into prompt.' },
    { level: 'advanced', question: 'Contextual vs sentence embedding?', answerHint: 'LLM hidden states vary by context; bi-encoders produce fixed chunk vectors for search.' },
  ],
  flashcards: [
    { front: 'Embedding vector', back: 'Fixed-size numeric representation of text meaning' },
    { front: 'Bi-encoder', back: 'Separate encode query and doc — standard retrieval' },
    { front: 'Same model rule', back: 'Index and query must use identical embed model/version' },
  ],
  quickRevision: [
    'Semantic vectors',
    'Cosine similarity',
    'RAG retrieval',
    'Same model/version',
    'Hybrid for exact IDs',
  ],
}
