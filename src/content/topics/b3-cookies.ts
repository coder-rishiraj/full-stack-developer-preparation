import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'HTTP cookies are name-value pairs set via Set-Cookie response headers and automatically sent by the browser in Cookie request headers on matching requests — the standard browser mechanism for session state, preferences, and auth in web apps.',
  whyExists:
    'HTTP is stateless. Cookies let servers recognize returning browsers without putting tokens in URLs. Built into every browser with attributes (HttpOnly, Secure, SameSite) for scope and security control.',
  mentalModel:
    'Server stamps the browser: “store sessionId=abc; send it back on requests to this domain/path.” Browser auto-attaches matching cookies. HttpOnly hides from JS; Secure requires HTTPS; SameSite limits cross-site inclusion.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Attribute', 'Effect'],
      rows: [
        ['Domain', 'Which hosts receive cookie (default: current host)'],
        ['Path', 'URL path prefix match'],
        ['Expires / Max-Age', 'Persistence (session cookie if omitted)'],
        ['Secure', 'HTTPS only'],
        ['HttpOnly', 'Not accessible to document.cookie / XSS via JS'],
        ['SameSite=Strict|Lax|None', 'Cross-site request inclusion policy'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Cookie session flow',
      diagram: `sequenceDiagram
  participant B as Browser
  participant S as API server
  B->>S: POST /login credentials
  S-->>B: Set-Cookie: sid=abc; HttpOnly; Secure; SameSite=Lax
  B->>S: GET /me Cookie: sid=abc
  S-->>B: 200 user JSON`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'SameSite=None requires Secure',
      text: 'Embedded or cross-site contexts need SameSite=None; must also set Secure.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Frontend: cookies with fetch',
      code: `// Send cookies cross-origin (requires CORS credentials)
fetch('https://api.example.com/me', {
  credentials: 'include',
});

// document.cookie — only non-HttpOnly cookies
document.cookie = 'theme=dark; path=/; max-age=31536000';

// Cannot read HttpOnly session cookie from JS (by design)`,
    },
    {
      type: 'code',
      language: 'http',
      caption: 'Set-Cookie header',
      code: `Set-Cookie: sessionId=7F3k9; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=3600`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Browser limits ~4KB per cookie, ~20–180 cookies per domain (engine-dependent).',
        'Cookie jar keyed by domain+path+name; subdomain scope via Domain attribute.',
        '__Host- prefix: Secure, Path=/, no Domain — strongest binding.',
        'Third-party cookies increasingly blocked — first-party auth preferred.',
        'Partitioned cookies (CHIPS) for embedded cross-site scenarios.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Automatic attachment — simple session UX in browsers',
      'HttpOnly mitigates XSS token theft',
      'SameSite reduces CSRF surface',
    ],
    disadvantages: [
      'CSRF risk if mutations lack protection',
      'Sent on every request — bandwidth overhead',
      'Cross-origin SPA needs credentials + CORS config',
    ],
    alternatives: [
      'Authorization: Bearer in memory/header for SPAs',
      'Refresh token rotation with short-lived access tokens',
    ],
    whenToUse: [
      'Session auth with HttpOnly Secure SameSite=Lax cookie',
      'Remember-me and preference cookies with explicit Max-Age',
    ],
    whenNotToUse: [
      'Storing large payloads or JWTs readable by JS',
      'Native mobile apps (use token headers)',
    ],
  },
  failureModes: [
    'Missing Secure in production → session hijack over HTTP.',
    'JWT in non-HttpOnly cookie → XSS steals full session.',
    'SameSite=Lax blocks cross-site POST login flows from iframe.',
    'Cookie too large → silent drop or 431 errors.',
    'Subdomain Domain=.example.com — subdomain takeover risk.',
  ],
  production: {
    security: [
      'HttpOnly + Secure + SameSite=Lax default for session cookies',
      'CSRF tokens or double-submit for cookie-authenticated mutations',
      'Rotate session on privilege change',
    ],
    performance: ['Minimize cookie size; avoid stuffing JWT claims'],
    reliability: ['Explicit Max-Age; handle expired session gracefully in UI'],
  },
  interview: {
    expectations: [
      'Set-Cookie attributes explained',
      'HttpOnly vs Secure vs SameSite',
      'Cookie vs localStorage for auth tokens',
    ],
    commonQuestions: [
      'How do cookies work?',
      'HttpOnly purpose?',
      'SameSite values?',
      'Cookie vs Authorization header?',
    ],
    followUps: [
      'CSRF mitigation with cookies?',
      'Third-party cookie deprecation?',
    ],
    misconceptions: [
      'Cookies encrypted automatically (need HTTPS)',
      'HttpOnly prevents CSRF (SameSite/CSRF token needed)',
      'document.cookie can read session HttpOnly cookie',
    ],
    traps: ['Recommending localStorage for session without XSS discussion'],
    strongSignals: [
      'HttpOnly Secure SameSite defaults',
      'Opaque session id + server store',
      'credentials: include + CORS for cross-origin',
    ],
  },
  keyTakeaways: [
    'Set-Cookie on response; Cookie header on subsequent requests.',
    'HttpOnly blocks JS; Secure requires HTTPS.',
    'SameSite controls cross-site sends (Lax is common default).',
    'Prefer opaque session id with server-side store.',
    'SPAs often use Bearer tokens; cookies still common for BFF patterns.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is an HttpOnly cookie?',
      answerHint: 'Not accessible via JavaScript; reduces XSS session theft.',
    },
    {
      level: 'intermediate',
      question: 'SameSite=Strict vs Lax vs None?',
      answerHint: 'Strict: same-site only; Lax: top-level GET cross-site; None: cross-site with Secure.',
    },
    {
      level: 'advanced',
      question: 'How send cookies in cross-origin fetch?',
      answerHint: 'credentials: include + server Access-Control-Allow-Credentials + explicit ACAO origin.',
    },
  ],
  flashcards: [
    { front: 'HttpOnly', back: 'Cookie not readable by document.cookie' },
    { front: 'Secure', back: 'Cookie sent only over HTTPS' },
    { front: 'SameSite=Lax', back: 'Default; allows top-level cross-site GET navigation' },
  ],
  quickRevision: [
    'Set-Cookie / Cookie headers',
    'HttpOnly Secure SameSite',
    'Session vs persistent (Max-Age)',
    'CSRF needs SameSite or token',
    '4KB size limit',
    'Not for large JWT in JS-readable cookie',
  ],
}
