import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'HTTP/2 multiplexes many request/response streams over one TCP connection with binary framing, HPACK header compression, stream prioritization, and server push (largely deprecated in browsers). Replaces HTTP/1.1 head-of-line blocking at application layer for concurrent requests.',
  whyExists:
    'HTTP/1.1 opens many TCP connections or queues requests on one connection (HOL blocking). HTTP/2 one connection carries parallel streams—lower latency for pages/APIs with many assets and enables gRPC efficient RPC multiplexing.',
  mentalModel:
    'Single wire, many labeled streams: each request is stream ID with frames (HEADERS, DATA, SETTINGS). Headers compressed shared dictionary HPACK; server can push predicted resources (rare today).',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Connection preface + SETTINGS exchange negotiates frame size, window.',
        'Streams: bidirectional byte sequences identified by 31-bit ID.',
        'Frames: HEADERS (metadata), DATA (body), WINDOW_UPDATE flow control, RST_STREAM cancel.',
        'HPACK: static + dynamic table compress repeated headers (:method, :path, cookies).',
        'Flow control: per-stream and connection windows prevent fast sender overwhelming receiver.',
        'TLS ALPN h2 required for browsers; cleartext h2c for internal.',
        'Server push: PUSH_PROMISE frame—clients often disable; prefer preload hints.',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Browser loads page: one TLS connection to cdn.example.com; HTML, CSS, JS requested as separate streams 1,3,5 concurrently—no six parallel TCP connections like HTTP/1.1.',
    },
    {
      type: 'table',
      headers: ['Feature', 'HTTP/1.1', 'HTTP/2'],
      rows: [
        ['Multiplexing', 'No (pipelining limited)', 'Yes many streams'],
        ['Header format', 'Text verbose', 'Binary HPACK compressed'],
        ['Connection count', 'Many per origin', 'One (typically)'],
        ['Server push', 'N/A', 'PUSH_PROMISE (declining use)'],
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Multiplexing cuts latency and connection count',
      'HPACK reduces header overhead on repeated calls',
      'Stream cancellation via RST_STREAM',
      'Foundation for gRPC framing',
    ],
    disadvantages: [
      'TCP-level HOL if packet loss affects all streams on connection',
      'Single connection can become bottleneck without tuning window',
      'Debugging harder than text HTTP/1.1',
      'Server push complexity low ROI',
    ],
    alternatives: ['HTTP/3 QUIC for transport HOL fix', 'HTTP/1.1 keep-alive still fine for simple APIs'],
    whenToUse: ['Browsers modern sites', 'gRPC internal RPC', 'Many parallel API calls same host'],
    whenNotToUse: ['Legacy clients without h2', 'Very simple low-QPS where tuning not worth it'],
  },
  failureModes: [
    'Proxy not HTTP/2 aware downgrades or breaks.',
    'Large headers exceed SETTINGS_MAX_HEADER_LIST_SIZE.',
    'Connection idle timeout middleboxes reset multiplexed pipe.',
    'Priority tree ignored by servers—minimal real impact.',
  ],
  interview: {
    expectations: [
      'Multiplexed streams one TCP connection',
      'HPACK header compression',
      'Binary frames HEADERS/DATA',
    ],
    commonQuestions: ['HTTP/2 vs HTTP/1.1?', 'Head-of-line blocking still?', 'Server push purpose?'],
    followUps: ['Why HTTP/3?', 'Flow control layers?', 'h2c vs h2 TLS?'],
    misconceptions: ['HTTP/2 always faster for single large download', 'Push replaces CDN', 'Text headers still on wire'],
    traps: ['Ignoring TCP loss impact on all streams', 'Assuming push enabled by default helpful'],
    strongSignals: ['Stream ID multiplex model', 'TCP HOL motivates QUIC', 'ALPN negotiation'],
  },
  keyTakeaways: [
    'One connection, many concurrent streams.',
    'Binary frames; HPACK compresses headers.',
    'Flow control per stream + connection.',
    'TCP packet loss still blocks all streams—HTTP/3 fixes at transport.',
    'Server push largely unused; multiplexing main win.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Main HTTP/2 improvement over HTTP/1.1?', answerHint: 'Multiplexing many requests/responses on single connection without head-of-line blocking at HTTP layer.' },
    { level: 'intermediate', question: 'HPACK purpose?', answerHint: 'Compress HTTP headers via static and dynamic tables—avoid repeating verbose cookies/auth headers.' },
    { level: 'advanced', question: 'HTTP/2 still has HOL blocking where?', answerHint: 'TCP layer—lost packet stalls entire connection affecting all streams; QUIC addresses per-stream transport.' },
  ],
  flashcards: [
    { front: 'HTTP/2 multiplexing', back: 'Many bidirectional streams over one TCP connection.' },
    { front: 'HPACK', back: 'Header compression with static/dynamic table.' },
    { front: 'HTTP/2 HOL limitation', back: 'TCP loss blocks all streams on connection.' },
  ],
  quickRevision: [
    'Binary frames',
    'Streams multiplexed',
    'HPACK headers',
    'WINDOW flow control',
    'ALPN h2 TLS',
    'TCP HOL remains',
    'Push mostly unused',
  ],
  production: {
    performance: [
      'Tune initial window size and max concurrent streams for API gateways under burst.',
      'Reuse connections from clients—avoid new TCP+TLS per request.',
    ],
    scalability: [
      'L7 load balancers must support HTTP/2 end-to-end or terminate and re-multiplex.',
    ],
    observability: [
      'Monitor HTTP/2 GOAWAY/RST_STREAM rates—signals client/server mismatch or timeouts.',
    ],
    reliability: [
      'Configure idle timeout and ping frames to detect dead connections through NAT.',
    ],
    maintainability: [
      'curl -v --http2 and browser devtools Protocol column verify negotiation in staging.',
    ],
  },
}
