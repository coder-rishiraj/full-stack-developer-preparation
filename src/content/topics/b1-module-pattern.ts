import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "IIFE / Module Pattern (Historical)",
  "whatIsIt": "The historical module pattern is an IIFE that returns a public API while hiding vars: const api = (function(){ let x; return { get(){return x} } })(). Revealing module exposes methods that close over privates. It was how we namespaced before ESM. Still useful in classic scripts and snippets.",
  "whyExists": "var leaked to window. IIFE + closure was privacy and a single global hook.",
  "mentalModel": "A one-room factory that hands you a remote control, not the machinery.",
  "how": [
    "Use ESM in new apps.",
    "Recognize the pattern in old jQuery plugins.",
    "Do not recreate it instead of modules without a reason.",
    "AMD/UMD wrappers are cousins for loaders."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Returning this from an IIFE called as a function in sloppy mode can leak to window.",
    "variant": "warning"
  },
  "example": "const counter = (function () {\n  let n = 0;\n  function inc() { n += 1; return n; }\n  function get() { return n; }\n  return { inc, get };\n})();\nconsole.log(counter.inc(), counter.get());\n",
  "exampleCaption": "Revealing module IIFE",
  "internals": [
    "One function environment + returned closures.",
    "No module map — each IIFE is a fresh instance if the file runs twice.",
    "UMD detects define/module/window to pick a loading style."
  ],
  "takeaways": [
    "Use ESM in new apps.",
    "Recognize the pattern in old jQuery plugins.",
    "Returning this from an IIFE called as a function in sloppy mode can leak to window.",
    "One function environment + returned closures."
  ],
  "revision": [
    "IIFE / Module Pattern (Historical): A one-room factory that hands you a remote control, not the machinery.",
    "Use ESM in new apps.",
    "Recognize the pattern in old jQuery plugins.",
    "Do not recreate it instead of modules without a reason.",
    "Trap: Returning this from an IIFE called as a function in sloppy mode can leak to window."
  ],
  "flashcards": [
    [
      "IIFE / Module Pattern (Historical)",
      "The historical module pattern is an IIFE that returns a public API while hiding vars: const api = (function(){ let x; return { get(){return x} } })()."
    ],
    [
      "Mental model",
      "A one-room factory that hands you a remote control, not the machinery."
    ],
    [
      "Common trap",
      "Returning this from an IIFE called as a function in sloppy mode can leak to window."
    ],
    [
      "Use ESM in new apps.",
      "Recognize the pattern in old jQuery plugins."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is IIFE / Module Pattern (Historical) and where does a beginner first see it?",
      "answerHint": "The historical module pattern is an IIFE that returns a public API while hiding vars: const api = (function(){ let x; return { get(){return x} } })(). Revealing module exposes methods that close over privates. It was how we namespaced before ESM. Still useful in classic scripts and snippets."
    },
    {
      "level": "intermediate",
      "question": "Walk through how IIFE / Module Pattern (Historical) works and name the main pitfall.",
      "answerHint": "Use ESM in new apps. Recognize the pattern in old jQuery plugins. Do not recreate it instead of modules without a reason. AMD/UMD wrappers are cousins for loaders. Pitfall: Returning this from an IIFE called as a function in sloppy mode can leak to window."
    },
    {
      "level": "advanced",
      "question": "How would you explain IIFE / Module Pattern (Historical) at an interview, including engine/spec details?",
      "answerHint": "One function environment + returned closures. No module map — each IIFE is a fresh instance if the file runs twice. UMD detects define/module/window to pick a loading style."
    }
  ],
  "pitfalls": [
    "Returning this from an IIFE called as a function in sloppy mode can leak to window.",
    "AMD/UMD wrappers are cousins for loaders."
  ],
  "interview": {
    "expectations": [
      "Explain IIFE / Module Pattern (Historical) without mixing it up with a nearby B1.34 — Modules topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "One function environment + returned closures."
    ],
    "commonQuestions": [
      "What is IIFE / Module Pattern (Historical)?",
      "Why does JavaScript iife / module pattern (historical) behave this way?",
      "What is the classic IIFE / Module Pattern (Historical) interview trap?"
    ],
    "traps": [
      "Returning this from an IIFE called as a function in sloppy mode can leak to window."
    ],
    "misconceptions": [
      "var leaked to window. IIFE + closure was privacy and a single global hook."
    ],
    "strongSignals": [
      "Separates IIFE / Module Pattern (Historical) from lookalike APIs and can draw the mental model."
    ]
  }
})
