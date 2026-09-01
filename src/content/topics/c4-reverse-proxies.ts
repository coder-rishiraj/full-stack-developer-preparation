import type { TopicContent } from '@/domain/types'

export const reverseProxiesContent: TopicContent = {
  whatIsIt:
    'A reverse proxy sits in front of backend servers, accepting client connections and forwarding requests upstream. Unlike forward proxy (client-facing outbound), reverse proxy is server-side: clients see proxy as the origin. Examples: nginx, HAProxy, AWS ALB, Envoy, Spring Cloud Gateway.',
  whyExists:
    'Single public entry point for TLS termination, load balancing, caching, compression, WAF, rate limiting, and hiding internal topology. Backends stay private; proxy handles connection scaling and protocol bridging.',
  mentalModel:
    'Reception desk: visitors talk to desk (proxy); desk routes to internal departments (app servers). Clients never connect directly to apps. Proxy adds/removes headers (X-Forwarded-For, X-Request-Id), may buffer or stream bodies.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Reverse proxy placement',
      diagram: `flowchart LR
  Client[Internet clients] --> RP[Reverse proxy nginx/ALB]
  RP --> App1[App instance 1]
  RP --> App2[App instance 2]
  RP --> App3[App instance 3]`,
    },
    {
      type: 'table',
      headers: ['Function', 'Benefit'],
      rows: [
        ['TLS termination', 'Centralized cert management'],
        ['Load balancing', 'Distributes across upstreams'],
        ['Caching', 'Static and cacheable GET responses'],
        ['Compression', 'gzip/brotli at edge'],
        ['Security', 'WAF, rate limit, hide internal IPs'],
        ['Routing', 'Path/host based to microservices'],
      ],
    },
    {
      type: 'list',
      items: [
        'X-Forwarded-For: original client IP chain.',
        'X-Forwarded-Proto: https when TLS terminated at proxy.',
        'Health checks: proxy removes unhealthy upstreams.',
        'WebSocket upgrade forwarded with Connection headers.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'nginx',
      caption: 'nginx reverse proxy snippet',
      code: `upstream api_backend {
  server 10.0.1.10:8080;
  server 10.0.1.11:8080;
}
server {
  listen 443 ssl;
  location /api/ {
    proxy_pass http://api_backend;
    proxy_set_header Host $host;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto $scheme;
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring behind proxy — trust forwarded headers',
      code: `server.forward-headers-strategy=framework
// Or Tomcat RemoteIpValve for X-Forwarded-*`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Layer 4 vs Layer 7 proxy: TCP pass-through vs HTTP-aware routing.',
        'Connection pooling: proxy maintains keep-alive pools to upstreams.',
        'Buffering vs streaming: large uploads may buffer on proxy.',
        'Sticky sessions: cookie-based route to same backend.',
        'Service mesh sidecar (Envoy) is per-pod reverse proxy pattern.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Centralized TLS and security policies',
      'Scale backends independently of public IP/DNS',
      'Caching and compression reduce origin load',
    ],
    disadvantages: [
      'Single point of failure without HA proxy tier',
      'Misconfigured forwarded headers break auth/logging',
      'Added latency hop (usually small)',
    ],
    alternatives: [
      'Direct expose app with TLS on each instance (harder ops)',
      'API gateway with auth transformation (Kong, Apigee)',
    ],
    whenToUse: [
      'Production web/API with multiple app instances',
      'TLS termination and path-based routing',
    ],
    whenNotToUse: [
      'Simple single-instance dev without need',
      'When end-to-end encryption required to app (TLS passthrough)',
    ],
  },
  failureModes: [
    'Wrong X-Forwarded-Proto → app generates http URLs on HTTPS site.',
    'Trusting X-Forwarded-For from clients — spoofing risk without proxy strip.',
    'Upstream timeout shorter than app processing → 502.',
    'WebSocket not configured → broken realtime.',
    'Body size limit on proxy → 413 for large uploads.',
  ],
  interview: {
    expectations: [
      'Reverse vs forward proxy',
      'Common responsibilities (TLS, LB, headers)',
      'X-Forwarded-* headers purpose',
    ],
    commonQuestions: [
      'What is reverse proxy?',
      'Reverse vs forward proxy?',
      'Why terminate TLS at proxy?',
    ],
    followUps: [
      'Layer 4 vs Layer 7 load balancing?',
      'How app knows client IP behind proxy?',
    ],
    misconceptions: [
      'Reverse proxy same as load balancer (LB is one function of RP)',
      'Clients know backend server IPs (hidden by design)',
      'Forward and reverse proxy same direction',
    ],
    traps: ['Confusing forward proxy (Squid for outbound) with reverse (nginx inbound)'],
    strongSignals: [
      'TLS termination trade-offs',
      'Forwarded headers and trust boundary',
      'Health checks and upstream pools',
    ],
  },
  keyTakeaways: [
    'Reverse proxy = client-facing server fronting backends.',
    'TLS termination, LB, cache, security at edge.',
    'X-Forwarded-For/Proto for client context.',
    'Hide internal network topology.',
    'Configure timeouts and WebSocket upgrades.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Reverse proxy vs forward proxy?',
      answerHint: 'Reverse sits before servers for inbound; forward sits before clients for outbound.',
    },
    {
      level: 'intermediate',
      question: 'Why terminate TLS at reverse proxy?',
      answerHint: 'Central cert ops, offload crypto from apps, WAF inspection at edge.',
    },
    {
      level: 'advanced',
      question: 'Risk of trusting X-Forwarded-For?',
      answerHint: 'Clients can spoof if app trusts header directly; only trust from known proxy.',
    },
  ],
  flashcards: [
    { front: 'Reverse proxy', back: 'Accepts client requests, forwards to backend servers' },
    { front: 'X-Forwarded-Proto', back: 'Original scheme https when TLS terminated at proxy' },
    { front: 'TLS termination', back: 'TLS ends at proxy; may use HTTP to backend' },
  ],
  quickRevision: [
    'Client → proxy → backends',
    'nginx ALB Envoy',
    'TLS termination',
    'X-Forwarded-For/Proto',
    'L7 path routing',
    'Health checks upstream',
    'Not forward proxy',
  ],
}

export const content = reverseProxiesContent
