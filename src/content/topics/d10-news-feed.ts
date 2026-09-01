import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A news feed (Twitter/Facebook home timeline) aggregates posts from followed users and ranks them for each viewer — balancing freshness, relevance, and read scalability at billions of events per day.',
  whyExists:
    'Naive "query all friends posts sorted by time" does not scale for celebrities with millions of followers. Feeds need fan-out on write, fan-out on read, or hybrid strategies plus ranking layers.',
  mentalModel:
    'Post created → fan-out to followers timelines (push) OR store post and merge on read (pull). Hybrid: push for normal users, pull for celebrities. Ranker scores cached timeline candidates. CDN not applicable; Redis/cache holds hot timelines.',
  howItWorks: [
    {
      type: 'paragraph',
      text: "Write path: insert post in DB, publish event. Fan-out worker pushes post_id into each follower's timeline cache (Redis sorted set by timestamp). Read path: GET timeline from cache slice; if miss rebuild from graph. Ranking ML model reranks top N.",
    },
    {
      type: 'mermaid',
      caption: 'Fan-out on write vs read',
      diagram: `flowchart TB
  Post[New Post] --> W{Fan-out strategy}
  W -->|push| TL1[User timelines Redis]
  W -->|pull| Celeb[Celebrity post list]
  Read[Feed read] --> TL1
  Read --> Celeb`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Feed API',
      code: `GET /v1/feed?cursor=...&limit=20
→ 200 { "items": [{ "post_id", "author", "text", "score" }], "next_cursor" }`,
    },
  ],
  keyTakeaways: [
    'Fan-out on write: fast read, heavy write for popular authors.',
    'Fan-out on read: cheap write, slow read for users following many.',
    'Hybrid: push normal, pull celebrities — industry standard.',
    'Timeline cache: Redis ZSET post_id scored by time/rank.',
    'Evolve: chronological pull → push fan-out → hybrid + ML rank.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Push vs pull fan-out?',
      answerHint: 'Push precomputes timelines; pull merges at read — trade write vs read cost.',
    },
    {
      level: 'intermediate',
      question: 'Celebrity with 50M followers posts — what happens?',
      answerHint: 'Do not push 50M writes; pull merge celebrity posts at read time.',
    },
    {
      level: 'advanced',
      question: 'How rank feed with ML without 500ms latency?',
      answerHint: 'Precompute features async; rank top 500 candidates from cache; two-stage retrieval.',
    },
  ],
  flashcards: [
    { front: 'Hybrid fan-out', back: 'Push if followers < threshold; else pull for celebrity' },
    { front: 'Timeline store', back: 'Redis ZSET: member post_id, score timestamp' },
    { front: 'Hot key risk', back: 'Celebrity timeline read — shard cache or pull model' },
  ],
  quickRevision: [
    'Post → fan-out service',
    'Hybrid push/pull threshold ~10k followers',
    'Redis timeline cache per user',
    'Ranker on read top-K',
    'Cursor pagination',
    'Async fan-out via Kafka',
  ],
  systemDesign: {
    problem:
      'Design Twitter home timeline for 300M DAU, 500M posts/day, follow graph, sub-200ms feed load p99.',
    requirements: {
      functional: [
        'Create post (text, media)',
        'Follow/unfollow users',
        'Home timeline ranked reverse-chronological + optional ML rank',
        'Like/comment counts on posts',
      ],
      nonFunctional: [
        'Feed read p99 < 200ms',
        'Post visible to followers within seconds',
        'Handle celebrities (10M+ followers)',
        'Eventually consistent counts OK',
      ],
    },
    scaleAssumptions: [
      '300M DAU, 500M posts/day (~6k/s)',
      'Avg user follows 200; avg 200 followers',
      '1% users are heavy (10k+ followers)',
    ],
    capacityEstimates: [
      'Push fan-out: 6k posts/s × 200 followers ≈ 1.2M timeline writes/s average',
      'Timeline cache: 300M users × 500 post_ids × 8 B ≈ hundreds of GB Redis cluster',
      'Post storage: 500M × 1 KB/day ≈ 500 GB/day — sharded Cassandra',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `POST /v1/posts
GET  /v1/feed?cursor=
POST /v1/follow/{user_id}
DELETE /v1/follow/{user_id}`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'Post: post_id, author_id, content, created_at, media_refs',
          'Follow: follower_id, followee_id, created_at',
          'UserTimeline (cache): user_id → ZSET(post_id, score)',
          'CelebrityPostList: author_id → recent post_ids',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Post service writes to Cassandra and emits Kafka event. Fan-out workers consume: if author followers < 10k, push to follower Redis timelines; else add to celebrity list only. Feed service merges cached timeline + celebrity pulls + ranking.',
      },
    ],
    diagram: {
      mermaid: `flowchart LR
  PS[Post Service] --> Cass[(Posts)]
  PS --> Kafka[Kafka]
  Kafka --> FO[Fan-out Workers]
  FO --> Redis[(Timeline Cache)]
  FS[Feed Service] --> Redis
  FS --> Cass
  FS --> Rank[Ranker]`,
      caption: 'Async fan-out with hybrid celebrity handling',
    },
    dataFlow: [
      'User posts → persist → Kafka fan-out event',
      'Worker loads follower list (cached graph service)',
      'Push post_id to each follower ZSET (trim to 1000)',
      'Feed read: ZRANGE timeline + fetch celebrity posts + merge sort',
      'Hydrate post bodies batch from Cassandra',
      'Optional ranker rescores top 100',
    ],
    storage: [
      'Cassandra posts by post_id and user_id timeline',
      'Redis cluster for user timelines',
      'Graph DB or sharded SQL for follow edges',
    ],
    caching: [
      'Timeline ZSET is primary cache',
      'Follow list cache per user',
      'Post body cache for viral posts',
    ],
    asyncProcessing: [
      'Fan-out workers (can lag seconds under load)',
      'Counter aggregation for likes',
      'ML feature pipeline for ranking',
    ],
    scaling: [
      'Shard Redis by user_id',
      'Fan-out worker pool scales with Kafka partitions',
      'Separate read replicas for post hydration',
    ],
    consistency: [
      'Timeline eventually consistent (seconds lag OK)',
      'Like counts eventual',
      'Follow edge strong for next fan-out',
    ],
    reliability: [
      'Fan-out retry from Kafka',
      'Timeline rebuild job if cache lost',
      'Rate limit post creation',
    ],
    failureScenarios: [
      'Celebrity post without hybrid → fan-out storm',
      'Redis loss → cold rebuild from follow graph + posts (slow)',
      'Hot post hydration overload → cache viral posts',
    ],
    security: [
      'AuthZ: only show posts user allowed to see',
      'Block/mute filters on feed merge',
      'Rate limit posting and scraping feeds',
    ],
    observability: [
      'Fan-out lag, timeline cache hit rate',
      'Feed latency breakdown (merge vs hydrate vs rank)',
      'Celebrity pull ratio',
    ],
    bottlenecks: [
      'Fan-out write amplification',
      'Celebrity follower list size',
      'Ranker latency if too many candidates',
    ],
    alternatives: [
      'Pure pull only (Instagram explore different problem)',
      'Activity streams API (GetStream hosted)',
    ],
    tradeoffs: [
      'Push vs pull vs hybrid complexity',
      'Freshness vs fan-out cost',
      'Chronological vs engagement ranking',
    ],
    interviewFollowUps: [
      'Design @mention notification?',
      'Private accounts fan-out?',
      'Delete post propagation?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'Pull: on feed load query all friends posts ORDER BY time.',
        bottleneck: 'Read query explodes with follow count.',
      },
      {
        stage: '2. Improve',
        description: 'Fan-out on write to Redis timelines.',
        bottleneck: 'Celebrity post melts fan-out workers.',
      },
      {
        stage: '3. Improve',
        description: 'Hybrid threshold + async Kafka fan-out.',
        bottleneck: 'Ranking latency; cache memory cost.',
      },
      {
        stage: '4. Scale further',
        description: 'ML two-stage rank; geo-sharded Redis; social graph service.',
        bottleneck: 'Ranking fairness; operational Redis scale.',
      },
    ],
  },
  tradeoffs: {
    advantages: ['Fast feed reads with push', 'Scales normal users well'],
    disadvantages: ['Write amplification', 'Celebrity edge cases', 'Stale fan-out lag'],
    alternatives: ['Pull-only for small networks', 'Hosted activity feed SaaS'],
    whenToUse: ['Social timelines', 'Activity streams'],
    whenNotToUse: ['Static content sites'],
  },
  failureModes: [
    'Missing hybrid → celebrity kills fan-out',
    'Unbounded timeline ZSET memory',
    'Feed shows blocked user until cache trim',
  ],
  production: {
    performance: ['Batch hydrate posts; rank top-K only'],
    scalability: ['Hybrid fan-out; Redis sharding'],
    reliability: ['Kafka replay fan-out; timeline rebuild'],
    security: ['Privacy filters on merge'],
    observability: ['Fan-out lag SLO'],
    cost: ['Redis memory for timelines — trim depth'],
  },
  interview: {
    expectations: [
      'Explain push/pull/hybrid clearly',
      'Celebrity scenario is mandatory',
      'Timeline cache structure',
    ],
    commonQuestions: ['Design Twitter feed', 'Fan-out on write vs read'],
    followUps: ['Ranking?', 'Delete post?'],
    misconceptions: ['Always push to all followers'],
    traps: ['SQL JOIN friends posts at read time'],
    strongSignals: ['Hybrid threshold, Redis ZSET, Kafka async fan-out, hydrate batch'],
  },
}
