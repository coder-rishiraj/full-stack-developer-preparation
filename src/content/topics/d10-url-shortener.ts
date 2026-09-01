import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'A URL shortener maps short codes to long URLs — optimized for fast redirects, unique key generation, analytics, and abuse resistance at billions of clicks.',
  whyExists: 'Long URLs break SMS/social limits and are ugly. Shorteners need O(1) lookup redirects, optional custom aliases, click analytics, and TTL for ephemeral links.',
  mentalModel: 'Short code is primary key → long URL row or cache entry. Redirect 301/302 from edge. Create: hash or random base62 + collision check. Read-heavy — CDN/cache fronting.',
  howItWorks: [
    { type: 'paragraph', text: 'Generate 7-char base62 id (or counter + obfuscation). Store mapping in SQL/Dynamo with long_url, owner, created_at, expires_at. Redirect service reads cache-aside Redis then DB. Analytics async via click stream to Kafka.' },
  ],
  example: [
    { type: 'code', language: 'http', code: "POST /api/shorten { \"url\": \"https://...\" }\n→ 201 { \"short\": \"https://go/x7Kp2\" }\n\nGET /x7Kp2 → 302 Location: long URL" },
  ],
  keyTakeaways: [
    'Random base62 avoids enumeration vs sequential ids',
    '302 vs 301 tradeoff for analytics vs SEO',
    'Cache hot codes at CDN/Redis',
    'Separate read redirect path from admin API',
    'Evolve: single DB → cache-aside → geo CDN',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'How generate unique short codes?', answerHint: 'Random base62 + DB unique constraint retry; or Snowflake encoded.' },
    { level: 'intermediate', question: '301 vs 302 redirect?', answerHint: '301 cached by browsers — hurts analytics; 302 allows counting each click.' },
    { level: 'advanced', question: '10B redirects/day architecture?', answerHint: 'CDN edge redirect table; origin on miss; async analytics; regional cache.' },
  ],
  flashcards: [
    { front: '302 vs 301', back: '302 for click tracking; 301 permanent SEO' },
    { front: 'Id generation', back: 'Random base62, not sequential integers' },
    { front: 'Read pattern', back: 'Cache-aside Redis + CDN for hot links' },
  ],
  quickRevision: [
    'POST shorten → code',
    'GET redirect 302',
    'Redis cache-aside',
    'Async click analytics',
    'Rate limit create',
    'High entropy codes',
  ],
  systemDesign: {
    problem: 'Design bit.ly: 100M new URLs/month, 10:1 read/write, 100B redirects/month, custom aliases optional.',
    requirements: {
      functional: [
        'Shorten URL',
        'Redirect by code',
        'Custom alias (premium)',
        'Analytics dashboard',
        'Link expiry',
      ],
      nonFunctional: [
        'Redirect p99 < 50ms',
        'No lost mappings',
        'Prevent link enumeration',
        'Global low latency',
      ],
    },
    scaleAssumptions: [
    '100M creates/month (~40/s avg)',
    '1B redirects/day (~12k/s avg, 100k peak)',
    'Avg long URL 100 chars',
    ],
    capacityEstimates: [
    '100M rows/month × 200 B meta ≈ 20 GB/month metadata',
    'Redirect bandwidth dominated by 302 headers not bodies',
    'Redis: top 1% links serve 80% reads',
    ],
    api: [
    { type: 'code', language: 'http', code: "POST /v1/links\nGET  /{code}  → 302\nGET  /v1/links/{code}/stats" },
    ],
    dataModel: [
    { type: 'list', items: [
      'Link: code PK, long_url, user_id, created_at, expires_at, click_count_approx',
      'CustomAlias: alias PK → code FK',
    ] },
    ],
    highLevelArchitecture: [
    { type: 'paragraph', text: 'Clients → CDN/LB → stateless services → data stores.' },
    ],
    diagram: {
      mermaid: "flowchart LR\n  User --> CDN[CDN/Edge]\n  CDN -->|miss| RS[Redirect Svc]\n  RS --> Redis[(Redis)]\n  RS --> DB[(Links DB)]\n  RS --> Q[Click Queue]",
      caption: 'High-level request path',
    },
    dataFlow: [
    'Create: validate URL → gen code → insert → return short URL',
    'Redirect: lookup cache → DB on miss → 302 + enqueue click',
    'Analytics worker aggregates clicks',
    ],
    storage: [
    'Primary database; object store for blobs if needed',
    ],
    caching: [
    'Redis cache-aside per code',
    'CDN cache 302 with short TTL if analytics need origin hits',
    ],
    asyncProcessing: [
    'Click aggregation',
    'Malware URL scan on create',
    ],
    scaling: [
    'Horizontal stateless tier; shard data by key',
    ],
    consistency: [
    'Strong for money/auth; eventual for analytics',
    ],
    reliability: [
    'Retries with backoff; idempotent writes',
    ],
    failureScenarios: [
    'Hot keys; dependency timeout; partial outage',
    ],
    security: [
    'AuthN/Z, rate limits, input validation',
    ],
    observability: [
    'RED/USE metrics, tracing, SLO dashboards',
    ],
    bottlenecks: [
    'Viral link hot key in Redis',
    'DB on cache cold start',
    ],
    alternatives: [
    'Managed SaaS for non-differentiating parts',
    ],
    tradeoffs: [
    'Complexity vs time-to-market',
    ],
    interviewFollowUps: [
    'Custom domain per user?',
    'Preview page before redirect?',
    ],
    evolution: [
      { stage: '1. Simple design', description: 'Monolith + single DB.', bottleneck: 'Vertical scale limit.', },
      { stage: '2. Improve', description: 'Cache + read replicas.', bottleneck: 'Write bottleneck remains.', },
      { stage: '3. Improve', description: 'Async pipeline + sharding.', bottleneck: 'Ops complexity.', },
      { stage: '4. Scale further', description: 'Geo partition + dedicated services.', bottleneck: 'Consistency across regions.', },
    ],
  },
  tradeoffs: {
    advantages: [
    'Simple read-heavy cache pattern',
    ],
    disadvantages: [
    'Abuse/phishing links',
    'Cache vs analytics tension',
    ],
    alternatives: [
    'Browser bookmark',
    'DNS-level short domains',
    ],
    whenToUse: [
    'Marketing links',
    'SMS campaigns',
    ],
    whenNotToUse: [
    'When you need end-to-end encryption of destination',
    ],
  },
  failureModes: [
    'Sequential ids scraped',
    'Cache stampede on viral link',
    'Malware link reputation damage',
  ],
  production: {
    performance: [
      'Edge redirect; minimal response body',
    ],
    scalability: [
      'Redis cluster; read replicas',
    ],
    reliability: [
      'Unique constraint on code gen retry',
    ],
    security: [
      'Blocklist URLs; rate limit create',
    ],
    observability: [
      'Redirect latency, cache hit ratio',
    ],
    cost: [
      'CDN egress minimal for 302',
    ],
  },
  interview: {
    expectations: [
      'Base62 ids, cache-aside, 302 analytics',
    ],
    commonQuestions: [
      'Design URL shortener',
    ],
    followUps: [
      'Custom alias collision?',
    ],
    misconceptions: [
      'Store only in cache',
    ],
    traps: [
      'Auto-increment ids',
    ],
    strongSignals: [
      '302 + async clicks, random codes, CDN',
    ],
  },
}
