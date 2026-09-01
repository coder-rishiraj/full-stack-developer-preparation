import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Module Scope",
  "whatIsIt": "Each ES module has its own top-level scope. Top-level const/let/function stay private unless exported. Imports are live bindings into another module’s scope. Classic scripts share one global. type=module scripts do not put vars on window.",
  "whyExists": "File-sized privacy was the missing piece after IIFEs. Modules made dependency graphs explicit and avoided global clobbering.",
  "mentalModel": "A file is a locked room. export is a labeled window. import looks through that window at live values.",
  "how": [
    "Export only the public API.",
    "Do not assign to window from a module unless you must.",
    "Circular imports see uninitialized live bindings until evaluation finishes.",
    "One module URL = one instance in the module map."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Importing the same module with different relative paths can create two instances if the URLs differ.",
    "variant": "warning"
  },
  "example": "// math.js would contain: export let n = 1; export function bump() { n += 1; }\n// main.js:\n// import { n, bump } from './math.js';\nconst moduleLike = (() => {\n  let n = 1;\n  return { get n() { return n; }, bump() { n += 1; } };\n})();\nmoduleLike.bump();\nconsole.log(moduleLike.n);\n",
  "exampleCaption": "Module privacy simulated with a closure",
  "internals": [
    "Module Environment Record holds imported and top-level bindings.",
    "The module map keys on normalized URLs.",
    "Top-level this in modules is undefined."
  ],
  "takeaways": [
    "Export only the public API.",
    "Do not assign to window from a module unless you must.",
    "Importing the same module with different relative paths can create two instances if the URLs differ.",
    "Module Environment Record holds imported and top-level bindings."
  ],
  "revision": [
    "Module Scope: A file is a locked room. export is a labeled window. import looks through that window at live values.",
    "Export only the public API.",
    "Do not assign to window from a module unless you must.",
    "Circular imports see uninitialized live bindings until evaluation finishes.",
    "Trap: Importing the same module with different relative paths can create two instances if the URLs differ."
  ],
  "flashcards": [
    [
      "Module Scope",
      "Each ES module has its own top-level scope."
    ],
    [
      "Mental model",
      "A file is a locked room. export is a labeled window. import looks through that window at live values."
    ],
    [
      "Common trap",
      "Importing the same module with different relative paths can create two instances if the URLs differ."
    ],
    [
      "Export only the public API.",
      "Do not assign to window from a module unless you must."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Module Scope and where does a beginner first see it?",
      "answerHint": "Each ES module has its own top-level scope. Top-level const/let/function stay private unless exported. Imports are live bindings into another module’s scope. Classic scripts share one global. type=module scripts do not put vars on window."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Module Scope works and name the main pitfall.",
      "answerHint": "Export only the public API. Do not assign to window from a module unless you must. Circular imports see uninitialized live bindings until evaluation finishes. One module URL = one instance in the module map. Pitfall: Importing the same module with different relative paths can create two instances if the URLs differ."
    },
    {
      "level": "advanced",
      "question": "How would you explain Module Scope at an interview, including engine/spec details?",
      "answerHint": "Module Environment Record holds imported and top-level bindings. The module map keys on normalized URLs. Top-level this in modules is undefined."
    }
  ],
  "pitfalls": [
    "Importing the same module with different relative paths can create two instances if the URLs differ.",
    "One module URL = one instance in the module map."
  ],
  "interview": {
    "expectations": [
      "Explain Module Scope without mixing it up with a nearby B1.10 — Scope & Lexical Environments topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Module Environment Record holds imported and top-level bindings."
    ],
    "commonQuestions": [
      "What is Module Scope?",
      "Why does JavaScript module scope behave this way?",
      "What is the classic Module Scope interview trap?"
    ],
    "traps": [
      "Importing the same module with different relative paths can create two instances if the URLs differ."
    ],
    "misconceptions": [
      "File-sized privacy was the missing piece after IIFEs. Modules made dependency graphs explicit and avoided global clobbering."
    ],
    "strongSignals": [
      "Separates Module Scope from lookalike APIs and can draw the mental model."
    ]
  }
})
