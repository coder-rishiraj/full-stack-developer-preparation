import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Disaster Recovery (DR) is the process and infrastructure for restoring service after catastrophic failure — region loss, data center fire, ransomware, or operator error. It spans backup strategy, replication topology, runbooks, RTO/RPO targets, and regular restore drills.',
  whyExists:
    'Single-region deployments fail when that region goes offline. Without tested backups and a failover plan, recovery becomes ad-hoc data archaeology. DR converts "hope we never need it" into measurable RTO/RPO commitments and rehearsed procedures.',
  mentalModel:
    'Insurance with a stopwatch. RPO = how much data you can lose (backup/replication lag). RTO = how fast you are back online (failover automation + runbooks). Warm standby costs more but shrinks RTO; cold backups are cheap but slow to restore.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Strategy', 'RTO', 'RPO', 'Cost'],
      rows: [
        ['Backup & restore', 'Hours–days', 'Hours (last snapshot)', 'Low'],
        ['Pilot light', 'Tens of minutes', 'Minutes (async replica)', 'Medium'],
        ['Warm standby', 'Minutes', 'Seconds–minutes', 'Medium-high'],
        ['Active-active multi-region', 'Near zero', 'Near zero (sync caveats)', 'High'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'DR failover flow',
      diagram: `flowchart TB
  Primary[Primary region] -->|continuous replication| Standby[DR region warm]
  Fail[Region failure detected] --> DNS[Route traffic to DR]
  DNS --> Standby
  Standby --> Validate[Smoke tests + data verify]
  Validate --> Live[Resume service]`,
    },
    {
      type: 'list',
      items: [
        '3-2-1 backups: 3 copies, 2 media types, 1 offsite/immutable',
        'Test restores quarterly — untested backup is wishful thinking',
        'Document dependency order: DNS, secrets, DB, queues, workers',
        'Immutable backups defend against ransomware',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'E-commerce platform: primary us-east-1, warm standby us-west-2 with async Postgres replica (RPO ~30s). Route53 health checks detect regional outage → promote replica, scale DR K8s, flip DNS. RTO target 15 minutes. Monthly game day restores a random DB snapshot to staging.',
    },
    {
      type: 'code',
      language: 'text',
      caption: 'DR checklist excerpt',
      code: `RTO/RPO signed by product
Backup retention + encryption keys in DR vault
Runbook: promote replica, verify binlog lag=0, replay queue backlog
Communication template for customer status page
Post-incident: failback plan when primary returns`,
    },
  ],
  tradeoffs: {
    advantages: ['Business continuity after regional disaster', 'Regulatory compliance', 'Customer trust via tested plans'],
    disadvantages: ['Standby infra cost', 'Replication complexity and split-brain risk', 'Drill time from engineering'],
    alternatives: ['Accept outage for non-critical tiers', 'Active-passive only for payment path'],
    whenToUse: ['Revenue-critical systems', 'Compliance mandates', 'Multi-region user base'],
    whenNotToUse: ['Disposable internal tools with no SLA'],
  },
  failureModes: [
    'Backups corrupt or untested — restore fails during real incident',
    'DR region shares fate with primary (same cloud account blast radius)',
    'Failover without data verification — serve corrupt partial state',
    'Forgot secrets/DNS/TLS certs in DR region',
    'Failback causes double-write or data fork',
  ],
  production: {
    reliability: ['Automated backups with point-in-time recovery', 'Cross-region replication with lag monitoring', 'Quarterly restore drills'],
    scalability: ['DR region pre-provisioned capacity or fast scale-out scripts'],
    observability: ['Replication lag alerts', 'Backup success/failure metrics', 'DR drill dashboards'],
    security: ['Encrypted backups', 'Separate DR IAM break-glass roles', 'Immutable backup locks'],
    maintainability: ['Versioned runbooks', 'Infrastructure as code for DR stack'],
    cost: ['Pilot light vs warm standby vs active-active tradeoff'],
  },
  interview: {
    expectations: ['Define RTO/RPO', 'Backup vs replication', 'Multi-region strategies'],
    commonQuestions: ['Design DR for payment DB?', 'How often test backups?'],
    followUps: ['Failback procedure?', 'Ransomware scenario?'],
    misconceptions: ['Replication alone equals DR without runbooks', 'Cloud multi-AZ equals multi-region DR'],
    traps: ['No restore test ever performed'],
    strongSignals: ['3-2-1 backups', 'Game days', 'Pilot light with documented RTO'],
  },
  keyTakeaways: [
    'RPO = acceptable data loss; RTO = acceptable downtime.',
    'Untested backups are not backups.',
    'Warm standby shrinks RTO; active-active shrinks both at high cost.',
    'Runbooks, DNS, secrets, and failback must be rehearsed.',
    'Immutable offsite backups protect against ransomware.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'RTO vs RPO?', answerHint: 'RTO = time to restore service; RPO = max acceptable data loss window.' },
    { level: 'intermediate', question: 'Pilot light vs warm standby?', answerHint: 'Pilot light minimal DR always on; warm standby scaled-down copy ready to scale fast.' },
    { level: 'advanced', question: 'DR after ransomware encrypts primary?', answerHint: 'Immutable offsite backups, isolate network, restore clean snapshot, verify integrity before cutover.' },
  ],
  flashcards: [
    { front: 'RPO', back: 'Recovery Point Objective — max acceptable data loss' },
    { front: 'RTO', back: 'Recovery Time Objective — max acceptable downtime' },
    { front: 'Pilot light DR', back: 'Minimal DR env always running; scale on failover' },
    { front: '3-2-1 backup rule', back: '3 copies, 2 media, 1 offsite' },
  ],
  quickRevision: [
    'RTO downtime',
    'RPO data loss',
    'Test restores',
    'Warm vs cold DR',
    'Failback plan',
  ],
}
