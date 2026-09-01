import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Callback Concept",
  "whatIsIt": "A callback is a function passed to be invoked by another function or by the host. Continuation-passing style: instead of return, you call next(err, value). JS used callbacks for events and I/O before promises. They are just functions; ‘callback’ is a role.",
  "whyExists": "The caller cannot wait forever on the stack for a click or a socket. Passing a continuation is the original async style.",
  "mentalModel": "Leave a phone number. They call you back when the thing happens. You are not on hold on the same stack.",
  "how": [
    "Name the role: onSuccess, onError.",
    "Document sync vs async invocation.",
    "Bind this if passing a method.",
    "Prefer promises/async in new APIs, still understand callbacks."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Calling the callback twice (bug in the callee) — promises settle once; callbacks do not enforce that.",
    "variant": "warning"
  },
  "example": "function loadFake(cb) {\n  setTimeout(() => cb(null, { ok: true }), 5);\n}\nloadFake((err, data) => {\n  if (err) console.error(err);\n  else console.log(data);\n});\nconsole.log('requested');\n",
  "exampleCaption": "Error-first-style callback after a timeout",
  "internals": [
    "Call(callback, thisArg, args) from the callee or host.",
    "No spec type ‘Callback’ — user convention.",
    "EventTarget uses listeners, a specialized callback list."
  ],
  "takeaways": [
    "Name the role: onSuccess, onError.",
    "Document sync vs async invocation.",
    "Calling the callback twice (bug in the callee) — promises settle once; callbacks do not enforce that.",
    "Call(callback, thisArg, args) from the callee or host."
  ],
  "revision": [
    "Callback Concept: Leave a phone number. They call you back when the thing happens. You are not on hold on the same stack.",
    "Name the role: onSuccess, onError.",
    "Document sync vs async invocation.",
    "Bind this if passing a method.",
    "Trap: Calling the callback twice (bug in the callee) — promises settle once; callbacks do not enforce that."
  ],
  "flashcards": [
    [
      "Callback Concept",
      "A callback is a function passed to be invoked by another function or by the host."
    ],
    [
      "Mental model",
      "Leave a phone number. They call you back when the thing happens. You are not on hold on the same stack."
    ],
    [
      "Common trap",
      "Calling the callback twice (bug in the callee) — promises settle once; callbacks do not enforce that."
    ],
    [
      "Name the role: onSuccess, onError.",
      "Document sync vs async invocation."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Callback Concept and where does a beginner first see it?",
      "answerHint": "A callback is a function passed to be invoked by another function or by the host. Continuation-passing style: instead of return, you call next(err, value). JS used callbacks for events and I/O before promises. They are just functions; ‘callback’ is a role."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Callback Concept works and name the main pitfall.",
      "answerHint": "Name the role: onSuccess, onError. Document sync vs async invocation. Bind this if passing a method. Prefer promises/async in new APIs, still understand callbacks. Pitfall: Calling the callback twice (bug in the callee) — promises settle once; callbacks do not enforce that."
    },
    {
      "level": "advanced",
      "question": "How would you explain Callback Concept at an interview, including engine/spec details?",
      "answerHint": "Call(callback, thisArg, args) from the callee or host. No spec type ‘Callback’ — user convention. EventTarget uses listeners, a specialized callback list."
    }
  ],
  "pitfalls": [
    "Calling the callback twice (bug in the callee) — promises settle once; callbacks do not enforce that.",
    "Prefer promises/async in new APIs, still understand callbacks."
  ],
  "interview": {
    "expectations": [
      "Explain Callback Concept without mixing it up with a nearby B1.28 — Callbacks topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Call(callback, thisArg, args) from the callee or host."
    ],
    "commonQuestions": [
      "What is Callback Concept?",
      "Why does JavaScript callback concept behave this way?",
      "What is the classic Callback Concept interview trap?"
    ],
    "traps": [
      "Calling the callback twice (bug in the callee) — promises settle once; callbacks do not enforce that."
    ],
    "misconceptions": [
      "The caller cannot wait forever on the stack for a click or a socket. Passing a continuation is the original async style."
    ],
    "strongSignals": [
      "Separates Callback Concept from lookalike APIs and can draw the mental model."
    ]
  }
})
