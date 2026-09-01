import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Leader election selects one coordinator node among distributed peers — for single-writer systems, shard master, Kafka controller, or distributed lock holder. Algorithms: Raft election, ZooKeeper ephemeral sequential znodes, Bully (highest ID wins), Redis Redlock variant.',
  whyExists:
    'Many systems need exactly one active leader at a time — assign partitions, serialize writes, or run cron. Without election, split-brain dual leaders corrupt data. Election integrates with lease/TTL so dead leader replaced automatically.',
  mentalModel:
    'Class captain vote. Nodes campaign; quorum agrees one leader for term. Leader sends heartbeats; followers timeout and start new election if heartbeats stop. Step down on partition minority side.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Raft leader election simplified',
      diagram: `sequenceDiagram
  participant F1 as Follower1
  participant F2 as Follower2
  participant C as Candidate
  C->>F1: RequestVote term=2
  C->>F2: RequestVote term=2
  F1-->>C: grant
  F2-->>C: grant
  Note over C: Becomes Leader term 2
  C->>F1: AppendEntries heartbeat
  C->>F2: AppendEntries heartbeat`,
    },
    {
      type: 'table',
      headers: ['Mechanism', 'Used in'],
      rows: [
        ['Raft election', 'etcd, Consul, CockroachDB'],
        ['ZooKeeper sequential node', 'Kafka old controller, Hadoop'],
        ['Kafka KRaft', 'Raft-based controller quorum'],
        ['Kubernetes Lease', 'controller-manager leader'],
        ['Bully algorithm', 'Academic / LAN systems'],
      ],
    },
    {
      type: 'list',
      items: [
        'Term/epoch monotonic — stale leader requests rejected.',
        'Quorum majority required to win — split-brain prevention.',
        'Leader lease: followers accept leader for lease duration without re-election.',
        'Fencing token issued with leadership for storage writes.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'ZooKeeper leader election sketch',
      code: `// Create EPHEMERAL_SEQUENTIAL /election/node-
// Lowest sequence holder is leader
// Others watch next lower node for fail-over
CuratorFramework client = ...;
LeaderSelector selector = new LeaderSelector(client, "/election", () -> {
  // run while leader
  while (isLeader) { doWork(); Thread.sleep(1000); }
});
selector.start();`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Randomized election timeout reduces split vote collisions Raft.',
        'Pre-vote phase avoids disrupted term increment on flaky node.',
        'Observer nodes participate without vote — scale read in ZK.',
        'Brainstorm: minority partition cannot elect quorum — unavailability chosen.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Automatic failover', 'Clear single writer', 'Well-studied Raft/ZK tooling'],
    disadvantages: ['Election flap during instability', 'Quorum required — minority partition unavailable', 'Extra coordination latency'],
    alternatives: ['External static primary', 'Consensus-less CRDT multi-writer', 'DB advisory lock'],
    whenToUse: ['Kafka controller', 'Scheduler single leader', 'Shard primary assignment'],
    whenNotToUse: ['Horizontally writable sharded data with no single leader need'],
  },
  failureModes: [
    'Split-brain two leaders without quorum fencing',
    'Election storm network jitter',
    'Zombie leader writes after losing election without fencing',
    'Even number nodes tie — need odd quorum',
    'GC pause exceeds lease — false re-election',
  ],
  production: {
    reliability: ['Odd number voters 3 or 5', 'Fencing tokens on storage', 'Stable network between voters'],
    observability: ['Alert leader changes frequency', 'Track term/epoch metrics'],
    maintainability: ['Runbook manual step-down for maintenance'],
  },
  interview: {
    expectations: ['Quorum majority', 'Term/epoch stale leader', 'Raft vs ZK election', 'Fencing token'],
    commonQuestions: ['Elect leader in distributed system?', 'Split brain prevention?'],
    followUps: ['Kafka controller role?', 'Even nodes problem?'],
    misconceptions: ['Any node can be leader anytime without vote', 'Leader election equals data consensus alone'],
    traps: ['Two nodes only no fault tolerance'],
    strongSignals: ['Majority quorum', 'Heartbeats + timeout', 'Fencing stale leader', 'Odd voter count'],
  },
  keyTakeaways: [
    'Leader election picks one coordinator with quorum agreement.',
    'Raft/ZK common production implementations.',
    'Term/epoch rejects stale leader requests.',
    'Fencing prevents old leader corrupting state.',
    'Use odd number nodes for clear majority.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why leader election?', answerHint: 'Ensure single coordinator for writes/scheduling — avoid split-brain dual leaders.' },
    { level: 'intermediate', question: 'Raft leader election steps?', answerHint: 'Follower timeout → candidate RequestVote → majority grants → leader sends heartbeats.' },
    { level: 'advanced', question: 'Old leader alive after new elected?', answerHint: 'Higher term rejects old writes; fencing token on storage blocks stale leader.' },
  ],
  flashcards: [
    { front: 'Quorum', back: 'Majority votes required to elect valid leader' },
    { front: 'Term', back: 'Monotonic epoch — stale leader requests rejected' },
    { front: 'Fencing token', back: 'Storage rejects writes from demoted leader' },
    { front: 'EPHEMERAL_SEQUENTIAL', back: 'ZK node pattern for leader election queue' },
  ],
  quickRevision: ['Quorum elects one', 'Heartbeats + timeout', 'Term rejects stale', 'Fencing writes', 'Odd voters'],
}
