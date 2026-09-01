import type { TopicContent } from '@/domain/types'

export const corsContent: TopicContent = {
  whatIsIt:
    'CORS (Cross-Origin Resource Sharing) is a browser security mechanism allowing servers to opt-in to cross-origin HTTP requests from JavaScript via Access-Control-* headers. Same-origin policy blocks reads by default; CORS relaxes it when server explicitly permits origin, methods, and headers.',
  whyExists:
    'Websites run JS that calls APIs on other domains (SPA + API). Without CORS, browsers block responses to prevent malicious sites reading your bank data. Server whitelist tells browser which foreign origins may read responses.',
  mentalModel:
    'Browser asks permission before showing cross-origin response to JS. Simple GET may go as “no-cors” limited; credentialed or custom headers trigger preflight OPTIONS. Server must echo allowed Origin — wildcard incompatible with credentials.',
  howItWorks: [
    {
      type: 'mermaid',
      caption: 'CORS preflight',
      diagram: `sequenceDiagram
  participant B as Browser JS
  participant API as api.example.com
  B->>API: OPTIONS /users (Origin: app.other.com)
  API-->>B: Access-Control-Allow-Origin: app.other.com
  Note over B,API: Allow-Methods, Allow-Headers
  B->>API: GET /users Authorization: Bearer
  API-->>B: ACAO + actual JSON`,
    },
    {
      type: 'table',
      headers: ['Header', 'Set by', 'Purpose'],
      rows: [
        ['Access-Control-Allow-Origin', 'Server', 'Permitted origin(s) or *'],
        ['Access-Control-Allow-Methods', 'Server', 'GET, POST, ... for preflight'],
        ['Access-Control-Allow-Headers', 'Server', 'Authorization, Content-Type, ...'],
        ['Access-Control-Allow-Credentials', 'Server', 'true to allow cookies'],
        ['Access-Control-Max-Age', 'Server', 'Preflight cache duration'],
        ['Origin', 'Browser', 'Calling page origin on request'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'CORS is not server auth',
      text: 'CORS only restricts browser JS reading responses. curl/Postman bypass CORS. Still require Authorization and server-side authZ.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'java',
      caption: 'Spring @CrossOrigin',
      code: `@RestController
@CrossOrigin(origins = "https://app.example.com", allowCredentials = "true")
class UserController { ... }

// Global
@Configuration
class WebConfig implements WebMvcConfigurer {
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
        .allowedOrigins("https://app.example.com")
        .allowedMethods("GET", "POST", "PUT", "DELETE")
        .allowCredentials(true);
  }
}`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'fetch with credentials',
      code: `fetch("https://api.example.com/me", {
  credentials: "include", // sends cookies
  headers: { Authorization: "Bearer " + token }
});`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Simple requests: GET/HEAD/POST with safelisted headers — no preflight.',
        'Preflight for PUT/DELETE, custom headers, application/json often.',
        'ACAO * cannot be used with Access-Control-Allow-Credentials: true.',
        'SameSite cookies reduce CSRF; CORS separate concern (read access).',
        'Non-browser clients ignore CORS entirely.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Enables secure cross-origin SPA + API architecture',
      'Granular per-origin control',
      'Preflight prevents unexpected cross-origin mutations',
    ],
    disadvantages: [
      'Confusing errors in browser only',
      'Misconfiguration blocks legitimate frontends',
      'Not a substitute for authentication',
    ],
    alternatives: [
      'Same-origin reverse proxy (BFF) — no CORS needed',
      'JSONP (legacy, insecure)',
    ],
    whenToUse: [
      'Browser SPA calling separate API domain',
      'Public API with known frontend origins',
    ],
    whenNotToUse: [
      'Server-to-server calls (CORS irrelevant)',
      'Security boundary — use auth not CORS alone',
    ],
  },
  failureModes: [
    'ACAO * with credentials: true — browser rejects.',
    'Missing ACAO on error responses — opaque CORS failure.',
    'Preflight not handled on OPTIONS route.',
    'Reflecting arbitrary Origin header — security hole.',
    'Confusing CORS error with 401/403 auth failure.',
  ],
  interview: {
    expectations: [
      'Explain same-origin policy and CORS purpose',
      'Preflight when and why',
      'Credentials + wildcard restriction',
    ],
    commonQuestions: [
      'What is CORS?',
      'Simple vs preflight request?',
      'Why CORS error in browser but curl works?',
    ],
    followUps: [
      'BFF pattern to avoid CORS?',
      'CORS vs CSRF?',
    ],
    misconceptions: [
      'CORS protects API from attackers (attackers bypass browser)',
      'CORS blocks server from accepting request (blocks JS reading response)',
      'Allow * is fine with cookies',
    ],
    traps: ['Saying CORS replaces authentication'],
    strongSignals: [
      'Distinguishes browser-only enforcement',
      'Explicit origins with credentials',
      'Mentions OPTIONS preflight',
    ],
  },
  keyTakeaways: [
    'Browser enforces CORS on JS cross-origin reads.',
    'Server sends Access-Control-Allow-Origin etc.',
    'Preflight OPTIONS for non-simple requests.',
    'Credentials require explicit origin not *.',
    'Not auth — server must still validate tokens.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why does browser block cross-origin fetch by default?',
      answerHint: 'Same-origin policy prevents malicious sites reading other sites’ data.',
    },
    {
      level: 'intermediate',
      question: 'When is CORS preflight triggered?',
      answerHint: 'Non-simple methods/headers/content-types e.g. PUT, Authorization, application/json.',
    },
    {
      level: 'advanced',
      question: 'Why Access-Control-Allow-Origin: * fails with credentials?',
      answerHint: 'Spec forbids wildcard when cookies/credentials sent — must echo specific origin.',
    },
  ],
  flashcards: [
    { front: 'CORS enforced by', back: 'Browser only — not server rejecting request for curl' },
    { front: 'Preflight method', back: 'OPTIONS before actual cross-origin request' },
    { front: 'ACAO with credentials', back: 'Must be specific origin, not *' },
  ],
  quickRevision: [
    'Same-origin policy default',
    'ACAO Allow-Methods Headers',
    'OPTIONS preflight',
    'credentials need explicit origin',
    'curl bypasses CORS',
    'BFF avoids CORS',
    'Not a security auth layer',
  ],
}

export const content = corsContent
