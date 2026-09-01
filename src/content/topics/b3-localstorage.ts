import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'localStorage is a synchronous, origin-scoped key-value Web Storage API persisting string data across browser sessions until explicitly cleared — shared by all tabs/windows of the same origin with ~5MB typical quota.',
  whyExists:
    'Apps need client-side persistence without round-trips or cookies on every HTTP request. localStorage offers a simple API for preferences, draft content, and cached UI state that survives tab close and browser restart.',
  mentalModel:
    'A per-origin dictionary in the browser disk cache. setItem/getItem are sync and block the main thread. Same origin only — protocol+host+port. Data is plain text; JSON.stringify for objects. Never cleared automatically like sessionStorage.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Storage partitioned by origin (https://app.example.com:443).',
        'Only string keys/values; store objects via JSON.stringify/parse.',
        'Synchronous API — runs on main thread.',
        'storage event fires in other tabs on same origin when changed.',
        'Persists until clear(), removeItem(), or user clears site data.',
      ],
    },
    {
      type: 'table',
      headers: ['API', 'Behavior'],
      rows: [
        ['localStorage.setItem(k, v)', 'Insert or overwrite'],
        ['localStorage.getItem(k)', 'Returns string or null'],
        ['localStorage.removeItem(k)', 'Delete one key'],
        ['localStorage.clear()', 'Delete all keys for origin'],
        ['localStorage.key(n)', 'Nth key name'],
        ['storage event', 'Cross-tab sync notification (not same tab)'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Not for secrets',
      text: 'Any script on the origin can read localStorage — XSS exfiltrates tokens. Do not store refresh tokens or PII without encryption and threat model review.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Typical usage with JSON and cross-tab sync',
      code: `const KEY = 'app:preferences';

function loadPrefs() {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '{}');
  } catch {
    return {};
  }
}

function savePrefs(prefs) {
  localStorage.setItem(KEY, JSON.stringify(prefs));
}

window.addEventListener('storage', (e) => {
  if (e.key === KEY) applyTheme(JSON.parse(e.newValue ?? '{}'));
});`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'React: hydrate state once',
      code: `function usePersistedState(key, initial) {
  const [state, setState] = useState(() => {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : initial;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(state));
  }, [key, state]);
  return [state, setState];
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Quota: typically 5MB per origin; QuotaExceededError on overflow.',
        'Private/incognito may use memory-only storage cleared on close.',
        'Blocking sync I/O — large writes jank main thread.',
        'Not sent automatically on HTTP requests (unlike cookies).',
        'Access denied in third-party iframes without storage access API in some cases.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Simple API; persists across sessions',
      'No HTTP overhead unlike cookies',
      'storage event enables multi-tab UX',
    ],
    disadvantages: [
      'Synchronous — blocks main thread',
      'String-only; manual serialization',
      'XSS-readable — insecure for auth tokens',
      'No structured query like IndexedDB',
    ],
    alternatives: [
      'sessionStorage for tab-scoped data',
      'IndexedDB for large/structured data',
      'HttpOnly cookies for session auth',
      'Cache API for HTTP response caching',
    ],
    whenToUse: [
      'UI preferences, theme, sidebar state',
      'Draft form content, client feature flags cache',
    ],
    whenNotToUse: [
      'Auth tokens or sensitive secrets',
      'Large datasets or binary blobs',
      'High-frequency writes in animation loops',
    ],
  },
  failureModes: [
    'JSON.parse throws on corrupted data — always try/catch.',
    'QuotaExceededError when storing large offline caches.',
    'SSR: localStorage undefined on server — guard typeof window.',
    'Safari ITP / partitioned storage in embedded contexts.',
    'Storing tokens → XSS = full account compromise.',
  ],
  production: {
    security: ['Never store refresh/access tokens; assume XSS can read all'],
    performance: ['Debounce writes; avoid serializing huge objects each keystroke'],
    reliability: ['Version keys (app:prefs:v2); migrate on read'],
    maintainability: ['Centralize storage helpers with schema validation'],
  },
  interview: {
    expectations: [
      'Origin-scoped, persistent, synchronous string store',
      'vs sessionStorage, cookies, IndexedDB',
      'XSS security implications',
    ],
    commonQuestions: [
      'localStorage vs sessionStorage?',
      'Can you store objects?',
      'Is localStorage secure for JWT?',
    ],
    followUps: [
      'storage event behavior?',
      'SSR hydration pattern?',
    ],
    misconceptions: [
      'localStorage encrypted (plain text on disk)',
      'storage event fires in same tab that wrote',
      'Unlimited size',
    ],
    traps: ['Recommending localStorage for auth without XSS caveat'],
    strongSignals: [
      'Sync main-thread blocking',
      'JSON serialization pattern',
      'Not for secrets — HttpOnly cookie or memory token',
    ],
  },
  keyTakeaways: [
    'Origin-scoped persistent key-value store (~5MB).',
    'Strings only; JSON for objects; synchronous API.',
    'Survives browser restart; shared across tabs.',
    'storage event syncs other tabs, not writer tab.',
    'Never store auth tokens — XSS readable.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'localStorage vs sessionStorage?',
      answerHint: 'localStorage persists until cleared; sessionStorage per tab, cleared on close.',
    },
    {
      level: 'intermediate',
      question: 'Why not store JWT in localStorage?',
      answerHint: 'Any XSS script reads it; HttpOnly cookie or memory-only token safer.',
    },
    {
      level: 'advanced',
      question: 'How sync state across tabs?',
      answerHint: 'storage event listener on window; writer tab must use BroadcastChannel or custom event for self.',
    },
  ],
  flashcards: [
    { front: 'localStorage scope', back: 'Per origin; all tabs share' },
    { front: 'Persistence', back: 'Until explicit clear or user wipes site data' },
    { front: 'Sync API risk', back: 'Blocks main thread on read/write' },
  ],
  quickRevision: [
    'Origin-scoped ~5MB',
    'String KV; JSON for objects',
    'Sync — blocks main thread',
    'Persists across sessions',
    'storage event — other tabs only',
    'Not for auth tokens (XSS)',
  ],
}
