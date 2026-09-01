import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Network waterfalls in frontend apps are sequential chains of requests where each fetch waits for a previous one to finish — in React apps this often appears as nested useEffects, parent-then-child data fetches, or route-then-component lazy loads that multiply latency on critical paths.',
  whyExists:
    'Dependencies between resources are real (need user id before profile), but accidental serialization wastes RTT. Waterfalls dominate mobile LCP when HTML → JS → API → nested API run one after another instead of parallel where independent.',
  mentalModel:
    'Draw the request timeline. Parallel independent fetches. Lift data requirements to route loaders (React Router, Next.js) or fetch in parallel with Promise.all. Avoid child useEffect fetch that waits for parent fetch unless truly dependent. Prefetch on hover/navigation intent.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Classic: HTML → parse → download main.js → execute → fetch /api/user → render → child fetch /api/posts.',
        'Each hop adds at least one RTT; 4 serial hops on 200ms latency = 800ms before content.',
        'React.lazy waterfall: layout chunk then page chunk then data.',
        'useEffect chains: fetch A in parent, pass id to child, child fetches B in effect.',
        'Fix: parallel fetch at route, GraphQL single round-trip, or Suspense with parallel queries.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Waterfall vs parallel',
      diagram: `gantt
  title Request timing
  dateFormat X
  axisFormat %L ms
  section Waterfall
  HTML :0, 100
  JS   :100, 200
  API1 :200, 300
  API2 :300, 400
  section Parallel
  HTML :0, 100
  JS   :100, 200
  API1 :200, 300
  API2 :200, 300`,
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Waterfall detector',
      text: 'Chrome Network panel: requests start staggered not overlapped. React Query devtools: queries queued serially when they could run together.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Waterfall anti-pattern',
      code: `function Page() {
  const [user, setUser] = useState<User | null>(null);
  useEffect(() => { fetchUser().then(setUser); }, []);
  if (!user) return null;
  return <Posts userId={user.id} />; // Posts fetches in its own effect — serial
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Parallel fetch at route',
      code: `// React Router loader / Next.js server component
async function loader() {
  const [user, posts] = await Promise.all([fetchUser(), fetchPosts()]);
  return { user, posts };
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'HTTP/2 multiplexing helps parallel requests on one connection — still avoid logical dependency chains.',
        'SSR/SSG moves some fetches to server eliminating client round-trip entirely.',
        'Link rel=preload/modulepreload reduces JS chunk waterfall.',
        'TanStack Query parallel queries with independent queryKeys start together.',
        'Suspense with multiple children can trigger parallel resource reads if structured correctly.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Parallel fetching cuts wall-clock latency dramatically',
      'Route loaders centralize data requirements',
      'Prefetch improves perceived navigation speed',
    ],
    disadvantages: [
      'Parallel requires knowing all needed data upfront',
      'Over-fetching if parallel requests unused',
      'More complex caching invalidation',
    ],
    alternatives: [
      'GraphQL / BFF single aggregated endpoint',
      'Server Components fetch on server in parallel',
      'HTTP Early Hints / 103 for critical assets',
    ],
    whenToUse: [
      'Audit critical path LCP and route transitions',
      'Dashboard with multiple independent widgets',
    ],
    whenNotToUse: [
      'Truly sequential dependency (need token before refresh)',
    ],
  },
  failureModes: [
    'Nested useEffect fetches — N+1 API pattern in component tree.',
    'Await inside sequential async functions in loader without Promise.all.',
    'Lazy route then data fetch — double wait on navigation.',
    'Fetching in render (anti-pattern) blocking sequential logic.',
    'Ignoring slow third-party scripts blocking first fetch.',
  ],
  production: {
    performance: [
      'Promise.all at route level; preload critical chunks',
      'RUM measure navigation timing and TTFB/LCP',
    ],
    reliability: ['Partial failure handling when one parallel fetch fails'],
    observability: ['Network waterfall in DevTools as release checklist'],
  },
  interview: {
    expectations: [
      'Define network waterfall',
      'Detect in React app architecture',
      'Fix with parallel fetch / loaders',
    ],
    commonQuestions: [
      'What causes request waterfall in SPA?',
      'How React Query helps?',
      'SSR effect on waterfalls?',
    ],
    followUps: [
      'Suspense and parallel data?',
      'Prefetch strategies?',
    ],
    misconceptions: [
      'HTTP/2 eliminates all waterfall concerns',
      'useEffect on mount is always fine for data',
      'Code splitting never causes waterfalls',
    ],
    traps: ['Only mentioning CDN without serial fetch chains'],
    strongSignals: [
      'Promise.all / parallel queries',
      'Route-level data loading',
      'Measure network timeline',
    ],
  },
  keyTakeaways: [
    'Waterfall = sequential waits stacking latency.',
    'Common in nested effects and lazy-then-fetch.',
    'Parallelize independent requests at route.',
    'SSR/SSG removes client round-trips.',
    'Prefetch and preload shrink navigation gaps.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What is a network waterfall?',
      answerHint: 'Requests that start only after previous completes, serializing latency.',
    },
    {
      level: 'intermediate',
      question: 'How do nested useEffects cause waterfalls?',
      answerHint: 'Parent fetch completes → child mounts → child fetch starts; could parallelize if independent.',
    },
    {
      level: 'advanced',
      question: 'How fix waterfall in Next.js App Router?',
      answerHint: 'Parallel fetch in server components, streaming, prefetch, colocate data at page level.',
    },
  ],
  flashcards: [
    { front: 'Network waterfall', back: 'Serial requests each waiting on prior — latency sums' },
    { front: 'Common React cause', back: 'Parent effect fetch then child effect fetch' },
    { front: 'Fix pattern', back: 'Promise.all, route loader, parallel query keys' },
  ],
  quickRevision: [
    'Serial = latency sums',
    'Audit Network panel',
    'Parallel independent fetches',
    'Route loaders',
    'Avoid nested effect fetch',
    'SSR removes client RTT',
  ],
}
