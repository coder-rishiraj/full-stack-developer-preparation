import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Backpressure is a flow-control mechanism where overloaded downstream components signal upstream to slow down or drop work — bounded queues, rate limits, HTTP 429/503, reactive `onBackpressureBuffer`, and load shedding. Prevents unbounded memory growth and cascading failure.',
  whyExists:
    'Fast producers and slow consumers create infinite queues — OOM, GC death spiral, total outage. Backpressure converts overload into controlled rejection or delay instead of silent buffer bloat killing the JVM.',
  mentalModel:
    'Highway meter light. On-ramp stops cars when mainline full. Without meter, gridlock everywhere. System says "I am full — wait or take alternate route" instead of accepting until crash.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Bounded thread pool + rejection policy (CallerRuns, Abort) — explicit pushback.',
        'Queue max size with drop-oldest or reject-new for async workers.',
        'Reactive Streams: request(n) pulls only what consumer handles.',
        'HTTP 503 + Retry-After tells clients to backoff.',
        'Load shed: drop low-priority traffic under stress (degrade features).',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Backpressure without and with bounds',
      diagram: `flowchart LR
  Fast[Fast producer] -->|unbounded| Q1[Queue grows OOM]
  Fast2[Fast producer] -->|bounded| Q2[Full queue]
  Q2 -->|reject/slow| Prod[Producer slows]`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Event processor queue capped at 10k. When full, publisher gets RejectedExecutionException and NACKs Kafka message — consumer pauses poll. Without cap, heap exhausts during downstream DB outage.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Tomcat maxConnections + acceptCount — connections queue then reject.',
        'gRPC flow control window limits in-flight bytes.',
        'Project Reactor: onBackpressureDrop, buffer, latest strategies.',
        'Adaptive concurrency limits (Netflix concurrency limits) auto-tune.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Memory bounded', 'Graceful degradation', 'Prevents cascade', 'Clear overload signal'],
    disadvantages: ['Dropped/rejected work — needs retry/idempotency', 'Tuning queue size hard', 'User-visible errors if no fallback'],
    alternatives: ['Unbounded queue — fails catastrophically', 'Scale out only — laggy and costly'],
    whenToUse: ['Async pipelines', 'High fan-in APIs', 'Stream processing'],
    whenNotToUse: ['Must-never-drop financial ledger — use durable queue with backpressure at ingress gateway'],
  },
  failureModes: [
    'Unbounded LinkedBlockingQueue — OOM',
    'Silent blocking forever — no timeout',
    'Shed wrong tier — drop payments not analytics',
    'No signal to clients — retry storm amplifies',
    'Backpressure only at one layer — buffer elsewhere',
  ],
  production: {
    reliability: ['Bounded queues everywhere async', '503 + Retry-After under load'],
    scalability: ['Autoscale on queue depth metric', 'Priority queues for tiers'],
    observability: ['Queue depth, reject rate, shed count metrics'],
    performance: ['Size queues for burst not infinite'],
  },
  interview: {
    expectations: ['Why backpressure', 'Bounded queue', '503 load shed'],
    commonQuestions: ['System overloaded — design response?', 'Backpressure in reactive streams?'],
    followUps: ['Thread pool rejection policies?', 'Kafka consumer backpressure?'],
    misconceptions: ['Buffer everything is kindness', 'Scale fixes overload instantly'],
    traps: ['Unbounded executor queue in Java'],
    strongSignals: ['Bounded + metric + shed tiers', 'Reactive request(n)', 'Retry-After on shed'],
  },
  keyTakeaways: [
    'Overload: slow producers or reject — never unbounded buffer.',
    'Bounded queues and thread pools with rejection policy.',
    'HTTP 503/429 signals clients to backoff.',
    'Load shed low-priority work under stress.',
    'Monitor queue depth and reject rate.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What is backpressure?', answerHint: 'Downstream signals upstream to slow/stop when overloaded.' },
    { level: 'intermediate', question: 'Unbounded queue risk?', answerHint: 'Memory grows until OOM; latency infinite; total crash.' },
    { level: 'advanced', question: 'Reactive Streams backpressure?', answerHint: 'Subscriber requests n items; publisher sends at most n — pull-based flow control.' },
  ],
  flashcards: [
    { front: 'Backpressure', back: 'Flow control when consumer slower than producer' },
    { front: 'Load shedding', back: 'Drop low-priority work under overload' },
    { front: 'CallerRunsPolicy', back: 'Thread pool runs task on caller thread — slows producer' },
  ],
  quickRevision: [
    'Bounded queues',
    'Reject or slow',
    '503 Retry-After',
    'Load shed tiers',
    'Queue depth metric',
  ],
}
