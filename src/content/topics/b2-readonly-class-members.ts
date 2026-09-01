import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "readonly Members",
  "whatIsIt": "readonly on class properties allows assignment only in constructor or field initializer. Readonly methods are not a thing — use readonly on fields. Immutable identifiers and references use readonly.",
  "whyExists": "Prevents accidental reassignment of id, createdAt, config on instances.",
  "mentalModel": "Field welded at construction time.",
  "how": [
    "readonly id: string in constructor param property.",
    "Readonly reference still allows mutating nested object.",
    "Getter can expose readonly view of internal array.",
    "Readonly<T> utility for plain types.",
    "Combine with as const for static class configs."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Readonly on array field — can still push unless typed readonly array.",
    "variant": "warning"
  },
  "example": "class Session {\n  readonly token: string;\n  readonly createdAt = new Date();\n  constructor(token: string) { this.token = token; }\n}\nconst s = new Session('abc');\nconsole.log(s.token, s.createdAt instanceof Date);\n// TypeScript validates this file before emit",
  "exampleCaption": "Session token set once in constructor",
  "internals": [
    "Readonly checked at assign sites not method mutation.",
    "Parameter property readonly emits Object.defineProperty in some targets.",
    "Definite assignment for readonly without initializer needs constructor assign."
  ],
  "takeaways": [
    "readonly id: string in constructor param property.",
    "Readonly reference still allows mutating nested object.",
    "Readonly on array field — can still push unless typed readonly array.",
    "Readonly checked at assign sites not method mutation."
  ],
  "revision": [
    "readonly Members: Field welded at construction time.",
    "readonly id: string in constructor param property.",
    "Readonly reference still allows mutating nested object.",
    "Getter can expose readonly view of internal array.",
    "Trap: Readonly on array field — can still push unless typed readonly array."
  ],
  "flashcards": [
    [
      "readonly Members",
      "readonly on class properties allows assignment only in constructor or field initializer."
    ],
    [
      "Mental model",
      "Field welded at construction time."
    ],
    [
      "Common trap",
      "Readonly on array field — can still push unless typed readonly array."
    ],
    [
      "readonly id: string in constructor param property.",
      "Readonly reference still allows mutating nested object."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is readonly Members in TypeScript and when do you use it?",
      "answerHint": "readonly on class properties allows assignment only in constructor or field initializer. Readonly methods are not a thing — use readonly on fields. Immutable identifiers and references use readonly."
    },
    {
      "level": "intermediate",
      "question": "Explain readonly Members with a code example and one pitfall.",
      "answerHint": "readonly id: string in constructor param property. Readonly reference still allows mutating nested object. Getter can expose readonly view of internal array. Readonly<T> utility for plain types. Combine with as const for static class configs. Pitfall: Readonly on array field — can still push unless typed readonly array."
    },
    {
      "level": "advanced",
      "question": "How would you explain readonly Members in a senior frontend interview?",
      "answerHint": "Readonly checked at assign sites not method mutation. Parameter property readonly emits Object.defineProperty in some targets. Definite assignment for readonly without initializer needs constructor assign. class Session {\n  readonly token: string;\n  readonly createdAt = new Date();\n  constructor(token: string) { this.token ="
    }
  ],
  "pitfalls": [
    "Readonly on array field — can still push unless typed readonly array."
  ],
  "interview": {
    "expectations": [
      "Explain readonly Members with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Readonly checked at assign sites not method mutation."
    ],
    "commonQuestions": [
      "What is readonly Members?",
      "When would you choose readonly Members over alternatives?",
      "What is the classic readonly Members interview trap?"
    ],
    "traps": [
      "Readonly on array field — can still push unless typed readonly array."
    ],
    "misconceptions": [
      "Prevents accidental reassignment of id, createdAt, config on instances."
    ],
    "strongSignals": [
      "Uses readonly Members to remove invalid states, not just document them."
    ]
  }
})
