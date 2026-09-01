import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Callbacks",
  "whatIsIt": "A callback is a function you pass so another function can call it later or immediately. Synchronous callbacks run before the outer call returns (array.map). Asynchronous callbacks run after, via the event loop (setTimeout). The word ‘later’ is the whole game.",
  "whyExists": "You cannot always wait on the line for I/O. Passing a continuation lets the stack unwind and resume with the result.",
  "mentalModel": "‘Here’s the next step.’ Sync: they take the step now. Async: they take it after the current stack is empty (plus queue rules).",
  "how": [
    "Name whether an API is sync or async in your head.",
    "Do not assume a callback is async (map is sync).",
    "Handle errors: sync via throw, async via error-first or promises.",
    "Avoid passing async functions into map if you wanted to wait — map does not await."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Array.map(async fn) returns an array of promises immediately — not awaited results.",
    "variant": "warning"
  },
  "example": "function withSync(cb) {\n  cb('now');\n  console.log('after sync cb');\n}\nfunction withAsync(cb) {\n  setTimeout(() => cb('later'), 0);\n  console.log('after scheduling');\n}\nwithSync((v) => console.log('sync', v));\nwithAsync((v) => console.log('async', v));\n",
  "exampleCaption": "Sync callback vs setTimeout callback order",
  "internals": [
    "A callback is just Call(fn, thisArg, args) from the callee’s code.",
    "Async happens only if the callee enqueues a job/task before calling.",
    "The spec does not mark functions as ‘callback’; hosts do."
  ],
  "takeaways": [
    "Name whether an API is sync or async in your head.",
    "Do not assume a callback is async (map is sync).",
    "Array.map(async fn) returns an array of promises immediately — not awaited results.",
    "A callback is just Call(fn, thisArg, args) from the callee’s code."
  ],
  "revision": [
    "Callbacks: ‘Here’s the next step.’ Sync: they take the step now. Async: they take it after the current stack is empty (plus queue rules).",
    "Name whether an API is sync or async in your head.",
    "Do not assume a callback is async (map is sync).",
    "Handle errors: sync via throw, async via error-first or promises.",
    "Trap: Array.map(async fn) returns an array of promises immediately — not awaited results."
  ],
  "flashcards": [
    [
      "Callbacks",
      "A callback is a function you pass so another function can call it later or immediately."
    ],
    [
      "Mental model",
      "‘Here’s the next step.’ Sync: they take the step now. Async: they take it after the current stack is empty (plus queue rules)."
    ],
    [
      "Common trap",
      "Array.map(async fn) returns an array of promises immediately — not awaited results."
    ],
    [
      "Name whether an API is sync or async in your head.",
      "Do not assume a callback is async (map is sync)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Callbacks and where does a beginner first see it?",
      "answerHint": "A callback is a function you pass so another function can call it later or immediately. Synchronous callbacks run before the outer call returns (array.map). Asynchronous callbacks run after, via the event loop (setTimeout). The word ‘later’ is the whole game."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Callbacks works and name the main pitfall.",
      "answerHint": "Name whether an API is sync or async in your head. Do not assume a callback is async (map is sync). Handle errors: sync via throw, async via error-first or promises. Avoid passing async functions into map if you wanted to wait — map does not await. Pitfall: Array.map(async fn) returns an array of promises immediately — not awaited results."
    },
    {
      "level": "advanced",
      "question": "How would you explain Callbacks at an interview, including engine/spec details?",
      "answerHint": "A callback is just Call(fn, thisArg, args) from the callee’s code. Async happens only if the callee enqueues a job/task before calling. The spec does not mark functions as ‘callback’; hosts do."
    }
  ],
  "pitfalls": [
    "Array.map(async fn) returns an array of promises immediately — not awaited results.",
    "Avoid passing async functions into map if you wanted to wait — map does not await."
  ],
  "interview": {
    "expectations": [
      "Explain Callbacks without mixing it up with a nearby B1.9 — Functions topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "A callback is just Call(fn, thisArg, args) from the callee’s code."
    ],
    "commonQuestions": [
      "What is Callbacks?",
      "Why does JavaScript callbacks behave this way?",
      "What is the classic Callbacks interview trap?"
    ],
    "traps": [
      "Array.map(async fn) returns an array of promises immediately — not awaited results."
    ],
    "misconceptions": [
      "You cannot always wait on the line for I/O. Passing a continuation lets the stack unwind and resume with the result."
    ],
    "strongSignals": [
      "Separates Callbacks from lookalike APIs and can draw the mental model."
    ]
  }
})
