import type { TopicContent } from '@/domain/types'

export const filtersContent: TopicContent = {
  whatIsIt:
    'Servlet Filters are chain-of-responsibility components that wrap the request/response pipeline before DispatcherServlet — implementing jakarta.servlet.Filter (or Spring OncePerRequestFilter) for cross-cutting concerns: auth tokens, logging, CORS, compression.',
  whyExists:
    'Some concerns apply to all requests including static resources and non-MVC endpoints — before Spring sees the request. Filters run at Servlet container level; ideal for security headers, request ID assignment, and body caching for logging.',
  mentalModel:
    'HTTP hits Tomcat → FilterChain (ordered filters) each calls chain.doFilter(request, response) → finally DispatcherServlet → controller. Filter can short-circuit (send 401, return without chain.doFilter). Order matters — security filters early.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Implement Filter or extend OncePerRequestFilter (guarantees once per dispatch).',
        'Register: @Component + @Order, FilterRegistrationBean, or Spring Security filter chain.',
        'doFilter: wrap request/response (ContentCachingRequestWrapper), mutate headers, or validate.',
        'Spring Security is a stack of filters (UsernamePasswordAuthenticationFilter, etc.).',
        'Filter vs Interceptor: Filter is Servlet API; Interceptor is Spring MVC after DispatcherServlet.',
      ],
    },
    {
      type: 'table',
      headers: ['Layer', 'Scope', 'Example'],
      rows: [
        ['Filter', 'All servlet requests', 'JWT parse, MDC requestId'],
        ['HandlerInterceptor', 'Spring MVC handlers only', 'Timing, user context'],
        ['ControllerAdvice', 'After handler throws', 'Exception JSON'],
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart TB
  Client[Client] --> F1[Filter 1]
  F1 --> F2[Filter 2]
  F2 --> DS[DispatcherServlet]
  DS --> IC[Interceptors]
  IC --> Ctrl[Controller]`,
    caption: 'Filters wrap entire servlet request; interceptors inside MVC',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Request ID filter with OncePerRequestFilter',
      code: `@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
public class RequestIdFilter extends OncePerRequestFilter {
  private static final String HEADER = "X-Request-Id";

  @Override
  protected void doFilterInternal(HttpServletRequest req,
                                  HttpServletResponse res,
                                  FilterChain chain)
      throws ServletException, IOException {
    String requestId = Optional.ofNullable(req.getHeader(HEADER))
        .filter(s -> !s.isBlank())
        .orElse(UUID.randomUUID().toString());
    MDC.put("requestId", requestId);
    res.setHeader(HEADER, requestId);
    try {
      chain.doFilter(req, res);
    } finally {
      MDC.remove("requestId");
    }
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Explicit FilterRegistrationBean with order',
      code: `@Configuration
public class FilterConfig {
  @Bean
  public FilterRegistrationBean<AuthFilter> authFilter() {
    var bean = new FilterRegistrationBean<>(new AuthFilter());
    bean.setOrder(1);
    bean.addUrlPatterns("/api/*");
    return bean;
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'StandardServletMultipartResolver runs after security filters.',
        'CharacterEncodingFilter sets UTF-8 early in Boot auto-config.',
        'FilterRegistrationBean controls urlPatterns, order, dispatcherTypes.',
        'Async requests: OncePerRequestFilter prevents double execution on forward/include.',
        'Spring Security FilterChainProxy delegates to ordered SecurityFilterChain beans.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Applies to all servlet traffic',
      'Early rejection saves controller work',
      'Standard Servlet API — portable',
    ],
    disadvantages: [
      'No access to HandlerMethod — only HttpServletRequest',
      'Order conflicts hard to debug',
      'Testing requires MockMvc or TestRestTemplate with filter chain',
    ],
    alternatives: [
      'HandlerInterceptor for MVC-specific pre/post around handler',
      'Spring Security for auth/authz',
      'Gateway filters (API gateway layer)',
    ],
    whenToUse: [
      'Request ID, MDC logging, encoding',
      'JWT extraction before Spring Security',
      'Wrapping request to cache body for audit log',
    ],
    whenNotToUse: [
      'Post-controller logic — use @ControllerAdvice or Interceptor afterCompletion',
      'Business validation — controller/service',
    ],
  },
  failureModes: [
    'Forgot chain.doFilter — request hangs or returns empty.',
    'Filter runs twice without OncePerRequestFilter on forwards.',
    'Wrong @Order — auth after controller somehow (security misconfig).',
    'Reading InputStream consumes body — controller gets empty @RequestBody.',
    'Filter blocking thread on external call — use async filter carefully.',
  ],
  production: {
    observability: ['MDC requestId in filter for all log lines'],
    security: ['Security headers filter; rate limit at edge or filter'],
    performance: ['Minimal work in filter — defer heavy logic to async'],
  },
  interview: {
    expectations: [
      'Filter vs Interceptor vs ControllerAdvice',
      'Filter chain order and OncePerRequestFilter',
      'Where JWT parsing typically lives',
    ],
    commonQuestions: [
      'Difference Filter and Interceptor?',
      'How register custom filter in Boot?',
      'Spring Security filter chain?',
    ],
    followUps: [
      'ContentCachingRequestWrapper use case?',
      'Filter order with Security?',
    ],
    misconceptions: [
      'Filters can inject controller dependencies easily before context ready',
      'Interceptor runs before Filter',
      '@Component Filter always applies to /api only without urlPatterns',
    ],
    traps: ['Using filter for business validation needing service beans awkwardly'],
    strongSignals: [
      'OncePerRequestFilter + MDC + finally cleanup',
      'FilterRegistrationBean for url patterns',
      'Clear Filter vs Interceptor boundary',
    ],
  },
  keyTakeaways: [
    'Filter = Servlet-level, before DispatcherServlet.',
    'OncePerRequestFilter for safe single execution.',
    '@Order / FilterRegistrationBean controls chain.',
    'Security is filter-based.',
    'Use Interceptor when you need HandlerMethod access.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Filter vs Interceptor?',
      answerHint: 'Filter servlet-wide before MVC; Interceptor around Spring handler only.',
    },
    {
      level: 'intermediate',
      question: 'Why OncePerRequestFilter?',
      answerHint: 'Ensures filter logic runs once per request despite forwards/includes.',
    },
    {
      level: 'advanced',
      question: 'Log request body without breaking controller?',
      answerHint: 'ContentCachingRequestWrapper in filter; read cache after chain.doFilter.',
    },
  ],
  flashcards: [
    { front: 'Filter position', back: 'Before DispatcherServlet in servlet chain' },
    { front: 'Must call', back: 'chain.doFilter to continue pipeline' },
    { front: 'OncePerRequestFilter', back: 'Prevents double execution on dispatch' },
  ],
  quickRevision: [
    'Servlet Filter chain',
    'Before DispatcherServlet',
    'OncePerRequestFilter',
    '@Order matters',
    'MDC in filter',
    'Security = filters',
    'Interceptor for HandlerMethod',
  ],
}

export const content = filtersContent
