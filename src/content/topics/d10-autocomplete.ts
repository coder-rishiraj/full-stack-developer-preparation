import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Search autocomplete (typeahead) suggests query completions as the user types, ranked by popularity, personalization, and prefix match — typically served in under 50ms from precomputed indexes.',
  whyExists:
    'Raw database LIKE queries cannot serve billions of prefix lookups at interactive latency. Autocomplete improves discovery, reduces typos, and drives conversion on search-heavy products.',
  mentalModel:
    'Offline jobs aggregate search logs into ranked (prefix → top-k terms) structures. Online path: normalize keystrokes → lookup trie or search index by prefix → merge personal/recent/trending → return JSON in one RTT.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Build pipeline: ingest query logs → count frequencies → generate prefix keys (e.g., "app" → "apple", "application") → store in trie, Elasticsearch completion suggester, or custom FST. Serve via CDN edge or regional API with aggressive caching.',
    },
    {
      type: 'mermaid',
      caption: 'Offline build vs online read path',
      diagram: `flowchart LR
  Logs[Search Logs] --> Spark[Batch Aggregator]
  Spark --> Trie[(Prefix Index)]
  User --> API[Autocomplete API]
  API --> Trie
  API --> Cache[(Redis/CDN)]`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Typical API',
      code: `GET /v1/suggest?q=app&limit=10&locale=en-US
→ 200 { "suggestions": [
  { "text": "apple", "score": 0.92 },
  { "text": "application", "score": 0.81 }
]}`,
    },
  ],
  keyTakeaways: [
    'Precompute prefix → top-k; never scan full corpus per keystroke.',
    'Debounce client requests; server-side rate limit abusive IPs.',
    'Separate trending (hot) from stable catalog suggestions.',
    'Personalization is a merge layer, not the primary index.',
    'Evolve: DB LIKE → trie → distributed index + ML ranking.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why not query the database on every keystroke?',
      answerHint: 'Latency, load, poor prefix ranking at scale.',
    },
    {
      level: 'intermediate',
      question: 'How do you handle "appl" vs "apple" fuzzy match?',
      answerHint: 'Prefix first; optional edit-distance on top-k or n-gram index.',
    },
    {
      level: 'advanced',
      question: 'How to update trending queries in near real time?',
      answerHint: 'Stream counters (Kafka+Flink) merge into hot tier; periodic snapshot to cold index.',
    },
  ],
  flashcards: [
    { front: 'Core autocomplete data structure', back: 'Trie / FST / ES completion field for prefix lookup' },
    { front: 'Latency target', back: 'Often p99 < 50ms; CDN cache for common prefixes' },
    { front: 'Ranking signals', back: 'Frequency, recency, geo, personalization, safety filters' },
  ],
  quickRevision: [
    'Offline aggregate logs → prefix index',
    'Top-k per prefix, not full scan',
    'Debounce + rate limit client',
    'Cache hot prefixes at edge',
    'Filter unsafe / NSFW suggestions',
    'Personalization merge after global top-k',
  ],
  systemDesign: {
    problem:
      'Design a search autocomplete system for a global search bar (Google-style) supporting 500M DAU, sub-50ms suggestions, and hourly trending updates.',
    requirements: {
      functional: [
        'Return top 10 suggestions for prefix (min 2 chars)',
        'Support locale and safe-search filtering',
        'Blend global popularity with user recent searches',
        'Admin blocklist for abusive terms',
      ],
      nonFunctional: [
        'p99 latency < 50ms',
        '99.99% availability for read path',
        'Suggestions fresh within 1 hour for trending',
        'Handle flash trends without index rebuild lag',
      ],
    },
    scaleAssumptions: [
      '500M DAU, 10 searches/user/day → ~50M QPS peak typeahead (debounced ~5–10M effective)',
      '~10M unique query strings in index',
      'Avg suggestion payload ~500 bytes',
    ],
    capacityEstimates: [
      '10M prefixes × avg 20 suggestions × 50 B ≈ tens of GB index (FST compresses well)',
      '10M QPS × 500 B ≈ 5 GB/s egress — CDN + regional clusters',
      'Log ingest: 50M searches/day × 100 B ≈ 5 TB/day raw logs',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `GET /v1/suggest?q={prefix}&limit=10&locale=en&user_id=...
→ 200 { suggestions: [{ text, score, type: "trending"|"personal" }] }`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'QueryStat: normalized_query, locale, count_24h, count_7d, last_seen',
          'PrefixBucket: prefix_key, ranked_query_ids[] (top 100)',
          'UserRecent: user_id, recent_queries[] (LRU 20)',
          'Blocklist: term, reason',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Batch pipeline builds global prefix index from logs. Streaming layer updates hot counters. Autocomplete API reads from in-memory/sharded index replicas + Redis for personalization. CDN caches anonymous hot prefixes.',
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  Client --> CDN[CDN / Edge]
  CDN -->|miss| API[Suggest API]
  API --> Index[(Prefix Index Shards)]
  API --> Redis[(User Recent)]
  Logs --> Kafka[Kafka]
  Kafka --> Flink[Stream Aggregator]
  Flink --> Hot[Hot Counter Store]
  Batch[Daily Spark Job] --> Index
  Hot --> Index`,
      caption: 'Batch cold index + streaming hot updates',
    },
    dataFlow: [
      'User types → debounced GET with prefix',
      'API normalizes (lowercase, trim, locale rules)',
      'Fetch global top-k from local index shard',
      'Merge user recent + trending boost from hot store',
      'Apply blocklist and safe-search; return JSON',
    ],
    storage: [
      'Object storage for raw logs',
      'FST/trie files on SSD per shard',
      'Redis for per-user recent queries',
      'Postgres for blocklist and admin config',
    ],
    caching: [
      'CDN cache public prefixes (TTL 60s)',
      'In-process LRU for top 10k prefixes per API pod',
      'Immutable index snapshots versioned; swap atomically',
    ],
    asyncProcessing: [
      'Hourly/daily Spark job rebuilds base index',
      'Flink aggregates query counts for trending overlay',
      'Safety ML classifier async flags terms for blocklist review',
    ],
    scaling: [
      'Shard prefix index by first 2–3 chars hash',
      'Read replicas per region; write pipeline centralized or regional merge',
      'Separate hot-tier for viral queries',
    ],
    consistency: [
      'Global index eventually consistent (hourly)',
      'Trending overlay near-real-time (minutes)',
      'Personal recent: read-your-writes via Redis primary in region',
    ],
    reliability: [
      'Stale index fallback if build fails',
      'Degrade to cached top prefixes on shard outage',
      'Circuit-break personalization if Redis slow',
    ],
    failureScenarios: [
      'Bad deploy serves offensive suggestions → rollback index version + blocklist',
      'Flash trend ("celebrity death") — hot tier overload → pre-warm + rate limit',
      'Index corruption → serve previous snapshot',
    ],
    security: [
      'Rate limit by IP/user to prevent scraping',
      'Blocklist injection / XSS in suggestions (escape output)',
      'Do not leak private user queries in global suggestions',
    ],
    observability: [
      'p99 latency, cache hit ratio',
      'Empty suggestion rate by prefix length',
      'Index build lag and version age',
    ],
    bottlenecks: [
      'Index rebuild time for full corpus',
      'Hot key prefixes during events',
      'Personalization Redis fan-out at scale',
    ],
    alternatives: [
      'Elasticsearch completion suggester',
      'Client-side dictionary for offline apps',
      'Third-party Algolia/Typesense hosted',
    ],
    tradeoffs: [
      'Precomputed accuracy vs real-time freshness',
      'Personalization depth vs latency',
      'FST compression vs update flexibility',
    ],
    interviewFollowUps: [
      'How handle multi-byte / CJK tokenization?',
      'Design fuzzy autocomplete for typos?',
      'How prevent suggestion bias or manipulation?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'Postgres prefix LIKE + ORDER BY count LIMIT 10.',
        bottleneck: 'Full table scan; cannot scale past modest QPS.',
      },
      {
        stage: '2. Improve',
        description: 'Offline trie in memory; nightly rebuild from logs.',
        bottleneck: 'Rebuild lag; single host memory limit.',
      },
      {
        stage: '3. Improve',
        description: 'Sharded FST index + Redis recent + CDN cache.',
        bottleneck: 'Trending updates still batch-bound.',
      },
      {
        stage: '4. Scale further',
        description: 'Streaming hot overlay + ML ranker + multi-region active-active reads.',
        bottleneck: 'Ranking complexity; index version coordination.',
      },
    ],
  },
  tradeoffs: {
    advantages: ['Fast discovery UX', 'Reduces server load vs full search', 'Captures long-tail via logs'],
    disadvantages: ['Stale suggestions without streaming layer', 'Storage for all prefixes', 'Safety moderation cost'],
    alternatives: ['Full search on Enter only', 'Static curated lists'],
    whenToUse: ['Search bars', 'E-commerce', 'Maps POI lookup'],
    whenNotToUse: ['Tiny catalogs where client-side filter suffices'],
  },
  failureModes: [
    'Serving outdated or offensive trending terms',
    'Thundering herd on single-char prefixes',
    'Personalization leaking one user queries to another',
  ],
  production: {
    performance: ['CDN + in-memory index; avoid network on hot path'],
    scalability: ['Shard by prefix; separate hot tier'],
    reliability: ['Versioned index rollback; graceful degradation'],
    security: ['Blocklist, rate limits, output encoding'],
    observability: ['Latency SLO, cache hit rate, index freshness'],
    cost: ['Log storage and batch compute; CDN egress'],
  },
  interview: {
    expectations: [
      'Separate offline build from online read',
      'Discuss trie/FST and top-k per prefix',
      'Address trending freshness and safety',
    ],
    commonQuestions: ['Design search autocomplete', 'How update suggestions in real time?'],
    followUps: ['Fuzzy match?', 'Personalization without latency spike?'],
    misconceptions: ['Elasticsearch alone solves prefix at Google scale without custom tier'],
    traps: ['Querying OLTP DB per keystroke'],
    strongSignals: ['Mentions debounce, FST, hot/cold tiers, blocklist'],
  },
}
