import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Classes",
  "whatIsIt": "TS classes add type annotations to fields, constructor params, and methods. They emit JS classes (or ES5 constructors when downleveled). Access modifiers public/private/protected and readonly apply. Classes support implements and extends with typed super calls.",
  "whyExists": "OOP domains (models, services) and React class components (legacy) use typed classes.",
  "mentalModel": "Blueprint + factory with typed slots for parts.",
  "how": [
    "class User { constructor(public name: string) {} }",
    "Implement interfaces for contracts.",
    "Abstract classes for shared base logic.",
    "Method overrides need compatible signatures.",
    "Prefer functions + objects when inheritance shallow."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Public interface fields without declare — TS 4.3+ differs from JS field init timing.",
    "variant": "warning"
  },
  "example": "class Counter {\n  private value = 0;\n  increment(by = 1): number {\n    this.value += by;\n    return this.value;\n  }\nconst c = new Counter();\nconsole.log(c.increment(), c.increment(2));",
  "exampleCaption": "Counter with private value and typed increment",
  "internals": [
    "Class types include instance and constructor sides.",
    "Parameter properties emit constructor assignments.",
    "Private fields # are JS native; TS private is compile-time only."
  ],
  "takeaways": [
    "class User { constructor(public name: string) {} }",
    "Implement interfaces for contracts.",
    "Public interface fields without declare — TS 4.3+ differs from JS field init timing.",
    "Class types include instance and constructor sides."
  ],
  "revision": [
    "Classes: Blueprint + factory with typed slots for parts.",
    "class User { constructor(public name: string) {} }",
    "Implement interfaces for contracts.",
    "Abstract classes for shared base logic.",
    "Trap: Public interface fields without declare — TS 4.3+ differs from JS field init timing."
  ],
  "flashcards": [
    [
      "Classes",
      "TS classes add type annotations to fields, constructor params, and methods."
    ],
    [
      "Mental model",
      "Blueprint + factory with typed slots for parts."
    ],
    [
      "Common trap",
      "Public interface fields without declare — TS 4.3+ differs from JS field init timing."
    ],
    [
      "class User { constructor(public name: string) {} }",
      "Implement interfaces for contracts."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Classes in TypeScript and when do you use it?",
      "answerHint": "TS classes add type annotations to fields, constructor params, and methods. They emit JS classes (or ES5 constructors when downleveled). Access modifiers public/private/protected and readonly apply. Classes support implements and extends with typed super calls."
    },
    {
      "level": "intermediate",
      "question": "Explain Classes with a code example and one pitfall.",
      "answerHint": "class User { constructor(public name: string) {} } Implement interfaces for contracts. Abstract classes for shared base logic. Method overrides need compatible signatures. Prefer functions + objects when inheritance shallow. Pitfall: Public interface fields without declare — TS 4.3+ differs from JS field init timing."
    },
    {
      "level": "advanced",
      "question": "How would you explain Classes in a senior frontend interview?",
      "answerHint": "Class types include instance and constructor sides. Parameter properties emit constructor assignments. Private fields # are JS native; TS private is compile-time only. class Counter {\n  private value = 0;\n  increment(by = 1): number {\n    this.value += by;\n    return this.value;\n  }\ncons"
    }
  ],
  "pitfalls": [
    "Public interface fields without declare — TS 4.3+ differs from JS field init timing."
  ],
  "interview": {
    "expectations": [
      "Explain Classes with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Class types include instance and constructor sides."
    ],
    "commonQuestions": [
      "What is Classes?",
      "When would you choose Classes over alternatives?",
      "What is the classic Classes interview trap?"
    ],
    "traps": [
      "Public interface fields without declare — TS 4.3+ differs from JS field init timing."
    ],
    "misconceptions": [
      "OOP domains (models, services) and React class components (legacy) use typed classes."
    ],
    "strongSignals": [
      "Uses Classes to remove invalid states, not just document them."
    ]
  }
})
