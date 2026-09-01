import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Backpressure signals downstream overload to upstream — slow producers when consumers cannot keep pace. Mechanisms: bounded queues, reactive streams request(n), Kafka consumer pause/resume partitions, HTTP 429/503 with Retry-After, gRPC flow control. Prevents OOM and cascading latency without unbounded buffering.',
  whyExists:
    'Unbounded in-memory queues hide overload until GC pause or OOM kill entire service. Backpressure propagates slowness early — system degrades gracefully instead of catastrophic failure. Critical between fast producers (HTTP requests) and slow workers (DB, external API).',
  mentalModel:
    'Pipeline has finite capacity. When full, stop accepting or drop lowest priority work. Kafka: lag grows — scale consumers or pause ingestion. HTTP: reject with 503 so load balancer routes elsewhere. Measure queue depth as leading indicator.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Layer', 'Mechanism'],
      rows: [
        ['Thread pool', 'Bounded queue + CallerRunsPolicy or reject'],
        ['Reactive (Project Reactor)', 'request(n) credit-based flow'],
        ['Kafka consumer', 'pause() partitions when internal queue full'],
        ['API gateway', 'Max connections + queue limit'],
        ['Batch ingest', 'Rate limit upstream publisher'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Bounded queue backpressure',
      diagram: `flowchart LR
  P[Producer] -->|offer| Q[Bounded queue max=1000]
  Q -->|full| REJ[Reject / block producer]
  Q --> C[Consumer workers]`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Email service queue max 5000 jobs. On full, API returns 503 Service Unavailable — caller retries with backoff. Kafka consumer pauses partition fetch until queue drains below 80% — lag increases but JVM stable.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Little law: queue depth = arrival rate × service time — depth signals overload',
        'Blocking vs dropping policy — user-facing often prefer controlled reject',
        'Kafka max.poll.records vs processing rate tuning',
        'Reactive backpressure end-to-end requires cooperative protocols',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Prevents OOM', 'Early overload signal', 'Protects downstream dependencies'],
    disadvantages: ['Increased rejection rate under load', 'Complex reactive pipelines', 'Paused Kafka increases lag'],
    alternatives: ['Scale out consumers horizontally', 'Load shed lower priority traffic'],
    whenToUse: ['Any async boundary with speed mismatch'],
    whenNotToUse: ['Unbounded queue falsely assumed temporary — fix architecture instead'],
  },
  failureModes: [
    'Unbounded LinkedBlockingQueue — heap exhaustion',
    'Ignoring lag until days behind',
    'Blocking producer thread pool exhausts all Tomcat threads',
    'No 503 — timeouts everywhere instead of fast fail',
  ],
  production: {
    performance: ['Monitor queue depth and lag', 'Auto-scale consumers on lag'],
    reliability: ['Bounded queues everywhere', 'Pause/resume Kafka consumption'],
    observability: ['Queue depth, reject rate, consumer lag dashboards'],
  },
  interview: {
    expectations: ['Define backpressure', 'Bounded queue', 'Kafka pause', '503 vs queue forever'],
    commonQuestions: ['Handle slow consumer?', 'Backpressure in microservices?', 'Kafka lag backpressure?'],
    followUps: ['Reactive streams request?', 'Load shed vs backpressure?'],
    misconceptions: ['Buffer unlimited fixes burst', 'Scale CPU without bound fixes all overload'],
    traps: ['Unbounded executor queue in production'],
    strongSignals: ['Bounded queues, pause partitions, 503 fast fail, lag autoscale'],
  },
  keyTakeaways: [
    'Use bounded queues — unbounded hides failure until OOM.',
    'Signal overload upstream via reject, pause, or slow accept.',
    'Kafka consumer pause when internal buffer full.',
    'Queue depth and lag are leading overload metrics.',
    'Combine with scale-out and load shedding.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is backpressure?', answerHint: 'Upstream slows or stops when downstream overloaded — prevents unbounded buffering.' },
    { level: 'intermediate', question: 'Thread pool backpressure?', answerHint: 'Bounded queue; reject or caller-runs when full; never Integer.MAX_VALUE queue.' },
    { level: 'advanced', question: 'Kafka consumer overwhelmed?', answerHint: 'Reduce max.poll.records; pause partitions; scale consumers; DLQ slow poison; monitor lag SLO.' },
  ],
  flashcards: [
    { front: 'Backpressure', back: 'Slow/stop upstream when downstream cannot keep up' },
    { front: 'Bounded queue', back: 'Finite buffer — reject or block when full' },
    { front: 'Kafka pause', back: 'Stop fetching records until internal queue drains' },
    { front: '503 under load', back: 'Fast fail signals overload to clients/load balancer' },
  ],
  quickRevision: ['Bounded buffers', 'Pause Kafka', '503 fast fail', 'Monitor queue depth', 'Scale on lag'],
}
