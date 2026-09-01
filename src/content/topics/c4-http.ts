import type { TopicContent } from '@/domain/types'

export const httpContent: TopicContent = {
  whatIsIt:
    'HTTP (Hypertext Transfer Protocol) is an application-layer request/response protocol over TCP (or QUIC for HTTP/3). Clients send methods, URLs, headers, optional body; servers return status, headers, body. Stateless by default — each request independent unless cookies/sessions add state.',
  whyExists:
    'Standardizes how browsers and APIs exchange documents and data across the web. Enables caching, proxies, load balancers, and CDNs to understand and optimize traffic without custom wire protocols.',
  mentalModel:
    'Structured envelope: “GET /users/42 HTTP/1.1” + headers + blank line + body. Server replies “HTTP/1.1 200 OK” + headers + body. Intermediaries read headers for routing, caching, auth — not raw TCP bytes.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'DNS resolve host → TCP connect (443 for HTTPS).',
        'TLS handshake if HTTPS.',
        'Client sends request line, headers, body.',
        'Server processes, returns status line, headers, body.',
        'Connection reused (keep-alive) or closed per policy.',
      ],
    },
    {
      type: 'code',
      language: 'http',
      caption: 'Raw HTTP/1.1 request/response',
      code: `GET /api/users/42 HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJ...

HTTP/1.1 200 OK
Content-Type: application/json
Content-Length: 87
Cache-Control: private, max-age=0

{"id":42,"name":"Ada","email":"ada@example.com"}`,
    },
    {
      type: 'table',
      headers: ['Version', 'Transport', 'Notes'],
      rows: [
        ['HTTP/1.1', 'TCP', 'Text, keep-alive default; head-of-line blocking'],
        ['HTTP/2', 'TCP + TLS', 'Binary frames, multiplexing, HPACK compression'],
        ['HTTP/3', 'QUIC (UDP)', 'Independent streams, faster handshake'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Client[HTTP Client] -->|request| Proxy[Reverse proxy / LB]
  Proxy --> App[App server]
  App --> Proxy
  Proxy -->|response| Client
  subgraph message
    RL[Request line / status line]
    H[Headers]
    B[Body]
  end`,
    caption: 'HTTP message structure and typical path',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Java HttpClient (Java 11+)',
      code: `HttpClient client = HttpClient.newHttpClient();
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/users/42"))
    .header("Accept", "application/json")
    .GET()
    .build();
HttpResponse<String> resp = client.send(req, BodyHandlers.ofString());
System.out.println(resp.statusCode());
System.out.println(resp.body());`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring MVC handler (conceptual)',
      code: `@GetMapping("/users/{id}")
public User getUser(@PathVariable Long id) {
  return userService.findById(id);
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Host header mandatory in HTTP/1.1 for virtual hosting on shared IP.',
        'Chunked transfer-encoding for streaming bodies without Content-Length.',
        'Content negotiation: Accept, Accept-Encoding, Accept-Language.',
        'HTTP/2: single connection, many streams; server push (rarely used).',
        'Idempotent methods safe to retry on network failure (GET, PUT, DELETE).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Human-readable (HTTP/1.1); rich caching semantics',
      'Universal tooling: browsers, curl, proxies, CDNs',
      'Stateless servers scale horizontally',
    ],
    disadvantages: [
      'Text headers overhead in HTTP/1.1',
      'TCP + TLS setup latency per cold connection',
      'No built-in auth — layered via headers/TLS',
    ],
    alternatives: [
      'gRPC over HTTP/2 for internal RPC',
      'WebSockets for bidirectional push',
      'GraphQL over HTTP for flexible queries',
    ],
    whenToUse: [
      'Public REST APIs, web apps, browser clients',
      'Cacheable read-heavy workloads',
    ],
    whenNotToUse: [
      'Ultra-low-latency internal mesh (sometimes gRPC wins)',
      'Binary streaming without HTTP semantics need',
    ],
  },
  failureModes: [
    'Missing Host header → wrong vhost or 400.',
    'HTTP without TLS on public internet → MITM.',
    'Assuming message boundaries on TCP stream without Content-Length/chunked.',
    'Retry POST on timeout → duplicate side effects.',
    'Mixed content HTTP assets on HTTPS page blocked.',
  ],
  interview: {
    expectations: [
      'Describe request/response structure',
      'Explain statelessness and where state lives',
      'HTTP/1.1 vs HTTP/2 at high level',
    ],
    commonQuestions: [
      'Is HTTP stateless?',
      'Structure of HTTP request?',
      'HTTP vs HTTPS?',
      'What happens when you enter URL?',
    ],
    followUps: [
      'How does keep-alive work?',
      'Where does session state go?',
    ],
    misconceptions: [
      'HTTP is always encrypted (plain HTTP exists)',
      'Body required on every request',
      'HTTP/2 changes REST semantics (it doesn’t)',
    ],
    traps: ['Describing URL entry without DNS and TCP/TLS steps'],
    strongSignals: [
      'Mentions request line, headers, body separation',
      'Connects to caching and proxy layers',
      'Knows stateless + cookies/sessions pattern',
    ],
  },
  keyTakeaways: [
    'Request/response over TCP; status + headers + body.',
    'Stateless protocol; state via cookies/tokens/DB.',
    'HTTPS = HTTP + TLS.',
    'HTTP/2 multiplexes; HTTP/3 uses QUIC.',
    'Host header required for name-based vhosts.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What are the parts of an HTTP request?',
      answerHint: 'Request line (method, path, version), headers, blank line, optional body.',
    },
    {
      level: 'intermediate',
      question: 'Is HTTP stateless? How do web apps maintain session?',
      answerHint: 'Protocol stateless; sessions via cookies, JWT, server-side store keyed by session id.',
    },
    {
      level: 'advanced',
      question: 'HTTP/1.1 vs HTTP/2 key differences?',
      answerHint: 'HTTP/2 binary framed, multiplexed streams, header compression; same semantics.',
    },
  ],
  flashcards: [
    { front: 'HTTP message parts', back: 'Start line, headers, blank line, body' },
    { front: 'Stateless HTTP', back: 'Server doesn’t store client state between requests by default' },
    { front: 'Host header', back: 'Required in HTTP/1.1 for virtual hosting' },
  ],
  quickRevision: [
    'Method + URL + version',
    'Status + headers + body',
    'Stateless + cookies/JWT',
    'DNS → TCP → TLS → HTTP',
    'Keep-alive reuse',
    'HTTP/2 multiplex',
    'Idempotent GET/PUT/DELETE',
  ],
}

export const content = httpContent
