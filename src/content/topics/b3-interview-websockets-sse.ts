import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "WebSockets vs SSE vs Polling",
  "whatIsIt": "WebSockets vs SSE vs Polling is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding WebSockets vs SSE vs Polling helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide websockets vs sse vs polling details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat WebSockets vs SSE vs Polling as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate WebSockets vs SSE vs Polling in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect WebSockets vs SSE vs Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about websockets vs sse vs polling.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing WebSockets vs SSE vs Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// WebSockets vs SSE vs Polling — minimal browser example\nconsole.log('[b3-interview-websockets-sse]', typeof document);\n// Open DevTools → verify behavior for: WebSockets vs SSE vs Polling\n// Spec reference: developer.mozilla.org (search \"WebSockets vs SSE vs Polling\")",
  "exampleCaption": "WebSockets vs SSE vs Polling — observe in DevTools while this runs",
  "internals": [
    "WebSockets vs SSE vs Polling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for websockets vs sse vs polling can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether websockets vs sse vs polling succeeds in production."
  ],
  "takeaways": [
    "Locate WebSockets vs SSE vs Polling in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect WebSockets vs SSE vs Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing WebSockets vs SSE vs Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "WebSockets vs SSE vs Polling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "WebSockets vs SSE vs Polling: Treat WebSockets vs SSE vs Polling as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate WebSockets vs SSE vs Polling in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect WebSockets vs SSE vs Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing WebSockets vs SSE vs Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "WebSockets vs SSE vs Polling",
      "WebSockets vs SSE vs Polling is a core Web Platform concept in Browser Interview Scenarios."
    ],
    [
      "Mental model",
      "Treat WebSockets vs SSE vs Polling as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing WebSockets vs SSE vs Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate WebSockets vs SSE vs Polling in B3.37 — Browser Interview Scenarios: map ",
      "Connect WebSockets vs SSE vs Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is WebSockets vs SSE vs Polling in the browser and when do you use it?",
      "answerHint": "WebSockets vs SSE vs Polling is a core Web Platform concept in Browser Interview Scenarios. It belongs to senior frontend browser interview reasoning. Understanding WebSockets vs SSE vs Polling helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain WebSockets vs SSE vs Polling with a DevTools observation and one pitfall.",
      "answerHint": "Locate WebSockets vs SSE vs Polling in B3.37 — Browser Interview Scenarios: map it to MDN reference docs and observe behavior in DevTools. Connect WebSockets vs SSE vs Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about websockets vs sse vs polling. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing WebSockets vs SSE vs Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain WebSockets vs SSE vs Polling in a senior frontend interview?",
      "answerHint": "WebSockets vs SSE vs Polling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for websockets vs sse vs polling can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether websockets vs sse vs polling succeeds in production. // WebSockets vs SSE vs Polling — minimal browser example\nconsole.log('[b3-interview-websockets-sse]', typeof document);"
    }
  ],
  "pitfalls": [
    "Interview trap: describing WebSockets vs SSE vs Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain WebSockets vs SSE vs Polling at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "WebSockets vs SSE vs Polling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is WebSockets vs SSE vs Polling?",
      "When would WebSockets vs SSE vs Polling block rendering or fail cross-origin?",
      "What is the classic WebSockets vs SSE vs Polling interview trap?"
    ],
    "traps": [
      "Interview trap: describing WebSockets vs SSE vs Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide websockets vs sse vs polling details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around WebSockets vs SSE vs Polling."
    ]
  }
})
