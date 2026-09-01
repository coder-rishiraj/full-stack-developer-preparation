import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "SSE Use Cases",
  "whatIsIt": "SSE Use Cases is a core Web Platform concept in Server-Sent Events. It belongs to Server-Sent Events (SSE) and EventSource. Understanding SSE Use Cases helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide sse use cases details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat SSE Use Cases as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate SSE Use Cases in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SSE Use Cases to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sse use cases.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing SSE Use Cases from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// SSE Use Cases — minimal browser example\nconsole.log('[b3-sse-use-cases]', typeof document);\n// Open DevTools → verify behavior for: SSE Use Cases\n// Spec reference: developer.mozilla.org (search \"SSE Use Cases\")",
  "exampleCaption": "SSE Use Cases — observe in DevTools while this runs",
  "internals": [
    "SSE Use Cases is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for sse use cases can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether sse use cases succeeds in production."
  ],
  "takeaways": [
    "Locate SSE Use Cases in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SSE Use Cases to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing SSE Use Cases from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "SSE Use Cases is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "SSE Use Cases: Treat SSE Use Cases as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate SSE Use Cases in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SSE Use Cases to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing SSE Use Cases from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "SSE Use Cases",
      "SSE Use Cases is a core Web Platform concept in Server-Sent Events."
    ],
    [
      "Mental model",
      "Treat SSE Use Cases as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing SSE Use Cases from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate SSE Use Cases in B3.24 — Server-Sent Events: map it to MDN reference docs",
      "Connect SSE Use Cases to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is SSE Use Cases in the browser and when do you use it?",
      "answerHint": "SSE Use Cases is a core Web Platform concept in Server-Sent Events. It belongs to Server-Sent Events (SSE) and EventSource. Understanding SSE Use Cases helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain SSE Use Cases with a DevTools observation and one pitfall.",
      "answerHint": "Locate SSE Use Cases in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools. Connect SSE Use Cases to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sse use cases. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing SSE Use Cases from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain SSE Use Cases in a senior frontend interview?",
      "answerHint": "SSE Use Cases is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for sse use cases can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether sse use cases succeeds in production. // SSE Use Cases — minimal browser example\nconsole.log('[b3-sse-use-cases]', typeof document);\n// Open DevTools → verify"
    }
  ],
  "pitfalls": [
    "Interview trap: describing SSE Use Cases from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain SSE Use Cases at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "SSE Use Cases is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is SSE Use Cases?",
      "When would SSE Use Cases block rendering or fail cross-origin?",
      "What is the classic SSE Use Cases interview trap?"
    ],
    "traps": [
      "Interview trap: describing SSE Use Cases from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide sse use cases details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around SSE Use Cases."
    ]
  }
})
