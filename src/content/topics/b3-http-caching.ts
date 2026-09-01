import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'HTTP caching stores responses in browser and intermediary caches (CDN, proxy) so repeat requests can be served without re-fetching — controlled by Cache-Control, ETag, Last-Modified, and Vary headers defining freshness, validation, and storage rules.',
  whyExists:
    'Network latency dominates web perf. Static assets and cacheable API responses should reuse stored copies. Proper caching cuts bandwidth, improves LCP, and reduces server load while keeping data fresh via revalidation.',
  mentalModel:
    'Each response carries caching instructions. strong cache (max-age) serves from disk without network. stale cache may revalidate with ETag/If-None-Match → 304 Not Modified. no-store means never cache — use for personalized/auth data.',
  howItWorks: [
    {
      type: 'table',
      headers: ['Directive', 'Meaning'],
      rows: [
        ['max-age=N', 'Fresh for N seconds — no revalidation needed'],
        ['no-cache', 'May store but must revalidate before use'],
        ['no-store', 'Do not store anywhere'],
        ['private', 'Browser only, not CDN shared cache'],
        ['public', 'CDN may cache'],
        ['immutable', 'Never revalidate for max-age period (hashed filenames)'],
        ['stale-while-revalidate', 'Serve stale while fetching fresh in background'],
      ],
    },
    {
      type: 'list',
      ordered: true,
      items: [
        'Browser checks cache before network (memory → disk → HTTP).',
        'Fresh entry: return immediately (from disk cache).',
        'Stale: conditional request with If-None-Match (ETag) or If-Modified-Since.',
        '304 response: reuse body; update freshness headers.',
        '200 response: replace cache entry.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Validation flow',
      diagram: `sequenceDiagram
  participant B as Browser
  participant S as Server
  B->>S: GET /app.js If-None-Match: "abc123"
  alt unchanged
    S-->>B: 304 Not Modified
  else changed
    S-->>B: 200 + new body + ETag
  end`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'http',
      caption: 'Hashed asset vs API',
      code: `# Vite/webpack output — long cache
Cache-Control: public, max-age=31536000, immutable

# HTML entry — short cache, revalidate
Cache-Control: no-cache

# Authenticated API
Cache-Control: private, no-store`,
    },
    {
      type: 'code',
      language: 'javascript',
      caption: 'fetch cache modes',
      code: `fetch('/api/public-config', { cache: 'force-cache' });
fetch('/api/me', { cache: 'no-store' }); // default for credentialed often

// Service Worker can intercept and implement custom strategies:
// cache-first, network-first, stale-while-revalidate`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Heuristic caching if no Cache-Control but Last-Modified present (legacy).',
        'Vary header — separate cache entries per Accept-Encoding, Origin, etc.',
        'CDN respects Cache-Control; Set-Cookie responses usually uncacheable.',
        'HTTP/2 multiplexing does not replace caching — complements it.',
        'React Query/SWR client cache is separate layer atop HTTP cache.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Dramatic repeat-visit performance',
      'CDN edge caching reduces origin load',
      '304 validation saves bandwidth on unchanged assets',
    ],
    disadvantages: [
      'Stale data if max-age too long without hashing',
      'Mis-cached personalized responses leak data across users',
      'Debugging “old JS” when cache aggressive',
    ],
    alternatives: [
      'Client-side SWR/React Query with short staleTime',
      'Service Worker strategies for offline',
    ],
    whenToUse: [
      'Fingerprinted static assets: immutable + long max-age',
      'Public GET APIs with ETag validation',
    ],
    whenNotToUse: [
      'no-store for auth/user-specific responses',
      'Long max-age on index.html without revalidation',
    ],
  },
  failureModes: [
    'Caching index.html aggressively — users stuck on old bundle references.',
    'public cache on Set-Cookie response — shared CDN serves user A data to user B.',
    'Missing Vary: Accept-Encoding — wrong compression served.',
    'ETag on dynamic gzip content changes every request — cache useless.',
    'Assuming fetch always bypasses cache (depends on cache mode and headers).',
  ],
  production: {
    performance: [
      'Content-hash filenames + immutable for JS/CSS',
      'Short/no-cache for HTML shell',
      'stale-while-revalidate on semi-static API',
    ],
    security: ['private/no-store on authenticated endpoints'],
    observability: ['DevTools Network: Size column (disk cache vs network)'],
  },
  interview: {
    expectations: [
      'Cache-Control directives explained',
      'ETag / 304 revalidation',
      'Immutable hashed assets pattern',
    ],
    commonQuestions: [
      'Difference no-cache vs no-store?',
      'How ETag works?',
      'How cache bust JS in production?',
    ],
    followUps: [
      'CDN caching behavior?',
      'HTTP cache vs React Query cache?',
    ],
    misconceptions: [
      'no-cache means do not cache (means must revalidate)',
      'ETag always better than max-age alone',
      'Browser ignores cache for fetch',
    ],
    traps: ['Recommending long cache on index.html'],
    strongSignals: [
      'immutable + hashed filenames',
      'no-store for personalized data',
      '304 conditional request flow',
    ],
  },
  keyTakeaways: [
    'Cache-Control drives browser and CDN behavior.',
    'no-store: never cache; no-cache: revalidate before use.',
    'ETag + If-None-Match enables 304 bandwidth savings.',
    'Hashed assets: public, max-age=1y, immutable.',
    'HTML entry: short cache or no-cache.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'no-cache vs no-store?',
      answerHint: 'no-store: don’t persist; no-cache: may store but must revalidate with server before use.',
    },
    {
      level: 'intermediate',
      question: 'Why filename content hash in build output?',
      answerHint: 'Safe long immutable cache — URL change forces new download when content changes.',
    },
    {
      level: 'advanced',
      question: 'Risk of public CDN caching API with Set-Cookie?',
      answerHint: 'Shared cache may serve one user’s response to another — use private/no-store.',
    },
  ],
  flashcards: [
    { front: 'no-store', back: 'Never store response in any cache' },
    { front: 'immutable', back: 'No revalidation needed during max-age — for hashed files' },
    { front: '304', back: 'Not Modified — reuse cached body after validation' },
  ],
  quickRevision: [
    'Cache-Control is primary knob',
    'max-age = fresh period',
    'no-cache ≠ no-store',
    'ETag conditional requests',
    'Hash assets + immutable',
    'no-store for auth data',
  ],
}
