import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Variable Resolution",
  "whatIsIt": "Resolving a variable means walking the scope chain for that identifier. If found, GetValue/SetValue on that binding. If not, ReferenceError (strict read) or implicit global create (sloppy assignment). Property resolution is a different algorithm (prototypes). Computed names are not identifier resolution.",
  "whyExists": "Every identifier in source must mean one binding. The walk is how the engine implements that meaning.",
  "mentalModel": "Ask each environment: do you have ‘x’? First yes wins. None yes → error (or sloppy global write).",
  "how": [
    "Undeclared read: ReferenceError in modules/strict.",
    "obj.x is not identifier resolution of x.",
    "with(obj) { x } can resolve x as a property — avoid.",
    "globalThis.x can access a global object property even if a lexical let x exists (different name path)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "typeof notBound is 'undefined' without throwing, which hides missing imports in some patterns.",
    "variant": "warning"
  },
  "example": "const x = 1;\nfunction f() {\n  console.log(x);\n  try { console.log(notBound); } catch (e) { console.log(e.name); }\n}\nf();\nconst obj = { y: 2 };\nconsole.log(obj.y);\n",
  "exampleCaption": "Identifier lookup vs property lookup vs ReferenceError",
  "internals": [
    "ResolveBinding → GetIdentifierReference(env, name, strict).",
    "Unresolvable Reference + PutValue in sloppy mode creates a global property.",
    "Strict PutValue on unresolvable throws."
  ],
  "takeaways": [
    "Undeclared read: ReferenceError in modules/strict.",
    "obj.x is not identifier resolution of x.",
    "typeof notBound is 'undefined' without throwing, which hides missing imports in some patterns.",
    "ResolveBinding → GetIdentifierReference(env, name, strict)."
  ],
  "revision": [
    "Variable Resolution: Ask each environment: do you have ‘x’? First yes wins. None yes → error (or sloppy global write).",
    "Undeclared read: ReferenceError in modules/strict.",
    "obj.x is not identifier resolution of x.",
    "with(obj) { x } can resolve x as a property — avoid.",
    "Trap: typeof notBound is 'undefined' without throwing, which hides missing imports in some patterns."
  ],
  "flashcards": [
    [
      "Variable Resolution",
      "Resolving a variable means walking the scope chain for that identifier."
    ],
    [
      "Mental model",
      "Ask each environment: do you have ‘x’? First yes wins. None yes → error (or sloppy global write)."
    ],
    [
      "Common trap",
      "typeof notBound is 'undefined' without throwing, which hides missing imports in some patterns."
    ],
    [
      "Undeclared read: ReferenceError in modules/strict.",
      "obj.x is not identifier resolution of x."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Variable Resolution and where does a beginner first see it?",
      "answerHint": "Resolving a variable means walking the scope chain for that identifier. If found, GetValue/SetValue on that binding. If not, ReferenceError (strict read) or implicit global create (sloppy assignment). Property resolution is a different algorithm (prototypes). Computed names are not identifier resolution."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Variable Resolution works and name the main pitfall.",
      "answerHint": "Undeclared read: ReferenceError in modules/strict. obj.x is not identifier resolution of x. with(obj) { x } can resolve x as a property — avoid. globalThis.x can access a global object property even if a lexical let x exists (different name path). Pitfall: typeof notBound is 'undefined' without throwing, which hides missing imports in some patterns."
    },
    {
      "level": "advanced",
      "question": "How would you explain Variable Resolution at an interview, including engine/spec details?",
      "answerHint": "ResolveBinding → GetIdentifierReference(env, name, strict). Unresolvable Reference + PutValue in sloppy mode creates a global property. Strict PutValue on unresolvable throws."
    }
  ],
  "pitfalls": [
    "typeof notBound is 'undefined' without throwing, which hides missing imports in some patterns.",
    "globalThis.x can access a global object property even if a lexical let x exists (different name path)."
  ],
  "interview": {
    "expectations": [
      "Explain Variable Resolution without mixing it up with a nearby B1.10 — Scope & Lexical Environments topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ResolveBinding → GetIdentifierReference(env, name, strict)."
    ],
    "commonQuestions": [
      "What is Variable Resolution?",
      "Why does JavaScript variable resolution behave this way?",
      "What is the classic Variable Resolution interview trap?"
    ],
    "traps": [
      "typeof notBound is 'undefined' without throwing, which hides missing imports in some patterns."
    ],
    "misconceptions": [
      "Every identifier in source must mean one binding. The walk is how the engine implements that meaning."
    ],
    "strongSignals": [
      "Separates Variable Resolution from lookalike APIs and can draw the mental model."
    ]
  }
})
