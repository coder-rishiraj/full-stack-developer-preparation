import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Data-fetching patterns in React cover how components load remote data — from useEffect + fetch, to libraries like TanStack Query and SWR with caching, deduplication, background refetch, and optimistic updates — separating server state from UI state.',
  whyExists:
    'Raw useEffect fetch duplicates loading flags, race conditions, and cache logic in every screen. Dedicated patterns centralize stale-while-revalidate, error retry, pagination, and cache invalidation — the core of modern SPA architecture.',
  mentalModel:
    'Server state ≠ client state. Server data is cached, shared, and async — keyed by query (url + params). Components declare what they need; library handles fetch, cache, refetch on focus, and dedupe concurrent requests.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Manual: useEffect + fetch + useState(loading/data/error) + AbortController.',
        'Library: useQuery({ queryKey, queryFn }) returns { data, isLoading, error, refetch }.',
        'Mutations: useMutation + onSuccess invalidateQueries to refresh lists.',
        'Prefetch on hover/route loader for perceived speed.',
        'Suspense + use() (React 19) for declarative async boundaries.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'TanStack Query cache flow',
      diagram: `flowchart LR
  Comp[Component useQuery] --> Cache[Query cache]
  Cache -->|miss| Fetch[queryFn fetch]
  Fetch --> Cache
  Cache --> Comp
  Mut[useMutation] -->|invalidate| Cache`,
    },
    {
      type: 'table',
      headers: ['Concern', 'Manual useEffect', 'React Query / SWR'],
      rows: [
        ['Dedup same request', 'Manual Map', 'Built-in'],
        ['Stale background refetch', 'DIY', 'staleTime + refetchOnWindowFocus'],
        ['Cache invalidation', 'Manual state lift', 'queryClient.invalidateQueries'],
        ['Pagination', 'Complex deps', 'useInfiniteQuery'],
        ['SSR hydration', 'Hard', 'dehydrate/hydrate support'],
      ],
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'React Query pattern',
      code: `function UserProfile({ userId }: { userId: string }) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: () => fetchUser(userId),
    staleTime: 60_000,
  });

  if (isLoading) return <Spinner />;
  if (error) return <ErrorBanner error={error} />;
  return <Profile user={data} />;
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Mutation + invalidation',
      code: `const qc = useQueryClient();
const mutation = useMutation({
  mutationFn: createTodo,
  onSuccess: () => qc.invalidateQueries({ queryKey: ['todos'] }),
});`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Race: without abort, slow response overwrites fast — AbortSignal or ignore stale id.',
        'Waterfalls: parent fetch then child fetch — parallelize or route loader batch.',
        'Global fetch in useEffect on app mount — prefer route-level queries.',
        'Optimistic updates: onMutate snapshot + rollback on error.',
        'RSC: fetch on server; pass data as props — zero client waterfall for initial data.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Less boilerplate; consistent loading/error UX',
      'Shared cache across components',
      'Background freshness without spinner flash',
    ],
    disadvantages: [
      'Library bundle and learning curve',
      'Over-caching stale sensitive data if misconfigured',
      'Debugging cache state requires DevTools',
    ],
    alternatives: [
      'Redux Toolkit Query — similar with Redux integration',
      'Relay — GraphQL normalized store',
      'Server Components + fetch in RSC',
    ],
    whenToUse: [
      'Any client-side API-backed UI',
      'Lists, detail pages, infinite scroll',
    ],
    whenNotToUse: [
      'One static fetch — maybe loader sufficient',
      'Replacing form local state with server cache',
    ],
  },
  failureModes: [
    'No AbortController — wrong data after fast navigation.',
    'Fetching in useEffect without deps — stale or duplicate.',
    'Mutating cache without invalidation — UI out of sync.',
    'staleTime Infinity on user-specific data after logout.',
    'Request waterfall: await parent in child instead of parallel queries.',
  ],
  production: {
    performance: [
      'Parallel queries; prefetch routes',
      'staleTime tuned per data freshness needs',
      'Pagination/infinite query for large lists',
    ],
    reliability: ['Retry with backoff; global error boundary + query error UI'],
    security: ['No secrets in queryKey logs; auth token via interceptor'],
    observability: ['React Query DevTools; log mutation failures'],
  },
  interview: {
    expectations: [
      'Server vs client state distinction',
      'useEffect fetch pitfalls',
      'React Query benefits: cache, dedupe, invalidation',
    ],
    commonQuestions: [
      'How fetch data in React?',
      'Problems with useEffect fetch?',
      'What is stale-while-revalidate?',
    ],
    followUps: [
      'Handle race conditions?',
      'Optimistic updates?',
      'RSC vs client fetch?',
    ],
    misconceptions: [
      'useEffect is the recommended fetch API in modern React',
      'Redux required for all server data',
      'isLoading false means data fresh',
    ],
    traps: ['Hand-rolling cache without discussing race/invalidation'],
    strongSignals: [
      'TanStack Query/SWR by name',
      'queryKey as cache identity',
      'invalidate after mutation',
      'AbortSignal for races',
    ],
  },
  keyTakeaways: [
    'Separate server state from UI state.',
    'Prefer React Query/SWR over raw useEffect fetch.',
    'queryKey identifies cache; invalidate after mutations.',
    'Abort or ignore stale responses on navigation.',
    'Avoid fetch waterfalls — parallelize and prefetch.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why not fetch only in useEffect without library?',
      answerHint: 'Boilerplate, no dedupe/cache, race conditions, refetch logic repeated.',
    },
    {
      level: 'intermediate',
      question: 'What is stale-while-revalidate?',
      answerHint: 'Show cached data immediately; refetch in background; update when fresh arrives.',
    },
    {
      level: 'advanced',
      question: 'Fix race when user navigates quickly between ids?',
      answerHint: 'AbortController in queryFn, or ignore responses where id !== current.',
    },
  ],
  flashcards: [
    { front: 'Server state', back: 'Remote async data — cache, shared, invalidated' },
    { front: 'queryKey', back: 'Cache identity for query — e.g. [user, id]' },
    { front: 'stale-while-revalidate', back: 'Serve cache; refetch background' },
  ],
  quickRevision: [
    'Server state ≠ useState',
    'React Query / SWR preferred',
    'queryKey + queryFn',
    'invalidate after mutation',
    'Abort stale requests',
    'Avoid fetch waterfalls',
  ],
}
