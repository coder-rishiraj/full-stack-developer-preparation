import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "constructor Property",
  "whatIsIt": "By default Function.prototype and each function’s .prototype have constructor pointing back at the function. Instances inherit .constructor via the chain. It is writable: if you replace .prototype with {}, constructor is Object unless you set it back. It is a hint for tooling, not a reliable type check (use instanceof or tags).",
  "whyExists": "Reflection and ‘create another of the same kind’ (new obj.constructor()) needed a back-pointer. It is conventional, not enforced.",
  "mentalModel": "A sticky note on the prototype saying ‘I was made by C.’ Anyone can replace the note.",
  "how": [
    "When replacing .prototype, restore { constructor: C }.",
    "Do not use obj.constructor as a security check.",
    "class keeps constructor correctly on the prototype.",
    "null-proto objects have no constructor."
  ],
  "callout": {
    "title": "Watch for",
    "text": "obj.constructor.name after a prototype swap may be 'Object' — confusing logs.",
    "variant": "warning"
  },
  "example": "function C() {}\nconst c = new C();\nconsole.log(c.constructor === C);\nC.prototype = { x: 1 };\nconst c2 = new C();\nconsole.log(c2.constructor === C, c2.constructor === Object);\nfunction D() {}\nD.prototype = { constructor: D };\nconsole.log(new D().constructor === D);\n",
  "exampleCaption": "Losing constructor when replacing .prototype",
  "internals": [
    "Function allocation defines prototype.constructor as non-enumerable.",
    "It is an ordinary data property, not a magic slot.",
    "class prototype constructor is non-enumerable similarly."
  ],
  "takeaways": [
    "When replacing .prototype, restore { constructor: C }.",
    "Do not use obj.constructor as a security check.",
    "obj.constructor.name after a prototype swap may be 'Object' — confusing logs.",
    "Function allocation defines prototype.constructor as non-enumerable."
  ],
  "revision": [
    "constructor Property: A sticky note on the prototype saying ‘I was made by C.’ Anyone can replace the note.",
    "When replacing .prototype, restore { constructor: C }.",
    "Do not use obj.constructor as a security check.",
    "class keeps constructor correctly on the prototype.",
    "Trap: obj.constructor.name after a prototype swap may be 'Object' — confusing logs."
  ],
  "flashcards": [
    [
      "constructor Property",
      "By default Function.prototype and each function’s .prototype have constructor pointing back at the function."
    ],
    [
      "Mental model",
      "A sticky note on the prototype saying ‘I was made by C.’ Anyone can replace the note."
    ],
    [
      "Common trap",
      "obj.constructor.name after a prototype swap may be 'Object' — confusing logs."
    ],
    [
      "When replacing .prototype, restore { constructor: C }.",
      "Do not use obj.constructor as a security check."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is constructor Property and where does a beginner first see it?",
      "answerHint": "By default Function.prototype and each function’s .prototype have constructor pointing back at the function. Instances inherit .constructor via the chain. It is writable: if you replace .prototype with {}, constructor is Object unless you set it back. It is a hint for tooling, not a reliable type check (use instanceof or tags)."
    },
    {
      "level": "intermediate",
      "question": "Walk through how constructor Property works and name the main pitfall.",
      "answerHint": "When replacing .prototype, restore { constructor: C }. Do not use obj.constructor as a security check. class keeps constructor correctly on the prototype. null-proto objects have no constructor. Pitfall: obj.constructor.name after a prototype swap may be 'Object' — confusing logs."
    },
    {
      "level": "advanced",
      "question": "How would you explain constructor Property at an interview, including engine/spec details?",
      "answerHint": "Function allocation defines prototype.constructor as non-enumerable. It is an ordinary data property, not a magic slot. class prototype constructor is non-enumerable similarly."
    }
  ],
  "pitfalls": [
    "obj.constructor.name after a prototype swap may be 'Object' — confusing logs.",
    "null-proto objects have no constructor."
  ],
  "interview": {
    "expectations": [
      "Explain constructor Property without mixing it up with a nearby B1.16 — Prototypes & Prototype Chain topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Function allocation defines prototype.constructor as non-enumerable."
    ],
    "commonQuestions": [
      "What is constructor Property?",
      "Why does JavaScript constructor property behave this way?",
      "What is the classic constructor Property interview trap?"
    ],
    "traps": [
      "obj.constructor.name after a prototype swap may be 'Object' — confusing logs."
    ],
    "misconceptions": [
      "Reflection and ‘create another of the same kind’ (new obj.constructor()) needed a back-pointer. It is conventional, not enforced."
    ],
    "strongSignals": [
      "Separates constructor Property from lookalike APIs and can draw the mental model."
    ]
  }
})
