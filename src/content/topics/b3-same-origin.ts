import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The Same-Origin Policy (SOP) is a core browser security rule: JavaScript running in one origin cannot read data from another origin unless that origin explicitly permits it (e.g., via CORS). Origin = scheme + host + port.',
  whyExists:
    'Without SOP, evil.com could embed your bank in an iframe or fetch your logged-in APIs and read responses. SOP isolates documents so scripts only access same-origin DOM, storage, and network responses by default.',
  mentalModel:
    'Each origin is a sandbox. https://app.com:443 is different from http://app.com and https://api.app.com. JS can navigate the user cross-origin but cannot inspect the result. CORS and postMessage are controlled holes in the wall.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Comparison', 'Same origin?'],
      rows: [
        ['https://a.com/x vs https://a.com/y', 'Yes — path ignored'],
        ['https://a.com vs http://a.com', 'No — scheme differs'],
        ['https://a.com vs https://b.com', 'No — host differs'],
        ['https://a.com vs https://a.com:8443', 'No — port differs'],
        ['about:blank from https://a.com', 'Inherits creator origin'],
      ],
    },
    {
      type: 'list',
      items: [
        'DOM access: iframe cross-origin → blocked (except postMessage).',
        'localStorage/sessionStorage/IndexedDB: same-origin only.',
        'Cookies: scoped by Domain/Path; not readable cross-origin via JS.',
        'fetch/XHR: cross-origin allowed but response opaque to JS without CORS.',
        'CSS/fonts/images: embed rules differ — images often allowed, canvas tainted if cross-origin without CORS.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'SOP ≠ CSRF protection',
      text: 'Browsers still SEND cross-origin requests (forms, img, fetch). SOP blocks JS reading responses — server must validate auth for mutations.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'SOP blocks cross-origin DOM read',
      code: `const iframe = document.querySelector('iframe');
try {
  iframe.contentDocument.body; // SecurityError cross-origin
} catch (e) {
  console.log('SOP blocked DOM access');
}

// Allowed cross-origin communication:
iframe.contentWindow.postMessage({ type: 'PING' }, 'https://other.com');`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Origin check helper',
      code: `function sameOrigin(a, b) {
  const A = new URL(a, location.href);
  const B = new URL(b, location.href);
  return A.origin === B.origin;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Opaque responses: no-cors fetch gives unreadable Response to JS.',
        'CORS preflight for non-simple cross-origin requests.',
        'document.domain deprecated — do not relax SOP manually.',
        'Sandbox iframe attribute further restricts capabilities.',
        'COOP/COEP headers create cross-origin isolation for advanced APIs.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Prevents cross-site data theft via malicious scripts',
      'Foundation for secure multi-tenant web',
    ],
    disadvantages: [
      'Complicates SPA + separate API domain setups',
      'Confusing errors when CORS misconfigured',
    ],
    alternatives: [
      'Same-origin reverse proxy (BFF) — API appears same origin',
      'postMessage for controlled cross-origin iframe comms',
    ],
    whenToUse: [
      'Understanding why fetch fails in browser but works in curl',
      'Designing auth and storage boundaries',
    ],
    whenNotToUse: [
      'N/A — browser enforces always; you work within it',
    ],
  },
  failureModes: [
    'Reflecting any Origin in ACAO — breaks SOP intent, security hole.',
    'postMessage with targetOrigin * without validating event.origin.',
    'Assuming SOP blocks CSRF POST with cookies (it does not).',
    'Tainted canvas when drawing cross-origin image without crossOrigin attribute.',
  ],
  production: {
    security: [
      'Validate event.origin in postMessage handlers',
      'Explicit CORS allowlists — never mirror Origin blindly',
      'COOP/COEP when using SharedArrayBuffer',
    ],
    maintainability: ['BFF pattern to simplify same-origin API for frontend'],
  },
  interview: {
    expectations: [
      'Origin definition: scheme + host + port',
      'What SOP blocks vs allows',
      'Relationship to CORS',
    ],
    commonQuestions: [
      'What is same-origin policy?',
      'Is https://a.com same origin as https://a.com:443?',
      'Can JS read cross-origin iframe DOM?',
    ],
    followUps: [
      'SOP vs CORS?',
      'How postMessage fits?',
    ],
    misconceptions: [
      'SOP prevents cross-origin requests entirely',
      'CORS is authentication',
      'Subdomains always same origin',
    ],
    traps: ['Saying SOP prevents CSRF'],
    strongSignals: [
      'Origin triple defined precisely',
      'CORS relaxes read access not SOP existence',
      'postMessage with origin validation',
    ],
  },
  keyTakeaways: [
    'Origin = protocol + host + port.',
    'JS cannot read cross-origin DOM/storage/responses by default.',
    'CORS lets servers opt in to cross-origin response reads.',
    'SOP does not block sending requests — CSRF is separate.',
    'postMessage for intentional cross-origin comms.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What defines an origin?',
      answerHint: 'Scheme, host, and port — not path.',
    },
    {
      level: 'intermediate',
      question: 'Same origin: https://app.com/page1 vs https://app.com/page2?',
      answerHint: 'Yes — path does not affect origin.',
    },
    {
      level: 'advanced',
      question: 'SOP vs CORS — how relate?',
      answerHint: 'SOP blocks by default; CORS headers allow browser to expose cross-origin response to JS.',
    },
  ],
  flashcards: [
    { front: 'Origin components', back: 'Scheme + host + port' },
    { front: 'SOP blocks', back: 'Cross-origin DOM/storage/response read by JS' },
    { front: 'SOP allows', back: 'Navigation, form POST, embedding many resources' },
  ],
  quickRevision: [
    'Origin = protocol host port',
    'Default: no cross-origin JS reads',
    'CORS = opt-in exception',
    'postMessage for iframes',
    'SOP ≠ no cross-origin requests',
    'Subdomains = different origins',
  ],
}
