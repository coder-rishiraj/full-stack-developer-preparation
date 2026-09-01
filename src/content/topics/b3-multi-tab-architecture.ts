import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Multi-Tab & Multi-Window Architecture",
  "whatIsIt": "Multi-Tab & Multi-Window Architecture is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding Multi-Tab & Multi-Window Architecture helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide multi-tab & multi-window architecture details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Multi-Tab & Multi-Window Architecture as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Multi-Tab & Multi-Window Architecture in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Multi-Tab & Multi-Window Architecture to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about multi-tab & multi-window architecture.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Multi-Tab & Multi-Window Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Multi-Tab & Multi-Window Architecture — minimal browser example\nconsole.log('[b3-multi-tab-architecture]', typeof document);\n// Open DevTools → verify behavior for: Multi-Tab & Multi-Window Architecture\n// Spec reference: developer.mozilla.org (search \"Multi-Tab & Multi-Window Architecture\")",
  "exampleCaption": "Multi-Tab & Multi-Window Architecture — observe in DevTools while this runs",
  "internals": [
    "Multi-Tab & Multi-Window Architecture is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for multi-tab & multi-window architecture can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether multi-tab & multi-window architecture succeeds in production."
  ],
  "takeaways": [
    "Locate Multi-Tab & Multi-Window Architecture in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Multi-Tab & Multi-Window Architecture to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Multi-Tab & Multi-Window Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Multi-Tab & Multi-Window Architecture is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Multi-Tab & Multi-Window Architecture: Treat Multi-Tab & Multi-Window Architecture as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Multi-Tab & Multi-Window Architecture in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Multi-Tab & Multi-Window Architecture to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Multi-Tab & Multi-Window Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Multi-Tab & Multi-Window Architecture",
      "Multi-Tab & Multi-Window Architecture is a core Web Platform concept in Browser Architecture."
    ],
    [
      "Mental model",
      "Treat Multi-Tab & Multi-Window Architecture as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Multi-Tab & Multi-Window Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Multi-Tab & Multi-Window Architecture in B3.1 — Browser Architecture: map",
      "Connect Multi-Tab & Multi-Window Architecture to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Multi-Tab & Multi-Window Architecture in the browser and when do you use it?",
      "answerHint": "Multi-Tab & Multi-Window Architecture is a core Web Platform concept in Browser Architecture. It belongs to browser processes, threads, and navigation lifecycle. Understanding Multi-Tab & Multi-Window Architecture helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Multi-Tab & Multi-Window Architecture with a DevTools observation and one pitfall.",
      "answerHint": "Locate Multi-Tab & Multi-Window Architecture in B3.1 — Browser Architecture: map it to MDN reference docs and observe behavior in DevTools. Connect Multi-Tab & Multi-Window Architecture to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about multi-tab & multi-window architecture. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Multi-Tab & Multi-Window Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Multi-Tab & Multi-Window Architecture in a senior frontend interview?",
      "answerHint": "Multi-Tab & Multi-Window Architecture is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for multi-tab & multi-window architecture can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether multi-tab & multi-window architecture succeeds in production. // Multi-Tab & Multi-Window Architecture — minimal browser example\nconsole.log('[b3-multi-tab-architecture]', typeof doc"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Multi-Tab & Multi-Window Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Multi-Tab & Multi-Window Architecture at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Multi-Tab & Multi-Window Architecture is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Multi-Tab & Multi-Window Architecture?",
      "When would Multi-Tab & Multi-Window Architecture block rendering or fail cross-origin?",
      "What is the classic Multi-Tab & Multi-Window Architecture interview trap?"
    ],
    "traps": [
      "Interview trap: describing Multi-Tab & Multi-Window Architecture from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide multi-tab & multi-window architecture details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Multi-Tab & Multi-Window Architecture."
    ]
  }
})
