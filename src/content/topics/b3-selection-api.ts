import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "Selection API",
  "whatIsIt": "Selection API is a core Web Platform concept in Clipboard, Drag & Drop, Selection. It belongs to Clipboard, drag-and-drop, and selection APIs. Understanding Selection API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide selection api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat Selection API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate Selection API in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Selection API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about selection api.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing Selection API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// Selection API — minimal browser example\nconsole.log('[b3-selection-api]', typeof window);\n// Open DevTools → verify behavior for: Selection API\n// Spec reference: developer.mozilla.org (search \"Selection API\")",
  "exampleCaption": "Selection API — observe in DevTools while this runs",
  "internals": [
    "Selection API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for selection api can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether selection api succeeds in production."
  ],
  "takeaways": [
    "Locate Selection API in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Selection API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing Selection API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "Selection API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "Selection API: Treat Selection API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate Selection API in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect Selection API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing Selection API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "Selection API",
      "Selection API is a core Web Platform concept in Clipboard, Drag & Drop, Selection."
    ],
    [
      "Mental model",
      "Treat Selection API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing Selection API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate Selection API in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN",
      "Connect Selection API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is Selection API in the browser and when do you use it?",
      "answerHint": "Selection API is a core Web Platform concept in Clipboard, Drag & Drop, Selection. It belongs to Clipboard, drag-and-drop, and selection APIs. Understanding Selection API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain Selection API with a DevTools observation and one pitfall.",
      "answerHint": "Locate Selection API in B3.33 — Clipboard, Drag & Drop, Selection: map it to MDN reference docs and observe behavior in DevTools. Connect Selection API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about selection api. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing Selection API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain Selection API in a senior frontend interview?",
      "answerHint": "Selection API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for selection api can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether selection api succeeds in production. // Selection API — minimal browser example\nconsole.log('[b3-selection-api]', typeof window);\n// Open DevTools → verify b"
    }
  ],
  "pitfalls": [
    "Interview trap: describing Selection API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain Selection API at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "Selection API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is Selection API?",
      "When would Selection API block rendering or fail cross-origin?",
      "What is the classic Selection API interview trap?"
    ],
    "traps": [
      "Interview trap: describing Selection API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide selection api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around Selection API."
    ]
  }
})
