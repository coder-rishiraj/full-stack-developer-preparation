import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Unnecessary re-renders occur when React components reconcile and run their render function without a meaningful output change — often because parent state updated unrelated data, unstable prop references, or context value changes propagating to all consumers.',
  whyExists:
    'React default is render downstream on parent update. Without colocation, memoization, or selector patterns, large trees repeat work wasting CPU and risking janky input — especially on lists and context-heavy apps.',
  mentalModel:
    'Parent re-render ≠ child must re-render (React still calls child unless bailout). Find trigger: state placement, inline objects/functions, context provider value, missing memo. Profile first; fix architecture before blanket React.memo.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Parent setState → parent render → default: all children render.',
        'React.memo child bails out if props shallow-equal.',
        'Context change re-renders all useContext consumers in subtree.',
        'Same state setter reference but new parent state still re-renders children.',
        'Profiler "why did this render" identifies prop/state/context changes.',
      ],
    },
    {
      type: 'table',
      headers: ['Cause', 'Fix'],
      rows: [
        ['State too high in tree', 'Colocate or wrapper split'],
        ['inline style={{}}', 'Stable ref or CSS class'],
        ['inline onClick={() => ...}', 'useCallback if child memoized'],
        ['Context { user, theme } together', 'Split providers or selectors'],
        ['Whole list parent state', 'Row state colocated or virtualized'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Memo is not first fix',
      text: 'Moving state down often eliminates problem without memo complexity. Memo everywhere adds dep maintenance cost.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Unstable context value',
      code: `// Bad: new object every render → all consumers re-render
function AppProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  return (
    <AppContext.Provider value={{ user, setUser, theme: 'dark' }}>
      {children}
    </AppContext.Provider>
  );
}

// Better: memoize value
const value = useMemo(() => ({ user, setUser, theme: 'dark' }), [user]);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Bailout: child pure and props same → skip subtree (with memo).',
        'Concurrent rendering may render multiple times — still avoid wasted work.',
        'useSyncExternalStore fine-grained for external stores.',
        'Children as JSX element create new element object each render — normal; memo compares props.',
        'Strict Mode double render exaggerates dev counts.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Fixing root cause improves perf without memo everywhere',
      'Better UX on input-heavy pages',
    ],
    disadvantages: [
      'Over-memoization complexity',
      'Premature optimization without profiling',
    ],
    alternatives: [
      'State colocation',
      'Component splitting',
      'External store selectors',
      'useTransition for deferring heavy UI',
    ],
    whenToUse: [
      'Profiler shows hot re-renders on unrelated updates',
      'Typing lag in large forms/lists',
    ],
    whenNotToUse: [
      'Before measuring',
      'Components already cheap <1ms',
    ],
  },
  failureModes: [
    'React.memo on child but unstable props from parent — useless.',
    'Mutating state without setState — no render but stale UI.',
    'Context mega-object — global re-render storm.',
    'useMemo everything — memory and dep bugs.',
    'Optimizing dev Strict Mode double renders as prod issue.',
  ],
  production: {
    performance: ['Profiler-guided colocate > memo', 'Virtualize long lists'],
    observability: ['React Scan / DevTools why-render in dev'],
    maintainability: ['Remove memo when refactor makes unnecessary'],
  },
  interview: {
    expectations: [
      'Why parent update re-renders children',
      'Common causes and fixes',
      'Profile before optimize',
    ],
    commonQuestions: [
      'What causes unnecessary re-renders?',
      'How prevent list re-render on unrelated state?',
      'Context performance issue?',
    ],
    followUps: [
      'React.memo limitations?',
      'useTransition vs memo?',
    ],
    misconceptions: [
      'Any re-render is bad',
      'React.memo fixes all perf',
      'Only children of changed component re-render ever',
    ],
    traps: ['Suggesting memo before colocating state'],
    strongSignals: [
      'Colocate state first',
      'Stable props for memo',
      'Split context',
      'Use Profiler',
    ],
  },
  keyTakeaways: [
    'Parent re-render triggers child render unless bailout.',
    'Colocate state to shrink update blast radius.',
    'Unstable inline props defeat React.memo.',
    'Context updates re-render all consumers.',
    'Profile to find real unnecessary renders.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Does child always re-render when parent re-renders?',
      answerHint: 'Default yes unless memo bailout or React skips for other optimizations.',
    },
    {
      level: 'intermediate',
      question: 'Fix: typing in search re-renders entire 1000-row list?',
      answerHint: 'Colocate query state; memo/virtualize rows; defer filter with transition.',
    },
    {
      level: 'advanced',
      question: 'Why memoized child still re-renders?',
      answerHint: 'New prop references each parent render; context change; not wrapped in memo.',
    },
  ],
  flashcards: [
    { front: 'Default render rule', back: 'Parent update → children render too' },
    { front: 'First perf fix', back: 'Colocate state / split tree' },
    { front: 'Context pitfall', back: 'New value object re-renders all consumers' },
  ],
  quickRevision: [
    'Profile first',
    'Colocate state',
    'Stable prop refs',
    'Split context',
    'memo last resort',
    'Virtualize lists',
  ],
}
