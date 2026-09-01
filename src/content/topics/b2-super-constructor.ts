import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "super & Constructor",
  "whatIsIt": "Derived class constructors must call super() before accessing this when extending a class with constructor. super(...args) forwards typed arguments to base. TS checks argument types against base constructor.",
  "whyExists": "JS runtime rule with compile-time arity/type checking on forwarded args.",
  "mentalModel": "Must phone parent before rearranging child room (this).",
  "how": [
    "constructor(name: string) { super(name); ... }",
    "Pass typed config objects to super.",
    "If base has no constructor, implicit super() inserted.",
    "Abstract base may require specific super args.",
    "Mixins may use generic super constraints."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using this before super() — TS error and runtime throw.",
    "variant": "warning"
  },
  "example": "class Base {\n  constructor(public id: string) {}\n}\nclass Derived extends Base {\n  constructor(id: string, public tag: string) {\n    super(id);\n    this.tag = tag;\nconsole.log(new Derived('1', 'x').id);",
  "exampleCaption": "Derived forwards id to super before using this",
  "internals": [
    "super property access in methods typed from base.",
    "Constructor overloads in base affect super calls.",
    "Downlevel emit wraps class inheritance helpers."
  ],
  "takeaways": [
    "constructor(name: string) { super(name); ... }",
    "Pass typed config objects to super.",
    "Using this before super() — TS error and runtime throw.",
    "super property access in methods typed from base."
  ],
  "revision": [
    "super & Constructor: Must phone parent before rearranging child room (this).",
    "constructor(name: string) { super(name); ... }",
    "Pass typed config objects to super.",
    "If base has no constructor, implicit super() inserted.",
    "Trap: Using this before super() — TS error and runtime throw."
  ],
  "flashcards": [
    [
      "super & Constructor",
      "Derived class constructors must call super() before accessing this when extending a class with constructor."
    ],
    [
      "Mental model",
      "Must phone parent before rearranging child room (this)."
    ],
    [
      "Common trap",
      "Using this before super() — TS error and runtime throw."
    ],
    [
      "constructor(name: string) { super(name); ... }",
      "Pass typed config objects to super."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is super & Constructor in TypeScript and when do you use it?",
      "answerHint": "Derived class constructors must call super() before accessing this when extending a class with constructor. super(...args) forwards typed arguments to base. TS checks argument types against base constructor."
    },
    {
      "level": "intermediate",
      "question": "Explain super & Constructor with a code example and one pitfall.",
      "answerHint": "constructor(name: string) { super(name); ... } Pass typed config objects to super. If base has no constructor, implicit super() inserted. Abstract base may require specific super args. Mixins may use generic super constraints. Pitfall: Using this before super() — TS error and runtime throw."
    },
    {
      "level": "advanced",
      "question": "How would you explain super & Constructor in a senior frontend interview?",
      "answerHint": "super property access in methods typed from base. Constructor overloads in base affect super calls. Downlevel emit wraps class inheritance helpers. class Base {\n  constructor(public id: string) {}\n}\nclass Derived extends Base {\n  constructor(id: string, public tag: st"
    }
  ],
  "pitfalls": [
    "Using this before super() — TS error and runtime throw."
  ],
  "interview": {
    "expectations": [
      "Explain super & Constructor with a concrete TypeScript example.",
      "Name the main compile-time vs runtime boundary.",
      "super property access in methods typed from base."
    ],
    "commonQuestions": [
      "What is super & Constructor?",
      "When would you choose super & Constructor over alternatives?",
      "What is the classic super & Constructor interview trap?"
    ],
    "traps": [
      "Using this before super() — TS error and runtime throw."
    ],
    "misconceptions": [
      "JS runtime rule with compile-time arity/type checking on forwarded args."
    ],
    "strongSignals": [
      "Uses super & Constructor to remove invalid states, not just document them."
    ]
  }
})
