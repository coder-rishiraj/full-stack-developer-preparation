import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Strong consistency (often linearizability) means every operation appears to take effect atomically at a single point in time globally — once a write succeeds, all subsequent reads return that value (or a later one). Achieved via single leader, synchronous replication, or quorum reads/writes with coordination.',
  whyExists:
    'Many invariants require it: bank balance, seat inventory, unique username registration. Without strong guarantees, users see impossible states (money spent twice, seat sold twice). The cost is latency, availability during partitions, and coordination overhead.',
  mentalModel:
    'There is effectively one copy of the data at any logical instant. Reads may wait for replication or consensus before responding. Compare to eventual: copies may disagree temporarily but converge.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Mechanism', 'How strong', 'Cost'],
      rows: [
        ['Single leader + sync replica', 'Linearizable if reads go to leader', 'Leader SPOF mitigated by failover'],
        ['Quorum R+W>N on same version', 'Read sees latest quorum write', 'Higher latency per op'],
        ['Distributed consensus (Raft)', 'Ordered log + majority commit', 'Round-trip to majority'],
        ['Serializable DB transactions', 'Strong within shard/DB', 'Locking / MVCC overhead'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Linearizable read after write',
      diagram: `sequenceDiagram
  participant C1 as Client A
  participant C2 as Client B
  participant S as Coordinated store
  C1->>S: write x=1
  S-->>C1: ack
  C2->>S: read x
  S-->>C2: x=1
  Note over C1,C2: B never sees old value after A's write completes`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Not all-or-nothing for whole system',
      text: 'Hybrid designs: strong for inventory row, eventual for view counts. Label each API field\'s guarantee.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Seat booking: transactional UPDATE seats SET status=\'sold\' WHERE id=? AND status=\'available\' on primary DB with read-after-write from same connection. CDN and analytics may stay eventual.',
    },
    {
      type: 'code',
      language: 'sql',
      caption: 'Compare-and-set for strong invariant',
      code: `UPDATE accounts SET balance = balance - 100, version = version + 1
WHERE id = 42 AND balance >= 100 AND version = 7;
-- 0 rows → insufficient funds or concurrent conflict → retry or 409`,
    },
  ],
  tradeoffs: {
    advantages: ['Correctness for critical invariants', 'Simpler application logic', 'Easier reasoning for users'],
    disadvantages: ['Higher latency (especially cross-region)', 'Reduced availability during partition (CAP)', 'Contention hotspots'],
    alternatives: ['Optimistic locking with version', 'Pessimistic locks', 'Saga with compensations (weaker global)'],
    whenToUse: ['Money, inventory, identity uniqueness', 'Coordination locks (etcd)'],
    whenNotToUse: ['Social likes, metrics, recommendations feeds'],
  },
  failureModes: [
    'Reading from async replica thinking it is strong',
    'Lost updates without compare-and-set',
    'Distributed deadlock under strict locking',
    'Unavailability when quorum unreachable',
    'False strong claims in marketing while using ONE reads',
  ],
  production: {
    performance: ['Keep strong path narrow — only critical ops', 'Colocate leader with majority voters'],
    reliability: ['Fencing on failover', 'Idempotent retries with deterministic keys'],
    scalability: ['Shard strong domains; don\'t globalize strong writes unnecessarily'],
    observability: ['Track strong-path latency vs eventual paths', 'Conflict/409 rates'],
    maintainability: ['Document which endpoints are linearizable'],
  },
  interview: {
    expectations: ['Define linearizability vs sequential', 'Mechanisms: leader, quorum, consensus', 'CAP CP behavior'],
    commonQuestions: ['Strong vs eventual example?', 'How achieve strong in distributed DB?'],
    followUps: ['Serializable vs linearizable?', 'Cross-region strong writes?'],
    misconceptions: ['All SQL is always strongly consistent globally', 'Strong means no failures'],
    traps: ['Strong inventory with read replica GET'],
    strongSignals: ['Hybrid per-field', 'Version/ETag', 'Primary read after write'],
  },
  keyTakeaways: [
    'Strong = reads see latest completed write (linearizable ideal).',
    'Mechanisms: leader reads, sync repl, quorum, Raft.',
    'Costs latency and availability under partition.',
    'Scope strong guarantees to operations that need them.',
    'Use versions/CAS to detect conflicts.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Strong vs eventual consistency?', answerHint: 'Strong: immediate global visibility; eventual: replicas converge later.' },
    { level: 'intermediate', question: 'How make read-after-write strong?', answerHint: 'Read from leader, sync replica, or quorum with R+W>N.' },
    { level: 'advanced', question: 'Can you have strong consistency multi-region active-active?', answerHint: 'Hard — needs sync cross-region quorum or per-key leader routing; latency high.' },
  ],
  flashcards: [
    { front: 'Linearizability', back: 'Ops appear instantaneous in real-time global order' },
    { front: 'Strong read mistake', back: 'Reading stale async replica after write' },
    { front: 'CAS pattern', back: 'Update WHERE version matches to prevent lost update' },
    { front: 'CP during partition', back: 'Sacrifice availability to preserve consistency' },
  ],
  quickRevision: [
    'One logical copy in time',
    'Leader / sync / quorum / Raft',
    'Latency + partition cost',
    'Hybrid per operation',
    'CAS + fencing',
  ],
  systemDesign: {
    problem: 'Design ticket inventory API with no overselling under concurrent purchases and regional failover.',
    requirements: {
      functional: ['Reserve/release seats', 'Show availability', 'Payment timeout release'],
      nonFunctional: ['Zero oversell', 'p99 reserve < 500ms in region', 'HA multi-AZ'],
    },
    scaleAssumptions: ['100 events × 10k seats', '1k concurrent reserves/s per hot event'],
    capacityEstimates: ['Row-level locks on seat rows; shard events by event_id'],
    api: [{ type: 'code', language: 'http', code: `POST /events/{id}/reserve {seat_ids}\nDELETE /reservations/{id}` }],
    dataModel: [{ type: 'list', items: ['seats(event_id, seat_id, status, version)', 'Strong transactions on primary shard per event'] }],
    highLevelArchitecture: [
      { type: 'paragraph', text: 'Shard Postgres by event_id; serializable or SELECT FOR UPDATE on seat rows; all reserve ops hit shard primary; reads from primary or sync replica with lag=0 check.' },
    ],
    diagram: {
      mermaid: `flowchart TB
  API --> Router[Shard router]
  Router --> P1[(Event shard primary)]
  P1 --> S1[(Sync standby)]
  Reserve[Reserve txn] --> P1`,
      caption: 'Strong path always through shard primary transaction',
    },
    dataFlow: ['BEGIN; lock seats; update status; COMMIT; return reservation id'],
    storage: ['Sharded relational with sync HA'],
    caching: ['Do not cache mutable availability without version invalidation'],
    asyncProcessing: ['TTL release job with idempotent unlock'],
    scaling: ['Shard by event; vertical on hot event shard'],
    consistency: ['Serializable/strong per event shard'],
    reliability: ['Sync failover with fencing'],
    failureScenarios: ['Double reserve → prevented by row lock', 'Failover mid-txn → client retry idempotent'],
    security: ['Auth user; rate limit hot events'],
    observability: ['409 conflicts, lock wait time, oversell alarms (should be zero)'],
    bottlenecks: ['Hot event shard lock contention'],
    alternatives: ['Redis Redlock + DB — risky without fencing'],
    tradeoffs: ['Strong latency vs AP oversell risk'],
    interviewFollowUps: ['Hold vs reserve?', 'Cross-event transactions?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single DB transactions.', bottleneck: 'Scale hot events.' },
      { stage: '2. Improve', description: 'Event sharding + HA.', bottleneck: 'Lock contention.' },
      { stage: '3. Improve', description: 'Optimistic versioning + queue for bursts.', bottleneck: 'User retry storms.' },
      { stage: '4. Scale further', description: 'Per-event partition in dedicated store.', bottleneck: 'Ops per hot drop.' },
    ],
  },
}
