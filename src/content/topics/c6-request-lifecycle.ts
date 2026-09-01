import type { TopicContent } from '@/domain/types'

export const requestLifecycleContent: TopicContent = {
  whatIsIt:
    'The Spring MVC request/response lifecycle: Servlet container receives HTTP → Filter chain → DispatcherServlet → HandlerMapping → HandlerInterceptor → Controller → HttpMessageConverter → response, with exception handling and view resolution (skipped for @RestController JSON).',
  whyExists:
    'Understanding ordering explains where auth, logging, validation, and errors apply — critical for debugging 404 vs 403, empty bodies, and filter/interceptor interaction.',
  mentalModel:
    'One thread per request (typically). Filters wrap everything servlet-level. DispatcherServlet is front controller — one servlet delegates to @Controller methods. Argument resolvers build method params; return value handlers serialize response. Errors bubble to HandlerExceptionResolver (@ControllerAdvice).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Tomcat/Jetty accepts connection; parses HTTP to HttpServletRequest.',
        'Filter chain (security, encoding, requestId) → chain.doFilter.',
        'DispatcherServlet.doDispatch → getHandler (RequestMappingHandlerMapping).',
        'HandlerExecutionChain: interceptors preHandle → invoke controller method.',
        'RequestResponseBodyMethodProcessor reads @RequestBody via Jackson.',
        'Return value → HttpMessageConverter writes JSON; interceptors afterCompletion.',
        'Uncaught exception → @ExceptionHandler in @ControllerAdvice.',
      ],
    },
  ],
  architecture: {
    mermaid: `sequenceDiagram
  participant C as Client
  participant F as Filters
  participant D as DispatcherServlet
  participant I as Interceptor
  participant Ctrl as Controller
  participant Conv as HttpMessageConverter
  C->>F: HTTP request
  F->>D: chain.doFilter
  D->>I: preHandle
  I->>Ctrl: invoke handler
  Ctrl->>Conv: return object
  Conv->>C: JSON response
  I->>I: afterCompletion`,
    caption: 'Simplified synchronous MVC request flow',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Tracing lifecycle hooks',
      code: `// 1. Filter: RequestIdFilter.doFilterInternal
// 2. SecurityFilterChain authenticates JWT
// 3. DispatcherServlet maps GET /api/v1/users/1
// 4. ApiTimingInterceptor.preHandle
// 5. UserController.get(@PathVariable Long id)
//    - PathVariableMethodArgumentResolver resolves id
// 6. UserService.findById → UserResponse
// 7. MappingJackson2HttpMessageConverter writes JSON
// 8. ApiTimingInterceptor.afterCompletion
// 9. Filters complete; response sent`,
    },
    {
      type: 'code',
      language: 'java',
      caption: '404 when no handler',
      code: `// GET /api/unknown → HandlerMapping returns null
// → DispatcherServlet throws NoHandlerFoundException
// → @ExceptionHandler or default 404`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'DispatcherServlet ONE per app mapped to / (Boot auto-config).',
        'HandlerAdapter (RequestMappingHandlerAdapter) invokes controller via reflection.',
        'ContentNegotiationManager picks converter by Accept/produces.',
        'Async: Callable return releases thread; AsyncContext completes later.',
        'Error dispatch: forward to /error handled by BasicErrorController (non-MVC errors).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Clear extension points at each layer',
      'Front controller pattern centralizes routing',
    ],
    disadvantages: [
      'Many moving parts — steep debugging curve',
      'Synchronous default blocks thread per request',
    ],
    alternatives: [
      'WebFlux reactive chain (EventLoop)',
      'Servlet-only without Spring MVC',
    ],
    whenToUse: [
      'Debugging request flow issues',
      'Choosing filter vs interceptor vs advice',
    ],
    whenNotToUse: [
      'Explaining browser-only fetch behavior (use client lifecycle instead)',
      'Reactive WebFlux apps where the event-loop model differs',
    ],
  },
  failureModes: [
    'Filter consumes InputStream — empty @RequestBody at controller.',
    'Interceptor preHandle false without response written.',
    'Wrong produces — 406 Not Acceptable.',
    'Exception before controller — interceptor afterCompletion still runs with ex.',
    'CORS preflight OPTIONS not mapped — 403 before controller.',
  ],
  production: {
    observability: ['Trace each phase with Micrometer http.server.requests'],
    performance: ['Keep filter/interceptor work minimal'],
  },
  interview: {
    expectations: [
      'Order: Filter → DispatcherServlet → Interceptor → Controller',
      'Role of HandlerMapping and HttpMessageConverter',
      'Where @ControllerAdvice fits',
    ],
    commonQuestions: [
      'Spring Boot request lifecycle?',
      'DispatcherServlet role?',
      'Filter vs Interceptor timing?',
    ],
    followUps: [
      'How @RequestBody bound?',
      'What happens on unhandled exception?',
    ],
    misconceptions: [
      'Controller invoked before filters',
      'Multiple DispatcherServlets per endpoint',
    ],
    traps: ['Cannot explain where security filter runs'],
    strongSignals: [
      'Sequence from servlet to JSON response',
      'HandlerMapping vs HandlerAdapter distinction',
      'Exception resolver after controller throw',
    ],
  },
  keyTakeaways: [
    'Filters → DispatcherServlet → Interceptors → Controller → Converter.',
    'DispatcherServlet = front controller.',
    'Jackson converts JSON ↔ objects.',
    '@ControllerAdvice after thrown exception.',
    '404 = no HandlerMapping match.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is DispatcherServlet?',
      answerHint: 'Front controller servlet delegating to @Controller handlers.',
    },
    {
      level: 'intermediate',
      question: 'Where does JSON deserialization happen?',
      answerHint: 'HttpMessageConverter (Jackson) via RequestResponseBodyMethodProcessor before method invoke.',
    },
    {
      level: 'advanced',
      question: 'Exception thrown in controller — what runs?',
      answerHint: 'postHandle skipped; afterCompletion with ex; HandlerExceptionResolver / @ControllerAdvice.',
    },
  ],
  flashcards: [
    { front: 'Front controller', back: 'DispatcherServlet' },
    { front: 'Before controller in MVC', back: 'HandlerInterceptor.preHandle' },
    { front: 'JSON binding', back: 'HttpMessageConverter + Jackson' },
  ],
  quickRevision: [
    'Filter chain first',
    'DispatcherServlet delegates',
    'HandlerMapping finds method',
    'Interceptor pre/post/afterCompletion',
    'MessageConverter JSON',
    'ControllerAdvice on exception',
    'Security in filter chain',
  ],
}

export const content = requestLifecycleContent
