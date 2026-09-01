import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "href / origin / pathname / search / hash",
  "whatIsIt": "href / origin / pathname / search / hash is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding href / origin / pathname / search / hash helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide href / origin / pathname / search / hash details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat href / origin / pathname / search / hash as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate href / origin / pathname / search / hash in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect href / origin / pathname / search / hash to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about href / origin / pathname / search / hash.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing href / origin / pathname / search / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// href / origin / pathname / search / hash — minimal browser example\nconsole.log('[b3-location-properties]', typeof document);\n// Open DevTools → verify behavior for: href / origin / pathname / search / hash\n// Spec reference: developer.mozilla.org (search \"href / origin / pathname / search / hash\")",
  "exampleCaption": "href / origin / pathname / search / hash — observe in DevTools while this runs",
  "internals": [
    "href / origin / pathname / search / hash is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for href / origin / pathname / search / hash can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether href / origin / pathname / search / hash succeeds in production."
  ],
  "takeaways": [
    "Locate href / origin / pathname / search / hash in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect href / origin / pathname / search / hash to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing href / origin / pathname / search / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "href / origin / pathname / search / hash is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "href / origin / pathname / search / hash: Treat href / origin / pathname / search / hash as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate href / origin / pathname / search / hash in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect href / origin / pathname / search / hash to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing href / origin / pathname / search / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "href / origin / pathname / search / hash",
      "href / origin / pathname / search / hash is a core Web Platform concept in Window, Document & BOM."
    ],
    [
      "Mental model",
      "Treat href / origin / pathname / search / hash as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing href / origin / pathname / search / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate href / origin / pathname / search / hash in B3.2 — Window, Document & BOM",
      "Connect href / origin / pathname / search / hash to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is href / origin / pathname / search / hash in the browser and when do you use it?",
      "answerHint": "href / origin / pathname / search / hash is a core Web Platform concept in Window, Document & BOM. It belongs to the browser global environment (window, document, BOM APIs). Understanding href / origin / pathname / search / hash helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain href / origin / pathname / search / hash with a DevTools observation and one pitfall.",
      "answerHint": "Locate href / origin / pathname / search / hash in B3.2 — Window, Document & BOM: map it to MDN reference docs and observe behavior in DevTools. Connect href / origin / pathname / search / hash to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about href / origin / pathname / search / hash. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing href / origin / pathname / search / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain href / origin / pathname / search / hash in a senior frontend interview?",
      "answerHint": "href / origin / pathname / search / hash is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for href / origin / pathname / search / hash can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether href / origin / pathname / search / hash succeeds in production. // href / origin / pathname / search / hash — minimal browser example\nconsole.log('[b3-location-properties]', typeof doc"
    }
  ],
  "pitfalls": [
    "Interview trap: describing href / origin / pathname / search / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain href / origin / pathname / search / hash at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "href / origin / pathname / search / hash is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is href / origin / pathname / search / hash?",
      "When would href / origin / pathname / search / hash block rendering or fail cross-origin?",
      "What is the classic href / origin / pathname / search / hash interview trap?"
    ],
    "traps": [
      "Interview trap: describing href / origin / pathname / search / hash from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide href / origin / pathname / search / hash details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around href / origin / pathname / search / hash."
    ]
  }
})
