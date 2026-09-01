import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'CORS (Cross-Origin Resource Sharing) is a browser mechanism where servers opt in to cross-origin HTTP requests from JavaScript by sending Access-Control-* headers — relaxing the Same-Origin Policy for reading responses, not replacing server authentication.',
  whyExists:
    'SPAs on app.example.com call api.example.com. Browsers block JS from reading cross-origin responses unless the API explicitly allows the frontend origin. CORS is the controlled bridge between separate origins.',
  mentalModel:
    'Browser asks permission before exposing cross-origin response to JS. Simple GET may skip preflight; credentialed or custom-header requests trigger OPTIONS preflight. Server must echo allowed Origin — wildcard incompatible with credentials.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'Preflight flow',
      diagram: `sequenceDiagram
  participant JS as Browser JS
  participant API as api.example.com
  JS->>API: OPTIONS /users (Origin: app.other.com)
  API-->>JS: ACAO: app.other.com + Allow-Methods/Headers
  JS->>API: GET /users Authorization: Bearer
  API-->>JS: ACAO + JSON body readable`,
    },
    {
      type: 'table',
      headers: ['Header', 'Purpose'],
      rows: [
        ['Access-Control-Allow-Origin', 'Permitted origin or * (not with credentials)'],
        ['Access-Control-Allow-Methods', 'GET, POST, PUT… for preflight'],
        ['Access-Control-Allow-Headers', 'Authorization, Content-Type…'],
        ['Access-Control-Allow-Credentials', 'true to allow cookies'],
        ['Access-Control-Max-Age', 'Preflight cache duration'],
        ['Origin', 'Sent by browser on cross-origin request'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'CORS is not auth',
      text: 'curl/Postman bypass CORS. Attackers can call your API directly. Still require Authorization and server-side authorization.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'fetch with credentials and JSON',
      code: `fetch('https://api.example.com/me', {
  method: 'GET',
  credentials: 'include', // cookies — needs ACAO specific origin + Allow-Credentials
  headers: {
    Authorization: \`Bearer \${token}\`,
    'Content-Type': 'application/json',
  },
});`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Express CORS middleware pattern',
      code: `app.use(cors({
  origin: 'https://app.example.com',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Simple requests: GET/HEAD/POST with safelisted headers — no preflight.',
        'Preflight for PUT/DELETE, Authorization, application/json body often.',
        'ACAO * + Allow-Credentials: true → browser rejects.',
        'Non-simple response headers need Access-Control-Expose-Headers.',
        'Same-origin proxy (Vite dev server proxy) avoids CORS in development only.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Enables secure SPA + separate API architecture',
      'Granular per-origin whitelist',
      'Preflight prevents unexpected cross-origin mutations from browser',
    ],
    disadvantages: [
      'Browser-only — confusing errors in DevTools',
      'Misconfiguration blocks legitimate frontends',
      'Not a security boundary by itself',
    ],
    alternatives: [
      'Same-origin BFF/reverse proxy — no CORS needed',
      'JSONP (legacy, insecure — avoid)',
    ],
    whenToUse: [
      'Browser SPA calling API on different subdomain/domain',
      'Public API with known frontend origins',
    ],
    whenNotToUse: [
      'Server-to-server (CORS irrelevant)',
      'As sole security mechanism',
    ],
  },
  failureModes: [
    'ACAO * with credentials: true — browser blocks.',
    'Missing ACAO on 401/500 error responses — opaque CORS failure.',
    'OPTIONS route not implemented on server.',
    'Reflecting arbitrary Origin header — security vulnerability.',
    'Confusing CORS error with actual 403 auth failure.',
  ],
  production: {
    security: [
      'Explicit origin allowlist — never echo untrusted Origin',
      'Separate auth from CORS configuration',
    ],
    reliability: ['Ensure error responses include CORS headers'],
    maintainability: ['BFF pattern reduces production CORS surface'],
  },
  interview: {
    expectations: [
      'Same-origin policy + CORS purpose',
      'Simple vs preflight request',
      'Credentials + wildcard restriction',
    ],
    commonQuestions: [
      'What is CORS?',
      'Why CORS error in browser but curl works?',
      'When is preflight triggered?',
    ],
    followUps: [
      'BFF to avoid CORS?',
      'CORS vs CSRF?',
    ],
    misconceptions: [
      'CORS protects API from attackers',
      'CORS blocks server from receiving request',
      'Allow * works with cookies',
    ],
    traps: ['Saying CORS replaces authentication'],
    strongSignals: [
      'Browser-only enforcement stated',
      'Preflight OPTIONS explained',
      'Explicit origins with credentials',
    ],
  },
  keyTakeaways: [
    'Browser enforces CORS on JS cross-origin response reads.',
    'Server sends Access-Control-Allow-Origin and related headers.',
    'Preflight OPTIONS for non-simple requests.',
    'Credentials require explicit origin — not *.',
    'Not authentication — server must validate tokens.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why does browser block cross-origin fetch by default?',
      answerHint: 'Same-origin policy — malicious sites must not read other sites’ data.',
    },
    {
      level: 'intermediate',
      question: 'When is CORS preflight triggered?',
      answerHint: 'Non-simple: PUT/DELETE, Authorization header, application/json, custom headers.',
    },
    {
      level: 'advanced',
      question: 'Why ACAO * fails with credentials: include?',
      answerHint: 'Spec forbids wildcard when cookies sent — must echo specific origin.',
    },
  ],
  flashcards: [
    { front: 'CORS purpose', back: 'Server opt-in for JS to read cross-origin responses' },
    { front: 'Preflight', back: 'OPTIONS before non-simple cross-origin request' },
    { front: 'Credentials + ACAO', back: 'Must be specific origin, not *' },
  ],
  quickRevision: [
    'SOP default; CORS opt-in',
    'Access-Control-Allow-Origin',
    'Simple vs preflight',
    'credentials: include needs explicit ACAO',
    'Browser only — curl ignores',
    'Not auth',
  ],
}
