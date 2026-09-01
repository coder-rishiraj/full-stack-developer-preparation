import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Failover is the automatic or manual switch from a failed primary component to a healthy standby — database replica promotion, load balancer rerouting, DNS cutover, or leader election in a consensus cluster. Goal: restore availability with minimal data loss and no split brain.',
  whyExists:
    'Hardware, AZs, and regions fail. Running without failover means every primary crash becomes a full outage until human intervention. Automated failover reduces MTTR from hours to seconds when paired with health checks and fencing.',
  mentalModel:
    'Spare tire swap at highway speed. Health detector notices flat tire (failed primary), stops writing to it (fencing), promotes standby (new primary), redirects traffic. The dangerous moment is two drivers steering — split brain.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Layer', 'Mechanism', 'Typical RTO'],
      rows: [
        ['Load balancer', 'Health check removes bad instance', 'Seconds'],
        ['Database', 'Replica promotion / managed failover', 'Seconds–minutes'],
        ['DNS', 'Lower TTL + health-based routing', 'Minutes (TTL bound)'],
        ['Consensus (Raft/etcd)', 'Leader election on heartbeat loss', 'Seconds'],
        ['Multi-region', 'Global load balancer + DR promotion', 'Minutes'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'DB failover with fencing',
      diagram: `sequenceDiagram
  participant App
  participant Primary as Primary DB
  participant Standby as Standby DB
  participant LB as Proxy
  Primary--xPrimary: crash
  LB->>Standby: health fail primary
  LB->>Standby: promote + fence old primary
  App->>Standby: writes resume`,
    },
    {
      type: 'list',
      items: [
        'Health checks must verify real readiness — not just TCP open',
        'Fencing (STONITH, epoch, token) prevents stale primary writes',
        'Connection pools need refresh or proxy layer for transparent failover',
        'Test failover in staging and production game days',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Managed Postgres with synchronous replica in another AZ. Primary AZ outage → RDS automatic failover promotes sync replica (~60s). App uses connection proxy (PgBouncer/RDS proxy) that reconnects to new primary. Idempotent writes and retry logic handle brief write errors during promotion.',
    },
  ],
  tradeoffs: {
    advantages: ['Reduced MTTR', 'Automated recovery for common failures', 'Higher availability SLA'],
    disadvantages: ['Split-brain risk if fencing weak', 'False positive failover flaps', 'Brief unavailability during promotion'],
    alternatives: ['Manual failover only — slower but safer for complex state', 'Active-active with conflict resolution'],
    whenToUse: ['HA databases', 'Multi-AZ services', 'SLO-driven uptime'],
    whenNotToUse: ['Dev environments where downtime acceptable'],
  },
  failureModes: [
    'Split brain — two primaries accept writes → data divergence',
    'Flapping failover on flaky health check',
    'Apps hold stale connections to dead primary',
    'Async replica promoted with data loss beyond RPO',
    'Forgot to reconfigure downstream consumers after promotion',
  ],
  production: {
    reliability: ['Fencing tokens on promotion', 'Sync replica for critical RPO', 'Chaos failover drills'],
    scalability: ['Proxy layer absorbs connection churn', 'Read replicas unaffected by write failover path'],
    observability: ['Failover event alerts', 'Replication lag before promotion', 'Post-failover write error rate'],
    security: ['Break-glass manual failover audit trail', 'Ensure DR credentials pre-staged'],
    maintainability: ['Runbook for manual promotion steps', 'Document split-brain recovery'],
    cost: ['Standby replica infra always running'],
  },
  interview: {
    expectations: ['Automatic vs manual', 'Split brain prevention', 'Health check design'],
    commonQuestions: ['Design DB failover?', 'What is fencing?'],
    followUps: ['Connection pool behavior during failover?', 'DNS failover limits?'],
    misconceptions: ['Failover is instant with zero errors', 'Multi-AZ always prevents all downtime'],
    traps: ['No fencing after promotion'],
    strongSignals: ['STONITH/epoch', 'Proxy reconnect', 'Game day evidence'],
  },
  keyTakeaways: [
    'Failover = redirect traffic to healthy standby after failure detection.',
    'Fencing prevents split brain — only one writable primary.',
    'Health checks must reflect real readiness.',
    'Connection pools and DNS TTL affect perceived failover time.',
    'Rehearse failover — automation fails without testing.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What triggers failover?', answerHint: 'Health check failure, heartbeat loss, manual operator decision.' },
    { level: 'intermediate', question: 'Prevent split brain after DB failover?', answerHint: 'Fencing old primary, quorum-based promotion, STONITH, epoch numbers.' },
    { level: 'advanced', question: 'App behavior during 60s DB failover?', answerHint: 'Retry transient errors, connection pool refresh, idempotent writes, circuit breaker on prolonged failure.' },
  ],
  flashcards: [
    { front: 'Split brain', back: 'Two nodes both believe they are primary and accept writes' },
    { front: 'Fencing', back: 'Forcefully isolate failed node so it cannot write' },
    { front: 'Failover flapping', back: 'Repeated failovers from unstable health checks' },
    { front: 'Connection proxy role in failover', back: 'Routes new connections to promoted primary transparently' },
  ],
  quickRevision: [
    'Detect + promote + redirect',
    'Fence stale primary',
    'Real health checks',
    'Proxy reconnect',
    'Test game days',
  ],
}
