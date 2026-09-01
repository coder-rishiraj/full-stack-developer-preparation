import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Default / Global Binding",
  "whatIsIt": "Default/global binding: a non-arrow function called as fn() with no receiver. In sloppy classic scripts, this is the global object (window). In strict mode, modules, and classes, this is undefined. That difference makes ‘forgotten new’ and ‘stolen methods’ throw in modern code instead of writing globals.",
  "whyExists": "Original JS used global this so window methods worked. Strict mode stopped silent global writes via this.x =.",
  "mentalModel": "No receiver + sloppy = the world object. No receiver + strict = undefined (a landmine that throws on this.x).",
  "how": [
    "Write modules (strict) so missing this throws.",
    "Do not rely on window as this.",
    "Call methods through the object or bind.",
    "new.target can detect forgotten new in constructors."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A forgotten new in sloppy mode pollutes globals: C() sets globalThis.n.",
    "variant": "warning"
  },
  "example": "function sloppy() { return this; }\nfunction strictFn() {\n  'use strict';\n  return this;\n}\nconsole.log(sloppy() === globalThis, strictFn());\nfunction C() { this.n = 1; }\ntry { C(); } catch (e) { console.log('C()', e.name); }\nconsole.log(new C().n);\n",
  "exampleCaption": "Sloppy global this vs strict undefined vs forgotten new",
  "internals": [
    "ThisMode global vs strict vs lexical.",
    "BindThis in sloppy ToObject’s the thisArg when not nullish (historical).",
    "strict functions keep undefined."
  ],
  "takeaways": [
    "Write modules (strict) so missing this throws.",
    "Do not rely on window as this.",
    "A forgotten new in sloppy mode pollutes globals: C() sets globalThis.n.",
    "ThisMode global vs strict vs lexical."
  ],
  "revision": [
    "Default / Global Binding: No receiver + sloppy = the world object. No receiver + strict = undefined (a landmine that throws on this.x).",
    "Write modules (strict) so missing this throws.",
    "Do not rely on window as this.",
    "Call methods through the object or bind.",
    "Trap: A forgotten new in sloppy mode pollutes globals: C() sets globalThis.n."
  ],
  "flashcards": [
    [
      "Default / Global Binding",
      "Default/global binding: a non-arrow function called as fn() with no receiver."
    ],
    [
      "Mental model",
      "No receiver + sloppy = the world object. No receiver + strict = undefined (a landmine that throws on this.x)."
    ],
    [
      "Common trap",
      "A forgotten new in sloppy mode pollutes globals: C() sets globalThis.n."
    ],
    [
      "Write modules (strict) so missing this throws.",
      "Do not rely on window as this."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Default / Global Binding and where does a beginner first see it?",
      "answerHint": "Default/global binding: a non-arrow function called as fn() with no receiver. In sloppy classic scripts, this is the global object (window). In strict mode, modules, and classes, this is undefined. That difference makes ‘forgotten new’ and ‘stolen methods’ throw in modern code instead of writing globals."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Default / Global Binding works and name the main pitfall.",
      "answerHint": "Write modules (strict) so missing this throws. Do not rely on window as this. Call methods through the object or bind. new.target can detect forgotten new in constructors. Pitfall: A forgotten new in sloppy mode pollutes globals: C() sets globalThis.n."
    },
    {
      "level": "advanced",
      "question": "How would you explain Default / Global Binding at an interview, including engine/spec details?",
      "answerHint": "ThisMode global vs strict vs lexical. BindThis in sloppy ToObject’s the thisArg when not nullish (historical). strict functions keep undefined."
    }
  ],
  "pitfalls": [
    "A forgotten new in sloppy mode pollutes globals: C() sets globalThis.n.",
    "new.target can detect forgotten new in constructors."
  ],
  "interview": {
    "expectations": [
      "Explain Default / Global Binding without mixing it up with a nearby B1.15 — this, call, apply, bind topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ThisMode global vs strict vs lexical."
    ],
    "commonQuestions": [
      "What is Default / Global Binding?",
      "Why does JavaScript default / global binding behave this way?",
      "What is the classic Default / Global Binding interview trap?"
    ],
    "traps": [
      "A forgotten new in sloppy mode pollutes globals: C() sets globalThis.n."
    ],
    "misconceptions": [
      "Original JS used global this so window methods worked. Strict mode stopped silent global writes via this.x =."
    ],
    "strongSignals": [
      "Separates Default / Global Binding from lookalike APIs and can draw the mental model."
    ]
  }
})
