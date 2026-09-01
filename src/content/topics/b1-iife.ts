import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "IIFE",
  "whatIsIt": "An IIFE is (function () { ... })() — a function created and immediately invoked. It built a private scope before modules and let/const blocks. Variants: arrow IIFE, async IIFE. The wrapping parens force an expression so function is not parsed as a declaration.",
  "whyExists": "Classic scripts had no modules. IIFE prevented var from leaking into the global object and created a private namespace.",
  "mentalModel": "A disposable room: enter, run, leave, keep only what you returned.",
  "how": [
    "Use blocks { } or modules today instead of IIFE for scope.",
    "Keep async IIFE for top-level await polyfills in classic scripts: (async () => { await ... })().",
    "Parenthesize: (function(){})() or !function(){}() (avoid the latter for style).",
    "Return an API object for the revealing module pattern."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Missing parens: function(){}() can be a syntax error because function is parsed as a declaration.",
    "variant": "warning"
  },
  "example": "const api = (function () {\n  let secret = 0;\n  return {\n    inc() { secret += 1; return secret; },\n    get() { return secret; },\n  };\n})();\nconsole.log(api.inc(), api.get());\n(async () => {\n  const v = await Promise.resolve(42);\n  console.log(v);\n})();\n",
  "exampleCaption": "Revealing module IIFE and async IIFE",
  "internals": [
    "The grouping operator produces a FunctionExpression.",
    "Call evaluates immediately on the current stack (sync IIFE).",
    "The function’s environment is eligible for GC after return unless closures remain."
  ],
  "takeaways": [
    "Use blocks { } or modules today instead of IIFE for scope.",
    "Keep async IIFE for top-level await polyfills in classic scripts: (async () => { await ... })().",
    "Missing parens: function(){}() can be a syntax error because function is parsed as a declaration.",
    "The grouping operator produces a FunctionExpression."
  ],
  "revision": [
    "IIFE: A disposable room: enter, run, leave, keep only what you returned.",
    "Use blocks { } or modules today instead of IIFE for scope.",
    "Keep async IIFE for top-level await polyfills in classic scripts: (async () => { await ... })().",
    "Parenthesize: (function(){})() or !function(){}() (avoid the latter for style).",
    "Trap: Missing parens: function(){}() can be a syntax error because function is parsed as a declaration."
  ],
  "flashcards": [
    [
      "IIFE",
      "An IIFE is (function () { ..."
    ],
    [
      "Mental model",
      "A disposable room: enter, run, leave, keep only what you returned."
    ],
    [
      "Common trap",
      "Missing parens: function(){}() can be a syntax error because function is parsed as a declaration."
    ],
    [
      "Use blocks { } or modules today instead of IIFE for scope.",
      "Keep async IIFE for top-level await polyfills in classic scripts: (async () => { await ... })()."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is IIFE and where does a beginner first see it?",
      "answerHint": "An IIFE is (function () { ... })() — a function created and immediately invoked. It built a private scope before modules and let/const blocks. Variants: arrow IIFE, async IIFE. The wrapping parens force an expression so function is not parsed as a declaration."
    },
    {
      "level": "intermediate",
      "question": "Walk through how IIFE works and name the main pitfall.",
      "answerHint": "Use blocks { } or modules today instead of IIFE for scope. Keep async IIFE for top-level await polyfills in classic scripts: (async () => { await ... })(). Parenthesize: (function(){})() or !function(){}() (avoid the latter for style). Return an API object for the revealing module pattern. Pitfall: Missing parens: function(){}() can be a syntax error because function is parsed as a declaration."
    },
    {
      "level": "advanced",
      "question": "How would you explain IIFE at an interview, including engine/spec details?",
      "answerHint": "The grouping operator produces a FunctionExpression. Call evaluates immediately on the current stack (sync IIFE). The function’s environment is eligible for GC after return unless closures remain."
    }
  ],
  "pitfalls": [
    "Missing parens: function(){}() can be a syntax error because function is parsed as a declaration.",
    "Return an API object for the revealing module pattern."
  ],
  "interview": {
    "expectations": [
      "Explain IIFE without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "The grouping operator produces a FunctionExpression."
    ],
    "commonQuestions": [
      "What is IIFE?",
      "Why does JavaScript iife behave this way?",
      "What is the classic IIFE interview trap?"
    ],
    "traps": [
      "Missing parens: function(){}() can be a syntax error because function is parsed as a declaration."
    ],
    "misconceptions": [
      "Classic scripts had no modules. IIFE prevented var from leaking into the global object and created a private namespace."
    ],
    "strongSignals": [
      "Separates IIFE from lookalike APIs and can draw the mental model."
    ]
  }
})
