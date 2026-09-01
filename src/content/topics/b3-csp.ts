import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Content Security Policy (CSP) is an HTTP header (or meta tag) that whitelists where scripts, styles, images, connections, and frames may load from — mitigating XSS by blocking inline and unauthorized remote code execution even if attacker injects HTML.',
  whyExists:
    'XSS remains common. Sanitization alone fails. CSP is defense-in-depth: browser refuses to run script not matching policy. Report-Only mode audits violations before enforcing.',
  mentalModel:
    'Allowlist firewall for resource types. script-src controls JS origins; default-src fallback. nonce or hash permits specific inline scripts. unsafe-inline defeats much of CSP value — avoid in production.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Directive', 'Controls'],
      rows: [
        ['default-src', 'Fallback for unspecified fetch directives'],
        ['script-src', 'JavaScript sources and inline rules'],
        ['style-src', 'CSS sources'],
        ['img-src', 'Images'],
        ['connect-src', 'fetch, XHR, WebSocket'],
        ['frame-ancestors', 'Who may embed this page (clickjacking)'],
        ['upgrade-insecure-requests', 'HTTP → HTTPS auto upgrade'],
      ],
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Server sends Content-Security-Policy header on HTML responses.',
        'Browser parses policy before executing page scripts.',
        'Violations block resource load or inline execution; optional report-uri/report-to.',
        'nonce: server generates random per-request nonce on <script nonce="...">.',
        'strict-dynamic allows nonce-trusted scripts to load descendants.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Start with Report-Only',
      text: 'Content-Security-Policy-Report-Only logs violations without breaking prod while tuning policy.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Strict policy with nonce (typical SSR)',
      code: `Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-R4nd0m' https://cdn.example.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';`,
    },
    {
      type: 'code',
      language: 'html',
      caption: 'Inline script with matching nonce',
      code: `<script nonce="R4nd0m">
  window.__BOOTSTRAP__ = { userId: '123' };
</script>`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'React + CSP caveat',
      code: `// CRA/Vite inline runtime may need nonce injection at build
// or hash for specific inline chunks
// Avoid eval — blocked by script-src without unsafe-eval`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'unsafe-inline allows any inline script — weak against XSS.',
        'unsafe-eval blocks new Function, eval — breaks some devtools/libs.',
        'Meta CSP only effective for HTML document, not subresources.',
        'CSP does not replace input sanitization — both layers.',
        'Trusted Types API pairs with CSP require-trusted-types-for.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Strong XSS mitigation even after injection',
      'frame-ancestors prevents clickjacking',
      'connect-src limits data exfil endpoints',
    ],
    disadvantages: [
      'Hard to retrofit on apps with many inline scripts',
      'Third-party widgets often need broad allowlists',
      'Misconfiguration breaks app silently or in console only',
    ],
    alternatives: [
      'Subresource Integrity (SRI) for CDN scripts',
      'Trusted Types',
      'Sanitization libraries (DOMPurify)',
    ],
    whenToUse: [
      'Production web apps handling user content',
      'Admin dashboards, auth flows',
      'frame-ancestors none on sensitive pages',
    ],
    whenNotToUse: [
      'Policy with script-src unsafe-inline * in production',
      'Relying on CSP alone without sanitization',
    ],
  },
  failureModes: [
    'unsafe-inline + unsafe-eval — nominal CSP, little protection.',
    'Forgot connect-src — API calls blocked after script-src fixed.',
    'Third-party script changes URL — breaks until policy updated.',
    'Report-Only left on forever — never enforcing.',
    'React hydration inline without nonce/hash mismatch.',
  ],
  production: {
    security: [
      'Nonce-based script-src with SSR per request',
      'frame-ancestors none or explicit embedders',
      'Avoid unsafe-inline in script-src',
    ],
    observability: ['report-uri / report-to endpoint for violation monitoring'],
    maintainability: ['Document every allowed CDN origin; review on dependency adds'],
  },
  interview: {
    expectations: [
      'CSP as XSS defense-in-depth',
      'Key directives: script-src, connect-src, frame-ancestors',
      'nonce vs hash vs unsafe-inline',
    ],
    commonQuestions: [
      'What is CSP?',
      'How stop inline XSS with CSP?',
      'script-src unsafe-inline risk?',
    ],
    followUps: [
      'CSP vs CORS?',
      'How CSP affects React dev/build?',
    ],
    misconceptions: [
      'CORS and CSP are the same (CORS = cross-origin reads; CSP = resource allowlist)',
      'CSP blocks all XSS automatically with default headers',
    ],
    traps: ['Recommending unsafe-inline for convenience in production'],
    strongSignals: [
      'Nonce/hash for inline scripts',
      'Report-Only rollout',
      'frame-ancestors for clickjacking',
    ],
  },
  keyTakeaways: [
    'CSP whitelists resource sources via HTTP header.',
    'script-src is primary XSS lever — avoid unsafe-inline.',
    'nonce per request for needed inline scripts.',
    'connect-src restricts fetch/XHR targets.',
    'frame-ancestors controls embedding (clickjacking).',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What problem does CSP solve?',
      answerHint: 'Mitigates XSS by blocking unauthorized script/resource loads.',
    },
    {
      level: 'intermediate',
      question: 'How allow one inline script safely?',
      answerHint: 'nonce-... on policy and matching script tag, or sha256 hash of script content.',
    },
    {
      level: 'advanced',
      question: 'CSP vs CORS?',
      answerHint: 'CSP restricts what page can load/run; CORS controls cross-origin response read access.',
    },
  ],
  flashcards: [
    { front: 'script-src', back: 'Controls JS execution sources' },
    { front: 'nonce', back: 'Per-request token allowing specific inline script' },
    { front: 'frame-ancestors', back: 'Prevents page being framed — clickjacking defense' },
  ],
  quickRevision: [
    'HTTP header resource allowlist',
    'XSS defense-in-depth',
    'script-src critical',
    'Avoid unsafe-inline',
    'nonce/hash for inline',
    'connect-src for API calls',
  ],
}
