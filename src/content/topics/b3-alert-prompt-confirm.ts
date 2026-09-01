import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "alert / prompt / confirm",
  "whatIsIt": "alert / prompt / confirm is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding alert / prompt / confirm helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide alert / prompt / confirm details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat alert / prompt / confirm as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate alert / prompt / confirm in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect alert / prompt / confirm to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about alert / prompt / confirm.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing alert / prompt / confirm from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// alert / prompt / confirm — minimal browser example\nconsole.log('[b3-alert-prompt-confirm]', typeof document);\n// Open DevTools → verify behavior for: alert / prompt / confirm\n// Spec reference: developer.mozilla.org (search \"alert / prompt / confirm\")",
  "exampleCaption": "alert / prompt / confirm — observe in DevTools while this runs",
  "internals": [
    "alert / prompt / confirm is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for alert / prompt / confirm can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether alert / prompt / confirm succeeds in production."
  ],
  "takeaways": [
    "Locate alert / prompt / confirm in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect alert / prompt / confirm to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing alert / prompt / confirm from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "alert / prompt / confirm is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "alert / prompt / confirm: Treat alert / prompt / confirm as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate alert / prompt / confirm in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect alert / prompt / confirm to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing alert / prompt / confirm from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "alert / prompt / confirm",
      "alert / prompt / confirm is a core Web Platform concept in Window, Document & BOM."
    ],
    [
      "Mental model",
      "Treat alert / prompt / confirm as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing alert / prompt / confirm from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate alert / prompt / confirm in B3.2 — Window, Document & BOM: map it to MDN ",
      "Connect alert / prompt / confirm to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is alert / prompt / confirm in the browser and when do you use it?",
      "answerHint": "alert / prompt / confirm is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding alert / prompt / confirm helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain alert / prompt / confirm with a DevTools observation and one pitfall.",
      "answerHint": "Locate alert / prompt / confirm in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools. Connect alert / prompt / confirm to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about alert / prompt / confirm. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing alert / prompt / confirm from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain alert / prompt / confirm in a senior frontend interview?",
      "answerHint": "alert / prompt / confirm is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for alert / prompt / confirm can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether alert / prompt / confirm succeeds in production. // alert / prompt / confirm — minimal browser example\nconsole.log('[b3-alert-prompt-confirm]', typeof document);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing alert / prompt / confirm from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain alert / prompt / confirm at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "alert / prompt / confirm is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is alert / prompt / confirm?",
      "When would alert / prompt / confirm block rendering or fail cross-origin?",
      "What is the classic alert / prompt / confirm interview trap?"
    ],
    "traps": [
      "Interview trap: describing alert / prompt / confirm from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide alert / prompt / confirm details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around alert / prompt / confirm."
    ]
  }
})
