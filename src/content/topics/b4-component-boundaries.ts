import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Component boundaries are deliberate lines dividing UI into units of state, side effects, and re-render scope — defining where state lives, what children re-render when parent updates, and where error/suspense boundaries isolate failures.',
  whyExists:
    'Flat component trees with state at the top cause full-app re-renders and tangled effects. Boundaries localize state mutations, enable code splitting, memoization targets, and error containment — critical for performance and maintainability at scale.',
  mentalModel:
    'Draw boxes around independent concerns. State as low as possible, as high as necessary. A boundary change should not ripple unrelated subtrees. ErrorBoundary wraps risky third-party widgets; React.memo at stable-prop leaves.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'State placement: colocate with consumers; lift only for sharing.',
        'Split containers (data/effects) from presentational (pure UI).',
        'memo/useMemo/useCallback at boundaries with expensive children or stable props.',
        'Error boundaries catch render errors in subtree — class component or react-error-boundary.',
        'Suspense boundaries show fallback while lazy children load.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Boundary layers',
      diagram: `flowchart TB
  App[App shell — routing context]
  App --> Page[Page boundary — route data]
  Page --> EB[ErrorBoundary]
  EB --> List[List — local UI state]
  List --> Row[Memoized Row — props stable]`,
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Boundary without measurement',
      text: 'Random React.memo everywhere adds complexity without benefit. Profile first; boundary where re-renders hurt.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Container/presentational split',
      code: `function UserListContainer() {
  const { data, error } = useUsers();
  if (error) return <ErrorState error={error} />;
  return <UserList users={data} />; // presentational — easy to test
}

const UserRow = memo(function UserRow({ user }: { user: User }) {
  return <li>{user.name}</li>;
});`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Error boundary isolation',
      code: `import { ErrorBoundary } from 'react-error-boundary';

<ErrorBoundary FallbackComponent={ChartError} onReset={refetch}>
  <ThirdPartyChart data={metrics} />
</ErrorBoundary>`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'React re-renders child when parent renders unless memo bails out on shallow equal props.',
        'Context changes re-render all consumers — split contexts by update frequency.',
        'Concurrent rendering may render boundary twice in dev Strict Mode.',
        'Server/client component boundary in RSC — "use client" marks interactive island.',
        'Feature folders often map to boundary: features/checkout/ owns checkout state.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Localized re-renders and failures',
      'Clear ownership of state and effects',
      'Easier lazy loading per route/feature',
    ],
    disadvantages: [
      'Over-splitting creates prop drilling',
      'Premature memo adds mental overhead',
      'Wrong boundary → duplicated fetch or stale shared state',
    ],
    alternatives: [
      'Global store (Zustand/Redux) when many distant consumers',
      'URL state for shareable page-level state',
    ],
    whenToUse: [
      'Route-level code split and error isolation',
      'Lists with thousands of rows (memo rows)',
      'Third-party widgets that may throw',
    ],
    whenNotToUse: [
      'memo on every leaf without profiler evidence',
      'Lifting all state to root “for simplicity”',
    ],
  },
  failureModes: [
    'Inline object/function props break memo every render.',
    'Single context with { user, theme, cart } — any change re-renders all.',
    'Error boundary does not catch event handler or async errors.',
    'State lifted too high — typing in input re-renders entire app.',
    'Missing key on list boundary — wrong row state preserved.',
  ],
  production: {
    performance: [
      'Profiler identify hot paths before memo',
      'Split context: StateContext + DispatchContext pattern',
      'Virtualize inside list boundary not whole page',
    ],
    reliability: ['Error boundaries per feature widget; logging onError'],
    maintainability: ['Feature folders mirror boundaries; document state ownership'],
  },
  interview: {
    expectations: [
      'Where to place state',
      'Error boundary scope and limits',
      'When memo helps at boundaries',
    ],
    commonQuestions: [
      'How reduce unnecessary re-renders?',
      'What do error boundaries catch?',
      'Container vs presentational?',
    ],
    followUps: [
      'Context splitting strategy?',
      'RSC client boundary?',
    ],
    misconceptions: [
      'memo always improves performance',
      'Error boundaries catch all errors',
      'Children never re-render when parent does',
    ],
    traps: ['Suggesting Redux before colocation and composition'],
    strongSignals: [
      'Colocate state; lift minimally',
      'Profile-driven memo',
      'Error boundary limits stated',
    ],
  },
  keyTakeaways: [
    'Boundaries define state scope and re-render isolation.',
    'Colocate state; lift only for shared sibling needs.',
    'ErrorBoundary for render errors in subtree only.',
    'memo at measured expensive boundaries with stable props.',
    'Split context to avoid global re-render storms.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Where should form input state live?',
      answerHint: 'In the form component or field — not app root unless shared widely.',
    },
    {
      level: 'intermediate',
      question: 'What errors do React error boundaries NOT catch?',
      answerHint: 'Event handlers, async/setTimeout, SSR, errors in boundary itself.',
    },
    {
      level: 'advanced',
      question: 'Why split React context into state and dispatch?',
      answerHint: 'Consumers needing dispatch only skip re-render when state value changes.',
    },
  ],
  flashcards: [
    { front: 'State placement rule', back: 'As low as possible, as high as necessary' },
    { front: 'Error boundary catches', back: 'Render/lifecycle errors in children' },
    { front: 'memo purpose', back: 'Skip re-render if props shallow-equal' },
  ],
  quickRevision: [
    'Boundaries = state + render scope',
    'Colocate state',
    'Container/presentational split',
    'ErrorBoundary isolates crashes',
    'Profile before memo',
    'Split context by update rate',
  ],
}
