import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Callback Hell & Inversion of Control",
  "whatIsIt": "Callback hell is nested callbacks for sequential async steps, indenting into a pyramid. Inversion of control: you hand your continuation to a third-party that might call it twice, never, or sync. Promises flatten chains; async/await looks like sync. Named functions and early returns also flatten without promises.",
  "whyExists": "I/O is sequential in business logic but callbacks nest. The pyramid is a readability and error-handling failure.",
  "mentalModel": "A waterfall of anonymous functions. Each step holds the next hostage. Promises turn it into a list of then/await.",
  "how": [
    "async/await with try/catch.",
    "Named step functions instead of anonymous nests.",
    "Promise.prototype.then chain if you cannot await.",
    "Do not mix callback APIs without wrapping."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Still nesting await in callbacks (forEach) recreates hell and skips awaiting.",
    "variant": "warning"
  },
  "example": "function step(n) { return new Promise((r) => setTimeout(() => r(n), 0)); }\nconst a = await step(1);\nconst b = await step(a + 1);\nconst c = await step(b + 1);\nconsole.log(c);\nstep(1).then((x) => step(x + 1)).then((x) => step(x + 1)).then(console.log);\n",
  "exampleCaption": "Sequential async without a pyramid of callbacks",
  "internals": [
    "Inversion of control is a design property: the callee owns the call.",
    "Promises restore some control: settle once, thenable chain.",
    "async functions desugar to generator-like promise machines."
  ],
  "takeaways": [
    "async/await with try/catch.",
    "Named step functions instead of anonymous nests.",
    "Still nesting await in callbacks (forEach) recreates hell and skips awaiting.",
    "Inversion of control is a design property: the callee owns the call."
  ],
  "revision": [
    "Callback Hell & Inversion of Control: A waterfall of anonymous functions. Each step holds the next hostage. Promises turn it into a list of then/await.",
    "async/await with try/catch.",
    "Named step functions instead of anonymous nests.",
    "Promise.prototype.then chain if you cannot await.",
    "Trap: Still nesting await in callbacks (forEach) recreates hell and skips awaiting."
  ],
  "flashcards": [
    [
      "Callback Hell & Inversion of Control",
      "Callback hell is nested callbacks for sequential async steps, indenting into a pyramid."
    ],
    [
      "Mental model",
      "A waterfall of anonymous functions. Each step holds the next hostage. Promises turn it into a list of then/await."
    ],
    [
      "Common trap",
      "Still nesting await in callbacks (forEach) recreates hell and skips awaiting."
    ],
    [
      "async/await with try/catch.",
      "Named step functions instead of anonymous nests."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Callback Hell & Inversion of Control and where does a beginner first see it?",
      "answerHint": "Callback hell is nested callbacks for sequential async steps, indenting into a pyramid. Inversion of control: you hand your continuation to a third-party that might call it twice, never, or sync. Promises flatten chains; async/await looks like sync. Named functions and early returns also flatten without promises."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Callback Hell & Inversion of Control works and name the main pitfall.",
      "answerHint": "async/await with try/catch. Named step functions instead of anonymous nests. Promise.prototype.then chain if you cannot await. Do not mix callback APIs without wrapping. Pitfall: Still nesting await in callbacks (forEach) recreates hell and skips awaiting."
    },
    {
      "level": "advanced",
      "question": "How would you explain Callback Hell & Inversion of Control at an interview, including engine/spec details?",
      "answerHint": "Inversion of control is a design property: the callee owns the call. Promises restore some control: settle once, thenable chain. async functions desugar to generator-like promise machines."
    }
  ],
  "pitfalls": [
    "Still nesting await in callbacks (forEach) recreates hell and skips awaiting.",
    "Do not mix callback APIs without wrapping."
  ],
  "interview": {
    "expectations": [
      "Explain Callback Hell & Inversion of Control without mixing it up with a nearby B1.28 — Callbacks topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Inversion of control is a design property: the callee owns the call."
    ],
    "commonQuestions": [
      "What is Callback Hell & Inversion of Control?",
      "Why does JavaScript callback hell & inversion of control behave this way?",
      "What is the classic Callback Hell & Inversion of Control interview trap?"
    ],
    "traps": [
      "Still nesting await in callbacks (forEach) recreates hell and skips awaiting."
    ],
    "misconceptions": [
      "I/O is sequential in business logic but callbacks nest. The pyramid is a readability and error-handling failure."
    ],
    "strongSignals": [
      "Separates Callback Hell & Inversion of Control from lookalike APIs and can draw the mental model."
    ]
  }
})
