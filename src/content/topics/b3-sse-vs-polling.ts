import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "SSE vs Long Polling",
  "whatIsIt": "SSE vs Long Polling is a core Web Platform concept in Server-Sent Events. It belongs to Server-Sent Events (SSE) and EventSource. Understanding SSE vs Long Polling helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide sse vs long polling details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat SSE vs Long Polling as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate SSE vs Long Polling in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SSE vs Long Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sse vs long polling.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing SSE vs Long Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// SSE vs Long Polling — minimal browser example\nconsole.log('[b3-sse-vs-polling]', typeof document);\n// Open DevTools → verify behavior for: SSE vs Long Polling\n// Spec reference: developer.mozilla.org (search \"SSE vs Long Polling\")",
  "exampleCaption": "SSE vs Long Polling — observe in DevTools while this runs",
  "internals": [
    "SSE vs Long Polling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for sse vs long polling can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether sse vs long polling succeeds in production."
  ],
  "takeaways": [
    "Locate SSE vs Long Polling in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SSE vs Long Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing SSE vs Long Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "SSE vs Long Polling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "SSE vs Long Polling: Treat SSE vs Long Polling as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate SSE vs Long Polling in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SSE vs Long Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing SSE vs Long Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "SSE vs Long Polling",
      "SSE vs Long Polling is a core Web Platform concept in Server-Sent Events."
    ],
    [
      "Mental model",
      "Treat SSE vs Long Polling as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing SSE vs Long Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate SSE vs Long Polling in B3.24 — Server-Sent Events: map it to MDN referenc",
      "Connect SSE vs Long Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is SSE vs Long Polling in the browser and when do you use it?",
      "answerHint": "SSE vs Long Polling is a core Web Platform concept in Server-Sent Events. It belongs to Server-Sent Events (SSE) and EventSource. Understanding SSE vs Long Polling helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain SSE vs Long Polling with a DevTools observation and one pitfall.",
      "answerHint": "Locate SSE vs Long Polling in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools. Connect SSE vs Long Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sse vs long polling. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing SSE vs Long Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain SSE vs Long Polling in a senior frontend interview?",
      "answerHint": "SSE vs Long Polling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for sse vs long polling can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether sse vs long polling succeeds in production. // SSE vs Long Polling — minimal browser example\nconsole.log('[b3-sse-vs-polling]', typeof document);\n// Open DevTools →"
    }
  ],
  "pitfalls": [
    "Interview trap: describing SSE vs Long Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain SSE vs Long Polling at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "SSE vs Long Polling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is SSE vs Long Polling?",
      "When would SSE vs Long Polling block rendering or fail cross-origin?",
      "What is the classic SSE vs Long Polling interview trap?"
    ],
    "traps": [
      "Interview trap: describing SSE vs Long Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide sse vs long polling details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around SSE vs Long Polling."
    ]
  }
})
