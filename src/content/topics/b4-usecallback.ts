import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'useCallback is a React hook that returns a memoized function reference stable across renders until dependencies change — primarily used to prevent memoized child components from re-rendering when parents pass callback props that would otherwise be new function instances every render.',
  whyExists:
    'Inline functions in JSX create new references each render, breaking React.memo on children and triggering effect re-runs when functions are in dependency arrays. useCallback caches the reference when deps unchanged.',
  mentalModel:
    'useCallback(fn, deps) ≡ useMemo(() => fn, deps). It does NOT memoize computation inside fn — only the reference. Use when passing callbacks to memoized children or as effect deps. Skip when child not memoized or callback always changes anyway.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'On render, React compares deps with Object.is to previous.',
        'Deps unchanged → return cached function from prior render.',
        'Deps changed → store new function closure capturing latest values.',
        'Empty deps [] → same function identity forever (stale closure risk if reads state).',
        'ESLint exhaustive-deps applies same as useEffect.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Not a performance magic wand',
      text: 'useCallback has cost comparing deps. Child must be React.memo or effect must depend on reference stability — otherwise pointless.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Stable callback for memoized list item',
      code: `const Row = React.memo(function Row({ item, onDelete }: RowProps) {
  return <tr><td>{item.name}</td><td><button onClick={() => onDelete(item.id)}>Del</button></td></tr>;
});

function Table({ items }: { items: Item[] }) {
  const onDelete = useCallback((id: string) => {
    setItems(prev => prev.filter(i => i.id !== id));
  }, []); // setItems stable
  return items.map(item => <Row key={item.id} item={item} onDelete={onDelete} />);
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Functional setState in callback reduces deps needing state values.',
        'useEffectEvent (React 19) alternative for stable handler reading latest props without deps.',
        'Custom hooks returning callbacks should document memo expectations.',
        'Concurrent renders share hook state — callback cache per fiber.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Stable props for React.memo children',
      'Stable effect dependencies',
      'Prevents unnecessary effect re-subscription',
    ],
    disadvantages: [
      'Boilerplate and dep array bugs',
      'Stale closures if deps wrong',
      'No speedup for function execution itself',
    ],
    alternatives: [
      'Colocate child to avoid prop callback',
      'Pass item id + stable handler: onDelete(id)',
      'useEffectEvent for effect handlers',
    ],
    whenToUse: [
      'Callback prop to memoized child',
      'Function in useEffect deps',
    ],
    whenNotToUse: [
      'Non-memoized child',
      'Deps change every render anyway',
    ],
  },
  failureModes: [
    'useCallback with [items] dep — new callback every items change anyway.',
    'Empty deps reading props — stale handler.',
    'Memoizing all handlers preemptively — noise without memo children.',
    'Missing dep — eslint disable hides stale bug.',
  ],
  production: {
    performance: ['Only useCallback where Profiler + memo child justify it'],
    maintainability: ['Prefer functional setState to shrink dep arrays'],
  },
  interview: {
    expectations: [
      'Caches function reference not execution',
      'Why with React.memo children',
      'useCallback vs useMemo relationship',
    ],
    commonQuestions: [
      'What does useCallback do?',
      'Does useCallback make function faster?',
      'When skip useCallback?',
    ],
    followUps: ['useEffectEvent?', 'Stale closure in useCallback?'],
    misconceptions: [
      'useCallback speeds up function body',
      'Always wrap event handlers in useCallback',
      'useCallback and useMemo unrelated',
    ],
    traps: ['Claiming useCallback optimizes expensive function computation'],
    strongSignals: [
      'Reference stability for memo/deps',
      'Same deps rules as useEffect',
      'Not default for all handlers',
    ],
  },
  keyTakeaways: [
    'useCallback memoizes function reference between renders.',
    'Use for memoized children and effect deps.',
    'Does not cache function result or speed execution.',
    'Equivalent to useMemo(() => fn, deps).',
    'Measure need — not default on every handler.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does useCallback return?',
      answerHint: 'Same function reference if deps unchanged; new fn if deps changed.',
    },
    {
      level: 'intermediate',
      question: 'Why useCallback with React.memo?',
      answerHint: 'Prevent new onClick reference breaking memo prop equality.',
    },
    {
      level: 'advanced',
      question: 'useCallback vs useEffectEvent?',
      answerHint: 'useEffectEvent stable handler for effects reading latest without dep; useCallback general memoized fn.',
    },
  ],
  flashcards: [
    { front: 'useCallback', back: 'Memoize function reference, not invocation result' },
    { front: 'Main use case', back: 'Stable callback prop for memo child / effect dep' },
    { front: 'Equivalent', back: 'useMemo(() => fn, deps)' },
  ],
  quickRevision: [
    'Stable fn reference',
    'For memo children',
    'Deps like useEffect',
    'Not faster execution',
    'Not for every handler',
    'Functional setState helps deps',
  ],
}
