import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'The React rendering lifecycle describes the sequence from trigger (state/props/context change) through render, reconciliation, commit (DOM updates), and effects — in function components expressed via render itself plus useLayoutEffect and useEffect rather than class lifecycle methods.',
  whyExists:
    'Understanding when DOM is updated vs when effects run prevents bugs: reading layout before paint, subscribing after mount, avoiding setState during render. Maps mental model from class componentWillMount/DidMount to hooks-era phases.',
  mentalModel:
    'Render → React diff → Commit (DOM paint) → useLayoutEffect (sync after DOM) → browser paint → useEffect (async after paint). Mount vs update vs unmount each run effects with cleanup. Strict Mode remounts in dev to test cleanup.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Trigger: setState, parent re-render, context value change.',
        'Render phase: function body runs, hooks called in order, returns JSX.',
        'Reconciliation: diff against previous fiber tree.',
        'Commit phase: apply DOM mutations, run useLayoutEffect.',
        'Browser paints; then useEffect runs; cleanup on dep change/unmount.',
      ],
    },
    {
      type: 'table',
      headers: ['Phase', 'Function component hook'],
      rows: [
        ['Before paint DOM read/write', 'useLayoutEffect'],
        ['After paint side effects', 'useEffect'],
        ['Every render compute', 'render body / useMemo'],
        ['Class legacy mount', 'useEffect([]) equivalent (not identical timing)'],
      ],
    },
    {
      type: 'mermaid',
      caption: 'Update cycle',
      diagram: `sequenceDiagram
  participant T as Trigger
  participant R as Render
  participant C as Commit DOM
  participant L as useLayoutEffect
  participant P as Paint
  participant E as useEffect
  T->>R: setState
  R->>C: reconcile + mutate DOM
  C->>L: layout effects
  L->>P: browser paint
  P->>E: passive effects`,
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Layout vs passive effect timing',
      code: `function Tooltip({ anchor }: { anchor: HTMLElement | null }) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    if (!ref.current || !anchor) return;
    const rect = anchor.getBoundingClientRect();
    ref.current.style.top = \`\${rect.bottom}px\`; // before paint — no flash
  }, [anchor]);

  useEffect(() => {
    logImpression('tooltip-shown'); // after paint — analytics OK
  }, [anchor]);

  return <div ref={ref}>...</div>;
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Class lifecycles map loosely: componentDidMount ≈ useEffect([]); getSnapshotBeforeUpdate ≈ useLayoutEffect.',
        'useInsertionEffect runs before layout — CSS-in-JS libraries inject styles.',
        'Concurrent rendering may discard render work before commit — effects only on committed tree.',
        'Bailout: memoized components skip render phase entirely.',
        'Hydration lifecycle attaches to existing server HTML instead of createRoot fresh mount.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Clear separation render (pure) vs effects (sync external)',
      'useLayoutEffect for measurement without flicker',
      'Effect cleanup pattern for subscriptions',
    ],
    disadvantages: [
      'Easy to confuse useEffect vs useLayoutEffect timing',
      'Effects as mount-only [] hides dependency bugs',
      'Strict Mode double effects confuse beginners',
    ],
    alternatives: [
      'Event handlers for user-driven side effects',
      'Refs for DOM imperatives without effects when possible',
    ],
    whenToUse: [
      'Explaining bug where DOM read in useEffect flashes',
      'Subscription mount/unmount pattern',
    ],
    whenNotToUse: [
      'Data derivation — compute in render not effect',
    ],
  },
  failureModes: [
    'DOM measure in useEffect — visible layout jump.',
    'Missing effect cleanup — duplicate subscriptions.',
    'setState in useEffect without deps guard — loop.',
    'Assuming render runs once per user click in concurrent mode.',
    'useLayoutEffect for data fetch — blocks paint.',
  ],
  production: {
    performance: ['Prefer useEffect over useLayoutEffect unless measuring DOM'],
    reliability: ['Always cleanup subscriptions and timers in effects'],
    maintainability: ['Document mount-only effects with comment why [] safe'],
  },
  interview: {
    expectations: [
      'Render vs commit vs effects order',
      'useLayoutEffect vs useEffect',
      'Mount/update/unmount effect behavior',
    ],
    commonQuestions: [
      'Order of useEffect vs paint?',
      'componentDidMount equivalent in hooks?',
      'What runs during render phase?',
    ],
    followUps: [
      'Strict Mode double mount?',
      'Concurrent render discard impact on effects?',
    ],
    misconceptions: [
      'useEffect runs before browser paints',
      'Render phase touches DOM',
      'Every parent render runs all child effects',
    ],
    traps: ['Saying useEffect runs before DOM update'],
    strongSignals: [
      'Render pure, commit mutates DOM',
      'Layout before paint, passive after',
      'Cleanup on unmount/dep change',
    ],
  },
  keyTakeaways: [
    'Render computes; commit updates DOM; then effects run.',
    'useLayoutEffect before paint; useEffect after paint.',
    'Effects run after committed render, not discarded work.',
    'Cleanup prevents leaks on unmount and dep changes.',
    'Avoid side effects in render body.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'When does useEffect run relative to DOM paint?',
      answerHint: 'After commit and browser paint (passive effects).',
    },
    {
      level: 'intermediate',
      question: 'useLayoutEffect vs useEffect?',
      answerHint: 'Layout sync after DOM mutation before paint; useEffect after paint.',
    },
    {
      level: 'advanced',
      question: 'Do effects run if render was discarded in concurrent mode?',
      answerHint: 'No — only committed renders run layout/passive effects.',
    },
  ],
  flashcards: [
    { front: 'Render phase', back: 'Pure function run; builds element tree; no DOM yet' },
    { front: 'useLayoutEffect timing', back: 'After DOM commit, before browser paint' },
    { front: 'useEffect timing', back: 'After paint — async relative to user visible update' },
  ],
  quickRevision: [
    'Render → commit → layout → paint → effect',
    'Render is pure',
    'useLayoutEffect before paint',
    'useEffect after paint',
    'Cleanup on unmount',
    'Effects on committed tree only',
  ],
}
