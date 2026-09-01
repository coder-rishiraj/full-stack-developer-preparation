import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Variant Maps with satisfies",
  "whatIsIt": "Variant map pattern: const HANDLERS = { add: (n) => ..., remove: (id) => ... } satisfies Record<Action[\"type\"], Handler>. Ensures every discriminant has handler; preserves inferred function types.",
  "whyExists": "GreatFrontEnd senior pattern — typed reducer/event dispatch tables.",
  "mentalModel": "Chessboard where every piece type has a typed move function.",
  "how": [
    "Define Action discriminated union first.",
    "Map keys = action.type literals.",
    "satisfies Record<ActionType, (a: Extract<Action, {type: T}>) => void> advanced.",
    "assertNever on default in dispatcher.",
    "Autocomplete keys from satisfies check."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Missing handler key — satisfies error at compile time (good).",
    "variant": "warning"
  },
  "example": "type Action =\n  | { type: 'inc'; by: number }\n  | { type: 'reset' };\nconst handlers = {\n  inc: (a: Extract<Action, { type: 'inc' }>) => a.by,\n  reset: () => 0,\n} satisfies { [K in Action['type']]: (a: Extract<Action, { type: K }>) => number };\nconsole.log(handlers.inc({ type: 'inc', by: 2 }));",
  "exampleCaption": "satisfies ensures inc and reset handlers exist",
  "internals": [
    "Extract distributes over union for per-key action type.",
    "Mapped satisfies pattern scales to many variants.",
    "Runtime dispatch: handlers[action.type](action as any) — narrow carefully."
  ],
  "takeaways": [
    "Define Action discriminated union first.",
    "Map keys = action.type literals.",
    "Missing handler key — satisfies error at compile time (good).",
    "Extract distributes over union for per-key action type."
  ],
  "revision": [
    "Variant Maps with satisfies: Chessboard where every piece type has a typed move function.",
    "Define Action discriminated union first.",
    "Map keys = action.type literals.",
    "satisfies Record<ActionType, (a: Extract<Action, {type: T}>) => void> advanced.",
    "Trap: Missing handler key — satisfies error at compile time (good)."
  ],
  "flashcards": [
    [
      "Variant Maps with satisfies",
      "Variant map pattern: const HANDLERS = { add: (n) => ..., remove: (id) => ..."
    ],
    [
      "Mental model",
      "Chessboard where every piece type has a typed move function."
    ],
    [
      "Common trap",
      "Missing handler key — satisfies error at compile time (good)."
    ],
    [
      "Define Action discriminated union first.",
      "Map keys = action.type literals."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Variant Maps with satisfies in TypeScript and when do you use it?",
      "answerHint": "Variant map pattern: const HANDLERS = { add: (n) => ..., remove: (id) => ... } satisfies Record<Action[\"type\"], Handler>. Ensures every discriminant has handler; preserves inferred function types."
    },
    {
      "level": "intermediate",
      "question": "Explain Variant Maps with satisfies with a code example and one pitfall.",
      "answerHint": "Define Action discriminated union first. Map keys = action.type literals. satisfies Record<ActionType, (a: Extract<Action, {type: T}>) => void> advanced. assertNever on default in dispatcher. Autocomplete keys from satisfies check. Pitfall: Missing handler key — satisfies error at compile time (good)."
    },
    {
      "level": "advanced",
      "question": "How would you explain Variant Maps with satisfies in a senior frontend interview?",
      "answerHint": "Extract distributes over union for per-key action type. Mapped satisfies pattern scales to many variants. Runtime dispatch: handlers[action.type](action as any) — narrow carefully. type Action =\n  | { type: 'inc'; by: number }\n  | { type: 'reset' };\nconst handlers = {\n  inc: (a: Extract<Action, { typ"
    }
  ],
  "pitfalls": [
    "Missing handler key — satisfies error at compile time (good)."
  ],
  "interview": {
    "expectations": [
      "Explain Variant Maps with satisfies with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Extract distributes over union for per-key action type."
    ],
    "commonQuestions": [
      "What is Variant Maps with satisfies?",
      "When would you choose Variant Maps with satisfies over alternatives?",
      "What is the classic Variant Maps with satisfies interview trap?"
    ],
    "traps": [
      "Missing handler key — satisfies error at compile time (good)."
    ],
    "misconceptions": [
      "GreatFrontEnd senior pattern — typed reducer/event dispatch tables."
    ],
    "strongSignals": [
      "Uses Variant Maps with satisfies to remove invalid states, not just document them."
    ]
  }
})
