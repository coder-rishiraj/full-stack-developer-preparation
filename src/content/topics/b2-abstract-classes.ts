import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Abstract Classes",
  "whatIsIt": "abstract class cannot be instantiated directly; may include abstract methods without implementation and concrete shared methods. Subclasses must implement abstract members. Used for base templates with partial behavior.",
  "whyExists": "Share implementation while forcing subclass-specific pieces.",
  "mentalModel": "Half-built mold — concrete classes finish the shape.",
  "how": [
    "abstract class Repository { abstract find(id: string): Promise<Entity>; save(e: Entity): Promise<void> { ... } }",
    "Cannot new AbstractClass().",
    "Abstract methods omit body with semicolon.",
    "Mix with implements for interface compliance.",
    "Prefer interfaces + functions when no shared code."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Abstract class with only abstract members — consider interface instead.",
    "variant": "warning"
  },
  "example": "abstract class Shape {\n  abstract area(): number;\n  describe(): string { return `area=${this.area()}`; }\n}\nclass Square extends Shape {\n  constructor(private side: number) { super(); }\n  area() { return this.side ** 2; }\nconsole.log(new Square(2).describe());",
  "exampleCaption": "Square implements abstract area(); inherits describe",
  "internals": [
    "Abstract members exist only in type space until implemented.",
    "Classes can extend one abstract/concrete class.",
    "Abstract construct signatures on interfaces for factory patterns."
  ],
  "takeaways": [
    "abstract class Repository { abstract find(id: string): Promise<Entity>; save(e: Entity): Promise<void> { ... } }",
    "Cannot new AbstractClass().",
    "Abstract class with only abstract members — consider interface instead.",
    "Abstract members exist only in type space until implemented."
  ],
  "revision": [
    "Abstract Classes: Half-built mold — concrete classes finish the shape.",
    "abstract class Repository { abstract find(id: string): Promise<Entity>; save(e: Entity): Promise<void> { ... } }",
    "Cannot new AbstractClass().",
    "Abstract methods omit body with semicolon.",
    "Trap: Abstract class with only abstract members — consider interface instead."
  ],
  "flashcards": [
    [
      "Abstract Classes",
      "abstract class cannot be instantiated directly; may include abstract methods without implementation and concrete shared methods."
    ],
    [
      "Mental model",
      "Half-built mold — concrete classes finish the shape."
    ],
    [
      "Common trap",
      "Abstract class with only abstract members — consider interface instead."
    ],
    [
      "abstract class Repository { abstract find(id: string): Promise<Entity>; save(e: ",
      "Cannot new AbstractClass()."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Abstract Classes in TypeScript and when do you use it?",
      "answerHint": "abstract class cannot be instantiated directly; may include abstract methods without implementation and concrete shared methods. Subclasses must implement abstract members. Used for base templates with partial behavior."
    },
    {
      "level": "intermediate",
      "question": "Explain Abstract Classes with a code example and one pitfall.",
      "answerHint": "abstract class Repository { abstract find(id: string): Promise<Entity>; save(e: Entity): Promise<void> { ... } } Cannot new AbstractClass(). Abstract methods omit body with semicolon. Mix with implements for interface compliance. Prefer interfaces + functions when no shared code. Pitfall: Abstract class with only abstract members — consider interface instead."
    },
    {
      "level": "advanced",
      "question": "How would you explain Abstract Classes in a senior frontend interview?",
      "answerHint": "Abstract members exist only in type space until implemented. Classes can extend one abstract/concrete class. Abstract construct signatures on interfaces for factory patterns. abstract class Shape {\n  abstract area(): number;\n  describe(): string { return `area=${this.area()}`; }\n}\nclass Square "
    }
  ],
  "pitfalls": [
    "Abstract class with only abstract members — consider interface instead."
  ],
  "interview": {
    "expectations": [
      "Explain Abstract Classes with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Abstract members exist only in type space until implemented."
    ],
    "commonQuestions": [
      "What is Abstract Classes?",
      "When would you choose Abstract Classes over alternatives?",
      "What is the classic Abstract Classes interview trap?"
    ],
    "traps": [
      "Abstract class with only abstract members — consider interface instead."
    ],
    "misconceptions": [
      "Share implementation while forcing subclass-specific pieces."
    ],
    "strongSignals": [
      "Uses Abstract Classes to remove invalid states, not just document them."
    ]
  }
})
