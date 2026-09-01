import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Consensus is the process by which distributed nodes agree on a single value or log order despite failures and delays — foundational for leader election, replicated state machines, and distributed coordination (Raft, Paxos, Zab).',
  whyExists:
    'Without consensus, replicas diverge after partitions — split brain, conflicting writes, corrupted ledger. Consensus algorithms provide safety (never decide two different values) and liveness (eventually decide if majority available) under defined assumptions.',
  mentalModel:
    'Imagine a committee vote: proposals need majority quorum to commit. One leader serializes decisions; followers acknowledge. If leader dies, new election among survivors. Clients only see committed entries — monotonic, agreed order.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Safety: at most one leader per term; committed entries never lost on any quorum',
        'Liveness: progress if majority connected and reachable leader',
        'Raft phases: leader election → log replication → commit when majority ack',
        'Paxos: prepare/promise, propose/accept — more theoretical, harder to implement',
        'Uses: etcd/ZooKeeper config, Kafka controller, Cockroach/Raft SQL',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Raft log replication (simplified)',
      diagram: `sequenceDiagram
  participant Client
  participant Leader
  participant F1 as Follower1
  participant F2 as Follower2
  Client->>Leader: append command
  Leader->>F1: AppendEntries
  Leader->>F2: AppendEntries
  F1-->>Leader: ack
  F2-->>Leader: ack
  Leader-->>Client: committed`,
    },
    {
      type: 'table',
      headers: ['Algorithm', 'Typical use', 'Notes'],
      rows: [
        ['Raft', 'etcd, Consul, Cockroach', 'Understandable; leader-based'],
        ['Paxos/Multi-Paxos', 'Chubby, early Google', 'Correctness proof classic'],
        ['Zab', 'ZooKeeper', 'Primary order for ZK tree'],
        ['PBFT', 'Permissioned blockchain', 'Byzantine faults, expensive'],
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Config service stores feature flags. 3-node Raft cluster: leader accepts CAS updates, replicates log entry, commits after 2 acks. Minority partition cannot elect leader or commit — clients get unavailable (CP) rather than diverge.',
    },
  ],
  tradeoffs: {
    advantages: [
      'Strong agreement on order and values',
      'Enables consistent metadata and coordination',
      'Well-studied safety properties',
    ],
    disadvantages: [
      'Latency: round trips to majority',
      'Throughput capped by single leader (Raft)',
      'Minority partition unavailable for writes',
      'Operational complexity (odd member count, upgrades)',
    ],
    alternatives: [
      'Primary-replica async (weaker consistency, higher availability)',
      'CRDTs for commutative merges without consensus',
      'External single leader (managed RDS) avoiding DIY Raft',
    ],
    whenToUse: [
      'Coordination: locks, leader election, config',
      'Replicated state machine needing strong order',
    ],
    whenNotToUse: [
      'Analytics counters where approximate OK',
      'Globally low-latency writes — consensus is inherently quorum-bound',
    ],
  },
  failureModes: [
    'Split brain if two leaders (broken fencing)',
    'Unbounded election churn on flaky network',
    'Log divergence if bug bypasses commit rules',
    'Clock not used in Raft but misapplied in custom variants',
  ],
  production: {
    reliability: ['Odd cluster size (3,5)', 'Fencing tokens on leader change', 'Jepsen-style testing'],
    performance: ['Batch append entries', 'Snapshot + truncate log'],
    observability: ['Leader term, commit index, election metrics'],
  },
  interview: {
    expectations: [
      'Why consensus needed',
      'Raft high-level: election + replication',
      'Quorum size tradeoffs',
    ],
    commonQuestions: [
      'What is consensus?',
      'Raft vs Paxos?',
      'Why odd number of nodes?',
    ],
    followUps: [
      'What happens during partition?',
      'Can Raft scale writes horizontally?',
    ],
    misconceptions: [
      'Consensus solves all distributed problems',
      'Any 2 nodes enough — need majority quorum',
    ],
    traps: [
      'Confusing consensus with load balancing',
    ],
    strongSignals: [
      'Majority quorum math',
      'CP behavior during partition',
      'Fencing on leader failover',
    ],
  },
  keyTakeaways: [
    'Consensus = agree on value/order despite failures.',
    'Majority quorum required for commit.',
    'Raft: elect leader, replicate log, commit on majority ack.',
    'Safety vs liveness: partition may sacrifice liveness (CP).',
    'Use for coordination; not every datastore op needs full Raft DIY.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why distributed consensus?', answerHint: 'Prevent divergent replicas; agree on single ordered truth.' },
    { level: 'intermediate', question: 'Raft leader role?', answerHint: 'Accept client ops, append to log, replicate, commit after majority.' },
    { level: 'advanced', question: '3-node cluster, partition 1 vs 2?', answerHint: 'Side with 2 nodes has quorum, elects leader; singleton side cannot commit.' },
  ],
  flashcards: [
    { front: 'Quorum', back: 'Majority of N nodes required for decision' },
    { front: 'Raft commit', back: 'Entry committed once replicated to majority' },
    { front: 'Split brain', back: 'Two leaders — prevented by term + quorum' },
    { front: 'Odd cluster size', back: 'Avoid ties; 3 nodes tolerate 1 failure' },
  ],
  quickRevision: [
    'Leader election + log replication',
    'Majority to commit',
    'CP during partition',
    'etcd/ZK use cases',
    'Fencing on failover',
  ],
  systemDesign: {
    problem: 'Design a distributed configuration store (feature flags, service discovery entries) requiring strong consistency across datacenter nodes.',
    requirements: {
      functional: ['Get/set/delete key', 'Watch key changes', 'Compare-and-set'],
      nonFunctional: ['Linearizable reads/writes', 'Survive 1 node failure in 3-node cluster', 'Low write QPS (~1k/s)'],
    },
    scaleAssumptions: ['1k writes/s', '50k reads/s', '3-5 node cluster'],
    capacityEstimates: ['Keys ~100MB total; log snapshots periodic'],
    api: [{ type: 'code', language: 'http', code: `GET /v1/keys/{key}\nPUT /v1/keys/{key}\nWATCH /v1/keys/{key}` }],
    dataModel: [{ type: 'list', items: ['Replicated log of mutations', 'Materialized key-value state from log apply'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Raft cluster behind gRPC API. Leader handles writes; reads from leader or linearizable follower read if implemented.' }],
    diagram: {
      mermaid: `flowchart LR
  Client --> API[Config API]
  API --> L[Raft Leader]
  L --> F1[Follower]
  L --> F2[Follower]`,
      caption: 'Raft-backed config cluster',
    },
    dataFlow: ['Write → leader append → replicate → commit → apply to KV', 'Watch → long poll/stream on commit index'],
    storage: ['Embedded RocksDB per node for snapshot + log'],
    caching: ['Client-side cache with revision tokens; validate on read if needed'],
    asyncProcessing: ['Push watch notifications on commit'],
    scaling: ['Vertical scale leader; shard configs by prefix if massive (advanced)'],
    consistency: ['Linearizable via Raft commit'],
    reliability: ['Auto leader election; client retry on NOT_LEADER redirect'],
    failureScenarios: ['Leader crash → election ~seconds', 'Minority partition → unavailable writes'],
    security: ['mTLS between nodes; auth on API'],
    observability: ['commitIndex, electionCount, apply lag'],
    bottlenecks: ['Single leader write throughput', 'Large watch fanout'],
    alternatives: ['Managed etcd/Consul', 'ZooKeeper'],
    tradeoffs: ['Strong consistency vs write latency', 'DIY Raft vs managed service'],
    interviewFollowUps: ['Why not use Postgres?', 'Read from followers stale?'],
    evolution: [
      { stage: '1. Simple design', description: 'Single DB primary.', bottleneck: 'Not distributed metadata HA.' },
      { stage: '2. Improve', description: '3-node Raft cluster.', bottleneck: 'Leader write ceiling.' },
      { stage: '3. Improve', description: 'Snapshots, watch streaming, CAS.', bottleneck: 'Multi-region latency.' },
      { stage: '4. Scale further', description: 'Regional clusters with async federation (weaker global consistency).', bottleneck: 'Global linearizability cost.' },
    ],
  },
}
