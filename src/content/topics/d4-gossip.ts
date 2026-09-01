import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Gossip protocols propagate cluster state by each node periodically exchanging membership/health info with random peers — epidemic dissemination reaching eventual consistency without central coordinator. Used in Cassandra, Dynamo membership, Consul Serf, and failure detection.',
  whyExists:
    'Central registry is SPOF and scale bottleneck. Gossip scales O(log N) rounds to spread update with minimal bandwidth — nodes learn who is alive, ring topology, and schema versions decentralized.',
  mentalModel:
    'Office rumor mill. Each person tells random colleague latest news; quickly everyone knows who is out sick. Phi accrual failure detector interprets missed gossip as node suspect/dead without synchronized clocks.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Gossip spread in rounds',
      diagram: `flowchart TB
  A[Node A state v5] -->|gossip| B[Node B]
  A -->|gossip| C[Node C]
  B -->|next round| D[Node D]
  C -->|next round| D
  Note[D learns state within log rounds]`,
    },
    {
      type: 'list',
      items: [
        'SWIM protocol: ping → ack; indirect ping on timeout; suspect then confirm dead.',
        'Anti-entropy: Merkle tree compare data ranges reconcile differences.',
        'Cassandra gossip: endpoint states VERSION/HOST_ID/RPC address.',
        'Convergence time ~ O(log N) rounds with fanout f.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Cassandra cluster node join: gossips its token range to peers; within seconds all nodes update ring metadata without master. Node failure: missed heartbeats mark DOWN; replicas on other nodes serve reads with hinted handoff until rejoin.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Phi accrual failure detector adaptive to network jitter vs fixed timeout.',
        'Seed nodes bootstrap new members — not coordinators permanently.',
        'Partition: gossip may split views — need quorum reads/writes separately.',
        'Bandwidth capped gossip rate prevents storm on large clusters.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['No central SPOF for membership', 'Scales to large clusters', 'Self-healing awareness'],
    disadvantages: ['Eventual membership view', 'Split-brain risk under partition', 'Tuning suspicion thresholds'],
    alternatives: ['ZooKeeper/etcd consensus for membership', 'Kubernetes API server registry', 'Load balancer health checks only'],
    whenToUse: ['Large decentralized databases', 'Cluster failure detection', 'Epidemic config spread'],
    whenNotToUse: ['Strong consistent membership required instantly', 'Tiny two-node cluster'],
  },
  failureModes: [
    'Network partition — split membership views',
    'Flapping node causes unnecessary data movement',
    'Seed node all down — join difficulty not total outage',
    'Gossip storm if interval too aggressive on 1000 nodes misconfigured',
    'False positive death marks node unnecessarily',
  ],
  production: {
    reliability: ['Quorum reads/writes independent of gossip view lag', 'Multiple seed nodes across AZ'],
    observability: ['Monitor gossip round trip and suspect count'],
    performance: ['Tune gossip interval vs convergence SLA'],
  },
  interview: {
    expectations: ['Epidemic dissemination', 'SWIM failure detection', 'Eventual membership', 'vs centralized registry'],
    commonQuestions: ['How Cassandra nodes discover each other?', 'Gossip vs ZooKeeper?'],
    followUps: ['Split brain under partition?', 'Seed nodes role?'],
    misconceptions: ['Gossip provides strong consistency for data', 'Instant cluster-wide sync'],
    traps: ['Using gossip alone for distributed locking'],
    strongSignals: ['O(log N) convergence', 'Phi accrual', 'SWIM ping/indirect ping', 'Seed bootstrap only'],
  },
  keyTakeaways: [
    'Gossip spreads state via random peer exchanges.',
    'Eventually all nodes converge on membership view.',
    'SWIM detects failures with ping/indirect ping.',
    'Complements not replaces quorum consistency for data.',
    'Seed nodes bootstrap; no permanent master.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Gossip protocol purpose?', answerHint: 'Decentralized epidemic spread of cluster state and failure detection.' },
    { level: 'intermediate', question: 'Gossip vs ZooKeeper membership?', answerHint: 'Gossip scalable eventual; ZK strong consistent smaller coordination service.' },
    { level: 'advanced', question: 'Network partition effect on gossip?', answerHint: 'Split views each side thinks others dead — need quorum/separate consistency for data.' },
  ],
  flashcards: [
    { front: 'SWIM', back: 'Scalable Weakly-consistent Infection-style Membership protocol' },
    { front: 'Seed node', back: 'Bootstrap contact for new nodes — not permanent leader' },
    { front: 'Convergence', back: 'All nodes learn update in O(log N) gossip rounds' },
    { front: 'Phi accrual', back: 'Adaptive failure detector using heartbeat history' },
  ],
  quickRevision: ['Random peer exchange', 'Eventual membership', 'SWIM failure detect', 'Seeds bootstrap', 'Not data consensus alone'],
}
