import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'API filtering lets clients narrow collections with query parameters (status=active, created_after=..., category=in(...)) translated safely to database/API queries. Combines with pagination and sorting; must validate, index, and document supported filters explicitly.',
  whyExists:
    'Clients need subsets not full dumps. Ad-hoc query languages explode complexity; curated filters balance power and performance. Poor filtering → full scans, SQL injection, or inconsistent param naming across endpoints.',
  mentalModel:
    'Whitelist filters in OpenAPI. Map ?status=active → WHERE status = $1 with enum validation. Complex filters: bracket notation ?filter[status][eq]=active or RSQL/JSON:API style — pick one standard per platform.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Param style', 'Example', 'Notes'],
      rows: [
        ['Flat equality', '?status=shipped', 'Simple enums'],
        ['Range', '?min_price=10&max_price=50', 'Validate min≤max'],
        ['Multi-value', '?tag=java&tag=spring or ?tags=java,spring', 'IN clause'],
        ['Date ISO8601', '?created_after=2026-01-01T00:00:00Z', 'Timezone explicit UTC'],
        ['Search', '?q=keyword', 'Delegates to search engine not SQL LIKE at scale'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Filter validation pipeline',
      diagram: `flowchart LR
  Q[Query params] --> V[Validate whitelist]
  V --> T[Type coerce]
  T --> QBuild[Parameterized query]
  QBuild --> DB[(Indexed columns)]`,
    },
    {
      type: 'list',
      items: [
        'Document supported filters; unknown params → 400 or ignore with warning header',
        'Combine filters with AND semantics by default',
        'Index every filtered column in hot paths',
        'Never concatenate user input into SQL',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Product list filters',
      code: `GET /v1/products?category=electronics&brand=acme&min_price=20&max_price=100&in_stock=true&sort=price&limit=20`,
    },
  ],
  tradeoffs: {
    advantages: ['Flexible client queries without new endpoints', 'Cache keys composable for public filters'],
    disadvantages: ['Cartesian explosion of index needs', 'Complex filter grammar hard to secure'],
    alternatives: ['POST /search with body for heavy filters', 'GraphQL where args'],
    whenToUse: ['List endpoints with predictable dimensions'],
    whenNotToUse: ['Full arbitrary SQL from client'],
  },
  failureModes: [
    'Unindexed filter full table scan',
    'SQL/NoSQL injection via raw interpolation',
    'Ambiguous timezone dates',
    'Too many multi-value IN clauses slow planner',
    'Filter bypass exposing other tenants data if auth bug',
  ],
  production: {
    performance: ['Composite indexes match common filter combos', 'Search engine for full-text q='],
    security: ['Parameterized queries', 'Tenant_id always in WHERE from auth not param'],
    observability: ['Log slow filter patterns', 'Track unused filter params'],
    maintainability: ['OpenAPI parameters enum documented'],
  },
  interview: {
    expectations: ['Whitelist validation', 'Index awareness', 'Injection prevention'],
    commonQuestions: ['Design filters for orders API?', 'Filter + pagination?'],
    followUps: ['RSQL vs flat params?', 'OR filters?'],
    misconceptions: ['Accept any field as filter from DB schema'],
    traps: ['LIKE %user% on 100M rows'],
    strongSignals: ['OpenAPI enums', 'Composite index strategy', 'Search service for q='],
  },
  keyTakeaways: [
    'Explicit whitelist of filterable fields.',
    'Parameterized queries always.',
    'Index filtered and sorted columns.',
    'Use search index for text q= not SQL LIKE at scale.',
    'Combine with cursor pagination.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why whitelist filters?', answerHint: 'Prevent full scans, injection, unsupported fields, security leaks.' },
    { level: 'intermediate', question: 'Filter orders by date range and status — index?', answerHint: 'Composite (tenant_id, status, created_at) matching common queries.' },
    { level: 'advanced', question: 'Support OR filters (status=shipped OR status=delivered)?', answerHint: 'Document OR groups; index may need status IN (...); avoid unbounded OR trees.' },
  ],
  flashcards: [
    { front: 'Filter whitelist', back: 'Only documented params accepted and mapped safely' },
    { front: 'Tenant filter', back: 'Always from auth context not client param alone' },
    { front: 'q= search param', back: 'Route to Elasticsearch not SQL LIKE at scale' },
    { front: 'Composite index', back: 'Matches multi-column filter+sort patterns' },
  ],
  quickRevision: [
    'Whitelist params',
    'Parameterized SQL',
    'Index filter cols',
    'q= → search engine',
    'AND default combine',
  ],
  systemDesign: {
    problem: 'Design filtering for B2B invoice list API (tenant-scoped, filter status, date, customer, amount range, full-text invoice number).',
    requirements: {
      functional: ['Multi-filter AND', 'Sort + paginate', 'Search invoice # partial match'],
      nonFunctional: ['p99 < 150ms', '10M invoices/tenant max whale'],
    },
    scaleAssumptions: ['500 list RPS', 'Whale 10M rows'],
    capacityEstimates: ['Index (tenant_id, status, created_at DESC)', 'Search index for number prefix'],
    api: [{ type: 'code', language: 'http', code: `GET /v1/invoices?status=open&customer_id=c-1&created_after=...&amount_min=100&q=INV-2026` }],
    dataModel: [{ type: 'list', items: ['invoices table tenant scoped', 'ES for q= number search optional hybrid'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Structured filters SQL; q= routes to ES then id IN query or ES-only list ids.' }],
    diagram: {
      mermaid: `flowchart TB
  Req[Request] --> Split{has q=?}
  Split -->|no| SQL[(Postgres indexed)]
  Split -->|yes| ES[Elasticsearch]
  ES --> SQL`,
      caption: 'Hybrid SQL filters + search for text',
    },
    dataFlow: ['Validate enums → build dynamic WHERE with params → keyset page'],
    storage: ['Postgres + optional ES'],
    caching: ['Cache common filter combos per tenant short TTL'],
    asyncProcessing: ['ES sync via CDC'],
    scaling: ['Shard whale tenants'],
    consistency: ['ES lag acceptable for q= search'],
    reliability: ['Fallback SQL prefix match if ES down degraded'],
    failureScenarios: ['Whale unfiltered list — require min one filter or reject'],
    security: ['tenant_id from JWT mandatory'],
    observability: ['Slow query log by filter pattern'],
    bottlenecks: ['amount range without index — add or reject'],
    alternatives: ['POST /invoices/search body for complex filters'],
    tradeoffs: ['Flat params vs POST search DSL complexity'],
    interviewFollowUps: ['Export CSV all matching filters?'],
    evolution: [
      { stage: '1. Simple design', description: 'Few flat params.', bottleneck: 'Whale scans.' },
      { stage: '2. Improve', description: 'Composite indexes + cursor.', bottleneck: 'Invoice number search.' },
      { stage: '3. Improve', description: 'ES for q= + SQL filters.', bottleneck: 'Dual store sync.' },
      { stage: '4. Scale further', description: 'Whale tenant dedicated shard.', bottleneck: 'Cross-filter analytics.' },
    ],
  },
}
