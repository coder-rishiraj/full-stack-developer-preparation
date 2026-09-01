import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "display:none vs visibility:hidden",
  "whatIsIt": "display:none vs visibility:hidden is a core Web Platform concept in Critical Rendering Path. It belongs to the critical rendering path from HTML/CSS to pixels. Understanding display:none vs visibility:hidden helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide display:none vs visibility:hidden details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat display:none vs visibility:hidden as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate display:none vs visibility:hidden in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect display:none vs visibility:hidden to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about display:none vs visibility:hidden.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing display:none vs visibility:hidden from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// display:none vs visibility:hidden — minimal browser example\nconsole.log('[b3-display-none-visibility]', typeof document);\n// Open DevTools → verify behavior for: display:none vs visibility:hidden\n// Spec reference: developer.mozilla.org (search \"display:none vs visibility:hidden\")",
  "exampleCaption": "display:none vs visibility:hidden — observe in DevTools while this runs",
  "internals": [
    "display:none vs visibility:hidden is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for display:none vs visibility:hidden can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether display:none vs visibility:hidden succeeds in production."
  ],
  "takeaways": [
    "Locate display:none vs visibility:hidden in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect display:none vs visibility:hidden to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing display:none vs visibility:hidden from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "display:none vs visibility:hidden is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "display:none vs visibility:hidden: Treat display:none vs visibility:hidden as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate display:none vs visibility:hidden in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect display:none vs visibility:hidden to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing display:none vs visibility:hidden from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "display:none vs visibility:hidden",
      "display:none vs visibility:hidden is a core Web Platform concept in Critical Rendering Path."
    ],
    [
      "Mental model",
      "Treat display:none vs visibility:hidden as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing display:none vs visibility:hidden from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate display:none vs visibility:hidden in B3.6 — Critical Rendering Path: map ",
      "Connect display:none vs visibility:hidden to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is display:none vs visibility:hidden in the browser and when do you use it?",
      "answerHint": "display:none vs visibility:hidden is a core Web Platform concept in Critical Rendering Path. It belongs to the critical rendering path from HTML/CSS to pixels. Understanding display:none vs visibility:hidden helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain display:none vs visibility:hidden with a DevTools observation and one pitfall.",
      "answerHint": "Locate display:none vs visibility:hidden in B3.6 — Critical Rendering Path: map it to MDN reference docs and observe behavior in DevTools. Connect display:none vs visibility:hidden to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about display:none vs visibility:hidden. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing display:none vs visibility:hidden from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain display:none vs visibility:hidden in a senior frontend interview?",
      "answerHint": "display:none vs visibility:hidden is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for display:none vs visibility:hidden can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether display:none vs visibility:hidden succeeds in production. // display:none vs visibility:hidden — minimal browser example\nconsole.log('[b3-display-none-visibility]', typeof docume"
    }
  ],
  "pitfalls": [
    "Interview trap: describing display:none vs visibility:hidden from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain display:none vs visibility:hidden at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "display:none vs visibility:hidden is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is display:none vs visibility:hidden?",
      "When would display:none vs visibility:hidden block rendering or fail cross-origin?",
      "What is the classic display:none vs visibility:hidden interview trap?"
    ],
    "traps": [
      "Interview trap: describing display:none vs visibility:hidden from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide display:none vs visibility:hidden details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around display:none vs visibility:hidden."
    ]
  }
})
