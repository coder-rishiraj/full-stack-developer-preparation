import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "ARIA Roles in the Browser",
  "whatIsIt": "ARIA Roles in the Browser is a core Web Platform concept in Accessibility Tree & Focus. It belongs to accessibility tree, focus, and keyboard navigation in the browser. Understanding ARIA Roles in the Browser helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide aria roles in the browser details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat ARIA Roles in the Browser as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate ARIA Roles in the Browser in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect ARIA Roles in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about aria roles in the browser.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing ARIA Roles in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// ARIA Roles in the Browser — minimal browser example\nconsole.log('[b3-a11y-roles]', typeof document);\n// Open DevTools → verify behavior for: ARIA Roles in the Browser\n// Spec reference: developer.mozilla.org (search \"ARIA Roles in the Browser\")",
  "exampleCaption": "ARIA Roles in the Browser — observe in DevTools while this runs",
  "internals": [
    "ARIA Roles in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for aria roles in the browser can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether aria roles in the browser succeeds in production."
  ],
  "takeaways": [
    "Locate ARIA Roles in the Browser in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect ARIA Roles in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing ARIA Roles in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "ARIA Roles in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "ARIA Roles in the Browser: Treat ARIA Roles in the Browser as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate ARIA Roles in the Browser in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect ARIA Roles in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing ARIA Roles in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "ARIA Roles in the Browser",
      "ARIA Roles in the Browser is a core Web Platform concept in Accessibility Tree & Focus."
    ],
    [
      "Mental model",
      "Treat ARIA Roles in the Browser as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing ARIA Roles in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate ARIA Roles in the Browser in B3.35 — Accessibility Tree & Focus: map it t",
      "Connect ARIA Roles in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is ARIA Roles in the Browser in the browser and when do you use it?",
      "answerHint": "ARIA Roles in the Browser is a core Web Platform concept in Accessibility Tree & Focus. It belongs to accessibility tree, focus, and keyboard navigation in the browser. Understanding ARIA Roles in the Browser helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain ARIA Roles in the Browser with a DevTools observation and one pitfall.",
      "answerHint": "Locate ARIA Roles in the Browser in B3.35 — Accessibility Tree & Focus: map it to MDN reference docs and observe behavior in DevTools. Connect ARIA Roles in the Browser to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about aria roles in the browser. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing ARIA Roles in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain ARIA Roles in the Browser in a senior frontend interview?",
      "answerHint": "ARIA Roles in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for aria roles in the browser can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether aria roles in the browser succeeds in production. // ARIA Roles in the Browser — minimal browser example\nconsole.log('[b3-a11y-roles]', typeof document);\n// Open DevTools"
    }
  ],
  "pitfalls": [
    "Interview trap: describing ARIA Roles in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain ARIA Roles in the Browser at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "ARIA Roles in the Browser is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is ARIA Roles in the Browser?",
      "When would ARIA Roles in the Browser block rendering or fail cross-origin?",
      "What is the classic ARIA Roles in the Browser interview trap?"
    ],
    "traps": [
      "Interview trap: describing ARIA Roles in the Browser from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide aria roles in the browser details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around ARIA Roles in the Browser."
    ]
  }
})
