import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "constructor",
  "whatIsIt": "constructor() is the method that runs on new. A class may have at most one. In a derived class you must call super() before using this. If you omit constructor, a default one is created (super(...args) in derived classes). Returning an object overrides the instance, like old constructors.",
  "whyExists": "Initialization belongs in one place. super() ensures the parent’s this-allocation happened (especially with new.target and built-ins).",
  "mentalModel": "The minting recipe. Derived classes wait for super() before touching this.",
  "how": [
    "Assign fields in constructor or via class fields.",
    "Call super(args) first in derived constructors.",
    "Do not use this before super() — ReferenceError.",
    "Skip custom constructor if the default is enough."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using this before super() in a subclass constructor throws, even to read this.foo.",
    "variant": "warning"
  },
  "example": "class Animal {\n  constructor(name) { this.name = name; }\n}\nclass Dog extends Animal {\n  constructor(name, breed) {\n    super(name);\n    this.breed = breed;\n  }\n}\nconsole.log(new Dog('Rex', 'lab').name);\nclass Weird {\n  constructor() { return { hijack: true }; }\n}\nconsole.log(new Weird() instanceof Weird);\n",
  "exampleCaption": "super() then fields; object return hijack",
  "internals": [
    "Derived constructors start with this uninitialized until SuperCall.",
    "default constructor of derived is constructor(...args){ super(...args); }.",
    "Class constructors have [[ConstructorKind]] derived or base."
  ],
  "takeaways": [
    "Assign fields in constructor or via class fields.",
    "Call super(args) first in derived constructors.",
    "Using this before super() in a subclass constructor throws, even to read this.foo.",
    "Derived constructors start with this uninitialized until SuperCall."
  ],
  "revision": [
    "constructor: The minting recipe. Derived classes wait for super() before touching this.",
    "Assign fields in constructor or via class fields.",
    "Call super(args) first in derived constructors.",
    "Do not use this before super() — ReferenceError.",
    "Trap: Using this before super() in a subclass constructor throws, even to read this.foo."
  ],
  "flashcards": [
    [
      "constructor",
      "constructor() is the method that runs on new."
    ],
    [
      "Mental model",
      "The minting recipe. Derived classes wait for super() before touching this."
    ],
    [
      "Common trap",
      "Using this before super() in a subclass constructor throws, even to read this.foo."
    ],
    [
      "Assign fields in constructor or via class fields.",
      "Call super(args) first in derived constructors."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is constructor and where does a beginner first see it?",
      "answerHint": "constructor() is the method that runs on new. A class may have at most one. In a derived class you must call super() before using this. If you omit constructor, a default one is created (super(...args) in derived classes). Returning an object overrides the instance, like old constructors."
    },
    {
      "level": "intermediate",
      "question": "Walk through how constructor works and name the main pitfall.",
      "answerHint": "Assign fields in constructor or via class fields. Call super(args) first in derived constructors. Do not use this before super() — ReferenceError. Skip custom constructor if the default is enough. Pitfall: Using this before super() in a subclass constructor throws, even to read this.foo."
    },
    {
      "level": "advanced",
      "question": "How would you explain constructor at an interview, including engine/spec details?",
      "answerHint": "Derived constructors start with this uninitialized until SuperCall. default constructor of derived is constructor(...args){ super(...args); }. Class constructors have [[ConstructorKind]] derived or base."
    }
  ],
  "pitfalls": [
    "Using this before super() in a subclass constructor throws, even to read this.foo.",
    "Skip custom constructor if the default is enough."
  ],
  "interview": {
    "expectations": [
      "Explain constructor without mixing it up with a nearby B1.17 — Classes & OOP topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Derived constructors start with this uninitialized until SuperCall."
    ],
    "commonQuestions": [
      "What is constructor?",
      "Why does JavaScript constructor behave this way?",
      "What is the classic constructor interview trap?"
    ],
    "traps": [
      "Using this before super() in a subclass constructor throws, even to read this.foo."
    ],
    "misconceptions": [
      "Initialization belongs in one place. super() ensures the parent’s this-allocation happened (especially with new.target and built-ins)."
    ],
    "strongSignals": [
      "Separates constructor from lookalike APIs and can draw the mental model."
    ]
  }
})
