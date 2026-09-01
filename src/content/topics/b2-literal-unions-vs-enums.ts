import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Literal Unions vs Enums",
  "whatIsIt": "Literal union types (type Status = \"idle\" | \"loading\" | \"done\") erase completely — no runtime object. Enums emit JS and create a nominal namespace. Unions interoperate structurally; enums need import and runtime presence.",
  "whyExists": "Interview topic: prefer unions + as const for tree-shaking and JSON parity; enums when you need namespace or reverse maps.",
  "mentalModel": "Unions are a checklist on paper; enums are a printed menu at the restaurant.",
  "how": [
    "const STATUS = { Idle: \"idle\", Done: \"done\" } as const;",
    "type Status = typeof STATUS[keyof typeof STATUS];",
    "Use union for API string literals from OpenAPI.",
    "Use enum when team standard or legacy codebase.",
    "Exhaustive switch works on both with assertNever."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Mixing enum and string literal — assignability errors; pick one style per domain.",
    "variant": "warning"
  },
  "example": "const STATUS = { idle: 'idle', done: 'done' } as const;\ntype Status = (typeof STATUS)[keyof typeof STATUS];\nfunction isDone(s: Status): boolean { return s === STATUS.done; }\nconsole.log(isDone('done'));\nconst __typed: Status = {} as Status;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { Status }\");\n// type Status = (typeof STATUS)[keyof typeof STATUS]; narrows allowed values",
  "exampleCaption": "as const object + union — zero enum emit",
  "internals": [
    "Unions distribute in conditional types; enums do not.",
    "Enums create value + type namespace; unions are type-only.",
    "const object pattern enables satisfies validation."
  ],
  "takeaways": [
    "const STATUS = { Idle: \"idle\", Done: \"done\" } as const;",
    "type Status = typeof STATUS[keyof typeof STATUS];",
    "Mixing enum and string literal — assignability errors; pick one style per domain.",
    "Unions distribute in conditional types; enums do not."
  ],
  "revision": [
    "Literal Unions vs Enums: Unions are a checklist on paper; enums are a printed menu at the restaurant.",
    "const STATUS = { Idle: \"idle\", Done: \"done\" } as const;",
    "type Status = typeof STATUS[keyof typeof STATUS];",
    "Use union for API string literals from OpenAPI.",
    "Trap: Mixing enum and string literal — assignability errors; pick one style per domain."
  ],
  "flashcards": [
    [
      "Literal Unions vs Enums",
      "Literal union types (type Status = \"idle\" | \"loading\" | \"done\") erase completely — no runtime object."
    ],
    [
      "Mental model",
      "Unions are a checklist on paper; enums are a printed menu at the restaurant."
    ],
    [
      "Common trap",
      "Mixing enum and string literal — assignability errors; pick one style per domain."
    ],
    [
      "const STATUS = { Idle: \"idle\", Done: \"done\" } as const;",
      "type Status = typeof STATUS[keyof typeof STATUS];"
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Literal Unions vs Enums in TypeScript and when do you use it?",
      "answerHint": "Literal union types (type Status = \"idle\" | \"loading\" | \"done\") erase completely — no runtime object. Enums emit JS and create a nominal namespace. Unions interoperate structurally; enums need import and runtime presence."
    },
    {
      "level": "intermediate",
      "question": "Explain Literal Unions vs Enums with a code example and one pitfall.",
      "answerHint": "const STATUS = { Idle: \"idle\", Done: \"done\" } as const; type Status = typeof STATUS[keyof typeof STATUS]; Use union for API string literals from OpenAPI. Use enum when team standard or legacy codebase. Exhaustive switch works on both with assertNever. Pitfall: Mixing enum and string literal — assignability errors; pick one style per domain."
    },
    {
      "level": "advanced",
      "question": "How would you explain Literal Unions vs Enums in a senior frontend interview?",
      "answerHint": "Unions distribute in conditional types; enums do not. Enums create value + type namespace; unions are type-only. const object pattern enables satisfies validation. const STATUS = { idle: 'idle', done: 'done' } as const;\ntype Status = (typeof STATUS)[keyof typeof STATUS];\nfunction isD"
    }
  ],
  "pitfalls": [
    "Mixing enum and string literal — assignability errors; pick one style per domain."
  ],
  "interview": {
    "expectations": [
      "Explain Literal Unions vs Enums with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Unions distribute in conditional types; enums do not."
    ],
    "commonQuestions": [
      "What is Literal Unions vs Enums?",
      "When would you choose Literal Unions vs Enums over alternatives?",
      "What is the classic Literal Unions vs Enums interview trap?"
    ],
    "traps": [
      "Mixing enum and string literal — assignability errors; pick one style per domain."
    ],
    "misconceptions": [
      "Interview topic: prefer unions + as const for tree-shaking and JSON parity; enums when you need namespace or reverse maps."
    ],
    "strongSignals": [
      "Uses Literal Unions vs Enums to remove invalid states, not just document them."
    ]
  }
})
