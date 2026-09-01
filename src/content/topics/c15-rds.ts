import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Amazon RDS (Relational Database Service) manages PostgreSQL, MySQL, Aurora, and others: automated backups, Multi-AZ failover, read replicas, patching, and monitoring. You choose instance class and storage; AWS handles OS and database engine maintenance operations.',
  whyExists:
    'Self-managed DB on EC2 means you handle backups, failover, replication, and patches at 3 AM. RDS provides HA Postgres with point-in-time recovery so app teams focus on schema and queries not disk failures.',
  mentalModel:
    'Database as a managed appliance. RDS instance is the primary engine; Multi-AZ standby syncs in another AZ; read replica serves read scale with async replication lag.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Feature', 'Purpose'],
      rows: [
        ['Multi-AZ', 'Sync standby failover ~60s on primary failure'],
        ['Read replica', 'Async copy for read scaling — replication lag'],
        ['Automated backup', 'Daily snapshot + transaction logs — PITR'],
        ['Parameter group', 'Engine tunables — max_connections, work_mem'],
        ['Subnet group', 'DB subnets in multiple AZs — no public access'],
        ['Aurora', 'AWS-native storage replicated 6 ways; faster failover'],
      ],
    },
    {
      type: 'list',
      items: [
        'Connection string points to cluster endpoint (Aurora) or primary endpoint.',
        'Failover DNS same hostname — apps reconnect.',
        'Storage autoscaling for gp3/io1.',
        'RDS Proxy pools connections for Lambda/serverless burst.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Spring Boot jdbc:postgresql://mydb.abc.us-east-1.rds.amazonaws.com:5432/app. Multi-AZ enabled. Read replica endpoint for reporting queries. Automated backup 7-day retention; restore to yesterday 3 PM via PITR after bad migration.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Multi-AZ sync replication to standby — not read scaling.',
        'Aurora storage layer separate from compute — 6 copies across AZs.',
        'Backup window and maintenance window scheduled.',
        'Enhanced monitoring OS metrics 1-second granularity.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Managed HA and backups', 'Familiar SQL engines', 'Read replica scaling'],
    disadvantages: ['Less control than self-hosted', 'Failover brief disconnect', 'Replica lag for read-your-writes'],
    alternatives: ['Aurora Serverless v2 for variable load', 'DynamoDB for key-value scale', 'Self-managed on EC2'],
    whenToUse: ['Transactional OLTP Postgres/MySQL', 'Need PITR and Multi-AZ'],
    whenNotToUse: ['Massive horizontal write scale — consider sharding/DynamoDB'],
  },
  failureModes: [
    'Publicly accessible RDS — internet exposure',
    'Single AZ — no failover',
    'Read replica for critical read-your-writes — stale reads',
    'Connection storm exhausts max_connections — need pooler',
    'Long transaction blocks failover',
  ],
  production: {
    reliability: ['Multi-AZ prod', 'PITR tested restore drills', 'RDS Proxy for connection pooling'],
    security: ['Private subnet SG app-only', 'Encryption at rest and in transit', 'IAM auth optional'],
    observability: ['CloudWatch CPU, connections, replica lag', 'Performance Insights slow queries'],
    cost: ['Right-size instance', 'Reserved instances for steady load', 'Stop dev RDS nights'],
  },
  interview: {
    expectations: ['Multi-AZ vs read replica', 'PITR', 'Why not DB on EC2'],
    commonQuestions: ['RDS HA design?', 'Read scaling Postgres on AWS?'],
    followUps: ['Aurora vs RDS Postgres?', 'Connection pooling?'],
    misconceptions: ['Multi-AZ doubles read capacity', 'Replica sync with primary'],
    traps: ['Public RDS for convenience'],
    strongSignals: ['Private subnet + SG', 'Proxy for Lambda', 'PITR restore story'],
  },
  keyTakeaways: [
    'RDS manages backups, patching, Multi-AZ failover.',
    'Multi-AZ = HA sync standby; read replica = async read scale.',
    'PITR from automated backups + transaction logs.',
    'DB in private subnets; app SG only ingress.',
    'RDS Proxy pools connections for serverless/microservices.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Multi-AZ vs read replica?', answerHint: 'Multi-AZ sync failover HA; replica async read scaling with lag.' },
    { level: 'intermediate', question: 'PITR on RDS?', answerHint: 'Restore to any second within backup retention using logs + snapshots.' },
    { level: 'advanced', question: 'Lambda many concurrent DB connections?', answerHint: 'RDS Proxy pools; or limit concurrency; avoid one connection per invocation.' },
  ],
  flashcards: [
    { front: 'Multi-AZ RDS', back: 'Synchronous standby in another AZ for failover' },
    { front: 'Read replica lag', back: 'Async replication delay — stale reads possible' },
    { front: 'PITR', back: 'Point-in-time recovery to specific timestamp' },
  ],
  quickRevision: [
    'Multi-AZ HA',
    'Replica read scale',
    'PITR backups',
    'Private subnet',
    'RDS Proxy pool',
  ],
}
