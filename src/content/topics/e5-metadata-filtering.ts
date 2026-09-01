import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Metadata filtering restricts vector search to subsets matching structured fields — tenant_id, date, product, ACL — before or during ANN search.',
  whyExists: 'Global semantic search leaks cross-tenant data and returns irrelevant eras. Filters enforce auth and scope.',
  mentalModel: 'Search library catalog by subject shelf first, then similarity within shelf.',
  howItWorks: [
    { type: 'list', items: [
      'Store metadata JSON per vector: {tenant, dept, doc_date}.',
      'Pre-filter: WHERE tenant=X then ANN.',
      'Post-filter: top-k then drop — wasteful if selective.',
      'Combine with hybrid BM25 in scoped index.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'User tenant=acme → filter tenant=acme → embed query → top-5 within partition only.' },
  ],
  tradeoffs: {
    advantages: [
      'Security and relevance',
    ],
    disadvantages: [
      'Schema design burden',
      'Over-filter empty results',
    ],
    alternatives: [
      'Separate index per tenant',
    ],
    whenToUse: [
      'Multi-tenant RAG',
      'Dated corpora',
    ],
    whenNotToUse: [
      'Single-tenant tiny corpus',
    ],
  },
  failureModes: [
    'Missing filter — data leak',
    'Post-filter only with small k',
    'Stale ACL metadata',
  ],
  production: {
    security: [
      'Mandatory tenant filter',
      'Audit filter in query logs',
    ],
    reliability: [
      'Index metadata at ingest from source ACL',
    ],
  },
  interview: {
    expectations: [
      'Pre vs post filter',
      'Multi-tenant',
    ],
    commonQuestions: [
      'Metadata filtering why?',
    ],
    followUps: [
      'Per-tenant index vs filter?',
    ],
    misconceptions: [
      'Semantic search auto respects auth',
    ],
    traps: [
      'No tenant filter',
    ],
    strongSignals: [
      'Pre-filter ANN',
      'ACL at ingest',
    ],
  },
  keyTakeaways: [
    'Structured filters on vectors',
    'Pre-filter for security',
    'Tenant isolation mandatory',
    'Sync ACL at ingest',
    'Avoid post-filter-only leaks',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Metadata filtering?', answerHint: 'Limit search to vectors matching field constraints.' },
    { level: 'intermediate', question: 'Pre vs post filter?', answerHint: 'Pre-filter before ANN — secure and efficient; post-filter may miss after k cut.' },
    { level: 'advanced', question: 'Multi-tenant index design?', answerHint: 'Shared index + tenant filter vs isolated indexes — cost/isolation tradeoff.' },
  ],
  flashcards: [
    { front: 'Pre-filter', back: 'Apply metadata constraints before ANN search' },
    { front: 'tenant_id', back: 'Common mandatory filter in SaaS RAG' },
    { front: 'Post-filter risk', back: 'Top-k without filter may exclude all allowed docs' },
  ],
  quickRevision: [
    'Pre-filter ANN',
    'Tenant ACL',
    'Ingest metadata',
    'No leak',
    'Pre vs post',
  ],
}
