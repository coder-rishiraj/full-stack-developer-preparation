import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Page Visibility (document.visibilityState)",
  "whatIsIt": "Page Visibility (document.visibilityState) is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding Page Visibility (document.visibilityState) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide page visibility (document.visibilitystate) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Page Visibility (document.visibilityState) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Page Visibility (document.visibilityState) in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Page Visibility (document.visibilityState) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about page visibility (document.visibilitystate).",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Page Visibility (document.visibilityState) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Page Visibility (document.visibilityState) — minimal browser example\nconsole.log('[b3-page-visibility]', typeof document);\n// Open DevTools → verify behavior for: Page Visibility (document.visibilityState)\n// Spec reference: developer.mozilla.org (search \"Page Visibility (document.visibilityState)\")",
  "exampleCaption": "Page Visibility (document.visibilityState) — observe in DevTools while this runs",
  "internals": [
    "Page Visibility (document.visibilityState) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for page visibility (document.visibilitystate) can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether page visibility (document.visibilitystate) succeeds in production."
  ],
  "takeaways": [
    "Locate Page Visibility (document.visibilityState) in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Page Visibility (document.visibilityState) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Page Visibility (document.visibilityState) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Page Visibility (document.visibilityState) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Page Visibility (document.visibilityState): Treat Page Visibility (document.visibilityState) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Page Visibility (document.visibilityState) in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Page Visibility (document.visibilityState) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Page Visibility (document.visibilityState) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Page Visibility (document.visibilityState)",
      "Page Visibility (document.visibilityState) is a core Web Platform concept in Navigation & SPA Browser Behavior."
    ],
    [
      "Mental model",
      "Treat Page Visibility (document.visibilityState) as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Page Visibility (document.visibilityState) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Page Visibility (document.visibilityState) in B3.29 — Navigation & SPA Br",
      "Connect Page Visibility (document.visibilityState) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Page Visibility (document.visibilityState) in the browser and when do you use it?",
      "answerHint": "Page Visibility (document.visibilityState) is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding Page Visibility (document.visibilityState) helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Page Visibility (document.visibilityState) with a DevTools observation and one pitfall.",
      "answerHint": "Locate Page Visibility (document.visibilityState) in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools. Connect Page Visibility (document.visibilityState) to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about page visibility (document.visibilitystate). Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Page Visibility (document.visibilityState) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Page Visibility (document.visibilityState) in a senior frontend interview?",
      "answerHint": "Page Visibility (document.visibilityState) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for page visibility (document.visibilitystate) can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether page visibility (document.visibilitystate) succeeds in production. // Page Visibility (document.visibilityState) — minimal browser example\nconsole.log('[b3-page-visibility]', typeof docum"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Page Visibility (document.visibilityState) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Page Visibility (document.visibilityState) at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Page Visibility (document.visibilityState) is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Page Visibility (document.visibilityState)?",
      "When would Page Visibility (document.visibilityState) block rendering or fail cross-origin?",
      "What is the classic Page Visibility (document.visibilityState) interview trap?"
    ],
    "traps": [
      "Interview trap: describing Page Visibility (document.visibilityState) from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide page visibility (document.visibilitystate) details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Page Visibility (document.visibilityState)."
    ]
  }
})
