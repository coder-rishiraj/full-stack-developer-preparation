import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Constructor Functions",
  "whatIsIt": "A constructor is a function meant to be called with new. By convention it is PascalCase. It assigns instance fields on this and shares methods on Constructor.prototype. class is syntactic sugar over this model (plus extra rules). Without new, this may be wrong unless you guard.",
  "whyExists": "Before class, this was the way to mint typed objects with shared methods.",
  "mentalModel": "A factory that new runs for you: make object, attach prototype, call function as constructor.",
  "how": [
    "Set methods on .prototype, not inside the constructor (unless they must close over privates).",
    "Guard: if (!new.target) throw or return new C(...).",
    "instanceof C checks C.prototype on the chain.",
    "Do not return primitives from constructors."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Defining this.method = function(){} in the constructor creates a new function per instance (more memory).",
    "variant": "warning"
  },
  "example": "function Point(x, y) {\n  if (!new.target) return new Point(x, y);\n  this.x = x;\n  this.y = y;\n}\nPoint.prototype.toString = function () { return `(${this.x},${this.y})`; };\nconst p = Point(1, 2);\nconsole.log(p.toString(), p instanceof Point);\n",
  "exampleCaption": "Constructor with new.target guard and prototype method",
  "internals": [
    "[[Construct]] vs [[Call]] on the same function object.",
    "prototype property is created on function declarations/expressions by default.",
    "arrows have no construct and no prototype."
  ],
  "takeaways": [
    "Set methods on .prototype, not inside the constructor (unless they must close over privates).",
    "Guard: if (!new.target) throw or return new C(...).",
    "Defining this.method = function(){} in the constructor creates a new function per instance (more memory).",
    "[[Construct]] vs [[Call]] on the same function object."
  ],
  "revision": [
    "Constructor Functions: A factory that new runs for you: make object, attach prototype, call function as constructor.",
    "Set methods on .prototype, not inside the constructor (unless they must close over privates).",
    "Guard: if (!new.target) throw or return new C(...).",
    "instanceof C checks C.prototype on the chain.",
    "Trap: Defining this.method = function(){} in the constructor creates a new function per instance (more memory)."
  ],
  "flashcards": [
    [
      "Constructor Functions",
      "A constructor is a function meant to be called with new."
    ],
    [
      "Mental model",
      "A factory that new runs for you: make object, attach prototype, call function as constructor."
    ],
    [
      "Common trap",
      "Defining this.method = function(){} in the constructor creates a new function per instance (more memory)."
    ],
    [
      "Set methods on .prototype, not inside the constructor (unless they must close ov",
      "Guard: if (!new.target) throw or return new C(...)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Constructor Functions and where does a beginner first see it?",
      "answerHint": "A constructor is a function meant to be called with new. By convention it is PascalCase. It assigns instance fields on this and shares methods on Constructor.prototype. class is syntactic sugar over this model (plus extra rules). Without new, this may be wrong unless you guard."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Constructor Functions works and name the main pitfall.",
      "answerHint": "Set methods on .prototype, not inside the constructor (unless they must close over privates). Guard: if (!new.target) throw or return new C(...). instanceof C checks C.prototype on the chain. Do not return primitives from constructors. Pitfall: Defining this.method = function(){} in the constructor creates a new function per instance (more memory)."
    },
    {
      "level": "advanced",
      "question": "How would you explain Constructor Functions at an interview, including engine/spec details?",
      "answerHint": "[[Construct]] vs [[Call]] on the same function object. prototype property is created on function declarations/expressions by default. arrows have no construct and no prototype."
    }
  ],
  "pitfalls": [
    "Defining this.method = function(){} in the constructor creates a new function per instance (more memory).",
    "Do not return primitives from constructors."
  ],
  "interview": {
    "expectations": [
      "Explain Constructor Functions without mixing it up with a nearby B1.16 — Prototypes & Prototype Chain topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "[[Construct]] vs [[Call]] on the same function object."
    ],
    "commonQuestions": [
      "What is Constructor Functions?",
      "Why does JavaScript constructor functions behave this way?",
      "What is the classic Constructor Functions interview trap?"
    ],
    "traps": [
      "Defining this.method = function(){} in the constructor creates a new function per instance (more memory)."
    ],
    "misconceptions": [
      "Before class, this was the way to mint typed objects with shared methods."
    ],
    "strongSignals": [
      "Separates Constructor Functions from lookalike APIs and can draw the mental model."
    ]
  }
})
