import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Custom hooks are JavaScript functions named use* that compose built-in hooks to encapsulate reusable stateful logic — sharing behavior across components without HOCs or render props while obeying the Rules of Hooks.',
  whyExists:
    'Duplicate useEffect/useState blocks across components violate DRY and hide bugs. Custom hooks extract fetch logic, subscriptions, form state, and media queries into testable units while keeping components focused on rendering.',
  mentalModel:
    'A hook is a function that calls hooks. Each component invocation gets isolated state — custom hook state is per-calling-component, not global. Return whatever API fits: [value, setter], { data, error }, or callbacks.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Name must start with use — lint enforces Rules of Hooks.',
        'Call other hooks at top level only — no conditionals/loops around hooks.',
        'Return value consumed by component; can return JSX factory rarely.',
        'Extract deps carefully — stale closures if callbacks omit deps.',
        'Test with @testing-library/react renderHook.',
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Hook vs utility',
      text: 'If it needs useState/useEffect/useContext, it is a hook. Pure formatting → plain function.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'useFetch custom hook',
      code: `function useFetch<T>(url: string) {
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ac = new AbortController();
    setLoading(true);
    fetch(url, { signal: ac.signal })
      .then(r => r.json())
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false));
    return () => ac.abort();
  }, [url]);

  return { data, error, loading };
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'useLocalStorage hook',
      code: `function useLocalStorage(key: string, initial: string) {
  const [value, setValue] = useState(() => localStorage.getItem(key) ?? initial);
  useEffect(() => {
    localStorage.setItem(key, value);
  }, [key, value]);
  return [value, setValue] as const;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'React stores hook state in fiber linked list order — hook call order must be stable.',
        'Two components calling useFetch get separate state instances.',
        'useEvent/useEffectEvent (React 19+) stabilize callbacks inside hooks.',
        'Libraries export hooks: useQuery, useSWR, useForm — same contract.',
        'Sharing state across components needs context/store inside hook or lift state.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Reuse logic without wrapper hell',
      'Colocate related effects and state',
      'Testable in isolation with renderHook',
    ],
    disadvantages: [
      'Abstraction hides deps — stale closure bugs',
      'Over-extraction creates jump-to-definition fatigue',
      'Not a global store by default',
    ],
    alternatives: [
      'Context provider + consumer hook pair',
      'External store (Zustand) for global state',
      'Class utilities (no hooks) for pure logic',
    ],
    whenToUse: [
      'Repeated fetch/subscription/form patterns',
      'Browser API wrappers (useMediaQuery, useIntersection)',
    ],
    whenNotToUse: [
      'One-off two-liner better inline',
      'Replacing global state without context/store design',
    ],
  },
  failureModes: [
    'Conditional hook call — crash or state mismatch.',
    'Missing cleanup in useEffect inside hook — leaks on unmount.',
    'Stale closure: hook returns callback without latest deps.',
    'Naming without use prefix — breaks Rules of Hooks lint.',
    'Hook called from class component or event handler — invalid.',
  ],
  production: {
    maintainability: ['Single responsibility hooks; compose smaller hooks'],
    reliability: ['AbortController in fetch hooks; document required deps'],
    performance: ['Debounce inside hook when appropriate; avoid redundant subscriptions'],
  },
  interview: {
    expectations: [
      'use* naming and Rules of Hooks',
      'State per component instance',
      'Example: useFetch or useToggle',
    ],
    commonQuestions: [
      'What are custom hooks?',
      'Can hooks call hooks?',
      'Custom hook vs HOC?',
    ],
    followUps: [
      'How test custom hooks?',
      'Share state between components with hook?',
    ],
    misconceptions: [
      'Custom hook state is global/singleton',
      'Hooks can be called anywhere',
      'Custom hooks must return arrays',
    ],
    traps: ['Calling custom hook inside if statement'],
    strongSignals: [
      'Rules of Hooks compliance',
      'Cleanup in effects',
      'renderHook testing mention',
    ],
  },
  keyTakeaways: [
    'use* functions composing hooks for reusable logic.',
    'Each component call gets own hook state.',
    'Top-level hook calls only — stable order.',
    'Extract fetch, subscriptions, browser APIs.',
    'Test with renderHook; include effect cleanup.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Why must custom hooks start with use?',
      answerHint: 'Lint/rules identify hook calls; enforce Rules of Hooks.',
    },
    {
      level: 'intermediate',
      question: 'Two components use useCounter — shared state?',
      answerHint: 'No — separate state per component instance.',
    },
    {
      level: 'advanced',
      question: 'How share hook state across tree?',
      answerHint: 'Context provider holding state; useMyState consumer hook, or external store.',
    },
  ],
  flashcards: [
    { front: 'Custom hook', back: 'use* function composing other hooks' },
    { front: 'Rules of Hooks', back: 'Top level only; same order every render' },
    { front: 'State scope', back: 'Per component using the hook' },
  ],
  quickRevision: [
    'use* naming required',
    'Compose built-in hooks',
    'State per component instance',
    'No conditional hook calls',
    'Cleanup in effects',
    'renderHook for tests',
  ],
}
