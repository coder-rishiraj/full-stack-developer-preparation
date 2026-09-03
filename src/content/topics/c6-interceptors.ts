import type { TopicContent } from '@/domain/types'

export const interceptorsContent: TopicContent = {
  whatIsIt:
    'HandlerInterceptor is a Spring MVC hook with preHandle, postHandle, and afterCompletion callbacks around controller execution — registered via WebMvcConfigurer.addInterceptors for logging, auth checks needing HandlerMethod, tenant context, and timing.',
  whyExists:
    'Filters lack access to which @Controller method will run. Interceptors sit after HandlerMapping resolves the handler but before/after controller invocation — ideal for per-endpoint metrics, @PreAuthorize-adjacent checks, and loading user context into ThreadLocal for the request.',
  mentalModel:
    'DispatcherServlet → HandlerMapping finds handler → Interceptor.preHandle (false = stop, no controller) → Controller → postHandle (view phase, less used in REST) → afterCompletion (always, even on exception). Order multiple interceptors via registry order.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Implement HandlerInterceptor directly; HandlerInterceptorAdapter is obsolete migration knowledge.',
        'WebMvcConfigurer.addInterceptors: registry.addInterceptor(new TimingInterceptor()).addPathPatterns("/api/**").excludePathPatterns("/actuator/**").',
        'preHandle: return false to abort — write response directly.',
        'afterCompletion: cleanup ThreadLocal, log duration; receives exception if thrown.',
        'RequestContextHolder.currentRequestAttributes() for request access in downstream code.',
      ],
    },
  ],
  architecture: {
    mermaid: `flowchart LR
  DS[DispatcherServlet] --> Map[HandlerMapping]
  Map --> Pre[preHandle]
  Pre -->|true| Ctrl[Controller]
  Pre -->|false| Stop[Stop — no controller]
  Ctrl --> Post[postHandle]
  Post --> Done[afterCompletion]`,
    caption: 'Interceptor wraps handler invocation only',
  },
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Timing and auth interceptor',
      code: `@Component
public class ApiTimingInterceptor implements HandlerInterceptor {
  private static final String START = "startTime";

  @Override
  public boolean preHandle(HttpServletRequest req, HttpServletResponse res,
                           Object handler) {
    req.setAttribute(START, System.currentTimeMillis());
    if (handler instanceof HandlerMethod hm) {
      // optional: inspect annotations on hm.getMethod()
    }
    return true;
  }

  @Override
  public void afterCompletion(HttpServletRequest req, HttpServletResponse res,
                              Object handler, Exception ex) {
    Long start = (Long) req.getAttribute(START);
    if (start != null) {
      log.info("{} {} {}ms", req.getMethod(), req.getRequestURI(),
          System.currentTimeMillis() - start);
    }
  }
}`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Register interceptors',
      code: `@Configuration
public class WebConfig implements WebMvcConfigurer {
  private final ApiTimingInterceptor timingInterceptor;

  public WebConfig(ApiTimingInterceptor timingInterceptor) {
    this.timingInterceptor = timingInterceptor;
  }

  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(timingInterceptor)
        .addPathPatterns("/api/**")
        .excludePathPatterns("/api/public/**");
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'DispatcherServlet invokes HandlerExecutionChain (handler + interceptors).',
        'postHandle runs after controller, before view render — rarely used with @RestController.',
        'MappedInterceptor bean wraps path patterns for XML config legacy.',
        'Async requests: AsyncHandlerInterceptor + afterConcurrentHandlingStarted.',
        'Not invoked for resource handlers unless path matches — static files may skip.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Access to HandlerMethod and Spring MVC context',
      'Path include/exclude patterns',
      'afterCompletion for reliable cleanup',
    ],
    disadvantages: [
      'Only Spring MVC mapped requests — not all servlet traffic',
      'ThreadLocal tenant context must clear in afterCompletion',
    ],
    alternatives: [
      'Servlet Filter for servlet-wide concerns',
      'AOP @Around on controller methods',
      'Spring Security method security',
    ],
    whenToUse: [
      'Per-API timing and audit',
      'Tenant ID from header into context',
      'Handler annotation inspection',
    ],
    whenNotToUse: [
      'JWT validation for all resources — Filter or Security',
      'Exception mapping — @ControllerAdvice',
    ],
  },
  failureModes: [
    'ThreadLocal tenant not cleared — pool thread leak to next request.',
    'preHandle returns false without writing response — blank 200/403 confusion.',
    'Interceptor not registered — silent no-op.',
    'Blocking preHandle on DB call — latency on every request.',
    'Assuming interceptor runs on @Async controller thread — afterCompletion on original request thread.',
  ],
  production: {
    observability: ['Latency metrics in afterCompletion tagged by handler'],
    maintainability: ['Exclude actuator/health from heavy interceptors'],
  },
  interview: {
    expectations: [
      'Three callback methods and when they run',
      'Filter vs Interceptor decision',
      'Registration via WebMvcConfigurer',
    ],
    commonQuestions: [
      'HandlerInterceptor lifecycle?',
      'preHandle return false effect?',
      'Filter vs Interceptor?',
    ],
    followUps: [
      'ThreadLocal cleanup pattern?',
      'Intercept static resources?',
    ],
    misconceptions: [
      'postHandle always runs on exception (afterCompletion does, postHandle may not)',
      'Interceptors replace Spring Security',
    ],
    traps: ['Leaving ThreadLocal set without afterCompletion cleanup'],
    strongSignals: [
      'HandlerMethod instanceof check',
      'excludePathPatterns for actuator',
      'afterCompletion for cleanup/metrics',
    ],
  },
  keyTakeaways: [
    'Interceptor wraps Spring MVC handler only.',
    'preHandle → controller → postHandle → afterCompletion.',
    'Return false in preHandle aborts chain.',
    'Register in WebMvcConfigurer.addInterceptors.',
    'Clear ThreadLocal in afterCompletion.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When does afterCompletion run?',
      answerHint: 'After full request processing, even if controller threw exception.',
    },
    {
      level: 'intermediate',
      question: 'Why use Interceptor over Filter for timing per controller?',
      answerHint: 'Access HandlerMethod; only MVC mapped paths; exclude patterns.',
    },
    {
      level: 'advanced',
      question: 'Async request interceptor caveat?',
      answerHint: 'Use AsyncHandlerInterceptor; thread may differ after async start.',
    },
  ],
  flashcards: [
    { front: 'preHandle false', back: 'Abort — controller not invoked' },
    { front: 'Register interceptors', back: 'WebMvcConfigurer.addInterceptors' },
    { front: 'Cleanup hook', back: 'afterCompletion — always runs' },
  ],
  quickRevision: [
    'HandlerInterceptor 3 phases',
    'After HandlerMapping',
    'WebMvcConfigurer registry',
    'path include/exclude',
    'ThreadLocal → afterCompletion',
    'HandlerMethod access',
    'Not for all servlet paths',
  ],
}

export const content = interceptorsContent
