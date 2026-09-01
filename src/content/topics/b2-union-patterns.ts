import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Union & Intersection Patterns",
  "whatIsIt": "Production union patterns: discriminated unions for state, Result types for errors, optional chaining on partial unions, and filtering with type predicates. Remote data (idle/loading/success/error) is a canonical example.",
  "whyExists": "Senior front-end interviews expect clean union modeling for UI state and API data.",
  "mentalModel": "State machine on types — each state is a distinct shape.",
  "how": [
    "Shared discriminant field: status or type.",
    "Exhaustive switch with assertNever default.",
    "Filter arrays: items.filter(isSuccess) narrows.",
    "Avoid optional everything — prefer union of states.",
    "Map union to UI with Record<Status, Renderer> + satisfies."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Optional fields for every state — allows impossible { loading: true, data: T } combos.",
    "variant": "warning"
  },
  "example": "type RemoteData<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: 'error'; error: string };\nfunction view<T>(r: RemoteData<T>): string {\n  switch (r.status) {\n    case 'idle': return 'Start';\n    case 'loading': return 'Loading…';\n    case 'success': return String(r.data);\n    case 'error': return r.error;\n  }",
  "exampleCaption": "RemoteData discriminated union with exhaustive switch",
  "internals": [
    "Discriminant must be literal type or union of literals.",
    "Control flow narrows union in each case block.",
    "Tagged unions enable algebraic data type style."
  ],
  "takeaways": [
    "Shared discriminant field: status or type.",
    "Exhaustive switch with assertNever default.",
    "Optional fields for every state — allows impossible { loading: true, data: T } combos.",
    "Discriminant must be literal type or union of literals."
  ],
  "revision": [
    "Union & Intersection Patterns: State machine on types — each state is a distinct shape.",
    "Shared discriminant field: status or type.",
    "Exhaustive switch with assertNever default.",
    "Filter arrays: items.filter(isSuccess) narrows.",
    "Trap: Optional fields for every state — allows impossible { loading: true, data: T } combos."
  ],
  "flashcards": [
    [
      "Union & Intersection Patterns",
      "Production union patterns: discriminated unions for state, Result types for errors, optional chaining on partial unions, and filtering with type predicates."
    ],
    [
      "Mental model",
      "State machine on types — each state is a distinct shape."
    ],
    [
      "Common trap",
      "Optional fields for every state — allows impossible { loading: true, data: T } combos."
    ],
    [
      "Shared discriminant field: status or type.",
      "Exhaustive switch with assertNever default."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Union & Intersection Patterns in TypeScript and when do you use it?",
      "answerHint": "Production union patterns: discriminated unions for state, Result types for errors, optional chaining on partial unions, and filtering with type predicates. Remote data (idle/loading/success/error) is a canonical example."
    },
    {
      "level": "intermediate",
      "question": "Explain Union & Intersection Patterns with a code example and one pitfall.",
      "answerHint": "Shared discriminant field: status or type. Exhaustive switch with assertNever default. Filter arrays: items.filter(isSuccess) narrows. Avoid optional everything — prefer union of states. Map union to UI with Record<Status, Renderer> + satisfies. Pitfall: Optional fields for every state — allows impossible { loading: true, data: T } combos."
    },
    {
      "level": "advanced",
      "question": "How would you explain Union & Intersection Patterns in a senior frontend interview?",
      "answerHint": "Discriminant must be literal type or union of literals. Control flow narrows union in each case block. Tagged unions enable algebraic data type style. type RemoteData<T> =\n  | { status: 'idle' }\n  | { status: 'loading' }\n  | { status: 'success'; data: T }\n  | { status: '"
    }
  ],
  "pitfalls": [
    "Optional fields for every state — allows impossible { loading: true, data: T } combos."
  ],
  "interview": {
    "expectations": [
      "Explain Union & Intersection Patterns with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Discriminant must be literal type or union of literals."
    ],
    "commonQuestions": [
      "What is Union & Intersection Patterns?",
      "When would you choose Union & Intersection Patterns over alternatives?",
      "What is the classic Union & Intersection Patterns interview trap?"
    ],
    "traps": [
      "Optional fields for every state — allows impossible { loading: true, data: T } combos."
    ],
    "misconceptions": [
      "Senior front-end interviews expect clean union modeling for UI state and API data."
    ],
    "strongSignals": [
      "Uses Union & Intersection Patterns to remove invalid states, not just document them."
    ]
  }
})
