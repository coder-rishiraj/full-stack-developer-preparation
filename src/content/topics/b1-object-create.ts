import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Object.create",
  "whatIsIt": "Object.create(proto, props?) makes a new object whose [[Prototype]] is proto (or null). Optional second arg is a property descriptor map like defineProperties. It does not run a constructor. Use it for dictionary objects, prototypes, and ‘inheritance’ without new.",
  "whyExists": "You needed to set [[Prototype]] at birth without invoking a constructor’s side effects.",
  "mentalModel": "Allocate a blank object and point its parent pointer. No constructor body runs.",
  "how": [
    "Object.create(null) for maps of user keys.",
    "Object.create(Parent.prototype) + Parent.call(this) is old-school inheritance.",
    "Second argument descriptors default flags to false.",
    "create is not a deep copy of proto."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Object.create(parent) shares parent by reference — mutating parent methods affects all children.",
    "variant": "warning"
  },
  "example": "const parent = { add(a, b) { return a + b; } };\nconst child = Object.create(parent);\nchild.k = 1;\nconsole.log(child.add(2, 3), Object.getPrototypeOf(child) === parent);\nconst dict = Object.create(null, { n: { value: 7, enumerable: true } });\nconsole.log(dict.n, Object.getPrototypeOf(dict));\n",
  "exampleCaption": "Delegation via create, plus null dict",
  "internals": [
    "OrdinaryObjectCreate(proto, extraInternalSlots).",
    "If proto is not object or null, TypeError.",
    "The second arg is ObjectDefineProperties."
  ],
  "takeaways": [
    "Object.create(null) for maps of user keys.",
    "Object.create(Parent.prototype) + Parent.call(this) is old-school inheritance.",
    "Object.create(parent) shares parent by reference — mutating parent methods affects all children.",
    "OrdinaryObjectCreate(proto, extraInternalSlots)."
  ],
  "revision": [
    "Object.create: Allocate a blank object and point its parent pointer. No constructor body runs.",
    "Object.create(null) for maps of user keys.",
    "Object.create(Parent.prototype) + Parent.call(this) is old-school inheritance.",
    "Second argument descriptors default flags to false.",
    "Trap: Object.create(parent) shares parent by reference — mutating parent methods affects all children."
  ],
  "flashcards": [
    [
      "Object.create",
      "Object.create(proto, props?) makes a new object whose [[Prototype]] is proto (or null)."
    ],
    [
      "Mental model",
      "Allocate a blank object and point its parent pointer. No constructor body runs."
    ],
    [
      "Common trap",
      "Object.create(parent) shares parent by reference — mutating parent methods affects all children."
    ],
    [
      "Object.create(null) for maps of user keys.",
      "Object.create(Parent.prototype) + Parent.call(this) is old-school inheritance."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Object.create and where does a beginner first see it?",
      "answerHint": "Object.create(proto, props?) makes a new object whose [[Prototype]] is proto (or null). Optional second arg is a property descriptor map like defineProperties. It does not run a constructor. Use it for dictionary objects, prototypes, and ‘inheritance’ without new."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Object.create works and name the main pitfall.",
      "answerHint": "Object.create(null) for maps of user keys. Object.create(Parent.prototype) + Parent.call(this) is old-school inheritance. Second argument descriptors default flags to false. create is not a deep copy of proto. Pitfall: Object.create(parent) shares parent by reference — mutating parent methods affects all children."
    },
    {
      "level": "advanced",
      "question": "How would you explain Object.create at an interview, including engine/spec details?",
      "answerHint": "OrdinaryObjectCreate(proto, extraInternalSlots). If proto is not object or null, TypeError. The second arg is ObjectDefineProperties."
    }
  ],
  "pitfalls": [
    "Object.create(parent) shares parent by reference — mutating parent methods affects all children.",
    "create is not a deep copy of proto."
  ],
  "interview": {
    "expectations": [
      "Explain Object.create without mixing it up with a nearby B1.16 — Prototypes & Prototype Chain topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "OrdinaryObjectCreate(proto, extraInternalSlots)."
    ],
    "commonQuestions": [
      "What is Object.create?",
      "Why does JavaScript object.create behave this way?",
      "What is the classic Object.create interview trap?"
    ],
    "traps": [
      "Object.create(parent) shares parent by reference — mutating parent methods affects all children."
    ],
    "misconceptions": [
      "You needed to set [[Prototype]] at birth without invoking a constructor’s side effects."
    ],
    "strongSignals": [
      "Separates Object.create from lookalike APIs and can draw the mental model."
    ]
  }
})
