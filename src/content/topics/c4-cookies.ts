import type { TopicContent } from '@/domain/types'

export const cookiesContent: TopicContent = {
  whatIsIt:
    'HTTP cookies are small name-value pairs set by Set-Cookie response headers and returned by the browser in Cookie request headers on subsequent matching requests. Attributes (Domain, Path, Expires, Max-Age, Secure, HttpOnly, SameSite) control scope and security.',
  whyExists:
    'HTTP is stateless; cookies let servers recognize returning browsers for sessions, preferences, and analytics without embedding tokens in every URL. Standard mechanism built into all browsers.',
  mentalModel:
    'Server stamps the browser: “store sessionId=abc; send it back on requests to this domain/path.” Browser auto-attaches matching cookies. HttpOnly hides from JS; Secure requires HTTPS; SameSite limits cross-site sends.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Attribute', 'Effect'],
      rows: [
        ['Domain', 'Which hosts receive cookie (default: current host)'],
        ['Path', 'URL path prefix match'],
        ['Expires / Max-Age', 'Persistence (session cookie if omitted)'],
        ['Secure', 'HTTPS only'],
        ['HttpOnly', 'Not accessible to document.cookie / XSS theft via JS'],
        ['SameSite=Strict|Lax|None', 'Cross-site request inclusion policy'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Cookie flow',
      diagram: `sequenceDiagram
  participant B as Browser
  participant S as Server
  B->>S: POST /login credentials
  S-->>B: Set-Cookie: sid=abc; HttpOnly; Secure; SameSite=Lax
  B->>S: GET /dashboard Cookie: sid=abc
  S-->>B: 200 personalized page`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'SameSite=None requires Secure',
      text: 'Third-party/embed contexts need SameSite=None; must also set Secure flag.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Set-Cookie examples',
      code: `Set-Cookie: sessionId=7F3k9; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600
Set-Cookie: theme=dark; Path=/; Max-Age=31536000`,
    },
    {
      type: 'code',
      language: 'java',
      caption: 'Servlet cookie API',
      code: `Cookie c = new Cookie("sessionId", sessionId);
c.setHttpOnly(true);
c.setSecure(true);
c.setPath("/");
c.setMaxAge(3600);
response.addCookie(c);

// Read
Cookie[] cookies = request.getCookies();`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Browser enforces ~4KB per cookie, ~20–50 cookies per domain (varies).',
        'Cookie jar keyed by domain+path+name; not sent to wrong subdomain unless Domain set.',
        '__Host- prefix: Secure, Path=/, no Domain — strongest binding.',
        'Third-party cookies increasingly blocked — prefer first-party auth flows.',
        'Server-side session store keyed by opaque cookie value — not JWT in cookie always.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Automatic browser attachment — simple session UX',
      'HttpOnly mitigates XSS token theft',
      'Fine-grained scope via Domain/Path',
    ],
    disadvantages: [
      'CSRF risk if SameSite lax and no tokens',
      'Size limits; sent on every request — bandwidth',
      'Mobile/API clients don’t use cookies same way',
    ],
    alternatives: [
      'Authorization: Bearer JWT for SPAs/APIs',
      'Session token in header with CORS credentials',
    ],
    whenToUse: [
      'Traditional server-rendered web sessions',
      'Browser-only auth with HttpOnly session cookie',
    ],
    whenNotToUse: [
      'Native mobile apps (use token header)',
      'Cross-domain API without credentials/CORS setup',
    ],
  },
  failureModes: [
    'Missing Secure on production → session hijack.',
    'Storing JWT in non-HttpOnly cookie → XSS steals token.',
    'Overbroad Domain=.example.com → subdomain takeover risk.',
    'CSRF on state-changing POST with session cookie.',
    'Cookie too large → silent drop or 431 errors.',
  ],
  interview: {
    expectations: [
      'Explain Set-Cookie attributes',
      'HttpOnly, Secure, SameSite purpose',
      'Cookie vs Authorization header',
    ],
    commonQuestions: [
      'How do cookies work?',
      'HttpOnly vs Secure?',
      'SameSite values?',
      'Cookie vs localStorage for tokens?',
    ],
    followUps: [
      'How prevent CSRF with cookies?',
      'Third-party cookie deprecation impact?',
    ],
    misconceptions: [
      'Cookies encrypted automatically (they’re not — use HTTPS)',
      'HttpOnly prevents CSRF (CSRF needs SameSite or token)',
      'Cookies work cross-origin by default',
    ],
    traps: ['Recommending localStorage for session tokens without XSS discussion'],
    strongSignals: [
      'HttpOnly + Secure + SameSite=Lax default',
      'CSRF token or SameSite for mutations',
      'Opaque session id server-side store',
    ],
  },
  keyTakeaways: [
    'Set-Cookie on response; Cookie on subsequent requests.',
    'HttpOnly blocks JS access; Secure requires HTTPS.',
    'SameSite controls cross-site inclusion (Lax default).',
    'Session cookie: opaque id → server-side session store.',
    'APIs often prefer Bearer token over cookies.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is an HttpOnly cookie?',
      answerHint: 'Not accessible via JavaScript; reduces XSS token theft.',
    },
    {
      level: 'intermediate',
      question: 'SameSite=Strict vs Lax vs None?',
      answerHint: 'Strict: same-site only; Lax: top-level GET cross-site; None: cross-site with Secure.',
    },
    {
      level: 'advanced',
      question: 'How mitigate CSRF with cookie-based sessions?',
      answerHint: 'SameSite, CSRF token, double-submit, or SameSite=Strict for sensitive ops.',
    },
  ],
  flashcards: [
    { front: 'HttpOnly', back: 'Cookie not readable by document.cookie' },
    { front: 'Secure flag', back: 'Cookie sent only over HTTPS' },
    { front: 'Session vs persistent', back: 'No Max-Age/Expires = deleted when browser closes' },
  ],
  quickRevision: [
    'Set-Cookie / Cookie headers',
    'Domain Path Max-Age',
    'HttpOnly Secure SameSite',
    'CSRF with cookies',
    '4KB size limit',
    'Opaque sid server store',
    'Bearer for SPA/API',
  ],
}

export const content = cookiesContent
