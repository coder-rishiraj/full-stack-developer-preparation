import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Simple vs Non-Simple Requests",
  "whatIsIt": "Simple vs Non-Simple Requests is a core Web Platform concept in CORS. It belongs to Cross-Origin Resource Sharing (CORS) and preflight. Understanding Simple vs Non-Simple Requests helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide simple vs non-simple requests details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Simple vs Non-Simple Requests as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Simple vs Non-Simple Requests in B3.14 — CORS: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Simple vs Non-Simple Requests to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about simple vs non-simple requests.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Simple vs Non-Simple Requests from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Simple vs Non-Simple Requests — minimal browser example\nconsole.log('[b3-cors-simple-requests]', typeof document);\n// Open DevTools → verify behavior for: Simple vs Non-Simple Requests\n// Spec reference: developer.mozilla.org (search \"Simple vs Non-Simple Requests\")",
  "exampleCaption": "Simple vs Non-Simple Requests — observe in DevTools while this runs",
  "internals": [
    "Simple vs Non-Simple Requests is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for simple vs non-simple requests can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether simple vs non-simple requests succeeds in production."
  ],
  "takeaways": [
    "Locate Simple vs Non-Simple Requests in B3.14 — CORS: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Simple vs Non-Simple Requests to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Simple vs Non-Simple Requests from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Simple vs Non-Simple Requests is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Simple vs Non-Simple Requests: Treat Simple vs Non-Simple Requests as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Simple vs Non-Simple Requests in B3.14 — CORS: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Simple vs Non-Simple Requests to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Simple vs Non-Simple Requests from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Simple vs Non-Simple Requests",
      "Simple vs Non-Simple Requests is a core Web Platform concept in CORS."
    ],
    [
      "Mental model",
      "Treat Simple vs Non-Simple Requests as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Simple vs Non-Simple Requests from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Simple vs Non-Simple Requests in B3.14 — CORS: map it to MDN reference do",
      "Connect Simple vs Non-Simple Requests to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Simple vs Non-Simple Requests in the browser and when do you use it?",
      "answerHint": "Simple vs Non-Simple Requests is a core Web Platform concept in CORS. It belongs to Cross-Origin Resource Sharing (CORS) and preflight. Understanding Simple vs Non-Simple Requests helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Simple vs Non-Simple Requests with a DevTools observation and one pitfall.",
      "answerHint": "Locate Simple vs Non-Simple Requests in B3.14 — CORS: map it to MDN reference docs and observe behavior in DevTools. Connect Simple vs Non-Simple Requests to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about simple vs non-simple requests. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Simple vs Non-Simple Requests from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Simple vs Non-Simple Requests in a senior frontend interview?",
      "answerHint": "Simple vs Non-Simple Requests is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for simple vs non-simple requests can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether simple vs non-simple requests succeeds in production. // Simple vs Non-Simple Requests — minimal browser example\nconsole.log('[b3-cors-simple-requests]', typeof document);\n//"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Simple vs Non-Simple Requests from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Simple vs Non-Simple Requests at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Simple vs Non-Simple Requests is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Simple vs Non-Simple Requests?",
      "When would Simple vs Non-Simple Requests block rendering or fail cross-origin?",
      "What is the classic Simple vs Non-Simple Requests interview trap?"
    ],
    "traps": [
      "Interview trap: describing Simple vs Non-Simple Requests from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide simple vs non-simple requests details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Simple vs Non-Simple Requests."
    ]
  }
})
