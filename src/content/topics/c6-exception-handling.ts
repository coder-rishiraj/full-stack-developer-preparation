import type { TopicContent } from '@/domain/types'

export const exceptionHandlingContent: TopicContent = {
  whatIsIt:
    'Global exception handling in Spring MVC uses @ControllerAdvice + @ExceptionHandler (or ResponseEntityExceptionHandler / ProblemDetail) to map thrown exceptions to consistent HTTP status codes and JSON error bodies across all controllers.',
  whyExists:
    'Try/catch in every controller duplicates logic and returns inconsistent error shapes. Central handling ensures 404/400/409/500 map correctly, logs once, hides stack traces from clients, and supports RFC 7807 Problem Details.',
  mentalModel:
    'Controller throws DomainNotFoundException → propagates uncaught → DispatcherServlet asks HandlerExceptionResolver chain → @ExceptionHandler method in @ControllerAdvice matches type → returns ResponseEntity or ProblemDetail → client gets stable JSON.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        '@ControllerAdvice — global @ExceptionHandler methods (scoped by basePackages optional).',
        '@ExceptionHandler(SomeException.class) method receives exception + WebRequest.',
        'Extend ResponseEntityExceptionHandler for Spring MVC built-in exceptions.',
        'Spring 6+ ProblemDetail for RFC 7807 (type, title, status, detail, instance).',
        'Order: closest matching handler; @Order on advice beans for precedence.',
      ],
    },
    {
      type: 'table',
      headers: ['Exception', 'Typical status', 'When'],
      rows: [
        ['MethodArgumentNotValidException', '400', 'Validation failed'],
        ['EntityNotFoundException', '404', 'Resource missing'],
        ['AccessDeniedException', '403', 'Authorization failed'],
        ['DataIntegrityViolationException', '409', 'Unique constraint'],
        ['Exception (fallback)', '500', 'Unexpected — log, generic message'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Ctrl[Controller throws] --> DS[DispatcherServlet]
  DS --> Resolver[ExceptionHandlerExceptionResolver]
  Resolver --> Advice[@ControllerAdvice]
  Advice --> JSON[JSON ProblemDetail / ErrorResponse]`,
    caption: 'Centralized exception → HTTP response mapping',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: '@ControllerAdvice with ProblemDetail',
      code: `@ControllerAdvice
public class GlobalExceptionHandler {

  @ExceptionHandler(ResourceNotFoundException.class)
  public ProblemDetail handleNotFound(ResourceNotFoundException ex) {
    return ProblemDetail.forStatusAndDetail(NOT_FOUND, ex.getMessage());
  }

  @ExceptionHandler(MethodArgumentNotValidException.class)
  public ProblemDetail handleValidation(MethodArgumentNotValidException ex) {
    var pd = ProblemDetail.forStatus(BAD_REQUEST);
    pd.setTitle("Validation failed");
    pd.setProperty("errors", ex.getBindingResult().getFieldErrors().stream()
        .map(e -> Map.of("field", e.getField(), "message", e.getDefaultMessage()))
        .toList());
    return pd;
  }

  @ExceptionHandler(Exception.class)
  public ProblemDetail handleUnexpected(Exception ex) {
    log.error("Unhandled", ex);
    return ProblemDetail.forStatusAndDetail(
        INTERNAL_SERVER_ERROR, "An unexpected error occurred");
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Domain exception',
      code: `public class ResourceNotFoundException extends RuntimeException {
  public ResourceNotFoundException(String resource, Object id) {
    super("%s not found: %s".formatted(resource, id));
  }
}

// service
public User findById(Long id) {
  return userRepository.findById(id)
      .orElseThrow(() -> new ResourceNotFoundException("User", id));
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'ExceptionHandlerExceptionResolver invokes @ExceptionHandler methods via InvocableHandlerMethod.',
        '@RestControllerAdvice = @ControllerAdvice + @ResponseBody on handlers.',
        'ErrorController handles /error path for non-MVC errors (Whitelabel).',
        'SecurityExceptionHandlerFilterChain handles some security exceptions before MVC.',
        'Reactive: @ControllerAdvice works similarly in WebFlux.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Consistent API error contract',
      'DRY — one place for logging/metrics',
      'Security — no stack trace leakage',
    ],
    disadvantages: [
      'Over-broad @ExceptionHandler(Exception.class) can swallow intended propagation',
      'Multiple @ControllerAdvice need clear @Order',
    ],
    alternatives: [
      'ResponseStatusException thrown from controllers (ad hoc)',
      'Either/Result types (non-idiomatic in Spring MVC)',
    ],
    whenToUse: [
      'All REST APIs with structured errors',
      'Domain-specific exceptions mapped to 4xx',
    ],
    whenNotToUse: [
      'Expected control flow — use Optional or result types in service',
    ],
  },
  failureModes: [
    'Returning entity in handler without @ResponseBody — wrong content type.',
    'Logging same exception twice (controller + advice).',
    '404 handler catches too broad Exception superclass.',
    'Leaking SQL/constraint details in 500 response.',
    'Missing handler for MethodArgumentNotValidException — ugly default HTML.',
  ],
  production: {
    observability: ['Log 5xx with correlation ID; metric counter by exception type'],
    security: ['Generic client message on 500; detail only in logs'],
    maintainability: ['Stable error code/type field for client branching'],
  },
  interview: {
    expectations: [
      '@ControllerAdvice + @ExceptionHandler flow',
      'Validation error handling',
      '404 vs 400 domain design',
    ],
    commonQuestions: [
      'How handle exceptions globally in Spring?',
      'Return field validation errors?',
      '@ControllerAdvice vs try/catch?',
    ],
    followUps: [
      'ProblemDetail RFC 7807?',
      'Multiple ControllerAdvice ordering?',
    ],
    misconceptions: [
      '@ExceptionHandler on controller applies globally',
      'All exceptions should return 500',
    ],
    traps: ['Exposing exception.getMessage() from SQL exceptions to client'],
    strongSignals: [
      'Domain exceptions + ProblemDetail',
      'Separate validation error structure',
      'Safe 500 fallback with logging',
    ],
  },
  keyTakeaways: [
    '@RestControllerAdvice centralizes exception mapping.',
    'Domain exceptions → 4xx; unknown → 500 + log.',
    'MethodArgumentNotValidException → 400 field errors.',
    'ProblemDetail for standard error JSON.',
    'Never leak stack traces or SQL to clients.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is @ControllerAdvice?',
      answerHint: 'Global component for @ExceptionHandler and @ModelAttribute across controllers.',
    },
    {
      level: 'intermediate',
      question: 'How return 404 for missing resource?',
      answerHint: 'Throw custom not-found exception; @ExceptionHandler returns ProblemDetail/404.',
    },
    {
      level: 'advanced',
      question: 'Handler resolution order with multiple advices?',
      answerHint: '@Order on @ControllerAdvice; most specific exception type wins.',
    },
  ],
  flashcards: [
    { front: '@RestControllerAdvice', back: '@ControllerAdvice + @ResponseBody on handlers' },
    { front: 'Validation exception', back: 'MethodArgumentNotValidException → 400' },
    { front: 'ProblemDetail', back: 'RFC 7807 structured error body' },
  ],
  quickRevision: [
    '@RestControllerAdvice',
    '@ExceptionHandler per type',
    'Domain exceptions',
    '400 validation errors',
    '500 log not leak',
    'ProblemDetail JSON',
    'ResponseEntityExceptionHandler base',
  ],
}

export const content = exceptionHandlingContent
