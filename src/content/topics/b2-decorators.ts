import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Decorators",
  "whatIsIt": "Decorators (stage 3) attach metadata/transform classes and methods: @logged class Foo {}. TS 5+ experimentalDecorators vs standard decorators differ. Common in Angular, NestJS, TypeORM. Emit depends on tsconfig decorator settings.",
  "whyExists": "Frameworks use decorators for DI and routing — know typing implications.",
  "mentalModel": "Stickers on class methods changing behavior via metaprogramming.",
  "how": [
    "Enable experimentalDecorators for legacy Angular/Nest.",
    "Standard decorators follow ECMAScript proposal in TS 5+.",
    "emitDecoratorMetadata reflects design types at runtime (Nest).",
    "Decorator factories typed: (opts: Opts) => ClassDecorator.",
    "Understand runtime cost and bundle size."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Mixing experimental and standard decorator modes — incompatible emit.",
    "variant": "warning"
  },
  "example": "function sealed(constructor: Function) {\n  Object.seal(constructor);\n  Object.seal(constructor.prototype);\n}\n@sealed\nclass BugReport {\n  constructor(public type: string) {}\nconsole.log(new BugReport('crash').type);",
  "exampleCaption": "Class decorator seals constructor",
  "internals": [
    "Decorator context TS 5.2+ typing for standard decorators.",
    "reflect-metadata polyfill for emitDecoratorMetadata.",
    "Legacy __decorate helper emitted when downleveling."
  ],
  "takeaways": [
    "Enable experimentalDecorators for legacy Angular/Nest.",
    "Standard decorators follow ECMAScript proposal in TS 5+.",
    "Mixing experimental and standard decorator modes — incompatible emit.",
    "Decorator context TS 5.2+ typing for standard decorators."
  ],
  "revision": [
    "Decorators: Stickers on class methods changing behavior via metaprogramming.",
    "Enable experimentalDecorators for legacy Angular/Nest.",
    "Standard decorators follow ECMAScript proposal in TS 5+.",
    "emitDecoratorMetadata reflects design types at runtime (Nest).",
    "Trap: Mixing experimental and standard decorator modes — incompatible emit."
  ],
  "flashcards": [
    [
      "Decorators",
      "Decorators (stage 3) attach metadata/transform classes and methods: @logged class Foo {}."
    ],
    [
      "Mental model",
      "Stickers on class methods changing behavior via metaprogramming."
    ],
    [
      "Common trap",
      "Mixing experimental and standard decorator modes — incompatible emit."
    ],
    [
      "Enable experimentalDecorators for legacy Angular/Nest.",
      "Standard decorators follow ECMAScript proposal in TS 5+."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Decorators in TypeScript and when do you use it?",
      "answerHint": "Decorators (stage 3) attach metadata/transform classes and methods: @logged class Foo {}. TS 5+ experimentalDecorators vs standard decorators differ. Common in Angular, NestJS, TypeORM. Emit depends on tsconfig decorator settings."
    },
    {
      "level": "intermediate",
      "question": "Explain Decorators with a code example and one pitfall.",
      "answerHint": "Enable experimentalDecorators for legacy Angular/Nest. Standard decorators follow ECMAScript proposal in TS 5+. emitDecoratorMetadata reflects design types at runtime (Nest). Decorator factories typed: (opts: Opts) => ClassDecorator. Understand runtime cost and bundle size. Pitfall: Mixing experimental and standard decorator modes — incompatible emit."
    },
    {
      "level": "advanced",
      "question": "How would you explain Decorators in a senior frontend interview?",
      "answerHint": "Decorator context TS 5.2+ typing for standard decorators. reflect-metadata polyfill for emitDecoratorMetadata. Legacy __decorate helper emitted when downleveling. function sealed(constructor: Function) {\n  Object.seal(constructor);\n  Object.seal(constructor.prototype);\n}\n@sealed\ncla"
    }
  ],
  "pitfalls": [
    "Mixing experimental and standard decorator modes — incompatible emit."
  ],
  "interview": {
    "expectations": [
      "Explain Decorators with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "Decorator context TS 5.2+ typing for standard decorators."
    ],
    "commonQuestions": [
      "What is Decorators?",
      "When would you choose Decorators over alternatives?",
      "What is the classic Decorators interview trap?"
    ],
    "traps": [
      "Mixing experimental and standard decorator modes — incompatible emit."
    ],
    "misconceptions": [
      "Frameworks use decorators for DI and routing — know typing implications."
    ],
    "strongSignals": [
      "Uses Decorators to remove invalid states, not just document them."
    ]
  }
})
