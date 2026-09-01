import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Eventual consistency guarantees that if writes stop, all replicas will eventually converge to the same value. Until then, different clients may read different versions. Common in async replication, DNS, CDNs, Dynamo/Cassandra default paths, and cache layers.',
  whyExists:
    'Strong consistency across regions is slow and fragile. Many datasets tolerate seconds or minutes of staleness (social feeds, product reviews, config propagation). Eventual models maximize availability and latency while replication catches up in background.',
  mentalModel:
    'Replicas are temporarily out of sync like gossip spreading — everyone hears the news eventually. Design for visible version skew: show timestamps, merge conflicts, or accept stale UI with refresh.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Technique', 'Behavior', 'When staleness ends'],
      rows: [
        ['Async replication', 'Leader acks before all followers', 'When lagging followers apply log'],
        ['Anti-entropy repair', 'Background compare/sync', 'After repair cycle'],
        ['LWW (last-writer-wins)', 'Highest timestamp wins merge', 'On read repair or write conflict resolution'],
        ['CRDT merge', 'Deterministic combine without coordination', 'Immediately on merge function apply'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Temporary divergence then convergence',
      diagram: `flowchart LR
  W[Write v2 on leader] --> L[(Leader v2)]
  L -.lag.-> F1[(Follower v1)]
  L -.lag.-> F2[(Follower v1)]
  F1 -->|catch up| F1b[(Follower v2)]
  F2 -->|catch up| F2b[(Follower v2)]`,
    },
    {
      type: 'list',
      items: [
        'Monotonic reads: user never sees time go backward (sticky replica or session token)',
        'Read-your-writes: route user reads to region/leader that saw their write',
        'Causal consistency: stronger than eventual — preserve cause-effect order',
        'TTL + versioning in API responses help clients detect staleness',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'User updates profile bio in US region; EU friend sees old bio for 2s until replication completes. Acceptable for social product. Pair with `updated_at` in JSON so client can poll or show "syncing".',
    },
    {
      type: 'code',
      language: 'json',
      caption: 'Client handles eventual reads',
      code: `{
  "display_name": "Alex",
  "version": 42,
  "updated_at": "2026-08-17T10:00:01Z"
}
// Client: if local edit version 43 > 42, keep local until server catches up`,
    },
  ],
  tradeoffs: {
    advantages: ['High availability and low write latency', 'Scales geo writes with local ack', 'Resilient during partial outages'],
    disadvantages: ['Stale reads and merge conflicts', 'Harder UX and debugging', 'Invariants need careful design'],
    alternatives: ['Strong consistency subset', 'CRDTs', 'Operational transforms for collaborative edit'],
    whenToUse: ['Metrics, feeds, caches, DNS, shopping cart (with merge rules)', 'Multi-master geo apps'],
    whenNotToUse: ['Ledger balances without compensating logic', 'Unique constraint without coordination'],
  },
  failureModes: [
    'Lost update when two regions write concurrently with bad merge',
    'Unbounded divergence if repair stops',
    'Users confused by stale UI without version hints',
    'Clock skew breaking LWW',
    'Reading pre-image after delete propagated',
  ],
  production: {
    reliability: ['Anti-entropy + read repair schedules', 'Conflict audit log for support'],
    performance: ['Local quorum ONE for speed where business allows'],
    observability: ['Replication lag percentiles', 'Conflict rate', 'Version skew metrics'],
    maintainability: ['Document staleness SLA per endpoint', 'Merge policy per field'],
    security: ['Don\'t leak pre-delete data from slow replica longer than policy'],
  },
  interview: {
    expectations: ['Define eventual consistency', 'Merge strategies LWW/CRDT', 'Read-your-writes mitigation'],
    commonQuestions: ['Eventual vs strong product example?', 'Handle conflicting edits?'],
    followUps: ['CRDT vs LWW?', 'CAP AP behavior?'],
    misconceptions: ['Eventual means never consistent', 'Eventual is always easier to build'],
    traps: ['Eventual for inventory without oversell protection'],
    strongSignals: ['Version vectors', 'Per-field policies', 'Causal/session guarantees'],
  },
  keyTakeaways: [
    'Replicas converge when writes quiesce; temporary skew is normal.',
    'LWW, CRDTs, and read repair are common convergence tools.',
    'Strengthen with read-your-writes, monotonic, causal where needed.',
    'Expose versions/timestamps to clients.',
    'Never use eventual alone for hard invariants without design.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What does eventual consistency promise?', answerHint: 'If no new writes, all replicas eventually agree; no bound on staleness duration.' },
    { level: 'intermediate', question: 'How achieve read-your-writes with eventual store?', answerHint: 'Route to leader/region that took write, session token, or version check.' },
    { level: 'advanced', question: 'LWW problems and CRDT alternative?', answerHint: 'Clock skew loses edits; CRDTs merge by structure (counter, set) deterministically.' },
  ],
  flashcards: [
    { front: 'Eventual consistency', back: 'Replicas may differ temporarily; converge when writes stop' },
    { front: 'LWW', back: 'Resolve conflict by highest timestamp — needs good clocks' },
    { front: 'Read repair', back: 'Read triggers update of stale replicas' },
    { front: 'Read-your-writes', back: 'User always sees own updates — stronger than pure eventual' },
  ],
  quickRevision: [
    'Converge later, not now',
    'Async repl + repair',
    'LWW / CRDT merge',
    'Version in API',
    'Not for raw inventory',
  ],
  systemDesign: {
    problem: 'Design multi-region user settings store with eventual default and optional strong read for security-sensitive flags.',
    requirements: {
      functional: ['Get/update settings', 'Merge concurrent edits on different fields'],
      nonFunctional: ['Writes ack locally < 50ms', 'Eventual cross-region < 30s', 'Strong read for 2FA flag'],
    },
    scaleAssumptions: ['100M users', '5k updates/s global', '3 regions'],
    capacityEstimates: ['~500B/settings × 100M — partition by user_id'],
    api: [{ type: 'code', language: 'http', code: `GET /settings/{user_id}?consistency=eventual|strong\nPATCH /settings/{user_id}` }],
    dataModel: [{ type: 'list', items: ['Settings doc per user with per-field version map', 'Vector clock or field-level timestamps'] }],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Dynamo-style per region with async cross-region replication; merge on read using field-level LWW; strong read for 2FA routes to global consensus row or leader.' },
    ],
    diagram: {
      mermaid: `flowchart TB
  US[US write] --> DUS[(US replica set)]
  EU[EU write] --> DEU[(EU replica set)]
  DUS <-.async.-> DEU
  Merge[Read merge field versions] --> Client`,
      caption: 'Regional writes with async sync and merge',
    },
    dataFlow: ['Local W=1 ack; background replicate; GET merges versions'],
    storage: ['Wide-column or document per user_id'],
    caching: ['Edge cache with short TTL + version'],
    asyncProcessing: ['Anti-entropy between regions'],
    scaling: ['Partition by user_id hash'],
    consistency: ['Eventual default; strong subset for security fields'],
    reliability: ['Conflict log; repair jobs'],
    failureScenarios: ['Concurrent theme + locale edit → field merge OK', 'Concurrent 2FA toggle → strong path serializes'],
    security: ['Strong read for security-sensitive keys'],
    observability: ['Lag, conflict count, merge latency'],
    bottlenecks: ['Hot celebrity user multi-region edits'],
    alternatives: ['Single region primary for all settings'],
    tradeoffs: ['Merge complexity vs global strong latency'],
    interviewFollowUps: ['Field-level vs doc-level merge?', 'Delete propagation?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single region DB.', bottleneck: 'Global latency.' },
      { stage: '2. Improve', description: 'Regional replicas async.', bottleneck: 'Conflicts.' },
      { stage: '3. Improve', description: 'Field merge + version API.', bottleneck: 'Strong field exception path.' },
      { stage: '4. Scale further', description: 'CRDT counters for numeric prefs.', bottleneck: 'Testing merge matrix.' },
    ],
  },
}
