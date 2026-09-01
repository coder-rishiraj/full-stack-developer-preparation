import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Lazy loading in React defers loading and rendering of components (or data) until they are needed — typically via React.lazy and dynamic import(), showing a Suspense fallback while the JavaScript chunk downloads and the component module evaluates.',
  whyExists:
    'Users should not pay the cost of code they never visit. Lazy loading reduces initial bundle parse/execute time, improving TTI and LCP on slow devices while keeping full functionality available on demand.',
  mentalModel:
    'Do not load until needed. React.lazy wraps import() promise; first render suspends. Suspense shows fallback. Distinct from list virtualization (DOM rows) and from data lazy-loading (fetch on scroll). Combine route-level lazy with prefetch on hover for balance.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'React.lazy(() => import("./Heavy")) returns component that throws promise on first render if chunk not ready.',
        'Nearest Suspense boundary catches promise, renders fallback.',
        'Chunk loads → promise resolves → React retries render with loaded module.',
        'Default export required (or .then remap for named export).',
        'Preload: const Comp = lazy(...); Comp.preload?.() or manual import() on intent.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'First visit to lazy route',
      diagram: `sequenceDiagram
  participant R as React
  participant B as Browser
  participant CDN
  R->>R: render LazyPage → suspend
  R->>R: show Suspense fallback
  B->>CDN: fetch page.chunk.js
  CDN-->>B: chunk
  R->>R: resume render LazyPage`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Lazy loading vs code splitting',
      text: 'Code splitting is bundler output; lazy loading is runtime trigger to fetch that chunk. You need both: import() splits, React.lazy loads on render.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Component lazy load with Suspense',
      code: `const AdminPanel = lazy(() => import('./AdminPanel'));

function App() {
  const [showAdmin, setShowAdmin] = useState(false);
  return (
    <>
      <button onClick={() => setShowAdmin(true)}>Admin</button>
      {showAdmin && (
        <Suspense fallback={<PanelSkeleton />}>
          <AdminPanel />
        </Suspense>
      )}
    </>
  );
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Prefetch on link hover',
      code: `function NavLink({ to }: { to: string }) {
  const prefetch = () => { import(\`./pages/\${to}\`); };
  return <Link to={to} onMouseEnter={prefetch}>...</Link>;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Suspense for lazy is synchronous throw promise pattern — not async component.',
        'SSR: lazy components need Suspense on server (React 18+) or sync import for critical path.',
        'Multiple lazy children in one Suspense share one fallback until all resolve.',
        'Nested lazy creates sequential chunk waterfalls unless parallelized.',
        'Vite/Webpack emit separate files with hashed names for long-term caching.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Smaller initial JS payload',
      'Load features only when user navigates/opens',
      'Works with route-based architecture naturally',
    ],
    disadvantages: [
      'First-open latency (network + parse)',
      'Requires Suspense fallback UX design',
      'Over-lazy small components adds overhead',
    ],
    alternatives: [
      'Route-based splitting without conditional render',
      'Module federation for micro-frontends',
      'Dynamic import in event handler (non-React lazy)',
    ],
    whenToUse: [
      'Heavy routes, admin, editors, charts, modals rarely opened',
      'Below-fold widgets after interaction',
    ],
    whenNotToUse: [
      'Critical above-the-fold hero UI',
      'Tiny components where chunk cost > savings',
    ],
  },
  failureModes: [
    'Lazy without Suspense — runtime error.',
    'Chunk 404 after deploy — stale CDN cache; need error boundary + reload.',
    'Waterfall: lazy parent renders then lazy child loads sequentially.',
    'Named export without default remap — import fails.',
    'Conditional lazy never preloaded — bad UX on first click.',
  ],
  production: {
    performance: [
      'Route-level lazy first; prefetch likely next route',
      'Avoid lazy layout shell — causes layout shift',
    ],
    reliability: ['ErrorBoundary with retry on chunk load failure'],
    observability: ['RUM track chunk load failures and latency'],
  },
  interview: {
    expectations: [
      'React.lazy + import() + Suspense flow',
      'Difference from virtualization',
      'Initial bundle vs on-demand tradeoff',
    ],
    commonQuestions: [
      'How lazy load a React component?',
      'What shows while lazy component loads?',
      'Can you lazy load named exports?',
    ],
    followUps: [
      'Prefetch strategies?',
      'SSR considerations?',
    ],
    misconceptions: [
      'Lazy loading and code splitting are unrelated',
      'Suspense only for data fetching',
      'Lazy works without Suspense',
    ],
    traps: ['Confusing list virtualization with component lazy loading'],
    strongSignals: [
      'import() async chunk',
      'Suspense fallback required',
      'Route-level highest ROI',
    ],
  },
  keyTakeaways: [
    'React.lazy + dynamic import() defer component load.',
    'Suspense shows fallback while chunk loads.',
    'Route-level lazy gives biggest initial bundle win.',
    'Prefetch on intent reduces perceived latency.',
    'Pair with ErrorBoundary for chunk failures.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What three pieces enable lazy loading in React?',
      answerHint: 'dynamic import(), React.lazy, Suspense fallback.',
    },
    {
      level: 'intermediate',
      question: 'Why lazy load at route level first?',
      answerHint: 'Largest unused code often per-page; one chunk per route is clean split.',
    },
    {
      level: 'advanced',
      question: 'How avoid lazy loading waterfall?',
      answerHint: 'Parallel imports, prefetch, combine chunks, or lift lazy boundary.',
    },
  ],
  flashcards: [
    { front: 'React.lazy', back: 'Wraps import() — suspends until default export ready' },
    { front: 'Suspense role', back: 'Catches suspend, shows fallback UI' },
    { front: 'Lazy vs virtualization', back: 'Lazy = JS chunk; virtualization = DOM rows' },
  ],
  quickRevision: [
    'lazy(() => import())',
    'Suspense fallback required',
    'Route-level first',
    'Default export needed',
    'Prefetch on hover',
    'ErrorBoundary for chunk fail',
  ],
}
