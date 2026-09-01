import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'CORS (Cross-Origin Resource Sharing) is a browser security mechanism: servers opt-in via Access-Control-Allow-Origin (and related headers) so JavaScript on origin A may read responses from origin B. Without CORS, browsers block frontend from reading cross-origin API responses—cookies and credentials need explicit Allow-Credentials and non-wildcard origin.',
  whyExists:
    'Same-origin policy prevents malicious sites from reading authenticated data from other domains. CORS lets legitimate SPAs on app.example.com call api.example.com safely when API sends correct headers. Server must allow; browser enforces.',
  mentalModel:
    'Browser bouncer: frontend asks API owner "may this origin read me?" Preflight OPTIONS for non-simple requests checks Allow-Methods/Headers before sending real request.',
  howItWorks: [
    {
      type: 'list',
      items: [
        'Simple GET/POST may skip preflight; custom headers trigger OPTIONS preflight.',
        'Response needs Access-Control-Allow-Origin matching request Origin (or * without credentials).',
        'Credentials: Allow-Credentials: true + specific origin (not *).',
        'Preflight: Allow-Methods, Allow-Headers, Max-Age.',
        'CORS is browser-only—curl/server-to-server ignores CORS.',
      ],
    },
    {
      type: 'table',
      headers: ['Header', 'Purpose'],
      rows: [
        ['Access-Control-Allow-Origin', 'Permitted caller origin'],
        ['Access-Control-Allow-Credentials', 'Include cookies'],
        ['Access-Control-Allow-Methods', 'POST PUT DELETE etc.'],
        ['Access-Control-Allow-Headers', 'Authorization Content-Type'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Credentialed cross-origin response',
      code: `HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.example.com
Access-Control-Allow-Credentials: true
Vary: Origin`,
    },
  ],
  tradeoffs: {
    advantages: ['Controlled cross-origin API access', 'Standard browser behavior', 'Preflight prevents surprise methods'],
    disadvantages: ['Misconfiguration breaks SPAs', 'Wildcard + credentials invalid', 'Not a substitute for AuthN'],
    alternatives: ['Same-origin reverse proxy/BFF', 'JSONP legacy avoid'],
    whenToUse: ['Browser SPA calling separate API domain'],
    whenNotToUse: ['Server-to-server', 'Mobile native apps (no CORS)'],
  },
  failureModes: [
    'Allow-Origin * with credentials.',
    'Reflect arbitrary Origin without allowlist → credential theft.',
    'Missing preflight headers for Authorization.',
    'Thinking CORS blocks hackers—only browsers.',
  ],
  production: {
    security: ['Explicit origin allowlist', 'Never reflect Origin blindly', 'Vary: Origin header', 'CORS not AuthN—still validate JWT'],
    reliability: ['Cache preflight Max-Age reasonably'],
    observability: ['Log blocked preflight patterns', 'Monitor CORS misconfig errors client-side'],
    maintainability: ['Central CorsConfigurationSource in Spring', 'Document allowed origins per env'],
    performance: ['Preflight cache reduces OPTIONS traffic'],
    scalability: ['Stateless CORS headers on each response'],
    cost: ['BFF same-origin avoids complex CORS'],
  },
  interview: {
    expectations: ['Browser-only enforcement', 'Preflight when', 'Credentials need specific origin'],
    commonQuestions: ['Fix CORS error in SPA?', 'CORS vs CSRF?'],
    followUps: ['Why curl works but browser fails?', 'Secure Allow-Origin?'],
    misconceptions: ['CORS protects API from attackers', 'Server blocks request without CORS'],
    traps: ['Reflected origin open redirect style', 'Confuse with CSRF'],
    strongSignals: ['Allowlist origins', 'BFF pattern alternative', 'CORS complements AuthN not replaces'],
  },
  keyTakeaways: [
    'CORS is browser enforcement of cross-origin read permission.',
    'Server sends Allow-Origin; preflight for non-simple requests.',
    'Credentials require specific origin not *.',
    'curl ignores CORS; attackers use non-browser clients.',
    'Use allowlist; never blindly reflect Origin.',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'What triggers CORS preflight?', answerHint: 'Non-simple methods/headers e.g. PUT DELETE Authorization Content-Type application/json.' },
    { level: 'intermediate', question: 'Allow credentials with wildcard origin?', answerHint: 'Invalid; must specify exact origin with Allow-Credentials true.' },
    { level: 'advanced', question: 'CORS vs CSRF difference?', answerHint: 'CORS controls cross-origin response read; CSRF exploits cookie auto-send on forged requests—use SameSite tokens CSRF tokens.' },
  ],
  flashcards: [
    { front: 'CORS enforced by', back: 'Browser only—not server blocking curl.' },
    { front: 'Credentials + Allow-Origin rule', back: 'Specific origin required; wildcard invalid.' },
  ],
  quickRevision: [
    'Browser same-origin policy',
    'Allow-Origin allowlist',
    'Preflight OPTIONS',
    'Credentials no wildcard',
    'Not API auth',
    'BFF avoids CORS',
    'Vary Origin header',
  ],
}
