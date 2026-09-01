import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "pushState / replaceState",
  "whatIsIt": "pushState / replaceState is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding pushState / replaceState helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide pushstate / replacestate details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat pushState / replaceState as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate pushState / replaceState in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect pushState / replaceState to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about pushstate / replacestate.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing pushState / replaceState from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// pushState / replaceState — minimal browser example\nconsole.log('[b3-pushstate-replacestate]', typeof document);\n// Open DevTools → verify behavior for: pushState / replaceState\n// Spec reference: developer.mozilla.org (search \"pushState / replaceState\")",
  "exampleCaption": "pushState / replaceState — observe in DevTools while this runs",
  "internals": [
    "pushState / replaceState is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for pushstate / replacestate can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether pushstate / replacestate succeeds in production."
  ],
  "takeaways": [
    "Locate pushState / replaceState in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect pushState / replaceState to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing pushState / replaceState from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "pushState / replaceState is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "pushState / replaceState: Treat pushState / replaceState as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate pushState / replaceState in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect pushState / replaceState to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing pushState / replaceState from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "pushState / replaceState",
      "pushState / replaceState is a core Web Platform concept in Window, Document & BOM."
    ],
    [
      "Mental model",
      "Treat pushState / replaceState as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing pushState / replaceState from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate pushState / replaceState in B3.2 — Window, Document & BOM: map it to MDN ",
      "Connect pushState / replaceState to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is pushState / replaceState in the browser and when do you use it?",
      "answerHint": "pushState / replaceState is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding pushState / replaceState helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain pushState / replaceState with a DevTools observation and one pitfall.",
      "answerHint": "Locate pushState / replaceState in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools. Connect pushState / replaceState to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about pushstate / replacestate. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing pushState / replaceState from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain pushState / replaceState in a senior frontend interview?",
      "answerHint": "pushState / replaceState is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for pushstate / replacestate can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether pushstate / replacestate succeeds in production. // pushState / replaceState — minimal browser example\nconsole.log('[b3-pushstate-replacestate]', typeof document);\n// Op"
    }
  ],
  "pitfalls": [
    "Interview trap: describing pushState / replaceState from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain pushState / replaceState at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "pushState / replaceState is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is pushState / replaceState?",
      "When would pushState / replaceState block rendering or fail cross-origin?",
      "What is the classic pushState / replaceState interview trap?"
    ],
    "traps": [
      "Interview trap: describing pushState / replaceState from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide pushstate / replacestate details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around pushState / replaceState."
    ]
  }
})
