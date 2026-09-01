import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Effect dependency reasoning is the discipline of specifying every value from component scope that useEffect (and useMemo/useCallback) reads — the dependency array tells React when to re-run effects and prevents stale closures, infinite loops, and missed updates.',
  whyExists:
    'Effects synchronize React with external systems (fetch, subscriptions, DOM). Without correct deps, effects run with outdated props/state or re-run too often. ESLint react-hooks/exhaustive-deps encodes the mental model: include all reactive values read inside.',
  mentalModel:
    'Ask: “If this value changes, should the effect re-sync?” If yes, put it in []. Missing dep → stale data. Unstable dep (new object each render) → infinite loop. Empty [] → mount/unmount only; omitting [] → every render.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'React compares deps with Object.is each render after commit.',
        'Changed dep → cleanup previous effect, run new effect.',
        'Functions from props/state are deps unless stabilized (useCallback).',
        'Objects/arrays recreated each render are deps that always change.',
        'eslint-disable exhaustive-deps is a code smell — fix design instead.',
      ],
    },
    {
      type: 'table',
      headers: ['Pattern', 'Dependency approach'],
      rows: [
        ['Fetch on id change', '[id]'],
        ['Event listener', '[handler] or ref for stable handler'],
        ['Interval with latest count', 'functional setState or ref for count'],
        ['Mount-only analytics', '[] — document intentional empty'],
        ['Derived from props', 'Include prop or compute outside effect'],
      ],
    },
    {
      type: 'callout',
      variant: 'warning',
      title: 'Infinite loop signature',
      text: 'useEffect(() => { setX(...); }, [x]) — setState changes x → effect reruns forever. Fix: derive without effect or guard condition.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Correct fetch deps + abort cleanup',
      code: `useEffect(() => {
  const ac = new AbortController();
  fetch(\`/api/users/\${userId}\`, { signal: ac.signal })
    .then(r => r.json())
    .then(setUser);
  return () => ac.abort();
}, [userId]); // re-fetch when userId changes`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Stale closure fix with ref',
      code: `const onTickRef = useRef(onTick);
onTickRef.current = onTick;

useEffect(() => {
  const id = setInterval(() => onTickRef.current(), 1000);
  return () => clearInterval(id);
}, []); // stable interval, always latest onTick`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Strict Mode remounts effects in dev — double fetch exposes missing cleanup.',
        'useLayoutEffect deps work same way but fire before paint.',
        'useMemo/useCallback deps determine cache invalidation not side effects.',
        'React 19 useEffectEvent removes some functions from dep arrays safely.',
        'Concurrent features may discard in-progress renders — effects tied to committed tree.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Predictable effect re-sync with props/state',
      'ESLint catches most stale closure bugs',
      'Cleanup pattern prevents leaks',
    ],
    disadvantages: [
      'Dep arrays verbose and easy to get wrong',
      'Over-including unstable deps causes loops',
      'Empty deps with hidden external reads → staleness',
    ],
    alternatives: [
      'Event handlers instead of effect for user-triggered work',
      'React Query keyed by queryKey — deps abstracted',
      'Refs for mutable latest values without dep churn',
    ],
    whenToUse: [
      'Any useEffect reading props/state/context',
      'Explaining fetch-on-mount vs fetch-on-id-change',
    ],
    whenNotToUse: [
      'Transforming data for render — compute during render',
      'User click handling — use onClick not effect',
    ],
  },
  failureModes: [
    'Missing userId in deps — shows stale user after route change.',
    '[options] where options = { id } new object every render — infinite fetch.',
    'No cleanup on WebSocket subscription — duplicate listeners.',
    'eslint-disable without comment — ships stale bug.',
    'Effect to setState from props — use key or derive during render instead.',
  ],
  production: {
    reliability: ['AbortController in fetch effects; subscription cleanup'],
    maintainability: ['Prefer React Query over hand-rolled fetch effects'],
    performance: ['Stabilize callbacks with useCallback when passed as deps'],
  },
  interview: {
    expectations: [
      'Purpose of dependency array',
      'Stale closure example and fix',
      'When [] is correct',
    ],
    commonQuestions: [
      'What happens if deps missing?',
      'Why infinite loop in useEffect?',
      'Fetch on mount vs on prop change deps?',
    ],
    followUps: [
      'When not to use useEffect?',
      'useEffectEvent purpose?',
    ],
    misconceptions: [
      'Omitting deps array same as [] (no — runs every render)',
      'Functions never need to be deps',
      'eslint exhaustive-deps is wrong often',
    ],
    traps: ['Disabling exhaustive-deps without architectural fix'],
    strongSignals: [
      'Include all read reactive values',
      'Cleanup return function',
      'Ref pattern for stable intervals',
      'Prefer event handlers over effect for user actions',
    ],
  },
  keyTakeaways: [
    'Deps list: every reactive value read inside effect.',
    'Change dep → cleanup + re-run effect.',
    '[] = mount/unmount sync only.',
    'Unstable object deps cause infinite loops.',
    'Stale closure: missing dep or use ref for latest callback.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What does empty dependency array [] mean?',
      answerHint: 'Effect runs after mount; cleanup on unmount; skips re-runs on re-renders.',
    },
    {
      level: 'intermediate',
      question: 'Effect reads count but deps []. Problem?',
      answerHint: 'Stale closure — effect always sees initial count; add count or use ref.',
    },
    {
      level: 'advanced',
      question: 'When should you NOT fix exhaustive-deps by adding deps?',
      answerHint: 'When effect shouldn’t exist — derive in render, use event handler, or React Query instead.',
    },
  ],
  flashcards: [
    { front: 'Dependency array', back: 'Reactive values that trigger effect re-sync when changed' },
    { front: 'Stale closure', back: 'Effect captures old props/state — missing dep' },
    { front: 'Infinite loop', back: 'Effect sets state that is in its own deps' },
  ],
  quickRevision: [
    'Include all values read in effect',
    '[] = mount/unmount only',
    'No deps = every render',
    'Cleanup prevents leaks',
    'Unstable objects → loop',
    'Ref for latest callback in []',
  ],
}
