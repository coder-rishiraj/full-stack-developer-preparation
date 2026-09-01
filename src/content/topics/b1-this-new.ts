import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "new Binding",
  "whatIsIt": "new Fn() creates a new object, sets its [[Prototype]] to Fn.prototype, binds this to that object, runs Fn, and returns the object unless Fn returns another object. Arrows cannot be new’d. If you forget new, this follows default binding instead — often a bug.",
  "whyExists": "Constructor functions were the original ‘class’ story. new is the operator that wires prototype and this together.",
  "mentalModel": "Mint a blank instance, point it at the constructor’s prototype, run the constructor with this = the instance.",
  "how": [
    "Call constructors with new.",
    "Return nothing (or this) from constructors; returning a primitive is ignored.",
    "Return an object to override the instance (uncommon).",
    "new.target is the constructor that was directly new’d."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Returning {} from a constructor throws away this and the prototype link of the minted object.",
    "variant": "warning"
  },
  "example": "function User(name) {\n  this.name = name;\n}\nUser.prototype.hi = function () { return this.name; };\nconst u = new User('Ada');\nconsole.log(u.hi(), u instanceof User);\nfunction Bag() { return { custom: true }; }\nconsole.log(new Bag());\ntry { User('x'); } catch (e) { console.log('no new', e && e.name); }\n",
  "exampleCaption": "new sets this and prototype; returned object wins",
  "internals": [
    "OrdinaryCreateFromConstructor + [[Construct]] on the function.",
    "If constructor result IsObject, use it; else the minted this.",
    "new.target in the constructor is the function that new was applied to."
  ],
  "takeaways": [
    "Call constructors with new.",
    "Return nothing (or this) from constructors; returning a primitive is ignored.",
    "Returning {} from a constructor throws away this and the prototype link of the minted object.",
    "OrdinaryCreateFromConstructor + [[Construct]] on the function."
  ],
  "revision": [
    "new Binding: Mint a blank instance, point it at the constructor’s prototype, run the constructor with this = the instance.",
    "Call constructors with new.",
    "Return nothing (or this) from constructors; returning a primitive is ignored.",
    "Return an object to override the instance (uncommon).",
    "Trap: Returning {} from a constructor throws away this and the prototype link of the minted object."
  ],
  "flashcards": [
    [
      "new Binding",
      "new Fn() creates a new object, sets its [[Prototype]] to Fn.prototype, binds this to that object, runs Fn, and returns the object unless Fn returns another object."
    ],
    [
      "Mental model",
      "Mint a blank instance, point it at the constructor’s prototype, run the constructor with this = the instance."
    ],
    [
      "Common trap",
      "Returning {} from a constructor throws away this and the prototype link of the minted object."
    ],
    [
      "Call constructors with new.",
      "Return nothing (or this) from constructors; returning a primitive is ignored."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is new Binding and where does a beginner first see it?",
      "answerHint": "new Fn() creates a new object, sets its [[Prototype]] to Fn.prototype, binds this to that object, runs Fn, and returns the object unless Fn returns another object. Arrows cannot be new’d. If you forget new, this follows default binding instead — often a bug."
    },
    {
      "level": "intermediate",
      "question": "Walk through how new Binding works and name the main pitfall.",
      "answerHint": "Call constructors with new. Return nothing (or this) from constructors; returning a primitive is ignored. Return an object to override the instance (uncommon). new.target is the constructor that was directly new’d. Pitfall: Returning {} from a constructor throws away this and the prototype link of the minted object."
    },
    {
      "level": "advanced",
      "question": "How would you explain new Binding at an interview, including engine/spec details?",
      "answerHint": "OrdinaryCreateFromConstructor + [[Construct]] on the function. If constructor result IsObject, use it; else the minted this. new.target in the constructor is the function that new was applied to."
    }
  ],
  "pitfalls": [
    "Returning {} from a constructor throws away this and the prototype link of the minted object.",
    "new.target is the constructor that was directly new’d."
  ],
  "interview": {
    "expectations": [
      "Explain new Binding without mixing it up with a nearby B1.15 — this, call, apply, bind topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "OrdinaryCreateFromConstructor + [[Construct]] on the function."
    ],
    "commonQuestions": [
      "What is new Binding?",
      "Why does JavaScript new binding behave this way?",
      "What is the classic new Binding interview trap?"
    ],
    "traps": [
      "Returning {} from a constructor throws away this and the prototype link of the minted object."
    ],
    "misconceptions": [
      "Constructor functions were the original ‘class’ story. new is the operator that wires prototype and this together."
    ],
    "strongSignals": [
      "Separates new Binding from lookalike APIs and can draw the mental model."
    ]
  }
})
