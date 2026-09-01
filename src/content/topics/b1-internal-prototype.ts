import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "[[Prototype]] / getPrototypeOf",
  "whatIsIt": "[[Prototype]] is the hidden link. Object.getPrototypeOf(obj) reads it; Object.setPrototypeOf writes it; Object.create(proto) sets it at birth. obj.__proto__ is an accessor on Object.prototype that may be missing on null-prototype objects. Changing [[Prototype]] after creation deoptimizes engines.",
  "whyExists": "The spec needed an internal slot name so .prototype (a normal property on functions) would not be confused with the instance’s parent link.",
  "mentalModel": ".prototype is a toolbox on the constructor. [[Prototype]] is the ‘parent’ pointer on the instance. new wires the second to the first.",
  "how": [
    "Read with getPrototypeOf.",
    "Create with Object.create or class/new.",
    "Avoid setPrototypeOf in hot paths.",
    "Reflect.getPrototypeOf is the same for ordinary objects."
  ],
  "callout": {
    "title": "Watch for",
    "text": "naked.__proto__ is not the internal slot — it is just a possible property name on null-proto objects.",
    "variant": "warning"
  },
  "example": "const proto = { z: 1 };\nconst o = Object.create(proto);\nconsole.log(Object.getPrototypeOf(o) === proto, o.z);\nconst p = {};\nObject.setPrototypeOf(p, proto);\nconsole.log(p.z);\nconst naked = Object.create(null);\nconsole.log(Object.getPrototypeOf(naked), '__proto__' in Object.prototype);\n",
  "exampleCaption": "get/setPrototypeOf vs create(null)",
  "internals": [
    "OrdinaryGetPrototypeOf returns the slot.",
    "Proxy getPrototypeOf trap can lie.",
    "Immutable prototype exotic objects (window in some browsers) restrict set."
  ],
  "takeaways": [
    "Read with getPrototypeOf.",
    "Create with Object.create or class/new.",
    "naked.__proto__ is not the internal slot — it is just a possible property name on null-proto objects.",
    "OrdinaryGetPrototypeOf returns the slot."
  ],
  "revision": [
    "[[Prototype]] / getPrototypeOf: .prototype is a toolbox on the constructor. [[Prototype]] is the ‘parent’ pointer on the instance. new wires the second to the first.",
    "Read with getPrototypeOf.",
    "Create with Object.create or class/new.",
    "Avoid setPrototypeOf in hot paths.",
    "Trap: naked.__proto__ is not the internal slot — it is just a possible property name on null-proto objects."
  ],
  "flashcards": [
    [
      "[[Prototype]] / getPrototypeOf",
      "[[Prototype]] is the hidden link."
    ],
    [
      "Mental model",
      ".prototype is a toolbox on the constructor. [[Prototype]] is the ‘parent’ pointer on the instance. new wires the second to the first."
    ],
    [
      "Common trap",
      "naked.__proto__ is not the internal slot — it is just a possible property name on null-proto objects."
    ],
    [
      "Read with getPrototypeOf.",
      "Create with Object.create or class/new."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is [[Prototype]] / getPrototypeOf and where does a beginner first see it?",
      "answerHint": "[[Prototype]] is the hidden link. Object.getPrototypeOf(obj) reads it; Object.setPrototypeOf writes it; Object.create(proto) sets it at birth. obj.__proto__ is an accessor on Object.prototype that may be missing on null-prototype objects. Changing [[Prototype]] after creation deoptimizes engines."
    },
    {
      "level": "intermediate",
      "question": "Walk through how [[Prototype]] / getPrototypeOf works and name the main pitfall.",
      "answerHint": "Read with getPrototypeOf. Create with Object.create or class/new. Avoid setPrototypeOf in hot paths. Reflect.getPrototypeOf is the same for ordinary objects. Pitfall: naked.__proto__ is not the internal slot — it is just a possible property name on null-proto objects."
    },
    {
      "level": "advanced",
      "question": "How would you explain [[Prototype]] / getPrototypeOf at an interview, including engine/spec details?",
      "answerHint": "OrdinaryGetPrototypeOf returns the slot. Proxy getPrototypeOf trap can lie. Immutable prototype exotic objects (window in some browsers) restrict set."
    }
  ],
  "pitfalls": [
    "naked.__proto__ is not the internal slot — it is just a possible property name on null-proto objects.",
    "Reflect.getPrototypeOf is the same for ordinary objects."
  ],
  "interview": {
    "expectations": [
      "Explain [[Prototype]] / getPrototypeOf without mixing it up with a nearby B1.16 — Prototypes & Prototype Chain topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "OrdinaryGetPrototypeOf returns the slot."
    ],
    "commonQuestions": [
      "What is [[Prototype]] / getPrototypeOf?",
      "Why does JavaScript [[prototype]] / getprototypeof behave this way?",
      "What is the classic [[Prototype]] / getPrototypeOf interview trap?"
    ],
    "traps": [
      "naked.__proto__ is not the internal slot — it is just a possible property name on null-proto objects."
    ],
    "misconceptions": [
      "The spec needed an internal slot name so .prototype (a normal property on functions) would not be confused with the instance’s parent link."
    ],
    "strongSignals": [
      "Separates [[Prototype]] / getPrototypeOf from lookalike APIs and can draw the mental model."
    ]
  }
})
