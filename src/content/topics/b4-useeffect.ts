import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'useEffect is a React hook for synchronizing components with external systems after render — running side effects (fetch subscriptions, DOM APIs, timers, analytics) in the commit phase after paint (passive) with optional cleanup when dependencies change or component unmounts.',
  whyExists:
    'Render must stay pure. Side effects belong outside render in effects that run after DOM updates, with cleanup to prevent leaks. useEffect replaces class componentDidMount/Update/Unmount patterns in function components.',
  mentalModel:
    'useEffect(fn, deps). No deps = every render. [] = mount/unmount only. [a,b] = when a or b change. Return cleanup runs before next effect and on unmount. Not for deriving render data or responding to user events — those belong in render/handlers.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'After commit and browser paint, React runs passive effects.',
        'Compare deps with Object.is vs previous render.',
        'If changed: run previous cleanup, then new effect.',
        'Effect may return cleanup function for teardown.',
        'Strict Mode dev: mount → cleanup → mount to surface missing cleanup.',
      ],
    },
    {
      type: 'table',
      headers: ['Deps', 'Behavior'],
      rows: [
        ['Omitted', 'Run after every commit'],
        ['[]', 'Run once after mount; cleanup on unmount'],
        ['[id]', 'Run when id changes + cleanup between'],
        ['useLayoutEffect', 'Same deps but runs before paint — measure DOM'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'You Might Not Need an Effect',
      text: 'Transform data during render. Handle clicks in handlers. Cache with useMemo. Fetch with React Query. Effect is escape hatch for external sync.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Subscription with cleanup',
      code: `useEffect(() => {
  const ws = new WebSocket(url);
  ws.onmessage = (e) => setMessages(m => [...m, JSON.parse(e.data)]);
  return () => ws.close();
}, [url]);`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Document title sync',
      code: `useEffect(() => {
  document.title = \`\${count} items\`;
}, [count]);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Effect hook stored on fiber; queue flushed after paint.',
        'Async function directly as effect body wrong — no cleanup on promise.',
        'useInsertionEffect runs before DOM mutations for CSS-in-JS.',
        'Concurrent: effects tied to committed tree only.',
        'eslint-plugin-react-hooks exhaustive-deps enforces dependency completeness.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Declarative external system sync',
      'Cleanup pattern prevents leaks',
      'Composable with deps for re-sync',
    ],
    disadvantages: [
      'Easy to misuse for data derivation',
      'Race conditions in fetch without abort',
      'Dep array bugs: stale or infinite loops',
    ],
    alternatives: [
      'Event handlers for user actions',
      'React Query for server data',
      'useLayoutEffect for DOM measure before paint',
    ],
    whenToUse: [
      'Subscriptions, timers, third-party DOM widgets',
      'Sync document title, analytics on mount',
      'Imperative bridge to non-React code',
    ],
    whenNotToUse: [
      'Computing filtered list from props',
      'Submit on button click',
      'Initial data fetch — prefer React Query/RSC',
    ],
  },
  failureModes: [
    'Missing cleanup — duplicate WebSocket listeners.',
    'Fetch without AbortController — race on fast navigation.',
    'setState in effect without guard — infinite loop.',
    'Empty deps but reads props — stale closure.',
    'useEffect for form validation on every keystroke — use controlled render instead.',
  ],
  production: {
    reliability: ['AbortController; cleanup all subscriptions'],
    maintainability: ['Prefer React Query over hand-rolled fetch effects'],
    performance: ['Avoid effect chains causing waterfalls'],
  },
  interview: {
    expectations: [
      'Purpose: sync external systems after render',
      'Cleanup and dependency array semantics',
      'When NOT to use useEffect',
    ],
    commonQuestions: [
      'useEffect vs useLayoutEffect?',
      'What runs first render with []?',
      'Missing deps problem?',
    ],
    followUps: ['Strict Mode double effect?', 'Fetch in useEffect alternatives?'],
    misconceptions: [
      'useEffect runs before paint',
      'useEffect is for all side effects including clicks',
      'async useEffect is built-in pattern',
    ],
    traps: ['Recommending useEffect for derived state from props'],
    strongSignals: [
      'After paint passive effect',
      'Cleanup on unmount/dep change',
      'Not for event handlers or derive',
    ],
  },
  keyTakeaways: [
    'useEffect runs after paint to sync external systems.',
    'Return cleanup to prevent leaks.',
    'Dependency array controls re-run timing.',
    'Not for transforming data for render or user events.',
    'Strict Mode double-invokes in dev to test cleanup.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When does useEffect run?',
      answerHint: 'After commit and browser paint (passive effects).',
    },
    {
      level: 'intermediate',
      question: 'Purpose of effect cleanup function?',
      answerHint: 'Teardown before re-run or unmount — close sockets, clear timers.',
    },
    {
      level: 'advanced',
      question: 'Why not fetch data in useEffect for most apps?',
      answerHint: 'React Query gives cache, dedupe, stale/refetch, loading states without boilerplate.',
    },
  ],
  flashcards: [
    { front: 'useEffect timing', back: 'After paint — passive effects' },
    { front: '[] deps', back: 'Mount effect; cleanup unmount' },
    { front: 'useEffect not for', back: 'Derive render data; click handlers; replace React Query' },
  ],
  quickRevision: [
    'External sync after paint',
    'Cleanup required',
    'Deps control re-run',
    'Not for derive/events',
    'Abort fetch races',
    'Strict Mode double mount',
  ],
}
