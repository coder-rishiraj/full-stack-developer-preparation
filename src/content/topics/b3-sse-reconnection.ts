import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Automatic Reconnection",
  "whatIsIt": "Automatic Reconnection is a core Web Platform concept in Server-Sent Events. It belongs to Server-Sent Events (SSE) and EventSource. Understanding Automatic Reconnection helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide automatic reconnection details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Automatic Reconnection as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Automatic Reconnection in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Automatic Reconnection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about automatic reconnection.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Automatic Reconnection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Automatic Reconnection — minimal browser example\nconsole.log('[b3-sse-reconnection]', typeof document);\n// Open DevTools → verify behavior for: Automatic Reconnection\n// Spec reference: developer.mozilla.org (search \"Automatic Reconnection\")",
  "exampleCaption": "Automatic Reconnection — observe in DevTools while this runs",
  "internals": [
    "Automatic Reconnection is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for automatic reconnection can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether automatic reconnection succeeds in production."
  ],
  "takeaways": [
    "Locate Automatic Reconnection in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Automatic Reconnection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Automatic Reconnection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Automatic Reconnection is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Automatic Reconnection: Treat Automatic Reconnection as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Automatic Reconnection in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Automatic Reconnection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Automatic Reconnection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Automatic Reconnection",
      "Automatic Reconnection is a core Web Platform concept in Server-Sent Events."
    ],
    [
      "Mental model",
      "Treat Automatic Reconnection as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Automatic Reconnection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Automatic Reconnection in B3.24 — Server-Sent Events: map it to MDN refer",
      "Connect Automatic Reconnection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Automatic Reconnection in the browser and when do you use it?",
      "answerHint": "Automatic Reconnection is a core Web Platform concept in Server-Sent Events. It belongs to Server-Sent Events (SSE) and EventSource. Understanding Automatic Reconnection helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Automatic Reconnection with a DevTools observation and one pitfall.",
      "answerHint": "Locate Automatic Reconnection in B3.24 — Server-Sent Events: map it to MDN reference docs and observe behavior in DevTools. Connect Automatic Reconnection to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about automatic reconnection. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Automatic Reconnection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Automatic Reconnection in a senior frontend interview?",
      "answerHint": "Automatic Reconnection is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for automatic reconnection can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether automatic reconnection succeeds in production. // Automatic Reconnection — minimal browser example\nconsole.log('[b3-sse-reconnection]', typeof document);\n// Open DevTo"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Automatic Reconnection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Automatic Reconnection at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Automatic Reconnection is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Automatic Reconnection?",
      "When would Automatic Reconnection block rendering or fail cross-origin?",
      "What is the classic Automatic Reconnection interview trap?"
    ],
    "traps": [
      "Interview trap: describing Automatic Reconnection from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide automatic reconnection details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Automatic Reconnection."
    ]
  }
})
