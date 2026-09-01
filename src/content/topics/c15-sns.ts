import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Amazon SNS (Simple Notification Service) is pub/sub messaging — publishers send to topics; subscribers (SQS queues, Lambda, HTTP endpoints, email, SMS) receive fan-out copies. Decouples event producers from multiple consumers with at-least-once delivery and optional message filtering.',
  whyExists:
    'One event must trigger email, push notification, analytics queue, and Lambda resize — SNS broadcasts to all subscribers without producer knowing endpoints. Pairs with SQS for durable worker processing (SNS → SQS → consumer).',
  mentalModel:
    'Megaphone in a plaza. Publisher shouts to SNS topic; every subscribed listener hears. SQS subscription buffers for async workers. Filter policy delivers only matching JSON attributes to subset subscribers.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Pattern', 'Flow'],
      rows: [
        ['Fan-out', 'SNS topic → multiple SQS queues each consumer group'],
        ['Mobile push', 'SNS platform application → APNS/FCM'],
        ['Lambda trigger', 'SNS → Lambda synchronous invoke'],
        ['HTTP(S)', 'Webhook delivery with retry'],
        ['FIFO topic', 'Ordering + dedup for strict sequences'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'SNS fan-out to SQS workers',
      diagram: `flowchart TB
  P[Order Service] -->|Publish| SNS[SNS orders topic]
  SNS --> Q1[SQS email queue]
  SNS --> Q2[SQS analytics queue]
  SNS --> L[Lambda fraud check]
  Q1 --> W1[Email worker]
  Q2 --> W2[Analytics worker]`,
    },
    {
      type: 'list',
      items: [
        'Message attributes enable filter policies on subscriptions.',
        'Raw message delivery to SQS passes body without SNS envelope wrapper.',
        'DLQ on SQS subscription side handles poison after max receives.',
        'Cross-account publish/subscribe via topic policy.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'OrderPlaced event published to SNS orders topic with attribute eventType=ORDER_PLACED. Email service SQS subscribed with filter. Analytics queue gets all messages. Lambda subscriber sends real-time fraud score — must complete within SNS HTTP timeout if sync.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Standard topic high throughput; FIFO 300 msg/s per topic with ordering.',
        'Message deduplication ID on FIFO publish within 5 min window.',
        'CloudWatch metrics NumberOfMessagesPublished, NumberOfNotificationsFailed.',
        'KMS encryption at rest on topic.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Simple fan-out', 'Multiple protocol subscribers', 'Filter policies reduce noise'],
    disadvantages: ['No message persistence if no subscriber — unlike Kafka log', 'HTTP subscriber delivery retries limited', 'FIFO throughput lower'],
    alternatives: ['EventBridge for event bus routing', 'Kafka for replay log', 'Direct SQS send if single consumer'],
    whenToUse: ['Multi-subscriber domain events', 'Mobile push', 'Alarm notifications'],
    whenNotToUse: ['Need event replay history — use Kafka/Kinesis', 'Single consumer — SQS direct cheaper simpler'],
  },
  failureModes: [
    'Lambda subscriber timeout — message lost for that path unless SQS buffer',
    'Filter too strict — subscriber never receives',
    'HTTP endpoint down — retries exhaust',
    'Publishing huge payload > 256KB — must store in S3 reference',
    'No DLQ on downstream SQS — poison messages loop',
  ],
  production: {
    reliability: ['SNS → SQS pattern for durable processing', 'DLQ on queues', 'Idempotent consumers'],
    security: ['Topic policy least privilege', 'KMS encrypt sensitive payloads'],
    observability: ['Failed delivery metrics', 'CloudWatch alarms on notification failures'],
    cost: ['Filter to reduce unnecessary deliveries', 'Prefer SQS buffer vs many HTTP subs'],
  },
  interview: {
    expectations: ['Pub/sub fan-out', 'SNS + SQS pattern', 'Filter policies', 'vs EventBridge'],
    commonQuestions: ['Notify multiple services of event?', 'SNS vs SQS?'],
    followUps: ['FIFO when?', 'Message size limit?'],
    misconceptions: ['SNS stores messages like queue', 'SQS and SNS interchangeable'],
    traps: ['Lambda-only subscriber without durability for critical events'],
    strongSignals: ['Fan-out to SQS queues', 'Filter attributes', 'Raw delivery', 'DLQ downstream'],
  },
  keyTakeaways: [
    'SNS pub/sub fan-out to many subscribers.',
    'Pair SNS with SQS for durable async workers.',
    'Filter policies route subset of messages.',
    'No long-term replay — fire-and-notify model.',
    'FIFO SNS when ordering required per message group.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'SNS vs SQS?', answerHint: 'SNS fan-out pub/sub to many; SQS point-to-point queue with consumer pull and retention.' },
    { level: 'intermediate', question: 'Reliable processing from SNS?', answerHint: 'Subscribe SQS queues to SNS; workers poll SQS with DLQ — buffers and retries.' },
    { level: 'advanced', question: 'Only some subscribers get order events?', answerHint: 'Message attributes + subscription filter policy on eventType.' },
  ],
  flashcards: [
    { front: 'Fan-out', back: 'One SNS publish delivered to all subscribers' },
    { front: 'Filter policy', back: 'JSON filter on message attributes per subscription' },
    { front: 'Raw message delivery', back: 'SQS gets body without SNS metadata wrapper' },
    { front: '256KB limit', back: 'Max SNS message size — larger use S3 pointer' },
  ],
  quickRevision: ['Pub/sub fan-out', 'SNS → SQS durable', 'Filter policies', 'No replay log', 'DLQ on queues'],
}
