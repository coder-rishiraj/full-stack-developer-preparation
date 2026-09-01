import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Kafka consumer group rebalancing redistributes partition assignments when consumers join, leave, or crash — each partition consumed by exactly one consumer in group at a time. Rebalance protocols (range, round-robin, sticky, cooperative) trade fairness, stickiness, and stop-the-world pause during reassignment.',
  whyExists:
    'Scale consumption horizontally by adding consumers — must reassign partitions. Without rebalance, new consumer idle or duplicate reads occur. Cooperative sticky rebalance (incremental) minimizes partition revocation — only move what is necessary.',
  mentalModel:
    'Team of readers splitting book chapters. Someone leaves — chapters reassigned. Stop-the-world: everyone stops reading during shuffle. Cooperative: only affected readers pause. Max consumers useful = partition count (extra consumers idle).',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Consumer join triggers rebalance',
      diagram: `sequenceDiagram
  participant C1 as Consumer1
  participant C2 as Consumer2
  participant C3 as Consumer3 new
  participant G as Group Coordinator
  C3->>G: JoinGroup
  G->>C1: Revoke partitions
  G->>C2: Revoke partitions
  G->>G: Assign partitions 0-2 C1, 3-5 C2, 6-7 C3
  G->>C1: OnPartitionsAssigned
  G->>C2: OnPartitionsAssigned
  G->>C3: OnPartitionsAssigned`,
    },
    {
      type: 'table',
      headers: ['Protocol', 'Behavior'],
      rows: [
        ['Eager (classic)', 'All consumers revoke all; full reassignment — stop-the-world'],
        ['Cooperative sticky', 'Incremental revoke only needed partitions — less pause'],
        ['Range', 'Divide partitions by topic ranges per consumer — can skew'],
        ['Round-robin', 'Cycle partitions across consumers'],
        ['max.poll.interval.ms', 'Consumer kicked if poll too slow — triggers rebalance'],
      ],
    },
    {
      type: 'list',
      items: [
        'Group coordinator broker manages membership and assignment.',
        'Static membership (group.instance.id) reduces rebalance on brief restart.',
        'Rebalance listener: onPartitionsRevoked commit offsets; onPartitionsAssigned seek.',
        'partition.assignment.strategy config selects cooperative-sticky in modern clients.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Rebalance listener commit on revoke',
      code: `consumer.subscribe(List.of("orders"), new ConsumerRebalanceListener() {
  @Override
  public void onPartitionsRevoked(Collection<TopicPartition> partitions) {
    consumer.commitSync(); // commit before losing partitions
  }
  @Override
  public void onPartitionsAssigned(Collection<TopicPartition> partitions) {
    // optional: seek to committed offset
  }
});`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Rebalance timeout: session.timeout.ms and heartbeat.interval.ms detect failed consumer.',
        'Consumer cannot poll during long processing — exceed max.poll.interval.ms.',
        'KIP-848 consumer group protocol (next gen) reduces rebalance latency further.',
        'Exactly-once processing must handle duplicate delivery across rebalance boundary.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Horizontal scale consumption', 'Cooperative reduces downtime', 'Static membership stabilizes rolling deploys'],
    disadvantages: ['Rebalance pauses processing', 'Duplicate processing at revoke boundary', 'More consumers than partitions waste resources'],
    alternatives: ['Increase partitions before consumers', 'Single consumer with multithreaded processing per partition'],
    whenToUse: ['Consumer group scaling', 'Rolling deploy of stream processors'],
    whenNotToUse: ['More consumers than partitions expecting parallel speedup'],
  },
  failureModes: [
    'Rebalance storm — frequent join/leave from flaky health checks',
    'Long GC pause exceeds max.poll.interval — constant rebalance',
    'Forgot commit on revoke — duplicate processing after reassignment',
    'Stop-the-world rebalance during peak — consumption lag spike',
    '12 consumers 6 partitions — 6 idle consumers',
  ],
  production: {
    reliability: ['Cooperative-sticky assignor', 'Static group.instance.id per pod', 'Commit sync on revoke'],
    performance: ['Partitions >= peak consumer count', 'Process records faster than max.poll.interval'],
    observability: ['Alert rebalance rate metric', 'Track consumer lag during deploys'],
    maintainability: ['Document partition count change requires planned rebalance'],
  },
  interview: {
    expectations: ['Why rebalance happens', 'Partitions vs consumers', 'Revoke commit pattern', 'Cooperative vs eager'],
    commonQuestions: ['Consumer lag during deploy?', 'Max useful consumers?'],
    followUps: ['Static membership?', 'max.poll.interval.ms issue?'],
    misconceptions: ['Adding consumers always increases throughput', 'Rebalance is free instant'],
    traps: ['Heavy processing inside poll loop without pause'],
    strongSignals: ['Cooperative sticky', 'onPartitionsRevoked commit', 'partition count planning'],
  },
  keyTakeaways: [
    'Rebalance reassigns partitions when group membership changes.',
    'Max effective consumers equals partition count.',
    'Commit offsets on partition revoke to avoid duplicates.',
    'Cooperative sticky minimizes stop-the-world pause.',
    'Keep processing under max.poll.interval.ms between polls.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'When does consumer rebalance occur?', answerHint: 'Consumer joins, leaves, crashes, or exceeds session/max poll interval.' },
    { level: 'intermediate', question: '8 partitions 12 consumers — what happens?', answerHint: '8 active consumers get partitions; 4 idle — partitions not split further.' },
    { level: 'advanced', question: 'Duplicates after rebalance?', answerHint: 'Revoked consumer may not commit — new owner reprocesses from last committed offset gap.' },
  ],
  flashcards: [
    { front: 'Group coordinator', back: 'Broker managing consumer group membership and assignment' },
    { front: 'Cooperative rebalance', back: 'Incremental partition revoke — less stop-the-world' },
    { front: 'max.poll.interval.ms', back: 'Max time between poll() calls before consumer removed' },
    { front: 'Static membership', back: 'group.instance.id reduces rebalance on brief restart' },
  ],
  quickRevision: ['Membership change → rebalance', 'Consumers ≤ partitions useful', 'Commit on revoke', 'Cooperative sticky', 'max.poll.interval'],
}
