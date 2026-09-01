import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Engine vs Host Environment",
  "whatIsIt": "The engine runs the language. The host (browser, Node) provides the event loop, timers, DOM/fs, and embedding API. Promise jobs are specified; who drains them is the host’s event loop. The same V8 in Chrome and Node feels different because hosts differ.",
  "whyExists": "ECMA-262 cannot specify HTML parsing or TCP. The split lets engines embed in many products.",
  "mentalModel": "Engine = CPU for JS. Host = operating system APIs + scheduler.",
  "how": [
    "Ask: is this in ECMA-262 or a Web/Node spec?",
    "Portable code sticks to language + WinterCG APIs.",
    "Timers are host; Promise.then is language (jobs) drained by host.",
    "Workers are extra hosts/realms."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Assuming setImmediate exists in browsers (Node-ish) or document in Node.",
    "variant": "warning"
  },
  "example": "console.log('engine Math', Math.hypot(3, 4));\nconsole.log('host timeout', typeof setTimeout);\nconsole.log('host fetch', typeof fetch);\nqueueMicrotask(() => console.log('microtask drained by host loop'));\nconsole.log('sync done');\n",
  "exampleCaption": "Language Math vs host timers/fetch vs microtask",
  "internals": [
    "Host hooks: HostEnqueuePromiseJob, HostEnsureCanCompileStrings, etc.",
    "Jobs vs tasks: HTML event loop vs spec Job Queue.",
    "Realms isolate intrinsics; hosts create realms."
  ],
  "takeaways": [
    "Ask: is this in ECMA-262 or a Web/Node spec?",
    "Portable code sticks to language + WinterCG APIs.",
    "Assuming setImmediate exists in browsers (Node-ish) or document in Node.",
    "Host hooks: HostEnqueuePromiseJob, HostEnsureCanCompileStrings, etc."
  ],
  "revision": [
    "Engine vs Host Environment: Engine = CPU for JS. Host = operating system APIs + scheduler.",
    "Ask: is this in ECMA-262 or a Web/Node spec?",
    "Portable code sticks to language + WinterCG APIs.",
    "Timers are host; Promise.then is language (jobs) drained by host.",
    "Trap: Assuming setImmediate exists in browsers (Node-ish) or document in Node."
  ],
  "flashcards": [
    [
      "Engine vs Host Environment",
      "The engine runs the language."
    ],
    [
      "Mental model",
      "Engine = CPU for JS. Host = operating system APIs + scheduler."
    ],
    [
      "Common trap",
      "Assuming setImmediate exists in browsers (Node-ish) or document in Node."
    ],
    [
      "Ask: is this in ECMA-262 or a Web/Node spec?",
      "Portable code sticks to language + WinterCG APIs."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "In one minute, what is Engine vs Host Environment and where does a beginner first see it?",
      "answerHint": "The engine runs the language. The host (browser, Node) provides the event loop, timers, DOM/fs, and embedding API. Promise jobs are specified; who drains them is the host’s event loop. The same V8 in Chrome and Node feels different because hosts differ."
    },
    {
      "level": "intermediate",
      "question": "Walk through how Engine vs Host Environment works and name the main pitfall.",
      "answerHint": "Ask: is this in ECMA-262 or a Web/Node spec? Portable code sticks to language + WinterCG APIs. Timers are host; Promise.then is language (jobs) drained by host. Workers are extra hosts/realms. Pitfall: Assuming setImmediate exists in browsers (Node-ish) or document in Node."
    },
    {
      "level": "advanced",
      "question": "How would you explain Engine vs Host Environment at an interview, including engine/spec details?",
      "answerHint": "Host hooks: HostEnqueuePromiseJob, HostEnsureCanCompileStrings, etc. Jobs vs tasks: HTML event loop vs spec Job Queue. Realms isolate intrinsics; hosts create realms."
    }
  ],
  "pitfalls": [
    "Assuming setImmediate exists in browsers (Node-ish) or document in Node.",
    "Workers are extra hosts/realms."
  ],
  "interview": {
    "expectations": [
      "Explain Engine vs Host Environment without mixing it up with a nearby B1.25 — JavaScript Runtime & Engine topic.",
      "Give a tiny example and the failure mode if the rule is ignored.",
      "Host hooks: HostEnqueuePromiseJob, HostEnsureCanCompileStrings, etc."
    ],
    "commonQuestions": [
      "What is Engine vs Host Environment?",
      "Why does JavaScript engine vs host environment behave this way?",
      "What is the classic Engine vs Host Environment interview trap?"
    ],
    "traps": [
      "Assuming setImmediate exists in browsers (Node-ish) or document in Node."
    ],
    "misconceptions": [
      "ECMA-262 cannot specify HTML parsing or TCP. The split lets engines embed in many products."
    ],
    "strongSignals": [
      "Separates Engine vs Host Environment from lookalike APIs and can draw the mental model."
    ]
  }
})
