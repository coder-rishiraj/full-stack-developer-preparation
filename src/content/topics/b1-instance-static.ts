import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Instance vs Static Methods",
  "whatIsIt": "Instance methods live on the prototype and expect this = instance. Static methods live on the constructor and expect this = the class (unless stolen). Static fields are properties of the constructor. You call statics as C.fn(), not obj.fn(). instanceof does not look at statics.",
  "whyExists": "Factories, caches, and helpers related to a type do not need an instance. static puts them next to the type name.",
  "mentalModel": "Instance: dog.speak(). Static: Dog.species() — a toolbox bolted onto the constructor function.",
  "how": [
    "static create() factories.",
    "this in a static method is the constructor (for inheritance, the subclass if called as Sub.fn()).",
    "Do not access instance fields from static without an instance.",
    "static #priv is shared private to the class, not per instance."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Calling u.parse() is undefined unless you copied the static — statics are not on the instance.",
    "variant": "warning"
  },
  "example": "class User {\n  constructor(id) { this.id = id; }\n  label() { return 'user-' + this.id; }\n  static parse(s) { return new User(Number(s)); }\n}\nconst u = User.parse('5');\nconsole.log(u.label(), u.parse);\nconsole.log(User.parse('9').id);\n",
  "exampleCaption": "Instance label vs static parse factory",
  "internals": [
    "Static methods are DefineMethod on the constructor function object.",
    "Instance methods on the prototype object.",
    "static this follows the call site (Sub.staticMeth() → this === Sub)."
  ],
  "takeaways": [
    "static create() factories.",
    "this in a static method is the constructor (for inheritance, the subclass if called as Sub.fn()).",
    "Calling u.parse() is undefined unless you copied the static — statics are not on the instance.",
    "Static methods are DefineMethod on the constructor function object."
  ],
  "revision": [
    "Instance vs Static Methods: Instance: dog.speak(). Static: Dog.species() — a toolbox bolted onto the constructor function.",
    "static create() factories.",
    "this in a static method is the constructor (for inheritance, the subclass if called as Sub.fn()).",
    "Do not access instance fields from static without an instance.",
    "Trap: Calling u.parse() is undefined unless you copied the static — statics are not on the instance."
  ],
  "flashcards": [
    [
      "Instance vs Static Methods",
      "Instance methods live on the prototype and expect this = instance."
    ],
    [
      "Mental model",
      "Instance: dog.speak(). Static: Dog.species() — a toolbox bolted onto the constructor function."
    ],
    [
      "Common trap",
      "Calling u.parse() is undefined unless you copied the static — statics are not on the instance."
    ],
    [
      "static create() factories.",
      "this in a static method is the constructor (for inheritance, the subclass if called as Sub.fn())."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Instance vs Static Methods and where does a beginner first see it?",
      "answerHint": "Instance methods live on the prototype and expect this = instance. Static methods live on the constructor and expect this = the class (unless stolen). Static fields are properties of the constructor. You call statics as C.fn(), not obj.fn(). instanceof does not look at statics."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Instance vs Static Methods works and name the main pitfall.",
      "answerHint": "static create() factories. this in a static method is the constructor (for inheritance, the subclass if called as Sub.fn()). Do not access instance fields from static without an instance. static #priv is shared private to the class, not per instance. Pitfall: Calling u.parse() is undefined unless you copied the static — statics are not on the instance."
    },
    {
      "level": "advanced",
      "question": "How would you explain Instance vs Static Methods at an interview, including engine/spec details?",
      "answerHint": "Static methods are DefineMethod on the constructor function object. Instance methods on the prototype object. static this follows the call site (Sub.staticMeth() → this === Sub)."
    }
  ],
  "pitfalls": [
    "Calling u.parse() is undefined unless you copied the static — statics are not on the instance.",
    "static #priv is shared private to the class, not per instance."
  ],
  "interview": {
    "expectations": [
      "Explain Instance vs Static Methods without mixing it up with a nearby B1.17 — Classes & OOP topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Static methods are DefineMethod on the constructor function object."
    ],
    "commonQuestions": [
      "What is Instance vs Static Methods?",
      "Why does JavaScript instance vs static methods behave this way?",
      "What is the classic Instance vs Static Methods interview trap?"
    ],
    "traps": [
      "Calling u.parse() is undefined unless you copied the static — statics are not on the instance."
    ],
    "misconceptions": [
      "Factories, caches, and helpers related to a type do not need an instance. static puts them next to the type name."
    ],
    "strongSignals": [
      "Separates Instance vs Static Methods from lookalike APIs and can draw the mental model."
    ]
  }
})
