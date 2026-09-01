import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Global Execution Context",
  "whatIsIt": "The global execution context is created when a script or the realm starts: this is the global object in classic scripts, undefined in modules. It holds the global environment (object + declarative). Only one global context per realm is ‘the’ global, but each script evaluation uses it. Top-level code runs here.",
  "whyExists": "Something has to be the first frame: built-ins and top-level var live here.",
  "mentalModel": "The ground floor of the building. All function calls are higher floors that eventually return here.",
  "how": [
    "Top-level this in modules is undefined.",
    "Classic script top-level this is window in browsers.",
    "Top-level await pauses module evaluation, not a function frame you wrote.",
    "Do not dump app state on the global context."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Copying a snippet with this.foo = 1 at top level of a module does not set window.foo.",
    "variant": "warning"
  },
  "example": "console.log(globalThis === (typeof window !== 'undefined' ? window : globalThis));\nconsole.log((function () { return this; })());\nconsole.log((() => this)());\n",
  "exampleCaption": "Global object vs function this vs arrow this at top level",
  "internals": [
    "ScriptEvaluation / GlobalDeclarationInstantiation.",
    "thisBinding of the global context is the global object for scripts.",
    "Module context has this = undefined."
  ],
  "takeaways": [
    "Top-level this in modules is undefined.",
    "Classic script top-level this is window in browsers.",
    "Copying a snippet with this.foo = 1 at top level of a module does not set window.foo.",
    "ScriptEvaluation / GlobalDeclarationInstantiation."
  ],
  "revision": [
    "Global Execution Context: The ground floor of the building. All function calls are higher floors that eventually return here.",
    "Top-level this in modules is undefined.",
    "Classic script top-level this is window in browsers.",
    "Top-level await pauses module evaluation, not a function frame you wrote.",
    "Trap: Copying a snippet with this.foo = 1 at top level of a module does not set window.foo."
  ],
  "flashcards": [
    [
      "Global Execution Context",
      "The global execution context is created when a script or the realm starts: this is the global object in classic scripts, undefined in modules."
    ],
    [
      "Mental model",
      "The ground floor of the building. All function calls are higher floors that eventually return here."
    ],
    [
      "Common trap",
      "Copying a snippet with this.foo = 1 at top level of a module does not set window.foo."
    ],
    [
      "Top-level this in modules is undefined.",
      "Classic script top-level this is window in browsers."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Global Execution Context and where does a beginner first see it?",
      "answerHint": "The global execution context is created when a script or the realm starts: this is the global object in classic scripts, undefined in modules. It holds the global environment (object + declarative). Only one global context per realm is ‘the’ global, but each script evaluation uses it. Top-level code runs here."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Global Execution Context works and name the main pitfall.",
      "answerHint": "Top-level this in modules is undefined. Classic script top-level this is window in browsers. Top-level await pauses module evaluation, not a function frame you wrote. Do not dump app state on the global context. Pitfall: Copying a snippet with this.foo = 1 at top level of a module does not set window.foo."
    },
    {
      "level": "advanced",
      "question": "How would you explain Global Execution Context at an interview, including engine/spec details?",
      "answerHint": "ScriptEvaluation / GlobalDeclarationInstantiation. thisBinding of the global context is the global object for scripts. Module context has this = undefined."
    }
  ],
  "pitfalls": [
    "Copying a snippet with this.foo = 1 at top level of a module does not set window.foo.",
    "Do not dump app state on the global context."
  ],
  "interview": {
    "expectations": [
      "Explain Global Execution Context without mixing it up with a nearby B1.23 — Execution Context topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ScriptEvaluation / GlobalDeclarationInstantiation."
    ],
    "commonQuestions": [
      "What is Global Execution Context?",
      "Why does JavaScript global execution context behave this way?",
      "What is the classic Global Execution Context interview trap?"
    ],
    "traps": [
      "Copying a snippet with this.foo = 1 at top level of a module does not set window.foo."
    ],
    "misconceptions": [
      "Something has to be the first frame: built-ins and top-level var live here."
    ],
    "strongSignals": [
      "Separates Global Execution Context from lookalike APIs and can draw the mental model."
    ]
  }
})
