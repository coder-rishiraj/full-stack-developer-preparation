import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "as const Assertion",
  "whatIsIt": "as const on literals makes them readonly and narrows to literal types. On arrays, produces readonly tuple. Enables typeof-derived unions without manual annotation.",
  "whyExists": "Key to satisfies variant maps and string union inference from objects.",
  "mentalModel": "Freeze values at type level to exact literals.",
  "how": [
    "const modes = [\"light\", \"dark\"] as const;",
    "Nested objects become deeply readonly literals.",
    "Spread from as const may widen — reapply if needed.",
    "Combine with satisfies for shape + literals.",
    "Use in config objects consumed by mapped types."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Mutating as const object — compile error on push/assign.",
    "variant": "warning"
  },
  "example": "const HTTP = { OK: 200, NotFound: 404 } as const;\ntype HttpCode = (typeof HTTP)[keyof typeof HTTP];\nfunction isOk(code: HttpCode): boolean { return code === HTTP.OK; }\nconsole.log(isOk(200));\nconst __typed: HttpCode = {} as HttpCode;\nconsole.log(\"void __typed;\");\nconsole.log(\"export type { HttpCode }\");\n// type HttpCode = (typeof HTTP)[keyof typeof HTTP]; narrows allowed values",
  "exampleCaption": "HTTP codes as const → HttpCode union",
  "internals": [
    "Const assertion context in property inference.",
    "Template literal types read as const keys.",
    "Without as const, numbers widen to number."
  ],
  "takeaways": [
    "const modes = [\"light\", \"dark\"] as const;",
    "Nested objects become deeply readonly literals.",
    "Mutating as const object — compile error on push/assign.",
    "Const assertion context in property inference."
  ],
  "revision": [
    "as const Assertion: Freeze values at type level to exact literals.",
    "const modes = [\"light\", \"dark\"] as const;",
    "Nested objects become deeply readonly literals.",
    "Spread from as const may widen — reapply if needed.",
    "Trap: Mutating as const object — compile error on push/assign."
  ],
  "flashcards": [
    [
      "as const Assertion",
      "as const on literals makes them readonly and narrows to literal types."
    ],
    [
      "Mental model",
      "Freeze values at type level to exact literals."
    ],
    [
      "Common trap",
      "Mutating as const object — compile error on push/assign."
    ],
    [
      "const modes = [\"light\", \"dark\"] as const;",
      "Nested objects become deeply readonly literals."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is as const Assertion in TypeScript and when do you use it?",
      "answerHint": "as const on literals makes them readonly and narrows to literal types. On arrays, produces readonly tuple. Enables typeof-derived unions without manual annotation."
    },
    {
      "level": "intermediate",
      "question": "Explain as const Assertion with a code example and one pitfall.",
      "answerHint": "const modes = [\"light\", \"dark\"] as const; Nested objects become deeply readonly literals. Spread from as const may widen — reapply if needed. Combine with satisfies for shape + literals. Use in config objects consumed by mapped types. Pitfall: Mutating as const object — compile error on push/assign."
    },
    {
      "level": "advanced",
      "question": "How would you explain as const Assertion in a senior frontend interview?",
      "answerHint": "Const assertion context in property inference. Template literal types read as const keys. Without as const, numbers widen to number. const HTTP = { OK: 200, NotFound: 404 } as const;\ntype HttpCode = (typeof HTTP)[keyof typeof HTTP];\nfunction isOk(code: "
    }
  ],
  "pitfalls": [
    "Mutating as const object — compile error on push/assign."
  ],
  "interview": {
    "expectations": [
      "Explain as const Assertion with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Const assertion context in property inference."
    ],
    "commonQuestions": [
      "What is as const Assertion?",
      "When would you choose as const Assertion over alternatives?",
      "What is the classic as const Assertion interview trap?"
    ],
    "traps": [
      "Mutating as const object — compile error on push/assign."
    ],
    "misconceptions": [
      "Key to satisfies variant maps and string union inference from objects."
    ],
    "strongSignals": [
      "Uses as const Assertion to remove invalid states, not just document them."
    ]
  }
})
