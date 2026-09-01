import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Timeouts bound how long a caller waits for an operation: connect timeout, read/write timeout, and end-to-end request deadline. When exceeded, the call fails fast instead of holding threads, sockets, and user patience indefinitely.',
  whyExists:
    'Without timeouts, one slow dependency blocks all worker threads — cascading failure. Users wait forever; load balancers queue; connection pools exhaust. Timeouts convert unbounded waits into bounded failures you can detect, retry, or degrade around.',
  mentalModel:
    'Every outbound call gets a stopwatch. When time is up, abandon the call and free resources — even if the remote side eventually responds. Shorter timeouts at the edge; budget subtracts as you traverse the call chain.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Timeout type', 'Measures', 'Typical setting'],
      rows: [
        ['Connect', 'TCP/TLS handshake complete', '1–3s'],
        ['Read/response', 'First byte or full body', 'Depends on SLA — often 200ms–2s per hop'],
        ['Idle/socket', 'No activity on open connection', 'Prevents hung keep-alive leaks'],
        ['Deadline/context', 'Total wall clock for nested calls', 'Client timeout > sum of internal hops + margin'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Timeout budget across call chain',
      diagram: `sequenceDiagram
  participant Client
  participant API
  participant DB
  Client->>API: 3s total deadline
  API->>DB: 500ms query timeout
  Note over API: Remaining budget for other deps`,
    },
    {
      type: 'list',
      items: [
        'Propagate deadline via gRPC metadata or HTTP header (X-Request-Deadline).',
        'Cancel work on timeout: interrupt thread, abort HTTP body, release DB connection.',
        'Align LB idle timeout > app keep-alive > client timeout to avoid phantom 502s.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'RestTemplate and resilience4j timeout',
      code: `@Bean
RestTemplate restTemplate() {
  var factory = new HttpComponentsClientHttpRequestFactory();
  factory.setConnectTimeout(Duration.ofSeconds(2));
  factory.setReadTimeout(Duration.ofSeconds(5));
  return new RestTemplate(factory);
}

// Or: TimeLimiter + CircuitBreaker in resilience4j`,
    },
    {
      type: 'paragraph',
      text: 'Mobile app 10s total timeout. API gateway 8s. Each microservice internal call 2s max. If fraud check uses 2s and inventory 2s sequentially, you need parallel calls or tighter per-hop limits.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'TCP retransmits can delay failure detection — connect timeout covers this.',
        'HTTP/2 multiplexing: one slow stream should not block others if configured correctly.',
        'JVM threads blocked on socket read until SO_TIMEOUT — async clients use CompletableFuture with orTimeout.',
        'Server-side: Tomcat connectionTimeout vs async servlet timeout vs DB statement_timeout must align.',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Fail fast', 'Protect thread pools', 'Predictable tail latency cap', 'Enables retries within user deadline'],
    disadvantages: ['False failures if too aggressive', 'Orphan work on server after client timeout', 'Hard to tune across many dependencies'],
    alternatives: ['Async fire-and-forget', 'Queue with long worker timeout', 'Caching to avoid call'],
    whenToUse: ['Every external I/O call in production', 'Multi-hop microservice chains', 'User-facing synchronous paths'],
    whenNotToUse: ['Batch jobs with known long runtime — use separate worker timeout policy'],
  },
  failureModes: [
    'No timeout → thread pool exhaustion during DB slowness',
    'Client timeout shorter than server processing → duplicate retries',
    'LB timeout < app timeout → connection reset mid-response',
    'Timeout without cancellation → resource leak on server',
    'Same timeout for all deps regardless of SLA',
  ],
  production: {
    reliability: ['Timeout on every outbound dependency', 'Deadline propagation in mesh/gRPC', 'Orphan request detection'],
    observability: ['Track timeout rate per dependency', 'Compare p99 latency vs timeout setting'],
    performance: ['Right-size pools after timeout tuning', 'Parallelize calls to fit deadline'],
    maintainability: ['Central config per dependency SLA', 'Document timeout hierarchy in runbooks'],
  },
  interview: {
    expectations: ['Connect vs read timeout', 'Deadline propagation', 'Cascading failure without timeouts'],
    commonQuestions: ['What happens when DB slow and no timeout?', 'Set timeouts in microservices?'],
    followUps: ['Orphan requests after client timeout?', 'LB vs app timeout ordering?'],
    misconceptions: ['Default infinite timeout is fine', 'One global timeout for all services'],
    traps: ['Only timeout at edge, not internal RPCs'],
    strongSignals: ['Timeout budget math across chain', 'Cancel propagation', 'Thread pool exhaustion story'],
  },
  keyTakeaways: [
    'Timeout every external call — connect and read/deadline.',
    'Client deadline must exceed internal hops or use parallel calls.',
    'Cancel server work when client abandons request.',
    'Align LB, app, and DB timeout layers.',
    'Too-short timeouts cause false errors; too-long cause cascades.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Connect vs read timeout?', answerHint: 'Connect: handshake; read: waiting for response bytes.' },
    { level: 'intermediate', question: 'DB slow, no API timeout — what breaks?', answerHint: 'Threads block, pool exhausted, 503 for unrelated requests.' },
    { level: 'advanced', question: 'Client times out but server completes — problem?', answerHint: 'Orphan work, duplicate retry, wasted resources; need cancellation/idempotency.' },
  ],
  flashcards: [
    { front: 'Connect timeout', back: 'Max wait to establish TCP/TLS connection' },
    { front: 'Deadline propagation', back: 'Pass remaining time budget to downstream calls' },
    { front: 'Orphan request', back: 'Server finishes work after client already timed out' },
  ],
  quickRevision: [
    'Timeout every I/O',
    'Connect + read/deadline',
    'Propagate budget',
    'Cancel on timeout',
    'LB > app > client order',
  ],
}
