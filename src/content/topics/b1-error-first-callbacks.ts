import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Error-First Callback Pattern",
  "whatIsIt": "Node’s convention: cb(err, result) — err is null/undefined on success, an Error on failure; result is undefined on failure. You must check err first. It does not throw to the caller of the async function. Forgetting to handle err swallows failures. Promises replaced this with reject.",
  "whyExists": "JS had no standard async throw. Two arguments on one callback became the community standard for I/O.",
  "mentalModel": "First slot is the ambulance. If it is empty, the second slot is the package.",
  "how": [
    "if (err) return cb(err) in wrappers.",
    "Never throw in async Node callbacks expecting it to become err.",
    "Wrap with util.promisify / fs.promises.",
    "Do not use both throw and err in the same API."
  ],
  "callout": {
    "title": "Watch for",
    "text": "cb(err) without return, then also cb(null, data) — double callback.",
    "variant": "warning"
  },
  "example": "function readFake(fail, cb) {\n  setTimeout(() => {\n    if (fail) cb(new Error('nope'));\n    else cb(null, 'ok');\n  }, 0);\n}\nreadFake(false, (err, val) => console.log(err, val));\nreadFake(true, (err, val) => console.log(err && err.message, val));\n",
  "exampleCaption": "Success (null, data) vs failure (Error, undefined)",
  "internals": [
    "Convention only; the engine does not know err-first.",
    "domain / uncaughtException were old Node attempts to catch thrown async errors.",
    "promisify assumes this convention."
  ],
  "takeaways": [
    "if (err) return cb(err) in wrappers.",
    "Never throw in async Node callbacks expecting it to become err.",
    "cb(err) without return, then also cb(null, data) — double callback.",
    "Convention only; the engine does not know err-first."
  ],
  "revision": [
    "Error-First Callback Pattern: First slot is the ambulance. If it is empty, the second slot is the package.",
    "if (err) return cb(err) in wrappers.",
    "Never throw in async Node callbacks expecting it to become err.",
    "Wrap with util.promisify / fs.promises.",
    "Trap: cb(err) without return, then also cb(null, data) — double callback."
  ],
  "flashcards": [
    [
      "Error-First Callback Pattern",
      "Node’s convention: cb(err, result) — err is null/undefined on success, an Error on failure; result is undefined on failure."
    ],
    [
      "Mental model",
      "First slot is the ambulance. If it is empty, the second slot is the package."
    ],
    [
      "Common trap",
      "cb(err) without return, then also cb(null, data) — double callback."
    ],
    [
      "if (err) return cb(err) in wrappers.",
      "Never throw in async Node callbacks expecting it to become err."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Error-First Callback Pattern and where does a beginner first see it?",
      "answerHint": "Node’s convention: cb(err, result) — err is null/undefined on success, an Error on failure; result is undefined on failure. You must check err first. It does not throw to the caller of the async function. Forgetting to handle err swallows failures. Promises replaced this with reject."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Error-First Callback Pattern works and name the main pitfall.",
      "answerHint": "if (err) return cb(err) in wrappers. Never throw in async Node callbacks expecting it to become err. Wrap with util.promisify / fs.promises. Do not use both throw and err in the same API. Pitfall: cb(err) without return, then also cb(null, data) — double callback."
    },
    {
      "level": "advanced",
      "question": "How would you explain Error-First Callback Pattern at an interview, including engine/spec details?",
      "answerHint": "Convention only; the engine does not know err-first. domain / uncaughtException were old Node attempts to catch thrown async errors. promisify assumes this convention."
    }
  ],
  "pitfalls": [
    "cb(err) without return, then also cb(null, data) — double callback.",
    "Do not use both throw and err in the same API."
  ],
  "interview": {
    "expectations": [
      "Explain Error-First Callback Pattern without mixing it up with a nearby B1.28 — Callbacks topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Convention only; the engine does not know err-first."
    ],
    "commonQuestions": [
      "What is Error-First Callback Pattern?",
      "Why does JavaScript error-first callback pattern behave this way?",
      "What is the classic Error-First Callback Pattern interview trap?"
    ],
    "traps": [
      "cb(err) without return, then also cb(null, data) — double callback."
    ],
    "misconceptions": [
      "JS had no standard async throw. Two arguments on one callback became the community standard for I/O."
    ],
    "strongSignals": [
      "Separates Error-First Callback Pattern from lookalike APIs and can draw the mental model."
    ]
  }
})
