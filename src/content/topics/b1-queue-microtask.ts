import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "queueMicrotask",
  "whatIsIt": "queueMicrotask(fn) schedules fn as a microtask without a Promise. It runs with the same priority as Promise.then. If fn throws, it is reported as an uncaught exception on that microtask, not as a rejection unless you use promises. Use it when you want ‘after this stack’ without allocating a Promise.",
  "whyExists": "Hosts and libraries needed the Promise-job timing without faking a resolve().then.",
  "mentalModel": "Push this function onto the VIP line, no Promise wrapper required.",
  "how": [
    "queueMicrotask(() => ...) to defer until after DOM updates in the same task sometimes.",
    "Prefer Promises when you need chaining/error propagation.",
    "Do not queueMicrotask in a tight recursive storm.",
    "In Node, process.nextTick is even sooner than microtasks in some versions — don’t mix casually."
  ],
  "callout": {
    "title": "Watch for",
    "text": "queueMicrotask(async () => { throw e }) — the throw becomes a rejection of the async function’s promise, which may be unhandled.",
    "variant": "warning"
  },
  "example": "console.log('a');\nqueueMicrotask(() => console.log('c'));\nPromise.resolve().then(() => console.log('d'));\nconsole.log('b');\n",
  "exampleCaption": "queueMicrotask alongside Promise.then",
  "internals": [
    "queueMicrotask is specified in HTML as queuing a microtask.",
    "It is not in ECMA-262; engines expose it as a host function.",
    "Ordering vs already-queued Promise jobs is FIFO on the same queue."
  ],
  "takeaways": [
    "queueMicrotask(() => ...) to defer until after DOM updates in the same task sometimes.",
    "Prefer Promises when you need chaining/error propagation.",
    "queueMicrotask(async () => { throw e }) — the throw becomes a rejection of the async function’s promise, which may be unhandled.",
    "queueMicrotask is specified in HTML as queuing a microtask."
  ],
  "revision": [
    "queueMicrotask: Push this function onto the VIP line, no Promise wrapper required.",
    "queueMicrotask(() => ...) to defer until after DOM updates in the same task sometimes.",
    "Prefer Promises when you need chaining/error propagation.",
    "Do not queueMicrotask in a tight recursive storm.",
    "Trap: queueMicrotask(async () => { throw e }) — the throw becomes a rejection of the async function’s promise, which may be unhandled."
  ],
  "flashcards": [
    [
      "queueMicrotask",
      "queueMicrotask(fn) schedules fn as a microtask without a Promise."
    ],
    [
      "Mental model",
      "Push this function onto the VIP line, no Promise wrapper required."
    ],
    [
      "Common trap",
      "queueMicrotask(async () => { throw e }) — the throw becomes a rejection of the async function’s promise, which may be unhandled."
    ],
    [
      "queueMicrotask(() => ...) to defer until after DOM updates in the same task some",
      "Prefer Promises when you need chaining/error propagation."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is queueMicrotask and where does a beginner first see it?",
      "answerHint": "queueMicrotask(fn) schedules fn as a microtask without a Promise. It runs with the same priority as Promise.then. If fn throws, it is reported as an uncaught exception on that microtask, not as a rejection unless you use promises. Use it when you want ‘after this stack’ without allocating a Promise."
    },
    {
      "level": "intermediate",
      "question": "Walk through how queueMicrotask works and name the main pitfall.",
      "answerHint": "queueMicrotask(() => ...) to defer until after DOM updates in the same task sometimes. Prefer Promises when you need chaining/error propagation. Do not queueMicrotask in a tight recursive storm. In Node, process.nextTick is even sooner than microtasks in some versions — don’t mix casually. Pitfall: queueMicrotask(async () => { throw e }) — the throw becomes a rejection of the async function’s promise, which may be unhandled."
    },
    {
      "level": "advanced",
      "question": "How would you explain queueMicrotask at an interview, including engine/spec details?",
      "answerHint": "queueMicrotask is specified in HTML as queuing a microtask. It is not in ECMA-262; engines expose it as a host function. Ordering vs already-queued Promise jobs is FIFO on the same queue."
    }
  ],
  "pitfalls": [
    "queueMicrotask(async () => { throw e }) — the throw becomes a rejection of the async function’s promise, which may be unhandled.",
    "In Node, process.nextTick is even sooner than microtasks in some versions — don’t mix casually."
  ],
  "interview": {
    "expectations": [
      "Explain queueMicrotask without mixing it up with a nearby B1.26 — Event Loop topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "queueMicrotask is specified in HTML as queuing a microtask."
    ],
    "commonQuestions": [
      "What is queueMicrotask?",
      "Why does JavaScript queuemicrotask behave this way?",
      "What is the classic queueMicrotask interview trap?"
    ],
    "traps": [
      "queueMicrotask(async () => { throw e }) — the throw becomes a rejection of the async function’s promise, which may be unhandled."
    ],
    "misconceptions": [
      "Hosts and libraries needed the Promise-job timing without faking a resolve().then."
    ],
    "strongSignals": [
      "Separates queueMicrotask from lookalike APIs and can draw the mental model."
    ]
  }
})
