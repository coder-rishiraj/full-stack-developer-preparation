import type { TopicContent } from '@/domain/types'

export const apiVersioningContent: TopicContent = {
  whatIsIt:
    'API versioning evolves REST contracts without breaking existing clients — common strategies: URI path (/api/v1/users), query param (?version=1), Accept header (application/vnd.api.v2+json), or custom header (X-API-Version).',
  whyExists:
    'Mobile apps and third-party integrations cannot deploy simultaneously with your server. Breaking field renames or behavior changes need parallel supported versions during migration windows.',
  mentalModel:
    'Same domain, multiple adapter layers or conditional mapping. v1 returns legacy shape; v2 adds fields or changes semantics. Deprecate v1 with Sunset header and metrics on usage. Prefer additive changes without version bump when possible.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'URI versioning: @RequestMapping("/api/v1/orders") separate controller or class-level prefix.',
        'Header versioning: custom HandlerMapping or @RequestMapping headers = "X-API-Version=2".',
        'Media type: produces = "application/vnd.company.v2+json" + content negotiation.',
        'Separate DTO packages per version — v1.UserResponse vs v2.UserResponse.',
        'Gateway can route /v1 vs /v2 to same service with version header injection.',
      ],
    },
    {
      type: 'table',
      headers: ['Strategy', 'Pros', 'Cons'],
      rows: [
        ['URI /v1/', 'Explicit, cacheable, easy routing', 'URL pollution, HATEOAS links change'],
        ['Header', 'Clean URLs', 'Harder to test in browser; cache complexity'],
        ['Media type', 'REST purist', 'Client Accept header discipline'],
        ['Query param', 'Simple toggle', 'Easy to omit; messy caches'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  ClientV1[Client v1] --> R1["/api/v1/users"]
  ClientV2[Client v2] --> R2["/api/v2/users"]
  R1 --> Svc[Shared UserService]
  R2 --> Svc
  R1 --> DTO1[UserResponseV1]
  R2 --> DTO2[UserResponseV2]`,
    caption: 'Versioned controllers share core service logic',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'URI-based versioned controllers',
      code: `@RestController
@RequestMapping("/api/v1/users")
public class UserControllerV1 {
  private final UserService userService;

  @GetMapping("/{id}")
  public UserResponseV1 get(@PathVariable Long id) {
    return UserResponseV1.from(userService.findById(id));
  }
}

@RestController
@RequestMapping("/api/v2/users")
public class UserControllerV2 {
  @GetMapping("/{id}")
  public UserResponseV2 get(@PathVariable Long id) {
    return UserResponseV2.from(userService.findById(id));
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Header-based mapping',
      code: `@GetMapping(value = "/users/{id}", headers = "X-API-Version=2")
public UserResponseV2 getV2(@PathVariable Long id) { ... }

@GetMapping(value = "/users/{id}", headers = "X-API-Version=1")
public UserResponseV1 getV1(@PathVariable Long id) { ... }`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'RequestMappingHandlerMapping matches version predicates with other conditions.',
        'Springdoc OpenAPI can document multiple grouped APIs per version.',
        'Deprecation: @Deprecated on controller + Warning response header.',
        'Compatibility tests: contract tests per version (Pact).',
        'Breaking vs non-breaking: adding optional JSON field usually safe; removing/renaming is breaking.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Safe parallel client migration',
      'Clear support boundaries',
    ],
    disadvantages: [
      'Multiple controllers/DTOs to maintain',
      'Version sprawl if every change bumps version',
    ],
    alternatives: [
      'Additive-only API evolution (nullable fields)',
      'GraphQL field selection',
      'Feature flags for behavior not shape',
    ],
    whenToUse: [
      'Breaking changes with external clients',
      'Mobile apps with slow upgrade cycles',
    ],
    whenNotToUse: [
      'Internal-only API deployed together',
      'Purely additive optional fields',
    ],
  },
  failureModes: [
    'Two versions diverge business logic — bugs fixed only in v2.',
    'No sunset plan — v1 maintained forever.',
    'Default version ambiguous when header omitted.',
    'Caching CDN ignores Vary header — wrong version served.',
    'Same URL different versions without negotiation — collision.',
  ],
  production: {
    observability: ['Metrics per version: requests, errors, latency'],
    maintainability: ['Shared service layer; version only in web/DTO layer'],
  },
  interview: {
    expectations: [
      'Compare URI vs header versioning',
      'What constitutes breaking change',
      'Deprecation strategy',
    ],
    commonQuestions: [
      'How version REST APIs in Spring?',
      'URI vs header pros/cons?',
      'Breaking vs non-breaking change examples?',
    ],
    followUps: [
      'How long support old version?',
      'OpenAPI multi-version docs?',
    ],
    misconceptions: [
      'Every API change needs new version',
      'Version in body JSON is sufficient',
    ],
    traps: ['Duplicating entire service per version instead of DTO mapping'],
    strongSignals: [
      'Shared service, versioned DTOs/controllers only',
      'Sunset/deprecation headers',
      'Prefer additive changes first',
    ],
  },
  keyTakeaways: [
    'URI /api/v1 most common in Spring — explicit and simple.',
    'Version at boundary — share service logic.',
    'Breaking: remove/rename field, change semantics.',
    'Deprecate old versions with metrics + timeline.',
    'Additive optional fields often avoid new version.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Common API versioning approaches?',
      answerHint: 'URI path, header, Accept media type, query param.',
    },
    {
      level: 'intermediate',
      question: 'Breaking change example?',
      answerHint: 'Remove field, rename field, change type, change error codes.',
    },
    {
      level: 'advanced',
      question: 'Implement without duplicating business logic?',
      answerHint: 'Versioned controllers/DTOs map to shared @Service domain layer.',
    },
  ],
  flashcards: [
    { front: 'Most common Spring versioning', back: 'URI prefix /api/v1' },
    { front: 'Non-breaking change', back: 'Add optional nullable JSON field' },
    { front: 'Version sprawl risk', back: 'Maintaining many parallel DTOs/controllers' },
  ],
  quickRevision: [
    '/api/v1 URI common',
    'Shared service core',
    'Versioned DTOs only',
    'Breaking vs additive',
    'Deprecation + metrics',
    'Header needs Vary/cache care',
    'Contract tests per version',
  ],
}

export const content = apiVersioningContent
