import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'HTTP sessions maintain authenticated user state across stateless requests. Security focus: HttpOnly Secure SameSite cookies, session id rotation on login (fixation), timeout, server-side store (Redis) for clusters, and explicit invalidation on logout. Contrasts with stateless JWT APIs.',
  whyExists:
    'After login, server must recognize user without re-sending password. Sessions bind identity to a server-side record keyed by opaque session id in cookie — reducing XSS token theft surface vs localStorage JWT when configured correctly.',
  mentalModel:
    'Session id is a pointer, not the identity itself. Attacker with session id becomes user. Protect cookie flags, rotate id on privilege change, store sessions centrally in multi-node deployments, and always pair with CSRF protection for cookie-based mutating requests.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Login success → create session, store userId + roles server-side',
        'Set-Cookie: SESSION=opaqueId; HttpOnly; Secure; SameSite=Lax|Strict',
        'Each request: lookup session; reject if expired or invalid',
        'Logout: invalidate session server-side + clear cookie',
        'Cluster: Spring Session + Redis — no sticky sessions required',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Secure session flow',
      diagram: `sequenceDiagram
  participant B as Browser
  participant S as API
  participant R as Redis
  B->>S: POST /login credentials
  S->>R: CREATE session newId user=42
  S-->>B: Set-Cookie HttpOnly Secure
  B->>S: GET /account Cookie session
  S->>R: GET session
  R-->>S: user=42
  S-->>B: 200`,
    },
    {
      type: 'table',
      headers: ['Control', 'Purpose'],
      rows: [
        ['HttpOnly', 'JS cannot read cookie — mitigates XSS theft'],
        ['Secure', 'Cookie only over HTTPS'],
        ['SameSite', 'Reduces CSRF cross-site cookie send'],
        ['Session fixation defense', 'New session id after authentication'],
        ['Idle + absolute timeout', 'Limit hijacked session window'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Spring Session Redis + security headers',
      code: `@Configuration
@EnableRedisHttpSession(maxInactiveIntervalInSeconds = 1800)
class SessionConfig {}

// Regenerate session on login via SecurityContext persistence
// spring.session.redis.namespace=spring:session:prod`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'JSESSIONID default name — customize to reduce fingerprinting',
        'Concurrent session control: limit sessions per user',
        'Session serialization size — avoid storing large objects',
        'Spring Security stores SecurityContext in session for form login',
        'BFF pattern: session cookie to BFF, BFF uses service token backend',
      ],
    },
  ],
  tradeoffs: {
    advantages: ['Immediate server-side revocation', 'Small opaque cookie', 'Familiar for server-rendered apps'],
    disadvantages: ['Central session store dependency', 'CSRF needs explicit defense', 'Mobile API clients prefer Bearer tokens'],
    alternatives: ['Stateless JWT with short TTL + refresh', 'Token in Authorization header only'],
    whenToUse: ['Traditional web apps', 'When instant logout required', 'BFF with HttpOnly session'],
    whenNotToUse: ['Pure mobile API without cookie jar', 'Microservices without shared session infrastructure'],
  },
  failureModes: [
    'Session fixation — no id change after login',
    'Missing HttpOnly — XSS steals session',
    'Session in JVM memory — lost on deploy',
    'Sticky session breaks mid-checkout on scale event',
    'No timeout — stolen cookie valid indefinitely',
    'Session data stores PII unnecessarily',
  ],
  production: {
    security: ['HttpOnly Secure SameSite; CSRF tokens for cookie auth', 'Rotate session on role elevation'],
    reliability: ['Redis HA for session store', 'Graceful session migration on deploy'],
    observability: ['Active session metrics', 'Alert on concurrent session anomalies'],
    performance: ['Keep session payload minimal', 'Redis TTL aligned with timeout'],
  },
  interview: {
    expectations: ['Cookie flags', 'Session vs JWT', 'Fixation and cluster storage'],
    commonQuestions: ['Secure HTTP session?', 'Scale sessions?', 'Session vs JWT trade-offs?'],
    followUps: ['CSRF with sessions?', 'Spring Session Redis setup?'],
    misconceptions: ['Session data lives in cookie by default', 'JWT eliminates all server state'],
    traps: ['Forgetting CSRF when using session cookies'],
    strongSignals: ['Redis session store, fixation defense, HttpOnly, timeout, logout invalidates'],
  },
  keyTakeaways: [
    'Session id in HttpOnly cookie; state server-side.',
    'Regenerate session id on login — prevent fixation.',
    'Use Redis/Spring Session for horizontal scale.',
    'Idle and absolute timeouts limit hijack damage.',
    'Pair cookie sessions with CSRF protection.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'How HTTP session authentication works?', answerHint: 'Server stores session data; browser sends session id cookie; server lookup each request.' },
    { level: 'intermediate', question: 'Session fixation attack and fix?', answerHint: 'Attacker sets victim session id pre-login; fix by issuing new session id after successful authentication.' },
    { level: 'advanced', question: 'Session vs JWT for SPA?', answerHint: 'Session+HttpOnly cookie+BFF reduces XSS token theft; JWT stateless scales but harder revoke — short TTL + refresh or denylist.' },
  ],
  flashcards: [
    { front: 'HttpOnly cookie', back: 'Not accessible to JavaScript — reduces XSS session theft' },
    { front: 'Session fixation', back: 'Force new session id after login' },
    { front: 'Spring Session Redis', back: 'Shared session store for clustered nodes' },
    { front: 'SameSite', back: 'Limits cross-site cookie inclusion — CSRF mitigation' },
  ],
  quickRevision: ['HttpOnly Secure cookie', 'Server-side store', 'Fixation rotate id', 'Redis cluster', 'CSRF + timeout'],
}
