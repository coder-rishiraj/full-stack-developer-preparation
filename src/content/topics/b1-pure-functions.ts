import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Pure vs Impure Functions",
  "whatIsIt": "A pure function’s result depends only on its inputs and it has no side effects (no I/O, no mutation of arguments or outer state, no Date.now). Same args ⇒ same return. Impure functions log, write DOM, increment counters, or read globals. Purity is a design choice, not a JS keyword.",
  "whyExists": "Pure functions are easy to test, memoize, and reason about in concurrent-looking UIs. React render functions aspire to this.",
  "mentalModel": "A math machine: inputs in, value out, world unchanged. Impure machines also move furniture in the room.",
  "how": [
    "Return new objects instead of mutating args when you need purity.",
    "Isolate I/O at the edges; keep core logic pure.",
    "Do not read module-level lets inside ‘pure’ helpers.",
    "Date.now and Math.random make a function impure."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Mutating an input array inside a ‘helper’ makes every caller share the bug — looks local, is global.",
    "variant": "warning"
  },
  "example": "const tax = 0.1;\nfunction pureTotal(price, rate) { return price * (1 + rate); }\nfunction impureTotal(price) { return price * (1 + tax); }\nlet calls = 0;\nfunction counted(n) { calls += 1; return n * 2; }\nconsole.log(pureTotal(100, 0.1), impureTotal(100), counted(3), calls);\n",
  "exampleCaption": "Pure vs closed-over tax vs side-effect counter",
  "internals": [
    "JS cannot enforce purity; engines assume it for some optimizations only when they can prove it.",
    "Closures over mutable bindings are a hidden input.",
    "Memoization is incorrect if the function is impure."
  ],
  "takeaways": [
    "Return new objects instead of mutating args when you need purity.",
    "Isolate I/O at the edges; keep core logic pure.",
    "Mutating an input array inside a ‘helper’ makes every caller share the bug — looks local, is global.",
    "JS cannot enforce purity; engines assume it for some optimizations only when they can prove it."
  ],
  "revision": [
    "Pure vs Impure Functions: A math machine: inputs in, value out, world unchanged. Impure machines also move furniture in the room.",
    "Return new objects instead of mutating args when you need purity.",
    "Isolate I/O at the edges; keep core logic pure.",
    "Do not read module-level lets inside ‘pure’ helpers.",
    "Trap: Mutating an input array inside a ‘helper’ makes every caller share the bug — looks local, is global."
  ],
  "flashcards": [
    [
      "Pure vs Impure Functions",
      "A pure function’s result depends only on its inputs and it has no side effects (no I/O, no mutation of arguments or outer state, no Date.now)."
    ],
    [
      "Mental model",
      "A math machine: inputs in, value out, world unchanged. Impure machines also move furniture in the room."
    ],
    [
      "Common trap",
      "Mutating an input array inside a ‘helper’ makes every caller share the bug — looks local, is global."
    ],
    [
      "Return new objects instead of mutating args when you need purity.",
      "Isolate I/O at the edges; keep core logic pure."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Pure vs Impure Functions and where does a beginner first see it?",
      "answerHint": "A pure function’s result depends only on its inputs and it has no side effects (no I/O, no mutation of arguments or outer state, no Date.now). Same args ⇒ same return. Impure functions log, write DOM, increment counters, or read globals. Purity is a design choice, not a JS keyword."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Pure vs Impure Functions works and name the main pitfall.",
      "answerHint": "Return new objects instead of mutating args when you need purity. Isolate I/O at the edges; keep core logic pure. Do not read module-level lets inside ‘pure’ helpers. Date.now and Math.random make a function impure. Pitfall: Mutating an input array inside a ‘helper’ makes every caller share the bug — looks local, is global."
    },
    {
      "level": "advanced",
      "question": "How would you explain Pure vs Impure Functions at an interview, including engine/spec details?",
      "answerHint": "JS cannot enforce purity; engines assume it for some optimizations only when they can prove it. Closures over mutable bindings are a hidden input. Memoization is incorrect if the function is impure."
    }
  ],
  "pitfalls": [
    "Mutating an input array inside a ‘helper’ makes every caller share the bug — looks local, is global.",
    "Date.now and Math.random make a function impure."
  ],
  "interview": {
    "expectations": [
      "Explain Pure vs Impure Functions without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "JS cannot enforce purity; engines assume it for some optimizations only when they can prove it."
    ],
    "commonQuestions": [
      "What is Pure vs Impure Functions?",
      "Why does JavaScript pure vs impure functions behave this way?",
      "What is the classic Pure vs Impure Functions interview trap?"
    ],
    "traps": [
      "Mutating an input array inside a ‘helper’ makes every caller share the bug — looks local, is global."
    ],
    "misconceptions": [
      "Pure functions are easy to test, memoize, and reason about in concurrent-looking UIs. React render functions aspire to this."
    ],
    "strongSignals": [
      "Separates Pure vs Impure Functions from lookalike APIs and can draw the mental model."
    ]
  }
})
