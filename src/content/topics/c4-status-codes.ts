import type { TopicContent } from '@/domain/types'

export const statusCodesContent: TopicContent = {
  whatIsIt:
    'HTTP status codes are three-digit response codes classifying outcome: 1xx informational, 2xx success, 3xx redirection, 4xx client error, 5xx server error. First digit = category; full code signals precise semantics for clients, caches, and monitors.',
  whyExists:
    'Machine-readable outcome without parsing body. Enables automatic retry (503), redirect follow (302), cache behavior (304), and client error handling (401 vs 403 vs 404) consistently across the web.',
  mentalModel:
    '2xx = you’re good. 3xx = go elsewhere. 4xx = client fix request. 5xx = server fix. Don’t use 200 with error JSON for failures — breaks intermediaries and monitoring.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Code', 'Meaning', 'When to use'],
      rows: [
        ['200 OK', 'Success with body', 'GET/PUT/PATCH success'],
        ['201 Created', 'Resource created', 'POST create + Location header'],
        ['204 No Content', 'Success, no body', 'DELETE success'],
        ['301/308', 'Permanent redirect', 'URL moved permanently (308 preserves method)'],
        ['302/307', 'Temporary redirect', 'Short-term redirect (307 preserves method)'],
        ['304 Not Modified', 'Cache valid', 'Conditional GET with ETag/If-Modified-Since'],
        ['400 Bad Request', 'Malformed request', 'Invalid JSON, missing required field'],
        ['401 Unauthorized', 'Auth required/failed', 'Missing/invalid credentials'],
        ['403 Forbidden', 'Auth ok, not allowed', 'Insufficient permissions'],
        ['404 Not Found', 'Resource missing', 'Unknown id or route'],
        ['409 Conflict', 'State conflict', 'Stale ETag, duplicate unique key'],
        ['422 Unprocessable', 'Semantic validation', 'Well-formed but business rule fail'],
        ['429 Too Many Requests', 'Rate limited', 'Retry-After header'],
        ['500 Internal Error', 'Server bug', 'Unhandled exception'],
        ['502 Bad Gateway', 'Upstream invalid', 'Proxy got bad response from origin'],
        ['503 Service Unavailable', 'Temporary overload', 'Retry with backoff'],
        ['504 Gateway Timeout', 'Upstream timeout', 'LB/proxy timed out waiting'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: '401 vs 403',
      text: '401: not authenticated — provide credentials. 403: authenticated but forbidden — don’t retry with same creds.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Common response patterns',
      code: `POST /orders → 201 Created
  Location: /orders/991

GET /orders/999 → 404 Not Found

PUT /orders/42 + stale If-Match → 409 Conflict

GET /static/app.js + If-None-Match: "abc" → 304 Not Modified`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring ResponseEntity',
      code: `return ResponseEntity.status(HttpStatus.CREATED)
    .header(HttpHeaders.LOCATION, "/orders/" + id)
    .body(order);

throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Custom codes in 4xx/5xx for domain errors — stay within conventions.',
        'Problem Details (RFC 7807): application/problem+json body with type, title, detail.',
        'Retry-After on 503/429 guides client backoff.',
        '502/504 from nginx/ALB when origin down or slow — not app 500.',
        'Monitoring alerts: 5xx rate, 4xx spikes, p99 latency by status class.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Standard semantics across clients and proxies',
      'Enables cache and retry policies by code class',
      'Clear separation client vs server responsibility',
    ],
    disadvantages: [
      'Ambiguity in 400 vs 422 vs 409 without team standards',
      'Overloaded 404 for auth hide (prefer 403 sometimes)',
      '200-with-error JSON anti-pattern in legacy APIs',
    ],
    alternatives: [
      'GraphQL always 200 with errors array (different model)',
      'gRPC status codes in trailers',
    ],
    whenToUse: [
      'REST APIs with precise HTTP semantics',
      'CDN/cache integration (304, 404 caching)',
    ],
    whenNotToUse: [
      'Returning 200 for all outcomes with error field only',
      '500 for validation errors (use 400/422)',
    ],
  },
  failureModes: [
    '500 for bad client input — masks client bugs in metrics.',
    '404 instead of 403 leaking resource existence.',
    '302 changing POST to GET on redirect (use 307/308).',
    'Missing Retry-After on 429/503.',
    '502 confused with application 500 in debugging.',
  ],
  interview: {
    expectations: [
      'Know common codes by heart (200, 201, 204, 301, 304, 400, 401, 403, 404, 409, 500, 502, 503)',
      '401 vs 403 distinction',
      'When 201 vs 200',
    ],
    commonQuestions: [
      '401 vs 403?',
      '201 vs 200?',
      '502 vs 504 vs 500?',
      'What is 304?',
    ],
    followUps: [
      'How design error response body?',
      'Idempotent DELETE returns 404 second time?',
    ],
    misconceptions: [
      '404 always means wrong URL (can mean missing resource id)',
      '503 always means server bug (often overload/maintenance)',
      'Any error should be 500',
    ],
    traps: ['Using 401 for permission denied when user is logged in (403)'],
    strongSignals: [
      'Maps validation to 400/422 appropriately',
      'Mentions Location on 201',
      'Distinguishes gateway vs origin errors',
    ],
  },
  keyTakeaways: [
    '2xx success, 3xx redirect, 4xx client, 5xx server.',
    '201 Created + Location for POST create.',
    '401 unauthenticated; 403 forbidden.',
    '304 for conditional cache hit.',
    '502/504 = proxy/gateway; 500 = app exception.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does HTTP 404 mean?',
      answerHint: 'Resource not found at requested URI.',
    },
    {
      level: 'intermediate',
      question: '401 vs 403?',
      answerHint: '401 needs auth; 403 authenticated but lacks permission.',
    },
    {
      level: 'advanced',
      question: '502 vs 504 from load balancer?',
      answerHint: '502 bad/invalid upstream response; 504 upstream didn’t respond in time.',
    },
  ],
  flashcards: [
    { front: '201 Created', back: 'POST created resource; include Location' },
    { front: '304 Not Modified', back: 'Conditional GET; use cached body' },
    { front: '409 Conflict', back: 'Version/state conflict e.g. stale ETag' },
  ],
  quickRevision: [
    '2xx ok 3xx redirect',
    '4xx client 5xx server',
    '201 + Location',
    '401 auth 403 forbid',
    '422 validation',
    '429 rate limit',
    '502/504 gateway',
  ],
}

export const content = statusCodesContent
