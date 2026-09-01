import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "SSE Event Format",
  "whatIsIt": "SSE Event Format is a core Web Platform concept in Server-Sent Events. It belongs to Server-Sent Events (SSE) and EventSource. Understanding SSE Event Format helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide sse event format details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat SSE Event Format as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate SSE Event Format in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SSE Event Format to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sse event format.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing SSE Event Format from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// SSE Event Format — minimal browser example\nconsole.log('[b3-sse-event-format]', typeof window);\n// Open DevTools → verify behavior for: SSE Event Format\n// Spec reference: developer.mozilla.org (search \"SSE Event Format\")",
  "exampleCaption": "SSE Event Format — observe in DevTools while this runs",
  "internals": [
    "SSE Event Format is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for sse event format can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether sse event format succeeds in production."
  ],
  "takeaways": [
    "Locate SSE Event Format in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SSE Event Format to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing SSE Event Format from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "SSE Event Format is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "SSE Event Format: Treat SSE Event Format as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate SSE Event Format in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect SSE Event Format to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing SSE Event Format from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "SSE Event Format",
      "SSE Event Format is a core Web Platform concept in Server-Sent Events."
    ],
    [
      "Mental model",
      "Treat SSE Event Format as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing SSE Event Format from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate SSE Event Format in B3.24 — Server-Sent Events: map it to MDN reference d",
      "Connect SSE Event Format to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is SSE Event Format in the browser and when do you use it?",
      "answerHint": "SSE Event Format is a core Web Platform concept in Server-Sent Events. It belongs to Server-Sent Events (SSE) and EventSource. Understanding SSE Event Format helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain SSE Event Format with a DevTools observation and one pitfall.",
      "answerHint": "Locate SSE Event Format in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools. Connect SSE Event Format to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about sse event format. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing SSE Event Format from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain SSE Event Format in a senior frontend interview?",
      "answerHint": "SSE Event Format is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for sse event format can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether sse event format succeeds in production. // SSE Event Format — minimal browser example\nconsole.log('[b3-sse-event-format]', typeof window);\n// Open DevTools → ve"
    }
  ],
  "pitfalls": [
    "Interview trap: describing SSE Event Format from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain SSE Event Format at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "SSE Event Format is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is SSE Event Format?",
      "When would SSE Event Format block rendering or fail cross-origin?",
      "What is the classic SSE Event Format interview trap?"
    ],
    "traps": [
      "Interview trap: describing SSE Event Format from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide sse event format details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around SSE Event Format."
    ]
  }
})
