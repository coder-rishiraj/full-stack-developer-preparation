import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "HttpOnly",
  "whatIsIt": "HttpOnly is a core Web Platform concept in Cookies. It belongs to HTTP cookies, attributes, and security implications. Understanding HttpOnly helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide httponly details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat HttpOnly as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate HttpOnly in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HttpOnly to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about httponly.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing HttpOnly from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// HttpOnly — minimal browser example\nconsole.log('[b3-cookie-httponly]', typeof document);\n// Open DevTools → verify behavior for: HttpOnly\n// Spec reference: developer.mozilla.org (search \"HttpOnly\")",
  "exampleCaption": "HttpOnly — observe in DevTools while this runs",
  "internals": [
    "HttpOnly is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for httponly can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether httponly succeeds in production."
  ],
  "takeaways": [
    "Locate HttpOnly in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HttpOnly to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing HttpOnly from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "HttpOnly is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "HttpOnly: Treat HttpOnly as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate HttpOnly in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect HttpOnly to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing HttpOnly from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "HttpOnly",
      "HttpOnly is a core Web Platform concept in Cookies."
    ],
    [
      "Mental model",
      "Treat HttpOnly as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing HttpOnly from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate HttpOnly in B3.15 — Cookies: map it to MDN reference docs and observe beh",
      "Connect HttpOnly to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is HttpOnly in the browser and when do you use it?",
      "answerHint": "HttpOnly is a core Web Platform concept in Cookies. It belongs to HTTP cookies, attributes, and security implications. Understanding HttpOnly helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain HttpOnly with a DevTools observation and one pitfall.",
      "answerHint": "Locate HttpOnly in B3.15 — Cookies: map it to MDN reference docs and observe behavior in DevTools. Connect HttpOnly to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about httponly. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing HttpOnly from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain HttpOnly in a senior frontend interview?",
      "answerHint": "HttpOnly is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for httponly can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether httponly succeeds in production. // HttpOnly — minimal browser example\nconsole.log('[b3-cookie-httponly]', typeof document);\n// Open DevTools → verify be"
    }
  ],
  "pitfalls": [
    "Interview trap: describing HttpOnly from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain HttpOnly at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "HttpOnly is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is HttpOnly?",
      "When would HttpOnly block rendering or fail cross-origin?",
      "What is the classic HttpOnly interview trap?"
    ],
    "traps": [
      "Interview trap: describing HttpOnly from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide httponly details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around HttpOnly."
    ]
  }
})
