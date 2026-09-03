import type { TopicContent } from '@/domain/types'

export const httpsContent: TopicContent = {
  whatIsIt:
    'HTTPS is HTTP over TLS (Transport Layer Security): encrypts data in transit, authenticates server via certificates, and provides integrity. Default port 443. Browsers show padlock; modern APIs require HTTPS for secure cookies, HTTP/2, and many browser APIs.',
  whyExists:
    'Plain HTTP exposes credentials, session cookies, and PII to network eavesdroppers and MITM attacks on Wi-Fi, ISP, or compromised routers. HTTPS is baseline security for web and mobile API traffic on the public internet.',
  mentalModel:
    'TLS wraps TCP connection in encrypted tunnel before HTTP bytes flow. Client verifies server certificate chain to trusted CA; negotiates keys; then HTTP request/response identical semantically but ciphertext on wire.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'TCP connect to port 443.',
        'TLS handshake: ClientHello, server cert, key exchange, Finished.',
        'HTTP request/response encrypted inside TLS records.',
        'Connection may reuse session (TLS 1.3 0-RTT resumption with care).',
        'HSTS header forces future HTTPS from browser.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'HTTPS stack',
      diagram: `flowchart TB
  HTTP[HTTP semantics] --> TLS[TLS encryption]
  TLS --> TCP[TCP reliable stream]
  TCP --> IP[IP routing]`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'HTTPS ≠ authenticated API',
      text: 'TLS authenticates server to client. API still needs Authorization header, OAuth, or mTLS for client identity and authorization.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'HSTS response header',
      code: `Strict-Transport-Security: max-age=31536000; includeSubDomains; preload`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Java HttpClient HTTPS (default trust store)',
      code: `HttpClient client = HttpClient.newBuilder()
    .connectTimeout(Duration.ofSeconds(10))
    .build(); // Uses JVM cacerts for CA trust
HttpRequest req = HttpRequest.newBuilder()
    .uri(URI.create("https://api.example.com/health"))
    .GET().build();`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Certificate chain: leaf → intermediate → root CA in trust store.',
        'SNI (Server Name Indication): multiple HTTPS sites on one IP.',
        'Let’s Encrypt automated DV certs; EV/OV for org validation.',
        'TLS termination at load balancer vs end-to-end to app.',
        'Mixed content: HTTPS page loading HTTP resources blocked.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Confidentiality and integrity on untrusted networks',
      'Enables Secure cookies and modern HTTP features',
      'User trust signals (padlock, no browser warnings)',
    ],
    disadvantages: [
      'Handshake latency and CPU (mitigated by TLS 1.3, session resumption)',
      'Certificate lifecycle management',
      'Debugging harder without proxy decrypt (corporate)',
    ],
    alternatives: [
      'VPN for internal traffic (does not replace HTTPS for public)',
      'mTLS for service-to-service identity',
    ],
    whenToUse: [
      'All production web and public APIs',
      'Any authentication or personal data',
    ],
    whenNotToUse: [
      'Plain HTTP on public internet (deprecated)',
      'Dev localhost often HTTP OK; use mkcert for local HTTPS',
    ],
  },
  failureModes: [
    'Expired certificate → browser/API client failures.',
    'Hostname mismatch (cert for wrong domain).',
    'Incomplete intermediate chain → Android/old client errors.',
    'HTTP allowed alongside HTTPS → SSL stripping attacks without HSTS.',
    'Self-signed cert in prod without custom trust → rejected.',
  ],
  interview: {
    expectations: [
      'Explain HTTPS = HTTP + TLS',
      'What certificates prove (server identity)',
      'HSTS purpose',
    ],
    commonQuestions: [
      'HTTP vs HTTPS?',
      'What does TLS provide?',
      'What is HSTS?',
      'What happens on certificate error?',
    ],
    followUps: [
      'TLS termination at load balancer?',
      'Difference TLS and SSL (SSL deprecated)?',
    ],
    misconceptions: [
      'HTTPS encrypts the URL path and query; the destination IP remains visible and the hostname may be exposed through DNS and SNI unless newer privacy mechanisms are used',
      'HTTPS means site is trustworthy/safe content',
      'Self-signed OK for production public sites',
    ],
    traps: ['Confusing transport security with application authorization'],
    strongSignals: [
      'Mentions cert chain and CA trust',
      'HSTS and Secure cookie together',
      'TLS termination vs passthrough trade-offs',
    ],
  },
  keyTakeaways: [
    'HTTPS = HTTP over TLS on port 443.',
    'Encrypts traffic; cert proves server identity.',
    'HSTS prevents downgrade to HTTP.',
    'Secure cookies require HTTPS.',
    'API auth still needed beyond TLS.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does HTTPS add over HTTP?',
      answerHint: 'Encryption, integrity, server authentication via certificates.',
    },
    {
      level: 'intermediate',
      question: 'What is HSTS?',
      answerHint: 'Header telling browser to use HTTPS only for domain for max-age period.',
    },
    {
      level: 'advanced',
      question: 'TLS termination at load balancer implications?',
      answerHint: 'TLS ends at LB; HTTP to backend — secure internal network or re-encrypt needed.',
    },
  ],
  flashcards: [
    { front: 'HTTPS port', back: '443 default' },
    { front: 'HSTS', back: 'Strict-Transport-Security forces HTTPS' },
    { front: 'Secure cookie', back: 'Requires HTTPS connection' },
  ],
  quickRevision: [
    'HTTP + TLS = HTTPS',
    'Port 443',
    'Cert chain + CA trust',
    'SNI multi-site one IP',
    'HSTS max-age',
    'TLS termination at LB',
    'Still need Authorization',
  ],
}

export const content = httpsContent
