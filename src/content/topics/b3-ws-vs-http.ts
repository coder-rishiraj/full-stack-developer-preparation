import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "WebSockets vs HTTP Polling",
  "whatIsIt": "WebSockets vs HTTP Polling is a core Web Platform concept in WebSockets. It belongs to WebSocket connections and real-time messaging. Understanding WebSockets vs HTTP Polling helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide websockets vs http polling details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat WebSockets vs HTTP Polling as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate WebSockets vs HTTP Polling in B3.23 — WebSockets: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect WebSockets vs HTTP Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about websockets vs http polling.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing WebSockets vs HTTP Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// WebSockets vs HTTP Polling — minimal browser example\nconsole.log('[b3-ws-vs-http]', typeof document);\n// Open DevTools → verify behavior for: WebSockets vs HTTP Polling\n// Spec reference: developer.mozilla.org (search \"WebSockets vs HTTP Polling\")",
  "exampleCaption": "WebSockets vs HTTP Polling — observe in DevTools while this runs",
  "internals": [
    "WebSockets vs HTTP Polling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for websockets vs http polling can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether websockets vs http polling succeeds in production."
  ],
  "takeaways": [
    "Locate WebSockets vs HTTP Polling in B3.23 — WebSockets: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect WebSockets vs HTTP Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing WebSockets vs HTTP Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "WebSockets vs HTTP Polling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "WebSockets vs HTTP Polling: Treat WebSockets vs HTTP Polling as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate WebSockets vs HTTP Polling in B3.23 — WebSockets: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect WebSockets vs HTTP Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing WebSockets vs HTTP Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "WebSockets vs HTTP Polling",
      "WebSockets vs HTTP Polling is a core Web Platform concept in WebSockets."
    ],
    [
      "Mental model",
      "Treat WebSockets vs HTTP Polling as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing WebSockets vs HTTP Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate WebSockets vs HTTP Polling in B3.23 — WebSockets: map it to MDN reference",
      "Connect WebSockets vs HTTP Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is WebSockets vs HTTP Polling in the browser and when do you use it?",
      "answerHint": "WebSockets vs HTTP Polling is a core Web Platform concept in WebSockets. It belongs to WebSocket connections and real-time messaging. Understanding WebSockets vs HTTP Polling helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain WebSockets vs HTTP Polling with a DevTools observation and one pitfall.",
      "answerHint": "Locate WebSockets vs HTTP Polling in B3.23 — WebSockets: map it to MDN reference docs and observe behavior in DevTools. Connect WebSockets vs HTTP Polling to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about websockets vs http polling. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing WebSockets vs HTTP Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain WebSockets vs HTTP Polling in a senior frontend interview?",
      "answerHint": "WebSockets vs HTTP Polling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for websockets vs http polling can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether websockets vs http polling succeeds in production. // WebSockets vs HTTP Polling — minimal browser example\nconsole.log('[b3-ws-vs-http]', typeof document);\n// Open DevTool"
    }
  ],
  "pitfalls": [
    "Interview trap: describing WebSockets vs HTTP Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain WebSockets vs HTTP Polling at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "WebSockets vs HTTP Polling is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is WebSockets vs HTTP Polling?",
      "When would WebSockets vs HTTP Polling block rendering or fail cross-origin?",
      "What is the classic WebSockets vs HTTP Polling interview trap?"
    ],
    "traps": [
      "Interview trap: describing WebSockets vs HTTP Polling from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide websockets vs http polling details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around WebSockets vs HTTP Polling."
    ]
  }
})
