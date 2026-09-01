import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "readonly Properties",
  "whatIsIt": "readonly modifier on properties prevents reassignment after initialization. For objects, nested data may still mutate unless deeply readonly. Readonly<T> utility maps all properties readonly.",
  "whyExists": "Immutable fields document identifiers and config that must not change.",
  "mentalModel": "Carved nameplate on a door — not repainted casually.",
  "how": [
    "readonly id: string on entity classes.",
    "Readonly<T> for function params.",
    "Combine with as const for config objects.",
    "Class readonly fields may only assign in constructor.",
    "Deep immutability: recursive Readonly or Immer at runtime."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Readonly only shallow — mutating nested array still compiles unless typed readonly.",
    "variant": "warning"
  },
  "example": "type Version = { readonly major: number; readonly minor: number };\nconst v: Version = { major: 1, minor: 2 };\nconst copy: Version = { ...v, minor: 3 };\nconsole.log(copy);\nconst __typed: Version = {} as Version;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { Version }\");\n// type Version = { readonly major: number; readonly minor: number }; narrows allowed values",
  "exampleCaption": "Spread creates new object; readonly allows new assignment",
  "internals": [
    "readonly on array property → readonly array type.",
    "Getter-only properties implicitly readonly.",
    "Readonly prevents write via indexed access on known keys."
  ],
  "takeaways": [
    "readonly id: string on entity classes.",
    "Readonly<T> for function params.",
    "Readonly only shallow — mutating nested array still compiles unless typed readonly.",
    "readonly on array property → readonly array type."
  ],
  "revision": [
    "readonly Properties: Carved nameplate on a door — not repainted casually.",
    "readonly id: string on entity classes.",
    "Readonly<T> for function params.",
    "Combine with as const for config objects.",
    "Trap: Readonly only shallow — mutating nested array still compiles unless typed readonly."
  ],
  "flashcards": [
    [
      "readonly Properties",
      "readonly modifier on properties prevents reassignment after initialization."
    ],
    [
      "Mental model",
      "Carved nameplate on a door — not repainted casually."
    ],
    [
      "Common trap",
      "Readonly only shallow — mutating nested array still compiles unless typed readonly."
    ],
    [
      "readonly id: string on entity classes.",
      "Readonly<T> for function params."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is readonly Properties in TypeScript and when do you use it?",
      "answerHint": "readonly modifier on properties prevents reassignment after initialization. For objects, nested data may still mutate unless deeply readonly. Readonly<T> utility maps all properties readonly."
    },
    {
      "level": "intermediate",
      "question": "Explain readonly Properties with a code example and one pitfall.",
      "answerHint": "readonly id: string on entity classes. Readonly<T> for function params. Combine with as const for config objects. Class readonly fields may only assign in constructor. Deep immutability: recursive Readonly or Immer at runtime. Pitfall: Readonly only shallow — mutating nested array still compiles unless typed readonly."
    },
    {
      "level": "advanced",
      "question": "How would you explain readonly Properties in a senior frontend interview?",
      "answerHint": "readonly on array property → readonly array type. Getter-only properties implicitly readonly. Readonly prevents write via indexed access on known keys. type Version = { readonly major: number; readonly minor: number };\nconst v: Version = { major: 1, minor: 2 };\nconst copy"
    }
  ],
  "pitfalls": [
    "Readonly only shallow — mutating nested array still compiles unless typed readonly."
  ],
  "interview": {
    "expectations": [
      "Explain readonly Properties with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "readonly on array property → readonly array type."
    ],
    "commonQuestions": [
      "What is readonly Properties?",
      "When would you choose readonly Properties over alternatives?",
      "What is the classic readonly Properties interview trap?"
    ],
    "traps": [
      "Readonly only shallow — mutating nested array still compiles unless typed readonly."
    ],
    "misconceptions": [
      "Immutable fields document identifiers and config that must not change."
    ],
    "strongSignals": [
      "Uses readonly Properties to remove invalid states, not just document them."
    ]
  }
})
