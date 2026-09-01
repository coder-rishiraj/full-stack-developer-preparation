import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Loops + Closures",
  "whatIsIt": "Creating functions inside a loop captures the loop bindings. let/const in for headers are cloned per iteration, so each function sees that iteration’s value. var is one binding for the whole loop, so all functions see the final value. forEach with a callback is naturally per-element.",
  "whyExists": "The setTimeout-in-a-for-loop puzzle is the most assigned JS interview. It teaches closures + var vs let.",
  "mentalModel": "var: one sticky note rewritten each lap. let: a new sticky note each lap, handed to that lap’s function.",
  "how": [
    "Use let in for (let i = 0; ...).",
    "Or bind: fn.bind(null, i) / extra closure with an IIFE passing i.",
    "forEach/map already get a per-call parameter.",
    "for...of const x is also per-iteration."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Using var and ‘fixing’ with setTimeout(fn, 0, i) is passing an argument, not capturing — know which fix you used.",
    "variant": "warning"
  },
  "example": "const varFns = [];\nfor (var i = 0; i < 3; i++) varFns.push(() => i);\nconst letFns = [];\nfor (let j = 0; j < 3; j++) letFns.push(() => j);\nconsole.log(varFns.map((f) => f()), letFns.map((f) => f()));\n[0, 1, 2].forEach((n, _, __, fns = []) => fns);\n",
  "exampleCaption": "var loop vs let loop closures",
  "internals": [
    "ForBodyEvaluation with per-iteration environment copies let bindings.",
    "var remains in the enclosing VariableEnvironment.",
    "The IIFE fix creates a new environment with a param per iteration."
  ],
  "takeaways": [
    "Use let in for (let i = 0; ...).",
    "Or bind: fn.bind(null, i) / extra closure with an IIFE passing i.",
    "Using var and ‘fixing’ with setTimeout(fn, 0, i) is passing an argument, not capturing — know which fix you used.",
    "ForBodyEvaluation with per-iteration environment copies let bindings."
  ],
  "revision": [
    "Loops + Closures: var: one sticky note rewritten each lap. let: a new sticky note each lap, handed to that lap’s function.",
    "Use let in for (let i = 0; ...).",
    "Or bind: fn.bind(null, i) / extra closure with an IIFE passing i.",
    "forEach/map already get a per-call parameter.",
    "Trap: Using var and ‘fixing’ with setTimeout(fn, 0, i) is passing an argument, not capturing — know which fix you used."
  ],
  "flashcards": [
    [
      "Loops + Closures",
      "Creating functions inside a loop captures the loop bindings."
    ],
    [
      "Mental model",
      "var: one sticky note rewritten each lap. let: a new sticky note each lap, handed to that lap’s function."
    ],
    [
      "Common trap",
      "Using var and ‘fixing’ with setTimeout(fn, 0, i) is passing an argument, not capturing — know which fix you used."
    ],
    [
      "Use let in for (let i = 0; ...).",
      "Or bind: fn.bind(null, i) / extra closure with an IIFE passing i."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Loops + Closures and where does a beginner first see it?",
      "answerHint": "Creating functions inside a loop captures the loop bindings. let/const in for headers are cloned per iteration, so each function sees that iteration’s value. var is one binding for the whole loop, so all functions see the final value. forEach with a callback is naturally per-element."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Loops + Closures works and name the main pitfall.",
      "answerHint": "Use let in for (let i = 0; ...). Or bind: fn.bind(null, i) / extra closure with an IIFE passing i. forEach/map already get a per-call parameter. for...of const x is also per-iteration. Pitfall: Using var and ‘fixing’ with setTimeout(fn, 0, i) is passing an argument, not capturing — know which fix you used."
    },
    {
      "level": "advanced",
      "question": "How would you explain Loops + Closures at an interview, including engine/spec details?",
      "answerHint": "ForBodyEvaluation with per-iteration environment copies let bindings. var remains in the enclosing VariableEnvironment. The IIFE fix creates a new environment with a param per iteration."
    }
  ],
  "pitfalls": [
    "Using var and ‘fixing’ with setTimeout(fn, 0, i) is passing an argument, not capturing — know which fix you used.",
    "for...of const x is also per-iteration."
  ],
  "interview": {
    "expectations": [
      "Explain Loops + Closures without mixing it up with a nearby B1.12 — Closures topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "ForBodyEvaluation with per-iteration environment copies let bindings."
    ],
    "commonQuestions": [
      "What is Loops + Closures?",
      "Why does JavaScript loops + closures behave this way?",
      "What is the classic Loops + Closures interview trap?"
    ],
    "traps": [
      "Using var and ‘fixing’ with setTimeout(fn, 0, i) is passing an argument, not capturing — know which fix you used."
    ],
    "misconceptions": [
      "The setTimeout-in-a-for-loop puzzle is the most assigned JS interview. It teaches closures + var vs let."
    ],
    "strongSignals": [
      "Separates Loops + Closures from lookalike APIs and can draw the mental model."
    ]
  }
})
