import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "onLine & Connection Info",
  "whatIsIt": "onLine & Connection Info is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding onLine & Connection Info helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide online & connection info details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat onLine & Connection Info as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate onLine & Connection Info in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect onLine & Connection Info to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about online & connection info.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing onLine & Connection Info from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// onLine & Connection Info — minimal browser example\nconsole.log('[b3-navigator-online]', typeof document);\n// Open DevTools → verify behavior for: onLine & Connection Info\n// Spec reference: developer.mozilla.org (search \"onLine & Connection Info\")",
  "exampleCaption": "onLine & Connection Info — observe in DevTools while this runs",
  "internals": [
    "onLine & Connection Info is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for online & connection info can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether online & connection info succeeds in production."
  ],
  "takeaways": [
    "Locate onLine & Connection Info in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect onLine & Connection Info to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing onLine & Connection Info from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "onLine & Connection Info is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "onLine & Connection Info: Treat onLine & Connection Info as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate onLine & Connection Info in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect onLine & Connection Info to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing onLine & Connection Info from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "onLine & Connection Info",
      "onLine & Connection Info is a core Web Platform concept in Window, Document & BOM."
    ],
    [
      "Mental model",
      "Treat onLine & Connection Info as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing onLine & Connection Info from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate onLine & Connection Info in B3.2 — Window, Document & BOM: map it to MDN ",
      "Connect onLine & Connection Info to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is onLine & Connection Info in the browser and when do you use it?",
      "answerHint": "onLine & Connection Info is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding onLine & Connection Info helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain onLine & Connection Info with a DevTools observation and one pitfall.",
      "answerHint": "Locate onLine & Connection Info in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools. Connect onLine & Connection Info to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about online & connection info. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing onLine & Connection Info from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain onLine & Connection Info in a senior frontend interview?",
      "answerHint": "onLine & Connection Info is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for online & connection info can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether online & connection info succeeds in production. // onLine & Connection Info — minimal browser example\nconsole.log('[b3-navigator-online]', typeof document);\n// Open Dev"
    }
  ],
  "pitfalls": [
    "Interview trap: describing onLine & Connection Info from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain onLine & Connection Info at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "onLine & Connection Info is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is onLine & Connection Info?",
      "When would onLine & Connection Info block rendering or fail cross-origin?",
      "What is the classic onLine & Connection Info interview trap?"
    ],
    "traps": [
      "Interview trap: describing onLine & Connection Info from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide online & connection info details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around onLine & Connection Info."
    ]
  }
})
