import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A distributed job scheduler executes deferred and recurring tasks (cron, workflows, batch) across a cluster — guaranteeing at-least-once execution, fair resource allocation, and visibility into job state.',
  whyExists:
    'Cron on a single server fails when that node dies and does not scale with millions of jobs. Products need reliable delayed execution (send email in 1 hour), periodic reports, and DAG workflows with retries.',
  mentalModel:
    'Scheduler service places jobs in time-ordered queues (by run_at). Worker pool polls or is pushed work, executes handlers idempotently, updates status. Leader election for cron tick generation. Partition jobs by shard for scale.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Job record: id, schedule (cron or one-shot run_at), payload, status, attempts. Timing wheel or sorted set in Redis/DB for due jobs. Workers claim jobs with lease (visibility timeout) to prevent double execution. DLQ for exhausted retries.',
    },
    {
      type: 'mermaid',
      caption: 'Schedule to execution',
      diagram: `flowchart LR
  API[Job API] --> Store[(Job Store)]
  Sched[Scheduler Leader] --> Store
  Sched --> Q[Due Queue]
  W1[Worker] --> Q
  W1 --> Handler[Job Handler]`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Enqueue one-shot and recurring',
      code: `POST /v1/jobs
{ "type": "send_reminder", "run_at": "2026-08-17T12:00:00Z",
  "payload": { "user_id": "u1" }, "idempotency_key": "rem-u1" }

POST /v1/schedules
{ "cron": "0 0 * * *", "type": "daily_report", "payload": {} }`,
    },
  ],
  keyTakeaways: [
    'Leader generates cron instances; workers are stateless executors.',
    'Lease/visibility timeout prevents stuck duplicate runs.',
    'Handlers must be idempotent — at-least-once is assumed.',
    'Separate queues by priority and job type for isolation.',
    'Evolve: crontab → DB queue → distributed scheduler (Airflow/Celery/custom).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why not cron on every app server?',
      answerHint: 'Duplicate runs without leader; no central visibility.',
    },
    {
      level: 'intermediate',
      question: 'How avoid double execution on worker crash mid-job?',
      answerHint: 'Lease with heartbeat; reclaim after timeout if not acked.',
    },
    {
      level: 'advanced',
      question: 'Schedule 1M jobs all at midnight?',
      answerHint: 'Shard time buckets; jitter; rate-limit dequeue; horizontal workers.',
    },
  ],
  flashcards: [
    { front: 'Visibility timeout', back: 'Job hidden after claim; reappears if worker dies without ack' },
    { front: 'Cron fan-out', back: 'Leader expands cron to job instances for each tick' },
    { front: 'Idempotent handler', back: 'Same job id run twice must be safe' },
  ],
  quickRevision: [
    'Job store + due queue',
    'Leader for cron expansion',
    'Workers claim with lease',
    'Retry + exponential backoff',
    'DLQ for poison jobs',
    'Priority queues per job type',
  ],
  systemDesign: {
    problem:
      'Design a distributed job scheduler like AWS EventBridge + workers: 10M scheduled jobs, 50k executions/s peak, cron and one-shot, 99.9% on-time within 1 minute.',
    requirements: {
      functional: [
        'Schedule one-shot and recurring (cron) jobs',
        'Cancel and reschedule jobs',
        'Query job status and history',
        'Retry failed jobs with policy',
      ],
      nonFunctional: [
        'At-least-once execution; idempotent handlers',
        'Schedule accuracy within 1 minute p99',
        'Horizontal scale workers and schedulers',
        'Isolate noisy neighbor job types',
      ],
    },
    scaleAssumptions: [
      '10M active scheduled definitions',
      '50k job starts/s peak (batch windows)',
      'Avg job duration 30s; long tail up to 1 hour',
    ],
    capacityEstimates: [
      'Job metadata: 10M rows × 1 KB ≈ 10 GB + indexes',
      'Execution log: 50k/s × 86400 ≈ 4B/day — TTL or cold storage',
      'Due queue: Redis ZSET or Kafka time-indexed topics',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `POST /v1/jobs
GET  /v1/jobs/{id}
DELETE /v1/jobs/{id}
POST /v1/jobs/{id}/retry`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'JobDefinition: id, type, cron?, payload, next_run_at, status',
          'JobRun: run_id, job_id, started_at, finished_at, status, attempt',
          'Lease: run_id, worker_id, expires_at',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Scheduler leader scans due jobs (time buckets) and pushes to Kafka priority topics. Worker autoscaler consumes partitions. Job store in Postgres; hot due set in Redis ZSET. Admin UI for DLQ replay.',
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  API[Job API] --> PG[(Postgres)]
  Leader[Scheduler Leader] --> PG
  Leader --> Redis[(Due ZSET)]
  Leader --> Kafka[Kafka Topics]
  Kafka --> W[Worker Pool]
  W --> PG
  W --> Ext[External APIs]`,
      caption: 'Leader enqueues due work; workers execute with lease',
    },
    dataFlow: [
      'Create job → persist → insert into due structure by run_at',
      'Leader tick: fetch due jobs → publish to type-specific topic',
      'Worker: claim run (lease) → execute handler → ack or retry',
      'Failure: increment attempt → backoff requeue or DLQ',
    ],
    storage: [
      'Postgres for definitions and run history (partition by date)',
      'Redis ZSET for next 24h due jobs',
      'S3 for large payloads',
    ],
    caching: [
      'Cache job definitions in workers',
      'Due window preloaded in Redis',
    ],
    asyncProcessing: [
      'Entire execution async',
      'Cron expansion batch job every minute',
    ],
    scaling: [
      'Multiple scheduler shards by time range or job type',
      'Kafka partitions = worker parallelism',
      'Rate limit dequeue for fragile downstreams',
    ],
    consistency: [
      'Single leader for cron expansion (etcd lock)',
      'At-least-once delivery; exactly-once requires idempotent side effects',
    ],
    reliability: [
      'Lease reclaim on worker death',
      'Poison message to DLQ after N attempts',
      'Scheduler leader failover via Raft/etcd',
    ],
    failureScenarios: [
      'Midnight thundering herd → jitter cron schedules',
      'Downstream API down → pause queue + circuit breaker',
      'Clock skew → use DB/Redis TIME for scheduling',
    ],
    security: [
      'Auth on job API; signed payloads',
      'Sandbox untrusted job code (separate executor pool)',
      'Secrets via vault reference not inline payload',
    ],
    observability: [
      'Schedule lag (now - run_at)',
      'Success/failure rate by job type',
      'DLQ depth and age',
    ],
    bottlenecks: [
      'Leader scan of huge due set',
      'Single partition hot job type',
      'Long-running jobs blocking worker pool — separate pools',
    ],
    alternatives: [
      'Celery + Redis',
      'Temporal / Cadence workflows',
      'Kubernetes CronJob (limited scale)',
    ],
    tradeoffs: [
      'DB polling vs Redis ZSET vs Kafka scheduled messages',
      'Strong schedule accuracy vs cost',
      'Unified scheduler vs per-team queues',
    ],
    interviewFollowUps: [
      'DAG dependencies between jobs?',
      'Exactly-once payment side effects?',
      'Multi-region scheduling?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'Single server crontab + shell scripts.',
        bottleneck: 'No HA; no visibility; duplicate on failover.',
      },
      {
        stage: '2. Improve',
        description: 'DB job table + worker poll with SELECT FOR UPDATE SKIP LOCKED.',
        bottleneck: 'DB poll load; cron expansion on one node.',
      },
      {
        stage: '3. Improve',
        description: 'Redis due queue + Kafka workers + leader election.',
        bottleneck: 'Midnight spikes; long job blocking.',
      },
      {
        stage: '4. Scale further',
        description: 'Sharded schedulers; typed worker pools; Temporal for workflows.',
        bottleneck: 'Operational complexity; cross-job dependencies.',
      },
    ],
  },
  tradeoffs: {
    advantages: ['Reliable deferred work', 'Central observability', 'Retry/DLQ built-in'],
    disadvantages: ['At-least-once requires idempotent handlers', 'Clock and leader complexity'],
    alternatives: ['Message queue delay headers', 'Workflow engine'],
    whenToUse: ['Reminders', 'Reports', 'Async billing', 'Data pipelines'],
    whenNotToUse: ['Sub-second realtime — use stream processing'],
  },
  failureModes: [
    'Non-idempotent handler double-charges user',
    'Lease too short → duplicate execution',
    'Leader split-brain double cron fire',
  ],
  production: {
    performance: ['Batch dequeue; separate pools for long jobs'],
    scalability: ['Kafka partitions; sharded due index'],
    reliability: ['Leader HA; DLQ; lease tuning'],
    security: ['Vault for secrets; auth on enqueue'],
    observability: ['Schedule lag SLO, run dashboards'],
    cost: ['Retention policy on run history'],
  },
  interview: {
    expectations: [
      'Leader + queue + worker with lease',
      'Cron expansion and thundering herd',
      'Idempotency and retry/DLQ',
    ],
    commonQuestions: ['Design distributed cron', 'Prevent duplicate runs?'],
    followUps: ['Job dependencies?', '1M jobs same second?'],
    misconceptions: ['Exactly-once without idempotent handlers'],
    traps: ['Polling DB every second for all jobs'],
    strongSignals: ['Visibility timeout, ZSET due queue, jitter, DLQ, leader election'],
  },
}
