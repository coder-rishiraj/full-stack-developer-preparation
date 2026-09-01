import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "preconnect & dns-prefetch",
  "whatIsIt": "preconnect & dns-prefetch is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding preconnect & dns-prefetch helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide preconnect & dns-prefetch details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat preconnect & dns-prefetch as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate preconnect & dns-prefetch in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect preconnect & dns-prefetch to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about preconnect & dns-prefetch.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing preconnect & dns-prefetch from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// preconnect & dns-prefetch — minimal browser example\nconsole.log('[b3-preconnect]', typeof document);\n// Open DevTools → verify behavior for: preconnect & dns-prefetch\n// Spec reference: developer.mozilla.org (search \"preconnect & dns-prefetch\")",
  "exampleCaption": "preconnect & dns-prefetch — observe in DevTools while this runs",
  "internals": [
    "preconnect & dns-prefetch is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for preconnect & dns-prefetch can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether preconnect & dns-prefetch succeeds in production."
  ],
  "takeaways": [
    "Locate preconnect & dns-prefetch in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect preconnect & dns-prefetch to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing preconnect & dns-prefetch from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "preconnect & dns-prefetch is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "preconnect & dns-prefetch: Treat preconnect & dns-prefetch as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate preconnect & dns-prefetch in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect preconnect & dns-prefetch to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing preconnect & dns-prefetch from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "preconnect & dns-prefetch",
      "preconnect & dns-prefetch is a core Web Platform concept in Resource Loading & Performance."
    ],
    [
      "Mental model",
      "Treat preconnect & dns-prefetch as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing preconnect & dns-prefetch from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate preconnect & dns-prefetch in B3.28 — Resource Loading & Performance: map ",
      "Connect preconnect & dns-prefetch to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is preconnect & dns-prefetch in the browser and when do you use it?",
      "answerHint": "preconnect & dns-prefetch is a core Web Platform concept in Resource Loading & Performance. It belongs to browser performance metrics, Core Web Vitals, and profiling. Understanding preconnect & dns-prefetch helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain preconnect & dns-prefetch with a DevTools observation and one pitfall.",
      "answerHint": "Locate preconnect & dns-prefetch in B3.28 — Resource Loading & Performance: map it to MDN reference docs and observe behavior in DevTools. Connect preconnect & dns-prefetch to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about preconnect & dns-prefetch. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing preconnect & dns-prefetch from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain preconnect & dns-prefetch in a senior frontend interview?",
      "answerHint": "preconnect & dns-prefetch is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for preconnect & dns-prefetch can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether preconnect & dns-prefetch succeeds in production. // preconnect & dns-prefetch — minimal browser example\nconsole.log('[b3-preconnect]', typeof document);\n// Open DevTools"
    }
  ],
  "pitfalls": [
    "Interview trap: describing preconnect & dns-prefetch from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain preconnect & dns-prefetch at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "preconnect & dns-prefetch is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is preconnect & dns-prefetch?",
      "When would preconnect & dns-prefetch block rendering or fail cross-origin?",
      "What is the classic preconnect & dns-prefetch interview trap?"
    ],
    "traps": [
      "Interview trap: describing preconnect & dns-prefetch from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide preconnect & dns-prefetch details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around preconnect & dns-prefetch."
    ]
  }
})
