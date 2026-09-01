import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Mixins",
  "whatIsIt": "Mixins combine behaviors into one class type via functions returning intersected classes: type Result = A & B. TS models with intersection types and generic mixin factories. Alternative to multiple inheritance.",
  "whyExists": "Compose cross-cutting features (Serializable, Timestamped) without deep trees.",
  "mentalModel": "Lego bricks clicked into one typed robot.",
  "how": [
    "function Timestamped<T extends new (...args: any[]) => object>(Base: T) { return class extends Base { ts = Date.now(); }; }",
    "Instance type: InstanceType<ReturnType<typeof Timestamped>>.",
    "Prefer composition functions over complex mixin chains.",
    "Interface merging documents mixin methods.",
    "React HOCs historically similar pattern."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Deep mixin stacks — inference breaks; annotate return class type.",
    "variant": "warning"
  },
  "example": "type Constructor = new (...args: any[]) => object;\nfunction Activatable<T extends Constructor>(Base: T) {\n  return class extends Base {\n    isActive = false;\n    activate() { this.isActive = true; }\n  };\n}\nclass User { constructor(public name: string) {} }\nconst ActiveUser = Activatable(User);\nconsole.log(new ActiveUser('Ada').activate());",
  "exampleCaption": "Mixin factory extends Base with activate",
  "internals": [
    "Mixin pattern is runtime extends + intersection at type level.",
    "Constructor return types need careful generic bounds.",
    "Declaration merging rarely used with modern mixin generics."
  ],
  "takeaways": [
    "function Timestamped<T extends new (...args: any[]) => object>(Base: T) { return class extends Base { ts = Date.now(); }; }",
    "Instance type: InstanceType<ReturnType<typeof Timestamped>>.",
    "Deep mixin stacks — inference breaks; annotate return class type.",
    "Mixin pattern is runtime extends + intersection at type level."
  ],
  "revision": [
    "Mixins: Lego bricks clicked into one typed robot.",
    "function Timestamped<T extends new (...args: any[]) => object>(Base: T) { return class extends Base { ts = Date.now(); }; }",
    "Instance type: InstanceType<ReturnType<typeof Timestamped>>.",
    "Prefer composition functions over complex mixin chains.",
    "Trap: Deep mixin stacks — inference breaks; annotate return class type."
  ],
  "flashcards": [
    [
      "Mixins",
      "Mixins combine behaviors into one class type via functions returning intersected classes: type Result = A & B."
    ],
    [
      "Mental model",
      "Lego bricks clicked into one typed robot."
    ],
    [
      "Common trap",
      "Deep mixin stacks — inference breaks; annotate return class type."
    ],
    [
      "function Timestamped<T extends new (...args: any[]) => object>(Base: T) { return",
      "Instance type: InstanceType<ReturnType<typeof Timestamped>>."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Mixins in TypeScript and when do you use it?",
      "answerHint": "Mixins combine behaviors into one class type via functions returning intersected classes: type Result = A & B. TS models with intersection types and generic mixin factories. Alternative to multiple inheritance."
    },
    {
      "level": "intermediate",
      "question": "Explain Mixins with a code example and one pitfall.",
      "answerHint": "function Timestamped<T extends new (...args: any[]) => object>(Base: T) { return class extends Base { ts = Date.now(); }; } Instance type: InstanceType<ReturnType<typeof Timestamped>>. Prefer composition functions over complex mixin chains. Interface merging documents mixin methods. React HOCs historically similar pattern. Pitfall: Deep mixin stacks — inference breaks; annotate return class type."
    },
    {
      "level": "advanced",
      "question": "How would you explain Mixins in a senior frontend interview?",
      "answerHint": "Mixin pattern is runtime extends + intersection at type level. Constructor return types need careful generic bounds. Declaration merging rarely used with modern mixin generics. type Constructor = new (...args: any[]) => object;\nfunction Activatable<T extends Constructor>(Base: T) {\n  return class"
    }
  ],
  "pitfalls": [
    "Deep mixin stacks — inference breaks; annotate return class type."
  ],
  "interview": {
    "expectations": [
      "Explain Mixins with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Mixin pattern is runtime extends + intersection at type level."
    ],
    "commonQuestions": [
      "What is Mixins?",
      "When would you choose Mixins over alternatives?",
      "What is the classic Mixins interview trap?"
    ],
    "traps": [
      "Deep mixin stacks — inference breaks; annotate return class type."
    ],
    "misconceptions": [
      "Compose cross-cutting features (Serializable, Timestamped) without deep trees."
    ],
    "strongSignals": [
      "Uses Mixins to remove invalid states, not just document them."
    ]
  }
})
