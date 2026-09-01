import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'React’s component model treats UI as a function of state — encapsulated units that accept props, manage local state and effects, compose into trees, and reconcile declarative descriptions into efficient DOM updates via a virtual representation.',
  whyExists:
    'Imperative DOM manipulation does not scale with complex UIs. Components bundle markup, behavior, and state into reusable boundaries with predictable data flow — enabling declarative rendering, testing, and team parallelization.',
  mentalModel:
    'Components are functions (or classes) returning element trees. Props flow down; events/callbacks flow up. State changes schedule re-render; React diffs virtual tree and patches DOM. One-way data flow keeps reasoning local.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Component invoked with props → returns React elements (lightweight descriptors).',
        'Hooks (useState, useEffect…) attach state and side effects to function components.',
        'Re-render on state/props/context change — pure render phase then commit to DOM.',
        'Reconciliation matches by type/key; updates props, mounts/unmounts subtrees.',
        'Composition: nest components; lift state when siblings need shared data.',
      ],
    },
    {
      type: 'mermaid',
      caption: 'Render cycle',
      diagram: `flowchart LR
  Props[Props + state] --> Render[Render function]
  Render --> VDOM[React element tree]
  VDOM --> Recon[Reconciliation]
  Recon --> DOM[DOM update]
  Events[User events] --> setState[setState / dispatch]
  setState --> Render`,
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Elements vs components',
      text: '<Button /> creates element describing Button; React calls Button function. DOM nodes only at host components (div, span).',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Function component with props and state',
      code: `type CounterProps = { step?: number };

export function Counter({ step = 1 }: CounterProps) {
  const [count, setCount] = useState(0);
  return (
    <div>
      <p>{count}</p>
      <button onClick={() => setCount(c => c + step)}>Add</button>
    </div>
  );
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Composition over configuration',
      code: `function Card({ children, title }: { children: React.ReactNode; title: string }) {
  return (
    <section className="card">
      <h2>{title}</h2>
      {children}
    </section>
  );
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Fiber architecture: incremental reconciler with priority lanes (React 18+).',
        'Render phase may abort/restart (concurrent features); commit is synchronous.',
        'Strict Mode double-invokes render in dev to surface impure side effects.',
        'React 19+: Server Components extend model — server-only components without client JS.',
        'Custom components must start uppercase — lowercase reserved for intrinsic DOM tags.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Encapsulation and reuse',
      'Declarative UI matches mental model of state → view',
      'Rich ecosystem and tooling',
    ],
    disadvantages: [
      'Re-render granularity requires discipline (boundaries, memo)',
      'Hook rules and closure stale state learning curve',
      'Bundle includes runtime',
    ],
    alternatives: [
      'Web Components for framework-agnostic widgets',
      'Svelte compile-away model',
      'Vanilla JS for tiny islands',
    ],
    whenToUse: [
      'Interactive SPAs and design systems',
      'Teams needing component libraries',
    ],
    whenNotToUse: [
      'Static content with no interactivity — may overkill',
      'Replacing every div with a component unnecessarily',
    ],
  },
  failureModes: [
    'Mutating props or state directly — React misses updates.',
    'Creating components inside render — remount every frame.',
    'Prop drilling dozens of levels instead of composition/context.',
    'Side effects in render body instead of useEffect/event handlers.',
  ],
  production: {
    performance: ['Split by route; memo only measured hotspots'],
    maintainability: ['Colocate styles/tests; consistent props typing'],
    observability: ['React DevTools component tree and profiler'],
  },
  interview: {
    expectations: [
      'UI = f(state, props)',
      'One-way data flow',
      'Reconciliation and keys basics',
    ],
    commonQuestions: [
      'What is a React component?',
      'Props vs state?',
      'Class vs function components today?',
    ],
    followUps: [
      'Virtual DOM purpose?',
      'When lift state up?',
    ],
    misconceptions: [
      'Components always map 1:1 to DOM nodes',
      'setState is synchronous immediate DOM update',
      'Every parent re-render re-renders all children always (React bails out if props same)',
    ],
    traps: ['Defining component inside another component’s render'],
    strongSignals: [
      'Declarative + unidirectional flow',
      'Elements vs components distinction',
      'Composition patterns',
    ],
  },
  keyTakeaways: [
    'Components encapsulate UI + behavior; props in, events out.',
    'Function components + hooks are the modern standard.',
    'Re-render on state/props/context change; reconcile to DOM.',
    'Compose small components; lift shared state up.',
    'Never mutate state — immutable updates schedule render.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Props vs state?',
      answerHint: 'Props from parent read-only; state internal and triggers re-render when updated.',
    },
    {
      level: 'intermediate',
      question: 'Why must component names be capitalized?',
      answerHint: 'JSX treats lowercase as intrinsic HTML tags; uppercase as custom components.',
    },
    {
      level: 'advanced',
      question: 'What happens when setState is called?',
      answerHint: 'Schedules re-render; render phase produces new element tree; commit patches DOM.',
    },
  ],
  flashcards: [
    { front: 'Component model', back: 'UI = f(state, props); encapsulated reusable units' },
    { front: 'Data flow', back: 'Props down, callbacks up' },
    { front: 'Re-render trigger', back: 'State/props/context change' },
  ],
  quickRevision: [
    'UI = f(state, props)',
    'Function components + hooks',
    'One-way data flow',
    'Elements → reconciliation → DOM',
    'Compose; lift state up',
    'Immutable state updates',
  ],
}
