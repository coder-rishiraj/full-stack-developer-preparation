import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "extends / super / Inheritance",
  "whatIsIt": "class Sub extends Super sets Sub.prototype.[[Prototype]] = Super.prototype and Sub.[[Prototype]] = Super (statics inherit too). super.method() calls the parent method. super() in constructor allocates this via the parent. extends null is allowed (no Object.prototype). Built-ins like Array can be extended with caveats.",
  "whyExists": "Sharing and specializing types is easier with a keyword than manual prototype wiring.",
  "mentalModel": "Instances chain methods upward; the constructor function also chains statics upward. super is the parent’s version, not a copy.",
  "how": [
    "Call super() before this in derived constructors.",
    "Override methods and call super.method() when extending behavior.",
    "static methods can use super.staticMeth().",
    "Do not extend unless you have a real is-a relationship."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Forgetting super() in a derived constructor throws when constructing.",
    "variant": "warning"
  },
  "example": "class A {\n  hello() { return 'A'; }\n  static tag() { return 'A'; }\n}\nclass B extends A {\n  hello() { return super.hello() + 'B'; }\n  static tag() { return super.tag() + 'B'; }\n}\nconsole.log(new B().hello(), B.tag());\nconsole.log(new B() instanceof A);\n",
  "exampleCaption": "Instance and static super along extends",
  "internals": [
    "Heritage evaluation sets Function.prototype or the parent as [[Prototype]] of the constructor.",
    "super.prop uses [[HomeObject]] to start lookup from the parent of that method’s home.",
    "NewTarget is forwarded so subclassing Array can produce a B instance."
  ],
  "takeaways": [
    "Call super() before this in derived constructors.",
    "Override methods and call super.method() when extending behavior.",
    "Forgetting super() in a derived constructor throws when constructing.",
    "Heritage evaluation sets Function.prototype or the parent as [[Prototype]] of the constructor."
  ],
  "revision": [
    "extends / super / Inheritance: Instances chain methods upward; the constructor function also chains statics upward. super is the parent’s version, not a copy.",
    "Call super() before this in derived constructors.",
    "Override methods and call super.method() when extending behavior.",
    "static methods can use super.staticMeth().",
    "Trap: Forgetting super() in a derived constructor throws when constructing."
  ],
  "flashcards": [
    [
      "extends / super / Inheritance",
      "class Sub extends Super sets Sub.prototype.[[Prototype]] = Super.prototype and Sub.[[Prototype]] = Super (statics inherit too)."
    ],
    [
      "Mental model",
      "Instances chain methods upward; the constructor function also chains statics upward. super is the parent’s version, not a copy."
    ],
    [
      "Common trap",
      "Forgetting super() in a derived constructor throws when constructing."
    ],
    [
      "Call super() before this in derived constructors.",
      "Override methods and call super.method() when extending behavior."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is extends / super / Inheritance and where does a beginner first see it?",
      "answerHint": "class Sub extends Super sets Sub.prototype.[[Prototype]] = Super.prototype and Sub.[[Prototype]] = Super (statics inherit too). super.method() calls the parent method. super() in constructor allocates this via the parent. extends null is allowed (no Object.prototype). Built-ins like Array can be extended with caveats."
    },
    {
      "level": "intermediate",
      "question": "Walk through how extends / super / Inheritance works and name the main pitfall.",
      "answerHint": "Call super() before this in derived constructors. Override methods and call super.method() when extending behavior. static methods can use super.staticMeth(). Do not extend unless you have a real is-a relationship. Pitfall: Forgetting super() in a derived constructor throws when constructing."
    },
    {
      "level": "advanced",
      "question": "How would you explain extends / super / Inheritance at an interview, including engine/spec details?",
      "answerHint": "Heritage evaluation sets Function.prototype or the parent as [[Prototype]] of the constructor. super.prop uses [[HomeObject]] to start lookup from the parent of that method’s home. NewTarget is forwarded so subclassing Array can produce a B instance."
    }
  ],
  "pitfalls": [
    "Forgetting super() in a derived constructor throws when constructing.",
    "Do not extend unless you have a real is-a relationship."
  ],
  "interview": {
    "expectations": [
      "Explain extends / super / Inheritance without mixing it up with a nearby B1.17 — Classes & OOP topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Heritage evaluation sets Function.prototype or the parent as [[Prototype]] of the constructor."
    ],
    "commonQuestions": [
      "What is extends / super / Inheritance?",
      "Why does JavaScript extends / super / inheritance behave this way?",
      "What is the classic extends / super / Inheritance interview trap?"
    ],
    "traps": [
      "Forgetting super() in a derived constructor throws when constructing."
    ],
    "misconceptions": [
      "Sharing and specializing types is easier with a keyword than manual prototype wiring."
    ],
    "strongSignals": [
      "Separates extends / super / Inheritance from lookalike APIs and can draw the mental model."
    ]
  }
})
