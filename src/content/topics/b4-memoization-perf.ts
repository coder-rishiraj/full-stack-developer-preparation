import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Memoization for performance in React means caching expensive computations (useMemo), stable function references (useCallback), and skipping component re-renders (React.memo) so work is reused when inputs have not changed — applied selectively after measuring, not by default everywhere.',
  whyExists:
    'Re-rendering large trees and recomputing heavy derived data on every parent update wastes CPU. Memoization reduces redundant work when props/state dependencies are stable, but adds comparison overhead — use when Profiler shows real cost.',
  mentalModel:
    'Measure first, memo second. React.memo skips render if props shallow-equal. useMemo caches value when deps unchanged. useCallback caches function reference. All three share dependency array semantics. Memoizing everything often hurts more than helps.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'React.memo(Component) wraps render with shallow prop compare.',
        'useMemo(() => compute(), [deps]) returns cached result until dep change.',
        'useCallback(fn, [deps]) returns same function reference until dep change.',
        'Child memoized component only re-renders when props change by Object.is/shallow rules.',
        'Context change bypasses memo — consumers re-render regardless.',
      ],
    },
    {
      type: 'table',
      headers: ['Tool', 'Caches'],
      rows: [
        ['React.memo', 'Skip component render'],
        ['useMemo', 'Computed value between renders'],
        ['useCallback', 'Function reference for stable props'],
        ['useRef', 'Mutable value without re-render — not memoization per se'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Premature memoization',
      text: 'Memo has cost: dep compare + memory. Default: no memo. Add when Profiler flamegraph shows hot child or expensive useMemo target.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Memoized list row',
      code: `const Row = React.memo(function Row({ item, onSelect }: RowProps) {
  return <tr onClick={() => onSelect(item.id)}><td>{item.name}</td></tr>;
});

function Table({ items }: { items: Item[] }) {
  const onSelect = useCallback((id: string) => navigate(\`/item/\${id}\`), [navigate]);
  const sorted = useMemo(() => [...items].sort(byName), [items]);
  return sorted.map(item => <Row key={item.id} item={item} onSelect={onSelect} />);
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Shallow compare: first-level keys only — nested object mutation invisible to memo.',
        'Custom compare: React.memo(fn, (prev, next) => boolean) for deep field compare.',
        'useMemo runs during render — must be pure; not for side effects.',
        'Compiler (React Forget) may auto-memo in future — manual memo still interview relevant.',
        'Strict Mode double render in dev does not invalidate memo caches incorrectly.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Skip expensive child renders',
      'Avoid recomputing heavy derived arrays',
      'Stable callbacks for memoized children',
    ],
    disadvantages: [
      'Dependency array maintenance burden',
      'Shallow compare misses deep changes if mutated',
      'Memory and comparison overhead everywhere',
    ],
    alternatives: [
      'Colocate state to reduce render fan-out',
      'Virtualize long lists instead of memo every row',
      'React Compiler automatic memoization',
    ],
    whenToUse: [
      'Profiler shows slow child with stable props',
      'Expensive sort/filter on large collections',
      'Passing callbacks to React.memo children',
    ],
    whenNotToUse: [
      'Cheap components — memo overhead wins nothing',
      'Props always new references anyway',
      'Before measuring',
    ],
  },
  failureModes: [
    'Memo child but parent passes inline object — always re-renders.',
    'Mutate props object in place — memo thinks unchanged.',
    'useMemo with missing deps — stale derived data.',
    'Memoizing entire app — complexity without perf gain.',
    'useCallback with unstable deps — pointless cache churn.',
  ],
  production: {
    performance: ['Profiler-guided memo; virtualize lists before memo 10k rows'],
    maintainability: ['Document why memo added; remove when refactored'],
    observability: ['React Profiler + why-did-you-render in dev only'],
  },
  interview: {
    expectations: [
      'React.memo vs useMemo vs useCallback roles',
      'When NOT to memoize',
      'Shallow compare implications',
    ],
    commonQuestions: [
      'Difference useMemo and useCallback?',
      'Why memo not fix all perf issues?',
      'Does React.memo compare deeply?',
    ],
    followUps: [
      'Context vs memo interaction?',
      'React Compiler impact?',
    ],
    misconceptions: [
      'Memo everywhere is best practice',
      'useMemo prevents re-renders (it caches values; memo prevents child render)',
      'useCallback makes function faster to execute',
    ],
    traps: ['Saying useCallback speeds up function body execution'],
    strongSignals: [
      'Measure first',
      'Stable deps for memo to work',
      'Colocate state alternative',
    ],
  },
  keyTakeaways: [
    'React.memo skips re-render; useMemo caches values; useCallback caches fn refs.',
    'All rely on correct dependency arrays.',
    'Shallow prop compare only.',
    'Measure before memoizing.',
    'Context updates bypass memo on consumers.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does React.memo do?',
      answerHint: 'Wraps component; skips render if props shallow-equal previous.',
    },
    {
      level: 'intermediate',
      question: 'Why useCallback with React.memo child?',
      answerHint: 'Stable onClick reference so memo child prop comparison passes.',
    },
    {
      level: 'advanced',
      question: 'When is memoization counterproductive?',
      answerHint: 'Cheap components, always-new props, cost of compare > render saved.',
    },
  ],
  flashcards: [
    { front: 'React.memo', back: 'Skip render if props shallow-equal' },
    { front: 'useMemo', back: 'Cache expensive computation between renders' },
    { front: 'useCallback', back: 'Cache function reference for stable props' },
  ],
  quickRevision: [
    'Measure first',
    'memo / useMemo / useCallback',
    'Shallow compare',
    'Stable deps required',
    'Context bypasses memo',
    'Don’t memo everything',
  ],
}
