import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Global Scope",
  "whatIsIt": "Global scope is the outermost environment of a script or the shared top level of classic scripts in a page. `var` and function declarations at top level of a classic script become properties of the global object (`window` in browsers). `let`/`const`/`class` live in the global lexical environment and do not become `window` properties. Modules have their own module scope, not classic global bindings.",
  "whyExists": "Browsers needed a place for `alert` and `document` and for multiple script tags to see each other’s functions.",
  "mentalModel": "A public bulletin board (global object) plus a quieter lexical shelf (let/const) that is not `window.x`.",
  "how": [
    "Prefer modules so you do not put app state on window.",
    "Read globals via `globalThis` when you must.",
    "A missing `let` in sloppy mode creates an accidental global.",
    "Two classic scripts share globals; two modules do not unless they import."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Expecting `window.foo` after `let foo` in a module or modern script — it is undefined.",
    "variant": "warning"
  },
  "example": "var classic = 'on window in browsers';\nlet lexical = 'not a window property';\nconsole.log(globalThis.classic, globalThis.lexical);\nfunction shared() { return 1; }\nconsole.log(typeof globalThis.shared);",
  "exampleCaption": "var/function vs let on the global object",
  "internals": [
    "Global environment has an object record (global object) and a declarative record (let/const).",
    "HasBinding for global let does not imply HasOwnProperty on window.",
    "Script vs module goal symbols change whether top-level vars attach this way."
  ],
  "takeaways": [
    "Prefer modules so you do not put app state on window.",
    "Read globals via `globalThis` when you must.",
    "Expecting `window.foo` after `let foo` in a module or modern script — it is undefined.",
    "Global environment has an object record (global object) and a declarative record (let/const)."
  ],
  "revision": [
    "Global Scope: A public bulletin board (global object) plus a quieter lexical shelf (let/const) that is not `window.x`.",
    "Prefer modules so you do not put app state on window.",
    "Read globals via `globalThis` when you must.",
    "A missing `let` in sloppy mode creates an accidental global.",
    "Trap: Expecting `window.foo` after `let foo` in a module or modern script — it is undefined."
  ],
  "flashcards": [
    [
      "Global Scope",
      "Global scope is the outermost environment of a script or the shared top level of classic scripts in a page."
    ],
    [
      "Mental model",
      "A public bulletin board (global object) plus a quieter lexical shelf (let/const) that is not `window.x`."
    ],
    [
      "Common trap",
      "Expecting `window.foo` after `let foo` in a module or modern script — it is undefined."
    ],
    [
      "Prefer modules so you do not put app state on window.",
      "Read globals via `globalThis` when you must."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Global Scope and where does a beginner first see it?",
      "answerHint": "Global scope is the outermost environment of a script or the shared top level of classic scripts in a page. `var` and function declarations at top level of a classic script become properties of the global object (`window` in browsers). `let`/`const`/`class` live in the global lexical environment and do not become `window` properties. Modules have their own module scope, not classic global bindings."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Global Scope works and name the main pitfall.",
      "answerHint": "Prefer modules so you do not put app state on window. Read globals via `globalThis` when you must. A missing `let` in sloppy mode creates an accidental global. Two classic scripts share globals; two modules do not unless they import. Pitfall: Expecting `window.foo` after `let foo` in a module or modern script — it is undefined."
    },
    {
      "level": "advanced",
      "question": "How would you explain Global Scope at an interview, including engine/spec details?",
      "answerHint": "Global environment has an object record (global object) and a declarative record (let/const). HasBinding for global let does not imply HasOwnProperty on window. Script vs module goal symbols change whether top-level vars attach this way."
    }
  ],
  "pitfalls": [
    "Expecting `window.foo` after `let foo` in a module or modern script — it is undefined.",
    "Two classic scripts share globals; two modules do not unless they import."
  ],
  "interview": {
    "expectations": [
      "Explain Global Scope without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Global environment has an object record (global object) and a declarative record (let/const)."
    ],
    "commonQuestions": [
      "What is Global Scope?",
      "Why does JavaScript global scope behave this way?",
      "What is the classic Global Scope interview trap?"
    ],
    "traps": [
      "Expecting `window.foo` after `let foo` in a module or modern script — it is undefined."
    ],
    "misconceptions": [
      "Browsers needed a place for `alert` and `document` and for multiple script tags to see each other’s functions."
    ],
    "strongSignals": [
      "Separates Global Scope from lookalike APIs and can draw the mental model."
    ]
  }
})
