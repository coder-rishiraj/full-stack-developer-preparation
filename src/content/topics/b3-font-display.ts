import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "font-display",
  "whatIsIt": "font-display is a core Web Platform concept in Critical Rendering Path. It belongs to the critical rendering path from HTML/CSS to pixels. Understanding font-display helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide font-display details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat font-display as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate font-display in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect font-display to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about font-display.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing font-display from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// font-display — minimal browser example\nconsole.log('[b3-font-display]', typeof document);\n// Open DevTools → verify behavior for: font-display\n// Spec reference: developer.mozilla.org (search \"font-display\")",
  "exampleCaption": "font-display — observe in DevTools while this runs",
  "internals": [
    "font-display is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for font-display can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether font-display succeeds in production."
  ],
  "takeaways": [
    "Locate font-display in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect font-display to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing font-display from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "font-display is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "font-display: Treat font-display as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate font-display in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect font-display to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing font-display from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "font-display",
      "font-display is a core Web Platform concept in Critical Rendering Path."
    ],
    [
      "Mental model",
      "Treat font-display as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing font-display from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate font-display in B3.6 — Critical Rendering Path: map it to MDN reference d",
      "Connect font-display to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is font-display in the browser and when do you use it?",
      "answerHint": "font-display is a core Web Platform concept in Critical Rendering Path. It belongs to the critical rendering path from HTML/CSS to pixels. Understanding font-display helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain font-display with a DevTools observation and one pitfall.",
      "answerHint": "Locate font-display in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools. Connect font-display to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about font-display. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing font-display from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain font-display in a senior frontend interview?",
      "answerHint": "font-display is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for font-display can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether font-display succeeds in production. // font-display — minimal browser example\nconsole.log('[b3-font-display]', typeof document);\n// Open DevTools → verify b"
    }
  ],
  "pitfalls": [
    "Interview trap: describing font-display from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain font-display at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "font-display is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is font-display?",
      "When would font-display block rendering or fail cross-origin?",
      "What is the classic font-display interview trap?"
    ],
    "traps": [
      "Interview trap: describing font-display from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide font-display details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around font-display."
    ]
  }
})
