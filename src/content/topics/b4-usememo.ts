import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'useMemo is a React hook that caches the result of an expensive pure computation between renders, returning the cached value when dependency array entries are unchanged — distinct from useCallback which caches function references.',
  whyExists:
    'Recomputing heavy operations (sorting large arrays, complex filtering) on every render wastes CPU when inputs unchanged. useMemo stores last result until deps change, trading memory for compute savings.',
  mentalModel:
    'useMemo(() => computeExpensive(a, b), [a, b]). Runs during render phase — must be pure. Not for side effects. Often paired with React.memo children needing stable object props. React Compiler may auto-memo in future.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'During render, compare deps with previous via Object.is.',
        'Unchanged → return cached value without running factory.',
        'Changed → run factory function, store and return result.',
        'Factory should be pure — no setState or DOM writes.',
        'Missing deps → stale cached value bug.',
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Premature useMemo',
      text: 'Most computations are cheap. Profile before memoizing. useMemo itself has dep comparison cost.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Expensive sort memoization',
      code: `function ProductList({ products, sortKey }: Props) {
  const sorted = useMemo(
    () => [...products].sort((a, b) => compare(a, b, sortKey)),
    [products, sortKey]
  );
  return sorted.map(p => <ProductRow key={p.id} product={p} />);
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Stable object prop for memo child',
      code: `const config = useMemo(() => ({ theme, locale }), [theme, locale]);
return <MemoWidget config={config} />;`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Cache lives on fiber hook node — discarded if component unmounts.',
        'Referential equality: same object reference returned when deps same.',
        'useCallback(fn, deps) equivalent to useMemo(() => fn, deps).',
        'Strict Mode double render in dev still uses memo cache correctly per fiber.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Skip expensive pure recomputation',
      'Stable object references for memo children',
      'Explicit dependency documentation',
    ],
    disadvantages: [
      'Memory holding cached values',
      'Dep maintenance burden',
      'False sense of optimization on cheap ops',
    ],
    alternatives: [
      'Compute only when needed in event handler',
      'Move heavy work to Web Worker',
      'Derive outside hot path via state update batching',
    ],
    whenToUse: [
      'Profiler shows expensive render computation',
      'Stable config object for React.memo child',
    ],
    whenNotToUse: [
      'Cheap string concat or simple map',
      'Side effects — use useEffect',
    ],
  },
  failureModes: [
    'Missing dep — stale sorted list after data change.',
    'Mutating products array in place — useMemo skips recompute wrongly.',
    'useMemo with setState inside factory — anti-pattern.',
    'Memoizing everything — code noise no perf win.',
  ],
  production: {
    performance: ['Profile first; memo hot paths only'],
    maintainability: ['Comment why memoized if non-obvious'],
  },
  interview: {
    expectations: [
      'Caches computed value not function ref',
      'Pure factory during render',
      'useMemo vs useCallback distinction',
    ],
    commonQuestions: [
      'What does useMemo do?',
      'useMemo vs useCallback?',
      'When skip useMemo?',
    ],
    followUps: ['Can useMemo replace useEffect?', 'React Compiler impact?'],
    misconceptions: [
      'useMemo prevents component re-render',
      'useMemo runs after render like effect',
      'Always memoize objects passed as props',
    ],
    traps: ['Using useMemo for side effects like fetch'],
    strongSignals: [
      'Pure expensive compute cache',
      'Deps like useEffect',
      'Not render bailout mechanism',
    ],
  },
  keyTakeaways: [
    'useMemo caches pure computation result between renders.',
    'Runs during render — must be side-effect free.',
    'useCallback memoizes functions; useMemo memoizes values.',
    'Use when profiling shows real compute cost.',
    'Correct deps critical to avoid stale cache.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'useMemo vs useCallback?',
      answerHint: 'useMemo caches value; useCallback caches function reference.',
    },
    {
      level: 'intermediate',
      question: 'Does useMemo stop component re-rendering?',
      answerHint: 'No — skips recomputation only; parent update still renders component.',
    },
    {
      level: 'advanced',
      question: 'When is useMemo harmful?',
      answerHint: 'Cheap compute, deps always change, or comparison cost exceeds savings.',
    },
  ],
  flashcards: [
    { front: 'useMemo', back: 'Cache pure computation result when deps unchanged' },
    { front: 'Runs when', back: 'During render phase — must be pure' },
    { front: 'Not for', back: 'Side effects or cheap operations' },
  ],
  quickRevision: [
    'Cache compute result',
    'Pure factory fn',
    'During render',
    'Deps like useEffect',
    'Profile before use',
    'Not useCallback',
  ],
}
