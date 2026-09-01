import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'sessionStorage is the Web Storage API’s tab-scoped key-value store — same synchronous string API as localStorage, but data is isolated per top-level browsing context (tab/window) and cleared when that tab closes.',
  whyExists:
    'Not all client data should persist forever or leak across tabs. sessionStorage holds ephemeral UI state — wizard steps, form drafts, scroll restoration — without cookies on every request or cross-tab pollution.',
  mentalModel:
    'localStorage but per-tab backpack emptied when tab dies. Same origin rules. Duplicate keys in two tabs do not sync — independent copies. storage event does not fire in the tab that made the change.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Partitioned by origin AND browsing session (tab/window).',
        'Survives refresh and navigation within same tab.',
        'Cleared when tab/window closed (not on soft navigate away in SPA).',
        'Same API surface as localStorage: setItem, getItem, removeItem, clear.',
        'storage event notifies other tabs on same origin — rare use for sessionStorage since scopes differ.',
      ],
    },
    {
      type: 'table',
      headers: ['Feature', 'sessionStorage', 'localStorage'],
      rows: [
        ['Lifetime', 'Until tab close', 'Until explicit clear'],
        ['Tab sharing', 'Isolated per tab', 'Shared all tabs same origin'],
        ['API', 'Identical sync string KV', 'Identical'],
        ['Typical use', 'Multi-step form, tab workflow', 'Theme, long-term prefs'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'SPA nuance',
      text: 'Client-side route changes keep sessionStorage. Only closing tab/window clears it — not React unmount.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'javascript',
      caption: 'Wizard state per tab',
      code: `const STEP_KEY = 'checkout:step';

function saveStep(step) {
  sessionStorage.setItem(STEP_KEY, String(step));
}

function loadStep() {
  return Number(sessionStorage.getItem(STEP_KEY) ?? '1');
}

// Refresh mid-checkout restores step; new tab starts at 1`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'React guard for SSR',
      code: `function getTabDraft(id) {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(\`draft:\${id}\`);
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Duplicate tab (Ctrl+D) may copy sessionStorage depending on browser.',
        'Same ~5MB quota per origin per tab as localStorage model.',
        'Accessible from all same-origin frames in that tab unless blocked.',
        'Not sent on HTTP requests.',
        'Private mode: discarded when private session ends.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Automatic cleanup on tab close — no stale cross-session data',
      'Tab isolation prevents wizard state collisions',
      'Simple API; no server round-trip',
    ],
    disadvantages: [
      'Not shared across tabs — bad for global prefs',
      'Synchronous main-thread blocking',
      'Lost on tab close — may frustrate users expecting persistence',
      'XSS-readable like localStorage',
    ],
    alternatives: [
      'localStorage for cross-tab persistent prefs',
      'IndexedDB for larger ephemeral caches',
      'URL state / React state for short-lived UI',
    ],
    whenToUse: [
      'Multi-step flows scoped to one tab',
      'Sensitive-ish temp data you do not want persisting days',
      'Session-scoped analytics session ids (non-auth)',
    ],
    whenNotToUse: [
      'Auth tokens (use HttpOnly cookie or memory)',
      'Settings that should sync across tabs',
      'Large binary data',
    ],
  },
  failureModes: [
    'Expecting sessionStorage to clear on SPA logout route — must call removeItem.',
    'Opening link in new tab loses in-progress wizard state.',
    'QuotaExceededError on large session caches.',
    'SSR access without window guard crashes render.',
  ],
  production: {
    security: ['Treat like localStorage — no secrets; XSS exposes all'],
    reliability: ['Clear session keys on explicit logout flow'],
    maintainability: ['Namespace keys: app:checkout:step'],
  },
  interview: {
    expectations: [
      'Tab-scoped vs origin-wide localStorage',
      'Lifetime until tab close',
      'Same sync string API',
    ],
    commonQuestions: [
      'sessionStorage vs localStorage?',
      'Does it survive page refresh?',
      'Shared between tabs?',
    ],
    followUps: [
      'When use sessionStorage in React SPA?',
      'storage event with sessionStorage?',
    ],
    misconceptions: [
      'Clears on every navigation (only tab close)',
      'Shared across tabs of same site',
      'More secure than localStorage (same XSS exposure)',
    ],
    traps: ['Saying sessionStorage clears when user navigates to another route in SPA'],
    strongSignals: [
      'Per-tab isolation explicit',
      'Refresh keeps data; new tab does not',
      'Not for auth tokens',
    ],
  },
  keyTakeaways: [
    'Tab-scoped Web Storage; cleared when tab closes.',
    'Same API as localStorage; strings + JSON pattern.',
    'Survives refresh within tab; not shared across tabs.',
    'Use for ephemeral per-tab workflows.',
    'XSS-readable — not for secrets.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When is sessionStorage cleared?',
      answerHint: 'When the browsing tab/window is closed.',
    },
    {
      level: 'intermediate',
      question: 'Two tabs same site — same sessionStorage?',
      answerHint: 'No — isolated per tab; localStorage is shared.',
    },
    {
      level: 'advanced',
      question: 'Use case for sessionStorage in a checkout flow?',
      answerHint: 'Persist step/draft across refresh without cross-tab leakage or long-term storage.',
    },
  ],
  flashcards: [
    { front: 'sessionStorage lifetime', back: 'Until tab/window closes' },
    { front: 'Tab isolation', back: 'Each tab has separate sessionStorage' },
    { front: 'vs localStorage', back: 'sessionStorage ephemeral per tab; localStorage persistent shared' },
  ],
  quickRevision: [
    'Per-tab string KV store',
    'Same API as localStorage',
    'Survives refresh not tab close',
    'Not shared across tabs',
    'Wizard/draft use cases',
    'No auth secrets',
  ],
}
