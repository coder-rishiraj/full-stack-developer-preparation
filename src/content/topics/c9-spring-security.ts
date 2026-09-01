import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Spring Security is the de facto security framework for Spring apps. Provides filter chain for authentication (form, HTTP Basic, JWT OAuth2 Resource Server), authorization (URL rules, method security), CSRF, CORS integration, password encoding, and session management. Configured via SecurityFilterChain beans in Spring Boot 3.',
  whyExists:
    'Security bugs are easy without a framework — wrong filter order, missing CSRF, inconsistent authZ. Spring Security centralizes patterns, integrates with Servlet/Jakarta filters, OAuth2, and method-level @PreAuthorize so teams apply defense consistently.',
  mentalModel:
    'Request passes through ordered security filters before your controller. Authentication establishes SecurityContext (who). Authorization checks roles/scopes (allowed). Default deny for protected routes. Customize chains for actuator vs API vs admin.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Filter chain (simplified)',
      diagram: `flowchart LR
  REQ[HTTP Request] --> CSRF[CsrfFilter]
  CSRF --> AUTH[JwtAuthFilter]
  AUTH --> AUTHZ[AuthorizationFilter]
  AUTHZ --> CTRL[Controller]
  AUTHZ -->|403| DENY[Access Denied]`,
    },
    {
      type: 'table',
      headers: ['Feature', 'Configuration', 'Notes'],
      rows: [
        ['JWT Resource Server', 'oauth2ResourceServer().jwt()', 'Validate Bearer tokens'],
        ['Form login', 'formLogin()', 'Session + CSRF for MVC'],
        ['Method security', '@EnableMethodSecurity + @PreAuthorize', 'After authentication'],
        ['CSRF', 'csrf() — disable only for stateless token APIs', 'Cookie + header/token pattern for SPAs'],
        ['CORS', 'cors() or WebMvcConfigurer', 'Separate from authZ'],
        ['Password', 'PasswordEncoder bean', 'BCrypt/Argon2'],
      ],
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Typical REST API SecurityFilterChain',
      code: `@Bean
SecurityFilterChain security(HttpSecurity http) throws Exception {
  return http
      .csrf(csrf -> csrf.disable()) // stateless JWT API only
      .sessionManagement(s -> s.sessionCreationPolicy(STATELESS))
      .oauth2ResourceServer(o -> o.jwt(Customizer.withDefaults()))
      .authorizeHttpRequests(a -> a
          .requestMatchers("/actuator/health").permitAll()
          .requestMatchers("/admin/**").hasRole("ADMIN")
          .anyRequest().authenticated())
      .build();
}`,
    },
  ],
  example: [
    {
      type: 'paragraph',
      text: 'Public health check permitted; admin routes require ROLE_ADMIN; all other API routes need valid JWT. JwtAuthenticationConverter maps scope claim to authorities for @PreAuthorize checks.',
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'SecurityContextHolder ThreadLocal — cleared after request',
        'Multiple SecurityFilterChain beans with @Order for different path matchers',
        'AuthenticationManager delegates to AuthenticationProvider',
        'AccessDecisionManager evaluates ConfigAttributes vs Authentication',
        'OAuth2 login vs Resource Server — different use cases (login redirect vs API validation)',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Battle-tested defaults', 'Deep Spring integration', 'OAuth2/JWT first-class'],
    disadvantages: ['Steep learning curve', 'Misconfiguration common', 'Verbose error messages if mis-debugged'],
    alternatives: ['Container-managed security', 'Manual filters (not recommended)', 'Quarkus Security'],
    whenToUse: ['All Spring Boot web apps'],
    whenNotToUse: ['Non-Spring stacks'],
  },
  failureModes: [
    'permitAll() on /** by mistake during dev shipped to prod',
    'CSRF disabled on session-based form app',
    'CORS wildcard with credentials',
    'Method security enabled but no @PreAuthorize on sensitive methods',
    'Actuator endpoints exposed without auth',
    'Using hasRole without ROLE_ prefix understanding',
  ],
  production: {
    security: ['Separate filter chains for admin/actuator', 'Method security on service layer too', 'Regular dependency updates for CVEs'],
    observability: ['Log authentication failures without credentials', 'Metrics on 401/403 rates'],
    maintainability: ['Central SecurityConfig per module', 'Document public endpoints list'],
    reliability: ['Fail closed when JWT validator unreachable — policy choice documented'],
  },
  interview: {
    expectations: ['Filter chain concept', 'STATELESS vs session', '@PreAuthorize', 'Resource Server JWT'],
    commonQuestions: ['Configure Spring Security JWT?', 'CSRF when disable?', 'Multiple security configs?'],
    followUps: ['Authentication vs Authorization in Spring?', 'Custom JwtAuthenticationConverter?'],
    misconceptions: ['Spring Security only for form login', 'Disable security for REST "because JWT" without resource server config'],
    traps: ['csrf disable on cookie-session MVC app'],
    strongSignals: ['Ordered chains, method security, OAuth2 resource server, actuator locked down'],
  },
  keyTakeaways: [
    'SecurityFilterChain runs before controllers — authentication then authorization.',
    'STATELESS + JWT for APIs; sessions + CSRF for cookie MVC.',
    '@EnableMethodSecurity for fine-grained @PreAuthorize.',
    'Multiple chains with @Order for actuator vs API.',
    'Never permitAll in prod without explicit public route list.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What does Spring Security provide?', answerHint: 'Filter chain authN/authZ, password encoding, CSRF, session, OAuth2/JWT integration.' },
    { level: 'intermediate', question: 'When disable CSRF?', answerHint: 'Stateless REST using Bearer tokens not cookies — still need authZ; keep CSRF for cookie/session apps.' },
    { level: 'advanced', question: 'Two SecurityFilterChain beans — why?', answerHint: 'Different rules per path — e.g., permit health, JWT for /api/**, form login for /admin/** with @Order.' },
  ],
  flashcards: [
    { front: 'SecurityFilterChain', back: 'Ordered filters handling authN/authZ before servlet chain' },
    { front: 'STATELESS session policy', back: 'No HttpSession created — typical JWT APIs' },
    { front: 'oauth2ResourceServer', back: 'Validates Bearer JWT on API requests' },
    { front: '@PreAuthorize', back: 'Method-level authorization after authentication' },
  ],
  quickRevision: ['Filter chain first', 'JWT resource server', 'Method security', 'CSRF if cookies', 'Lock actuator'],
}
