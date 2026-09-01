import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Distributed clock and time issues arise because nodes have unsynchronized physical clocks (skew/drift), time jumps (NTP corrections), and “now” is not global — breaking ordering, TTL, lease expiry, and last-write-wins unless designs use logical clocks, centralized time, or careful tolerance.',
  whyExists:
    'Developers assume `System.currentTimeMillis()` is universal truth. In distributed systems it is not: events can appear out of order, leases expire early/late, and LWW merges pick wrong winner. Explicit time models prevent subtle production bugs.',
  mentalModel:
    'Wall clock = civil time (NTP-adjustable, jumps). Monotonic clock = elapsed time (no jumps, not comparable across nodes). Logical clock (Lamport, vector) captures causality without sync. Hybrid Logical Clocks (HLC) blend for Spanner-style timestamps.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Issue', 'Cause', 'Mitigation'],
      rows: [
        ['Clock skew', 'Nodes disagree on now', 'Synchronize NTP; use skew tolerance in leases'],
        ['Leap/smear adjustments', 'Time jumps backward/forward', 'Never use wall clock alone for ordering; use logical/version'],
        ['False ordering', 'A happens before B but timestamp says opposite', 'Lamport/vector clocks; source of truth ordering'],
        ['Lease expiry drift', 'Too early lock loss or late stale lock', 'Fencing tokens; renew before expiry; use monotonic for duration'],
        ['TTL confusion', 'Cache expires at different times per node', 'Relative TTL; central TTL authority or versioned entries'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Lamport clock: tick on send/receive',
      diagram: `sequenceDiagram
  participant A
  participant B
  Note over A: LC=1
  A->>B: event (LC=2)
  Note over B: LC=max(own,2)+1=3`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Spanner TrueTime',
      text: 'Google uses GPS/atomic clocks + uncertainty interval [earliest, latest]. Commit waits out uncertainty for external consistency — not DIY for most teams.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Distributed lock with 30s lease using local wall clock: Node A clock 5 min fast thinks lease valid; Node B already took lock → split brain. Fix: store lease expiry in coordination service (etcd TTL) or use fencing token on resource access.',
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Bad vs better expiry',
      code: `// Bad: compare wall clocks across nodes
if (System.currentTimeMillis() < leaseExpiresAt) { /* assume holder */ }

// Better: etcd grant TTL; resource checks fencing token monotonic
if (resource.getFencingToken() < myToken) reject();`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Logical clocks capture causality without tight sync',
      'Monotonic clocks safe for measuring durations/timeouts locally',
      'Central coordination (etcd TTL) avoids cross-node wall clock trust',
    ],
    disadvantages: [
      'Logical clocks don’t map to user-visible time',
      'TrueTime-class infra expensive',
      'HLC/vector clocks add metadata overhead',
    ],
    alternatives: [
      'Single leader assigns timestamps',
      'Database `NOW()` as authority for ordering',
      'Version vectors for CRDT merges',
    ],
    whenToUse: [
      'Distributed locks, leader leases',
      'LWW conflict resolution',
      'Event ordering across services',
    ],
    whenNotToUse: [
      'User-facing “scheduled at 3pm local” — need timezone + real clocks',
    ],
  },
  failureModes: [
    'NTP step causes duplicate UUIDv1 or ordered IDs to collide',
    'Lease expires late → stale primary writes',
    'LWW picks future-dated write as winner (clock skew attack)',
    'Cron runs twice after clock jump',
  ],
  production: {
    reliability: ['Run NTP/chrony; alert skew > 100ms on DB clusters', 'Fencing tokens on storage'],
    security: ['Reject writes with timestamp far in future', 'Signed lease from coordination service'],
    observability: ['Monitor clock offset per host', 'Track lease renewal failures'],
  },
  interview: {
    expectations: [
      'Wall vs monotonic vs logical clocks',
      'Why not trust local time for distributed lock',
      'Lamport clock basic idea',
    ],
    commonQuestions: [
      'Distributed system time problems?',
      'How does Spanner handle time?',
      'Design TTL cache across nodes?',
    ],
    followUps: [
      'Vector clocks vs Lamport?',
      'HLC use case?',
    ],
    misconceptions: [
      'NTP makes all nodes identical nanosecond clocks',
      'UUID by time globally ordered without coordination',
    ],
    traps: [
      'Using `Date.now()` for event ordering across servers',
    ],
    strongSignals: [
      'Fencing tokens with leases',
      'TrueTime uncertainty interval mention',
      'etcd TTL for leader lease',
    ],
  },
  keyTakeaways: [
    'Wall clocks skew and jump — unsafe for cross-node ordering alone.',
    'Monotonic clocks for local durations only.',
    'Logical clocks (Lamport/vector/HLC) model causality.',
    'Leases need coordination service or fencing tokens.',
    'LWW requires bounded skew or centralized timestamp authority.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why not use wall clock for ordering events?', answerHint: 'Skew and jumps; events can get wrong order.' },
    { level: 'intermediate', question: 'Lamport clock rule?', answerHint: 'Increment local; on receive max(local, msg)+1.' },
    { level: 'advanced', question: 'Fencing token purpose?', answerHint: 'Stale lock holder cannot write after lease lost; storage rejects old token.' },
  ],
  flashcards: [
    { front: 'Clock skew', back: 'Different nodes disagree on current time' },
    { front: 'Monotonic clock', back: 'Elapsed time; no backward jump; not global' },
    { front: 'Lamport clock', back: 'Logical counter capturing happen-before' },
    { front: 'Fencing token', back: 'Monotonic guard against stale primary writes' },
  ],
  quickRevision: [
    'Wall ≠ global truth',
    'Monotonic for timeouts local',
    'Logical for causality',
    'etcd TTL leases',
    'Fencing on writes',
  ],
  systemDesign: {
    problem: 'Design a distributed job scheduler where only one leader assigns work at a time, workers claim tasks with timeouts, and stale workers must not execute after lease loss.',
    requirements: {
      functional: ['Submit jobs', 'Leader schedules', 'Worker claims and executes', 'Retry on failure'],
      nonFunctional: ['Single active leader', 'No double execution after lease expiry', 'Tolerate clock skew ~500ms'],
    },
    scaleAssumptions: ['10k jobs/min', '50 workers', 'Leader election among 3 schedulers'],
    capacityEstimates: ['Job queue in Redis/Postgres', 'Lease TTL 30s renew every 10s'],
    api: [{ type: 'code', language: 'http', code: `POST /jobs\nPOST /workers/{id}/heartbeat\nGET /tasks/claim` }],
    dataModel: [{ type: 'list', items: ['jobs(id, payload, status, fencing_token)', 'worker_leases(worker_id, job_id, token, expires_at)'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Raft/etcd elects leader scheduler. Leader assigns jobs. Workers claim with lease stored in coordination service (not local clock). Job row stores fencing token; worker must present current token to complete.' }],
    diagram: {
      mermaid: `flowchart TB
  etcd[(etcd leases)]
  L[Leader Scheduler]
  W1[Worker]
  W2[Worker]
  L --> etcd
  W1 --> etcd
  W2 --> etcd
  L --> Q[(Job queue)]
  W1 --> Q`,
      caption: 'Central leases + fencing tokens',
    },
    dataFlow: [
      'Leader writes job PENDING',
      'Worker claim: atomic CAS in DB with new fencing token + lease in etcd',
      'Worker renews heartbeat; on miss lease expires',
      'Complete job only if token matches latest',
    ],
    storage: ['Postgres job state', 'etcd for leader + worker leases'],
    caching: ['Do not cache lease validity locally long'],
    asyncProcessing: ['Job execution async on worker'],
    scaling: ['Horizontal workers; partition job queue by shard'],
    consistency: ['Strong CAS on claim row', 'Leader single writer via Raft'],
    reliability: ['Fencing prevents stale completion', 'Renew lease before expiry using monotonic elapsed locally'],
    failureScenarios: ['Worker pause GC → lease expires → another worker claims → old worker rejected at complete', 'Leader dies → new leader via Raft'],
    security: ['Workers authenticated; token not forgeable'],
    observability: ['Clock skew metrics', 'Stale completion reject count', 'Lease renewal failures'],
    bottlenecks: ['Hot job shard', 'etcd write rate on heartbeat storm'],
    alternatives: ['DB advisory locks with server NOW() authority'],
    tradeoffs: ['Central lease store latency vs local timer trust'],
    interviewFollowUps: ['Why not Redis key TTL only?', 'Vector clock needed here?'],
    evolution: [
      { stage: '1. Simple design', description: 'Cron on one server.', bottleneck: 'SPOF.' },
      { stage: '2. Improve', description: 'Leader election + wall clock lease.', bottleneck: 'Skew double execution.' },
      { stage: '3. Improve', description: 'etcd TTL + fencing tokens.', bottleneck: 'Heartbeat load.' },
      { stage: '4. Scale further', description: 'Partitioned queues, batch renewals, HLC if multi-region ordering needed.', bottleneck: 'Cross-region lease latency.' },
    ],
  },
}
