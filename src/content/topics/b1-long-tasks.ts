import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Long Tasks / Main-Thread Blocking",
  "whatIsIt": "A long task is ~50ms+ of sync JS (or long layout) on the main thread, blocking input and paint. Fix: split work (yield, scheduler.postTask, setTimeout chunks), move CPU to Workers, reduce layout thrash. await does not help if you still do 200ms of CPU between awaits. INP/TBT metrics track this.",
  "whyExists": "Run-to-completion means a 200ms loop is a 200ms frozen tab. User-centric metrics made this a first-class bug.",
  "mentalModel": "The bartender making a 200ms cocktail while the line (clicks, paint) waits. Yield = serve the line between stirs.",
  "how": [
    "Profile; find the yellow JS block.",
    "Chunk arrays; yield to the loop.",
    "Workers for parse/crypto/image.",
    "Avoid sync layout in loops (read then write DOM)."
  ],
  "callout": {
    "title": "Watch for",
    "text": "JSON.parse of a huge string on the main thread — one long task; workers or streaming parse help.",
    "variant": "warning"
  },
  "example": "async function chunked(xs, fn) {\n  const out = [];\n  for (let i = 0; i < xs.length; i++) {\n    out.push(fn(xs[i]));\n    if (i % 1000 === 0) await new Promise((r) => setTimeout(r, 0));\n  }\n  return out;\n}\nconsole.log((await chunked([1, 2, 3], (x) => x + 1)).length);\n",
  "exampleCaption": "Yield every N items so tasks can run",
  "internals": [
    "Long Tasks API / PerformanceObserver entryType longtask.",
    "50ms threshold is a heuristic used by the web perf community.",
    "scheduler.yield is designed to wait for a chance to continue after input."
  ],
  "takeaways": [
    "Profile; find the yellow JS block.",
    "Chunk arrays; yield to the loop.",
    "JSON.parse of a huge string on the main thread — one long task; workers or streaming parse help.",
    "Long Tasks API / PerformanceObserver entryType longtask."
  ],
  "revision": [
    "Long Tasks / Main-Thread Blocking: The bartender making a 200ms cocktail while the line (clicks, paint) waits. Yield = serve the line between stirs.",
    "Profile; find the yellow JS block.",
    "Chunk arrays; yield to the loop.",
    "Workers for parse/crypto/image.",
    "Trap: JSON.parse of a huge string on the main thread — one long task; workers or streaming parse help."
  ],
  "flashcards": [
    [
      "Long Tasks / Main-Thread Blocking",
      "A long task is ~50ms+ of sync JS (or long layout) on the main thread, blocking input and paint."
    ],
    [
      "Mental model",
      "The bartender making a 200ms cocktail while the line (clicks, paint) waits. Yield = serve the line between stirs."
    ],
    [
      "Common trap",
      "JSON.parse of a huge string on the main thread — one long task; workers or streaming parse help."
    ],
    [
      "Profile; find the yellow JS block.",
      "Chunk arrays; yield to the loop."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Long Tasks / Main-Thread Blocking and where does a beginner first see it?",
      "answerHint": "A long task is ~50ms+ of sync JS (or long layout) on the main thread, blocking input and paint. Fix: split work (yield, scheduler.postTask, setTimeout chunks), move CPU to Workers, reduce layout thrash. await does not help if you still do 200ms of CPU between awaits. INP/TBT metrics track this."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Long Tasks / Main-Thread Blocking works and name the main pitfall.",
      "answerHint": "Profile; find the yellow JS block. Chunk arrays; yield to the loop. Workers for parse/crypto/image. Avoid sync layout in loops (read then write DOM). Pitfall: JSON.parse of a huge string on the main thread — one long task; workers or streaming parse help."
    },
    {
      "level": "advanced",
      "question": "How would you explain Long Tasks / Main-Thread Blocking at an interview, including engine/spec details?",
      "answerHint": "Long Tasks API / PerformanceObserver entryType longtask. 50ms threshold is a heuristic used by the web perf community. scheduler.yield is designed to wait for a chance to continue after input."
    }
  ],
  "pitfalls": [
    "JSON.parse of a huge string on the main thread — one long task; workers or streaming parse help.",
    "Avoid sync layout in loops (read then write DOM)."
  ],
  "interview": {
    "expectations": [
      "Explain Long Tasks / Main-Thread Blocking without mixing it up with a nearby B1.40 — Performance Patterns topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Long Tasks API / PerformanceObserver entryType longtask."
    ],
    "commonQuestions": [
      "What is Long Tasks / Main-Thread Blocking?",
      "Why does JavaScript long tasks / main-thread blocking behave this way?",
      "What is the classic Long Tasks / Main-Thread Blocking interview trap?"
    ],
    "traps": [
      "JSON.parse of a huge string on the main thread — one long task; workers or streaming parse help."
    ],
    "misconceptions": [
      "Run-to-completion means a 200ms loop is a 200ms frozen tab. User-centric metrics made this a first-class bug."
    ],
    "strongSignals": [
      "Separates Long Tasks / Main-Thread Blocking from lookalike APIs and can draw the mental model."
    ]
  }
})
