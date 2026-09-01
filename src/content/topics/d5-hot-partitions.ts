import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Hot partitions (hot shards, hot keys) occur when disproportionate traffic or data concentrates on one partition — overloading a single Kafka partition, Cassandra node, DynamoDB partition, or DB shard while others idle. Causes skewed latency, throttling, and SLA breaches.',
  whyExists:
    'Hash functions and natural popularity (celebrity users, viral posts, global counters) violate uniform distribution assumptions. Distributed systems scale horizontally only when load spreads evenly — one hot partition becomes serial bottleneck.',
  mentalModel:
    'Ten checkout lanes but everyone queues lane 3. Fix: split the hot key, salt hashes, fan-out writes, or isolate celebrities to dedicated resources. Monitor per-partition metrics not just cluster averages.',
  howItWorks: [
    {
      type: 'table',
      headers: ['System', 'Hot spot cause', 'Mitigation'],
      rows: [
        ['Kafka', 'Bad key → one partition', 'Salt key post:123:{0..7}, downstream aggregate'],
        ['DynamoDB', 'Partition key too coarse', 'Composite key + random suffix write sharding'],
        ['Cassandra', 'Low-cardinality partition key', 'Add bucket column to split partition size/load'],
        ['Redis Cluster', 'Single hot key', 'Shard counter likes:post:1:shard{n}'],
        ['DB shard', 'Mega-tenant on one shard', 'Dedicated shard or sub-shard tenant'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Write sharding for hot counter',
      diagram: `flowchart TB
  W[Write like] --> S0[likes:post:1:0]
  W --> S1[likes:post:1:1]
  W --> S2[likes:post:1:2]
  R[Read total] --> Sum[Sum shards 0..7]`,
    },
    {
      type: 'list',
      items: [
        'Detect: per-partition QPS, CPU, throttle metrics, key-level tracing (Dynamo hot key logs)',
        'Salting: append random suffix on write; merge on read — read cost tradeoff',
        'Caching hot read keys at edge',
        'Rate limit abusive keys; circuit break celebrity endpoints',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Viral tweet like counter: single Redis key INCR saturates one slot. Split into 100 keys likes:{tweet_id}:{0..99}, increment random shard, SUM on read for display — slight inaccuracy window acceptable or periodic sync.',
    },
  ],
  tradeoffs: {
    advantages: ['Mitigations restore horizontal scale benefits', 'Isolation protects rest of cluster'],
    disadvantages: ['Read amplification on merge', 'Application complexity', 'Weaker ordering if salted Kafka keys'],
    alternatives: ['Vertical boost hot partition node temporarily', 'Dedicated hardware for whale tenant'],
    whenToUse: ['When metrics show partition skew >2× average'],
    whenNotToUse: ['Before measuring — premature salting hurts locality'],
  },
  failureModes: [
    'Ignoring skew until production incident',
    'Salting without read merge path → wrong totals',
    'Dynamo adaptive capacity temporarily masks chronic hot key',
    'Kafka partition max size on unbounded key stream',
  ],
  production: {
    performance: ['Pre-split known hot entities (election night, product launch)'],
    scalability: ['Auto-scale consumers only up to partition count — hot partition still caps'],
    observability: ['Per-partition/shard dashboards', 'Top-N key tracing', 'Throttle alarm'],
    reliability: ['Degrade gracefully for hot entity vs whole outage'],
    maintainability: ['Runbook celebrity tenant isolation'],
  },
  interview: {
    expectations: ['Detect skew', 'Salt/fan-out pattern', 'Kafka partition limit'],
    commonQuestions: ['Hot partition in Kafka?', 'DynamoDB hot key?'],
    followUps: ['Exact counter vs approximate?', 'Order preservation with salt?'],
    misconceptions: ['Adding brokers fixes hot partition without key change'],
    traps: ['Global counter single key design at scale'],
    strongSignals: ['Write sharding read merge', 'Dedicated whale tenant shard', 'Cache + queue absorb'],
  },
  keyTakeaways: [
    'Horizontal scale fails if load skews to one partition.',
    'Monitor per-partition metrics early.',
    'Split hot keys with salting/sharding; merge on read.',
    'Kafka consumer scale ≤ partition count.',
    'Plan for viral events and mega-tenants upfront.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is a hot partition?', answerHint: 'Partition receiving far more traffic than others, becoming bottleneck.' },
    { level: 'intermediate', question: 'Fix Redis hot key global counter?', answerHint: 'Shard increments across multiple keys; aggregate on read or use HyperLogLog if approximate OK.' },
    { level: 'advanced', question: 'Kafka hot key must preserve order?', answerHint: 'Hard — partition by key causes hot spot; sacrifice global order or serialize hot key through single partition with async queue + batch writer.' },
  ],
  flashcards: [
    { front: 'Hot key', back: 'Single key overloads one shard/partition/node' },
    { front: 'Write sharding', back: 'Split writes across suffix keys; sum on read' },
    { front: 'Kafka scale limit', back: 'Consumers in group ≤ partitions for that topic' },
    { front: 'Dynamo hot partition', back: 'Throttling on partition >3000 RCU/WCU or adaptive burst exhausted' },
  ],
  quickRevision: [
    'Skew breaks scale-out',
    'Per-partition metrics',
    'Salt + merge reads',
    'Whale tenant isolation',
    'Plan viral events',
  ],
  systemDesign: {
    problem: 'Design view counter for viral videos (1M views/s on one video) in DynamoDB without throttling.',
    requirements: {
      functional: ['Increment view', 'Approximate count display', 'Per-video isolation'],
      nonFunctional: ['1M inc/s single video peak', 'Display lag < 5s OK'],
    },
    scaleAssumptions: ['1M writes/s hot video', '1B videos long tail low QPS'],
    capacityEstimates: ['100 write shards per hot video key suffix 0..99'],
    api: [{ type: 'code', language: 'http', code: `POST /videos/{id}/view\nGET /videos/{id} → {views: approximate}` }],
    dataModel: [{ type: 'list', items: ['PK video_views#{id}#shard#{0..99} incremental counters', 'Periodic aggregator Lambda sums to video_metadata'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Random shard increment; async aggregator every 2s updates display count; cache CDN for metadata reads.' }],
    diagram: {
      mermaid: `flowchart LR
  View[View events] --> R[Random shard 0-99]
  R --> DDB[(DynamoDB shards)]
  Agg[Aggregator Lambda] --> DDB
  Agg --> Meta[video metadata item]
  GET --> Meta`,
      caption: 'Sharded writes + periodic aggregation',
    },
    dataFlow: ['POST picks random shard ATOMIC increment', 'Aggregator SUM shards → metadata', 'GET reads metadata'],
    storage: ['DynamoDB on-demand or provisioned burst'],
    caching: ['CloudFront/API cache metadata 2s TTL'],
    asyncProcessing: ['Aggregator scheduled/stream triggered'],
    scaling: ['More shards if single hot video exceeds 100 partition write cap'],
    consistency: ['Approximate count acceptable eventual 2s'],
    reliability: ['Throttling alarm per video id'],
    failureScenarios: ['Aggregator lag — show stale with indicator optional'],
    security: ['Rate limit views per IP bot protection'],
    observability: ['Per-video write rate, throttle events, aggregator lag'],
    bottlenecks: ['Still one metadata read hot — CDN cache'],
    alternatives: ['Redis cluster sharded counter + flush to Dynamo'],
    tradeoffs: ['Exact count expensive vs approximate HyperLogLog'],
    interviewFollowUps: ['Bot inflate views?', 'Cross-region hot video?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single Dynamo item counter.', bottleneck: 'Instant throttle.' },
      { stage: '2. Improve', description: '10 shard keys.', bottleneck: 'Still hot at 1M/s.' },
      { stage: '3. Improve', description: '100 shards + aggregator.', bottleneck: 'Aggregator single writer metadata.' },
      { stage: '4. Scale further', description: 'CDN cached approximate + Kinesis buffer writes.', bottleneck: 'Cost at extreme scale.' },
    ],
  },
}
