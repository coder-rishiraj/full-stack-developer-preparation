import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'HTTP/3 runs HTTP semantics over QUIC—a UDP-based transport with built-in TLS 1.3, independent per-stream flow control, and connection migration. Removes TCP head-of-line blocking affecting HTTP/2; supports 0-RTT resumption for faster reconnects (with replay risk).',
  whyExists:
    'HTTP/2 still shares one TCP connection—packet loss stalls all streams. QUIC multiplexes streams at transport layer with separate loss recovery; mobile clients benefit from connection migration when IP changes. Major CDNs and browsers adopt h3 for latency.',
  mentalModel:
    'HTTP over QUIC: each stream is independent on UDP; encryption mandatory; connection ID lets you roam WiFi→LTE without new handshake; HTTP frames ride inside QUIC streams like HTTP/2 but transport differs.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'QUIC on UDP port 443 (often alongside TCP 443).',
        'Integrated TLS 1.3—no separate TLS over TCP handshake sequence.',
        'Streams independent: loss on one stream does not block others.',
        'Connection ID allows NAT rebinding / IP change without full reconnect.',
        '0-RTT: resume with prior keys sends data immediately—vulnerable to replay; idempotent GET only.',
        'Alt-Svc header or HTTPS DNS advertises h3 endpoint.',
        'QPACK header compression (similar HPACK idea, different delivery to avoid HOL on table updates).',
      ],
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Client requests https://cdn.example/asset.js: Alt-Svc: h3=":443"; ma=86400 → subsequent requests use QUIC UDP to same host; single lost UDP packet retransmitted only for affected stream not whole connection.',
    },
    {
      type: 'table',
      headers: ['Layer', 'HTTP/2', 'HTTP/3'],
      rows: [
        ['Transport', 'TCP', 'QUIC over UDP'],
        ['Encryption', 'TLS over TCP', 'TLS 1.3 integrated in QUIC'],
        ['Multiplex HOL', 'TCP loss blocks all', 'Per-stream loss isolation'],
        ['Migration', 'TCP 4-tuple bound', 'Connection ID migration'],
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'No TCP HOL across streams',
      'Faster handshake / 0-RTT resume',
      'Connection migration on mobile',
      'Mandatory encryption',
    ],
    disadvantages: [
      'UDP blocked/throttled on some corporate networks',
      '0-RTT replay risk for non-idempotent ops',
      'More complex stack; CPU on user-space QUIC',
      'Middlebox incompatibility historically',
    ],
    alternatives: ['HTTP/2 over TCP where QUIC blocked', 'TLS 1.3 session resumption on TCP'],
    whenToUse: ['Public web via CDN supporting h3', 'Mobile lossy networks', 'Latency-sensitive edge'],
    whenNotToUse: ['UDP blocked environments without fallback', 'Non-idempotent 0-RTT POST'],
  },
  failureModes: [
    'Fallback to h2 not configured—clients fail on UDP block.',
    '0-RTT replay duplicates non-safe requests.',
    'Firewall drops UDP 443—silent downgrade needed.',
    'Alt-Svc cache stale points wrong h3 port.',
  ],
  interview: {
    expectations: [
      'HTTP/3 = HTTP over QUIC over UDP',
      'Fixes TCP HOL for multiplexing',
      '0-RTT tradeoff replay safety',
    ],
    commonQuestions: ['HTTP/3 vs HTTP/2?', 'Why QUIC on UDP?', '0-RTT safe when?'],
    followUps: ['QPACK vs HPACK?', 'Connection migration how?', 'Fallback strategy?'],
    misconceptions: ['HTTP/3 replaces TLS separate layer', 'Always faster on desktop fiber', '0-RTT free with no risk'],
    traps: ['Enable 0-RTT for payment POST', 'No h2 fallback behind strict firewall'],
    strongSignals: ['TCP vs QUIC stream loss isolation', 'Alt-Svc discovery', 'Idempotent 0-RTT only'],
  },
  keyTakeaways: [
    'HTTP/3 uses QUIC (UDP) not TCP.',
    'Independent streams—loss isolated per stream.',
    'TLS 1.3 built into QUIC handshake.',
    '0-RTT fast resume—replay risk on non-idempotent.',
    'Alt-Svc advertises h3; need h2 fallback.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'HTTP/3 transport protocol?', answerHint: 'QUIC over UDP—not TCP.' },
    { level: 'intermediate', question: 'Why HTTP/3 over HTTP/2?', answerHint: 'QUIC streams avoid TCP head-of-line blocking; faster connect and connection migration on network change.' },
    { level: 'advanced', question: '0-RTT replay concern?', answerHint: 'Early data replayed by attacker—only safe for idempotent operations; disable or anti-replay for state-changing requests.' },
  ],
  flashcards: [
    { front: 'HTTP/3 stack', back: 'HTTP semantics over QUIC over UDP.' },
    { front: 'QUIC vs TCP multiplexing', back: 'QUIC per-stream loss recovery; TCP loss stalls all streams.' },
    { front: '0-RTT caution', back: 'Replay risk—limit to idempotent requests.' },
  ],
  quickRevision: [
    'QUIC on UDP 443',
    'TLS 1.3 integrated',
    'No TCP HOL',
    'Connection migration',
    '0-RTT idempotent only',
    'Alt-Svc discovery',
    'h2 fallback required',
  ],
  production: {
    performance: [
      'Enable h3 on CDN edge with h2/tcp fallback for UDP-blocked clients.',
      'Measure TTFB separately for h2 vs h3—gains largest on lossy mobile networks.',
    ],
    reliability: [
      'Dual-stack h3+h2 listeners; monitor UDP reachability from diverse networks.',
    ],
    security: [
      'Disable or restrict 0-RTT for authenticated state-changing APIs.',
      'QUIC mandatory crypto—still validate cert pinning policies.',
    ],
    observability: [
      'Log negotiated protocol (ALPN h3 vs h2) per request in access logs.',
    ],
    cost: [
      'CDN may price h3 similarly to h2—CPU slightly higher on edge for QUIC user-space stacks.',
    ],
  },
}
