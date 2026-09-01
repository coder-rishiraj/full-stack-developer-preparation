import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Server state vs client state distinguishes data owned by the backend (authoritative, fetched, cached on server or via libraries like React Query) from UI state living in the browser (modal open, draft input, scroll) — each needs different tools, lifetimes, and sync strategies in React apps.',
  whyExists:
    'Treating server data like useState causes stale UI, duplicate fetches, and cache invalidation bugs. Treating UI toggles like global Redux adds noise. Separating concerns lets React Query manage server cache while useState/URL handles ephemeral client state.',
  mentalModel:
    'Server state: async, shared, cacheable, invalidatable, source of truth remote. Client state: synchronous, local or session, lost on refresh unless persisted. TanStack Query/SWR for server; useState/useReducer/URL/Zustand for client UI. Do not copy server data to useState without reason.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Fetch server state with React Query: queryKey identifies cache entry.',
        'Mutations invalidate or optimistically update server cache.',
        'Client UI state colocated in components or lightweight store.',
        'URL state (searchParams) for shareable filters/tabs.',
        'RSC: server state resolved on server; client receives result props.',
      ],
    },
    {
      type: 'table',
      headers: ['Dimension', 'Server state', 'Client state'],
      rows: [
        ['Source', 'API/DB', 'User interaction'],
        ['Lifetime', 'Cached, refetched', 'Session/ephemeral'],
        ['Tooling', 'React Query, RSC fetch', 'useState, URL, Zustand'],
        ['Sharing', 'Global cache', 'Lift/context if needed'],
        ['Stale handling', 'Background refetch', 'Always current locally'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Anti-pattern',
      text: 'useEffect fetch into useState for API data — use React Query instead unless trivial prototype.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'React Query server + local UI state',
      code: `function TodoApp() {
  const [draft, setDraft] = useState('');
  const { data: todos } = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });
  const mutation = useMutation({ mutationFn: createTodo, onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }) });

  return (
    <>
      <input value={draft} onChange={e => setDraft(e.target.value)} />
      <button onClick={() => mutation.mutate(draft)}>Add</button>
      <ul>{todos?.map(t => <li key={t.id}>{t.text}</li>)}</ul>
    </>
  );
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Stale-while-revalidate: show cached server data while refetching.',
        'Optimistic updates temporarily adjust client view before server confirms.',
        'Hydration merges server-rendered HTML with client cache from dehydrate/hydrate.',
        'WebSocket pushes may update server cache entries directly.',
        'Persist client state to localStorage only when product requires (theme, draft).',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Clear ownership reduces bugs',
      'React Query handles loading/error/refetch',
      'UI stays snappy with local state',
    ],
    disadvantages: [
      'Two mental models to teach team',
      'Optimistic rollback complexity',
      'Over-using global store for server data',
    ],
    alternatives: [
      'Redux Toolkit Query unifies if already on Redux',
      'RSC moves more server state resolution server-side',
    ],
    whenToUse: [
      'Any app with API-backed entities',
      'Forms with draft client state + submit to server',
    ],
    whenNotToUse: [
      'Mirror API response into useState on every fetch',
    ],
  },
  failureModes: [
    'useState for user list — no refetch on focus/reconnect.',
    'Redux storing entire API responses without cache policy.',
    'Editing copy of server object — save conflicts on stale base.',
    'Mixing server loading flags with unrelated UI state in one reducer.',
    'Assuming client cache equals server truth after tab idle hours.',
  ],
  production: {
    performance: ['React Query staleTime/gcTime tuned per entity volatility'],
    reliability: ['Mutation error handling and optimistic rollback'],
    maintainability: ['Naming convention: isLoading from query vs isModalOpen local'],
  },
  interview: {
    expectations: [
      'Define server vs client state',
      'Why not useState for API lists',
      'React Query role',
    ],
    commonQuestions: [
      'Where store API data in React?',
      'Difference client and server state?',
      'When use URL for state?',
    ],
    followUps: [
      'Optimistic updates?',
      'RSC impact on split?',
    ],
    misconceptions: [
      'Redux should hold all application state including API',
      'Server state never lives on client',
      'useEffect+useState is standard data fetching',
    ],
    traps: ['Recommending useState for fetched user profile without cache strategy'],
    strongSignals: [
      'React Query for async server cache',
      'useState for UI ephemeral',
      'URL for shareable filters',
    ],
  },
  keyTakeaways: [
    'Server state is async, remote, cacheable — use React Query/RSC.',
    'Client state is local UI — useState/URL/store.',
    'Do not duplicate server data in useState casually.',
    'Invalidate/refetch keeps server view fresh.',
    'Colocate each state type with appropriate tool.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Give examples of client vs server state.',
      answerHint: 'Client: modal open, input draft. Server: user profile from API, product list.',
    },
    {
      level: 'intermediate',
      question: 'Why avoid useEffect+useState for fetching?',
      answerHint: 'No cache, dedupe, background refetch, stale handling — React Query solves.',
    },
    {
      level: 'advanced',
      question: 'How handle optimistic mutation?',
      answerHint: 'onMutate update cache, rollback on error, invalidate on settle.',
    },
  ],
  flashcards: [
    { front: 'Server state', back: 'Remote async data — cache, invalidate, refetch' },
    { front: 'Client state', back: 'Local UI — modals, drafts, toggles' },
    { front: 'React Query purpose', back: 'Server state cache and sync layer' },
  ],
  quickRevision: [
    'Server = remote cache',
    'Client = local UI',
    'React Query for API',
    'useState for ephemeral',
    'URL for shareable',
    'Don’t mirror API in useState',
  ],
}
