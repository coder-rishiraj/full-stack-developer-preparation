import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Focus Management",
  "whatIsIt": "Focus Management is a core Web Platform concept in Accessibility Tree & Focus. It belongs to accessibility tree, focus, and keyboard navigation in the browser. Understanding Focus Management helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide focus management details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Focus Management as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Focus Management in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Focus Management to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about focus management.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Focus Management from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Focus Management — minimal browser example\nconsole.log('[b3-focus-management]', typeof document);\n// Open DevTools → verify behavior for: Focus Management\n// Spec reference: developer.mozilla.org (search \"Focus Management\")",
  "exampleCaption": "Focus Management — observe in DevTools while this runs",
  "internals": [
    "Focus Management is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for focus management can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether focus management succeeds in production."
  ],
  "takeaways": [
    "Locate Focus Management in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Focus Management to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Focus Management from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Focus Management is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Focus Management: Treat Focus Management as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Focus Management in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Focus Management to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Focus Management from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Focus Management",
      "Focus Management is a core Web Platform concept in Accessibility Tree & Focus."
    ],
    [
      "Mental model",
      "Treat Focus Management as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Focus Management from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Focus Management in B3.35 — Accessibility Tree & Focus: map it to MDN ref",
      "Connect Focus Management to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Focus Management in the browser and when do you use it?",
      "answerHint": "Focus Management is a core Web Platform concept in Accessibility Tree & Focus. It belongs to accessibility tree, focus, and keyboard navigation in the browser. Understanding Focus Management helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Focus Management with a DevTools observation and one pitfall.",
      "answerHint": "Locate Focus Management in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools. Connect Focus Management to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about focus management. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Focus Management from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Focus Management in a senior frontend interview?",
      "answerHint": "Focus Management is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for focus management can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether focus management succeeds in production. // Focus Management — minimal browser example\nconsole.log('[b3-focus-management]', typeof document);\n// Open DevTools → "
    }
  ],
  "pitfalls": [
    "Interview trap: describing Focus Management from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Focus Management at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Focus Management is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Focus Management?",
      "When would Focus Management block rendering or fail cross-origin?",
      "What is the classic Focus Management interview trap?"
    ],
    "traps": [
      "Interview trap: describing Focus Management from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide focus management details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Focus Management."
    ]
  }
})
