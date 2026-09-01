import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Pastebin is a text-sharing service: users upload snippets, receive short URLs, and others read content — optimized for write-once-read-many, optional expiry, and abuse resistance.',
  whyExists:
    'Forums and chats limit message size and lack syntax highlighting permanence. Pastebin provides durable, shareable text with privacy controls (unlisted vs public) and TTL for ephemeral sharing.',
  mentalModel:
    'Short key maps to blob storage. Create: generate unique id → store text in object store or DB → return URL. Read: lookup id → stream content. Expiry via TTL metadata and lazy or scheduled deletion.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Use base62 random ids (7–8 chars) with collision retry. Large pastes go to S3; metadata in SQL/NoSQL. CDN caches popular public pastes. Rate limit creates; scan for malware links and illegal content.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Core API',
      code: `POST /api/pastes
{ "content": "...", "ttl_seconds": 3600, "visibility": "unlisted" }
→ 201 { "id": "abc12XY", "url": "https://paste.example/abc12XY" }

GET /api/pastes/abc12XY → 200 text/plain`,
    },
  ],
  keyTakeaways: [
    'Separate metadata (small) from content blob (large).',
    'Random short ids — not sequential (enumeration risk).',
    'TTL via object lifecycle + metadata expiry index.',
    'Cache hot reads at CDN; origin for misses only.',
    'Evolve: single DB → object storage + CDN → multi-region.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Where store 1 MB paste vs 10 KB?',
      answerHint: 'Blob in object storage; DB holds pointer + metadata only.',
    },
    {
      level: 'intermediate',
      question: 'How generate short unique URLs?',
      answerHint: 'Random base62 + uniqueness check; or Snowflake encoded.',
    },
    {
      level: 'advanced',
      question: 'Design analytics for view counts without hurting read latency?',
      answerHint: 'Async counter increment via queue; approximate counts OK.',
    },
  ],
  flashcards: [
    { front: 'Paste id strategy', back: 'Random base62, not sequential integer' },
    { front: 'Storage split', back: 'Metadata DB + S3/object store for body' },
    { front: 'Expiry', back: 'TTL metadata + S3 lifecycle + sweeper job' },
  ],
  quickRevision: [
    'POST create → short id',
    'Blob storage for content',
    'CDN cache public reads',
    'Rate limit + abuse scan',
    'TTL and lazy delete',
    'Unlisted != secret — obscurity not encryption',
  ],
  systemDesign: {
    problem:
      'Design Pastebin supporting 10M pastes/day, reads 10:1 over writes, max 10 MB per paste, optional 1-hour to never expiry.',
    requirements: {
      functional: [
        'Create paste with optional TTL and visibility',
        'Read paste by short URL',
        'Delete own paste (auth optional)',
        'Syntax highlighting optional (client-side OK)',
      ],
      nonFunctional: [
        'Read p99 < 100ms for cached pastes',
        'Durability for non-expired pastes',
        'Prevent enumeration and scraping abuse',
        '10 MB max upload',
      ],
    },
    scaleAssumptions: [
      '10M creates/day (~115/s), 100M reads/day (~1.2k/s peak 10k)',
      'Avg paste 8 KB; 1% large up to 10 MB',
      '90% reads within 24h of create (long tail otherwise)',
    ],
    capacityEstimates: [
      '10M × 8 KB ≈ 80 GB/day raw; retention policy caps total storage',
      'Metadata: 10M rows/day × 200 B — Postgres or Dynamo fine with TTL',
      'CDN absorbs majority of read bandwidth',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `POST /v1/pastes  Content-Type: application/json
GET  /v1/pastes/{id}
DELETE /v1/pastes/{id}  (owner token)`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'PasteMeta: id (PK), owner_token_hash, size, created_at, expires_at, visibility, storage_key',
          'PasteContent: S3 key paste/{id} or inline if < 64 KB',
          'ViewCounter: paste_id, approx_views (async)',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Stateless API behind LB. Create writes metadata to Postgres and body to S3. Read checks metadata expiry → CDN → S3 on miss. Worker deletes expired objects.',
      },
    ],
    diagram: {
      mermaid: `flowchart LR
  User --> CDN[CDN]
  CDN -->|miss| API[API]
  API --> PG[(Postgres Meta)]
  API --> S3[(Object Storage)]
  API --> Q[View Queue]
  Q --> Analytics[(Counters)]`,
      caption: 'CDN-fronted reads; async view analytics',
    },
    dataFlow: [
      'Create: validate size → gen id → PUT S3 → INSERT meta → 201',
      'Read: GET meta → if expired 410 → else redirect CDN or stream S3',
      'Delete: verify owner → delete S3 + meta row',
      'Expiry worker: scan expires_at index → delete batch',
    ],
    storage: [
      'S3 Standard for hot; Glacier for archive tier if needed',
      'Postgres for metadata and expiry index',
      'Redis optional for hot paste cache',
    ],
    caching: [
      'CDN cache public/unlisted GET with Cache-Control max-age',
      'Do not cache private pastes at shared CDN without auth edge',
    ],
    asyncProcessing: [
      'View count aggregation',
      'Malware/abuse URL scanning on create',
      'Expiry sweeper and S3 lifecycle rules',
    ],
    scaling: [
      'Horizontally scale stateless API',
      'S3 scales automatically',
      'Read-heavy → CDN is primary scaler',
    ],
    consistency: [
      'Read-after-create: strong if meta+S3 write ordered (meta after S3)',
      'View counts eventual',
    ],
    reliability: [
      'Orphan S3 objects if meta insert fails — compensating delete job',
      'Idempotent create with client token optional',
    ],
    failureScenarios: [
      'S3 outage → serve stale CDN only for cached ids',
      'Id collision (rare) → retry generate',
      'Abuse flood → rate limit + CAPTCHA on create',
    ],
    security: [
      'Rate limit creates per IP',
      'Scan for phishing; DMCA takedown flow',
      'Unlisted ids must be high entropy',
      'Optional encryption at rest for private tier',
    ],
    observability: [
      'Create/read QPS, CDN hit ratio',
      'Storage growth and expiry backlog',
      'Abuse block rate',
    ],
    bottlenecks: [
      'Large paste uploads through API — use presigned direct-to-S3',
      'DB hot if CDN misconfigured',
    ],
    alternatives: [
      'GitHub Gists',
      'Inline DB for tiny pastes only',
    ],
    tradeoffs: [
      'Presigned upload complexity vs API bandwidth',
      'Exact view counts vs async approximate',
      'Client-side syntax highlight vs server render',
    ],
    interviewFollowUps: [
      'Custom short domain per user?',
      'Full-text search across public pastes?',
      'Multi-region active-active?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'Single server + MySQL TEXT column for content.',
        bottleneck: 'DB size and read load; no CDN.',
      },
      {
        stage: '2. Improve',
        description: 'S3 blobs + Postgres meta + CloudFront CDN.',
        bottleneck: 'API still proxies large uploads.',
      },
      {
        stage: '3. Improve',
        description: 'Presigned uploads; async views; expiry worker.',
        bottleneck: 'Single region latency globally.',
      },
      {
        stage: '4. Scale further',
        description: 'Multi-region S3 replication; edge auth for private tier; abuse ML pipeline.',
        bottleneck: 'Cross-region consistency for metadata.',
      },
    ],
  },
  tradeoffs: {
    advantages: ['Simple read-heavy pattern', 'CDN-friendly', 'Clear blob/metadata split'],
    disadvantages: ['Abuse magnet', 'Unlisted not truly private', 'Storage cost without TTL'],
    alternatives: ['Gist', 'S3 presigned link only'],
    whenToUse: ['Dev snippets', 'Support log sharing', 'Ephemeral config'],
    whenNotToUse: ['Collaborative editing (use Google Docs model)'],
  },
  failureModes: [
    'Sequential ids allow scraping all pastes',
    'Meta written before S3 → 404 on valid id',
    'CDN caching private content incorrectly',
  ],
  production: {
    performance: ['CDN for reads; direct S3 upload for large bodies'],
    scalability: ['Stateless API; object store backend'],
    reliability: ['Compensating transactions for S3+meta'],
    security: ['High-entropy ids, rate limits, abuse scanning'],
    observability: ['CDN hit rate, storage growth'],
    cost: ['S3 + egress; TTL reduces long-term cost'],
  },
  interview: {
    expectations: [
      'Blob vs metadata storage',
      'Short URL generation and enumeration',
      'CDN + TTL expiry story',
    ],
    commonQuestions: ['Design Pastebin', 'Where store large files?'],
    followUps: ['View analytics?', 'Custom domains?'],
    misconceptions: ['Store everything in SQL TEXT'],
    traps: ['Sequential paste ids'],
    strongSignals: ['S3 + CDN, random ids, async view counts, presigned upload'],
  },
}
