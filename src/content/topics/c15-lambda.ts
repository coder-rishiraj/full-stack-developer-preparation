import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'AWS Lambda runs code in response to events without managing servers — pay per invocation and GB-second. Supports Java, Node, Python etc. Limits: 15 min timeout, ephemeral /tmp storage, cold starts. Triggers: API Gateway, SQS, S3, EventBridge, DynamoDB streams.',
  whyExists:
    'Infrequent or spiky workloads waste always-on EC2. Lambda scales automatically from zero to thousands concurrent — ideal for webhooks, image resize on S3 upload, cron via EventBridge, and lightweight API endpoints.',
  mentalModel:
    'Function in the cloud vending machine. Event arrives → AWS spins container (maybe cold) → runs handler → returns. No SSH, no patching OS — configure memory, timeout, env, IAM role. Concurrency limits protect downstream.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Concept', 'Detail'],
      rows: [
        ['Handler', 'Entry point method receiving event + context'],
        ['Cold start', 'First invoke or scale-out JVM init latency'],
        ['Provisioned concurrency', 'Warm instances — reduce cold start cost'],
        ['Lambda layers', 'Shared dependencies/libs across functions'],
        ['Destinations', 'Async failure/success routing to DLQ or SNS'],
        ['VPC attach', 'Access private RDS — adds ENI cold start penalty'],
      ],
    },
    {
      type: 'list',
      items: [
        'API Gateway HTTP API → Lambda for serverless REST.',
        'SQS event source mapping batch poller invokes with messages.',
        'Idempotent handlers required — SQS/Lambda at-least-once delivery.',
        'SnapStart (Java) reduces cold start restoring JVM snapshot.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Lambda handler for S3 upload event',
      code: `public class ResizeHandler implements RequestHandler<S3Event, String> {
  @Override
  public String handleRequest(S3Event event, Context context) {
    String bucket = event.getRecords().get(0).getS3().getBucket().getName();
    String key = event.getRecords().get(0).getS3().getObject().getKey();
    byte[] image = s3.getObject(bucket, key).readAllBytes();
    byte[] thumb = ImageUtil.resize(image, 200);
    s3.putObject(bucket, "thumbs/" + key, thumb);
    return "OK";
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Execution environment reused across warm invocations — watch global state leaks.',
        'Concurrent execution account limit default 1000 — request increase.',
        'Recursive loop detection stops runaway self-triggering functions.',
        '/aws/lambda/* CloudWatch log group automatic per function.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['No server ops', 'Auto scale', 'Pay per use', 'Event native integration'],
    disadvantages: ['Cold starts especially JVM', '15 min max duration', 'VPC latency', 'Debugging harder than EC2'],
    alternatives: ['Fargate for long-running HTTP', 'EC2 for steady load cheaper', 'Lambda Web Adapter on container'],
    whenToUse: ['Event-driven processing', 'Low/steady traffic APIs', 'Scheduled jobs'],
    whenNotToUse: ['Long CPU batch hours', 'WebSocket persistent connections alone', 'Latency-sensitive JVM without provisioned concurrency'],
  },
  failureModes: [
    'Timeout 15 min mid batch — partial side effects',
    'Cold start blows API p99 SLA',
    'Non-idempotent handler duplicates on retry',
    'Out of memory on large payload',
    'VPC ENI exhaustion limits scale',
  ],
  production: {
    reliability: ['DLQ on async invokes', 'Idempotency keys in handler', 'Reserved concurrency for critical fn'],
    performance: ['SnapStart or Graal native for Java', 'Right-size memory — also scales CPU'],
    observability: ['X-Ray tracing', 'Structured JSON logs', 'CloudWatch alarms on errors/throttles'],
    cost: ['Avoid over-provisioned memory', 'Provisioned concurrency cost vs cold start trade'],
    security: ['Least privilege IAM role per function', 'Secrets Manager extension not env plaintext'],
  },
  interview: {
    expectations: ['Event sources', 'Cold start', 'Limits', 'Idempotent handler', 'When not Lambda'],
    commonQuestions: ['Lambda vs EC2?', 'Reduce Java cold start?'],
    followUps: ['Lambda in VPC for RDS?', 'SQS batch failure?'],
    misconceptions: ['Lambda free at scale', 'Always cheaper than containers'],
    traps: ['Long-running report generation on Lambda'],
    strongSignals: ['Provisioned concurrency', 'SnapStart', 'DLQ + idempotency', 'Event source mapping'],
  },
  keyTakeaways: [
    'Lambda = event-driven serverless functions.',
    'Cold starts matter for latency-sensitive Java.',
    'Handlers must be idempotent — retries happen.',
    '15 min timeout and memory/CPU coupling limits design.',
    'Use Fargate/EC2 for long-lived or steady high traffic.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Lambda billing model?', answerHint: 'Per invocation + GB-second duration + optional provisioned concurrency.' },
    { level: 'intermediate', question: 'Cold start mitigation?', answerHint: 'Provisioned concurrency, SnapStart Java, smaller package, avoid unnecessary VPC.' },
    { level: 'advanced', question: 'Process SQS messages exactly once?', answerHint: 'Cannot guarantee — idempotent handler + partial batch failure reporting + DLQ poison messages.' },
  ],
  flashcards: [
    { front: 'Cold start', back: 'Init latency on new execution environment — JVM heavy' },
    { front: '15 min limit', back: 'Max Lambda execution duration' },
    { front: 'Event source mapping', back: 'Lambda poller for SQS/Kafka/DynamoDB stream' },
    { front: 'Provisioned concurrency', back: 'Pre-warmed execution environments' },
  ],
  quickRevision: ['Event-driven', 'Cold start JVM', 'Idempotent handlers', '15 min max', 'DLQ async failures'],
}
