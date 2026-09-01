import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "assign / replace / reload",
  "whatIsIt": "assign / replace / reload is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding assign / replace / reload helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide assign / replace / reload details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat assign / replace / reload as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate assign / replace / reload in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect assign / replace / reload to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about assign / replace / reload.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing assign / replace / reload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// assign / replace / reload — minimal browser example\nconsole.log('[b3-location-assign-replace]', typeof document);\n// Open DevTools → verify behavior for: assign / replace / reload\n// Spec reference: developer.mozilla.org (search \"assign / replace / reload\")",
  "exampleCaption": "assign / replace / reload — observe in DevTools while this runs",
  "internals": [
    "assign / replace / reload is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for assign / replace / reload can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether assign / replace / reload succeeds in production."
  ],
  "takeaways": [
    "Locate assign / replace / reload in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect assign / replace / reload to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing assign / replace / reload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "assign / replace / reload is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "assign / replace / reload: Treat assign / replace / reload as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate assign / replace / reload in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect assign / replace / reload to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing assign / replace / reload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "assign / replace / reload",
      "assign / replace / reload is a core Web Platform concept in Window, Document & BOM."
    ],
    [
      "Mental model",
      "Treat assign / replace / reload as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing assign / replace / reload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate assign / replace / reload in B3.2 — Window, Document & BOM: map it to MDN",
      "Connect assign / replace / reload to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is assign / replace / reload in the browser and when do you use it?",
      "answerHint": "assign / replace / reload is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding assign / replace / reload helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain assign / replace / reload with a DevTools observation and one pitfall.",
      "answerHint": "Locate assign / replace / reload in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools. Connect assign / replace / reload to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about assign / replace / reload. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing assign / replace / reload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain assign / replace / reload in a senior frontend interview?",
      "answerHint": "assign / replace / reload is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for assign / replace / reload can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether assign / replace / reload succeeds in production. // assign / replace / reload — minimal browser example\nconsole.log('[b3-location-assign-replace]', typeof document);\n// "
    }
  ],
  "pitfalls": [
    "Interview trap: describing assign / replace / reload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain assign / replace / reload at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "assign / replace / reload is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is assign / replace / reload?",
      "When would assign / replace / reload block rendering or fail cross-origin?",
      "What is the classic assign / replace / reload interview trap?"
    ],
    "traps": [
      "Interview trap: describing assign / replace / reload from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide assign / replace / reload details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around assign / replace / reload."
    ]
  }
})
