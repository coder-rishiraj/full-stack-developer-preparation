import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Eventual consistency means replicas converge after writes stop — temporary stale reads possible. Common with async replication, Kafka consumers lagging, cache TTL, and multi-region databases. Backend services accept brief skew; strengthen with read-your-writes, versioning, and idempotent reconciliation.',
  whyExists:
    'Strong consistency across services/regions is slow and fragile. Many workflows tolerate seconds of staleness (profile, catalog, analytics). Eventual models improve availability and partition tolerance per CAP — explicit in microservices and cache layers.',
  mentalModel:
    'Writes propagate like gossip — not instant everywhere. UI shows version or "updating". Conflicts need merge policy (LWW, CRDT, business rules). Never assume eventual for raw inventory without reservation design.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Source', 'Staleness cause', 'Mitigation'],
      rows: [
        ['Redis cache TTL', 'Invalidate missed', 'TTL + event invalidation'],
        ['Read replica lag', 'Async replication', 'Read primary after write or session stickiness'],
        ['Kafka consumer lag', 'Processing delay', 'Monitor lag; scale consumers'],
        ['Multi-region DB', 'Geo replication delay', 'Version field; conflict merge'],
        ['CDN edge', 'Cache purge delay', 'Short TTL critical assets'],
      ],
    },
    {
      type: 'list',
      items: [
        'Read-your-writes: route user to region/leader that took write',
        'Monotonic reads: sticky session to same replica',
        'Expose updated_at/version in API for client merge',
        'Saga compensations for cross-service eventual alignment',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'User updates avatar — write primary DB, invalidate Redis, publish UserUpdated event. Friend sees old avatar for 2s until cache miss + replica catch-up — acceptable. Payment status uses strong read from primary after checkout redirect.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'CAP: choosing AP often implies eventual consistency',
        'Dynamo/Cassandra tunable consistency per query',
        'Kafka ordering per partition — eventual across partitions',
        'Anti-entropy repair in distributed databases',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Higher availability and lower latency', 'Scales geo-distributed writes', 'Simpler than 2PC across services'],
    disadvantages: ['Stale reads and merge complexity', 'Harder debugging', 'UX must tolerate skew'],
    alternatives: ['Strong consistency subset (Spanner, sync replicate)', 'Saga with compensating transactions'],
    whenToUse: ['Social feeds, catalog, config, analytics', 'Cache layers'],
    whenNotToUse: ['Ledger balance without careful design', 'Inventory oversell without locks/reservations'],
  },
  failureModes: [
    'Stale cache serves wrong price',
    'Lost update concurrent writers without merge',
    'User confusion without version indicators',
    'Assuming Kafka consumer caught up immediately',
  ],
  production: {
    reliability: ['Reconciliation jobs detect drift', 'Conflict audit log'],
    observability: ['Replication lag, cache staleness metrics', 'Consumer lag'],
    maintainability: ['Document staleness SLA per endpoint'],
  },
  interview: {
    expectations: ['Define eventual consistency', 'Examples in backend stack', 'Mitigations read-your-writes'],
    commonQuestions: ['Eventual vs strong?', 'Handle stale cache?', 'Inventory with eventual?'],
    followUps: ['CAP connection?', 'CRDT vs LWW?'],
    misconceptions: ['Eventual means never consistent', 'Cache TTL alone is strong consistency'],
    traps: ['Eventual inventory flash sale without reservations'],
    strongSignals: ['Version fields, read-your-writes paths, lag monitoring, merge policies'],
  },
  keyTakeaways: [
    'Replicas converge eventually — temporary skew normal.',
    'Caches and async pipelines are eventually consistent by nature.',
    'Use versioning and read-your-writes where UX needs freshness.',
    'Monitor lag: replication, consumer, cache invalidation.',
    'Design merges and sagas — not naive eventual for money/inventory.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Eventual consistency meaning?', answerHint: 'If writes stop, all replicas agree eventually; no bound on staleness duration.' },
    { level: 'intermediate', question: 'Read-your-writes after profile update?', answerHint: 'Read from primary, session token routing, or version check — not stale replica immediately after write.' },
    { level: 'advanced', question: 'Sell 100 tickets with eventual cache?', answerHint: 'Do not rely on cache count — DB pessimistic lock/atomic decrement or reservation queue; cache display-only with short TTL.' },
  ],
  flashcards: [
    { front: 'Eventual consistency', back: 'Temporary skew; replicas converge when writes quiesce' },
    { front: 'Read-your-writes', back: 'User sees own updates — stronger guarantee' },
    { front: 'Consumer lag', back: 'Downstream view eventually consistent with log' },
    { front: 'Version field', back: 'Clients detect stale data and refresh' },
  ],
  quickRevision: ['Converge later', 'Cache/replica lag', 'Version in API', 'Read-your-writes', 'Not for raw inventory'],
}
