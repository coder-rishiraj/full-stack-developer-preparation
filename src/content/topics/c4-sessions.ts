import type { TopicContent } from '@/domain/types'

export const sessionsContent: TopicContent = {
  whatIsIt:
    'HTTP sessions maintain user state across stateless requests. Common pattern: server creates session with unique id stored in HttpOnly cookie; session data lives server-side (memory, Redis) or in signed/encrypted client token (JWT). Spring: HttpSession, Spring Session, SecurityContext.',
  whyExists:
    'Shopping carts, login state, and multi-step flows need continuity without re-authenticating every request. Sessions bridge stateless HTTP and stateful application needs while keeping sensitive data off the client when possible.',
  mentalModel:
    'Session id = key to server locker. Browser holds key (cookie); server holds valuables (user id, roles, cart). On each request, server looks up locker by key. Invalidate on logout or timeout.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'User authenticates → server creates session, stores attributes.',
        'Set-Cookie: JSESSIONID=... or custom session cookie.',
        'Subsequent requests include cookie → server loads session.',
        'Session timeout (inactive interval) or explicit invalidate on logout.',
        'Cluster: sticky sessions or shared store (Redis) for session replication.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Server-side session',
      diagram: `sequenceDiagram
  participant C as Client
  participant S as App server
  participant R as Redis session store
  C->>S: POST /login
  S->>R: CREATE session abc user=42
  S-->>C: Set-Cookie: SESSION=abc
  C->>S: GET /profile Cookie: SESSION=abc
  S->>R: GET session abc
  R-->>S: user=42
  S-->>C: 200 profile`,
    },
    {
      type: 'table',
      headers: ['Approach', 'Pros', 'Cons'],
      rows: [
        ['Server session + cookie', 'Revocable, small cookie, HttpOnly', 'Store scaling, sticky sessions'],
        ['JWT in Authorization header', 'Stateless servers, mobile-friendly', 'Hard revoke, size, XSS if in storage'],
        ['JWT in HttpOnly cookie', 'Auto-sent, can combine with BFF', ' Still revocation challenges'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Servlet HttpSession',
      code: `HttpSession session = request.getSession(true);
session.setAttribute("userId", user.getId());
session.setMaxInactiveInterval(1800); // 30 min

// Later
Long userId = (Long) session.getAttribute("userId");

// Logout
session.invalidate();`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Spring Security session',
      code: `@Configuration
@EnableWebSecurity
class SecurityConfig {
  // SessionCreationPolicy.IF_REQUIRED (default)
  // STATELESS for JWT APIs — no HttpSession created
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'JSESSIONID default Tomcat cookie name; configurable.',
        'Spring Session abstracts store — Redis, JDBC, Hazelcast.',
        'Session fixation: regenerate id after login.',
        'Concurrent session control: max sessions per user.',
        'Spring Security SecurityContext stored in session (or thread for stateless filter chain).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Immediate revocation on logout/server delete',
      'Minimal client exposure of sensitive state',
      'Familiar model for server-rendered apps',
    ],
    disadvantages: [
      'Central session store single point or replication cost',
      'Sticky sessions complicate load balancing',
      'Not ideal for pure mobile/API without cookie jar',
    ],
    alternatives: [
      'Stateless JWT with short TTL + refresh token',
      'OAuth2 opaque access token + introspection',
      'Server-side token blocklist for JWT revoke',
    ],
    whenToUse: [
      'Traditional web apps with server rendering',
      'When instant logout/revoke required',
    ],
    whenNotToUse: [
      'Horizontally scaled microservices without shared session store',
      'Pure REST mobile clients (Bearer tokens)',
    ],
  },
  failureModes: [
    'Session fixation if id not rotated on login.',
    'Lost sessions when sticky routing breaks mid-flow.',
    'Memory store sessions lost on deploy/restart.',
    'Session data too large → serialization cost.',
    'CSRF on cookie-bound session without protection.',
  ],
  interview: {
    expectations: [
      'Explain cookie + server store pattern',
      'Session vs JWT trade-offs',
      'Cluster session strategies',
    ],
    commonQuestions: [
      'How HTTP sessions work?',
      'Session vs JWT?',
      'How scale sessions?',
      'What is session fixation?',
    ],
    followUps: [
      'Spring Session with Redis?',
      'STATELESS Spring Security meaning?',
    ],
    misconceptions: [
      'Session data stored in cookie always (usually just id)',
      'JWT means no server state ever (refresh/revoke lists exist)',
      'Sessions violate REST (REST allows state on server, not in protocol)',
    ],
    traps: ['Saying HTTP is stateful because apps use sessions'],
    strongSignals: [
      'Regenerate session id on login',
      'Redis/shared store for multi-node',
      'HttpOnly cookie + CSRF protection',
    ],
  },
  keyTakeaways: [
    'Session id in cookie; data server-side typically.',
    'Timeout and invalidate on logout.',
    'Cluster needs shared store or sticky sessions.',
    'JWT stateless alternative with revoke trade-offs.',
    'Rotate session id after authentication.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How does a server track logged-in user across requests?',
      answerHint: 'Session id in cookie; server maps id to user state in store.',
    },
    {
      level: 'intermediate',
      question: 'Session vs JWT for authentication?',
      answerHint: 'Session: revocable server store; JWT: stateless, harder revoke, good for APIs.',
    },
    {
      level: 'advanced',
      question: 'How handle sessions in load-balanced cluster?',
      answerHint: 'Centralized Redis/Spring Session or sticky sessions; avoid in-memory only.',
    },
  ],
  flashcards: [
    { front: 'Session fixation', back: 'Attacker fixes session id; fix by regenerate on login' },
    { front: 'JSESSIONID', back: 'Default servlet container session cookie name' },
    { front: 'STATELESS Spring Security', back: 'No HttpSession; typically JWT per request' },
  ],
  quickRevision: [
    'Cookie holds session id only',
    'Server store user/cart data',
    'maxInactiveInterval timeout',
    'invalidate on logout',
    'Redis for cluster',
    'Regenerate id on login',
    'JWT alternative stateless',
  ],
}

export const content = sessionsContent
