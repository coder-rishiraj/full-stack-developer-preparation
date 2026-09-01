import type { TopicContent } from '@/domain/types'

export const httpMethodsContent: TopicContent = {
  whatIsIt:
    'HTTP methods (verbs) express the intent of a request on a resource: GET read, POST create/action, PUT replace, PATCH partial update, DELETE remove, HEAD metadata only, OPTIONS capabilities. REST APIs map CRUD to methods with correct idempotency and safety semantics.',
  whyExists:
    'Uniform method semantics let caches, proxies, and clients reason about retries and side effects. GET can be cached; DELETE retried safely if idempotent; POST signals non-idempotent creation.',
  mentalModel:
    'URL = noun (resource). Method = verb (action). GET/HEAD should not change server state (safe). PUT same PUT twice = same result (idempotent). POST twice may create two resources.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Method', 'Safe', 'Idempotent', 'Typical use'],
      rows: [
        ['GET', 'Yes', 'Yes', 'Read resource or collection'],
        ['HEAD', 'Yes', 'Yes', 'Headers only, no body'],
        ['POST', 'No', 'No', 'Create resource, commands, search'],
        ['PUT', 'No', 'Yes', 'Full replace of resource at URI'],
        ['PATCH', 'No', 'No*', 'Partial field update'],
        ['DELETE', 'No', 'Yes', 'Remove resource'],
        ['OPTIONS', 'Yes', 'Yes', 'CORS preflight, allowed methods'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Safe vs idempotent',
      text: 'Safe = no server state change intended (still may hit logs). Idempotent = multiple identical requests same effect as one (PUT, DELETE; POST is not).',
    },
    {
      type: 'list',
      items: [
        'POST to collection (/orders) creates; return 201 + Location.',
        'PUT to instance (/orders/42) replaces entire representation.',
        'PATCH with JSON Merge Patch or JSON Patch for partial updates.',
        'POST for non-CRUD actions (/payments/42/capture) when pragmatic.',
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'REST method mapping',
      code: `GET    /v1/users/42        → 200 user JSON
POST   /v1/users             → 201 Created Location: /v1/users/43
PUT    /v1/users/42          → 200 or 204 full replace
PATCH  /v1/users/42          → 200 partial {"name":"New"}
DELETE /v1/users/42          → 204 No Content`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring MVC annotations',
      code: `@RestController
@RequestMapping("/v1/users")
class UserController {
  @GetMapping("/{id}") User get(@PathVariable Long id) { ... }
  @PostMapping ResponseEntity<User> create(@RequestBody User u) { ... }
  @PutMapping("/{id}") User replace(@PathVariable Long id, @RequestBody User u) { ... }
  @PatchMapping("/{id}") User patch(@PathVariable Long id, @RequestBody Map<String,Object> p) { ... }
  @DeleteMapping("/{id}") @ResponseStatus(NO_CONTENT) void delete(@PathVariable Long id) { ... }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Browsers only allow GET/POST in forms; other methods via JS fetch/XHR.',
        'OPTIONS preflight for CORS sends Access-Control-Request-Method.',
        'CONNECT establishes tunnel (HTTPS proxy); TRACE rarely enabled.',
        'Idempotency-Key header pattern for safe POST retries (Stripe style).',
        'HTTP/2 and HTTP/3 carry same method semantics on streams.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Clear semantics for caching and retries',
      'Standard CRUD mapping understood by teams',
      'Tools (OpenAPI) document methods per path',
    ],
    disadvantages: [
      'PATCH semantics vary (merge vs JSON Patch)',
      'RPC-style actions awkward as pure REST',
      'Overloaded POST when teams avoid PUT/PATCH',
    ],
    alternatives: [
      'GraphQL mutations (single POST endpoint)',
      'gRPC with explicit RPC names',
      'Action sub-resources POST /resource/action',
    ],
    whenToUse: [
      'Resource-oriented public APIs',
      'Cacheable reads with GET',
      'Replace semantics with PUT',
    ],
    whenNotToUse: [
      'Complex queries — POST search body or GraphQL',
      'Forcing every operation into CRUD when action RPC clearer',
    ],
  },
  failureModes: [
    'GET with side effects (delete via query) — breaks caches.',
    'POST for reads — not cacheable, retry duplicates.',
    'PUT without full representation — clobbered fields null.',
    'Ignoring idempotency on payment POST retries.',
    'PATCH without concurrency control (ETag) → lost updates.',
  ],
  interview: {
    expectations: [
      'Define safe and idempotent correctly',
      'Map CRUD to HTTP methods',
      'When POST vs PUT vs PATCH',
    ],
    commonQuestions: [
      'GET vs POST?',
      'PUT vs PATCH?',
      'Which methods are idempotent?',
      'Is DELETE idempotent?',
    ],
    followUps: [
      'How retry POST safely?',
      'OPTIONS used for what?',
    ],
    misconceptions: [
      'GET never touches server (logging, analytics still run)',
      'PUT creates if not exists always (convention varies)',
      'PATCH is always idempotent',
    ],
    traps: ['Saying POST is never idempotent — can be designed with idempotency keys'],
    strongSignals: [
      'Separates safe from idempotent',
      'Mentions 201 Location on POST create',
      'Idempotency-Key for POST retries',
    ],
  },
  keyTakeaways: [
    'GET safe + idempotent; POST neither by default.',
    'PUT full replace idempotent; PATCH partial.',
    'DELETE idempotent (second delete 404 still ok).',
    'POST create → 201 + Location header.',
    'Use Idempotency-Key for retry-safe POST.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Difference between GET and POST?',
      answerHint: 'GET safe/idempotent read; POST non-idempotent, body for create/action.',
    },
    {
      level: 'intermediate',
      question: 'PUT vs PATCH?',
      answerHint: 'PUT replaces entire resource; PATCH partial update.',
    },
    {
      level: 'advanced',
      question: 'How make POST idempotent for payments?',
      answerHint: 'Client sends Idempotency-Key; server dedupes same key same result.',
    },
  ],
  flashcards: [
    { front: 'Safe methods', back: 'GET, HEAD, OPTIONS — no intended state change' },
    { front: 'Idempotent methods', back: 'GET, PUT, DELETE, HEAD, OPTIONS' },
    { front: 'POST create response', back: '201 Created + Location header' },
  ],
  quickRevision: [
    'GET read cacheable',
    'POST create not idempotent',
    'PUT full replace',
    'PATCH partial',
    'DELETE idempotent',
    'OPTIONS CORS preflight',
    'Idempotency-Key on POST',
  ],
}

export const content = httpMethodsContent
