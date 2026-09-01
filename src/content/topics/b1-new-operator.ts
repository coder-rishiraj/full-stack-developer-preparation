import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "What new Actually Does",
  "whatIsIt": "new C(args) does: (1) create object, (2) set [[Prototype]] from C.prototype, (3) call C with this = object and new.target = C, (4) if C returns an object, use that, else the created object. new C is valid with no args. new on non-constructors throws TypeError.",
  "whyExists": "The operator packages the four steps so you do not do Object.create + call by hand every time.",
  "mentalModel": "Mint, link, initialize, maybe replace. Four beats.",
  "how": [
    "Always new class constructors.",
    "If you implement ‘new’ by hand, remember the return-object override.",
    "new C.prototype.constructor() if constructor was preserved.",
    "Spread: new C(...args)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "If C.prototype is not an object (you set it to 3), new throws TypeError.",
    "variant": "warning"
  },
  "example": "function C(n) {\n  this.n = n;\n  console.log('new.target', new.target === C);\n}\nC.prototype.kind = 'c';\nconst a = new C(1);\nconsole.log(a.n, a.kind);\nfunction D() { return { hijack: true }; }\nconsole.log(new D());\n",
  "exampleCaption": "new.target, prototype fields, hijacked return",
  "internals": [
    "OrdinaryCreateFromConstructor uses Get(F, 'prototype').",
    "If prototype is not an object, use Object.prototype (for some paths) or throw — constructors require Object.",
    "Construct(F, args, newTarget) is the spec entry."
  ],
  "takeaways": [
    "Always new class constructors.",
    "If you implement ‘new’ by hand, remember the return-object override.",
    "If C.prototype is not an object (you set it to 3), new throws TypeError.",
    "OrdinaryCreateFromConstructor uses Get(F, 'prototype')."
  ],
  "revision": [
    "What new Actually Does: Mint, link, initialize, maybe replace. Four beats.",
    "Always new class constructors.",
    "If you implement ‘new’ by hand, remember the return-object override.",
    "new C.prototype.constructor() if constructor was preserved.",
    "Trap: If C.prototype is not an object (you set it to 3), new throws TypeError."
  ],
  "flashcards": [
    [
      "What new Actually Does",
      "new C(args) does: (1) create object, (2) set [[Prototype]] from C.prototype, (3) call C with this = object and new.target = C, (4) if C returns an object, use that, else the created object."
    ],
    [
      "Mental model",
      "Mint, link, initialize, maybe replace. Four beats."
    ],
    [
      "Common trap",
      "If C.prototype is not an object (you set it to 3), new throws TypeError."
    ],
    [
      "Always new class constructors.",
      "If you implement ‘new’ by hand, remember the return-object override."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is What new Actually Does and where does a beginner first see it?",
      "answerHint": "new C(args) does: (1) create object, (2) set [[Prototype]] from C.prototype, (3) call C with this = object and new.target = C, (4) if C returns an object, use that, else the created object. new C is valid with no args. new on non-constructors throws TypeError."
    },
    {
      "level": "intermediate",
      "question": "Walk through how What new Actually Does works and name the main pitfall.",
      "answerHint": "Always new class constructors. If you implement ‘new’ by hand, remember the return-object override. new C.prototype.constructor() if constructor was preserved. Spread: new C(...args). Pitfall: If C.prototype is not an object (you set it to 3), new throws TypeError."
    },
    {
      "level": "advanced",
      "question": "How would you explain What new Actually Does at an interview, including engine/spec details?",
      "answerHint": "OrdinaryCreateFromConstructor uses Get(F, 'prototype'). If prototype is not an object, use Object.prototype (for some paths) or throw — constructors require Object. Construct(F, args, newTarget) is the spec entry."
    }
  ],
  "pitfalls": [
    "If C.prototype is not an object (you set it to 3), new throws TypeError.",
    "Spread: new C(...args)."
  ],
  "interview": {
    "expectations": [
      "Explain What new Actually Does without mixing it up with a nearby B1.16 — Prototypes & Prototype Chain topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "OrdinaryCreateFromConstructor uses Get(F, 'prototype')."
    ],
    "commonQuestions": [
      "What is What new Actually Does?",
      "Why does JavaScript what new actually does behave this way?",
      "What is the classic What new Actually Does interview trap?"
    ],
    "traps": [
      "If C.prototype is not an object (you set it to 3), new throws TypeError."
    ],
    "misconceptions": [
      "The operator packages the four steps so you do not do Object.create + call by hand every time."
    ],
    "strongSignals": [
      "Separates What new Actually Does from lookalike APIs and can draw the mental model."
    ]
  }
})
