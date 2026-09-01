import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    '"When not to use effects" is React’s guidance that many common useEffect patterns are anti-patterns — data transformation, user event responses, and initial data fetching often belong in render, event handlers, or dedicated cache libraries instead of synchronizing via useEffect.',
  whyExists:
    'Overusing useEffect causes waterfalls, stale data, double fetches in Strict Mode, and hard-to-follow flow. React team documents alternatives so components stay predictable: render computes UI; events handle interactions; effects only for external system sync.',
  mentalModel:
    'Ask: is this synchronizing with something outside React? If no, probably not an effect. Derive in render. Respond in onClick. Fetch with React Query/RSC. Adjust initial state with key or useState initializer. Effect is last resort not first tool.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Transform props → compute during render or useMemo if expensive.',
        'User click/submit → handler not effect.',
        'Reset state when prop id changes → key={id} on component not effect setState.',
        'Fetch server data → React Query/SWR/RSC not useEffect fetch.',
        'Subscribe window/document → legitimate useEffect with cleanup.',
      ],
    },
    {
      type: 'table',
      headers: ['Task', 'Prefer'],
      rows: [
        ['Filter list by search', 'Render: items.filter(...)'],
        ['Fetch on mount', 'React Query useQuery'],
        ['Run on button click', 'onClick handler'],
        ['Sync to localStorage', 'Effect OR event + lazy init'],
        ['Measure DOM layout', 'useLayoutEffect'],
        ['Analytics page view', 'Effect or router hook'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'You Might Not Need an Effect',
      text: 'Official React docs section — interview gold. Shows before/after for prop-to-state sync, chain effects, notify parent.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Anti-pattern vs derive in render',
      code: `// Bad: effect to derive filtered list
const [filtered, setFiltered] = useState([]);
useEffect(() => { setFiltered(items.filter(i => i.active)); }, [items]);

// Good: compute during render
const filtered = items.filter(i => i.active);`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Reset with key not effect',
      code: `// Bad: sync props to state in effect
useEffect(() => { setDraft(user.name); }, [user.name]);

// Good: remount editor when user changes
<UserEditor key={user.id} user={user} />`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Chain effects (effect A sets state triggering effect B) → merge or event-driven.',
        'Notify parent of change — call callback in event handler not effect on child state.',
        'Global event bus subscription — valid effect with cleanup.',
        'React 19 useEffectEvent reduces some effect needs for stable handlers.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Simpler data flow fewer bugs',
      'Fewer fetch waterfalls',
      'Better Strict Mode behavior',
    ],
    disadvantages: [
      'Requires mindset shift from class lifecycles',
      'Some DOM sync still needs effects',
    ],
    alternatives: [
      'React Query, RSC, router loaders for data',
      'key prop for reset semantics',
    ],
    whenToUse: [
      'Teaching/refactoring effect-heavy codebases',
      'Interview system design for data loading',
    ],
    whenNotToUse: [
      'Dismissing all effects — subscriptions still valid',
    ],
  },
  failureModes: [
    'useEffect fetch on mount in every component — waterfall.',
    'Effect to setState from props — drift and loops.',
    'Effect on every render missing deps — stale or loop.',
    'Replacing effect with useMemo that does side effects.',
  ],
  production: {
    maintainability: ['Lint and review new useEffect additions critically'],
    performance: ['Eliminate effect chains causing serial updates'],
    reliability: ['React Query for server state removes race-prone effects'],
  },
  interview: {
    expectations: [
      'List cases NOT needing useEffect',
      'Derive in render principle',
      'React Query over effect fetch',
    ],
    commonQuestions: [
      'When should you NOT use useEffect?',
      'How fetch data without useEffect?',
      'Effect to sync props to state — problem?',
    ],
    followUps: [
      'Valid effect use cases?',
      'key vs effect for reset?',
    ],
    misconceptions: [
      'useEffect required for all side effects including clicks',
      'useEffect on mount is always correct for data',
      'Removing all effects is goal',
    ],
    traps: ['Cannot name any valid effect use case'],
    strongSignals: [
      'Derive in render',
      'Events in handlers',
      'React Query/RSC for fetch',
      'key for reset',
    ],
  },
  keyTakeaways: [
    'Don’t use effect to transform data for render — compute in render.',
    'Don’t use effect for user events — use handlers.',
    'Don’t use effect for initial fetch — use React Query/RSC.',
    'Use key to reset state when id changes.',
    'Effects for external sync: subscriptions, timers, non-React widgets.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Should you useEffect to filter an array for display?',
      answerHint: 'No — filter during render from props/state.',
    },
    {
      level: 'intermediate',
      question: 'Replace useEffect fetch on mount with what?',
      answerHint: 'React Query useQuery, router loader, or RSC async server fetch.',
    },
    {
      level: 'advanced',
      question: 'When IS useEffect appropriate?',
      answerHint: 'External sync: WebSocket, intervals, third-party DOM lib, document.title, analytics with cleanup.',
    },
  ],
  flashcards: [
    { front: 'Not an effect', back: 'Derive display data — compute in render' },
    { front: 'Not an effect', back: 'User click action — event handler' },
    { front: 'Not an effect', back: 'Initial API data — React Query/RSC' },
  ],
  quickRevision: [
    'Render for derive',
    'Handler for events',
    'Query for fetch',
    'key for reset',
    'Effect = external sync',
    'Avoid effect chains',
  ],
}
