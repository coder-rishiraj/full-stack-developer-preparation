import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Class Inheritance",
  "whatIsIt": "extends creates subclass inheriting typed members. super calls parent constructor and methods. Override methods with compatible parameter and return types (covariant returns allowed). abstract methods must be implemented.",
  "whyExists": "Shared behavior without duplicating types across classes.",
  "mentalModel": "Child class inherits parent's typed contract and adds fields.",
  "how": [
    "class Admin extends User { role = \"admin\" as const; }",
    "super() required before this in derived constructor.",
    "Override with override keyword (TS 4.3+) for clarity.",
    "protected members visible in subclasses only.",
    "Prefer composition when inheritance depth grows."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Forgetting super() in derived constructor — runtime ReferenceError.",
    "variant": "warning"
  },
  "example": "class Animal { constructor(public name: string) {} speak(): string { return '...'; } }\nclass Dog extends Animal {\n  speak(): string { return `${this.name} barks`; }\n}\nconsole.log(new Dog('Rex').speak());\n// TypeScript validates this file before emit\n// Strict mode catches misuse at compile time\n// Annotations are erased — zero runtime overhead",
  "exampleCaption": "Dog overrides speak with supertype-compatible signature",
  "internals": [
    "Structural checking on override signatures.",
    "Mixins intersect types for multiple pseudo-bases.",
    "Instanceof narrows to class type."
  ],
  "takeaways": [
    "class Admin extends User { role = \"admin\" as const; }",
    "super() required before this in derived constructor.",
    "Forgetting super() in derived constructor — runtime ReferenceError.",
    "Structural checking on override signatures."
  ],
  "revision": [
    "Class Inheritance: Child class inherits parent's typed contract and adds fields.",
    "class Admin extends User { role = \"admin\" as const; }",
    "super() required before this in derived constructor.",
    "Override with override keyword (TS 4.3+) for clarity.",
    "Trap: Forgetting super() in derived constructor — runtime ReferenceError."
  ],
  "flashcards": [
    [
      "Class Inheritance",
      "extends creates subclass inheriting typed members."
    ],
    [
      "Mental model",
      "Child class inherits parent's typed contract and adds fields."
    ],
    [
      "Common trap",
      "Forgetting super() in derived constructor — runtime ReferenceError."
    ],
    [
      "class Admin extends User { role = \"admin\" as const; }",
      "super() required before this in derived constructor."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Class Inheritance in TypeScript and when do you use it?",
      "answerHint": "extends creates subclass inheriting typed members. super calls parent constructor and methods. Override methods with compatible parameter and return types (covariant returns allowed). abstract methods must be implemented."
    },
    {
      "level": "intermediate",
      "question": "Explain Class Inheritance with a code example and one pitfall.",
      "answerHint": "class Admin extends User { role = \"admin\" as const; } super() required before this in derived constructor. Override with override keyword (TS 4.3+) for clarity. protected members visible in subclasses only. Prefer composition when inheritance depth grows. Pitfall: Forgetting super() in derived constructor — runtime ReferenceError."
    },
    {
      "level": "advanced",
      "question": "How would you explain Class Inheritance in a senior frontend interview?",
      "answerHint": "Structural checking on override signatures. Mixins intersect types for multiple pseudo-bases. Instanceof narrows to class type. class Animal { constructor(public name: string) {} speak(): string { return '...'; } }\nclass Dog extends Animal {\n  spea"
    }
  ],
  "pitfalls": [
    "Forgetting super() in derived constructor — runtime ReferenceError."
  ],
  "interview": {
    "expectations": [
      "Explain Class Inheritance with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Structural checking on override signatures."
    ],
    "commonQuestions": [
      "What is Class Inheritance?",
      "When would you choose Class Inheritance over alternatives?",
      "What is the classic Class Inheritance interview trap?"
    ],
    "traps": [
      "Forgetting super() in derived constructor — runtime ReferenceError."
    ],
    "misconceptions": [
      "Shared behavior without duplicating types across classes."
    ],
    "strongSignals": [
      "Uses Class Inheritance to remove invalid states, not just document them."
    ]
  }
})
