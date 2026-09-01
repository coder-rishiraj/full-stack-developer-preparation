import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Kafka offset is per-partition cursor pointing to next record to consume. Committed offsets stored in __consumer_offsets topic (or external store). Consumers track current position; commit advances after processing. Reset offsets for replay; lag = high watermark minus committed offset.',
  whyExists:
    'Log is immutable sequential data — offset is cheap bookmark. Enables resume after restart, horizontal consumer groups each tracking partition offsets, and replay by seeking to earlier offset for reprocessing.',
  mentalModel:
    'Partition log is numbered 0..N-1. Consumer reads offset 100, processes, commits 101. Crash before commit → restart at 100 again. Never share offset state between unrelated consumer groups.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Operation', 'API / tool', 'Effect'],
      rows: [
        ['Auto commit', 'enable.auto.commit=true', 'Periodic commit — risky timing'],
        ['Manual commit', 'commitSync / ack.acknowledge()', 'After successful process'],
        ['Seek', 'consumer.seek(partition, offset)', 'Replay or skip'],
        ['Reset', 'kafka-consumer-groups --reset-offsets', 'Ops replay from earliest/latest/timestamp'],
        ['Lag', 'endOffset - committedOffset', 'Backlog per partition'],
      ],
    },
    {
      type: 'list',
      items: [
        'Committed offset = last processed + 1 convention (Kafka consumer API)',
        'auto.offset.reset only when no committed offset exists for group-partition',
        'Isolation level read_committed affects visible offsets with transactions',
        'External offset store (Kafka Connect) for non-standard consumers',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'bash',
      caption: 'Inspect consumer lag',
      code: `kafka-consumer-groups.sh --bootstrap-server localhost:9092 \\
  --group fulfillment-service --describe
# LAG column shows records behind end`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        '__consumer_offsets compacted topic — key group+topic+partition',
        'Commit is async batch to coordinator broker',
        'Rebalance may revoke partition before commit — duplicate risk',
        'Log start offset increases as retention deletes old segments',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Simple resume semantics', 'Replay for recovery', 'Lag observable SLO'],
    disadvantages: ['Commit timing drives delivery semantics', 'Reset mistakes reprocess entire topic', 'External store adds complexity'],
    alternatives: ['Event sourcing snapshot + offset', 'Time-based seek for replay'],
    whenToUse: ['All Kafka consumers — understand commit policy'],
    whenNotToUse: ['Manual offset in app DB without coordination — prefer Kafka commit'],
  },
  failureModes: [
    'Reset earliest on prod consumer group — massive replay',
    'Commit before process — at-most-once loss',
    'Never commit — reprocess forever on restart',
    'Lag alert ignored — consumer stuck',
  ],
  production: {
    observability: ['Lag per partition dashboard', 'Alert lag > threshold'],
    reliability: ['Manual commit after idempotent success', 'Runbook for controlled offset reset'],
    maintainability: ['Document consumer group names per service'],
  },
  interview: {
    expectations: ['What offset is', 'Commit timing semantics', 'Lag', 'Replay'],
    commonQuestions: ['How consumer resume works?', 'Consumer lag meaning?', 'Replay events?'],
    followUps: ['Auto vs manual commit?', '__consumer_offsets?'],
    misconceptions: ['Offset stored in broker main topic', 'Same offset shared across groups'],
    traps: ['Commit before idempotent side effect complete'],
    strongSignals: ['Manual ack, lag monitoring, careful reset procedures, idempotent replay'],
  },
  keyTakeaways: [
    'Offset is per-partition consumer bookmark.',
    'Commit timing defines at-least vs at-most-once.',
    'Lag measures processing backlog.',
    'Reset offsets enables replay — dangerous in prod.',
    'Each consumer group has independent offsets.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is Kafka offset?', answerHint: 'Sequential position in partition log — consumer commits progress.' },
    { level: 'intermediate', question: 'What is consumer lag?', answerHint: 'Difference between log end offset and last committed offset — backlog.' },
    { level: 'advanced', question: 'Replay last 24 hours safely?', answerHint: 'Seek by timestamp or reset offsets with idempotent consumers; test on staging; monitor lag spike.' },
  ],
  flashcards: [
    { front: 'Offset', back: 'Per-partition message index consumer tracks' },
    { front: 'Consumer lag', back: 'End offset minus committed — backlog size' },
    { front: '__consumer_offsets', back: 'Internal topic storing group commit positions' },
    { front: 'Manual commit', back: 'Advance offset after successful processing' },
  ],
  quickRevision: ['Per-partition cursor', 'Commit after process', 'Lag metric', 'Independent per group', 'Reset = replay'],
}
