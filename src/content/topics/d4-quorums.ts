import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Quorum protocols require a minimum number of replica acknowledgements for reads (R) and writes (W) out of N total replicas. When R + W > N, read and write sets overlap, so a quorum read sees the latest quorum write (for a given version). Tunable consistency in Dynamo-style systems.',
  whyExists:
    'Leaderless replication needs a rule for when a write is durable and when a read is authoritative without a single leader. Quorum math provides probabilistic or guaranteed overlap; sloppy quorums and hinted handoff handle temporary replica unavailability.',
  mentalModel:
    'N replicas; write to W nodes, read from R nodes. Bigger W = safer writes, slower. Bigger R = fresher reads, slower. ALL (W=N) is strong but fragile; ONE (R=1,W=1) is fast but stale. Pick per operation.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Setting', 'N', 'W', 'R', 'Effect'],
      rows: [
        ['Strong-ish', '3', '2', '2', 'R+W>N → overlap; tolerate 1 node loss'],
        ['Fast write', '3', '1', '1', 'Low latency; high staleness risk'],
        ['Durable write', '3', '3', '1', 'All must ack write; read may still be stale if R=1'],
        ['Safe read', '3', '1', '3', 'Read all copies; write fast'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'W=2, R=2, N=3 overlap',
      diagram: `flowchart TB
  subgraph nodes [N=3 replicas]
    A[(R1)]
    B[(R2)]
    C[(R3)]
  end
  W[Write quorum W=2] --> A
  W --> B
  R[Read quorum R=2] --> B
  R --> C
  Note[Overlap at B guarantees latest W write if no concurrent writes]`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Concurrent writes',
      text: 'Quorum overlap prevents stale read of a completed quorum write, but concurrent writes to same key need version vectors or LWW merge — quorum alone does not resolve conflicts.',
    },
    {
      type: 'list',
      items: [
        'Sloppy quorum: write to W nodes including temporary substitutes when preferred nodes down',
        'Hinted handoff: substitute holds data until preferred replica returns',
        'Read repair: read finds mismatched versions → update lagging replica',
        'Anti-entropy: background Merkle tree sync',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Cassandra LOCAL_QUORUM with replication factor 3 in one DC: W=2, R=2 for balance. Analytics job uses ONE for speed accepting stale counts. Payment status read uses ALL or SERIAL consistency.',
    },
    {
      type: 'code',
      language: 'text',
      caption: 'Interview math',
      code: `N=5, W=3, R=3 → R+W=6 > 5 ✓ overlap of 1 node minimum
Tolerate floor((N-1)/2) failures for strict majority quorums (consensus variant)
Dynamo: R+W>N suffices for read-after-quorum-write (single writer epoch)`,
    },
  ],
  tradeoffs: {
    advantages: ['Tunable per query', 'No single leader bottleneck for writes', 'Graceful degradation with sloppy quorum'],
    disadvantages: ['Conflict resolution still needed', 'Higher R/W latency', 'Complex client consistency choices'],
    alternatives: ['Single leader + sync followers', 'CRDT always-merge structures'],
    whenToUse: ['Geo-distributed KV (Dynamo, Cassandra)', 'Configurable consistency tiers'],
    whenNotToUse: ['Strict serializable transactions across keys', 'When simple leader model suffices'],
  },
  failureModes: [
    'R+W≤N → read may miss latest write',
    'Sloppy quorum without handoff → data on wrong node until repair',
    'Clock-based LWW wrong merges under skew',
    'Partial write visible if client retries without idempotency',
  ],
  production: {
    reliability: ['Monitor replica availability per key range', 'Read repair + anti-entropy schedules'],
    performance: ['LOCAL_QUORUM in single DC vs EACH_QUORUM cross-DC latency'],
    observability: ['Hinted handoff queue depth', 'Consistency level histogram per API'],
    maintainability: ['Document default R/W per endpoint', 'Load test at RF degradation'],
  },
  interview: {
    expectations: ['State R+W>N rule', 'Explain RF, W, R', 'Sloppy quorum / hinted handoff'],
    commonQuestions: ['N=3 W=2 R=2 — tolerate how many failures?', 'QUORUM vs ONE?'],
    followUps: ['Concurrent write resolution?', 'Compare to Raft majority?'],
    misconceptions: ['Quorum equals ACID transactions', 'ONE is never acceptable'],
    traps: ['Forgetting cross-DC EACH_QUORUM latency'],
    strongSignals: ['Per-operation consistency', 'Read repair', 'Version vectors'],
  },
  keyTakeaways: [
    'N replicas; W write acks; R read responses; R+W>N → read sees latest quorum write.',
    'Higher W/R = stronger but slower; ONE/ALL are extremes.',
    'Sloppy quorum + hinted handoff handle down nodes temporarily.',
    'Conflicts need versions beyond quorum math.',
    'Cassandra/Dynamo expose consistency per query.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is replication factor N?', answerHint: 'Number of replicas storing each key.' },
    { level: 'intermediate', question: 'Why require R+W>N?', answerHint: 'Guarantee read and write quorums share at least one node with latest write.' },
    { level: 'advanced', question: 'Explain sloppy quorum and hinted handoff.', answerHint: 'Write to substitutes when preferred down; hand data back when preferred returns.' },
  ],
  flashcards: [
    { front: 'Quorum overlap rule', back: 'R + W > N ensures read-write set intersection' },
    { front: 'W=ALL', back: 'All replicas must ack write — strongest write, least available' },
    { front: 'Read repair', back: 'Fix lagging replica when read detects stale version' },
    { front: 'Hinted handoff', back: 'Temporary store for data destined for down replica' },
  ],
  quickRevision: [
    'N, W, R tunable',
    'R+W>N freshness',
    'Sloppy + handoff',
    'Versions for conflicts',
    'LOCAL vs EACH quorum',
  ],
  systemDesign: {
    problem: 'Design a Dynamo-style key-value store with tunable read/write consistency for a shopping cart service.',
    requirements: {
      functional: ['Get/put cart by user_id', 'TTL expiry'],
      nonFunctional: ['Default eventual OK', 'Checkout path needs stronger read', 'RF=3 per region'],
    },
    scaleAssumptions: ['10M carts', '50k ops/s', '2 regions active'],
    capacityEstimates: ['1KB/cart; quorum ops 2× RTT within DC'],
    api: [{ type: 'code', language: 'http', code: `GET /cart/{user_id}?consistency=quorum\nPUT /cart/{user_id}` }],
    dataModel: [{ type: 'list', items: ['Key user_id → cart JSON + version timestamp', 'RF=3, W=2, R=2 default'] }],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Consistent hash ring; coordinator sends parallel R/W to replicas; merge versions on read.' },
    ],
    diagram: {
      mermaid: `flowchart LR
  Coord[Coordinator] --> R1
  Coord --> R2
  Coord --> R3
  Coord -->|merge versions| Client`,
      caption: 'Coordinator picks R nodes for read, W for write',
    },
    dataFlow: ['Put W=2; Get R=2; checkout Get R=3 or ALL in region'],
    storage: ['Replicated partitions on 3 nodes'],
    caching: ['Optional client cache with version — risky for cart'],
    asyncProcessing: ['Anti-entropy repair nightly'],
    scaling: ['Add nodes → token redistribution'],
    consistency: ['Browse ONE; checkout QUORUM/ALL'],
    reliability: ['Hinted handoff on node down'],
    failureScenarios: ['W nodes unavailable → write fails unless sloppy quorum policy'],
    security: ['Auth on user_id; encrypt sensitive fields client-side optional'],
    observability: ['Per-CL latency, repair rate, unavailable exceptions'],
    bottlenecks: ['Hot user_id single partition'],
    alternatives: ['Redis cluster with primary for cart simplicity'],
    tradeoffs: ['Tunable CL vs operational confusion for app teams'],
    interviewFollowUps: ['Cart hot key?', 'Multi-region W/R?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single Redis.', bottleneck: 'HA and tunable CL.' },
      { stage: '2. Improve', description: 'Dynamo RF=3 QUORUM.', bottleneck: 'Hot partitions.' },
      { stage: '3. Improve', description: 'Per-path CL + read repair.', bottleneck: 'Cross-region EACH_QUORUM slow.' },
      { stage: '4. Scale further', description: 'Regional stacks with async merge.', bottleneck: 'Conflict UX.' },
    ],
  },
}
