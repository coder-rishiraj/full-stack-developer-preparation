import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Scaling in system design interviews explains how the architecture grows with load — vertical vs horizontal scaling, database sharding and read replicas, caching layers, CDNs, async queues, partitioning, and autoscaling — tied to bottlenecks identified in capacity estimation.',
  whyExists:
    'Initial design may fit 1k RPS; interviewer asks "10× growth?" Scaling section shows evolution path without redesign from scratch — where to shard, what to cache, when to introduce queue — demonstrating you have operated systems past first launch.',
  mentalModel:
    'Expand highway before gridlock. First add lanes on same road (vertical, read replicas). Then parallel roads (horizontal app servers). Then city districts (sharding). Toll booths (cache/CDN) reduce cars reaching city center (DB).',
  howItWorks: [
    {
      type: 'table',
      headers: ['Bottleneck', 'Scale lever', 'Interview order'],
      rows: [
        ['Read QPS', 'CDN + Redis + read replicas', 'First'],
        ['Write QPS', 'Shard DB, partition queue', 'After cache exhausted'],
        ['Storage size', 'Shard + archive cold tier', 'Plan early for logs/media'],
        ['Fan-out work', 'Async queue + workers', 'Decouple hot path'],
        ['Hot key', 'Local cache, key split', 'Celebrity mitigation'],
        ['Global latency', 'Multi-region CDN + data', 'Late stage'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Scaling evolution stages',
      diagram: `flowchart TB
  S1[Single DB] --> S2[Read replicas + cache]
  S2 --> S3[Shard writes by user_id]
  S3 --> S4[Async queue + workers]
  S4 --> S5[Multi-region active-active]`,
    },
    {
      type: 'list',
      items: [
        'Reference capacity math bottleneck explicitly',
        'Stateless app tier scales horizontally easily',
        'Shard when single DB write/read limits hit — often 10k–100k TPS context-dependent',
        'Evolution stages impress — v1 simple v2 cache v3 shard',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'News feed at 100k read RPS: stage 1 Redis cache 90% hit → 10k DB reads OK. At 500k RPS: read replicas 5×. Writes 10k/s fan-out heavy: async queue fan-out workers partition by user_id hash. Celebrity pull model. DB shard user_id when single primary saturates.',
    },
  ],
  tradeoffs: {
    advantages: ['Shows growth path', 'Avoids premature optimization with staged plan'],
    disadvantages: ['Over-sharding day one adds complexity'],
    alternatives: ['Vertical scale first — valid for early stage if stated'],
    whenToUse: ['Capacity shows bottleneck', 'Interviewer "how scale 10×?"'],
    whenNotToUse: ['Before identifying bottleneck — generic scale list weak'],
  },
  failureModes: [
    'Scale app servers but DB unchanged',
    'Shard by low-cardinality key — hot partition',
    'Cache without invalidation at scale',
    'Multi-region before single-region optimized',
    'No autoscale limits — DB crushed on scale-out',
  ],
  production: {
    scalability: ['HPA with max cap', 'Shard automation plan', 'Load test validated limits'],
    performance: ['Cache CDN first lever'],
    cost: ['Right-size stages — do not multi-region day one'],
    observability: ['Saturation metrics trigger scale decisions'],
  },
  interview: {
    expectations: ['Horizontal app scale', 'Read vs write scaling', 'Evolution stages'],
    commonQuestions: ['Scale DB writes?', '10× traffic what breaks first?'],
    followUps: ['Shard key choice?', 'When introduce Kafka?'],
    misconceptions: ['Only add servers solves all', 'Shard immediately always'],
    traps: ['Ignore DB bottleneck'],
    strongSignals: ['Bottleneck from capacity', 'Staged evolution', 'Hot key mitigation'],
  },
  keyTakeaways: [
    'Scale reads: CDN → cache → read replicas.',
    'Scale writes: shard, queue async, partition workers.',
    'Start stateless horizontal; DB is usual bottleneck.',
    'Present evolution stages v1→v2→v3.',
    'Tie every scale lever to capacity bottleneck.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Vertical vs horizontal scaling?', answerHint: 'Vertical bigger machine; horizontal more nodes — stateless apps favor horizontal.' },
    { level: 'intermediate', question: '100:1 read write ratio scale how?', answerHint: 'Aggressive read cache CDN replicas; minimal write shard until needed.' },
    { level: 'advanced', question: 'Reshard without downtime?', answerHint: 'Consistent hashing double-write migration read both old new keys background rebalance.' },
  ],
  flashcards: [
    { front: 'Scale reads first', back: 'CDN Redis read replicas before write shard' },
    { front: 'Write scaling', back: 'Database sharding partition queue workers' },
    { front: 'Stateless horizontal scale', back: 'Add app servers behind LB — session externalized' },
    { front: 'Evolution stages', back: 'Simple → cache → shard → multi-region interview narrative' },
  ],
  quickRevision: [
    'Cache reads first',
    'Shard writes',
    'Queue async',
    'Stateless scale out',
    'Bottleneck driven',
  ],
}
