import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Global Variables and globalThis",
  "whatIsIt": "Global variables are bindings in the global environment. `globalThis` is the portable name for the global object (window, self, global). Creating globals (implicit sloppy assignment, `var` at top level, `window.foo =`) makes names visible to every script and is a collision hazard. Modules keep top-level bindings private to the file.",
  "whyExists": "Hosts must expose a single object for built-ins (`undefined`, `Object`, `parseInt`) and for page-wide script communication.",
  "mentalModel": "A shared desk drawer. `globalThis` is the drawer handle that works in workers, Node, and browsers.",
  "how": [
    "Use modules + import for sharing; do not hang app state on window.",
    "Read built-ins from globalThis when the local name might be shadowed.",
    "In browsers, `var x` at top-level classic script ⇔ `window.x` (mostly).",
    "Workers: `self` is the global; `window` is missing."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assigning `name = \"x\"` in a browser: `window.name` is a special string property and will stringify unexpectedly.",
    "variant": "warning"
  },
  "example": "const g = globalThis;\nconsole.log(g.Math === Math);\ng.__scratch = 123;\nconsole.log(g.__scratch);\ndelete g.__scratch;\nconsole.log('window' in g, g === g.globalThis);",
  "exampleCaption": "globalThis as the portable global object",
  "internals": [
    "globalThis is specified as the this-value of the global scope (ordinary global ThisValue).",
    "Global object properties vs declarative global bindings (let) are different records.",
    "iframe has a different globalThis than the parent (different realm)."
  ],
  "takeaways": [
    "Use modules + import for sharing; do not hang app state on window.",
    "Read built-ins from globalThis when the local name might be shadowed.",
    "Assigning `name = \"x\"` in a browser: `window.name` is a special string property and will stringify unexpectedly.",
    "globalThis is specified as the this-value of the global scope (ordinary global ThisValue)."
  ],
  "revision": [
    "Global Variables and globalThis: A shared desk drawer. `globalThis` is the drawer handle that works in workers, Node, and browsers.",
    "Use modules + import for sharing; do not hang app state on window.",
    "Read built-ins from globalThis when the local name might be shadowed.",
    "In browsers, `var x` at top-level classic script ⇔ `window.x` (mostly).",
    "Trap: Assigning `name = \"x\"` in a browser: `window.name` is a special string property and will stringify unexpectedly."
  ],
  "flashcards": [
    [
      "Global Variables and globalThis",
      "Global variables are bindings in the global environment."
    ],
    [
      "Mental model",
      "A shared desk drawer. `globalThis` is the drawer handle that works in workers, Node, and browsers."
    ],
    [
      "Common trap",
      "Assigning `name = \"x\"` in a browser: `window.name` is a special string property and will stringify unexpectedly."
    ],
    [
      "Use modules + import for sharing; do not hang app state on window.",
      "Read built-ins from globalThis when the local name might be shadowed."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Global Variables and globalThis and where does a beginner first see it?",
      "answerHint": "Global variables are bindings in the global environment. `globalThis` is the portable name for the global object (window, self, global). Creating globals (implicit sloppy assignment, `var` at top level, `window.foo =`) makes names visible to every script and is a collision hazard. Modules keep top-level bindings private to the file."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Global Variables and globalThis works and name the main pitfall.",
      "answerHint": "Use modules + import for sharing; do not hang app state on window. Read built-ins from globalThis when the local name might be shadowed. In browsers, `var x` at top-level classic script ⇔ `window.x` (mostly). Workers: `self` is the global; `window` is missing. Pitfall: Assigning `name = \"x\"` in a browser: `window.name` is a special string property and will stringify unexpectedly."
    },
    {
      "level": "advanced",
      "question": "How would you explain Global Variables and globalThis at an interview, including engine/spec details?",
      "answerHint": "globalThis is specified as the this-value of the global scope (ordinary global ThisValue). Global object properties vs declarative global bindings (let) are different records. iframe has a different globalThis than the parent (different realm)."
    }
  ],
  "pitfalls": [
    "Assigning `name = \"x\"` in a browser: `window.name` is a special string property and will stringify unexpectedly.",
    "Workers: `self` is the global; `window` is missing."
  ],
  "interview": {
    "expectations": [
      "Explain Global Variables and globalThis without mixing it up with a nearby B1.2 — Variables & Declarations topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "globalThis is specified as the this-value of the global scope (ordinary global ThisValue)."
    ],
    "commonQuestions": [
      "What is Global Variables and globalThis?",
      "Why does JavaScript global variables and globalthis behave this way?",
      "What is the classic Global Variables and globalThis interview trap?"
    ],
    "traps": [
      "Assigning `name = \"x\"` in a browser: `window.name` is a special string property and will stringify unexpectedly."
    ],
    "misconceptions": [
      "Hosts must expose a single object for built-ins (`undefined`, `Object`, `parseInt`) and for page-wide script communication."
    ],
    "strongSignals": [
      "Separates Global Variables and globalThis from lookalike APIs and can draw the mental model."
    ]
  }
})
