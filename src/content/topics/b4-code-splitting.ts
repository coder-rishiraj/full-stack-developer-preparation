import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Code splitting breaks a JavaScript bundle into smaller chunks loaded on demand — via dynamic import() and React.lazy — so initial page load downloads only critical code while routes and heavy components fetch separately when needed.',
  whyExists:
    'Monolithic bundles slow first parse/execute on mobile. Users visiting /login should not download the admin chart library. Splitting aligns bytes delivered with current route and interaction, improving TTI and LCP.',
  mentalModel:
    "Static imports bundle together at build time. import('./Chart') creates async chunk. React.lazy wraps default export; Suspense shows fallback while chunk loads. Router-level split is the highest ROI first step.",
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Bundler (Vite/Webpack) analyzes dynamic import() → separate chunk files.',
        'Browser fetches chunk on first execution of import promise.',
        "React.lazy(() => import('./Page')) returns component that suspends until loaded.",
        'Suspense boundary renders fallback during chunk fetch.',
        'Route-based splitting: lazy each page component in router config.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Load sequence',
      diagram: `sequenceDiagram
  participant U as User
  participant B as Browser
  participant CDN as CDN
  U->>B: Visit /dashboard
  B->>CDN: main.js (already cached)
  B->>CDN: dashboard.chunk.js
  CDN-->>B: chunk
  B->>B: render Dashboard`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Split priority',
      text: '1) Routes 2) Heavy modals/editors 3) Rarely used features. Do not lazy every button — chunk overhead adds latency.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Route-level lazy + Suspense',
      code: `const Dashboard = lazy(() => import('./pages/Dashboard'));
const Settings = lazy(() => import('./pages/Settings'));

function AppRoutes() {
  return (
    <Suspense fallback={<RouteSkeleton />}>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
    </Suspense>
  );
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Named export lazy wrapper',
      code: `const MarkdownEditor = lazy(() =>
  import('./MarkdownEditor').then(m => ({ default: m.MarkdownEditor }))
);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Webpack magic comments: import(/* webpackChunkName: "admin" */ ...) for naming.',
        'Preload: <link rel="modulepreload"> injected by bundler for critical chunks.',
        'SSR: lazy components need same Suspense on server or sync import for critical path.',
        'Error boundary catches chunk load failure (network) — retry UI.',
        'Vendor split: react/react-dom separate chunk — long cache immutable.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Smaller initial bundle — faster first load',
      'Cache granular chunks independently',
      'Pay-for-what-you-visit bandwidth',
    ],
    disadvantages: [
      'Extra HTTP round-trip on first navigation to lazy route',
      'Suspense fallback UX must be designed',
      'Over-splitting increases request count',
    ],
    alternatives: [
      'Manual chunks in vite.config rollupOptions',
      'Module federation for micro-frontends',
      'External CDN for large libs (careful with duplication)',
    ],
    whenToUse: [
      'Route pages, admin sections, heavy editors/charts',
      'Features behind feature flags',
    ],
    whenNotToUse: [
      'Above-the-fold critical UI on landing',
      'Tiny components where chunk overhead > savings',
    ],
  },
  failureModes: [
    'No Suspense above lazy — React throws.',
    'Chunk load fails offline — white screen without error boundary.',
    'Lazy loading layout shell — layout shift on every route.',
    'Default export missing — lazy import fails.',
    'Waterfall: lazy parent then lazy child sequential loads.',
  ],
  production: {
    performance: [
      'Route-level split first; analyze bundle with rollup-plugin-visualizer',
      'Prefetch next likely route on hover (React Router lazy + link prefetch)',
      'modulepreload for critical dynamic imports',
    ],
    reliability: ['ErrorBoundary with retry on chunk load failure'],
    observability: ['Track chunk load errors in RUM'],
  },
  interview: {
    expectations: [
      'dynamic import + React.lazy + Suspense',
      'Route-based splitting rationale',
      'Initial bundle vs on-demand tradeoff',
    ],
    commonQuestions: [
      'What is code splitting?',
      'How lazy load React component?',
      'Suspense role?',
    ],
    followUps: [
      'Vendor chunk strategy?',
      'SSR with lazy components?',
    ],
    misconceptions: [
      'Code splitting happens at runtime automatically without import()',
      'Lazy every component is best practice',
      'Suspense only for data fetching (also code loading)',
    ],
    traps: ['Lazy loading without Suspense boundary'],
    strongSignals: [
      'import() creates async chunk',
      'Route-level split highest ROI',
      'Error boundary for failed chunk',
    ],
  },
  keyTakeaways: [
    'Split bundle via dynamic import() at build time.',
    'React.lazy + Suspense for component-level loading.',
    'Route-based splitting is first optimization.',
    'Trade initial size for extra request on first visit.',
    'Error boundary handles chunk load failures.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'How code split in React?',
      answerHint: 'React.lazy(() => import("./Comp")) wrapped in Suspense fallback.',
    },
    {
      level: 'intermediate',
      question: 'Why not lazy load everything?',
      answerHint: 'Each chunk adds HTTP latency; critical path should stay in main bundle.',
    },
    {
      level: 'advanced',
      question: 'What happens if lazy chunk fails to load?',
      answerHint: 'Promise rejects; need ErrorBoundary or retry — otherwise render error.',
    },
  ],
  flashcards: [
    { front: 'React.lazy', back: 'Wraps dynamic import default export; suspends until loaded' },
    { front: 'Suspense with lazy', back: 'Shows fallback while chunk downloading' },
    { front: 'Route split', back: 'Lazy each page — biggest initial bundle win' },
  ],
  quickRevision: [
    'import() = async chunk',
    'React.lazy + Suspense',
    'Split by route first',
    'Smaller initial bundle',
    'Extra request on first lazy nav',
    'ErrorBoundary for chunk fail',
  ],
}
