import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Document databases store semi-structured documents (JSON/BSON) as units, often with flexible schema per document. Queries filter and aggregate on embedded fields. Examples: MongoDB, CouchDB, Firestore. Good when data is hierarchical and schema evolves frequently.',
  whyExists:
    'Relational schemas choke on rapid product iteration and nested objects (user profiles, CMS content, catalogs with varying attributes). Documents colocate related fields — one read fetches whole aggregate without joins.',
  mentalModel:
    'JSON file per entity in a collection. Index fields you query. Design for access patterns — embed vs reference like normalization tradeoff in NoSQL form.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Pattern', 'Embed', 'Reference'],
      rows: [
        ['1:few nested', 'Addresses inside user doc', '—'],
        ['1:many large', '—', 'comments in separate collection with post_id'],
        ['Many:many', '—', 'join collection or denormalize ids'],
        ['Atomic update', 'Single doc update atomic', 'Multi-doc needs transaction (if supported)'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Embed vs reference',
      diagram: `flowchart TB
  subgraph embed [Embedded document]
    User[User doc] --> Addr[addresses array]
  end
  subgraph ref [Referenced]
    Post[Post doc] --> CommentRef[comment_ids]
    Comment[Comment docs] --> PostId[post_id index]
  end`,
    },
    {
      type: 'list',
      items: [
        'Indexes on query fields (compound indexes match filter+sort)',
        'Schema validation optional in MongoDB',
        'Sharding shard key = immutable choice driving distribution',
        'Change streams for CDC/reactivity',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'MongoDB product catalog document',
      code: `{
  _id: "prod-99",
  name: "Laptop",
  attrs: { ram_gb: 16, color: "silver" },
  variants: [{ sku: "A1", price: 999 }],
  updated_at: ISODate("2026-08-17")
}
// db.products.createIndex({ "attrs.ram_gb": 1, name: 1 })`,
    },
  ],
  tradeoffs: {
    advantages: ['Flexible schema', 'Fast reads of whole aggregate', 'Horizontal sharding native in MongoDB'],
    disadvantages: ['Duplicate data if denormalized', 'Large docs hit 16MB Mongo limit', 'Join-like $lookup costly'],
    alternatives: ['Postgres JSONB for hybrid', 'Relational for heavy cross-entity reporting'],
    whenToUse: ['CMS, profiles, catalogs with variable fields', 'Document-shaped domain aggregates'],
    whenNotToUse: ['Heavy multi-entity transactional reporting without denormalization plan'],
  },
  failureModes: [
    'Unindexed collection scan',
    'Bad shard key → jumbo chunks, hot shard',
    'Unbounded array growth in embedded docs',
    'Schema drift without validation',
    'Multi-doc updates without transaction on critical paths',
  ],
  production: {
    performance: ['Compound indexes match queries', 'Projection to return needed fields only'],
    scalability: ['Shard by high-cardinality key (user_id, tenant_id)', 'Avoid monotonic _id only if hot'],
    reliability: ['Replica sets', 'Backup with oplog/PITR'],
    observability: ['Slow query profiler, opcounters, chunk balance'],
    maintainability: ['Schema versioning in app layer', 'Migration scripts for backfill'],
  },
  interview: {
    expectations: ['Embed vs reference', 'Shard key choice', 'Index design'],
    commonQuestions: ['Mongo vs Postgres for app X?', 'Design schema for social posts?'],
    followUps: ['Multi-doc ACID in Mongo?', 'Consistent indexing with sharding?'],
    misconceptions: ['No schema means no design', 'Document DB never needs joins'],
    traps: ['Sharding on low-cardinality field like country'],
    strongSignals: ['Access-pattern-first schema', 'Compound index', 'Shard key rationale'],
  },
  keyTakeaways: [
    'Documents = JSON aggregates; design for read patterns.',
    'Embed 1:few; reference 1:many unbounded.',
    'Index every query path; compound indexes matter.',
    'Shard key is permanent architecture choice.',
    'Use multi-doc transactions sparingly but when needed.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Document DB vs relational?', answerHint: 'Flexible nested docs vs tables/joins; doc for aggregate reads.' },
    { level: 'intermediate', question: 'When embed vs reference comments?', answerHint: 'Embed if few/small; separate collection if many/large with post_id index.' },
    { level: 'advanced', question: 'Pick Mongo shard key for multi-tenant SaaS?', answerHint: 'tenant_id + high cardinality suffix; avoid hot tenant on single chunk.' },
  ],
  flashcards: [
    { front: 'Embed vs reference', back: 'Embed colocate; reference for unbounded 1:many' },
    { front: 'Compound index', back: 'Supports filter+sort on prefix fields' },
    { front: 'Shard key', back: 'Determines data distribution; hard to change' },
    { front: '16MB doc limit', back: 'MongoDB max BSON document size' },
  ],
  quickRevision: [
    'JSON aggregates',
    'Access-pattern schema',
    'Embed 1:few',
    'Index query paths',
    'Shard key careful',
  ],
  systemDesign: {
    problem: 'Design document store schema for a multi-tenant CMS (pages, blocks, revisions, publishing).',
    requirements: {
      functional: ['CRUD pages', 'Version history', 'Publish draft', 'Query by slug per tenant'],
      nonFunctional: ['Tenant isolation', '10k tenants', 'Fast read published page'],
    },
    scaleAssumptions: ['100M pages', '50k read/s published', '500 write/s'],
    capacityEstimates: ['Shard by tenant_id hash', 'CDN for published static render optional'],
    api: [{ type: 'code', language: 'http', code: `GET /t/{tenant}/pages/{slug}\nPUT /t/{tenant}/pages/{id}/draft` }],
    dataModel: [
      {
        type: 'list',
        items: [
          'pages: {tenant_id, slug, status, blocks[], published_at, version}',
          'revisions: separate collection {page_id, version, snapshot} for history',
          'Index {tenant_id, slug} unique for published',
        ],
      },
    ],
    highLevelArchitecture: [{ type: 'paragraph', text: 'MongoDB sharded cluster; Redis cache published pages by tenant:slug.' }],
    diagram: {
      mermaid: `flowchart LR
  API --> Mongo[(MongoDB sharded)]
  API --> Redis[(Published cache)]
  CDN[CDN HTML] --> Users`,
      caption: 'Draft in Mongo; cache published reads',
    },
    dataFlow: ['Publish: txn update page status + invalidate cache', 'Read published: cache-aside'],
    storage: ['MongoDB with replica set per shard'],
    caching: ['Redis for hot published pages'],
    asyncProcessing: ['Search index via change stream'],
    scaling: ['Shard tenant_id; cache scales separately'],
    consistency: ['Strong on publish txn within shard'],
    reliability: ['Replica failover'],
    failureScenarios: ['Large revision history → cap or archive to object storage'],
    security: ['tenant_id in every query filter'],
    observability: ['Chunk balance, cache hit rate'],
    bottlenecks: ['Hot tenant viral page'],
    alternatives: ['Postgres JSONB + relational metadata'],
    tradeoffs: ['Revisions separate vs embedded array size'],
    interviewFollowUps: ['Slug rename?', 'Cross-tenant search?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single Mongo replica set.', bottleneck: 'Storage growth.' },
      { stage: '2. Improve', description: 'Sharding + cache.', bottleneck: 'Revision storage.' },
      { stage: '3. Improve', description: 'Revisions to S3; change stream search.', bottleneck: 'Hot tenant shard.' },
      { stage: '4. Scale further', description: 'Dedicated cluster for whale tenants.', bottleneck: 'Ops overhead.' },
    ],
  },
}
