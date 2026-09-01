import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'API error modelling standardizes failure responses — machine-readable codes, human messages, field-level validation details, and correct HTTP status mapping. RFC 7807 Problem Details (application/problem+json) is a common envelope; consistent errors speed client integration and support debugging.',
  whyExists:
    'Returning 200 OK with {success:false} or generic 500 for validation bugs wastes client retry logic and hides fixable issues. Structured errors enable programmatic handling (retry on 503, show field errors on 422) and correlate support tickets via error instance id.',
  mentalModel:
    'Success and failure both have contracts. Pick status first (400 client fault, 401 auth, 404 missing, 409 conflict, 422 validation, 429 rate limit, 500 server fault). Body carries stable code enum + message + optional details[] with field paths.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Status', 'Meaning', 'Retry?'],
      rows: [
        ['400 Bad Request', 'Malformed JSON, bad param type', 'Fix request'],
        ['401 Unauthorized', 'Missing/invalid auth', 'Refresh token'],
        ['403 Forbidden', 'Auth OK but not allowed', 'No'],
        ['404 Not Found', 'Resource absent or hidden', 'No'],
        ['409 Conflict', 'Version clash, duplicate', 'Merge or refresh'],
        ['422 Unprocessable', 'Semantic validation failed', 'Fix fields'],
        ['429 Too Many Requests', 'Rate limited', 'Backoff Retry-After'],
        ['503 Service Unavailable', 'Overload/maintenance', 'Retry with jitter'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Error response structure',
      diagram: `flowchart TB
  Err[Error occurred]
  Err --> Map[Map to HTTP status]
  Map --> Body[Problem JSON envelope]
  Body --> Code[stable code enum]
  Body --> Msg[human message]
  Body --> Det[details field violations]
  Body --> Id[trace_id / instance URI]`,
    },
    {
      type: 'list',
      items: [
        'Stable error codes: INSUFFICIENT_FUNDS not changing strings',
        'Never leak stack traces or SQL to clients in prod',
        'Include request_id/trace_id for support correlation',
        'Validation: details[{ field, code, message }]',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'json',
      caption: 'RFC 7807 style validation error',
      code: `HTTP/1.1 422 Unprocessable Content
Content-Type: application/problem+json

{
  "type": "https://api.example.com/errors/validation",
  "title": "Validation failed",
  "status": 422,
  "code": "VALIDATION_ERROR",
  "trace_id": "abc-123",
  "errors": [
    { "field": "email", "code": "INVALID_FORMAT", "message": "Must be valid email" },
    { "field": "amount", "code": "OUT_OF_RANGE", "message": "Must be positive" }
  ]
}`,
    },
  ],
  tradeoffs: {
    advantages: ['Predictable client handling', 'Better DX and support', 'Security via no internal leak'],
    disadvantages: ['Requires discipline and catalog maintenance', 'Legacy clients expect ad-hoc shapes'],
    alternatives: ['GraphQL errors array', 'gRPC status codes + details'],
    whenToUse: ['All public HTTP APIs'],
    whenNotToUse: ['Never skip — internal APIs benefit too'],
  },
  failureModes: [
    '500 for validation → client retry storm',
    '200 with error body breaks HTTP semantics',
    'Changing error code strings breaks clients',
    'Leaking PII in error messages',
    'Inconsistent codes across services',
  ],
  production: {
    observability: ['Log trace_id with stack server-side only', 'Metrics by error code not message text'],
    security: ['Generic 404 for unauthorized resource existence', 'Sanitize validation messages'],
    maintainability: ['Central error catalog OpenAPI components', 'Exception handler middleware'],
    reliability: ['503 Retry-After on dependency down', 'Differentiate transient vs permanent'],
  },
  interview: {
    expectations: ['Status code selection', 'Problem JSON shape', '401 vs 403 vs 404 security'],
    commonQuestions: ['Design error envelope?', '409 vs 422?'],
    followUps: ['Localize error messages?', 'Multi-service trace id propagation?'],
    misconceptions: ['Always 400 for any client error', 'Expose internal exception message'],
    traps: ['404 vs 403 info leak on private resources'],
    strongSignals: ['Stable code enum', 'trace_id', 'OpenAPI shared Error schema'],
  },
  keyTakeaways: [
    'Correct HTTP status is part of the API contract.',
    'Stable machine codes + human messages + field details.',
    'RFC 7807 problem+json common pattern.',
    'Include trace_id; log details server-side only.',
    '404 vs 403: hide existence when unauthorized.',
  ],
  interviewQuestions: [
    { level: 'basic', question: '400 vs 422?', answerHint: '400 malformed request; 422 well-formed but semantic/business validation failed.' },
    { level: 'intermediate', question: '401 vs 403 vs 404 private resource?', answerHint: '401 no auth; 403 auth but forbidden; 404 hide existence if no read permission.' },
    { level: 'advanced', question: 'Design cross-service error propagation?', answerHint: 'Preserve trace_id; map downstream codes; wrap 502/503 with Retry-After; don\'t leak internal codes raw.' },
  ],
  flashcards: [
    { front: '409 Conflict', back: 'Concurrent update/version mismatch or state conflict' },
    { front: 'problem+json', back: 'RFC 7807 standard error media type with type, title, status' },
    { front: 'Stable error code', back: 'Machine enum INSUFFICIENT_FUNDS not changing prose' },
    { front: 'trace_id purpose', back: 'Correlate client error report with server logs' },
  ],
  quickRevision: [
    'Status codes matter',
    'Stable code enum',
    'problem+json envelope',
    'trace_id correlate',
    'No stack to client',
  ],
  systemDesign: {
    problem: 'Standardize error responses across 30 microservices for unified mobile client handling and support tooling.',
    requirements: {
      functional: ['Shared error schema', 'Field validation errors', 'Trace correlation'],
      nonFunctional: ['Backward compatible v1 errors', 'OpenAPI documented codes'],
    },
    scaleAssumptions: ['30 services', 'Mobile parses codes programmatically'],
    capacityEstimates: ['Lightweight JSON envelope middleware per service'],
    api: [{ type: 'paragraph', text: 'OpenAPI components/schemas/ProblemError referenced by all services' }],
    dataModel: [{ type: 'list', items: ['Error catalog wiki: code → HTTP status → retry policy', 'trace_id from gateway injected header'] }],
    highLevelArchitecture: [{ type: 'paragraph', text: 'API gateway injects X-Trace-Id; each service exception handler maps domain exceptions → ProblemError.' }],
    diagram: {
      mermaid: `flowchart LR
  Svc[Microservice exception] --> H[Error mapper]
  H --> P[ProblemError JSON]
  GW[Gateway trace_id] --> P
  P --> Client[Mobile client switch code]`,
      caption: 'Central mapping local exceptions to shared envelope',
    },
    dataFlow: ['Domain throw InsufficientFundsException → 422 INSUFFICIENT_FUNDS', 'Log stack with trace_id'],
    storage: ['Error catalog git repo'],
    caching: ['N/A'],
    asyncProcessing: ['Error metrics to Prometheus by code label'],
    scaling: ['Stateless middleware'],
    consistency: ['Catalog governance PR review new codes'],
    reliability: ['Unknown exception → 500 generic INTERNAL_ERROR + trace'],
    failureScenarios: ['Service returns old shape — gateway optional normalize adapter during migration'],
    security: ['Strip SQL/constraints from messages'],
    observability: ['Dashboard top error codes; trace lookup in Jaeger'],
    bottlenecks: ['Org adoption — lint OpenAPI responses in CI'],
    alternatives: ['GraphQL unified errors array'],
    tradeoffs: ['Strict catalog vs service autonomy naming'],
    interviewFollowUps: ['Localize messages?', 'Retry mapping table for mobile?'],
    evolution: [
      { stage: '1. Simple design', description: 'Ad-hoc errors per service.', bottleneck: 'Client chaos.' },
      { stage: '2. Improve', description: 'Shared library exception mapper.', bottleneck: 'Drift still.' },
      { stage: '3. Improve', description: 'OpenAPI catalog + CI lint.', bottleneck: 'Legacy codes.' },
      { stage: '4. Scale further', description: 'Gateway normalization + trace everywhere.', bottleneck: 'Governance overhead.' },
    ],
  },
}
