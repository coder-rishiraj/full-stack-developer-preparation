import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Referential Transparency Concept",
  "whatIsIt": "An expression is referentially transparent if you can replace it with its value without changing the program. Pure functions with immutable data aim at this. In JS, Date.now, this, I/O, and mutation break it. Transparency makes memoization and rerender skips valid.",
  "whyExists": "FP interviews and React ‘pure render’ talk this language. It is a property of expressions, not a JS keyword.",
  "mentalModel": "2+2 can be replaced with 4. fetch(url) cannot be replaced with a constant without changing the world.",
  "how": [
    "Push I/O to the edges.",
    "Pass time and randomness as arguments in core logic.",
    "Do not read module-level lets in ‘pure’ helpers.",
    "Memoize only transparent functions."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Memoizing a function that reads Redux-like global state — cache hits are wrong.",
    "variant": "warning"
  },
  "example": "const add = (a, b) => a + b;\nconsole.log(add(2, 2), add(2, 2));\nconst stamp = () => Date.now();\nconsole.log(stamp() === stamp());\nlet n = 0;\nconst tick = () => ++n;\nconsole.log(tick(), tick());\n",
  "exampleCaption": "add is transparent; Date.now and ++ are not",
  "internals": [
    "The spec does not define referential transparency.",
    "Math.random and Date.now are host calls with effects.",
    "JIT may CSE pure arithmetic; it cannot CSE your fetch."
  ],
  "takeaways": [
    "Push I/O to the edges.",
    "Pass time and randomness as arguments in core logic.",
    "Memoizing a function that reads Redux-like global state — cache hits are wrong.",
    "The spec does not define referential transparency."
  ],
  "revision": [
    "Referential Transparency Concept: 2+2 can be replaced with 4. fetch(url) cannot be replaced with a constant without changing the world.",
    "Push I/O to the edges.",
    "Pass time and randomness as arguments in core logic.",
    "Do not read module-level lets in ‘pure’ helpers.",
    "Trap: Memoizing a function that reads Redux-like global state — cache hits are wrong."
  ],
  "flashcards": [
    [
      "Referential Transparency Concept",
      "An expression is referentially transparent if you can replace it with its value without changing the program."
    ],
    [
      "Mental model",
      "2+2 can be replaced with 4. fetch(url) cannot be replaced with a constant without changing the world."
    ],
    [
      "Common trap",
      "Memoizing a function that reads Redux-like global state — cache hits are wrong."
    ],
    [
      "Push I/O to the edges.",
      "Pass time and randomness as arguments in core logic."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Referential Transparency Concept and where does a beginner first see it?",
      "answerHint": "An expression is referentially transparent if you can replace it with its value without changing the program. Pure functions with immutable data aim at this. In JS, Date.now, this, I/O, and mutation break it. Transparency makes memoization and rerender skips valid."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Referential Transparency Concept works and name the main pitfall.",
      "answerHint": "Push I/O to the edges. Pass time and randomness as arguments in core logic. Do not read module-level lets in ‘pure’ helpers. Memoize only transparent functions. Pitfall: Memoizing a function that reads Redux-like global state — cache hits are wrong."
    },
    {
      "level": "advanced",
      "question": "How would you explain Referential Transparency Concept at an interview, including engine/spec details?",
      "answerHint": "The spec does not define referential transparency. Math.random and Date.now are host calls with effects. JIT may CSE pure arithmetic; it cannot CSE your fetch."
    }
  ],
  "pitfalls": [
    "Memoizing a function that reads Redux-like global state — cache hits are wrong.",
    "Memoize only transparent functions."
  ],
  "interview": {
    "expectations": [
      "Explain Referential Transparency Concept without mixing it up with a nearby B1.38 — Functional JavaScript topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "The spec does not define referential transparency."
    ],
    "commonQuestions": [
      "What is Referential Transparency Concept?",
      "Why does JavaScript referential transparency concept behave this way?",
      "What is the classic Referential Transparency Concept interview trap?"
    ],
    "traps": [
      "Memoizing a function that reads Redux-like global state — cache hits are wrong."
    ],
    "misconceptions": [
      "FP interviews and React ‘pure render’ talk this language. It is a property of expressions, not a JS keyword."
    ],
    "strongSignals": [
      "Separates Referential Transparency Concept from lookalike APIs and can draw the mental model."
    ]
  }
})
