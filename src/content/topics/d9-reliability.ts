import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Reliability in system design interviews explains how the architecture meets availability and durability targets — redundancy, failover, replication, backups, idempotency, graceful degradation, and SLO/error budget thinking — applied to the specific system you designed.',
  whyExists:
    'Functional HLD without reliability is incomplete. Interviewers assess whether design survives AZ loss, dependency failure, and retry duplicates. Reliability section connects NFR availability numbers to concrete multi-AZ, queue, and idempotency patterns.',
  mentalModel:
    'Bridge load rating. Functional reqs are traffic; NFR availability is safety factor; reliability design is beams (replicas), cables (health checks), joints (idempotency) that hold at rated load after earthquake (AZ failure).',
  howItWorks: [
    {
      type: 'table',
      headers: ['NFR', 'Reliability mechanism', 'Interview phrase'],
      rows: [
        ['99.9% availability', 'Multi-AZ, health checks, autoscale', 'No single AZ dependency'],
        ['No data loss payments', 'Sync replicate + backup PITR', 'RPO near zero money path'],
        ['Survive dependency slow', 'Timeout CB degradation', 'Contain blast radius'],
        ['At-least-once queue', 'Idempotent consumers', 'Dedup keys'],
        ['Regional disaster', 'DR warm standby mention', 'RTO/RPO stated'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Reliability layers',
      diagram: `flowchart TB
  App[Multi-AZ app] --> DB[(HA DB sync replica)]
  App --> CB[Circuit breakers]
  App --> Idem[Idempotency store]
  DB --> Backup[Automated backups PITR]`,
    },
    {
      type: 'list',
      items: [
        'Match reliability depth to stated availability NFR',
        'Separate tier-1 path (payment) from tier-3 (analytics)',
        'Mention SLO/error budget if senior loop',
        'Pair with failure handling — complementary sections',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: '99.95% booking target: API multi-AZ 3+ instances; Postgres multi-AZ sync replica auto-failover; Redis cluster; idempotent booking API; queue for confirmation email at-least-once with dedup; daily backup PITR; exclude planned maintenance in SLA math; game day failover quarterly.',
    },
  ],
  tradeoffs: {
    advantages: ['Maps NFR to engineering', 'Shows operational maturity'],
    disadvantages: ['Over-reliability expensive — state tiering'],
    alternatives: ['Best-effort for internal tools — document'],
    whenToUse: ['After HLD and NFRs', 'With failure handling section'],
    whenNotToUse: ['Never ignore for payment/health systems'],
  },
  failureModes: [
    '99.99% promised on single AZ design',
    'No idempotency with async workers',
    'Backups mentioned never tested',
    'Same reliability for feed and ledger',
    'Reliability without metrics — unmeasurable',
  ],
  production: {
    reliability: ['Multi-AZ HA replication game days', 'Error budget policy'],
    observability: ['SLO dashboards availability SLI'],
    cost: ['Reliability tier matches revenue impact'],
  },
  interview: {
    expectations: ['Multi-AZ', 'Replication backup', 'Idempotency async'],
    commonQuestions: ['Achieve 99.9% how?', 'Reliability for payment path?'],
    followUps: ['RTO RPO?', 'Error budget?'],
    misconceptions: ['Reliability equals failure handling only — includes proactive HA'],
    traps: ['Single region no failover story'],
    strongSignals: ['Tiered reliability', 'Sync replicate money path', 'SLO linkage'],
  },
  keyTakeaways: [
    'Tie reliability mechanisms to stated availability NFR.',
    'Multi-AZ + HA DB + health checks baseline for 99.9%.',
    'Idempotency for async and payment retries.',
    'Backups + PITR for durability; DR for regional.',
    'Tier reliability — payment > feed > analytics.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Improve availability 99% to 99.9%?', answerHint: 'Eliminate SPOF, multi-AZ, replicas, health checks, failover tested.' },
    { level: 'intermediate', question: 'Reliability difference payment vs analytics?', answerHint: 'Payment sync replicate idempotent strong consistency; analytics at-least-once replay OK.' },
    { level: 'advanced', question: 'Error budget in release process?', answerHint: 'SLO burn gates risky launches; freeze when budget exhausted; postmortem on breach.' },
  ],
  flashcards: [
    { front: '99.9% monthly downtime budget', back: 'Approximately 43 minutes' },
    { front: 'Multi-AZ reliability', back: 'Survive single AZ failure with replicas in other AZs' },
    { front: 'Idempotency reliability', back: 'Safe retries without duplicate effects' },
    { front: 'PITR backup', back: 'Point-in-time recovery reduces RPO' },
  ],
  quickRevision: [
    'Match NFR uptime',
    'Multi-AZ HA DB',
    'Idempotent async',
    'Backup PITR',
    'Tier paths',
  ],
}
