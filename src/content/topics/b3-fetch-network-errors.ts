import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Network vs HTTP Errors",
  "whatIsIt": "Network vs HTTP Errors is a core Web Platform concept in Fetch API. It belongs to the Fetch API for network requests in the browser. Understanding Network vs HTTP Errors helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide network vs http errors details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Network vs HTTP Errors as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Network vs HTTP Errors in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Network vs HTTP Errors to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about network vs http errors.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Network vs HTTP Errors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Network vs HTTP Errors — minimal browser example\nconsole.log('[b3-fetch-network-errors]', typeof document);\n// Open DevTools → verify behavior for: Network vs HTTP Errors\n// Spec reference: developer.mozilla.org (search \"Network vs HTTP Errors\")",
  "exampleCaption": "Network vs HTTP Errors — observe in DevTools while this runs",
  "internals": [
    "Network vs HTTP Errors is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for network vs http errors can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether network vs http errors succeeds in production."
  ],
  "takeaways": [
    "Locate Network vs HTTP Errors in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Network vs HTTP Errors to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Network vs HTTP Errors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Network vs HTTP Errors is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Network vs HTTP Errors: Treat Network vs HTTP Errors as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Network vs HTTP Errors in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Network vs HTTP Errors to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Network vs HTTP Errors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Network vs HTTP Errors",
      "Network vs HTTP Errors is a core Web Platform concept in Fetch API."
    ],
    [
      "Mental model",
      "Treat Network vs HTTP Errors as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Network vs HTTP Errors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Network vs HTTP Errors in B3.11 — Fetch API: map it to MDN reference docs",
      "Connect Network vs HTTP Errors to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Network vs HTTP Errors in the browser and when do you use it?",
      "answerHint": "Network vs HTTP Errors is a core Web Platform concept in Fetch API. It belongs to the Fetch API for network requests in the browser. Understanding Network vs HTTP Errors helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Network vs HTTP Errors with a DevTools observation and one pitfall.",
      "answerHint": "Locate Network vs HTTP Errors in B3.11 — Fetch API: map it to MDN reference docs and observe behavior in DevTools. Connect Network vs HTTP Errors to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about network vs http errors. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Network vs HTTP Errors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Network vs HTTP Errors in a senior frontend interview?",
      "answerHint": "Network vs HTTP Errors is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for network vs http errors can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether network vs http errors succeeds in production. // Network vs HTTP Errors — minimal browser example\nconsole.log('[b3-fetch-network-errors]', typeof document);\n// Open D"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Network vs HTTP Errors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Network vs HTTP Errors at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Network vs HTTP Errors is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Network vs HTTP Errors?",
      "When would Network vs HTTP Errors block rendering or fail cross-origin?",
      "What is the classic Network vs HTTP Errors interview trap?"
    ],
    "traps": [
      "Interview trap: describing Network vs HTTP Errors from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide network vs http errors details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Network vs HTTP Errors."
    ]
  }
})
