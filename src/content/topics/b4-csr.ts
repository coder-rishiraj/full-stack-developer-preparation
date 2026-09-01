import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Client-Side Rendering (CSR) is a web architecture where the browser downloads a minimal HTML shell and JavaScript bundle, then React (or similar) renders the entire UI in the client — fetching data and building DOM after JS executes.',
  whyExists:
    'CSR enables rich interactive SPAs with client routing, instant navigations after load, and deployment as static assets on CDN without server HTML generation per request — ideal for authenticated dashboards and highly interactive apps.',
  mentalModel:
    'Blank or spinner HTML → download JS → hydrate/render app → client router → fetch APIs → paint content. First paint waits on JS parse/execute; subsequent navigations avoid full page reload.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Server returns index.html with <div id="root"> and script tags.',
        'Browser downloads, parses, executes JS bundle.',
        'ReactDOM.createRoot(...).render mounts app (or hydrate if SSR).',
        'Router reads URL; components mount and fetch data client-side.',
        'Navigation via history API — swap components without document reload.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'CSR timeline',
      diagram: `sequenceDiagram
  participant B as Browser
  participant CDN as CDN
  participant API as API
  B->>CDN: GET index.html
  CDN-->>B: shell + script tags
  B->>CDN: GET app.js bundle
  B->>B: parse + execute React
  B->>API: GET /api/data
  API-->>B: JSON
  B->>B: render UI`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'CSR vs SSR vs SSG',
      text: 'CSR: render in browser. SSR: HTML per request on server. SSG: HTML at build time. Hybrid (Next.js) mixes per route.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Classic CRA/Vite CSR entry',
      code: `// index.html: <div id="root"></div><script type="module" src="/src/main.tsx">
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>
);`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Client route + data fetch',
      code: `function DashboardPage() {
  const { data, isLoading } = useQuery({ queryKey: ['stats'], queryFn: fetchStats });
  if (isLoading) return <PageSkeleton />;
  return <Dashboard stats={data} />;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'TTFB low (static HTML) but FCP/LCP delayed until JS + data.',
        'SEO crawlers execute JS better now but SSR/SSG still safer for content sites.',
        'Code splitting reduces initial bundle — still CSR for each chunk load.',
        'Auth tokens often in memory or HttpOnly cookie + client fetch.',
        'React 18 Strict Mode double mount exposes effect bugs in dev.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Rich interactivity after load',
      'Static hosting on CDN — cheap scale',
      'Clear separation: frontend SPA + API backend',
    ],
    disadvantages: [
      'Slow first contentful paint on slow devices/networks',
      'SEO challenges for public content',
      'Blank screen without JS or during load',
    ],
    alternatives: [
      'SSR for first paint + SEO',
      'SSG for marketing pages',
      'RSC + streaming for hybrid',
    ],
    whenToUse: [
      'Authenticated dashboards, admin tools',
      'Highly interactive apps behind login',
    ],
    whenNotToUse: [
      'Public marketing/blog needing SEO and fast LCP',
      'Low-powered devices with huge initial bundle',
    ],
  },
  failureModes: [
    'Giant initial bundle — long white screen.',
    'Fetch waterfall on dashboard mount — serial loading spinners.',
    'No loading/error UI — broken UX on slow API.',
    'Assuming SEO without testing rendered HTML.',
    'Client-only env vars leaked into bundle (VITE_* exposure).',
  ],
  production: {
    performance: [
      'Code split by route; lazy load heavy pages',
      'Skeleton screens; parallel data fetch',
      'Prefetch on navigation intent',
    ],
    reliability: ['Error boundaries; offline messaging'],
    observability: ['Web Vitals LCP/FCP monitoring; bundle size CI budget'],
  },
  interview: {
    expectations: [
      'CSR flow: HTML shell → JS → render → fetch',
      'Tradeoffs vs SSR/SSG',
      'SEO and first paint implications',
    ],
    commonQuestions: [
      'What is CSR?',
      'CSR vs SSR?',
      'When choose CSR?',
    ],
    followUps: [
      'Improve CSR first load?',
      'How SEO with CSR?',
    ],
    misconceptions: [
      'CSR means no server (API server still required)',
      'CSR always faster after first load (depends on data fetching)',
      'React requires CSR only',
    ],
    traps: ['Recommending CSR for public SEO-critical landing page'],
    strongSignals: [
      'First paint waits on JS',
      'Static CDN hosting benefit',
      'Code splitting + data fetching patterns for perf',
    ],
  },
  keyTakeaways: [
    'CSR renders UI in browser after JS loads.',
    'Minimal HTML shell + JS bundle + client API fetch.',
    'Fast navigations after initial load; slow first paint risk.',
    'Good for dashboards; poor for SEO-first public content.',
    'Mitigate with code splitting, skeletons, React Query.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is Client-Side Rendering?',
      answerHint: 'Browser downloads JS and renders UI client-side; HTML shell mostly empty initially.',
    },
    {
      level: 'intermediate',
      question: 'CSR vs SSR tradeoffs?',
      answerHint: 'CSR: rich SPA, CDN static, slow FCP; SSR: faster first paint, SEO, server cost.',
    },
    {
      level: 'advanced',
      question: 'How improve CSR LCP without SSR?',
      answerHint: 'Code split, preload critical JS, skeleton UI, edge-cached shell, parallel fetch, smaller bundle.',
    },
  ],
  flashcards: [
    { front: 'CSR', back: 'Render UI in browser after JS executes' },
    { front: 'CSR weakness', back: 'Slow first paint; SEO challenges' },
    { front: 'CSR strength', back: 'Interactive SPA; static CDN deploy' },
  ],
  quickRevision: [
    'HTML shell + JS bundle',
    'React renders in browser',
    'Client router + API fetch',
    'Slow FCP; fast after load',
    'Dashboards not SEO pages',
    'Split code + parallel fetch',
  ],
}
