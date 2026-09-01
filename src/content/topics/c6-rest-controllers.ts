import type { TopicContent } from '@/domain/types'

export const restControllersContent: TopicContent = {
  whatIsIt:
    '@RestController combines @Controller and @ResponseBody — Spring MVC handlers that map HTTP requests to Java methods and serialize return values directly to JSON/XML (via HttpMessageConverter, default Jackson) without view resolution.',
  whyExists:
    'REST APIs need thin HTTP adapters over business logic. Annotated mapping methods (@GetMapping, @PostMapping) declaratively bind paths, params, headers, and bodies — replacing manual Servlet parsing and keeping web layer separate from services.',
  mentalModel:
    'DispatcherServlet routes URI + method to @RequestMapping handler. Method params resolved by HandlerMethodArgumentResolver (@PathVariable, @RequestBody). Return value written by RequestResponseBodyMethodProcessor through MappingJackson2HttpMessageConverter. Controllers delegate to @Service immediately.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        '@RequestMapping base path on class; HTTP verb mappings on methods.',
        '@PathVariable extracts URI segments; @RequestParam query; @RequestHeader optional.',
        '@RequestBody deserializes JSON body; @Valid triggers Bean Validation.',
        'ResponseEntity<T> controls status, headers, body; or implicit 200 with return object.',
        'produces/consumes MediaType negotiation; 415 if unsupported.',
      ],
    },
    {
      type: 'table',
      headers: ['Annotation', 'Maps', 'Example'],
      rows: [
        ['@GetMapping', 'HTTP GET', 'List resources'],
        ['@PostMapping', 'HTTP POST', 'Create — 201 + Location'],
        ['@PutMapping', 'HTTP PUT', 'Full replace'],
        ['@PatchMapping', 'HTTP PATCH', 'Partial update'],
        ['@DeleteMapping', 'HTTP DELETE', 'Remove resource'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  Client[HTTP client] --> DS[DispatcherServlet]
  DS --> HM[HandlerMapping → Controller method]
  HM --> Svc[Service layer]
  Svc --> HM
  HM --> Conv[Jackson HttpMessageConverter]
  Conv --> Client`,
    caption: 'Controller adapts HTTP ↔ service calls',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'CRUD REST controller',
      code: `@RestController
@RequestMapping("/api/v1/users")
public class UserController {
  private final UserService userService;

  public UserController(UserService userService) {
    this.userService = userService;
  }

  @GetMapping("/{id}")
  public UserResponse get(@PathVariable Long id) {
    return userService.findById(id);
  }

  @PostMapping
  public ResponseEntity<UserResponse> create(@Valid @RequestBody CreateUserRequest req) {
    var created = userService.create(req);
    URI location = URI.create("/api/v1/users/" + created.id());
    return ResponseEntity.created(location).body(created);
  }

  @DeleteMapping("/{id}")
  @ResponseStatus(HttpStatus.NO_CONTENT)
  public void delete(@PathVariable Long id) {
    userService.delete(id);
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Query params and pagination',
      code: `@GetMapping
public Page<UserResponse> list(
    @RequestParam(defaultValue = "0") int page,
    @RequestParam(defaultValue = "20") int size,
    @RequestParam(required = false) String q) {
  return userService.search(q, PageRequest.of(page, size));
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'RequestMappingHandlerMapping registers @RequestMapping info at startup.',
        'Content negotiation: Accept header + produces attribute select converter.',
        'Optional @ControllerAdvice handles exceptions globally — not in controller.',
        'CORS: @CrossOrigin or WebMvcConfigurer.addCorsMappings.',
        'Async: Callable/DeferredResult/WebFlux for non-blocking (MVC async).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Declarative routing and binding',
      'Automatic JSON serialization',
      'Integrates validation and exception handling',
    ],
    disadvantages: [
      'Fat controllers if business logic not delegated',
      'Annotation-heavy — behavior spread across attributes',
    ],
    alternatives: [
      'Spring WebFlux functional endpoints (RouterFunction)',
      'JAX-RS (Jersey) — less idiomatic in Boot',
    ],
    whenToUse: [
      'Synchronous REST APIs in Spring MVC',
      'Standard CRUD + search endpoints',
    ],
    whenNotToUse: [
      'Server-rendered HTML — use @Controller + view names',
      'High-concurrency streaming — consider WebFlux',
    ],
  },
  failureModes: [
    'Missing @RestController — returns view name string as response body.',
    'GET with @RequestBody — unsupported by some clients/caches.',
    'No @Valid — invalid input reaches service layer.',
    'Business logic in controller — untestable, duplicate across endpoints.',
    'Wrong HTTP verb semantics (POST for idempotent updates).',
    '404 vs 400 confusion on missing resource.',
  ],
  production: {
    performance: ['Keep controllers thin; no DB access directly'],
    security: ['Authorize at method or HTTP security layer, not ad hoc in controller'],
    maintainability: ['Consistent URL versioning /api/v1', 'DTOs not entities in responses'],
  },
  interview: {
    expectations: [
      '@RestController vs @Controller',
      'PathVariable, RequestBody, ResponseEntity usage',
      'HTTP status codes for create/delete',
    ],
    commonQuestions: [
      'Difference @RestController and @Controller?',
      'How bind JSON body?',
      'Return 201 Created with Location?',
    ],
    followUps: [
      'Content negotiation flow?',
      'How validation errors returned?',
    ],
    misconceptions: [
      '@RestController returns HTML views',
      'Controller should call repository directly',
      'All errors handled in try/catch per method',
    ],
    traps: ['Returning JPA entity with lazy collections → serialization error or N+1'],
    strongSignals: [
      'ResponseEntity.created for POST',
      '@Valid on request DTOs',
      'Delegates to service layer',
    ],
  },
  keyTakeaways: [
    '@RestController = @Controller + @ResponseBody JSON APIs.',
    'Map verbs and paths; delegate to @Service.',
    'ResponseEntity for status/headers; @ResponseStatus for void.',
    'Never expose entities — use DTOs.',
    '@ControllerAdvice for errors, not try/catch everywhere.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does @RestController do?',
      answerHint: 'Stereotype for REST; return values serialized to response body (JSON).',
    },
    {
      level: 'intermediate',
      question: 'How return 404 for missing user?',
      answerHint: 'Throw exception handled by @ControllerAdvice or ResponseEntity.notFound().',
    },
    {
      level: 'advanced',
      question: 'HttpMessageConverter role?',
      answerHint: 'Converts request/response body to/from Java types; Jackson for JSON.',
    },
  ],
  flashcards: [
    { front: '@RestController', back: '@Controller + @ResponseBody' },
    { front: 'POST create status', back: '201 Created + Location header' },
    { front: '@RequestBody binding', back: 'Jackson deserializes JSON to Java object' },
  ],
  quickRevision: [
    'Thin controllers → service',
    'DTOs in/out',
    '@Valid on body',
    'ResponseEntity for control',
    '201 + Location on create',
    '204 on delete',
    '@ControllerAdvice errors',
  ],
}

export const content = restControllersContent
