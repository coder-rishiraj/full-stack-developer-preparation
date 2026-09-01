import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Enterprise RAG/search system design: multi-source connectors, ACL-aware hybrid search, freshness, eval pipelines, and LLM answer layer for internal knowledge at org scale.',
  whyExists: 'Enterprises have Confluence, SharePoint, Slack, tickets — siloed search fails. Unified RAG needs security, scale, and measurable quality.',
  mentalModel: 'Google for company docs with bouncer checking badge — hybrid search finds pages; LLM summarizes with citations only from allowed hits.',
  howItWorks: [
    { type: 'list', items: [
      'Connectors sync sources on schedule/webhook.',
      'Normalize → chunk → embed with ACL metadata.',
      'Hybrid BM25 + vector with pre-filter tenant/user groups.',
      'Reranker on top-k; assemble context; LLM answer.',
      'Eval golden queries + freshness SLA per source.',
    ] },
  ],
  example: [
    { type: 'paragraph', text: 'Engineer searches onboarding laptop → hybrid retrieves IT wiki + Slack #it-help → rerank → gpt-4o-mini answers with [confluence:123] cites; HR doc blocked by ACL.' },
  ],
  tradeoffs: {
    advantages: [
      'Unified knowledge access',
      'Grounded answers',
    ],
    disadvantages: [
      'Connector ops burden',
      'Index staleness',
    ],
    alternatives: [
      'Keyword search only',
      'Per-tool native search',
    ],
    whenToUse: [
      '10K+ employees multi-source',
    ],
    whenNotToUse: [
      'Single small wiki',
    ],
  },
  failureModes: [
    'Stale Confluence after reorg',
    'ACL not synced — leak',
    'Semantic-only misses ticket IDs',
  ],
  production: {
    security: [
      'ACL at ingest and query',
      'Audit queries',
    ],
    reliability: [
      'Connector DLQ',
      'Abstain low score',
    ],
    observability: [
      'Recall@k, freshness lag, $/query',
    ],
  },
  interview: {
    expectations: [
      'Connectors + hybrid + ACL',
      'Eval',
    ],
    commonQuestions: [
      'Design enterprise RAG?',
    ],
    followUps: [
      'ACL sync how?',
    ],
    misconceptions: [
      'One nightly embed enough always',
    ],
    traps: [
      'No hybrid for ticket numbers',
    ],
    strongSignals: [
      'Connector ACL + hybrid + rerank + eval CI + freshness',
    ],
  },
  keyTakeaways: [
    'Multi-source connectors',
    'ACL on ingest and query',
    'Hybrid search + rerank',
    'Freshness SLAs',
    'Golden eval in CI',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Enterprise RAG vs demo RAG?', answerHint: 'Connectors, ACL, hybrid, freshness, eval at scale.' },
    { level: 'intermediate', question: 'ACL sync?', answerHint: 'Inherit source permissions at ingest; re-sync on change; filter every query.' },
    { level: 'advanced', question: 'Measure enterprise search success?', answerHint: 'Recall@k on golden queries, click-through, answer grounded rate, freshness p95 lag.' },
  ],
  flashcards: [
    { front: 'Connector', back: 'Syncs external source into normalized chunks' },
    { front: 'ACL metadata', back: 'Permissions copied from source stored per chunk' },
    { front: 'Freshness lag', back: 'Time from source update to searchable index' },
  ],
  quickRevision: [
    'Connectors sync',
    'ACL ingest+query',
    'Hybrid+rerank',
    'Eval CI',
    'Freshness SLA',
  ],
  systemDesign: {
    problem: 'Design internal enterprise search+RAG for 100K employees, 500M documents, sub-3s p95 query, strict ACL from source systems, 95% recall@5 on golden set.',
    requirements: {
      functional: [
        'Unified search bar and API',
        'Connectors Confluence/SharePoint/Slack/Drive',
        'Grounded Q&A with citations',
        'Admin connector and ACL dashboard',
        'Feedback thumbs and report issue',
      ],
      nonFunctional: [
        'p95 query <3s',
        'Zero cross-group leakage',
        'Recall@5 >=95% golden',
        'Source freshness <15min critical',
        'SOC2 audit logs',
      ],
    },
    scaleAssumptions: [
      '100K users',
      '500M docs, 2B chunks',
      '50K QPS search peak (cached)',
    ],
    capacityEstimates: [
      'Sharded vector cluster',
      'Elasticsearch BM25 tier',
      'LLM gateway with semantic cache',
    ],
    dataFlow: [
      'Connector pulls delta → normalize ACL → chunk embed → dual-write ES+vector',
      'Query → ACL pre-filter → parallel BM25+vector → RRF → rerank → LLM → validate cites',
      'Feedback → eval corpus update',
    ],
    storage: [
      'Object store raw docs',
      'Vector shards by tenant',
      'Elasticsearch inverted index',
      'Postgres connector state cursors',
    ],
    caching: [
      'Query semantic cache',
      'Hot shard CDN for static snippets',
      'Embedding cache',
    ],
    asyncProcessing: [
      'Connector sync jobs',
      'Re-embed on model version migration',
      'Nightly eval batch',
    ],
    scaling: [
      'Horizontal stateless tier; shard by tenant.',
    ],
    consistency: [
      'Strong for auth/billing; eventual for analytics.',
    ],
    reliability: [
      'Retries, idempotency keys, DLQ for async.',
    ],
    failureScenarios: [
      'Provider outage; hot tenant; index lag.',
    ],
    security: [
      'ACL mandatory pre-filter',
      'Query audit log',
      'DLP on ingest',
      'Private LLM option',
    ],
    observability: [
      'Recall@k dashboard',
      'Freshness lag per connector',
      'Leak canary tests',
      '$/query',
    ],
    bottlenecks: [
      'Rerank+LLM on long queries',
      'ACL explosion on complex groups',
      'Re-embed migration',
    ],
    alternatives: [
      'Glean native',
      'Elasticsearch only without LLM',
    ],
    tradeoffs: [
      'Dedicated vs shared vector per business unit',
      'Freshness vs connector API rate limits',
    ],
    interviewFollowUps: [
      'Cross-language?',
      'Graph expansion for related docs?',
      'Fine-tuned embed model?',
    ],
    api: [
      { type: 'code', language: 'http', code: 'POST /v1/search/query\nGET /v1/search/suggest\nPOST /v1/admin/connectors/{id}/sync\nGET /v1/admin/metrics/recall' },
    ],
    dataModel: [
      { type: 'list', items: [
        'Connector(source, cursor, last_sync, error)',
        'Chunk(doc_id, text, acl_groups[], embedding, source_url)',
        'QueryLog(user, groups, chunk_ids[], latency, feedback)',
        'GoldenQuery(query, relevant_chunk_ids[])',
      ] },
    ],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Clients → API gateway → stateless services → data stores + async workers.' },
    ],
    diagram: { mermaid: "flowchart TB\n  Sources[Confluence/Slack/Drive] --> Conn[Connectors]\n  Conn --> Pipe[Ingest Pipeline]\n  Pipe --> ES[(Elasticsearch)]\n  Pipe --> VDB[(Vector Shards)]\n  User --> Q[Query Service]\n  Q --> ES\n  Q --> VDB\n  Q --> RR[Reranker]\n  RR --> LLM[LLM Gateway]\n  LLM --> User", caption: 'Enterprise RAG architecture' },
    evolution: [
      { stage: '1. Single source', description: 'One Confluence space RAG.', bottleneck: 'No ACL breadth.' },
      { stage: '2. Hybrid multi-source', description: 'Connectors + BM25+vector.', bottleneck: 'Freshness and eval.' },
      { stage: '3. Enterprise', description: 'Sharded index, semantic cache, eval CI, leak canaries.', bottleneck: 'Re-embed migrations.' },
    ],
  },
}
