import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Distributed tracing records the path and timing of a request across services as a trace of spans. Each span is one operation (HTTP call, DB query) with start time, duration, attributes, and parent-child links. Jaeger, Zipkin, AWS X-Ray, and OTel backends visualize waterfalls.',
  whyExists:
    'Metrics show checkout p99 is high; tracing shows fraud service DB query is 800ms of 900ms. Logs miss hierarchical timing. Traces pinpoint slow span, error origin, and dependency fan-out in microservices.',
  mentalModel:
    'Flight recorder with timeline. Trace is whole trip; spans are legs (gate → taxi → air → baggage). Parent span waits for child spans; waterfall shows where time went.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Trace span tree',
      diagram: `flowchart TB
  Root[GET /checkout — 900ms]
  Root --> Inv[inventory RPC — 120ms]
  Root --> Fraud[fraud RPC — 750ms]
  Fraud --> DB[(fraud DB — 700ms)]`,
    },
    {
      type: 'list',
      items: [
        'trace_id shared across services; span_id unique per operation.',
        'W3C traceparent header propagates context.',
        'Auto-instrumentation: Spring Boot 3 Micrometer Tracing + OTel.',
        'Sampling: head-based 1% prod — balance cost vs coverage.',
        'Baggage: optional key-value propagated (use carefully — size).',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Checkout trace shows 900ms total: inventory 120ms healthy, fraud 750ms with child span jdbc:query 700ms — DBA adds index, p99 checkout drops 40%.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Span kinds: SERVER, CLIENT, INTERNAL, PRODUCER, CONSUMER.',
        'Batch span processor exports async — watch loss on crash.',
        'Context propagation broken in manual thread pools without decoration.',
        'Service graph derived from trace dependencies over time.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Latency breakdown', 'Dependency map', 'Error span attribution', 'Cross-service debug'],
    disadvantages: ['Storage cost at 100% sampling', 'Instrumentation gaps break tree', 'PII in span attributes'],
    alternatives: ['Verbose logging with timing — incomplete', 'APM proprietary agents'],
    whenToUse: ['Microservices with multi-hop requests', 'Tail latency investigation'],
    whenNotToUse: ['Monolith with profiler sufficient for CPU — still useful for DB'],
  },
  failureModes: [
    'Broken propagation — orphan spans',
    '100% sampling — collector OOM and cost',
    'Sensitive data in span attributes',
    'Missing CLIENT span on outbound HTTP — blind to dependency',
    'Clock skew distorts cross-host timing',
  ],
  production: {
    observability: ['Tail-based sampling for errors/slow traces', 'Service graph dashboards'],
    reliability: ['Alert on span error rate by dependency'],
    cost: ['Head sample 1-10%; tail sample errors', 'Attribute size limits'],
    security: ['Scrub PII from span tags'],
  },
  interview: {
    expectations: ['Trace vs span', 'traceparent propagation', 'Sampling tradeoff'],
    commonQuestions: ['Debug slow distributed request?', 'Trace vs log vs metric?'],
    followUps: ['Head vs tail sampling?', 'Broken trace causes?'],
    misconceptions: ['Need 100% traces', 'Tracing replaces metrics'],
    traps: ['No outbound client instrumentation'],
    strongSignals: ['Waterfall read', 'W3C traceparent', 'Sampling strategy'],
  },
  keyTakeaways: [
    'Trace = request journey; spans = timed operations with parent links.',
    'Propagate trace context on every HTTP/message hop.',
    'Sample in prod — tail sample errors and high latency.',
    'Waterfall finds slow dependency span quickly.',
    'OpenTelemetry standard; Spring Boot 3 auto-instrumentation.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Trace vs span?', answerHint: 'Trace whole request; span single operation with duration and parent.' },
    { level: 'intermediate', question: 'Why sample traces?', answerHint: 'Full capture expensive; sample representative + always capture errors/slow.' },
    { level: 'advanced', question: 'Broken trace — orphan spans?', answerHint: 'Missing context propagation header; async without context attach.' },
  ],
  flashcards: [
    { front: 'Span', back: 'Single timed operation in a trace with parent_id' },
    { front: 'traceparent', back: 'W3C header propagating trace_id and span_id' },
    { front: 'Head sampling', back: 'Decide sample at trace start — simple, may miss rare tails' },
  ],
  quickRevision: [
    'Trace span tree',
    'traceparent propagate',
    'Sample not 100%',
    'Waterfall debug',
    'OTel Spring Boot 3',
  ],
}
