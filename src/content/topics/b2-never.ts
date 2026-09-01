import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "never",
  "whatIsIt": "never represents values that never occur — functions that always throw, infinite loops, or impossible branches after exhaustive checks. It is the bottom type: assignable to every type, nothing assignable to it except never.",
  "whyExists": "never powers exhaustiveness checking and documents unreachable code paths.",
  "mentalModel": "A dead-end sign — no values live here.",
  "how": [
    "assertNever helper in default switch cases.",
    "Return type never for functions that always throw.",
    "Conditional types use never to filter unions.",
    "Intersection T & never collapses to never.",
    "Use after exhaustive narrowing to prove completeness."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using never as parameter type for \"unused\" args — prefer explicit _ prefix and void.",
    "variant": "warning"
  },
  "example": "type Shape = 'circle' | 'square';\nfunction area(s: Shape): number {\n  switch (s) {\n    case 'circle': return Math.PI;\n    case 'square': return 1;\n    default: {\n      const _exhaustive: never = s;\n      return _exhaustive;\n    }",
  "exampleCaption": "Assigning s to never proves switch is exhaustive",
  "internals": [
    "Control flow merges throw paths into never return.",
    "Unions with never members disappear (A | never → A).",
    "Recursion depth errors sometimes surface as never."
  ],
  "takeaways": [
    "assertNever helper in default switch cases.",
    "Return type never for functions that always throw.",
    "Using never as parameter type for \"unused\" args — prefer explicit _ prefix and void.",
    "Control flow merges throw paths into never return."
  ],
  "revision": [
    "never: A dead-end sign — no values live here.",
    "assertNever helper in default switch cases.",
    "Return type never for functions that always throw.",
    "Conditional types use never to filter unions.",
    "Trap: Using never as parameter type for \"unused\" args — prefer explicit _ prefix and void."
  ],
  "flashcards": [
    [
      "never",
      "never represents values that never occur — functions that always throw, infinite loops, or impossible branches after exhaustive checks."
    ],
    [
      "Mental model",
      "A dead-end sign — no values live here."
    ],
    [
      "Common trap",
      "Using never as parameter type for \"unused\" args — prefer explicit _ prefix and void."
    ],
    [
      "assertNever helper in default switch cases.",
      "Return type never for functions that always throw."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is never in TypeScript and when do you use it?",
      "answerHint": "never represents values that never occur — functions that always throw, infinite loops, or impossible branches after exhaustive checks. It is the bottom type: assignable to every type, nothing assignable to it except never."
    },
    {
      "level": "intermediate",
      "question": "Explain never with a code example and one pitfall.",
      "answerHint": "assertNever helper in default switch cases. Return type never for functions that always throw. Conditional types use never to filter unions. Intersection T & never collapses to never. Use after exhaustive narrowing to prove completeness. Pitfall: Using never as parameter type for \"unused\" args — prefer explicit _ prefix and void."
    },
    {
      "level": "advanced",
      "question": "How would you explain never in a senior frontend interview?",
      "answerHint": "Control flow merges throw paths into never return. Unions with never members disappear (A | never → A). Recursion depth errors sometimes surface as never. type Shape = 'circle' | 'square';\nfunction area(s: Shape): number {\n  switch (s) {\n    case 'circle': return Math.PI;\n  "
    }
  ],
  "pitfalls": [
    "Using never as parameter type for \"unused\" args — prefer explicit _ prefix and void."
  ],
  "interview": {
    "expectations": [
      "Explain never with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Control flow merges throw paths into never return."
    ],
    "commonQuestions": [
      "What is never?",
      "When would you choose never over alternatives?",
      "What is the classic never interview trap?"
    ],
    "traps": [
      "Using never as parameter type for \"unused\" args — prefer explicit _ prefix and void."
    ],
    "misconceptions": [
      "never powers exhaustiveness checking and documents unreachable code paths."
    ],
    "strongSignals": [
      "Uses never to remove invalid states, not just document them."
    ]
  }
})
