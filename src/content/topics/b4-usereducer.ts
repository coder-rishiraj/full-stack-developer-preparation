import type { TopicContent } from '@/domain/types'

export const content: TopicContent = {
  whatIsIt:
    'useReducer is a React hook for state logic expressed as (state, action) => reducer transitions — alternative to useState when next state depends on previous in complex ways, multiple sub-values update together, or actions are enumerated events like in Redux patterns.',
  whyExists:
    'Multiple related setState calls and intertwined updates become error-prone. Reducer centralizes transition logic in one pure function, eases testing, and scales to complex forms and wizards before reaching for external stores.',
  mentalModel:
    'const [state, dispatch] = useReducer(reducer, initialState). dispatch({ type: "increment" }). Reducer must be pure: (state, action) => newState. Same scheduling/batching as useState. lazy init: useReducer(reducer, arg, initFn).',
  howItWorks: [
    {
      type: 'list',
      ordered: true,
      items: [
        'dispatch(action) schedules update with action object.',
        'React calls reducer(currentState, action) to compute next state.',
        'Reducer returns new state object — immutable updates.',
        'Same hook ordering rules as useState.',
        'Can pass dispatch stable to children without useCallback (dispatch identity stable).',
      ],
    },
    {
      type: 'code',
      language: 'tsx',
      caption: 'Form wizard reducer',
      code: `type State = { step: number; data: Record<string, string> };
type Action =
  | { type: 'next' }
  | { type: 'back' }
  | { type: 'set_field'; field: string; value: string };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'next': return { ...state, step: state.step + 1 };
    case 'back': return { ...state, step: Math.max(0, state.step - 1) };
    case 'set_field':
      return { ...state, data: { ...state.data, [action.field]: action.value } };
    default: return state;
  }
}`,
    },
  ],
  internals: [
    {
      type: 'list',
      items: [
        'useReducer and useState share same update queue mechanism.',
        'Reducer runs during update phase — must not cause side effects.',
        'Combine reducers or split domains for large state machines.',
        'Context + useReducer common lightweight global pattern.',
        'Redux Toolkit slice reducers similar but external store.',
      ],
    },
  ],
  tradeoffs: {
    advantages: [
      'Centralized transition logic',
      'Easier to test reducer in isolation',
      'Stable dispatch reference',
      'Scales for complex local state',
    ],
    disadvantages: [
      'Boilerplate for simple toggles',
      'Action type verbosity without TypeScript discriminated unions',
      'Overkill for single boolean',
    ],
    alternatives: [
      'useState for simple independent values',
      'XState for formal state machines',
      'Zustand/Redux for app-wide state',
    ],
    whenToUse: [
      'Multi-field forms, wizards, complex UI state machines',
      'Many interdependent state updates',
    ],
    whenNotToUse: [
      'Single counter or modal boolean',
      'Server cache — React Query',
    ],
  },
  failureModes: [
    'Mutating state inside reducer — breaks predictability.',
    'Side effects in reducer — belongs in useEffect or dispatch thunk layer.',
    'God reducer handling unrelated domains — split reducers.',
    'Default case missing — silent no-op bugs.',
  ],
  production: {
    maintainability: ['Discriminated union actions in TypeScript'],
    reliability: ['Exhaustive switch with never type for unhandled actions'],
  },
  interview: {
    expectations: [
      'Reducer pure function pattern',
      'When useReducer vs useState',
      'dispatch stability',
    ],
    commonQuestions: [
      'What is useReducer?',
      'useReducer vs Redux?',
      'Is dispatch stable?',
    ],
    followUps: ['Lazy initial state?', 'Context + useReducer pattern?'],
    misconceptions: [
      'useReducer requires Redux',
      'Reducer can async fetch directly',
      'useReducer always better than useState',
    ],
    traps: ['Side effects inside reducer function'],
    strongSignals: [
      'Pure (state, action) => newState',
      'Complex local transitions',
      'Stable dispatch',
    ],
  },
  keyTakeaways: [
    'useReducer manages state via pure reducer function.',
    'dispatch sends actions; reducer returns next state.',
    'Prefer for complex interdependent local state.',
    'dispatch reference stable across renders.',
    'Immutable state updates in reducer always.',
  ],
  interviewQuestions: [
    {
      level: 'basic',
      question: 'useReducer vs useState?',
      answerHint: 'useReducer for complex transitions/actions; useState for simple independent values.',
    },
    {
      level: 'intermediate',
      question: 'Must reducer be pure?',
      answerHint: 'Yes — no side effects; given state+action returns new state deterministically.',
    },
    {
      level: 'advanced',
      question: 'useReducer + Context as mini-Redux?',
      answerHint: 'Provider holds useReducer state; consumers dispatch — fine for medium local-global state.',
    },
  ],
  flashcards: [
    { front: 'useReducer', back: '[state, dispatch] with pure reducer(state, action)' },
    { front: 'Reducer rule', back: 'Pure, immutable return new state' },
    { front: 'dispatch stability', back: 'Same reference across renders' },
  ],
  quickRevision: [
    'Pure reducer fn',
    'dispatch(action)',
    'Complex local state',
    'Immutable updates',
    'Stable dispatch',
    'Not for server data',
  ],
}
