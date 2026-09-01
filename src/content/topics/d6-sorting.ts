import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'API sorting lets clients order collection results via query parameters (?sort=created_at or ?sort=-price,name). Server maps to ORDER BY with whitelist of allowed fields and directions — combined with pagination indexes for performance.',
  whyExists:
    'Users expect "newest first" or "cheapest first". Hardcoding sort in API limits clients; arbitrary sort strings risk SQL injection and unindexed sorts. Explicit sort whitelist documents behavior and enables index design.',
  mentalModel:
    'sort=field for ascending, -field for descending (GitHub style). Multi-field comma list. Server validates field names against enum; rejects unknown. Pagination cursor must use same sort keys for stability.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Convention', 'Example', 'SQL'],
      rows: [
        ['Ascending', '?sort=price', 'ORDER BY price ASC'],
        ['Descending prefix', '?sort=-created_at', 'ORDER BY created_at DESC'],
        ['Multi-field', '?sort=-priority,created_at', 'ORDER BY priority DESC, created_at ASC'],
        ['Default sort', 'omitted param', 'Document default e.g. -created_at'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Sort + cursor pagination alignment',
      diagram: `flowchart LR
  Sort["sort=-created_at,id"]
  Idx[Index created_at DESC id DESC]
  Cursor[Cursor encodes last created_at+id]
  Sort --> Idx
  Idx --> Cursor`,
    },
    {
      type: 'list',
      items: [
        'Whitelist sortable fields in OpenAPI enum',
        'Always add tie-breaker id for stable pagination',
        'Index (filter columns..., sort columns...)',
        'Nullable sort fields: NULLS LAST explicitly',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Products sorted by price then name',
      code: `GET /v1/products?category=books&sort=price,-name&limit=20&cursor=...

-- Server: ORDER BY price ASC, name DESC, id DESC
-- Index: (category, price, name DESC, id DESC)`,
    },
  ],
  tradeoffs: {
    advantages: ['Client flexibility', 'Predictable with whitelist', 'Pairs with keyset pagination'],
    disadvantages: ['Many sort combos need many indexes', 'Dynamic sort prevents single perfect index'],
    alternatives: ['Fixed sort only simpler', 'Client-side sort on small pages only'],
    whenToUse: ['List APIs with multiple legitimate orderings'],
    whenNotToUse: ['Huge tables without index for offered sorts'],
  },
  failureModes: [
    'Sort on unindexed computed column full scan',
    'SQL injection via sort=;DROP TABLE',
    'Unstable sort without tie-breaker duplicates pages',
    'Sort field mismatch with cursor encoding',
  ],
  production: {
    performance: ['Limit count of multi-sort fields', 'Covering index for hot sorts'],
    security: ['Map sort param to column whitelist — never raw passthrough'],
    maintainability: ['Default sort documented', 'OpenAPI sort enum'],
    observability: ['Track sort param usage for index planning'],
  },
  interview: {
    expectations: ['Whitelist sort fields', 'Tie-breaker id', 'Index alignment'],
    commonQuestions: ['sort param design?', 'Sort + filter index?'],
    followUps: ['Default sort choice?', 'Sort by relevance with search?'],
    misconceptions: ['Allow any DB column sort for flexibility'],
    traps: ['Cursor pagination with different sort than encoded'],
    strongSignals: ['GitHub -prefix convention', 'Composite index strategy', 'Reject unknown sort 400'],
  },
  keyTakeaways: [
    'Whitelist sortable fields; never raw ORDER BY injection.',
    'Multi-sort with comma; - prefix descending common convention.',
    'Match indexes to filter+sort patterns.',
    'Tie-breaker id for stable cursor pagination.',
    'Document default sort when param omitted.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why whitelist sort fields?', answerHint: 'Security injection prevention + guaranteed indexed sorts.' },
    { level: 'intermediate', question: 'sort=-created_at with cursor pagination?', answerHint: 'Cursor encodes (created_at, id); query keyset WHERE tuple less than last.' },
    { level: 'advanced', question: 'Support sort=price and sort=-price with one index?', answerHint: 'Postgres can scan index backward DESC; composite index (tenant, price, id) both directions.' },
  ],
  flashcards: [
    { front: 'Descending sort convention', back: 'Prefix minus: sort=-created_at' },
    { front: 'Stable pagination sort', back: 'Include unique tie-breaker id in ORDER BY' },
    { front: 'Sort injection defense', back: 'Map client field names to fixed column whitelist' },
    { front: 'Default sort', back: 'Server applies documented sort when param absent' },
  ],
  quickRevision: [
    'Whitelist fields',
    '- prefix DESC',
    'Tie-breaker id',
    'Index filter+sort',
    'Cursor same sort',
  ],
  systemDesign: {
    problem: 'Design sort options for marketplace product listing with filters (category, brand) at 50k catalog items per category.',
    requirements: {
      functional: ['Sort price, rating, newest', 'Combine with filters + cursor'],
      nonFunctional: ['p99 < 80ms', 'Prevent sort injection'],
    },
    scaleAssumptions: ['50k products/category', '2k list RPS'],
    capacityEstimates: ['Indexes per hot combo: (category, price, id), (category, rating DESC, id), (category, created_at DESC, id)'],
    api: [{ type: 'code', language: 'http', code: `GET /v1/products?category=phones&brand=samsung&sort=-rating&limit=24&cursor=...` }],
    dataModel: [{ type: 'list', items: ['products(category, brand, price, rating, created_at, id)', 'Three composite indexes for sort modes'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Parse sort enum → pick index plan; reject unsupported combo 400.' }],
    diagram: {
      mermaid: `flowchart TB
  P[sort param] --> E{enum valid?}
  E -->|no| Err400[400]
  E -->|yes| Plan[Index plan + keyset query]`,
      caption: 'Validated sort to index plan',
    },
    dataFlow: ['Filter → sort whitelist → keyset page'],
    storage: ['Postgres indexed'],
    caching: ['Cache popular category+sort page1'],
    asyncProcessing: ['Rating updates async denormalized'],
    scaling: ['Read replicas'],
    consistency: ['Rating sort eventual few seconds OK'],
    reliability: ['Invalid cursor 400'],
    failureScenarios: ['New sort option added without index — perf incident — gate via feature flag'],
    security: ['Sort whitelist only'],
    observability: ['Sort usage metrics drive indexes'],
    bottlenecks: ['Too many sort×filter index combos — limit offered sorts'],
    alternatives: ['Search engine for complex sort relevance'],
    tradeoffs: ['Index proliferation vs limited sort choices'],
    interviewFollowUps: ['Sort by distance geo?', 'Personalized rank sort?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single default sort.', bottleneck: 'Client needs options.' },
      { stage: '2. Improve', description: 'Three whitelisted sorts + indexes.', bottleneck: 'Index maintenance.' },
      { stage: '3. Improve', description: 'Cursor tied to sort keys.', bottleneck: 'Personalized sort needs ML rank index.' },
      { stage: '4. Scale further', description: 'ES for relevance sort; SQL for price/date.', bottleneck: 'Dual query paths.' },
    ],
  },
}
