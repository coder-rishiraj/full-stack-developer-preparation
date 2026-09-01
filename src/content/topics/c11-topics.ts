import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Kafka topic is named category/feed of records — logical channel (orders, payments). Config: partitions, replication factor, retention.ms, cleanup.policy (delete vs compact), min.insync.replicas. Producers publish; consumer groups subscribe independently. Topic design affects scale, ordering, and retention policy.',
  whyExists:
    'Organize events by domain boundary. Separate topics isolate failure, retention, and ACLs. Compacted topics keep latest key snapshot for changelog; delete policy for event stream with time retention.',
  mentalModel:
    'One business event type or aggregate stream per topic often — orders.events not one giant bus. Name with domain.env (orders.prod). Set retention for replay window needs. ACL per topic for least privilege.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Config', 'Purpose'],
      rows: [
        ['partitions', 'Parallelism and throughput'],
        ['replication.factor', 'Fault tolerance copies'],
        ['retention.ms', 'How long messages kept'],
        ['cleanup.policy=compact', 'Keep latest per key — changelog topics'],
        ['cleanup.policy=delete', 'Time/size retention — event streams'],
        ['min.insync.replicas', 'Minimum replicas for acks=all'],
      ],
    },
    {
      type: 'list',
      items: [
        'Topic naming: domain.entity.action or domain.events convention',
        'Dead letter: orders.DLT companion topic',
        'Internal topics: __consumer_offsets, __transaction_state',
        'Tiered storage offload old segments — cost vs latency',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Create production topic',
      code: `kafka-topics.sh --create --topic orders \\
  --partitions 24 --replication-factor 3 \\
  --config retention.ms=604800000 \\
  --config min.insync.replicas=2`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Topic metadata in cluster metadata — partition leaders map',
        'Auto.create.topics.enable often disabled in prod',
        'Compaction tombstone null value deletes key',
        'Quota limits bytes in/out per client per topic',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Clear domain boundaries', 'Independent retention and scale', 'ACL granularity'],
    disadvantages: ['Topic proliferation management', 'Cross-topic joins need Streams', 'Wrong retention loses replay ability'],
    alternatives: ['Single mega-topic anti-pattern', 'Multiple event types one topic with type field — coupling'],
    whenToUse: ['Separate bounded contexts', 'Different retention/compaction needs'],
    whenNotToUse: ['Thousands of topics with tiny traffic — metadata overhead'],
  },
  failureModes: [
    '7-day retention but replay needs 30 days',
    'Compact + high cardinality keys — disk blowup',
    'Auto-create with RF=1 in prod',
    'No DLT topic for consumer failures',
  ],
  production: {
    reliability: ['Explicit topic creation IaC', 'RF=3 min ISR=2'],
    scalability: ['Right partition count at create'],
    maintainability: ['Naming convention documented', 'Topic catalog in data mesh'],
    cost: ['Retention tuning; tiered storage'],
  },
  interview: {
    expectations: ['Topic config keys', 'Compact vs delete', 'Naming', 'DLT pattern'],
    commonQuestions: ['Design topics for order system?', 'Retention choice?', 'Compact topic use?'],
    followUps: ['min.insync.replicas?', 'Too many topics?'],
    misconceptions: ['Topics are queues consumed once globally', 'Unlimited retention free'],
    traps: ['One topic for all company events'],
    strongSignals: ['Domain topics, retention aligned to replay, DLT, IaC creation, RF/ISR'],
  },
  keyTakeaways: [
    'Topics organize events with own partitions and retention.',
    'delete policy for events; compact for changelog latest-per-key.',
    'Plan partitions and retention at creation.',
    'Use DLT companion topics for failures.',
    'Disable auto-create in production; use IaC.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is Kafka topic?', answerHint: 'Named feed of records split into partitions — producers write, consumers read.' },
    { level: 'intermediate', question: 'Compact vs delete cleanup?', answerHint: 'Compact keeps latest record per key; delete removes by time/size retention.' },
    { level: 'advanced', question: 'Choose retention for order events?', answerHint: 'Match replay/reaudit needs + legal hold; balance disk cost; maybe 7-30 days hot + tiered archive.' },
  ],
  flashcards: [
    { front: 'Topic', back: 'Named log category with partitions and configs' },
    { front: 'retention.ms', back: 'How long messages kept before delete policy removes' },
    { front: 'cleanup.policy compact', back: 'Keep latest value per key — KTable/changelog' },
    { front: 'min.insync.replicas', back: 'Min replicas required for acks=all commit' },
  ],
  quickRevision: ['Domain topic names', 'Partitions at create', 'Retention = replay window', 'Compact for changelog', 'RF3 ISR2'],
}
