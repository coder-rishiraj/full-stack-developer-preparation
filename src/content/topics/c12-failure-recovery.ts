import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Failure recovery restores acceptable operation after outages — runbooks, automated failover, replay from Kafka, restore from backup, chaos testing validated paths. Includes RTO/RPO targets, multi-AZ deployment, consumer lag catch-up, and post-incident review. Not just restart — data correctness and idempotent replay matter.',
  whyExists:
    'Systems fail — brokers die, regions flood, bad deploys happen. Recovery plan prevents panic deletes and data loss. Backend interviews ask how service resumes after Kafka lag spike or DB failover without double-charging users.',
  mentalModel:
    'Prepare before failure: backups, replicas, idempotency, DLQ. Detect fast: health checks, alerts. Recover: failover, scale consumers, replay with dedup. Learn: blameless postmortem, fix root cause, automate runbook step.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Failure', 'Recovery action'],
      rows: [
        ['Kafka broker loss', 'ISR leader election; producers refresh metadata'],
        ['Consumer lag spike', 'Scale consumers; fix poison pill to DLQ'],
        ['DB primary failure', 'Promote replica; update DNS/connection string'],
        ['Bad deploy', 'Rollback canary; feature flag kill'],
        ['Region outage', 'Failover DNS to secondary region; accept staleness'],
        ['Data corruption', 'Point-in-time restore; reconcile downstream'],
      ],
    },
    {
      type: 'list',
      items: [
        'RTO: max downtime acceptable; RPO: max data loss window',
        'Runbooks in repo — tested quarterly game days',
        'Replay Kafka from offset/timestamp with idempotent consumers',
        'Graceful shutdown drains in-flight before kill',
        'Postmortem: timeline, root cause, action items',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Payment consumer lag 6 hours after bug fix deploy — scale consumers 3→12, replay not needed if offsets intact. Idempotent dedup prevents double capture. DLQ messages replayed separately after schema fix.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Kubernetes rolling update maxUnavailable controls deploy recovery',
        'Connection pools detect broken connections on retry',
        'Chaos engineering validates failure assumptions',
        'Backup restore test proves RPO achievable',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Reduced MTTR', 'Predictable data loss bounds', 'Customer trust after incidents'],
    disadvantages: ['Cost of multi-AZ/region standby', 'Runbook maintenance', 'Replay complexity'],
    alternatives: ['Accept downtime — non-critical systems only'],
    whenToUse: ['All production tier1 services'],
    whenNotToUse: ['Skipping recovery design for stateful payment paths — unacceptable'],
  },
  failureModes: [
    'Replay without idempotency — duplicate side effects',
    'Failover to stale replica — lost commits',
    'No tested backup restore — RPO fiction',
    'Runbook outdated after architecture change',
    'Scale consumers beyond partitions — no help',
  ],
  production: {
    reliability: ['Multi-AZ, automated failover, idempotent replay', 'Regular game days'],
    observability: ['Incident dashboards: lag, error rate, saturation'],
    maintainability: ['Runbooks as code near services', 'Postmortem action tracking'],
  },
  interview: {
    expectations: ['RTO/RPO', 'Kafka lag recovery', 'Idempotent replay', 'Failover steps'],
    commonQuestions: ['Recover from 6h Kafka lag?', 'DB failover process?', 'Disaster recovery plan?'],
    followUps: ['Chaos testing?', 'Regional failover trade-offs?'],
    misconceptions: ['Restart pod always fixes data issues', 'Replay entire topic always safe'],
    traps: ['Reset offsets earliest without idempotency'],
    strongSignals: ['Idempotent consumers, DLQ replay, tested backups, scale plan, postmortem culture'],
  },
  keyTakeaways: [
    'Define RTO/RPO before incidents.',
    'Idempotency enables safe Kafka replay and consumer catch-up.',
    'Scale consumers to min(partitions, needed throughput).',
    'Test backup restore and runbooks regularly.',
    'Blameless postmortems drive systemic fixes.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'RTO vs RPO?', answerHint: 'RTO max downtime; RPO max acceptable data loss time window.' },
    { level: 'intermediate', question: 'Consumer lag 6 hours after fix?', answerHint: 'Scale consumers; ensure idempotent; monitor catch-up; DLQ separate; do not reset offsets blindly.' },
    { level: 'advanced', question: 'Regional failover with eventual consistency?', answerHint: 'DNS to secondary; accept stale reads; conflict merge; rehearse failover; idempotent cross-region events.' },
  ],
  flashcards: [
    { front: 'RTO', back: 'Recovery Time Objective — max acceptable downtime' },
    { front: 'RPO', back: 'Recovery Point Objective — max acceptable data loss window' },
    { front: 'Idempotent replay', back: 'Reprocess events without duplicate side effects' },
    { front: 'Game day', back: 'Scheduled failure exercise validating runbooks' },
  ],
  quickRevision: ['RTO RPO defined', 'Idempotent replay', 'Scale catch-up', 'Test backups', 'Postmortem learn'],
}
