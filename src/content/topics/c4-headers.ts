import type { TopicContent } from '@/domain/types'

export const headersContent: TopicContent = {
  whatIsIt:
    'HTTP headers are key-value metadata on requests and responses: Content-Type, Authorization, Cache-Control, Cookie, Host, ETag, etc. They control caching, auth, content negotiation, CORS, security policies, and routing without changing URL or method.',
  whyExists:
    'Separate metadata from body so proxies and caches can act on directives (Cache-Control, Vary) without parsing JSON. Standard headers enable interoperability; custom X- headers for app-specific needs (prefer registered names when possible).',
  mentalModel:
    'Headers = envelope labels. Request headers describe what client wants/sends; response headers describe what server returned and how to cache/handle it. Case-insensitive names; values often have structured grammar.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Header', 'Direction', 'Purpose'],
      rows: [
        ['Host', 'Request', 'Target hostname (HTTP/1.1 required)'],
        ['Content-Type', 'Both', 'Media type e.g. application/json'],
        ['Content-Length', 'Both', 'Body size in bytes'],
        ['Authorization', 'Request', 'Credentials Bearer/Basic'],
        ['Accept', 'Request', 'Preferred response media types'],
        ['Cache-Control', 'Both', 'Caching directives max-age, no-store'],
        ['ETag / If-None-Match', 'Resp / Req', 'Conditional GET validation'],
        ['Set-Cookie / Cookie', 'Resp / Req', 'Session state'],
        ['Location', 'Response', 'Redirect or created resource URI'],
        ['User-Agent', 'Request', 'Client identification'],
        ['X-Request-Id', 'Both', 'Distributed tracing correlation'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Security headers (responses)',
      text: 'Strict-Transport-Security, Content-Security-Policy, X-Frame-Options, X-Content-Type-Options — defense in depth for browsers.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Typical API headers',
      code: `GET /api/report HTTP/1.1
Host: api.example.com
Accept: application/json
Authorization: Bearer eyJhbG...
If-None-Match: "v7"

HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8
Cache-Control: private, max-age=60
ETag: "v8"
X-Request-Id: 7f3a9c2e`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring setting headers',
      code: `@GetMapping("/report")
public ResponseEntity<Report> getReport(
    @RequestHeader(value = "If-None-Match", required = false) String etag) {
  Report r = service.load();
  if (etag != null && etag.equals(r.getEtag())) {
    return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
  }
  return ResponseEntity.ok()
      .eTag(r.getEtag())
      .cacheControl(CacheControl.maxAge(60, SECONDS))
      .body(r);
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Hop-by-hop headers (Connection, Transfer-Encoding) not forwarded by proxies.',
        'End-to-end headers (Cache-Control, Authorization) pass through.',
        'HTTP/2 HPACK compresses repeated header names/values.',
        'Vary header lists request headers affecting cached representation.',
        'Chunked encoding uses Transfer-Encoding: chunked instead of Content-Length.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Rich control without URL pollution',
      'Standard caching and auth patterns',
      'Extensible for tracing and feature flags',
    ],
    disadvantages: [
      'Header bloat on every request (HTTP/2 helps)',
      'Cookie header sent on every request — size limits',
      'Misconfigured CORS/cache headers hard to debug',
    ],
    alternatives: [
      'Query params for cache busting (weaker semantics)',
      'JWT in body (non-standard for HTTP)',
    ],
    whenToUse: [
      'Auth tokens in Authorization header',
      'Cache-Control + ETag for GET optimization',
      'Content-Type for API versioning negotiation',
    ],
    whenNotToUse: [
      'Large payloads in headers (4KB–16KB limits vary)',
      'Secrets in URL query strings',
    ],
  },
  failureModes: [
    'Missing Content-Type → client parse errors.',
    'Cache-Control: public on personalized responses → data leak.',
    'Oversized Cookie header → 431 Request Header Fields Too Large.',
    'CORS misconfig exposing credentials broadly.',
    'Duplicate Content-Length and chunked → smuggling risks (legacy).',
  ],
  interview: {
    expectations: [
      'Explain common request/response headers',
      'Cache-Control and ETag flow',
      'Authorization vs Cookie auth',
    ],
    commonQuestions: [
      'Important HTTP headers?',
      'How HTTP caching works with ETag?',
      'What is Host header for?',
    ],
    followUps: [
      'Hop-by-hop vs end-to-end?',
      'Vary header purpose?',
    ],
    misconceptions: [
      'Headers are case-sensitive (names are case-insensitive)',
      'ETag replaces Cache-Control (they complement)',
      'Bearer token same as session cookie always',
    ],
    traps: ['Forgetting Host header in HTTP/1.1 virtual hosting explanation'],
    strongSignals: [
      'Conditional GET with If-None-Match → 304',
      'Mentions security response headers',
      'Knows Cookie size and SameSite',
    ],
  },
  keyTakeaways: [
    'Headers carry metadata separate from body.',
    'Content-Type, Authorization, Cache-Control essential for APIs.',
    'ETag + If-None-Match enable efficient caching.',
    'Host required for name-based virtual hosts.',
    'Security headers protect browsers; CORS controls cross-origin.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does Content-Type header do?',
      answerHint: 'Declares representation media type e.g. application/json.',
    },
    {
      level: 'intermediate',
      question: 'How ETag and If-None-Match work together?',
      answerHint: 'Server sends ETag; client sends If-None-Match on revisit; 304 if unchanged.',
    },
    {
      level: 'advanced',
      question: 'Cache-Control: private vs public?',
      answerHint: 'Public cacheable by shared caches/CDN; private only browser/private cache.',
    },
  ],
  flashcards: [
    { front: 'Authorization header', back: 'Bearer token or Basic credentials' },
    { front: '304 trigger', back: 'If-None-Match or If-Modified-Since matches' },
    { front: 'Vary header', back: 'Lists request headers affecting cached response variant' },
  ],
  quickRevision: [
    'Host for vhost',
    'Content-Type media type',
    'Cache-Control directives',
    'ETag conditional GET',
    'Authorization Bearer',
    'Set-Cookie / Cookie',
    'Hop-by-hop vs end-to-end',
  ],
}

export const content = headersContent
