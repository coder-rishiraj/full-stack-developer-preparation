import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Service workers are browser background scripts on separate thread — intercept network via fetch event, enable offline caching, push notifications, and PWA install without blocking main thread.',
  whyExists: 'Web apps need offline resilience and faster repeat loads. SW decouples asset caching and background sync from page lifecycle.',
  mentalModel: 'Proxy sitting between app and network: install → cache assets → fetch handler serves cache-first or network-first → update on new SW version.',
  howItWorks: [
    { type: 'list', ordered: true, items: [
      'Register navigator.serviceWorker.register(\'/sw.js\')',
      'install event — precache shell assets',
      'activate event — delete old caches',
      'fetch event — respond from cache or network strategy',
      'skipWaiting + clients.claim for immediate takeover',
      'HTTPS required (localhost excepted)',
    ] },
  ],
  example: [
    { type: 'code', language: 'javascript', code: 'self.addEventListener(\'fetch\', (e) => {\n  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));\n});', caption: 'Cache-first strategy' },
  ],
  tradeoffs: {
    advantages: [
      'Offline support',
      'Background sync/push',
    ],
    disadvantages: [
      'Cache invalidation complexity',
      'Debugging harder',
    ],
    alternatives: [
      'HTTP cache headers only',
      'App shell SSR',
    ],
    whenToUse: [
      'PWA',
      'Offline-first apps',
    ],
    whenNotToUse: [
      'Simple sites with always-online',
    ],
  },
  failureModes: [
    'Stale cache serves old JS forever',
    'SW not updating — users stuck on old version',
    'Caching API responses incorrectly',
    'Scope too narrow — fails to control routes',
  ],
  production: {
    reliability: [
      'Version cache names; purge on activate',
    ],
    security: [
      'Never cache authenticated API blindly',
    ],
    observability: [
      'Log SW lifecycle in analytics',
    ],
  },
  interview: {
    expectations: [
      'Lifecycle install/activate/fetch',
      'Caching strategies',
    ],
    commonQuestions: [
      'Service worker lifecycle?',
    ],
    followUps: [
      'Cache-first vs network-first?',
    ],
    misconceptions: [
      'Same as web worker',
    ],
    traps: [
      'No cache bust on deploy',
    ],
    strongSignals: [
      'skipWaiting, cache versioning, scope',
    ],
  },
  keyTakeaways: [
    'Background network proxy',
    'install/activate/fetch lifecycle',
    'Cache strategies matter',
    'HTTPS required',
    'Version caches on deploy',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'Main SW events?', answerHint: 'install, activate, fetch.' },
    { level: 'intermediate', question: 'Cache-first vs network-first?', answerHint: 'Offline shell vs fresh API data tradeoff.' },
    { level: 'advanced', question: 'Force SW update?', answerHint: 'New sw.js → skipWaiting → clients.claim.' },
  ],
  flashcards: [
    { front: 'Service worker', back: 'Background script intercepting fetch' },
    { front: 'activate', back: 'Cleanup old caches after new SW installs' },
  ],
  quickRevision: [
    'Register SW',
    'install precache',
    'fetch intercept',
    'Cache versioning',
    'HTTPS only',
    'skipWaiting update',
  ],
}
