import { jsLanguageTopic } from '@/content/js-language-factory'

export const content = jsLanguageTopic({
  "title": "IDBDatabase",
  "whatIsIt": "IDBDatabase is a core Web Platform concept in IndexedDB. It belongs to IndexedDB for structured client-side storage. Understanding IDBDatabase helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews.",
  "whyExists": "Frontend engineers interact with the browser every day, but frameworks hide idbdatabase details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior.",
  "mentalModel": "Treat IDBDatabase as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
  "how": [
    "Locate IDBDatabase in B3.17 — IndexedDB: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect IDBDatabase to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Use DevTools (Elements, Network, Performance, Application) to verify assumptions about idbdatabase.",
    "Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story."
  ],
  "callout": {
    "title": "Watch for",
    "text": "Interview trap: describing IDBDatabase from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "variant": "warning"
  },
  "example": "// IDBDatabase — minimal browser example\nconsole.log('[b3-idb-database]', typeof document);\n// Open DevTools → verify behavior for: IDBDatabase\n// Spec reference: developer.mozilla.org (search \"IDBDatabase\")",
  "exampleCaption": "IDBDatabase — observe in DevTools while this runs",
  "internals": [
    "IDBDatabase is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable.",
    "Main-thread work for idbdatabase can block rendering — profile with Performance panel if users report jank.",
    "Cross-origin and security policies (SOP, CORS, CSP) often determine whether idbdatabase succeeds in production."
  ],
  "takeaways": [
    "Locate IDBDatabase in B3.17 — IndexedDB: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect IDBDatabase to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Interview trap: describing IDBDatabase from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries.",
    "IDBDatabase is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
  ],
  "revision": [
    "IDBDatabase: Treat IDBDatabase as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev).",
    "Locate IDBDatabase in B3.17 — IndexedDB: map it to MDN reference docs and observe behavior in DevTools.",
    "Connect IDBDatabase to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it).",
    "Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible.",
    "Trap: Interview trap: describing IDBDatabase from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "flashcards": [
    [
      "IDBDatabase",
      "IDBDatabase is a core Web Platform concept in IndexedDB."
    ],
    [
      "Mental model",
      "Treat IDBDatabase as part of the browser's contract with your page: the DOM tree, event loop, network stack, storage partitions, and rendering pipeline all cooperate under rules defined by HTML, CSS, and fetch specs (documented on MDN and web.dev)."
    ],
    [
      "Common trap",
      "Interview trap: describing IDBDatabase from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    [
      "Locate IDBDatabase in B3.17 — IndexedDB: map it to MDN reference docs and observ",
      "Connect IDBDatabase to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it)."
    ]
  ],
  "questions": [
    {
      "level": "basic",
      "question": "What is IDBDatabase in the browser and when do you use it?",
      "answerHint": "IDBDatabase is a core Web Platform concept in IndexedDB. It belongs to IndexedDB for structured client-side storage. Understanding IDBDatabase helps you reason about real browser behavior — not just framework abstractions — and is commonly tested in frontend interviews."
    },
    {
      "level": "intermediate",
      "question": "Explain IDBDatabase with a DevTools observation and one pitfall.",
      "answerHint": "Locate IDBDatabase in B3.17 — IndexedDB: map it to MDN reference docs and observe behavior in DevTools. Connect IDBDatabase to adjacent concepts in the same section — draw the data flow (who calls whom, what thread runs it). Reproduce a minimal example in a blank page; avoid framework magic so cause and effect stay visible. Use DevTools (Elements, Network, Performance, Application) to verify assumptions about idbdatabase. Prepare an interview explanation: definition → when it matters → common pitfall → one concrete debugging story. Pitfall: Interview trap: describing IDBDatabase from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    },
    {
      "level": "advanced",
      "question": "How would you explain IDBDatabase in a senior frontend interview?",
      "answerHint": "IDBDatabase is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable. Main-thread work for idbdatabase can block rendering — profile with Performance panel if users report jank. Cross-origin and security policies (SOP, CORS, CSP) often determine whether idbdatabase succeeds in production. // IDBDatabase — minimal browser example\nconsole.log('[b3-idb-database]', typeof document);\n// Open DevTools → verify be"
    }
  ],
  "pitfalls": [
    "Interview trap: describing IDBDatabase from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
  ],
  "interview": {
    "expectations": [
      "Explain IDBDatabase at the Web Platform level, not only via framework APIs.",
      "Name which thread/process and which security policy applies.",
      "IDBDatabase is specified in Web Platform standards; Chromium/WebKit implement with process isolation and site-keyed storage where applicable."
    ],
    "commonQuestions": [
      "What is IDBDatabase?",
      "When would IDBDatabase block rendering or fail cross-origin?",
      "What is the classic IDBDatabase interview trap?"
    ],
    "traps": [
      "Interview trap: describing IDBDatabase from React/Angular mental models only. Interviewers expect platform-level accuracy — thread (main vs worker), origin, and synchronous vs async boundaries."
    ],
    "misconceptions": [
      "Frontend engineers interact with the browser every day, but frameworks hide idbdatabase details. When performance bugs, security issues, or navigation edge cases appear, you need the underlying platform behavior."
    ],
    "strongSignals": [
      "Uses DevTools and MDN to validate behavior around IDBDatabase."
    ]
  }
})
