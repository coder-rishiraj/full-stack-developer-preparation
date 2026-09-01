import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'State management trade-offs compare local component state, Context, URL state, and external stores (Redux, Zustand, Jotai) — choosing based on update frequency, scope, devtools needs, persistence, and team familiarity rather than defaulting to global Redux for every app.',
  whyExists:
    'Wrong store choice causes unnecessary re-renders, boilerplate fatigue, or tangled data flow. React apps need a decision framework: most state is local; global tools solve specific cross-cutting problems at a complexity cost.',
  mentalModel:
    'Start local. Lift to closest parent. Context for read-heavy low-frequency theming/auth locale. URL for shareable navigation state. Server cache via React Query separate from client stores. Global store when many distant writers/readers need time-travel debugging or middleware.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Local useState: default for UI toggles and form drafts colocated with UI.',
        'Lifted state + props: siblings share via parent — simple, explicit.',
        'Context: provide value; all consumers re-render on value change unless split/selectors.',
        'Zustand/Redux: external store with selectors limit subscriptions.',
        'React Query: server/async state — not interchangeable with UI store.',
      ],
    },
    {
      type: 'table',
      headers: ['Solution', 'Best for'],
      rows: [
        ['useState', 'Single component UI state'],
        ['Context', 'Theme, locale, auth snapshot — infrequent updates'],
        ['URL params', 'Filters, tabs, pagination — shareable'],
        ['Zustand', 'Medium global client state, minimal boilerplate'],
        ['Redux Toolkit', 'Large teams, middleware, devtools, complex workflows'],
        ['React Query', 'API entities, cache, mutations'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Decision ladder',
      text: 'Can useState work? → lift? → URL? → Context? → Zustand? → Redux? Stop at simplest sufficient step.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Context vs Zustand re-render',
      code: `// Context: any value change re-renders all consumers
const AppContext = createContext({ user, cart, theme });

// Zustand: selector subscribes to slice only
const count = useStore(s => s.cart.itemCount);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Context performance: memoize value object or split providers.',
        'Redux: single store, reducers pure, middleware for side effects (RTK Query overlaps React Query).',
        'Zustand: hook-based store outside React tree; no Provider required.',
        'Jotai/Recoil: atomic model fine-grained updates.',
        'XState: explicit state machines for complex flows.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Right tool avoids over-engineering',
      'Selectors/stores optimize wide-tree updates',
      'DevTools aid debugging at scale',
    ],
    disadvantages: [
      'Global store too early — hard to refactor back',
      'Context re-render storms without care',
      'Multiple libraries increase bundle and learning curve',
    ],
    alternatives: [
      'Composition over global config',
      'React Query only + local UI state (common modern stack)',
    ],
    whenToUse: [
      'Evaluate per state slice not whole app',
      'Redux when team/process already invested',
    ],
    whenNotToUse: [
      'Global Redux for theme + modal only',
      'Context for high-frequency updates (mouse position)',
    ],
  },
  failureModes: [
    'Single Context holding entire app — every update re-renders all.',
    'Duplicating server data in Redux and React Query.',
    'Prop drilling avoided by store that everything imports — hidden coupling.',
    'Persisting sensitive tokens in Zustand localStorage.',
    'Choosing Redux solely for interview buzz without team need.',
  ],
  production: {
    performance: ['Split context; use selectors in external stores'],
    maintainability: ['Document state ownership map in ARCHITECTURE.md'],
    scalability: ['React Query for server; minimal global client state'],
  },
  interview: {
    expectations: [
      'When Context vs Redux vs local state',
      'React Query is not UI state manager',
      'Re-render implications',
    ],
    commonQuestions: [
      'Do you need Redux for every React app?',
      'Context performance problems?',
      'Where put server data?',
    ],
    followUps: [
      'Zustand vs Redux?',
      'URL state examples?',
    ],
    misconceptions: [
      'Redux required for senior React',
      'Context replaces all prop drilling always fine',
      'One store should hold everything',
    ],
    traps: ['Recommending Redux before simpler options'],
    strongSignals: [
      'Start local, escalate deliberately',
      'Separate server cache',
      'Context re-render awareness',
    ],
  },
  keyTakeaways: [
    'Most state stays local or lifted — global is last resort.',
    'Context for infrequent shared read-mostly data.',
    'React Query handles server/async state.',
    'External stores use selectors to limit re-renders.',
    'URL state for shareable navigation/filter state.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When use Context vs props?',
      answerHint: 'Props for direct parent-child; Context for deep tree read-heavy shared data updated rarely.',
    },
    {
      level: 'intermediate',
      question: 'Why not put API data in Redux always?',
      answerHint: 'React Query handles cache/stale/refetch; Redux adds boilerplate without cache semantics.',
    },
    {
      level: 'advanced',
      question: 'Context re-render problem and fixes?',
      answerHint: 'New value object each render; split contexts, memoize value, or move to selector store.',
    },
  ],
  flashcards: [
    { front: 'Default state location', back: 'Local useState colocated with UI' },
    { front: 'Context weakness', back: 'All consumers re-render on provider value change' },
    { front: 'React Query domain', back: 'Server/async cache — not modal open state' },
  ],
  quickRevision: [
    'Local first',
    'Lift then URL/Context',
    'React Query = server',
    'Redux last for complex global',
    'Selectors limit rerenders',
    'Split context providers',
  ],
}
