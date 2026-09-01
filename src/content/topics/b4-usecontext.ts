import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'useContext reads the nearest value from a React Context Provider — enabling pass-through of data (theme, auth, locale) without prop drilling, with all consuming components re-rendering when the provided value changes unless optimized with memoization or split contexts.',
  whyExists:
    'Deep trees sharing read-mostly configuration caused "prop drilling" through indifferent intermediaries. Context broadcasts a value to any descendant subscriber while keeping provider/subscriber decoupling.',
  mentalModel:
    'createContext(default) → Provider value={...} wraps subtree → useContext(MyContext) reads value. Provider re-render with new value reference → all consumers re-render. Split contexts by update frequency. Not a state manager — no built-in selectors or middleware.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'createContext creates context object with Provider and Consumer.',
        'Provider value prop sets current context for subtree.',
        'useContext(Context) returns value from nearest Provider above.',
        'Default value used when no Provider (usually mistake in apps).',
        'Multiple providers nest — inner overrides outer for same context.',
      ],
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Basic theme context',
      code: `const ThemeContext = createContext<'light' | 'dark'>('light');

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const value = useMemo(() => ({ theme, setTheme }), [theme]);
  return (
    <ThemeContext.Provider value={value}>
      <Toolbar />
    </ThemeContext.Provider>
  );
}

function Toolbar() {
  const { theme, setTheme } = useContext(ThemeContext);
  return <button onClick={() => setTheme(t => t === 'light' ? 'dark' : 'light')}>{theme}</button>;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Context propagation uses fiber dependencies — consumers marked on value change.',
        'Memoizing provider value object prevents spurious consumer renders.',
        'Split ThemeContext vs UserContext so theme toggle doesn’t re-render user consumers.',
        'useContext subscribes to one context; use multiple hooks for multiple contexts.',
        'Server Components: context limited — client providers wrap interactive subtrees.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Eliminates prop drilling for shared read-mostly data',
      'Composable providers at app shell',
      'Built into React — no extra library',
    ],
    disadvantages: [
      'All consumers re-render on value change',
      'No fine-grained subscriptions built-in',
      'Testing requires provider wrapper',
    ],
    alternatives: [
      'Zustand selectors for frequent updates',
      'Composition (children slots)',
      'Prop drilling for 1-2 levels',
    ],
    whenToUse: [
      'Theme, i18n, auth snapshot, feature flags — low update rate',
      'Library component defaults via context',
    ],
    whenNotToUse: [
      'High-frequency updates (mouse, scroll)',
      'Large mutable app state — use store',
    ],
  },
  failureModes: [
    'New object in value every render — all consumers always re-render.',
    'Single mega-context — unrelated updates cascade.',
    'Missing Provider — silent default value bugs.',
    'Storing server lists in context without cache invalidation.',
    'Context for state that should be URL-shareable.',
  ],
  production: {
    performance: ['Split contexts; memoize value; avoid high-frequency context'],
    maintainability: ['Typed createContext with undefined default + hook guard'],
    reliability: ['Custom useAuth hook throws if outside Provider'],
  },
  interview: {
    expectations: [
      'Purpose and prop drilling solution',
      'Re-render all consumers on value change',
      'Memoize provider value',
    ],
    commonQuestions: [
      'What is useContext?',
      'Context performance problems?',
      'Context vs Redux?',
    ],
    followUps: ['Split context pattern?', 'Default context value pitfalls?'],
    misconceptions: [
      'Context prevents all re-renders',
      'Context is complete state management',
      'useContext only reads once on mount',
    ],
    traps: ['Recommending context for frequently changing cart with many items without split'],
    strongSignals: [
      'Broadcast read-mostly data',
      'Memoize provider value',
      'Split by update frequency',
    ],
  },
  keyTakeaways: [
    'useContext reads nearest Provider value in tree.',
    'Value change re-renders all consumers.',
    'Memoize value object to avoid spurious updates.',
    'Split contexts to limit re-render scope.',
    'Not replacement for server cache or high-frequency store.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What problem does Context solve?',
      answerHint: 'Prop drilling — share data with deep descendants without intermediate props.',
    },
    {
      level: 'intermediate',
      question: 'Why do all context consumers re-render?',
      answerHint: 'Provider value change notifies all subscribed useContext hooks in subtree.',
    },
    {
      level: 'advanced',
      question: 'Optimize context performance?',
      answerHint: 'Split contexts, memoize value, move fast-changing state to selector store.',
    },
  ],
  flashcards: [
    { front: 'useContext', back: 'Read nearest Provider value; re-subscribes on change' },
    { front: 'Context perf fix', back: 'Memoize value; split contexts by update rate' },
    { front: 'Context not for', back: 'High-frequency or server cache state' },
  ],
  quickRevision: [
    'Provider value broadcast',
    'Consumers re-render on change',
    'Memoize value object',
    'Split contexts',
    'Custom hook + guard',
    'Low-frequency shared data',
  ],
}
