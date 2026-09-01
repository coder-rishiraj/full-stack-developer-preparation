import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Page Lifecycle API",
  "whatIsIt": "Page Lifecycle API is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding Page Lifecycle API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide page lifecycle api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Page Lifecycle API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Page Lifecycle API in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Page Lifecycle API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about page lifecycle api.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Page Lifecycle API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Page Lifecycle API — minimal browser example\nconsole.log('[b3-page-lifecycle]', typeof window);\n// Open DevTools → verify behavior for: Page Lifecycle API\n// Spec reference: developer.mozilla.org (search \"Page Lifecycle API\")",
  "exampleCaption": "Page Lifecycle API — observe in DevTools while this runs",
  "internals": [
    "Page Lifecycle API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for page lifecycle api can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether page lifecycle api succeeds in production."
  ],
  "takeaways": [
    "Locate Page Lifecycle API in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Page Lifecycle API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Page Lifecycle API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Page Lifecycle API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Page Lifecycle API: Treat Page Lifecycle API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Page Lifecycle API in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Page Lifecycle API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Page Lifecycle API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Page Lifecycle API",
      "Page Lifecycle API is a core Web Platform concept in Navigation & SPA Browser Behavior."
    ],
    [
      "Mental model",
      "Treat Page Lifecycle API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Page Lifecycle API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Page Lifecycle API in B3.29 — Navigation & SPA Browser Behavior: map it t",
      "Connect Page Lifecycle API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Page Lifecycle API in the browser and when do you use it?",
      "answerHint": "Page Lifecycle API is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding Page Lifecycle API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Page Lifecycle API with a DevTools observation and one pitfall.",
      "answerHint": "Locate Page Lifecycle API in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools. Connect Page Lifecycle API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about page lifecycle api. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Page Lifecycle API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Page Lifecycle API in a senior frontend interview?",
      "answerHint": "Page Lifecycle API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for page lifecycle api can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether page lifecycle api succeeds in production. // Page Lifecycle API — minimal browser example\nconsole.log('[b3-page-lifecycle]', typeof window);\n// Open DevTools → ve"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Page Lifecycle API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Page Lifecycle API at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Page Lifecycle API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Page Lifecycle API?",
      "When would Page Lifecycle API block rendering or fail cross-origin?",
      "What is the classic Page Lifecycle API interview trap?"
    ],
    "traps": [
      "Interview trap: describing Page Lifecycle API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide page lifecycle api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Page Lifecycle API."
    ]
  }
})
