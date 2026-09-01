import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'useState is the fundamental React hook declaring local component state — returning a value and setter function where calling the setter schedules a re-render with the new state snapshot, supporting functional updates and lazy initial state for expensive defaults.',
  whyExists:
    'Function components need reactive local memory. useState integrates state into hook system with stable setter identity, batching, and bailout when Object.is detects no change — foundation for all UI interactivity.',
  mentalModel:
    'const [x, setX] = useState(init). setX(next) or setX(prev => next). Init only on first render unless lazy () => expensive(). Setter stable reference. State is a snapshot per render — reading state in closure may be stale; use functional update.',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'First render: initialize state from argument or lazy initializer fn.',
        'setState schedules update; React re-renders component with new value.',
        'Object.is compare — same value bails out of re-render.',
        'Multiple setStates in event handler batch to one render (React 18+).',
        'Hook order fixed — never call useState conditionally.',
      ],
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Lazy init and functional update',
      code: `const [items, setItems] = useState(() => loadFromStorage());
const add = (item: Item) => setItems(prev => [...prev, item]);`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'State stored on fiber hook list by call order index.',
        'Concurrent updates may interleave — functional updates safest.',
        'useState and useReducer share update queue.',
        'State updates async relative to setState call — not immediate DOM.',
        'Strict Mode remount resets state in dev double-invoke.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Simple API for local UI state',
      'Stable setter without useCallback',
      'Functional updates avoid stale closures',
    ],
    disadvantages: [
      'Many useStates fragment related data — consider useReducer',
      'Lifting many states causes wide re-renders',
      'Not for server cache entities',
    ],
    alternatives: [
      'useReducer for complex transitions',
      'useRef for non-rendering mutable values',
      'React Query for async server data',
    ],
    whenToUse: [
      'Toggles, counters, form fields, local UI mode',
    ],
    whenNotToUse: [
      'Fetched API lists — React Query',
      'Values derivable from props without editing',
    ],
  },
  failureModes: [
    'Mutating state object: state.items.push(x); setState(state).',
    'Stale closure: setCount(count + 1) in async — use functional form.',
    'Conditional useState — breaks hook rules.',
    'Initializing from props without key/remount strategy — drift from props.',
  ],
  production: {
    performance: ['Colocate useState to limit re-render scope'],
    reliability: ['Functional updates for counters and queues'],
  },
  interview: {
    expectations: [
      'Setter schedules re-render',
      'Functional update pattern',
      'Hook rules — top level only',
    ],
    commonQuestions: [
      'Is useState setter async?',
      'Lazy initial state when?',
      'Why functional setState?',
    ],
    followUps: ['Batching behavior?', 'useState vs useReducer?'],
    misconceptions: [
      'setState merges like class setState for objects (functional only replaces)',
      'setState immediately updates variable in same function',
      'Can call useState in loops',
    ],
    traps: ['Mutating array then setState same reference'],
    strongSignals: [
      'Immutable updates',
      'Functional updater for async',
      'Lazy init for expensive default',
    ],
  },
  keyTakeaways: [
    'useState returns [value, setValue] for local reactive state.',
    'setValue triggers re-render with new snapshot.',
    'Use functional update when next depends on previous.',
    'Lazy initializer runs once: useState(() => init).',
    'Never mutate state — replace with new value/object.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'What happens when you call setState?',
      answerHint: 'Schedules re-render; component function runs again with new state value.',
    },
    {
      level: 'intermediate',
      question: 'When use lazy initial state?',
      answerHint: 'Expensive computation or localStorage read — only first render runs initializer.',
    },
    {
      level: 'advanced',
      question: 'setCount(count+1) three times quickly — result?',
      answerHint: 'Without functional update may +1 once due to same stale count; use c=>c+1 for +3.',
    },
  ],
  flashcards: [
    { front: 'useState', back: '[value, setValue] — setValue schedules re-render' },
    { front: 'Functional update', back: 'setState(prev => next) — latest prev guaranteed' },
    { front: 'Lazy init', back: 'useState(() => expensive()) runs once' },
  ],
  quickRevision: [
    'Local reactive state',
    'Immutable updates',
    'Functional setState',
    'Lazy init once',
    'Stable setter',
    'Hook order fixed',
  ],
}
