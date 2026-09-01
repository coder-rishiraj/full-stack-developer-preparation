import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'A web crawler systematically discovers and fetches web pages — frontier queue of URLs, politeness (robots.txt, rate limits), fetcher workers, parser extracts links, dedupe visited, store raw HTML for search index.',
  whyExists: 'Search engines and archivers need fresh copies of the public web. Manual indexing impossible at billions of pages; crawlers automate discovery respecting site policies.',
  mentalModel: 'BFS over the web graph: seed URLs → fetch → parse links → enqueue unseen → repeat. Separate URL frontier, fetch pool, content store, and index pipeline.',
  howItWorks: [
    { type: 'list', ordered: true, items: [
      'Seed URLs enqueued to frontier (priority queue per domain).',
      'Scheduler picks URL respecting per-host rate limit and robots.txt.',
      'Fetcher HTTP GET with timeouts; store response + headers.',
      'Parser extracts links; normalize URL (canonical, strip fragments).',
      'Dedupe bloom/set for seen URLs; enqueue new links.',
      'Hand off HTML to indexer pipeline asynchronously.',
    ] },
    { type: 'mermaid', diagram: 'flowchart LR\n  F[Frontier] --> Sch[Scheduler]\n  Sch --> Fetch[Fetchers]\n  Fetch --> Store[(Blob)]\n  Fetch --> Parse[Parser]\n  Parse --> F\n  Store --> Idx[Index pipeline]', caption: 'Crawler components' },
  ],
  example: [
    { type: 'code', language: 'python', code: '# politeness: max 1 req/sec per host\nif now - last_fetch[host] < 1.0: requeue(url)\nelse: fetch(url); last_fetch[host] = now', caption: 'Per-host rate limit' },
  ],
  tradeoffs: {
    advantages: [
      'Discovers deep web',
      'Fresh index',
    ],
    disadvantages: [
      'Politeness limits throughput',
      'Duplicate/near-duplicate content',
    ],
    alternatives: [
      'Sitemap-only ingest',
      'RSS feeds',
    ],
    whenToUse: [
      'Search engine',
      'Archival',
    ],
    whenNotToUse: [
      'Single-site scrape with known URLs',
    ],
  },
  failureModes: [
    'Ignore robots.txt → IP ban',
    'Infinite URL traps (calendars)',
    'Redirect loops',
    'Memory blow-up on frontier without disk spill',
  ],
  production: {
    performance: [
      'Async fetch pool',
      'DNS cache',
    ],
    scalability: [
      'Distributed frontier sharded by URL hash',
    ],
    reliability: [
      'Retry transient 5xx with backoff',
    ],
    observability: [
      'Fetch success rate, queue depth per host',
    ],
    cost: [
      'Store only changed content via hash',
    ],
  },
  interview: {
    expectations: [
      'Frontier, politeness, dedupe, parser',
    ],
    commonQuestions: [
      'Design web crawler',
    ],
    followUps: [
      'Detect duplicate pages?',
      'Priority crawling?',
    ],
    misconceptions: [
      'Unlimited parallel fetch OK',
    ],
    traps: [
      'No per-domain rate limit',
    ],
    strongSignals: [
      'robots.txt, bloom dedupe, async index handoff',
    ],
  },
  keyTakeaways: [
    'Frontier + scheduler + fetchers',
    'Politeness per host mandatory',
    'URL normalization + dedupe',
    'Separate crawl from index pipeline',
    'Trap detection for infinite URLs',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why rate limit per domain?', answerHint: 'Avoid overloading sites; robots.txt compliance.' },
    { level: 'intermediate', question: 'URL dedupe at scale?', answerHint: 'Bloom filter + disk-backed seen set; canonicalize URLs.' },
    { level: 'advanced', question: 'Priority crawl for news?', answerHint: 'Boost PageRank/recency in frontier priority queue.' },
  ],
  flashcards: [
    { front: 'Frontier', back: 'Queue of URLs waiting to be fetched' },
    { front: 'robots.txt', back: 'Site policy for allowed paths and crawl rate' },
    { front: 'Canonical URL', back: 'Normalized form to dedupe http/https/www variants' },
  ],
  quickRevision: [
    'Seed → frontier',
    'Per-host politeness',
    'Fetch → parse links',
    'Dedupe bloom',
    'Blob store → indexer',
    'Trap detection',
  ],
  systemDesign: {
    problem: 'Design web crawler: crawl 1B pages/month, respect robots, detect duplicates, feed search indexer.',
    requirements: {
      functional: [
        'Discover URLs from seeds and links',
        'Fetch and store page content',
        'Extract links for frontier',
        'Respect robots.txt',
        'Prioritize important pages',
      ],
      nonFunctional: [
        'Politeness 1 req/s/host default',
        'Dedupe across cluster',
        'Handle 404/redirects',
        'Fresh news within hours',
      ],
    },
    scaleAssumptions: [
      '1B pages/month',
      '10k fetch workers',
      '100M URL frontier',
    ],
    capacityEstimates: [
    ],
    dataFlow: [
      'Enqueue seed URLs',
      'Scheduler rate-limits per host',
      'Worker fetches → store blob',
      'Parser enqueues new URLs',
      'Indexer consumes new pages',
    ],
    storage: [
      'Blob store for HTML',
      'Cassandra for URL state',
    ],
    caching: [
      'DNS cache',
      'robots.txt cache per host',
    ],
    asyncProcessing: [
      'Stream processing for rollups',
    ],
    scaling: [
      'Horizontal stateless tier',
    ],
    consistency: [
      'Eventual for analytics; strong for billing',
    ],
    reliability: [
      'Idempotent writes; retries with backoff',
    ],
    failureScenarios: [
      'Hot keys; worker crash; partial outage',
    ],
    security: [
      'AuthN/Z; rate limits; input validation',
    ],
    observability: [
      'Metrics, tracing, SLO dashboards',
    ],
    bottlenecks: [
      'Write amplification on hot advertisers',
    ],
    alternatives: [
      'Batch ETL instead of real-time',
    ],
    tradeoffs: [
      'Accuracy vs latency',
    ],
    interviewFollowUps: [
      'How detect near-duplicate content?',
      'Deep web vs surface?',
    ],
    api: [
    { type: 'code', language: 'http', code: 'POST /admin/seeds {urls[]}\nGET /stats frontier_depth fetch_rate' },
    ],
    dataModel: [
    { type: 'list', items: [
      'UrlEntry: url_hash, status pending|done, priority, host',
      'FetchResult: url, status_code, content_hash, fetched_at',
      'HostPolicy: host, robots_rules, last_fetch_ts',
    ] },
    ],
    highLevelArchitecture: [
    { type: 'paragraph', text: 'Clients → LB → stateless services → data stores.' },
    ],
    diagram: {
      mermaid: 'flowchart TB\n  Seed[Seeds] --> Q[Frontier PQ]\n  Q --> Sched[Scheduler]\n  Sched --> W[Worker pool]\n  W --> S3[(Page store)]\n  W --> P[Link parser]\n  P --> Q\n  S3 --> Idx[Indexer]',
      caption: 'Distributed crawler',
    },
    evolution: [
      { stage: '1. MVP', description: 'Monolith + SQL aggregates.', bottleneck: 'Write load.' },
      { stage: '2. Scale', description: 'Kafka + stream processors.', bottleneck: 'Ops complexity.' },
      { stage: '3. Global', description: 'Regional shards + merge.', bottleneck: 'Cross-region consistency.' },
    ],
  },
}
