import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Static Site Generation (SSG) pre-renders pages to HTML at build time — React frameworks like Next.js generate static HTML/CSS/JS for each route so CDN serves fully formed pages with minimal server compute per request, optionally revalidated on interval (ISR).',
  whyExists:
    'Many pages (marketing, docs, blogs) share same content for all users. SSG eliminates per-request render cost, maximizes cacheability, and delivers fast TTFB globally via CDN while still allowing React hydration for interactivity.',
  mentalModel:
    'Build time = fake request runs getStaticProps/generateStaticParams → HTML files + JSON props. Deploy to CDN. User gets static HTML instantly; React hydrates client bundle. ISR: rebuild single path on timer or on-demand after stale. Contrast SSR (each request) and CSR (empty shell).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Build: framework walks routes, runs data fetching hooks server-side once.',
        'Emit HTML + asset manifests per path.',
        'CDN serves cached HTML; browser downloads JS bundle.',
        'Client hydration attaches event listeners to static DOM.',
        'ISR/on-demand revalidation regenerates stale pages in background.',
      ],
    },
    {
      type: 'table',
      headers: ['Strategy', 'When HTML generated'],
      rows: [
        ['SSG', 'Build time (or ISR regeneration)'],
        ['SSR', 'Each request on server'],
        ['CSR', 'Client after JS loads'],
        ['RSC streaming', 'Server per request with streaming'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'SSG + hydration',
      text: 'SSG is about when HTML is produced. You can still ship React client bundle for interactive islands. Next.js App Router defaults many routes static when no dynamic APIs used.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Next.js App Router static page',
      code: `// No dynamic functions — statically generated at build
export default async function DocsPage() {
  const docs = await getDocsFromCMS(); // runs at build
  return <ArticleList docs={docs} />;
}

export const revalidate = 3600; // ISR: regenerate hourly`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'getStaticPaths defines dynamic SSG routes (e.g. /posts/[id]).',
        'Fallback blocking: first unknown path triggers server generate then cache.',
        'JSON props embedded in HTML or loaded as separate flight payload.',
        'Client navigation may fetch RSC payload for next static page.',
        'Preview mode bypasses static cache for CMS draft review.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Fastest TTFB from CDN edge',
      'Cheap scale — no render farm per traffic spike',
      'Great SEO with full HTML',
    ],
    disadvantages: [
      'Stale content until rebuild/revalidate',
      'Build time grows with page count',
      'Not for highly personalized per-user HTML without hybrid',
    ],
    alternatives: [
      'SSR for always-fresh personalized pages',
      'CSR for authenticated app shells',
      'Edge SSR for middle ground',
    ],
    whenToUse: [
      'Marketing, docs, blogs, e-commerce product shells',
      'Content same for all users with periodic updates',
    ],
    whenNotToUse: [
      'Real-time personalized dashboard per user session',
      'Content changing every second',
    ],
  },
  failureModes: [
    'SSG page calling cookies() — forces dynamic unexpectedly.',
    'Build fails when CMS down — CI blocked.',
    'Hydration mismatch if build-time data differs from client assumption.',
    'Millions of paths — build explosion without incremental static.',
    'Forgetting revalidate — content stale for days.',
  ],
  production: {
    performance: ['CDN cache-control immutable assets; HTML short TTL if ISR'],
    scalability: ['ISR/on-demand revalidation vs full rebuilds'],
    reliability: ['Build-time fallback data if CMS unavailable'],
  },
  interview: {
    expectations: [
      'SSG vs SSR vs CSR timing',
      'ISR concept',
      'Hydration after static HTML',
    ],
    commonQuestions: [
      'What is SSG?',
      'When choose SSG over SSR?',
      'What is ISR?',
    ],
    followUps: [
      'Next.js static detection App Router?',
      'Personalization with SSG?',
    ],
    misconceptions: [
      'SSG means no JavaScript',
      'SSG cannot have dynamic data ever',
      'SSG and CSR are mutually exclusive',
    ],
    traps: ['Saying SSG updates instantly when CMS changes without revalidation'],
    strongSignals: [
      'Build-time HTML generation',
      'CDN delivery',
      'ISR for freshness tradeoff',
    ],
  },
  keyTakeaways: [
    'SSG generates HTML at build time, served from CDN.',
    'Best for shared content with predictable updates.',
    'ISR revalidates static pages without full rebuild.',
    'React still hydrates for interactivity.',
    'Not ideal for per-user realtime HTML.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When is HTML produced in SSG?',
      answerHint: 'At build time (or ISR regeneration), not each user request.',
    },
    {
      level: 'intermediate',
      question: 'SSG vs SSR tradeoff?',
      answerHint: 'SSG fast/cheap CDN; SSR fresh per request but server cost/latency.',
    },
    {
      level: 'advanced',
      question: 'How ISR works in Next.js?',
      answerHint: 'Serve stale static page, background regenerate after revalidate interval or on-demand.',
    },
  ],
  flashcards: [
    { front: 'SSG', back: 'Pre-render HTML at build time; CDN served' },
    { front: 'ISR', back: 'Incremental Static Regeneration — update static pages over time' },
    { front: 'SSG best for', back: 'Shared content: marketing, docs, blogs' },
  ],
  quickRevision: [
    'HTML at build time',
    'CDN edge delivery',
    'Hydration for interactivity',
    'ISR for freshness',
    'Not per-user dynamic',
    'Build time scales with routes',
  ],
}
