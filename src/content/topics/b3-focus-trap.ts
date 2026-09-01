import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Focus Trap Pattern",
  "whatIsIt": "Focus Trap Pattern is a core Web Platform concept in Accessibility Tree & Focus. It belongs to accessibility tree, focus, and keyboard navigation in the browser. Understanding Focus Trap Pattern helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide focus trap pattern details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Focus Trap Pattern as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Focus Trap Pattern in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Focus Trap Pattern to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about focus trap pattern.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Focus Trap Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Focus Trap Pattern — minimal browser example\nconsole.log('[b3-focus-trap]', typeof document);\n// Open DevTools → verify behavior for: Focus Trap Pattern\n// Spec reference: developer.mozilla.org (search \"Focus Trap Pattern\")",
  "exampleCaption": "Focus Trap Pattern — observe in DevTools while this runs",
  "internals": [
    "Focus Trap Pattern is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for focus trap pattern can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether focus trap pattern succeeds in production."
  ],
  "takeaways": [
    "Locate Focus Trap Pattern in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Focus Trap Pattern to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Focus Trap Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Focus Trap Pattern is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Focus Trap Pattern: Treat Focus Trap Pattern as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Focus Trap Pattern in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Focus Trap Pattern to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Focus Trap Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Focus Trap Pattern",
      "Focus Trap Pattern is a core Web Platform concept in Accessibility Tree & Focus."
    ],
    [
      "Mental model",
      "Treat Focus Trap Pattern as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Focus Trap Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Focus Trap Pattern in B3.35 — Accessibility Tree & Focus: map it to MDN r",
      "Connect Focus Trap Pattern to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Focus Trap Pattern in the browser and when do you use it?",
      "answerHint": "Focus Trap Pattern is a core Web Platform concept in Accessibility Tree & Focus. It belongs to accessibility tree, focus, and keyboard navigation in the browser. Understanding Focus Trap Pattern helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Focus Trap Pattern with a DevTools observation and one pitfall.",
      "answerHint": "Locate Focus Trap Pattern in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools. Connect Focus Trap Pattern to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about focus trap pattern. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Focus Trap Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Focus Trap Pattern in a senior frontend interview?",
      "answerHint": "Focus Trap Pattern is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for focus trap pattern can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether focus trap pattern succeeds in production. // Focus Trap Pattern — minimal browser example\nconsole.log('[b3-focus-trap]', typeof document);\n// Open DevTools → veri"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Focus Trap Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Focus Trap Pattern at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Focus Trap Pattern is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Focus Trap Pattern?",
      "When would Focus Trap Pattern block rendering or fail cross-origin?",
      "What is the classic Focus Trap Pattern interview trap?"
    ],
    "traps": [
      "Interview trap: describing Focus Trap Pattern from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide focus trap pattern details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Focus Trap Pattern."
    ]
  }
})
