import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Unhandled Promise Rejection",
  "whatIsIt": "A rejected promise with no catch/await handler is an unhandled rejection. Browsers fire unhandledrejection; Node historically crashed (or warned) depending on version/flags. A late .catch() can fire rejectionhandled. Always attach handlers; void p is not handling. async IIFE without catch is a common source.",
  "whyExists": "Lost async errors used to vanish. Hosts now surface them like uncaught exceptions.",
  "mentalModel": "A rejection with nobody’s catch waiting. The host raises a red flag. Catching later may be ‘too late’ for crash policies.",
  "how": [
    "void somePromise is not a handler — use .catch(log).",
    "Top-level await in modules: wrap in try.",
    "Listen to unhandledrejection for logging, still fix the source.",
    "Do not empty-catch to silence production."
  ],
  "callout": {
    "title": "Watch for",
    "text": "then(() => {}) on a rejecting promise does not handle — you need the second arg or catch.",
    "variant": "warning"
  },
  "example": "window?.addEventListener?.('unhandledrejection', (e) => {\n  console.log('unhandled', e.reason);\n});\nPromise.reject(new Error('oops')).then(() => {});\n// missing catch — may log as unhandled\nPromise.reject(new Error('handled')).catch((e) => console.log('ok', e.message));\n",
  "exampleCaption": "Unhandled vs immediately caught rejection",
  "internals": [
    "HostPromiseRejectionTracker(operation).",
    "HTML Unhandled Promise Rejection Steps.",
    "Node --unhandled-rejections=strict."
  ],
  "takeaways": [
    "void somePromise is not a handler — use .catch(log).",
    "Top-level await in modules: wrap in try.",
    "then(() => {}) on a rejecting promise does not handle — you need the second arg or catch.",
    "HostPromiseRejectionTracker(operation)."
  ],
  "revision": [
    "Unhandled Promise Rejection: A rejection with nobody’s catch waiting. The host raises a red flag. Catching later may be ‘too late’ for crash policies.",
    "void somePromise is not a handler — use .catch(log).",
    "Top-level await in modules: wrap in try.",
    "Listen to unhandledrejection for logging, still fix the source.",
    "Trap: then(() => {}) on a rejecting promise does not handle — you need the second arg or catch."
  ],
  "flashcards": [
    [
      "Unhandled Promise Rejection",
      "A rejected promise with no catch/await handler is an unhandled rejection."
    ],
    [
      "Mental model",
      "A rejection with nobody’s catch waiting. The host raises a red flag. Catching later may be ‘too late’ for crash policies."
    ],
    [
      "Common trap",
      "then(() => {}) on a rejecting promise does not handle — you need the second arg or catch."
    ],
    [
      "void somePromise is not a handler — use .catch(log).",
      "Top-level await in modules: wrap in try."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Unhandled Promise Rejection and where does a beginner first see it?",
      "answerHint": "A rejected promise with no catch/await handler is an unhandled rejection. Browsers fire unhandledrejection; Node historically crashed (or warned) depending on version/flags. A late .catch() can fire rejectionhandled. Always attach handlers; void p is not handling. async IIFE without catch is a common source."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Unhandled Promise Rejection works and name the main pitfall.",
      "answerHint": "void somePromise is not a handler — use .catch(log). Top-level await in modules: wrap in try. Listen to unhandledrejection for logging, still fix the source. Do not empty-catch to silence production. Pitfall: then(() => {}) on a rejecting promise does not handle — you need the second arg or catch."
    },
    {
      "level": "advanced",
      "question": "How would you explain Unhandled Promise Rejection at an interview, including engine/spec details?",
      "answerHint": "HostPromiseRejectionTracker(operation). HTML Unhandled Promise Rejection Steps. Node --unhandled-rejections=strict."
    }
  ],
  "pitfalls": [
    "then(() => {}) on a rejecting promise does not handle — you need the second arg or catch.",
    "Do not empty-catch to silence production."
  ],
  "interview": {
    "expectations": [
      "Explain Unhandled Promise Rejection without mixing it up with a nearby B1.32 — Error Handling topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "HostPromiseRejectionTracker(operation)."
    ],
    "commonQuestions": [
      "What is Unhandled Promise Rejection?",
      "Why does JavaScript unhandled promise rejection behave this way?",
      "What is the classic Unhandled Promise Rejection interview trap?"
    ],
    "traps": [
      "then(() => {}) on a rejecting promise does not handle — you need the second arg or catch."
    ],
    "misconceptions": [
      "Lost async errors used to vanish. Hosts now surface them like uncaught exceptions."
    ],
    "strongSignals": [
      "Separates Unhandled Promise Rejection from lookalike APIs and can draw the mental model."
    ]
  }
})
