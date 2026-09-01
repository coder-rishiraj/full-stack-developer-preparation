import type { TopicContent } from '@/domain/types'

export const keepAliveContent: TopicContent = {
  whatIsIt:
    'HTTP keep-alive (persistent connections) reuses a single TCP connection for multiple HTTP request/response pairs instead of opening a new connection per request. HTTP/1.1 defaults to persistent; Connection: close opts out. HTTP/2 multiplexes many streams on one connection.',
  whyExists:
    'TCP + TLS handshake costs 1–3 RTTs per new connection. Keep-alive amortizes setup over many requests — critical for web pages with dozens of assets and APIs with frequent calls.',
  mentalModel:
    'Open phone line once, have many conversations (HTTP exchanges), hang up when idle timeout or Connection: close. Pool connections on client side; limit concurrent streams per host in HTTP/2.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Client connects TCP (+ TLS for HTTPS).',
        'First HTTP request; response includes Connection: keep-alive (implicit in HTTP/1.1).',
        'Subsequent requests on same socket until idle timeout or close.',
        'Server/client may limit max requests per connection or idle time.',
        'HTTP/2: one connection, parallel streams via frames.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'With vs without keep-alive',
      diagram: `sequenceDiagram
  participant C as Client
  participant S as Server
  Note over C,S: Keep-alive (one TCP)
  C->>S: GET /a
  S-->>C: 200
  C->>S: GET /b
  S-->>C: 200
  Note over C,S: Without: new TCP+TLS each request`,
    },
    {
      type: 'table',
      headers: ['Version', 'Default', 'Notes'],
      rows: [
        ['HTTP/1.0', 'Close', 'Need Connection: keep-alive header'],
        ['HTTP/1.1', 'Persistent', 'Connection: close to disable'],
        ['HTTP/2', 'Always multiplexed', 'Single connection per origin typical'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'HTTP/1.1 persistent',
      code: `GET /api/users HTTP/1.1
Host: api.example.com
Connection: keep-alive

HTTP/1.1 200 OK
Connection: keep-alive
Content-Length: 1234
...`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Java HttpClient connection pooling',
      code: `HttpClient client = HttpClient.newBuilder()
    .version(HttpClient.Version.HTTP_2)
    .connectTimeout(Duration.ofSeconds(5))
    .build();
// Reuses connections to same host automatically`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Browser limits ~6 parallel connections per host HTTP/1.1 — domain sharding legacy hack.',
        'HTTP/2 removes head-of-line blocking at HTTP layer; TCP HOL remains until QUIC.',
        'Proxy keep-alive: client↔proxy and proxy↔origin may differ.',
        'Idle timeout: nginx keepalive_timeout; client must handle stale connection retry.',
        'Connection pool sizing in Apache HttpClient, OkHttp, HttpClient 11.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Lower latency — skip repeated handshakes',
      'Reduced CPU on TLS negotiation',
      'Better throughput for bursty API traffic',
    ],
    disadvantages: [
      'Connections hold server file descriptors',
      'Stale connection errors if timeout mismatched',
      'HTTP/1.1 pipelining rarely used (HOL blocking)',
    ],
    alternatives: [
      'HTTP/2 or HTTP/3 for better multiplexing',
      'Request coalescing / batch APIs',
    ],
    whenToUse: [
      'Always for HTTP/1.1+ unless explicit close needed',
      'Client connection pools in microservices',
    ],
    whenNotToUse: [
      'Very long-lived idle connections without heartbeat (use WebSocket)',
      'One-shot large download then never reuse',
    ],
  },
  failureModes: [
    'Stale connection: server closed idle; client sends → connection reset, retry needed.',
    'Load balancer idle timeout < client pool → intermittent failures.',
    'Too many idle connections exhaust server fds.',
    'Assuming new connection per request in performance testing.',
    'HTTP/1.1 without Content-Length/chunked breaks persistence parsing.',
  ],
  interview: {
    expectations: [
      'Explain why keep-alive improves performance',
      'HTTP/1.1 default persistence',
      'Connection pooling concept',
    ],
    commonQuestions: [
      'What is HTTP keep-alive?',
      'Why reuse TCP connections?',
      'HTTP/1.1 vs HTTP/2 connection model?',
    ],
    followUps: [
      'What causes stale connection errors?',
      'Browser connection limits HTTP/1.1?',
    ],
    misconceptions: [
      'Each HTTP request always new TCP connection (HTTP/1.1 default opposite)',
      'Keep-alive same as WebSocket',
      'HTTP/2 needs multiple TCP connections per page',
    ],
    traps: ['Ignoring TLS handshake cost when discussing keep-alive benefits'],
    strongSignals: [
      'Mentions RTT and handshake amortization',
      'HTTP/2 multiplexing on one connection',
      'Pool idle timeout alignment with LB',
    ],
  },
  keyTakeaways: [
    'HTTP/1.1 connections persistent by default.',
    'Reuse saves TCP+TLS handshake RTTs.',
    'HTTP/2 multiplexes streams on one connection.',
    'Client pools + server idle timeouts must align.',
    'Retry on stale connection reset.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why use HTTP keep-alive?',
      answerHint: 'Reuse TCP connection for multiple requests; avoid repeated handshake latency.',
    },
    {
      level: 'intermediate',
      question: 'HTTP/1.1 default connection behavior?',
      answerHint: 'Persistent unless Connection: close; pipelining rare.',
    },
    {
      level: 'advanced',
      question: 'Stale keep-alive connection — what happens?',
      answerHint: 'Server closed idle socket; client request fails; retry on new connection.',
    },
  ],
  flashcards: [
    { front: 'HTTP/1.1 default', back: 'Persistent connections unless Connection: close' },
    { front: 'HTTP/2 connections', back: 'Typically one TCP per origin, many streams' },
    { front: 'Keep-alive benefit', back: 'Amortize TCP+TLS handshake cost' },
  ],
  quickRevision: [
    'Persistent HTTP/1.1 default',
    'Connection: close opts out',
    'Pool on client',
    'HTTP/2 multiplex',
    'Align idle timeouts',
    'Stale conn retry',
    '6 conn/host limit H1',
  ],
}

export const content = keepAliveContent
