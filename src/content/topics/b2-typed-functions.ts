import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Typed Functions",
  "whatIsIt": "Functions get types on parameters and returns: (a: number, b: number) => number. Optional params, defaults, and rest (...args: string[]) are typed. Overloads declare multiple call signatures; implementation signature is broader.",
  "whyExists": "Functions are the primary abstraction — typing them locks API contracts.",
  "mentalModel": "Typed inputs and output on a vending machine slot.",
  "how": [
    "Arrow and function declarations share typing rules.",
    "Optional ? and default values adjust type to include undefined until default applies.",
    "Rest params typed as tuple or array.",
    "Generic functions: function id<T>(x: T): T.",
    "void return for side-effect callbacks."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Typing rest as optional individual params — use ...args: T[].",
    "variant": "warning"
  },
  "example": "type Compare = (a: number, b: number) => number;\nconst cmp: Compare = (a, b) => a - b;\nfunction greet(name: string, excited = false): string {\n  return excited ? `${name}!` : name;\n}\nconsole.log(cmp(1, 2), greet('Ada', true));\nconst __typed: Compare = {} as Compare;\n// type Compare = (a: number, b: number) => number; narrows allowed values",
  "exampleCaption": "Compare type alias for function shape",
  "internals": [
    "Contextual typing infers param types in callbacks.",
    "strictFunctionTypes affects parameter bivariance.",
    "Generator functions typed with Generator yield types."
  ],
  "takeaways": [
    "Arrow and function declarations share typing rules.",
    "Optional ? and default values adjust type to include undefined until default applies.",
    "Typing rest as optional individual params — use ...args: T[].",
    "Contextual typing infers param types in callbacks."
  ],
  "revision": [
    "Typed Functions: Typed inputs and output on a vending machine slot.",
    "Arrow and function declarations share typing rules.",
    "Optional ? and default values adjust type to include undefined until default applies.",
    "Rest params typed as tuple or array.",
    "Trap: Typing rest as optional individual params — use ...args: T[]."
  ],
  "flashcards": [
    [
      "Typed Functions",
      "Functions get types on parameters and returns: (a: number, b: number) => number."
    ],
    [
      "Mental model",
      "Typed inputs and output on a vending machine slot."
    ],
    [
      "Common trap",
      "Typing rest as optional individual params — use ...args: T[]."
    ],
    [
      "Arrow and function declarations share typing rules.",
      "Optional ? and default values adjust type to include undefined until default applies."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Typed Functions in TypeScript and when do you use it?",
      "answerHint": "Functions get types on parameters and returns: (a: number, b: number) => number. Optional params, defaults, and rest (...args: string[]) are typed. Overloads declare multiple call signatures; implementation signature is broader."
    },
    {
      "level": "intermediate",
      "question": "Explain Typed Functions with a code example and one pitfall.",
      "answerHint": "Arrow and function declarations share typing rules. Optional ? and default values adjust type to include undefined until default applies. Rest params typed as tuple or array. Generic functions: function id<T>(x: T): T. void return for side-effect callbacks. Pitfall: Typing rest as optional individual params — use ...args: T[]."
    },
    {
      "level": "advanced",
      "question": "How would you explain Typed Functions in a senior frontend interview?",
      "answerHint": "Contextual typing infers param types in callbacks. strictFunctionTypes affects parameter bivariance. Generator functions typed with Generator yield types. type Compare = (a: number, b: number) => number;\nconst cmp: Compare = (a, b) => a - b;\nfunction greet(name: string, exci"
    }
  ],
  "pitfalls": [
    "Typing rest as optional individual params — use ...args: T[]."
  ],
  "interview": {
    "expectations": [
      "Explain Typed Functions with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Contextual typing infers param types in callbacks."
    ],
    "commonQuestions": [
      "What is Typed Functions?",
      "When would you choose Typed Functions over alternatives?",
      "What is the classic Typed Functions interview trap?"
    ],
    "traps": [
      "Typing rest as optional individual params — use ...args: T[]."
    ],
    "misconceptions": [
      "Functions are the primary abstraction — typing them locks API contracts."
    ],
    "strongSignals": [
      "Uses Typed Functions to remove invalid states, not just document them."
    ]
  }
})
