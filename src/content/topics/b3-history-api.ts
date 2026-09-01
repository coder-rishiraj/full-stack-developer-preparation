import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "History API",
  "whatIsIt": "History API is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding History API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide history api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat History API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate History API in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect History API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about history api.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing History API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// History API — minimal browser example\nconsole.log('[b3-history-api]', typeof window);\n// Open DevTools → verify behavior for: History API\n// Spec reference: developer.mozilla.org (search \"History API\")",
  "exampleCaption": "History API — observe in DevTools while this runs",
  "internals": [
    "History API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for history api can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether history api succeeds in production."
  ],
  "takeaways": [
    "Locate History API in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect History API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing History API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "History API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "History API: Treat History API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate History API in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect History API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing History API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "History API",
      "History API is a core Web Platform concept in Window, Document & BOM."
    ],
    [
      "Mental model",
      "Treat History API as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing History API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate History API in B3.2 — Window, Document & BOM: map it to MDN reference doc",
      "Connect History API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is History API in the browser and when do you use it?",
      "answerHint": "History API is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding History API helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain History API with a DevTools observation and one pitfall.",
      "answerHint": "Locate History API in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools. Connect History API to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about history api. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing History API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain History API in a senior frontend interview?",
      "answerHint": "History API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for history api can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether history api succeeds in production. // History API — minimal browser example\nconsole.log('[b3-history-api]', typeof window);\n// Open DevTools → verify behav"
    }
  ],
  "pitfalls": [
    "Interview trap: describing History API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain History API at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "History API is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is History API?",
      "When would History API block rendering or fail cross-origin?",
      "What is the classic History API interview trap?"
    ],
    "traps": [
      "Interview trap: describing History API from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide history api details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around History API."
    ]
  }
})
