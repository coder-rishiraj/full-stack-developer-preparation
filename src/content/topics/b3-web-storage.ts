import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Web Storage API",
  "whatIsIt": "Web Storage API is a core Web Platform concept in Web Storage. It belongs to localStorage, sessionStorage, and storage trade-offs. Understanding Web Storage API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide web storage api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Web Storage API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Web Storage API in B3.16 — Web Storage: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Web Storage API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about web storage api.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Web Storage API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Web Storage API — minimal browser example\nconsole.log('[b3-web-storage]', typeof window);\n// Open DevTools → verify behavior for: Web Storage API\n// Spec reference: developer.mozilla.org (search \"Web Storage API\")",
  "exampleCaption": "Web Storage API — observe in DevTools while this runs",
  "internals": [
    "Web Storage API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for web storage api can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether web storage api succeeds in production."
  ],
  "takeaways": [
    "Locate Web Storage API in B3.16 — Web Storage: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Web Storage API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Web Storage API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Web Storage API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Web Storage API: Treat Web Storage API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Web Storage API in B3.16 — Web Storage: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Web Storage API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Web Storage API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Web Storage API",
      "Web Storage API is a core Web Platform concept in Web Storage."
    ],
    [
      "Mental model",
      "Treat Web Storage API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Web Storage API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Web Storage API in B3.16 — Web Storage: map it to MDN reference docs and ",
      "Connect Web Storage API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Web Storage API in the browser and when do you use it?",
      "answerHint": "Web Storage API is a core Web Platform concept in Web Storage. It belongs to localStorage, sessionStorage, and storage trade-offs. Understanding Web Storage API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Web Storage API with a DevTools observation and one pitfall.",
      "answerHint": "Locate Web Storage API in B3.16 — Web Storage: map it to MDN reference docs and observe behavior in DevTools. Connect Web Storage API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about web storage api. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Web Storage API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Web Storage API in a senior frontend interview?",
      "answerHint": "Web Storage API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for web storage api can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether web storage api succeeds in production. // Web Storage API — minimal browser example\nconsole.log('[b3-web-storage]', typeof window);\n// Open DevTools → verify b"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Web Storage API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Web Storage API at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Web Storage API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Web Storage API?",
      "When would Web Storage API block rendering or fail cross-origin?",
      "What is the classic Web Storage API interview trap?"
    ],
    "traps": [
      "Interview trap: describing Web Storage API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide web storage api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Web Storage API."
    ]
  }
})
