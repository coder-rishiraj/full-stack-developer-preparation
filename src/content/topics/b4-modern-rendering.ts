import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The modern React rendering model (React 18+) treats rendering as interruptible, prioritizable work — using fibers, concurrent features (transitions, Suspense), automatic batching, and selective hydration so the UI stays responsive during expensive updates and async data loading.',
  whyExists:
    'Legacy synchronous render blocked the main thread on large updates. Users expect instant input feedback even while heavy lists filter or routes load. Concurrent rendering lets React pause low-priority work, resume, discard stale renders, and coordinate with Suspense and streaming SSR.',
  mentalModel:
    'Two lanes: urgent (typing, clicks) vs transition (tab switch, search filter). useTransition marks updates low-priority. Render can be interrupted and retried. Suspense coordinates async UI. Server streams HTML; client hydrates selectively. Still one reconciler — scheduling changed, not the component model.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Render phase may run multiple times (discarded) before commit.',
        'useTransition / startTransition deprioritizes state updates inside callback.',
        'Suspense boundaries show fallback while children suspend on data/chunks.',
        'Automatic batching: multiple setStates in async/promises batch one commit (React 18).',
        'Hydration: attach event listeners to server HTML without full client re-render first.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Priority lanes',
      diagram: `flowchart LR
  Input[User input] --> Urgent[Urgent update]
  Filter[Search filter] --> Transition[Transition update]
  Urgent --> Commit[Commit to DOM]
  Transition -->|may interrupt| Render[Concurrent render]
  Render --> Commit`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Not automatic magic',
      text: 'Concurrent features need intentional API use — useTransition for non-urgent UI, Suspense for async boundaries. Legacy sync code still works but misses prioritization.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'useTransition for responsive search',
      code: `function Search() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Item[]>(items);
  const [isPending, startTransition] = useTransition();

  const onChange = (q: string) => {
    setQuery(q); // urgent — input stays snappy
    startTransition(() => {
      setResults(filterItems(items, q)); // low priority
    });
  };

  return (
    <>
      <input value={query} onChange={e => onChange(e.target.value)} />
      {isPending && <Spinner />}
      <Results items={results} />
    </>
  );
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Fiber architecture: unit of work with lanes/priorities (implementation detail).',
        'Double render in Strict Mode surfaces impure render bugs for concurrent safety.',
        'useDeferredValue delays showing fast-changing value — similar UX to transition.',
        'Streaming SSR: shell first, Suspense holes stream later.',
        'Selective hydration: interactive regions hydrate before off-screen content.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Responsive UI during heavy renders',
      'Better perceived perf with transitions',
      'Unified Suspense for data and code',
      'Streaming improves TTFB and LCP',
    ],
    disadvantages: [
      'Mental model complexity',
      'Impure renders break with concurrent retries',
      'Library ecosystem still catching up on Suspense data',
    ],
    alternatives: [
      'Debouncing without transitions (less integrated)',
      'Web Workers for CPU (parallel to React scheduling)',
    ],
    whenToUse: [
      'Large list filtering, tab switches, route transitions',
      'Streaming SSR apps (Next.js App Router)',
    ],
    whenNotToUse: [
      'External mutable reads during render without sync external store',
      'Assuming single render pass in effects tied to discarded renders',
    ],
  },
  failureModes: [
    'Mutating external variable during render — torn UI across concurrent renders.',
    'Missing Suspense boundary — uncaught suspend throws.',
    'Treating transition updates as immediately committed in same tick logic.',
    'Hydration mismatch from server/client render difference.',
    'Effect assuming render only runs once per user action.',
  ],
  production: {
    performance: ['useTransition for expensive visual updates off critical path'],
    reliability: ['Fix hydration mismatches — suppressHydrationWarning only as last resort'],
    observability: ['Track long tasks; concurrent features should reduce input delay'],
  },
  interview: {
    expectations: [
      'Concurrent vs legacy synchronous rendering',
      'useTransition purpose',
      'Automatic batching in React 18',
      'Suspense role in modern model',
    ],
    commonQuestions: [
      'What is concurrent rendering?',
      'Difference useTransition vs debounce?',
      'What is selective hydration?',
    ],
    followUps: [
      'How Strict Mode relates to concurrent?',
      'Fiber vs virtual DOM?',
    ],
    misconceptions: [
      'Concurrent means multi-threaded React',
      'Every app gets transitions automatically',
      'Suspense replaces loading state everywhere always',
    ],
    traps: ['Saying React runs two threads for concurrent mode'],
    strongSignals: [
      'Interruptible render',
      'Transitions deprioritize updates',
      'Pure render functions required',
      'Streaming + Suspense integration',
    ],
  },
  keyTakeaways: [
    'React 18+ scheduling is interruptible and prioritized.',
    'useTransition marks non-urgent state updates.',
    'Suspense unifies async UI (data + lazy code).',
    'Renders must be pure — may run more than once.',
    'Automatic batching across async in React 18.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What problem does concurrent rendering solve?',
      answerHint: 'Keeps UI responsive by interrupting/prioritizing expensive renders.',
    },
    {
      level: 'intermediate',
      question: 'When use useTransition?',
      answerHint: 'Expensive UI updates that should not block urgent input updates.',
    },
    {
      level: 'advanced',
      question: 'Why must render be pure in concurrent React?',
      answerHint: 'Render may run, discard, retry — side effects cause inconsistent UI.',
    },
  ],
  flashcards: [
    { front: 'useTransition', back: 'Marks state updates inside as low-priority transition' },
    { front: 'Concurrent render', back: 'Interruptible; may discard in-progress work' },
    { front: 'React 18 batching', back: 'Multiple setStates in async batch to one commit' },
  ],
  quickRevision: [
    'Interruptible fibers',
    'useTransition = low priority',
    'Pure renders required',
    'Suspense for async UI',
    'Auto batching React 18',
    'Streaming SSR + hydration',
  ],
}
