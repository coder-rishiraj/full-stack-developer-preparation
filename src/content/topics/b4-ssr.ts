import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Server-Side Rendering (SSR) generates HTML on the server for each request (or per cached request) before sending to the browser — React renderToString/renderToPipeableStream produces markup with data so users see content before JS hydrates, improving SEO and first paint vs pure CSR.',
  whyExists:
    'Empty CSR shell hurts SEO and slow networks see blank page until bundle loads. SSR sends meaningful HTML immediately while React client bundle hydrates for interactivity — balance freshness and discoverability for dynamic personalized pages.',
  mentalModel:
    'Request hits server → fetch data → React render to HTML stream → browser paints → download JS → hydrate (attach events, reconcile). Each request can differ (user session). Streaming SSR sends shell first, Suspense boundaries fill later. Cost: server CPU per request.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Server receives HTTP request with cookies/headers.',
        'Data loaders run (getServerSideProps, App Router async server component).',
        'React renders component tree to HTML string or stream.',
        'Response includes HTML + link to client JS/CSS.',
        'Browser displays HTML; ReactDOM.hydrateRoot attaches to existing DOM.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'SSR request flow',
      diagram: `sequenceDiagram
  participant B as Browser
  participant S as Server
  participant API
  B->>S: GET /dashboard
  S->>API: fetch user data
  API-->>S: JSON
  S->>S: React render HTML
  S-->>B: HTML + assets
  B->>B: paint content
  B->>B: hydrate React`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Hydration mismatch',
      text: 'Server HTML must match client first render — Date.now(), random IDs, or browser-only APIs in render cause mismatch errors.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Next.js dynamic SSR page',
      code: `export default async function DashboardPage() {
  const session = await getSession(); // per-request
  const stats = await fetchStats(session.userId);
  return <Dashboard stats={stats} user={session.user} />;
}
// Using cookies()/headers() opts into dynamic SSR`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'renderToPipeableStream (React 18) enables progressive HTML flush.',
        'All-or-nothing data blocking deprecated — prefer streaming Suspense.',
        'Hydration is not second full render from scratch — reconciler attaches.',
        'Selective hydration prioritizes interactive regions (React 18+).',
        'SSR + RSC: server components in stream, client components hydrate.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Fast meaningful first paint',
      'SEO crawlers see content',
      'Per-request personalization',
    ],
    disadvantages: [
      'Server load scales with traffic',
      'TTFB includes data fetch + render latency',
      'Hydration cost still on client',
    ],
    alternatives: [
      'SSG/ISR for cacheable pages',
      'CSR for authenticated app behind login',
      'Edge SSR closer to user',
    ],
    whenToUse: [
      'Personalized pages, auth-gated content needing SEO',
      'Frequently changing shared pages not build-friendly',
    ],
    whenNotToUse: [
      'Static marketing fully cacheable — prefer SSG',
      'Heavy interactivity with no SEO need — CSR simpler ops',
    ],
  },
  failureModes: [
    'Hydration mismatch from non-deterministic render.',
    'Serial data fetch on server — slow TTFB waterfall.',
    'Leaking secrets into HTML props visible in view-source.',
    'window used during SSR — crash or mismatch.',
    'Huge HTML payload — slow download negates SSR benefit.',
  ],
  production: {
    performance: ['Parallel server fetches; stream with Suspense'],
    scalability: ['Cache SSR output at CDN with short TTL when acceptable'],
    reliability: ['Error boundaries and fallbacks on server render failures'],
    security: ['Never embed secrets in serialized props to client'],
  },
  interview: {
    expectations: [
      'SSR vs CSR vs SSG comparison',
      'Hydration definition and pitfalls',
      'Streaming SSR benefit',
    ],
    commonQuestions: [
      'What is SSR in React?',
      'What is hydration?',
      'SSR disadvantages?',
    ],
    followUps: [
      'Fix hydration mismatch?',
      'SSR with React 18 streaming?',
    ],
    misconceptions: [
      'SSR eliminates need for client JavaScript',
      'Hydration rerenders entire page from zero ignoring server HTML',
      'SSR always faster than CSR for TTI',
    ],
    traps: ['Ignoring TTFB server latency when claiming SSR always faster'],
    strongSignals: [
      'HTML per request with data',
      'Hydration attaches interactivity',
      'Deterministic server/client render',
    ],
  },
  keyTakeaways: [
    'SSR renders HTML on server per request with data.',
    'Browser paints HTML before full hydration completes.',
    'Hydration must match server markup.',
    'Streaming improves TTFB for slow data sources.',
    'Trade server cost for freshness and SEO.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is hydration?',
      answerHint: 'Client React attaches to server-rendered HTML and binds events.',
    },
    {
      level: 'intermediate',
      question: 'SSR vs SSG when to choose?',
      answerHint: 'SSR per-request dynamic/personalized; SSG build-time shared static.',
    },
    {
      level: 'advanced',
      question: 'Common hydration mismatch causes?',
      answerHint: 'Date/random, browser-only APIs, invalid HTML nesting, extension DOM changes.',
    },
  ],
  flashcards: [
    { front: 'SSR', back: 'HTML rendered on server per request before client JS' },
    { front: 'Hydration', back: 'Client React reconciles with existing server HTML' },
    { front: 'Hydration mismatch', back: 'Server HTML ≠ client first render' },
  ],
  quickRevision: [
    'HTML on each request',
    'Data fetch on server',
    'Paint before hydrate',
    'Match server/client render',
    'Streaming Suspense',
    'Server CPU cost',
  ],
}
