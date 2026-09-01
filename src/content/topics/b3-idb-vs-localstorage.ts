import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "IndexedDB vs localStorage",
  "whatIsIt": "IndexedDB vs localStorage is a core Web Platform concept in IndexedDB. It belongs to IndexedDB for structured client-side storage. Understanding IndexedDB vs localStorage helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide indexeddb vs localstorage details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat IndexedDB vs localStorage as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate IndexedDB vs localStorage in B3.17 — IndexedDB: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect IndexedDB vs localStorage to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about indexeddb vs localstorage.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing IndexedDB vs localStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// IndexedDB vs localStorage — minimal browser example\nconsole.log('[b3-idb-vs-localstorage]', typeof document);\n// Open DevTools → verify behavior for: IndexedDB vs localStorage\n// Spec reference: developer.mozilla.org (search \"IndexedDB vs localStorage\")",
  "exampleCaption": "IndexedDB vs localStorage — observe in DevTools while this runs",
  "internals": [
    "IndexedDB vs localStorage is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for indexeddb vs localstorage can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether indexeddb vs localstorage succeeds in production."
  ],
  "takeaways": [
    "Locate IndexedDB vs localStorage in B3.17 — IndexedDB: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect IndexedDB vs localStorage to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing IndexedDB vs localStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "IndexedDB vs localStorage is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "IndexedDB vs localStorage: Treat IndexedDB vs localStorage as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate IndexedDB vs localStorage in B3.17 — IndexedDB: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect IndexedDB vs localStorage to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing IndexedDB vs localStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "IndexedDB vs localStorage",
      "IndexedDB vs localStorage is a core Web Platform concept in IndexedDB."
    ],
    [
      "Mental model",
      "Treat IndexedDB vs localStorage as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing IndexedDB vs localStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate IndexedDB vs localStorage in B3.17 — IndexedDB: map it to MDN reference d",
      "Connect IndexedDB vs localStorage to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is IndexedDB vs localStorage in the browser and when do you use it?",
      "answerHint": "IndexedDB vs localStorage is a core Web Platform concept in IndexedDB. It belongs to IndexedDB for structured client-side storage. Understanding IndexedDB vs localStorage helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain IndexedDB vs localStorage with a DevTools observation and one pitfall.",
      "answerHint": "Locate IndexedDB vs localStorage in B3.17 — IndexedDB: map it to MDN reference docs and observe behavior in DevTools. Connect IndexedDB vs localStorage to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about indexeddb vs localstorage. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing IndexedDB vs localStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain IndexedDB vs localStorage in a senior frontend interview?",
      "answerHint": "IndexedDB vs localStorage is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for indexeddb vs localstorage can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether indexeddb vs localstorage succeeds in production. // IndexedDB vs localStorage — minimal browser example\nconsole.log('[b3-idb-vs-localstorage]', typeof document);\n// Open"
    }
  ],
  "pitfalls": [
    "Interview trap: describing IndexedDB vs localStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain IndexedDB vs localStorage at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "IndexedDB vs localStorage is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is IndexedDB vs localStorage?",
      "When would IndexedDB vs localStorage block rendering or fail cross-origin?",
      "What is the classic IndexedDB vs localStorage interview trap?"
    ],
    "traps": [
      "Interview trap: describing IndexedDB vs localStorage from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide indexeddb vs localstorage details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around IndexedDB vs localStorage."
    ]
  }
})
