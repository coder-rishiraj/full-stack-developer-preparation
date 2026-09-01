import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "URL API",
  "whatIsIt": "URL API is a core Web Platform concept in URL & URL APIs. It belongs to URL anatomy, URL API, and encoding. Understanding URL API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide url api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat URL API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate URL API in B3.31 — URL & URL APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect URL API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about url api.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing URL API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// URL API — minimal browser example\nconsole.log('[b3-url-api]', typeof window);\n// Open DevTools → verify behavior for: URL API\n// Spec reference: developer.mozilla.org (search \"URL API\")",
  "exampleCaption": "URL API — observe in DevTools while this runs",
  "internals": [
    "URL API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for url api can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether url api succeeds in production."
  ],
  "takeaways": [
    "Locate URL API in B3.31 — URL & URL APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect URL API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing URL API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "URL API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "URL API: Treat URL API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate URL API in B3.31 — URL & URL APIs: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect URL API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing URL API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "URL API",
      "URL API is a core Web Platform concept in URL & URL APIs."
    ],
    [
      "Mental model",
      "Treat URL API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing URL API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate URL API in B3.31 — URL & URL APIs: map it to MDN reference docs and obser",
      "Connect URL API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is URL API in the browser and when do you use it?",
      "answerHint": "URL API is a core Web Platform concept in URL & URL APIs. It belongs to URL anatomy, URL API, and encoding. Understanding URL API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain URL API with a DevTools observation and one pitfall.",
      "answerHint": "Locate URL API in B3.31 — URL & URL APIs: map it to MDN reference docs and observe behavior in DevTools. Connect URL API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about url api. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing URL API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain URL API in a senior frontend interview?",
      "answerHint": "URL API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for url api can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether url api succeeds in production. // URL API — minimal browser example\nconsole.log('[b3-url-api]', typeof window);\n// Open DevTools → verify behavior for:"
    }
  ],
  "pitfalls": [
    "Interview trap: describing URL API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain URL API at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "URL API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is URL API?",
      "When would URL API block rendering or fail cross-origin?",
      "What is the classic URL API interview trap?"
    ],
    "traps": [
      "Interview trap: describing URL API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide url api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around URL API."
    ]
  }
})
