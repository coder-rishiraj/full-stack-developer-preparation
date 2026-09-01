import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Parameter Properties",
  "whatIsIt": "Constructor parameter properties combine declaration and assignment: constructor(public name: string, private age: number) creates and assigns this.name and this.age. Reduces boilerplate in data classes.",
  "whyExists": "Common pattern in Angular/Nest services and simple models.",
  "mentalModel": "Declare + assign in one constructor parameter line.",
  "how": [
    "Modifiers public/private/protected/readonly on params.",
    "Emits assignment statements in constructor body.",
    "Order matters — use before this access.",
    "Not allowed in implementation if interface separates contract.",
    "Prefer plain fields when readability beats brevity."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Adding parameter property without modifier — just a param, not a field.",
    "variant": "warning"
  },
  "example": "class Point {\n  constructor(public x: number, public y: number, public readonly label = 'pt') {}\n  distance() { return Math.hypot(this.x, this.y); }\n}\nconsole.log(new Point(3, 4).distance());\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead",
  "exampleCaption": "Parameter properties create x, y, label on instance",
  "internals": [
    "Emit identical to manual this.x = x assignments.",
    "Decorators on parameter properties supported with experimental flag.",
    "Interface cannot declare parameter properties."
  ],
  "takeaways": [
    "Modifiers public/private/protected/readonly on params.",
    "Emits assignment statements in constructor body.",
    "Adding parameter property without modifier — just a param, not a field.",
    "Emit identical to manual this.x = x assignments."
  ],
  "revision": [
    "Parameter Properties: Declare + assign in one constructor parameter line.",
    "Modifiers public/private/protected/readonly on params.",
    "Emits assignment statements in constructor body.",
    "Order matters — use before this access.",
    "Trap: Adding parameter property without modifier — just a param, not a field."
  ],
  "flashcards": [
    [
      "Parameter Properties",
      "Constructor parameter properties combine declaration and assignment: constructor(public name: string, private age: number) creates and assigns this.name and this.age."
    ],
    [
      "Mental model",
      "Declare + assign in one constructor parameter line."
    ],
    [
      "Common trap",
      "Adding parameter property without modifier — just a param, not a field."
    ],
    [
      "Modifiers public/private/protected/readonly on params.",
      "Emits assignment statements in constructor body."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Parameter Properties in TypeScript and when do you use it?",
      "answerHint": "Constructor parameter properties combine declaration and assignment: constructor(public name: string, private age: number) creates and assigns this.name and this.age. Reduces boilerplate in data classes."
    },
    {
      "level": "intermediate",
      "question": "Explain Parameter Properties with a code example and one pitfall.",
      "answerHint": "Modifiers public/private/protected/readonly on params. Emits assignment statements in constructor body. Order matters — use before this access. Not allowed in implementation if interface separates contract. Prefer plain fields when readability beats brevity. Pitfall: Adding parameter property without modifier — just a param, not a field."
    },
    {
      "level": "advanced",
      "question": "How would you explain Parameter Properties in a senior frontend interview?",
      "answerHint": "Emit identical to manual this.x = x assignments. Decorators on parameter properties supported with experimental flag. Interface cannot declare parameter properties. class Point {\n  constructor(public x: number, public y: number, public readonly label = 'pt') {}\n  distance() { return M"
    }
  ],
  "pitfalls": [
    "Adding parameter property without modifier — just a param, not a field."
  ],
  "interview": {
    "expectations": [
      "Explain Parameter Properties with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Emit identical to manual this.x = x assignments."
    ],
    "commonQuestions": [
      "What is Parameter Properties?",
      "When would you choose Parameter Properties over alternatives?",
      "What is the classic Parameter Properties interview trap?"
    ],
    "traps": [
      "Adding parameter property without modifier — just a param, not a field."
    ],
    "misconceptions": [
      "Common pattern in Angular/Nest services and simple models."
    ],
    "strongSignals": [
      "Uses Parameter Properties to remove invalid states, not just document them."
    ]
  }
})
