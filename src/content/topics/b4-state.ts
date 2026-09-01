import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'State is data owned by a component that changes over time and triggers re-renders when updated — unlike props, state is private to the component (or lifted shared state) and updated immutably via setState/useState/useReducer dispatch.',
  whyExists:
    'UI must reflect changing user input, server data, and app mode. State gives React a snapshot model: each render is a function of state + props; updates schedule reconciliations to sync DOM with latest snapshot.',
  mentalModel:
    'State is a snapshot trigger. setState schedules update — not synchronous DOM write. Multiple setStates batch in event handlers. Lift state to lowest common ancestor when siblings need same data. Derive don’t duplicate — computed values from state during render.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'useState returns [value, setter]; setter accepts value or updater fn.',
        'setState triggers re-render if Object.is says value changed (bailout if same).',
        'State updates batch in React 18+ event handlers and many async paths.',
        'Functional updater: setCount(c => c + 1) avoids stale closure in async.',
        'Lifting state: move shared state to parent, pass props + callbacks down.',
      ],
    },
    {
      type: 'table',
      headers: ['State type', 'Example'],
      rows: [
        ['UI state', 'modal open, tab index, form draft'],
        ['Server cache', 'React Query cache — often not useState'],
        ['URL state', 'searchParams — shareable bookmarkable'],
        ['Ephemeral', 'hover, animation frame — ref sometimes better'],
        ['Global client', 'Context, Zustand, Redux'],
      ],
    },
    {
      type: 'callout',
      variant: 'tip',
      title: 'Single source of truth',
      text: 'One canonical place for each fact. Mirror props into state only when you need local editable copy — sync with key or useEffect carefully.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Lifted state between siblings',
      code: `function Parent() {
  const [filter, setFilter] = useState('');
  return (
    <>
      <SearchBox value={filter} onChange={setFilter} />
      <ResultsList filter={filter} />
    </>
  );
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Functional update avoids stale state',
      code: `function Counter() {
  const [count, setCount] = useState(0);
  const increment = () => setCount(c => c + 1);
  // In interval: setCount(c => c + 1) not setCount(count + 1)
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Fiber hook linked list — useState order must be stable every render.',
        'Bailout: setState same primitive reference may skip child work with memo.',
        'Concurrent: render may be discarded; state commits on successful transition.',
        'useReducer for complex transitions — same scheduling as useState.',
        'Strict Mode double-mount resets state in dev to surface missing cleanup.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Declarative UI synced to data',
      'Local encapsulation of component concerns',
      'Predictable snapshot render model',
    ],
    disadvantages: [
      'Over-lifting causes wide re-render fan-out',
      'Duplicated derived state causes sync bugs',
      'Too much in useState vs proper server cache',
    ],
    alternatives: [
      'URL search params for shareable UI state',
      'React Query for server state',
      'useReducer for complex state machines',
    ],
    whenToUse: [
      'User input, toggles, wizards, client-only UI mode',
      'Shared sibling data via lifted state',
    ],
    whenNotToUse: [
      'Data that belongs on server — fetch/cache instead',
      'Values derivable from existing state/props',
    ],
  },
  failureModes: [
    'Mutating state object directly — React misses update.',
    'Stale closure reading old state in async callback.',
    'Duplicating props into state without sync strategy.',
    'God component holding all app state — perf and maintenance pain.',
    'Setting state during render — infinite loop.',
  ],
  production: {
    performance: ['Colocate state to minimize re-render scope'],
    maintainability: ['Separate server cache from UI state mentally and in code'],
    reliability: ['Functional updates for counters and queue mutations'],
  },
  interview: {
    expectations: [
      'State vs props',
      'Lifting state up pattern',
      'Batching and functional updates',
    ],
    commonQuestions: [
      'When lift state up?',
      'Is setState synchronous?',
      'How avoid stale state in async?',
    ],
    followUps: [
      'Where place state in large app?',
      'Server vs client state?',
    ],
    misconceptions: [
      'setState immediately updates DOM',
      'Any change requires global store',
      'Copy props to state always on mount is fine without plan',
    ],
    traps: ['Mutating state array with .push then setState same reference'],
    strongSignals: [
      'Immutable updates',
      'Lift to common parent',
      'Functional setState for async',
      'Derive during render',
    ],
  },
  keyTakeaways: [
    'State is private mutable (via setter) data triggering re-renders.',
    'Update immutably; never mutate state objects in place.',
    'Lift shared state to closest common ancestor.',
    'Functional updates fix stale closures.',
    'Separate UI state from server cache state.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Difference between props and state?',
      answerHint: 'Props from parent read-only; state internal, updated via setState.',
    },
    {
      level: 'intermediate',
      question: 'What is lifting state up?',
      answerHint: 'Move shared state to parent; pass value and setter/callback to children.',
    },
    {
      level: 'advanced',
      question: 'Why setCount(c => c + 1) in async interval?',
      answerHint: 'Functional updater always gets latest committed state; avoids stale closure.',
    },
  ],
  flashcards: [
    { front: 'State update rule', back: 'Immutable replacement; setter schedules re-render' },
    { front: 'Lifting state', back: 'Shared sibling state moved to parent' },
    { front: 'Functional setState', back: 'Updater fn receives previous state — avoids stale' },
  ],
  quickRevision: [
    'Private to component',
    'Immutable updates',
    'setState batches',
    'Lift shared state up',
    'Derive don’t duplicate',
    'Functional updater for async',
  ],
}
