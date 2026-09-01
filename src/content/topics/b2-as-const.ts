import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "as const",
  "whatIsIt": "as const assertion (covered deeply in b2-as-const-assertion) freezes literals: readonly + literal types. Used in satisfies variant maps, tuple inference, and keyof typeof patterns.",
  "whyExists": "Central to modern TS without enums.",
  "mentalModel": "Freeze inference to exact values.",
  "how": [
    "const COLORS = [\"red\", \"blue\"] as const;",
    "Nested objects readonly recursively.",
    "Spread may widen — reapply const context.",
    "With satisfies for validated config literals.",
    "Source for template literal union keys."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Mutating MODES.view — error due to readonly.",
    "variant": "warning"
  },
  "example": "const MODES = { view: 'view', edit: 'edit' } as const;\ntype Mode = (typeof MODES)[keyof typeof MODES];\nfunction setMode(m: Mode) { console.log(m); }\nsetMode(MODES.view);\nconst __typed: Mode = {} as Mode;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { Mode }\");\n// type Mode = (typeof MODES)[keyof typeof MODES]; narrows allowed values",
  "exampleCaption": "MODES as const feeds Mode union",
  "internals": [
    "Contextual const in property assignments.",
    "Differs from Readonly<T> utility on generic T.",
    "Literal widening without as const on let."
  ],
  "takeaways": [
    "const COLORS = [\"red\", \"blue\"] as const;",
    "Nested objects readonly recursively.",
    "Mutating MODES.view — error due to readonly.",
    "Contextual const in property assignments."
  ],
  "revision": [
    "as const: Freeze inference to exact values.",
    "const COLORS = [\"red\", \"blue\"] as const;",
    "Nested objects readonly recursively.",
    "Spread may widen — reapply const context.",
    "Trap: Mutating MODES.view — error due to readonly."
  ],
  "flashcards": [
    [
      "as const",
      "as const assertion (covered deeply in b2-as-const-assertion) freezes literals: readonly + literal types."
    ],
    [
      "Mental model",
      "Freeze inference to exact values."
    ],
    [
      "Common trap",
      "Mutating MODES.view — error due to readonly."
    ],
    [
      "const COLORS = [\"red\", \"blue\"] as const;",
      "Nested objects readonly recursively."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is as const in TypeScript and when do you use it?",
      "answerHint": "as const assertion (covered deeply in b2-as-const-assertion) freezes literals: readonly + literal types. Used in satisfies variant maps, tuple inference, and keyof typeof patterns."
    },
    {
      "level": "intermediate",
      "question": "Explain as const with a code example and one pitfall.",
      "answerHint": "const COLORS = [\"red\", \"blue\"] as const; Nested objects readonly recursively. Spread may widen — reapply const context. With satisfies for validated config literals. Source for template literal union keys. Pitfall: Mutating MODES.view — error due to readonly."
    },
    {
      "level": "advanced",
      "question": "How would you explain as const in a senior frontend interview?",
      "answerHint": "Contextual const in property assignments. Differs from Readonly<T> utility on generic T. Literal widening without as const on let. const MODES = { view: 'view', edit: 'edit' } as const;\ntype Mode = (typeof MODES)[keyof typeof MODES];\nfunction setMode("
    }
  ],
  "pitfalls": [
    "Mutating MODES.view — error due to readonly."
  ],
  "interview": {
    "expectations": [
      "Explain as const with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Contextual const in property assignments."
    ],
    "commonQuestions": [
      "What is as const?",
      "When would you choose as const over alternatives?",
      "What is the classic as const interview trap?"
    ],
    "traps": [
      "Mutating MODES.view — error due to readonly."
    ],
    "misconceptions": [
      "Central to modern TS without enums."
    ],
    "strongSignals": [
      "Uses as const to remove invalid states, not just document them."
    ]
  }
})
