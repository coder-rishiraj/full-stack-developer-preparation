import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "SSE vs WebSockets",
  "whatIsIt": "SSE vs WebSockets is a core Web Platform concept in Server-Sent Events. It belongs to Server-Sent Events (SSE) and EventSource. Understanding SSE vs WebSockets helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide sse vs websockets details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat SSE vs WebSockets as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate SSE vs WebSockets in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SSE vs WebSockets to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sse vs websockets.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing SSE vs WebSockets from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// SSE vs WebSockets — minimal browser example\nconsole.log('[b3-sse-vs-websockets]', typeof document);\n// Open DevTools → verify behavior for: SSE vs WebSockets\n// Spec reference: developer.mozilla.org (search \"SSE vs WebSockets\")",
  "exampleCaption": "SSE vs WebSockets — observe in DevTools while this runs",
  "internals": [
    "SSE vs WebSockets is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for sse vs websockets can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether sse vs websockets succeeds in production."
  ],
  "takeaways": [
    "Locate SSE vs WebSockets in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SSE vs WebSockets to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing SSE vs WebSockets from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "SSE vs WebSockets is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "SSE vs WebSockets: Treat SSE vs WebSockets as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate SSE vs WebSockets in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SSE vs WebSockets to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing SSE vs WebSockets from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "SSE vs WebSockets",
      "SSE vs WebSockets is a core Web Platform concept in Server-Sent Events."
    ],
    [
      "Mental model",
      "Treat SSE vs WebSockets as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing SSE vs WebSockets from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate SSE vs WebSockets in B3.24 — Server-Sent Events: map it to MDN reference ",
      "Connect SSE vs WebSockets to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is SSE vs WebSockets in the browser and when do you use it?",
      "answerHint": "SSE vs WebSockets is a core Web Platform concept in Server-Sent Events. It belongs to Server-Sent Events (SSE) and EventSource. Understanding SSE vs WebSockets helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain SSE vs WebSockets with a DevTools observation and one pitfall.",
      "answerHint": "Locate SSE vs WebSockets in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools. Connect SSE vs WebSockets to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sse vs websockets. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing SSE vs WebSockets from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain SSE vs WebSockets in a senior frontend interview?",
      "answerHint": "SSE vs WebSockets is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for sse vs websockets can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether sse vs websockets succeeds in production. // SSE vs WebSockets — minimal browser example\nconsole.log('[b3-sse-vs-websockets]', typeof document);\n// Open DevTools "
    }
  ],
  "pitfalls": [
    "Interview trap: describing SSE vs WebSockets from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain SSE vs WebSockets at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "SSE vs WebSockets is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is SSE vs WebSockets?",
      "When would SSE vs WebSockets block rendering or fail cross-origin?",
      "What is the classic SSE vs WebSockets interview trap?"
    ],
    "traps": [
      "Interview trap: describing SSE vs WebSockets from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide sse vs websockets details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around SSE vs WebSockets."
    ]
  }
})
