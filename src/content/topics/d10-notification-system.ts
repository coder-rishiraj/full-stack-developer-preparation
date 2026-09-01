import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'A notification system delivers multi-channel alerts (push, email, SMS, in-app) triggered by product events — decoupling producers from delivery providers via queues, templates, preferences, and retry logic.',
  whyExists:
    'Every service should not integrate Twilio, SendGrid, and FCM directly. Centralized notification platform handles fan-out, user preferences, rate limits, idempotency, and delivery analytics at scale.',
  mentalModel:
    'Producer emits event → notification service enqueues per-channel jobs → workers render templates → provider adapters send → webhooks update delivery status. User prefs and quiet hours filter before enqueue.',
  howItWorks: [
    {
      type: 'paragraph',
      text: 'Critical path is async: Kafka topic partitioned by user_id. Workers are stateless; idempotency key prevents duplicate sends on retry. Template engine substitutes variables. Priority queues separate OTP (high) from marketing (low).',
    },
    {
      type: 'mermaid',
      caption: 'Event to delivery pipeline',
      diagram: `flowchart LR
  Svc[Product Service] --> API[Notification API]
  API --> Kafka[Kafka]
  Kafka --> W1[Email Worker]
  Kafka --> W2[Push Worker]
  W1 --> SG[SendGrid]
  W2 --> FCM[FCM/APNs]`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Send API',
      code: `POST /v1/notifications
{
  "user_id": "u42",
  "template": "order_shipped",
  "channels": ["push", "email"],
  "data": { "order_id": "o99" },
  "idempotency_key": "order_shipped:o99"
}
→ 202 { "notification_id": "n1" }`,
    },
  ],
  keyTakeaways: [
    'Always async queue between API and providers.',
    'Idempotency key per business event + channel.',
    'User preferences and quiet hours before enqueue.',
    'Separate priority tiers; OTP bypasses marketing throttle.',
    'Evolve: sync SMTP → SQS workers → Kafka + multi-region.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why queue instead of sync send?',
      answerHint: 'Provider latency, retries, burst absorption, decoupling.',
    },
    {
      level: 'intermediate',
      question: 'How prevent duplicate push on retry?',
      answerHint: 'Idempotency store keyed by (user, template, idempotency_key).',
    },
    {
      level: 'advanced',
      question: 'Design digest emails (daily summary)?',
      answerHint: 'Buffer events in Redis/time-window aggregator; cron worker sends batch.',
    },
  ],
  flashcards: [
    { front: 'Idempotency key scope', back: 'Business event id + channel prevents duplicate delivery' },
    { front: 'Provider webhook', back: 'Updates delivery/bounce status async' },
    { front: 'Quiet hours', back: 'Defer non-critical sends to next allowed window' },
  ],
  quickRevision: [
    'API → Kafka → channel workers',
    'Templates + prefs filter',
    'Idempotency per event',
    'Priority queues OTP vs marketing',
    'Provider webhooks for status',
    'Rate limit per user/channel',
  ],
  systemDesign: {
    problem:
      'Design a notification platform sending 1B notifications/day across push, email, SMS with preferences, retries, and delivery tracking.',
    requirements: {
      functional: [
        'Send templated notifications on multi-channel',
        'User channel preferences and opt-out',
        'Delivery status tracking (sent, delivered, failed)',
        'Schedule and digest notifications',
      ],
      nonFunctional: [
        'OTP latency p99 < 5s',
        'At-least-once delivery with dedupe at consumer',
        'Handle provider outages with retry/backoff',
        'Compliance (CAN-SPAM, SMS regulations)',
      ],
    },
    scaleAssumptions: [
      '1B notifications/day (~12k/s avg, 100k/s peak flash sale)',
      '60% push, 30% email, 10% SMS',
      '10M DAU receiving multiple channels',
    ],
    capacityEstimates: [
      'Kafka: 100k msg/s peak with 7-day retention for replay ≈ TB scale',
      'Email: ~300M/day → bulk provider tier; batch where possible',
      'Idempotency store: Redis SET with TTL 48h',
    ],
    api: [
      {
        type: 'code',
        language: 'http',
        code: `POST /v1/notifications
GET  /v1/notifications/{id}/status
PUT  /v1/users/{id}/preferences`,
      },
    ],
    dataModel: [
      {
        type: 'list',
        items: [
          'NotificationRequest: id, user_id, template_id, payload, channels, idempotency_key, priority',
          'DeliveryAttempt: notification_id, channel, provider_id, status, ts',
          'UserPreference: user_id, channel_enabled map, quiet_hours',
          'Template: id, subject, body per channel, locale variants',
        ],
      },
    ],
    highLevelArchitecture: [
      {
        type: 'paragraph',
        text: 'Notification API validates and enqueues to priority Kafka topics. Channel-specific worker pools call provider SDKs. Status updater consumes webhooks. Preference service cached in Redis.',
      },
    ],
    diagram: {
      mermaid: `flowchart TB
  Prod[Services] --> NAPI[Notification API]
  NAPI --> Prefs[(Preferences Redis)]
  NAPI --> KHigh[Kafka High Priority]
  NAPI --> KLow[Kafka Low Priority]
  KHigh --> PushW[Push Workers]
  KLow --> EmailW[Email Workers]
  PushW --> FCM[FCM]
  EmailW --> ESP[Email Provider]
  Webhooks --> Status[Status Service]`,
      caption: 'Priority topics and channel worker pools',
    },
    dataFlow: [
      'Producer POST with idempotency key',
      'Check dedupe Redis → if exists return 202 same id',
      'Load prefs → filter channels → render templates',
      'Publish jobs to channel topics',
      'Worker sends → record attempt → webhook updates final status',
    ],
    storage: [
      'Postgres for templates, prefs, audit',
      'Redis idempotency and rate counters',
      'Kafka for work queue',
    ],
    caching: [
      'Cache user preferences locally 5 min',
      'Template cache in worker memory',
    ],
    asyncProcessing: [
      'Entire send path async except API ack',
      'Digest aggregator windows',
      'Bounce handling and list hygiene for email',
    ],
    scaling: [
      'Scale workers per channel independently',
      'Partition Kafka by user_id for ordering per user',
      'Multiple ESP accounts for email throughput',
    ],
    consistency: [
      'Idempotent sends — effective exactly-once UX',
      'Status eventual via webhooks',
    ],
    reliability: [
      'Exponential backoff retry; DLQ for poison messages',
      'Fallback channel (SMS if push fails for OTP)',
      'Circuit breaker on provider 5xx',
    ],
    failureScenarios: [
      'FCM outage → queue backlog → extend TTL; SMS fallback for critical',
      'Duplicate producer retry → idempotency catches',
      'Marketing blast spikes → low-priority queue lag OK; protect OTP queue',
    ],
    security: [
      'PII in payload encrypted at rest',
      'Signed webhooks from providers',
      'Rate limit marketing per user',
    ],
    observability: [
      'Delivery rate by channel/template',
      'Queue lag, DLQ depth',
      'Provider error codes dashboard',
    ],
    bottlenecks: [
      'Email provider daily caps',
      'Push token invalidation churn',
      'Hot user receiving thousands/sec (aggregate)',
    ],
    alternatives: [
      'Courage: each team integrates providers (anti-pattern)',
      'SaaS: OneSignal, Customer.io',
    ],
    tradeoffs: [
      'At-least-once queue vs expensive distributed exactly-once',
      'Real-time vs digest batching UX',
      'Multi-provider abstraction vs best-in-class per channel',
    ],
    interviewFollowUps: [
      'Design in-app notification inbox?',
      'A/B test notification copy at scale?',
      'Multi-region active-active?',
    ],
    evolution: [
      {
        stage: '1. Simple design',
        description: 'Sync send email in request thread.',
        bottleneck: 'Timeouts; no retry; blocks API.',
      },
      {
        stage: '2. Improve',
        description: 'SQS + worker pool; basic templates.',
        bottleneck: 'No priority; duplicate sends on retry.',
      },
      {
        stage: '3. Improve',
        description: 'Kafka priorities; idempotency; prefs; webhooks.',
        bottleneck: 'Single region; provider limits.',
      },
      {
        stage: '4. Scale further',
        description: 'Multi-region queues; digest engine; ML send-time optimization.',
        bottleneck: 'Compliance across locales; cost at billion scale.',
      },
    ],
  },
  tradeoffs: {
    advantages: ['Decoupled producers', 'Central compliance', 'Channel abstraction'],
    disadvantages: ['Delivery not instant guaranteed', 'Operational complexity', 'Provider dependency'],
    alternatives: ['Direct provider per service', 'Third-party customer engagement platform'],
    whenToUse: ['Any multi-channel product alerts', 'OTP and transactional mail'],
    whenNotToUse: ['Single email in tiny app — simple SMTP OK'],
  },
  failureModes: [
    'Missing idempotency → duplicate OTP/charges confusion',
    'Queue backlog delays critical alerts',
    'Ignoring bounces harms email reputation',
  ],
  production: {
    performance: ['Separate worker pools by priority'],
    scalability: ['Kafka partition scale; horizontal workers'],
    reliability: ['DLQ, retry, fallback channel'],
    security: ['Encrypt PII; webhook verification'],
    observability: ['End-to-end delivery funnel metrics'],
    cost: ['SMS most expensive; batch email; push cheapest'],
  },
  interview: {
    expectations: [
      'Async queue + workers diagram',
      'Idempotency and preferences',
      'Priority and retry strategy',
    ],
    commonQuestions: ['Design notification system', 'Push vs email architecture'],
    followUps: ['Digest emails?', 'Exactly-once delivery?'],
    misconceptions: ['Sync call to FCM from user API path'],
    traps: ['No opt-out / compliance'],
    strongSignals: ['Kafka, idempotency key, priority queues, webhooks, quiet hours'],
  },
}
