import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "History API in SPAs",
  "whatIsIt": "History API in SPAs is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding History API in SPAs helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide history api in spas details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat History API in SPAs as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate History API in SPAs in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect History API in SPAs to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about history api in spas.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing History API in SPAs from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// History API in SPAs — minimal browser example\nconsole.log('[b3-history-api-spa]', typeof window);\n// Open DevTools → verify behavior for: History API in SPAs\n// Spec reference: developer.mozilla.org (search \"History API in SPAs\")",
  "exampleCaption": "History API in SPAs — observe in DevTools while this runs",
  "internals": [
    "History API in SPAs is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for history api in spas can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether history api in spas succeeds in production."
  ],
  "takeaways": [
    "Locate History API in SPAs in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect History API in SPAs to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing History API in SPAs from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "History API in SPAs is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "History API in SPAs: Treat History API in SPAs as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate History API in SPAs in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect History API in SPAs to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing History API in SPAs from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "History API in SPAs",
      "History API in SPAs is a core Web Platform concept in Navigation & SPA Browser Behavior."
    ],
    [
      "Mental model",
      "Treat History API in SPAs as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing History API in SPAs from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate History API in SPAs in B3.29 — Navigation & SPA Browser Behavior: map it ",
      "Connect History API in SPAs to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is History API in SPAs in the browser and when do you use it?",
      "answerHint": "History API in SPAs is a core Web Platform concept in Navigation & SPA Browser Behavior. It belongs to History API, SPA navigation, and browser history stack. Understanding History API in SPAs helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain History API in SPAs with a DevTools observation and one pitfall.",
      "answerHint": "Locate History API in SPAs in B3.29 — Navigation & SPA Browser Behavior: map it to MDN reference docs and observe behavior in DevTools. Connect History API in SPAs to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about history api in spas. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing History API in SPAs from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain History API in SPAs in a senior frontend interview?",
      "answerHint": "History API in SPAs is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for history api in spas can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether history api in spas succeeds in production. // History API in SPAs — minimal browser example\nconsole.log('[b3-history-api-spa]', typeof window);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing History API in SPAs from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain History API in SPAs at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "History API in SPAs is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is History API in SPAs?",
      "When would History API in SPAs block rendering or fail cross-origin?",
      "What is the classic History API in SPAs interview trap?"
    ],
    "traps": [
      "Interview trap: describing History API in SPAs from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide history api in spas details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around History API in SPAs."
    ]
  }
})
