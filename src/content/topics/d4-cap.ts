import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The CAP theorem states that in the presence of network partitions (P), a distributed data store must choose between strong Consistency (C) and Availability (A) for requests — it cannot guarantee all three simultaneously. In practice, systems pick tradeoffs along a spectrum (PACELC extends this to latency vs consistency without partition).',
  whyExists:
    'Distributed systems fail: nodes crash, links drop, clocks skew. CAP forces explicit product decisions — should a booking system reject writes during a partition (CP) or accept them with reconciliation risk (AP)? Without this lens, teams ship ambiguous SLAs and surprise split-brain incidents.',
  mentalModel:
    'During a partition, replicas cannot talk. Either you wait for agreement (sacrifice availability/latency) or you serve from local state (sacrifice strong consistency). There is no free lunch — design for the failure mode your domain tolerates.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'C (Consistency): every read reflects the latest successful write (linearizable in the strict sense). A (Availability): every non-failing node returns a response without guarantee it is the freshest. P (Partition tolerance): system continues despite message loss between nodes — required in real networks.',
    },
    {
      type: 'mermaid',
      caption: 'Partition forces C vs A choice',
      diagram: `flowchart TB
  subgraph normal [No partition]
    L1[Leader] <--> F1[Follower]
    Client --> L1
  end
  subgraph split [Partition]
    L2[Leader AZ-a] -.-x F2[Follower AZ-b]
    C2[Client] --> L2
    C3[Client] --> F2
  end
  split --> CP[CP: reject minority side]
  split --> AP[AP: serve stale / queue merges]`,
    },
    {
      type: 'table',
      headers: ['Style', 'Example systems', 'Partition behavior'],
      rows: [
        ['CP', 'ZooKeeper, etcd, traditional RDBMS primary', 'Minority partition unavailable or read-only'],
        ['AP', 'Cassandra, Dynamo-style, Couchbase (tunable)', 'Both sides accept writes; eventual merge / conflict resolution'],
        ['CA (single site myth)', 'Single-node DB', 'No partition across WAN — not realistic globally'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'PACELC',
      text: 'Else (no partition), choose Latency vs Consistency — e.g., async replication for speed vs sync quorum for freshness.',
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Ticket inventory during AZ failure: CP approach — primary in AZ-a holds lock; AZ-b followers refuse writes (503) to prevent double-sell. AP approach — both AZs sell; later merge may require compensating refunds if oversold.',
    },
    {
      type: 'code',
      language: 'text',
      caption: 'Interview one-liner per product',
      code: `Bank ledger transfer     → CP (strong consistency, brief unavailability OK)
Social media like count  → AP (eventual, high availability)
Session cart (guest)     → often AP + TTL merge
Seat booking             → CP or careful AP with CRDT/locks`,
    },
  ],
  tradeoffs: {
    advantages: [
      'Clarifies non-negotiable tradeoffs in design reviews',
      'Prevents marketing “CA globally” claims',
      'Guides SLA wording (available vs consistent)',
    ],
    disadvantages: [
      'Oversimplified — real systems tune per operation',
      'Consistency has levels (eventual, causal, linearizable)',
      'CAP debate can distract from operational details',
    ],
    alternatives: [
      'PACELC for normal-case latency tradeoffs',
      'Design by failure injection (Jepsen) not theorem alone',
    ],
    whenToUse: [
      'Choosing database / replication mode',
      'Explaining outage behavior during partition',
      'Multi-region architecture decisions',
    ],
    whenNotToUse: [
      'Single-node monolith with one DB — partition is network to DB',
      'As excuse without defining consistency level needed',
    ],
  },
  failureModes: [
    'Split brain: two primaries accept conflicting writes',
    'Stale reads served as “success” without version metadata',
    'Unbounded unavailability waiting for unreachable quorum',
    'Mislabeling AP system as strongly consistent in docs',
  ],
  production: {
    reliability: ['Define RPO/RTO and partition playbook', 'Use fencing tokens for CP failovers'],
    scalability: ['AP systems scale writes horizontally; merge complexity grows'],
    observability: ['Track replication lag, quorum health, split-brain alerts'],
    maintainability: ['Document per-endpoint consistency guarantees'],
  },
  interview: {
    expectations: [
      'Define C, A, P precisely — not buzzwords',
      'Give CP vs AP product examples',
      'Mention tunable consistency (Cassandra ONE/QUORUM/ALL)',
    ],
    commonQuestions: [
      'Is PostgreSQL CP or AP?',
      'What happens during network partition?',
      'Can you have both C and A?',
    ],
    followUps: [
      'PACELC?',
      'How does Raft handle partition?',
      'Design multi-region cart — CP or AP?',
    ],
    misconceptions: [
      'You must pick one label forever for entire system',
      'CAP means choose 2 of 3 at all times — only during partition',
      'NoSQL = AP, SQL = CP',
    ],
    traps: [
      'Saying “we use CA” for geo-distributed system',
      'Ignoring latency as consistency cost when no partition',
    ],
    strongSignals: [
      'Operation-level consistency (read-your-writes, monotonic reads)',
      'Quorum math (N, R, W)',
      'Conflict resolution strategy for AP',
    ],
  },
  keyTakeaways: [
    'During partition: consistency OR availability, not both (strict CAP).',
    'CP: refuse or block minority; AP: serve + reconcile later.',
    'Real systems tune per query (QUORUM levels).',
    'PACELC: latency vs consistency when network is fine.',
    'Match choice to business invariant (inventory vs likes).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is a network partition?',
      answerHint: 'Nodes cannot communicate though alive; split clusters.',
    },
    {
      level: 'intermediate',
      question: 'Why is ticket booking usually CP-leaning?',
      answerHint: 'Double-sell worse than temporary write failure.',
    },
    {
      level: 'advanced',
      question: 'Explain quorum read/write with N=3, W=2, R=2.',
      answerHint: 'Overlap guarantees read sees latest write if W+R>N.',
    },
  ],
  flashcards: [
    { front: 'CAP during partition', back: 'Choose C or A; P is mandatory in distributed systems' },
    { front: 'CP example behavior', back: 'Reject writes/reads on minority partition to avoid divergence' },
    { front: 'AP example behavior', back: 'Accept writes locally; eventual merge / conflicts possible' },
    { front: 'PACELC', back: 'Else (no P): Latency vs Consistency tradeoff' },
  ],
  quickRevision: [
    'P always required cross-node',
    'Partition ⇒ C xor A (strict view)',
    'CP: etcd, sync quorum',
    'AP: Dynamo, Cassandra tunable',
    'Business drives choice: inventory CP, metrics AP',
  ],
  systemDesign: {
    problem:
      'Design a globally distributed user profile service. During a regional network partition, decide and defend CP vs AP behavior for reads and writes.',
    requirements: {
      functional: ['Get/update profile', 'Search by username', 'Avatar URL'],
      nonFunctional: [
        'Define consistency per field (email vs display name vs avatar)',
        '99.9% availability target — interpret during partition',
        'Multi-region active-active preferred',
      ],
    },
    scaleAssumptions: ['100M users', '10k profile updates/s peak', '3 regions'],
    capacityEstimates: [
      '~2 KB avg profile × 100M ≈ 200 GB raw + indexes',
      'Update QPS shardable by user_id hash',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `GET /v1/users/{id}
PUT /v1/users/{id}
Header: Consistency-Policy: strong | eventual`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'UserProfile: user_id (PK), email, display_name, avatar_url, version, updated_at',
          'Per-field metadata for merge (vector clock or LWW timestamp)',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'AP-leaning: Dynamo-style per region, async replication, LWW merge with version. CP-leaning fields (email change): route to global leader or use consensus (etcd) for identity-critical updates only — hybrid model.',
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  R1[Region US] --> D1[(Regional DB)]
  R2[Region EU] --> D2[(Regional DB)]
  D1 <-.replication.-> D2
  Part[Partition EU-US] --> Choice{Policy}
  Choice -->|CP email| Block[Reject cross-region email change]
  Choice -->|AP avatar| Merge[LWW merge on heal]`,
      caption: 'Hybrid CAP: strict for identity, eventual for display fields',
    },
    dataFlow: [
      'Read: local region with R=1 for display; strong read for email if CP',
      'Write: local accept (AP) or quorum to leader (CP)',
      'Heal: anti-entropy repair + conflict audit log',
    ],
    storage: ['Cassandra/Dynamo for AP bulk', 'Optional global lock service for CP subset'],
    caching: ['CDN for avatars; cache profile with version key; invalidate on version bump'],
    asyncProcessing: ['Reconciliation job on partition heal', 'Conflict notification to user'],
    scaling: ['Partition by user_id; regional stacks'],
    consistency: [
      'Explicit tiers: strong (email), eventual (display_name, avatar)',
      'Client sends If-Match version on PUT',
    ],
    reliability: ['Fencing on CP failover', 'Idempotent updates with client token'],
    failureScenarios: [
      'Split brain double email change → CP path or last-writer audit + support',
      'Stale avatar after partition → acceptable; TTL refresh',
    ],
    security: ['AuthZ on profile owner', 'Do not expose internal conflict blobs'],
    observability: ['Replication lag, conflict rate, partition detector'],
    bottlenecks: ['Cross-region sync bandwidth', 'Hot celebrity profiles'],
    alternatives: ['Single primary region (CP simple, higher latency elsewhere)'],
    tradeoffs: [
      'Hybrid complexity vs pure AP simplicity',
      'User-visible conflicts vs hard reject during outage',
    ],
    interviewFollowUps: [
      'Which fields are CP in hybrid?',
      'How detect partition vs slow replication?',
      'CRDT for display name edits?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'Single region Postgres — effectively CA within region.',
        bottleneck: 'Global latency; region loss = total outage.',
      },
      {
        stage: '2. Improve',
        description: 'Active-active AP replication; LWW merge.',
        bottleneck: 'Conflicts on critical fields.',
      },
      {
        stage: '3. Improve',
        description: 'Hybrid: CP consensus for email; AP for rest.',
        bottleneck: 'Two code paths; operational complexity.',
      },
      {
        stage: '4. Scale further',
        description: 'Per-tenant policies; automated conflict UX; Jepsen-tested failover.',
        bottleneck: 'Support burden for merge edge cases.',
      },
    ],
  },
}
