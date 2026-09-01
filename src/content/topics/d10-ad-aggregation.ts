import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Ad-click aggregation counts and bills ad impressions/clicks in near real time — ingest high-volume click events, dedupe fraud, roll up by campaign/advertiser/time window, expose dashboards and billing APIs.',
  whyExists: 'Advertisers pay per click/impression. Raw events are billions/day; billing needs accurate, timely aggregates with audit trails and fraud filtering.',
  mentalModel: 'Firehose of click JSON → stream processor windows counts per ad_id/minute → materialized counters in KV/OLAP → billing job reads daily totals.',
  howItWorks: [
    { type: 'list', items: [
      'Ingest: beacon pixel or redirect logs click with ad_id, user_id hash, timestamp, request_id.',
      'Stream: Kafka partition by ad_id; Flink/Spark streaming tumbling windows.',
      'Dedupe: idempotent on request_id; bot filter via rate/heuristics.',
      'Store: Redis HyperLogLog or counters for real-time; ClickHouse/BigQuery for analytics.',
      'Billing: daily batch reconciles stream totals with audit log.',
    ] },
    { type: 'mermaid', diagram: 'flowchart LR\n  Ad[Ad beacon] --> K[Kafka]\n  K --> SP[Stream processor]\n  SP --> R[(Redis counters)]\n  SP --> OLAP[(ClickHouse)]\n  OLAP --> Bill[Billing]', caption: 'Click aggregation pipeline' },
  ],
  example: [
    { type: 'code', language: 'json', code: '{"ad_id":"a1","campaign":"c9","ts":1710000000,"req_id":"uuid"}', caption: 'Click event' },
  ],
  tradeoffs: {
    advantages: [
      'Real-time dashboards',
      'Scalable via partitioning',
    ],
    disadvantages: [
      'Eventual counts; dedupe complexity',
    ],
    alternatives: [
      'Batch-only Hadoop nightly',
    ],
    whenToUse: [
      'Ad networks, attribution',
    ],
    whenNotToUse: [
      'Low-volume internal analytics',
    ],
  },
  failureModes: [
    'Duplicate billing without idempotent req_id',
    'Hot ad_id skews partition',
    'Late events miss window without allowed lateness',
    'Bot traffic inflates counts',
  ],
  production: {
    performance: [
      'Partition by ad_id',
      'Pre-aggregate in stream',
    ],
    scalability: [
      'Kafka + horizontal Flink',
    ],
    reliability: [
      'At-least-once + dedupe store',
    ],
    observability: [
      'Lag, duplicate rate, fraud block %',
    ],
    cost: [
      'Tier cold analytics to columnar store',
    ],
  },
  interview: {
    expectations: [
      'Stream windows, dedupe, hot keys',
    ],
    commonQuestions: [
      'Design ad click aggregator',
    ],
    followUps: [
      'Fraud detection?',
      'Exactly-once billing?',
    ],
    misconceptions: [
      'SQL GROUP BY on raw table at scale',
    ],
    traps: [
      'Synchronous counter UPDATE per click',
    ],
    strongSignals: [
      'Kafka, idempotent keys, OLAP, late data handling',
    ],
  },
  keyTakeaways: [
    'Ingest at scale via log/stream',
    'Idempotent dedupe essential',
    'Windowed aggregation not per-row SQL',
    'Separate real-time vs billing batch',
    'Watch hot key skew',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why stream not DB update per click?', answerHint: 'Write QPS exceeds DB; partition stream scales.' },
    { level: 'intermediate', question: 'Dedupe strategy?', answerHint: 'Unique req_id in Redis/Bloom with TTL.' },
    { level: 'advanced', question: 'Late arriving clicks?', answerHint: 'Allowed lateness + watermark; reconcile in batch.' },
  ],
  flashcards: [
    { front: 'Tumbling window', back: 'Fixed non-overlapping time buckets for counts' },
    { front: 'Idempotent click', back: 'Same req_id processed once for billing' },
    { front: 'Hot key', back: 'Viral ad skews one partition — salting mitigates' },
  ],
  quickRevision: [
    'Beacon → Kafka',
    'Stream windows',
    'Dedupe req_id',
    'Redis real-time',
    'OLAP analytics',
    'Batch billing reconcile',
  ],
  systemDesign: {
    problem: 'Design ad-click aggregation: 10B clicks/day, p99 dashboard lag < 1 min, billing accuracy 99.99%.',
    requirements: {
      functional: [
        'Ingest clicks',
        'Real-time counts per ad/campaign',
        'Advertiser dashboard',
        'Daily billing export',
        'Fraud filter',
      ],
      nonFunctional: [
        'Ingest 100k+ events/sec',
        'Idempotent dedupe',
        'Audit trail 7 years',
        'Dashboard p99 < 60s lag',
      ],
    },
    scaleAssumptions: [
      '10B clicks/day',
      '100k peak QPS',
      '1M active ads',
    ],
    capacityEstimates: [
      'Kafka ~500 partitions',
      'Flink 50 workers',
      'ClickHouse columnar for queries',
    ],
    dataFlow: [
      'Click POST → validate → Kafka',
      'Flink window aggregate → Redis + CH',
      'Dashboard reads Redis',
      'Nightly billing reads CH',
    ],
    storage: [
      'Primary DB + object store as needed',
    ],
    caching: [
      'Redis hot aggregates',
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
      'Hot campaign partition',
      'CH query cost on raw events',
    ],
    alternatives: [
      'Batch ETL instead of real-time',
    ],
    tradeoffs: [
      'Accuracy vs latency',
    ],
    interviewFollowUps: [
      'Attribution multi-touch?',
      'Click fraud ML pipeline?',
    ],
    api: [
    { type: 'code', language: 'http', code: 'POST /v1/click {ad_id, req_id}\nGET /v1/campaigns/{id}/stats?window=1h' },
    ],
    dataModel: [
    { type: 'list', items: [
      'ClickEvent: req_id PK, ad_id, ts, user_hash',
      'AggregateMinute: ad_id, window, count',
      'BillingDaily: advertiser_id, date, amount',
    ] },
    ],
    highLevelArchitecture: [
    { type: 'paragraph', text: 'Clients → LB → stateless services → data stores.' },
    ],
    diagram: {
      mermaid: 'flowchart TB\n  B[Beacon] --> Ingest[Ingest API]\n  Ingest --> K[Kafka]\n  K --> F[Flink]\n  F --> Redis[(Redis)]\n  F --> CH[(ClickHouse)]\n  Dash[Dashboard] --> Redis\n  Bill[Billing] --> CH',
      caption: 'Aggregation architecture',
    },
    evolution: [
      { stage: '1. MVP', description: 'Monolith + SQL aggregates.', bottleneck: 'Write load.' },
      { stage: '2. Scale', description: 'Kafka + stream processors.', bottleneck: 'Ops complexity.' },
      { stage: '3. Global', description: 'Regional shards + merge.', bottleneck: 'Cross-region consistency.' },
    ],
  },
}
