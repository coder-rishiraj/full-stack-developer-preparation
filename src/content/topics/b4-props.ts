import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'Props (properties) are the read-only inputs passed from parent to child components — they define the component API, flow data down the tree, and trigger re-renders when the parent passes new values (by reference or primitive change).',
  whyExists:
    'React’s one-way data flow keeps data predictable: parents own data, children receive it and emit events upward. Props enable composition, reusability, and explicit contracts between components without global mutable state.',
  mentalModel:
    'Props are function arguments for your component function. Immutable from child’s perspective — never mutate props. New object/function reference each parent render → child re-renders unless memoized. Spread carefully; destructure for clarity.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'Parent JSX passes attributes: <Child name={user.name} onSave={handleSave} />.',
        'React creates props object; child receives as first argument.',
        'Prop change (Object.is comparison on each prop) schedules child re-render.',
        'Children prop enables composition: <Card>{content}</Card>.',
        'Default values via default parameters or defaultProps (legacy).',
      ],
    },
    {
      type: 'table',
      headers: ['Pattern', 'Use case'],
      rows: [
        ['Required props + TypeScript', 'API contract at compile time'],
        ['children prop', 'Layout slots, compound components'],
        ['Render prop / function prop', 'Inversion of control'],
        ['Spread {...props}', 'Proxy/wrapper components — know what you forward'],
        ['key/ref', 'Special — not in props object'],
      ],
    },
    {
      type: 'callout',
      variant: 'note',
      title: 'Props vs state',
      text: 'Props: external, read-only, from parent. State: internal, mutable via setState, owned by component.',
    },
  ],
  example: [
    {
      type: 'code',
      language: 'tsx',
      caption: 'Typed props and composition',
      code: `type ButtonProps = {
  variant: 'primary' | 'secondary';
  disabled?: boolean;
  children: React.ReactNode;
  onClick: () => void;
};

function Button({ variant, disabled = false, children, onClick }: ButtonProps) {
  return (
    <button className={variant} disabled={disabled} onClick={onClick}>
      {children}
    </button>
  );
}`,
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Unstable inline prop causes re-render',
      code: `// New function every parent render → Child always re-renders
<Child onFilter={(x) => x.active} />

// Stabilize with useCallback if Child is memoized
const onFilter = useCallback((x: Item) => x.active, []);
<MemoChild onFilter={onFilter} />`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'Shallow compare props in React.memo — new object reference fails memo.',
        'Props drilling: passing through many layers — context or composition alternative.',
        'React 19 may pass ref as prop without forwardRef in some cases.',
        'Default props in function components: parameter defaults preferred over defaultProps.',
        'PropTypes deprecated for TS projects; runtime validation rare in prod.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Explicit data flow — easy to trace',
      'Reusable presentational components',
      'Type-safe APIs with TypeScript',
    ],
    disadvantages: [
      'Prop drilling in deep trees',
      'Unstable inline objects/functions break memoization',
      'Wide prop surfaces on container components',
    ],
    alternatives: [
      'Context for cross-cutting read-mostly data',
      'Composition (children) instead of config props',
      'Custom hooks to share logic without prop drilling',
    ],
    whenToUse: [
      'Parent-child data flow',
      'Presentational/dumb components',
      'Configurable UI building blocks',
    ],
    whenNotToUse: [
      'Mutating props inside child',
      'Passing 20+ props — refactor composition',
    ],
  },
  failureModes: [
    'Mutating props object or nested fields — breaks one-way flow.',
    'Spreading unknown props onto DOM — invalid HTML attributes.',
    'Missing optional default — uncontrolled/controlled flip on undefined.',
    'Passing huge objects when child needs one field — excess re-renders.',
    'Boolean props shorthand confusion: disabled vs disabled={false}.',
  ],
  production: {
    performance: ['Stabilize callback props with useCallback for memoized children'],
    maintainability: ['Keep prop interfaces small; prefer composition'],
    reliability: ['Validate external API props at boundary components'],
  },
  interview: {
    expectations: [
      'Props read-only; one-way data flow',
      'Props vs state distinction',
      'Why inline functions affect re-renders',
    ],
    commonQuestions: [
      'Can child modify props?',
      'What is prop drilling?',
      'Difference props vs state?',
    ],
    followUps: [
      'When use context instead of props?',
      'React.memo and props comparison?',
    ],
    misconceptions: [
      'Props and state are interchangeable',
      'Spreading props is always safe',
      'Children is not a prop',
    ],
    traps: ['Saying props can be mutated for local edits'],
    strongSignals: [
      'Read-only from child view',
      'Reference equality drives memo',
      'Composition over config explosion',
    ],
  },
  keyTakeaways: [
    'Props are read-only inputs from parent to child.',
    'One-way data flow: data down, events up.',
    'New object/function references trigger re-renders.',
    'children enables composition patterns.',
    'Avoid prop drilling via context or hooks.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'Are props mutable inside a child?',
      answerHint: 'No — treat as read-only; use state or lift updates to parent.',
    },
    {
      level: 'intermediate',
      question: 'Why does inline onClick={() => fn()} hurt performance?',
      answerHint: 'New function reference each render; memoized child sees changed prop.',
    },
    {
      level: 'advanced',
      question: 'How reduce prop drilling without global store?',
      answerHint: 'Context, composition (children), colocate state, or custom hooks.',
    },
  ],
  flashcards: [
    { front: 'Props', back: 'Read-only inputs from parent; trigger re-render on change' },
    { front: 'Props vs state', back: 'Props external/parent; state internal/setState' },
    { front: 'children prop', back: 'Nested JSX passed for composition' },
  ],
  quickRevision: [
    'Read-only from child',
    'One-way data flow',
    'Reference change → re-render',
    'children for composition',
    'No prop mutation',
    'Stabilize fns for memo',
  ],
}
