import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Strict Mode",
  "whatIsIt": "Strict mode (`\"use strict\"` or implied by modules/classes) changes sloppy historical behavior: undeclared assignment throws, `this` is undefined in bare calls, `with` is banned, duplicate params are errors, and `arguments` does not alias parameters. It is the default in ES modules.",
  "whyExists": "Early JS was too forgiving (silent globals, boxed this). Strict mode let the web keep old pages working while new code got sane errors.",
  "mentalModel": "A dialect switch: the same syntax, fewer footguns, more throws instead of silent failure.",
  "how": [
    "Modules and class bodies are automatically strict.",
    "Put `\"use strict\"` at the top of classic scripts or functions if you must support non-module files.",
    "Never rely on function-sloppy `this` being `window`.",
    "Assigning to an undeclared name is a ReferenceError, not a global."
  ],
  "callout": {
    "title": "Watch for",
    "text": "A classic IIFE without strict mode still creates globals on typos — modules do not, which hides the difference until you copy code the other way.",
    "variant": "warning"
  },
  "example": "function sloppy() {\n  // in a non-module script without use strict:\n  // undeclared = 1;  // would create a global\n}\nfunction strictish() {\n  'use strict';\n  try { x = 1; } catch (e) { console.log(e.name); } // ReferenceError\n  function inner() { return this; }\n  console.log(inner()); // undefined\n}\nstrictish();",
  "exampleCaption": "Strict mode: no implicit globals, this is undefined",
  "internals": [
    "[[ThisMode]] of a function is lexical, strict, or global.",
    "Strict eval gets its own variable environment; sloppy eval can inject bindings into the caller.",
    "Arguments object in strict mode does not share slots with named parameters."
  ],
  "takeaways": [
    "Modules and class bodies are automatically strict.",
    "Put `\"use strict\"` at the top of classic scripts or functions if you must support non-module files.",
    "A classic IIFE without strict mode still creates globals on typos — modules do not, which hides the difference until you copy code the other way.",
    "[[ThisMode]] of a function is lexical, strict, or global."
  ],
  "revision": [
    "Strict Mode: A dialect switch: the same syntax, fewer footguns, more throws instead of silent failure.",
    "Modules and class bodies are automatically strict.",
    "Put `\"use strict\"` at the top of classic scripts or functions if you must support non-module files.",
    "Never rely on function-sloppy `this` being `window`.",
    "Trap: A classic IIFE without strict mode still creates globals on typos — modules do not, which hides the difference until you copy code the other way."
  ],
  "flashcards": [
    [
      "Strict Mode",
      "Strict mode (`\"use strict\"` or implied by modules/classes) changes sloppy historical behavior: undeclared assignment throws, `this` is undefined in bare calls, `with` is banned, duplicate params are errors, and `arguments` does not alias parameters."
    ],
    [
      "Mental model",
      "A dialect switch: the same syntax, fewer footguns, more throws instead of silent failure."
    ],
    [
      "Common trap",
      "A classic IIFE without strict mode still creates globals on typos — modules do not, which hides the difference until you copy code the other way."
    ],
    [
      "Modules and class bodies are automatically strict.",
      "Put `\"use strict\"` at the top of classic scripts or functions if you must support non-module files."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Strict Mode and where does a beginner first see it?",
      "answerHint": "Strict mode (`\"use strict\"` or implied by modules/classes) changes sloppy historical behavior: undeclared assignment throws, `this` is undefined in bare calls, `with` is banned, duplicate params are errors, and `arguments` does not alias parameters. It is the default in ES modules."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Strict Mode works and name the main pitfall.",
      "answerHint": "Modules and class bodies are automatically strict. Put `\"use strict\"` at the top of classic scripts or functions if you must support non-module files. Never rely on function-sloppy `this` being `window`. Assigning to an undeclared name is a ReferenceError, not a global. Pitfall: A classic IIFE without strict mode still creates globals on typos — modules do not, which hides the difference until you copy code the other way."
    },
    {
      "level": "advanced",
      "question": "How would you explain Strict Mode at an interview, including engine/spec details?",
      "answerHint": "[[ThisMode]] of a function is lexical, strict, or global. Strict eval gets its own variable environment; sloppy eval can inject bindings into the caller. Arguments object in strict mode does not share slots with named parameters."
    }
  ],
  "pitfalls": [
    "A classic IIFE without strict mode still creates globals on typos — modules do not, which hides the difference until you copy code the other way.",
    "Assigning to an undeclared name is a ReferenceError, not a global."
  ],
  "interview": {
    "expectations": [
      "Explain Strict Mode without mixing it up with a nearby B1.1 — JavaScript Foundations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "[[ThisMode]] of a function is lexical, strict, or global."
    ],
    "commonQuestions": [
      "What is Strict Mode?",
      "Why does JavaScript strict mode behave this way?",
      "What is the classic Strict Mode interview trap?"
    ],
    "traps": [
      "A classic IIFE without strict mode still creates globals on typos — modules do not, which hides the difference until you copy code the other way."
    ],
    "misconceptions": [
      "Early JS was too forgiving (silent globals, boxed this). Strict mode let the web keep old pages working while new code got sane errors."
    ],
    "strongSignals": [
      "Separates Strict Mode from lookalike APIs and can draw the mental model."
    ]
  }
})
