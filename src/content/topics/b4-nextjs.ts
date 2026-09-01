import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt: 'Next.js is React meta-framework with file-based routing, SSR/SSG/ISR, React Server Components (RSC), API routes, and built-in optimization (image, font, code splitting).',
  whyExists: 'SPAs hurt SEO and first paint. Next.js unifies routing, data fetching at build/request time, and deployment patterns for production React apps.',
  mentalModel: 'Pages/app router map URLs to components; server renders HTML shell + streams RSC payload; client hydrates interactive islands; data fetch colocated with route.',
  howItWorks: [
    { type: 'list', items: [
      'App Router (app/): layouts, loading.tsx, error boundaries, RSC by default',
      'Server Components fetch DB directly; Client Components use \'use client\'',
      'SSR: render on request; SSG: build time; ISR: revalidate interval',
      'Route handlers replace pages/api REST endpoints',
      'Middleware for auth, redirects, geo at edge',
    ] },
  ],
  example: [
    { type: 'code', language: 'typescript', code: '// app/posts/[id]/page.tsx — Server Component\nexport default async function Page({ params }: { params: { id: string } }) {\n  const post = await db.post.find(params.id);\n  return <Article post={post} />;\n}', caption: 'RSC data fetch' },
  ],
  tradeoffs: {
    advantages: [
      'SEO + fast FCP',
      'Colocated routing/data',
      'Vercel-optimized defaults',
    ],
    disadvantages: [
      'RSC mental model steep',
      'Vendor coupling if Vercel-specific',
    ],
    alternatives: [
      'Remix',
      'Vite SPA + SSR manual',
    ],
    whenToUse: [
      'Production React sites',
      'Content + dashboards',
    ],
    whenNotToUse: [
      'Tiny widget embed',
    ],
  },
  failureModes: [
    'Accidentally marking entire tree \'use client\'',
    'Fetching in client useEffect losing SSR benefit',
    'ISR stale content without on-demand revalidate',
    'Leaking secrets in client bundle',
  ],
  production: {
    performance: [
      'RSC for data-heavy; dynamic import client widgets',
    ],
    scalability: [
      'Edge middleware; CDN cache static',
    ],
    observability: [
      'Web vitals RUM; server timing headers',
    ],
    security: [
      'Env vars server-only; validate server actions',
    ],
  },
  interview: {
    expectations: [
      'SSR vs SSG vs ISR',
      'RSC vs client components',
    ],
    commonQuestions: [
      'Next.js rendering modes?',
    ],
    followUps: [
      'When Server Component?',
    ],
    misconceptions: [
      'All Next.js is SSR',
    ],
    traps: [
      'useEffect fetch on landing page',
    ],
    strongSignals: [
      'App router, RSC boundaries, caching tags',
    ],
  },
  keyTakeaways: [
    'File-based routing app/',
    'RSC default — \'use client\' when needed',
    'SSR/SSG/ISR tradeoffs',
    'Server Actions for mutations',
    'Middleware at edge',
  ],
  interviewQuestions: [
    { level: 'basic', question: 'SSR vs SSG?', answerHint: 'SSR per request; SSG at build time.' },
    { level: 'intermediate', question: 'Server vs Client Component?', answerHint: 'Server: data/no hooks; Client: interactivity/hooks.' },
    { level: 'advanced', question: 'ISR use case?', answerHint: 'Semi-static pages revalidated on interval without full rebuild.' },
  ],
  flashcards: [
    { front: 'RSC', back: 'Server-rendered React; no client JS by default' },
    { front: 'ISR', back: 'Incremental static regen with revalidate timer' },
  ],
  quickRevision: [
    'App router',
    'RSC + use client',
    'SSR/SSG/ISR',
    'Route handlers',
    'Middleware edge',
    'Server Actions',
  ],
}
