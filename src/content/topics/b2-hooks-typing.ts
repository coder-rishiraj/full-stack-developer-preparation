import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Typing Hooks",
  "whatIsIt": "Hooks typing: useState<T>(initial), useReducer with discriminated actions, useRef<HTMLDivElement>(null), useContext with null guard, custom hooks return typed tuples/objects. Generic custom hooks preserve type params.",
  "whyExists": "Hooks are functions — same TS rules apply with React-specific conventions.",
  "mentalModel": "Typed reusable stateful logic packages.",
  "how": [
    "useState<User | null>(null) for async data.",
    "useReducer: reducer(state, action: Action) with union actions.",
    "useRef: mutable ref vs DOM ref types differ.",
    "useMemo/useCallback infer; annotate when generic needed.",
    "Custom hook: function useLocalStorage<T>(key: string, initial: T)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "useRef() without null initial for DOM — RefObject requires null argument.",
    "variant": "warning"
  },
  "example": "type Action = { type: 'inc' } | { type: 'set'; n: number };\nfunction reducer(state: number, action: Action): number {\n  switch (action.type) {\n    case 'inc': return state + 1;\n    case 'set': return action.n;\n  }\nfunction useCounter(initial: number) {\n  return useReducer(reducer, initial);",
  "exampleCaption": "useReducer with discriminated Action union",
  "internals": [
    "Rules of hooks not enforced by TS — ESLint plugin needed.",
    "ReturnType of custom hooks exported for consumers.",
    "Strict null on useContext default undefined requires guard."
  ],
  "takeaways": [
    "useState<User | null>(null) for async data.",
    "useReducer: reducer(state, action: Action) with union actions.",
    "useRef() without null initial for DOM — RefObject requires null argument.",
    "Rules of hooks not enforced by TS — ESLint plugin needed."
  ],
  "revision": [
    "Typing Hooks: Typed reusable stateful logic packages.",
    "useState<User | null>(null) for async data.",
    "useReducer: reducer(state, action: Action) with union actions.",
    "useRef: mutable ref vs DOM ref types differ.",
    "Trap: useRef() without null initial for DOM — RefObject requires null argument."
  ],
  "flashcards": [
    [
      "Typing Hooks",
      "Hooks typing: useState<T>(initial), useReducer with discriminated actions, useRef<HTMLDivElement>(null), useContext with null guard, custom hooks return typed tuples/objects."
    ],
    [
      "Mental model",
      "Typed reusable stateful logic packages."
    ],
    [
      "Common trap",
      "useRef() without null initial for DOM — RefObject requires null argument."
    ],
    [
      "useState<User | null>(null) for async data.",
      "useReducer: reducer(state, action: Action) with union actions."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Typing Hooks in TypeScript and when do you use it?",
      "answerHint": "Hooks typing: useState<T>(initial), useReducer with discriminated actions, useRef<HTMLDivElement>(null), useContext with null guard, custom hooks return typed tuples/objects. Generic custom hooks preserve type params."
    },
    {
      "level": "intermediate",
      "question": "Explain Typing Hooks with a code example and one pitfall.",
      "answerHint": "useState<User | null>(null) for async data. useReducer: reducer(state, action: Action) with union actions. useRef: mutable ref vs DOM ref types differ. useMemo/useCallback infer; annotate when generic needed. Custom hook: function useLocalStorage<T>(key: string, initial: T). Pitfall: useRef() without null initial for DOM — RefObject requires null argument."
    },
    {
      "level": "advanced",
      "question": "How would you explain Typing Hooks in a senior frontend interview?",
      "answerHint": "Rules of hooks not enforced by TS — ESLint plugin needed. ReturnType of custom hooks exported for consumers. Strict null on useContext default undefined requires guard. type Action = { type: 'inc' } | { type: 'set'; n: number };\nfunction reducer(state: number, action: Action): number {\n  "
    }
  ],
  "pitfalls": [
    "useRef() without null initial for DOM — RefObject requires null argument."
  ],
  "interview": {
    "expectations": [
      "Explain Typing Hooks with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Rules of hooks not enforced by TS — ESLint plugin needed."
    ],
    "commonQuestions": [
      "What is Typing Hooks?",
      "When would you choose Typing Hooks over alternatives?",
      "What is the classic Typing Hooks interview trap?"
    ],
    "traps": [
      "useRef() without null initial for DOM — RefObject requires null argument."
    ],
    "misconceptions": [
      "Hooks are functions — same TS rules apply with React-specific conventions."
    ],
    "strongSignals": [
      "Uses Typing Hooks to remove invalid states, not just document them."
    ]
  }
})
