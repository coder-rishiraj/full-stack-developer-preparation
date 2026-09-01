import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "EventSource API",
  "whatIsIt": "EventSource API is a core Web Platform concept in Server-Sent Events. It belongs to Server-Sent Events (SSE) and EventSource. Understanding EventSource API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide eventsource api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat EventSource API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate EventSource API in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect EventSource API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about eventsource api.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing EventSource API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// EventSource API — minimal browser example\nconsole.log('[b3-event-source]', typeof window);\n// Open DevTools → verify behavior for: EventSource API\n// Spec reference: developer.mozilla.org (search \"EventSource API\")",
  "exampleCaption": "EventSource API — observe in DevTools while this runs",
  "internals": [
    "EventSource API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for eventsource api can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether eventsource api succeeds in production."
  ],
  "takeaways": [
    "Locate EventSource API in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect EventSource API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing EventSource API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "EventSource API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "EventSource API: Treat EventSource API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate EventSource API in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect EventSource API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing EventSource API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "EventSource API",
      "EventSource API is a core Web Platform concept in Server-Sent Events."
    ],
    [
      "Mental model",
      "Treat EventSource API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing EventSource API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate EventSource API in B3.24 — Server-Sent Events: map it to MDN reference do",
      "Connect EventSource API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is EventSource API in the browser and when do you use it?",
      "answerHint": "EventSource API is a core Web Platform concept in Server-Sent Events. It belongs to Server-Sent Events (SSE) and EventSource. Understanding EventSource API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain EventSource API with a DevTools observation and one pitfall.",
      "answerHint": "Locate EventSource API in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools. Connect EventSource API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about eventsource api. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing EventSource API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain EventSource API in a senior frontend interview?",
      "answerHint": "EventSource API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for eventsource api can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether eventsource api succeeds in production. // EventSource API — minimal browser example\nconsole.log('[b3-event-source]', typeof window);\n// Open DevTools → verify "
    }
  ],
  "pitfalls": [
    "Interview trap: describing EventSource API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain EventSource API at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "EventSource API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is EventSource API?",
      "When would EventSource API block rendering or fail cross-origin?",
      "What is the classic EventSource API interview trap?"
    ],
    "traps": [
      "Interview trap: describing EventSource API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide eventsource api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around EventSource API."
    ]
  }
})
