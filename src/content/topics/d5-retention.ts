import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Data retention policies define how long data is kept live, archived, or permanently deleted — driven by law (GDPR), cost, and product needs. Implementation uses TTL columns, partition drops, lifecycle rules (S3 Glacier), compaction, and legal holds overriding default expiry.',
  whyExists:
    'Storage costs grow unbounded; regulations require deletion (right to erasure) and limits (financial record 7 years). Without retention strategy, databases bloat, backups slow, and compliance audits fail.',
  mentalModel:
    'Data lifecycle: hot (fast storage) → warm (cheaper) → cold (archive) → delete. Automate transitions; tombstone/delete must propagate to replicas, caches, search indexes, and backups policy.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Layer', 'Mechanism', 'Example'],
      rows: [
        ['RDBMS', 'DELETE + vacuum / DROP partition', 'Drop events_2024_01 after archive'],
        ['Redis', 'EXPIRE TTL', 'Session 24h'],
        ['S3', 'Lifecycle transition/expiration', '30d Standard → Glacier → delete 7yr'],
        ['Cassandra', 'default_time_to_live', 'TTL 90d on rows'],
        ['Logs/ES', 'ILM index rollover delete', 'Keep 30d hot logs'],
        ['Backups', 'Backup retention separate', 'PITR 35d, monthly 1yr'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Tiered retention lifecycle',
      diagram: `flowchart LR
  Hot[(Hot DB 90d)] --> Archive[(S3 Parquet)]
  Archive --> Glacier[(Glacier 7yr)]
  Glacier --> Delete[Purge after legal period]
  GDPR[GDPR delete request] --> Hot
  GDPR --> Archive
  GDPR --> Search[Search index purge]`,
    },
    {
      type: 'list',
      items: [
        'Define retention per data class (PII, telemetry, financial)',
        'GDPR delete: cascade user_id across systems async with audit',
        'Legal hold freezes deletion for litigation',
        'Replicate delete to search/CDN cache purge',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Chat messages TTL 1 year in Cassandra; nightly job exports last month to S3 for compliance archive 7 years; user delete API publishes UserDeleted event → workers purge DB, S3 prefixes, Elasticsearch docs within 30 days SLA.',
    },
  ],
  tradeoffs: {
    advantages: ['Cost control', 'Compliance', 'Faster queries on smaller hot set'],
    disadvantages: ['Irrecoverable if deleted without archive', 'Cross-system delete complexity', 'Legal hold overrides automation'],
    alternatives: ['Keep everything — expensive and risky GDPR'],
    whenToUse: ['All production data classes', 'Logs, events, user content'],
    whenNotToUse: ['Never delete without policy — default should still exist'],
  },
  failureModes: [
    'Deleted in DB but remains in S3 backup/search → GDPR violation',
    'TTL clock skew premature delete',
    'Partition drop without archive loses compliance evidence',
    'Cache serves deleted user data',
    'Backup retention longer than data retention restores deleted PII',
  ],
  production: {
    reliability: ['Verify delete propagation with reconciliation jobs'],
    cost: ['Lifecycle to cold tiers', 'Drop partitions vs row DELETE'],
    security: ['Audit delete operations', 'Encrypt archives'],
    observability: ['Storage growth trends', 'Delete queue lag', 'Failed purge alerts'],
    maintainability: ['Document retention matrix per table/bucket'],
  },
  interview: {
    expectations: ['Tiered storage', 'GDPR cascade', 'Partition drop vs delete'],
    commonQuestions: ['Design log retention?', 'Delete user everywhere?'],
    followUps: ['Legal hold?', 'Backup vs data retention?'],
    misconceptions: ['TTL alone satisfies GDPR without index/cache purge'],
    traps: ['Hard delete without archive when finance needs 7yr records'],
    strongSignals: ['UserDeleted event fan-out', 'S3 lifecycle + legal hold', 'ILM for logs'],
  },
  keyTakeaways: [
    'Classify data; set hot/warm/cold/delete timelines.',
    'Automate with TTL, partitions, lifecycle rules.',
    'Deletes must cascade to derivatives (search, cache, CDN).',
    'Backup retention is separate policy.',
    'Legal hold pauses automated deletion.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Why data retention policies?', answerHint: 'Cost, performance, legal compliance, privacy.' },
    { level: 'intermediate', question: 'Efficiently drop 1 year old logs in Postgres?', answerHint: 'Monthly partitions DETACH/DROP after S3 archive.' },
    { level: 'advanced', question: 'GDPR erasure across microservices?', answerHint: 'UserDeleted event, idempotent purge workers per store, audit trail, backup handling policy.' },
  ],
  flashcards: [
    { front: 'S3 lifecycle', back: 'Automated transition Standard→IA→Glacier→expiration' },
    { front: 'GDPR erasure scope', back: 'All copies including backups policy, caches, indexes' },
    { front: 'Legal hold', back: 'Blocks deletion despite retention expiry' },
    { front: 'Cassandra TTL', back: 'Row expires automatically after TTL seconds' },
  ],
  quickRevision: [
    'Classify data lifetimes',
    'Partition drop archive',
    'Cascade deletes',
    'Backup policy separate',
    'Legal hold exception',
  ],
  systemDesign: {
    problem: 'Design retention for multi-tenant SaaS storing user documents, audit logs, and analytics with GDPR and 7-year invoice retention.',
    requirements: {
      functional: ['Auto-expire old sessions', 'Delete user on request', 'Retain invoices 7 years'],
      nonFunctional: ['GDPR 30 day delete SLA', 'Minimize hot storage cost'],
    },
    scaleAssumptions: ['1M tenants', 'PB documents over time'],
    capacityEstimates: ['Hot docs 90d S3 Standard; audit partitions monthly drop post-archive'],
    api: [{ type: 'code', language: 'http', code: `DELETE /users/{id} GDPR erasure\nAdmin retention policy config per data class` }],
    dataModel: [{ type: 'list', items: ['data_classification table', 'delete_jobs queue', 'invoices immutable 7yr WORM bucket'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'Orchestrator on UserDeleted fans out purge tasks; S3 lifecycle for docs; Postgres partition drop for audit; invoices exempt bucket with Object Lock.' }],
    diagram: {
      mermaid: `flowchart TB
  Del[DELETE user] --> Orch[Delete orchestrator]
  Orch --> DB[(DB purge)]
  Orch --> S3[S3 prefix delete]
  Orch --> ES[Search purge]
  Orch --> Cache[Cache purge]
  Inv[invoices WORM] -.retain 7yr.-> Orch`,
      caption: 'Coordinated erasure with legal exceptions',
    },
    dataFlow: ['Schedule TTL jobs', 'GDPR triggers async purge with verification scan'],
    storage: ['Tiered S3 + partitioned audit DB'],
    caching: ['Invalidate on purge'],
    asyncProcessing: ['Delete workers + reconciliation scanner'],
    scaling: ['Queue-based purge horizontal workers'],
    consistency: ['Eventual delete across systems within SLA'],
    reliability: ['Retry failed purge; DLQ for manual'],
    failureScenarios: ['Missed search doc — reconciliation finds orphan PII'],
    security: ['Audit all deletes', 'WORM for invoices'],
    observability: ['Purge queue lag, storage by class, failed jobs'],
    bottlenecks: ['Large tenant delete — batch async'],
    alternatives: ['Central data catalog with lineage'],
    tradeoffs: ['Hard delete vs soft delete tombstone period'],
    interviewFollowUps: ['Restore from backup after GDPR?', 'Tenant export before delete?'],
    evolution: [
      { stage: '1. Simple design', description: 'Keep forever.', bottleneck: 'Cost + GDPR.' },
      { stage: '2. Improve', description: 'Manual DELETE scripts.', bottleneck: 'Missed systems.' },
      { stage: '3. Improve', description: 'Lifecycle + orchestrated GDPR.', bottleneck: 'Large tenant purge time.' },
      { stage: '4. Scale further', description: 'Data catalog lineage automated retention.', bottleneck: 'Org policy complexity.' },
    ],
  },
}
