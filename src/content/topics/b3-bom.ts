import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The BOM (Browser Object Model) is the set of browser-provided global objects beyond the document tree — window, navigator, location, history, screen, timers, and dialogs. window is the global object in browsers; it wraps tabs, URLs, navigation, and viewport.',
  whyExists:
    'Web pages need more than document structure — URL control, back/forward, user agent info, viewport size, opening/closing windows, and timers. BOM APIs expose host environment capabilities separate from HTML content.',
  mentalModel:
    'DOM = the page content tree. BOM = the browser chrome around it — address bar state (location), tab global (window), device/browser info (navigator), navigation stack (history). Most BOM hangs off window.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'window — global object; open, close, innerWidth/Height, devicePixelRatio.',
        'location — href, pathname, search, hash; assign/replace navigation.',
        'history — pushState/replaceState for SPA routing without reload.',
        'navigator — userAgent, language, clipboard, geolocation (permissioned).',
        'setTimeout/setInterval/requestAnimationFrame — scheduling (also on window).',
        'sessionStorage/localStorage — origin-scoped key-value (Web Storage API).',
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'BOM vs Web APIs',
      text: 'Interview “BOM” often means window/location/history/navigator. Fetch, storage, and workers are Web APIs but accessed via window in browsers.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'location and history for SPA routing',
      code: `function navigate(path) {
  history.pushState({ path }, '', path);
  renderRoute(path);
}

window.addEventListener('popstate', (e) => {
  renderRoute(location.pathname);
});

// Parse query params
const params = new URLSearchParams(location.search);
const page = params.get('page') ?? '1';`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'Timers and viewport',
      code: `let resizeTimer;
window.addEventListener('resize', () => {
  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    console.log(window.innerWidth, window.innerHeight);
  }, 150);
});

const rafId = requestAnimationFrame(() => {
  // run before next paint
});
cancelAnimationFrame(rafId);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Same-origin policy restricts cross-window DOM access; postMessage for cross-origin.',
        'history.pushState does not navigate server-side — server must handle deep links.',
        'window.event legacy — prefer handler argument.',
        'Multiple frames: window.parent, window.top, contentWindow in iframes.',
        'Secure contexts (HTTPS) required for many navigator APIs.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Direct control of URL and navigation UX',
      'Viewport/timer APIs for responsive behavior',
      'No framework required for routing basics',
    ],
    disadvantages: [
      'Browser inconsistencies in edge BOM behavior',
      'Misused dialogs and window.open hurt UX',
      'Global window namespace pollution in legacy code',
    ],
    alternatives: ['Router libraries (React Router) wrapping history API', 'SSR frameworks managing URL server-side'],
    whenToUse: ['SPA routing, responsive layout reads, cross-tab storage, deep linking'],
    whenNotToUse: ['alert/confirm for app UX — use in-app modals'],
  },
  failureModes: [
    'pushState without popstate handler — back button breaks SPA.',
    'Relying on window size during SSR — undefined without guard.',
    'Storage quota exceeded — silent failures in Safari private mode.',
    'Open redirect via unvalidated location.href assignment.',
  ],
  production: {
    performance: ['Debounce resize/scroll handlers', 'Prefer rAF over setTimeout for visual work'],
    reliability: ['Feature-detect navigator APIs; handle storage unavailable'],
    security: ['Validate URLs before location.assign; avoid passing user input to open()'],
    maintainability: ['Centralize routing; abstract BOM access for tests'],
  },
  interview: {
    expectations: [
      'Define BOM vs DOM',
      'Explain pushState/popstate',
      'Know window global role',
    ],
    commonQuestions: ['DOM vs BOM?', 'How SPA routing works?', 'localStorage vs sessionStorage?'],
    followUps: ['Same-origin policy?', 'requestAnimationFrame vs setTimeout?'],
    misconceptions: ['BOM is standardized as strictly as DOM — many host quirks'],
    traps: ['pushState triggers load event — it does not'],
    strongSignals: ['history API, location parts, window global, rAF for paint'],
  },
  keyTakeaways: [
    'BOM = browser environment objects (window, location, history, navigator).',
    'window is global in browsers.',
    'pushState + popstate for client-side routing.',
    'Timers and rAF schedule work on main thread.',
    'Storage and many APIs hang off window with origin rules.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'DOM vs BOM?',
      answerHint: 'DOM = document tree; BOM = browser objects like window, location, history.',
    },
    {
      level: 'intermediate',
      question: 'How does history.pushState work in SPAs?',
      answerHint: 'Updates URL without reload; popstate fires on back/forward — sync UI.',
    },
    {
      level: 'advanced',
      question: 'requestAnimationFrame vs setTimeout(0) for animations?',
      answerHint: 'rAF syncs to display refresh; avoids unnecessary frames and battery waste.',
    },
  ],
  flashcards: [
    { front: 'BOM', back: 'Browser objects: window, location, history, navigator' },
    { front: 'pushState', back: 'Change URL without full page load' },
    { front: 'popstate', back: 'Back/forward navigation event for SPA sync' },
    { front: 'window global', back: 'Global object in browser JS' },
  ],
  quickRevision: [
    'BOM wraps browser not document',
    'window = global',
    'location URL parts',
    'pushState + popstate SPA',
    'rAF before paint',
    'localStorage per origin',
  ],
}
