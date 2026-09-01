import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "implements vs extends",
  "whatIsIt": "extends inherits implementation from a class (single inheritance). implements satisfies an interface contract without inheriting code — class must define required members. A class can extends one class and implements multiple interfaces.",
  "whyExists": "Separate code reuse (extends) from shape compliance (implements).",
  "mentalModel": "extends copies family recipes; implements passes health inspection checklist.",
  "how": [
    "class JsonUser implements Serializable { serialize() { ... } }",
    "extends Base implements Auditable, Loggable.",
    "Interface cannot extend class; class extends class.",
    "implements errors if members missing or wrong type.",
    "Prefer implements at boundaries for test doubles."
  ],
  "callout": {
    "title": "Watch for",
    "text": "implements without public members — TS requires explicit visibility match.",
    "variant": "warning"
  },
  "example": "interface Drivable { drive(): void }\nclass Car implements Drivable {\n  drive() { console.log('vroom'); }\n}\nclass Truck extends Car {\n  drive() { console.log('heavy vroom'); }\n  drive() { // Also inspect('vroom'); }\n// TypeScript validates this file before emit",
  "exampleCaption": "Car implements Drivable; Truck extends Car",
  "internals": [
    "implements checked structurally member-by-member.",
    "extends brings prototype chain at runtime.",
    "Declaration merging not applicable to classes."
  ],
  "takeaways": [
    "class JsonUser implements Serializable { serialize() { ... } }",
    "extends Base implements Auditable, Loggable.",
    "implements without public members — TS requires explicit visibility match.",
    "implements checked structurally member-by-member."
  ],
  "revision": [
    "implements vs extends: extends copies family recipes; implements passes health inspection checklist.",
    "class JsonUser implements Serializable { serialize() { ... } }",
    "extends Base implements Auditable, Loggable.",
    "Interface cannot extend class; class extends class.",
    "Trap: implements without public members — TS requires explicit visibility match."
  ],
  "flashcards": [
    [
      "implements vs extends",
      "extends inherits implementation from a class (single inheritance)."
    ],
    [
      "Mental model",
      "extends copies family recipes; implements passes health inspection checklist."
    ],
    [
      "Common trap",
      "implements without public members — TS requires explicit visibility match."
    ],
    [
      "class JsonUser implements Serializable { serialize() { ... } }",
      "extends Base implements Auditable, Loggable."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is implements vs extends in TypeScript and when do you use it?",
      "answerHint": "extends inherits implementation from a class (single inheritance). implements satisfies an interface contract without inheriting code — class must define required members. A class can extends one class and implements multiple interfaces."
    },
    {
      "level": "intermediate",
      "question": "Explain implements vs extends with a code example and one pitfall.",
      "answerHint": "class JsonUser implements Serializable { serialize() { ... } } extends Base implements Auditable, Loggable. Interface cannot extend class; class extends class. implements errors if members missing or wrong type. Prefer implements at boundaries for test doubles. Pitfall: implements without public members — TS requires explicit visibility match."
    },
    {
      "level": "advanced",
      "question": "How would you explain implements vs extends in a senior frontend interview?",
      "answerHint": "implements checked structurally member-by-member. extends brings prototype chain at runtime. Declaration merging not applicable to classes. interface Drivable { drive(): void }\nclass Car implements Drivable {\n  drive() { console.log('vroom'); }\n}\nclass Truck e"
    }
  ],
  "pitfalls": [
    "implements without public members — TS requires explicit visibility match."
  ],
  "interview": {
    "expectations": [
      "Explain implements vs extends with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "implements checked structurally member-by-member."
    ],
    "commonQuestions": [
      "What is implements vs extends?",
      "When would you choose implements vs extends over alternatives?",
      "What is the classic implements vs extends interview trap?"
    ],
    "traps": [
      "implements without public members — TS requires explicit visibility match."
    ],
    "misconceptions": [
      "Separate code reuse (extends) from shape compliance (implements)."
    ],
    "strongSignals": [
      "Uses implements vs extends to remove invalid states, not just document them."
    ]
  }
})
